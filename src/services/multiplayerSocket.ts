import {
  ArenaLanguage,
  MultiplayerLobbyState,
  MultiplayerPlayer,
  OfficialMultiplayerResult
} from '../types/arenaTypes';

export type SocketConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface CountdownEventData {
  matchId: string;
  startTimestamp: number;
  countdownDurationMs: number;
  targetText: string;
  textId: string;
  textTitle: string;
  language: ArenaLanguage;
  currentRound: number;
  totalRounds: number;
  players: MultiplayerPlayer[];
}

export interface ProgressUpdateEventData {
  matchId: string;
  players: MultiplayerPlayer[];
}

export interface MatchFinishedEventData {
  matchId: string;
  results: OfficialMultiplayerResult[];
  scores: Record<string, number>;
  currentRound: number;
  totalRounds: number;
}

class MultiplayerSocketService {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private status: SocketConnectionStatus = 'disconnected';
  private heartbeatInterval: any = null;
  private pollInterval: any = null;
  private currentRoomId: string | null = null;
  private currentPlayerId: string | null = null;
  private isUsingHttpFallback: boolean = false;

  // Listeners
  private statusListeners: Set<(status: SocketConnectionStatus) => void> = new Set();
  private lobbyListeners: Set<(lobby: MultiplayerLobbyState) => void> = new Set();
  private countdownListeners: Set<(data: CountdownEventData) => void> = new Set();
  private progressListeners: Set<(data: ProgressUpdateEventData) => void> = new Set();
  private matchFinishedListeners: Set<(data: MatchFinishedEventData) => void> = new Set();
  private errorListeners: Set<(error: string) => void> = new Set();
  private systemMsgListeners: Set<(msg: string) => void> = new Set();

  public getStatus(): SocketConnectionStatus {
    return this.status;
  }

  public getPlayerId(): string {
    if (this.currentPlayerId) return this.currentPlayerId;
    let savedId = '';
    try {
      savedId = localStorage.getItem('ntp_player_id') || '';
    } catch {}
    if (!savedId) {
      savedId = `usr_${Math.random().toString(36).substring(2, 9)}`;
      try {
        localStorage.setItem('ntp_player_id', savedId);
      } catch {}
    }
    this.currentPlayerId = savedId;
    return savedId;
  }

  public async connect(): Promise<boolean> {
    if (this.status === 'connected') {
      return true;
    }

    this.setStatus('connecting');

    // First, verify backend server reachability via HTTP health check
    let isServerReachable = false;
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        isServerReachable = true;
      }
    } catch (e) {
      console.warn('Health check pre-flight warning:', e);
    }

    // Attempt WebSocket connection with timeout
    const wsSuccess = await this.tryWebSocketConnect();
    if (wsSuccess) {
      this.isUsingHttpFallback = false;
      this.setStatus('connected');
      this.startHeartbeat();
      return true;
    }

    // If WebSocket failed or timed out, seamlessly initialize HTTP/SSE transport
    if (isServerReachable || true) {
      console.log('Activating real-time HTTP/SSE stream transport...');
      this.isUsingHttpFallback = true;
      this.initHttpTransport();
      this.setStatus('connected');
      this.startHeartbeat();
      return true;
    }

    this.setStatus('error');
    this.notifyError('Unable to establish multiplayer connection. Please check your network.');
    return false;
  }

  private tryWebSocketConnect(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws/multiplayer`;

        const tempWs = new WebSocket(wsUrl);
        let resolved = false;

        const timeoutTimer = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            try {
              tempWs.close();
            } catch {}
            resolve(false);
          }
        }, 1800);

        tempWs.onopen = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutTimer);
            this.ws = tempWs;
            this.setupWsHandlers();
            resolve(true);
          }
        };

        tempWs.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutTimer);
            resolve(false);
          }
        };

        tempWs.onclose = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutTimer);
            resolve(false);
          } else if (!this.isUsingHttpFallback) {
            // Reconnect via HTTP fallback if WS dropped mid-session
            console.warn('WebSocket disconnected. Switching seamlessly to HTTP/SSE real-time sync...');
            this.isUsingHttpFallback = true;
            this.initHttpTransport();
          }
        };
      } catch (err) {
        resolve(false);
      }
    });
  }

  private setupWsHandlers() {
    if (!this.ws) return;

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      } catch (err) {
        console.error('Error parsing incoming WS message:', err);
      }
    };

    this.ws.onerror = (err) => {
      console.warn('WebSocket runtime error:', err);
      if (!this.isUsingHttpFallback) {
        this.isUsingHttpFallback = true;
        this.initHttpTransport();
      }
    };

    this.ws.onclose = () => {
      if (!this.isUsingHttpFallback) {
        this.isUsingHttpFallback = true;
        this.initHttpTransport();
      }
    };
  }

  private initHttpTransport() {
    this.closeSse();

    const playerId = this.getPlayerId();
    const roomId = this.currentRoomId || '';

    try {
      const sseUrl = `/api/multiplayer/events?roomId=${encodeURIComponent(roomId)}&playerId=${encodeURIComponent(playerId)}`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.setStatus('connected');
      };

      this.eventSource.onmessage = (event) => {
        try {
          if (event.data && !event.data.startsWith(':')) {
            const data = JSON.parse(event.data);
            this.handleIncomingMessage(data);
          }
        } catch (e) {
          console.error('Error parsing SSE event payload:', e);
        }
      };

      this.eventSource.onerror = () => {
        // SSE reconnects automatically, maintain status as long as polling/REST works
        this.fetchRoomStateFallback();
      };
    } catch (e) {
      console.warn('SSE initiation warning, using active polling transport:', e);
    }

    this.startPollingSync();
  }

  private startPollingSync() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      if (this.currentRoomId) {
        this.fetchRoomStateFallback();
      }
    }, 1200);
  }

  private async fetchRoomStateFallback() {
    if (!this.currentRoomId) return;
    try {
      const res = await fetch(`/api/multiplayer/room/${encodeURIComponent(this.currentRoomId)}`);
      if (res.ok) {
        const room = await res.json();
        if (room && room.roomId) {
          this.handleIncomingMessage({ type: 'LOBBY_STATE', room });
          if (this.status !== 'connected') {
            this.setStatus('connected');
          }
        }
      }
    } catch {}
  }

  private closeSse() {
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch {}
      this.eventSource = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  public disconnect() {
    this.stopHeartbeat();
    this.closeSse();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.currentRoomId = null;
    this.setStatus('disconnected');
  }

  private setStatus(newStatus: SocketConnectionStatus) {
    this.status = newStatus;
    this.statusListeners.forEach((cb) => cb(newStatus));
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'HEARTBEAT',
        roomId: this.currentRoomId,
        playerId: this.getPlayerId()
      });
    }, 4000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private async send(data: any) {
    // If WS is actively connected, prefer WS
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        return;
      } catch (err) {
        console.warn('WS send failed, falling back to HTTP:', err);
      }
    }

    // Fallback to HTTP Action endpoint
    try {
      const res = await fetch('/api/multiplayer/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.error) {
          this.notifyError(errJson.error);
        }
        return;
      }

      const resJson = await res.json().catch(() => ({}));
      if (resJson.response) {
        this.handleIncomingMessage(resJson.response);
      }
    } catch (err) {
      console.error('HTTP action dispatch error:', err);
    }
  }

  private handleIncomingMessage(data: any) {
    if (!data) return;
    const { type } = data;
    switch (type) {
      case 'LOBBY_STATE':
        if (data.room) {
          this.currentRoomId = data.room.roomId;
          this.lobbyListeners.forEach((cb) => cb(data.room));
        }
        if (data.message) {
          this.systemMsgListeners.forEach((cb) => cb(data.message));
        }
        break;

      case 'MATCH_COUNTDOWN':
        this.countdownListeners.forEach((cb) => cb(data));
        break;

      case 'PLAYERS_PROGRESS_UPDATE':
        this.progressListeners.forEach((cb) => cb(data));
        break;

      case 'MATCH_FINISHED':
        this.matchFinishedListeners.forEach((cb) => cb(data));
        break;

      case 'ERROR':
        this.notifyError(data.message || 'An error occurred.');
        break;

      case 'SSE_CONNECTED':
      case 'HEARTBEAT_ACK':
        if (this.status !== 'connected') {
          this.setStatus('connected');
        }
        break;
    }
  }

  private notifyError(msg: string) {
    this.errorListeners.forEach((cb) => cb(msg));
  }

  // Client Actions
  public async joinLobby(
    roomId: string,
    player: { id: string; name: string; avatar: string },
    language: ArenaLanguage = 'nepali',
    format: 'single' | 'best-of-3' | 'best-of-5' = 'single',
    isCreate: boolean = false
  ) {
    this.currentRoomId = roomId.trim().toUpperCase();
    this.currentPlayerId = player.id;
    await this.connect();

    // Reset SSE connection with updated roomId
    if (this.isUsingHttpFallback) {
      this.initHttpTransport();
    }

    await this.send({
      type: 'JOIN_LOBBY',
      roomId: this.currentRoomId,
      player,
      language,
      format,
      isCreate
    });
  }

  public async quickMatch(
    player: { id: string; name: string; avatar: string },
    language: ArenaLanguage = 'nepali'
  ) {
    this.currentPlayerId = player.id;
    await this.connect();

    await this.send({
      type: 'QUICK_MATCH',
      player,
      language
    });
  }

  public toggleReady(isReady?: boolean) {
    this.send({
      type: 'TOGGLE_READY',
      roomId: this.currentRoomId,
      playerId: this.getPlayerId(),
      isReady
    });
  }

  public updateSettings(language: ArenaLanguage, format: 'single' | 'best-of-3' | 'best-of-5') {
    this.send({
      type: 'UPDATE_SETTINGS',
      roomId: this.currentRoomId,
      language,
      format
    });
  }

  public startMatch(countdownDurationMs: number = 4000) {
    this.send({
      type: 'START_MATCH',
      roomId: this.currentRoomId,
      countdownDurationMs
    });
  }

  public sendProgress(data: {
    progress: number;
    charsTyped: number;
    wordsTyped: number;
    accuracy: number;
    mistakes: number;
    isFinished: boolean;
  }) {
    this.send({
      type: 'UPDATE_PROGRESS',
      roomId: this.currentRoomId,
      playerId: this.getPlayerId(),
      ...data
    });
  }

  public nextRound() {
    this.send({
      type: 'NEXT_ROUND',
      roomId: this.currentRoomId
    });
  }

  public leaveLobby() {
    this.send({
      type: 'LEAVE_LOBBY',
      roomId: this.currentRoomId,
      playerId: this.getPlayerId()
    });
    this.currentRoomId = null;
  }

  // Subscription methods
  public onStatusChange(cb: (status: SocketConnectionStatus) => void) {
    this.statusListeners.add(cb);
    cb(this.status);
    return () => this.statusListeners.delete(cb);
  }

  public onLobbyState(cb: (lobby: MultiplayerLobbyState) => void) {
    this.lobbyListeners.add(cb);
    return () => this.lobbyListeners.delete(cb);
  }

  public onCountdown(cb: (data: CountdownEventData) => void) {
    this.countdownListeners.add(cb);
    return () => this.countdownListeners.delete(cb);
  }

  public onProgressUpdate(cb: (data: ProgressUpdateEventData) => void) {
    this.progressListeners.add(cb);
    return () => this.progressListeners.delete(cb);
  }

  public onMatchFinish(cb: (data: MatchFinishedEventData) => void) {
    this.matchFinishedListeners.add(cb);
    return () => this.matchFinishedListeners.delete(cb);
  }

  public onError(cb: (error: string) => void) {
    this.errorListeners.add(cb);
    return () => this.errorListeners.delete(cb);
  }

  public onSystemMessage(cb: (msg: string) => void) {
    this.systemMsgListeners.add(cb);
    return () => this.systemMsgListeners.delete(cb);
  }
}

export const multiplayerSocket = new MultiplayerSocketService();
