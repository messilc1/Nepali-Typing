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
  private status: SocketConnectionStatus = 'disconnected';
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentRoomId: string | null = null;
  private currentPlayerId: string | null = null;

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

  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        resolve(this.ws.readyState === WebSocket.OPEN);
        return;
      }

      this.setStatus('connecting');

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/multiplayer`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.setStatus('connected');
          this.startHeartbeat();
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleIncomingMessage(data);
          } catch (err) {
            console.error('Error parsing incoming WS message:', err);
          }
        };

        this.ws.onerror = (err) => {
          console.error('WebSocket connection error:', err);
          this.setStatus('error');
          this.notifyError('Unable to establish multiplayer connection. Please check your network.');
          resolve(false);
        };

        this.ws.onclose = () => {
          this.setStatus('disconnected');
          this.stopHeartbeat();
        };
      } catch (e) {
        this.setStatus('error');
        this.notifyError('Failed to initialize WebSocket connection.');
        resolve(false);
      }
    });
  }

  public disconnect() {
    this.stopHeartbeat();
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
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: 'HEARTBEAT',
          roomId: this.currentRoomId,
          playerId: this.getPlayerId()
        });
      }
    }, 4000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private send(data: object) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private handleIncomingMessage(data: any) {
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

      case 'HEARTBEAT_ACK':
        // Connection alive
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
    await this.connect();
    this.currentRoomId = roomId.trim().toUpperCase();
    this.currentPlayerId = player.id;
    this.send({
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
    await this.connect();
    this.currentPlayerId = player.id;
    this.send({
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
      roomId: this.currentRoomId
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
