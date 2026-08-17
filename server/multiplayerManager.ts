import type { WebSocket } from 'ws';

export type MultiplayerLanguage = 'nepali' | 'english';
export type MatchFormat = 'single' | 'best-of-3' | 'best-of-5';
export type RoomStatus = 'lobby' | 'countdown' | 'in_progress' | 'finished';

export interface ServerPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  connected: boolean;
  lastHeartbeat: number;
  progress: number; // 0 - 100
  wpm: number;
  netWpm: number;
  accuracy: number;
  mistakes: number;
  charsTyped: number;
  wordsTyped: number;
  finished: boolean;
  finishTimeMs: number | null;
  rank: number | null;
}

export interface OfficialRaceResult {
  playerId: string;
  name: string;
  avatar: string;
  rank: number;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  mistakes: number;
  finishTimeSeconds: number;
  isWinner: boolean;
}

export interface ServerRoom {
  roomId: string;
  matchId: string;
  language: MultiplayerLanguage;
  format: MatchFormat;
  status: RoomStatus;
  targetText: string;
  textId: string;
  textTitle: string;
  currentRound: number;
  totalRounds: number;
  scores: Record<string, number>; // playerId -> score
  countdownDurationMs: number;
  startTimestamp: number | null; // Epoch ms when typing starts
  players: Map<string, ServerPlayer>;
  connections: Map<string, WebSocket>;
  eventListeners: Map<string, (event: any) => void>;
  results: OfficialRaceResult[];
  isPublicMatchmaking?: boolean;
}

// Curated authoritative text pool with unique IDs for matches
export const AUTHORITATIVE_TEXTS: Record<MultiplayerLanguage, { id: string; title: string; text: string }[]> = {
  nepali: [
    {
      id: 'NEP-LEGAL-01',
      title: 'नेपालको संविधान र नागरिक अधिकार',
      text: 'nepal ko samvidhan ma pratyek nagarik ko maulik hak ra kartabya ko byawastha gariyeko chha.'
    },
    {
      id: 'NEP-HERITAGE-02',
      title: 'हिमालय र सांस्कृतिक सम्पदा',
      text: 'namaste nepal, sundar himal ra hariyo tarai ko hamro pyaro desh ma tapai lai swagat chha.'
    },
    {
      id: 'NEP-TECH-03',
      title: 'डिजिटल नेपाल र आधुनिक प्रविधि',
      text: 'aadhunik sansar ma computer ra internet ko prayog bina kunai pani kshetra aadhunik banna sakdaina.'
    },
    {
      id: 'NEP-EDUCATION-04',
      title: 'शिक्षा र राष्ट्र निर्माण',
      text: 'shiksha nai manav jiban ko sabai bhanda mulyavan dhan ho jasle ujyalo bhavishya nirman garchha.'
    },
    {
      id: 'NEP-HARDWORK-05',
      title: 'परिश्रम र संकल्प',
      text: 'parishram ra mehanat le asambhav lai pani sambhav banaucha ra unnati ko marga kholcha.'
    },
    {
      id: 'NEP-DEMOCRACY-06',
      title: 'लोकतन्त्र र कानुनी राज्य',
      text: 'loktantrik paddhati ma janta ko aawaj nai sarvochha shakti ho ra kanun ko rajya sthapit hunchha.'
    }
  ],
  english: [
    {
      id: 'ENG-VELOCITY-01',
      title: 'Kinetic Touch-Typing Velocity',
      text: 'The quick brown fox jumps over the lazy dog while racing towards the ultimate championship finish line.'
    },
    {
      id: 'ENG-PRECISION-02',
      title: 'Digital Workspace Mastery',
      text: 'Typing speed combined with strict accuracy produces unparalleled productivity in the modern digital workspace.'
    },
    {
      id: 'ENG-POSTURE-03',
      title: 'Ergonomic Typing Flow',
      text: 'Maintain a calm posture, keep your wrists elevated, and allow natural rhythmic cadence to guide your fingers.'
    },
    {
      id: 'ENG-HOMEROW-04',
      title: 'Home Row Fundamentals',
      text: 'Mastering the home row keys provides the foundational anchor for effortless full keyboard speed and control.'
    },
    {
      id: 'ENG-FOCUS-05',
      title: 'Championship Focus & Reflexes',
      text: 'Continuous focus and lightning fast reaction times enable competitive racers to surge ahead of any rival typist.'
    },
    {
      id: 'ENG-CHRONOS-06',
      title: 'The Grand Typist Challenge',
      text: 'Transcending the boundaries of mortal speed, true champions achieve complete harmony between eyes and keys.'
    }
  ]
};

export class MultiplayerRoomManager {
  private rooms: Map<string, ServerRoom> = new Map();

  // Create or retrieve room
  public createRoom(
    roomId: string,
    hostPlayer: { id: string; name: string; avatar: string },
    language: MultiplayerLanguage = 'nepali',
    format: MatchFormat = 'single',
    isPublic: boolean = false
  ): ServerRoom {
    const cleanRoomId = roomId.trim().toUpperCase();
    const matchId = `MATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const textObj = this.getRandomText(language);

    const room: ServerRoom = {
      roomId: cleanRoomId,
      matchId,
      language,
      format,
      status: 'lobby',
      targetText: textObj.text,
      textId: textObj.id,
      textTitle: textObj.title,
      currentRound: 1,
      totalRounds: format === 'best-of-5' ? 5 : format === 'best-of-3' ? 3 : 1,
      scores: { [hostPlayer.id]: 0 },
      countdownDurationMs: 4000,
      startTimestamp: null,
      players: new Map(),
      connections: new Map(),
      eventListeners: new Map(),
      results: [],
      isPublicMatchmaking: isPublic
    };

    const hostServerPlayer: ServerPlayer = {
      id: hostPlayer.id,
      name: hostPlayer.name || 'Host Typist',
      avatar: hostPlayer.avatar || '🏎️',
      isHost: true,
      isReady: true,
      connected: true,
      lastHeartbeat: Date.now(),
      progress: 0,
      wpm: 0,
      netWpm: 0,
      accuracy: 100,
      mistakes: 0,
      charsTyped: 0,
      wordsTyped: 0,
      finished: false,
      finishTimeMs: null,
      rank: null
    };

    room.players.set(hostPlayer.id, hostServerPlayer);
    this.rooms.set(cleanRoomId, room);
    return room;
  }

  public getRoom(roomId: string): ServerRoom | undefined {
    return this.rooms.get(roomId.trim().toUpperCase());
  }

  public findPublicMatchmakingRoom(
    language: MultiplayerLanguage,
    excludingPlayerId: string
  ): ServerRoom | null {
    for (const room of this.rooms.values()) {
      if (
        room.isPublicMatchmaking &&
        room.status === 'lobby' &&
        room.language === language &&
        room.players.size < 4 &&
        !room.players.has(excludingPlayerId)
      ) {
        return room;
      }
    }
    return null;
  }

  public addPlayerToRoom(
    roomId: string,
    player: { id: string; name: string; avatar: string },
    ws?: WebSocket
  ): ServerRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    let serverPlayer = room.players.get(player.id);
    if (!serverPlayer) {
      serverPlayer = {
        id: player.id,
        name: player.name || `Racer ${room.players.size + 1}`,
        avatar: player.avatar || '🏎️',
        isHost: room.players.size === 0,
        isReady: room.players.size === 0, // Host is ready by default
        connected: true,
        lastHeartbeat: Date.now(),
        progress: 0,
        wpm: 0,
        netWpm: 0,
        accuracy: 100,
        mistakes: 0,
        charsTyped: 0,
        wordsTyped: 0,
        finished: false,
        finishTimeMs: null,
        rank: null
      };
      room.players.set(player.id, serverPlayer);
      if (!(player.id in room.scores)) {
        room.scores[player.id] = 0;
      }
    } else {
      // Reconnection
      serverPlayer.connected = true;
      serverPlayer.lastHeartbeat = Date.now();
      serverPlayer.name = player.name || serverPlayer.name;
      serverPlayer.avatar = player.avatar || serverPlayer.avatar;
    }

    if (ws) {
      room.connections.set(player.id, ws);
    }
    return room;
  }

  public addSseListener(
    roomId: string,
    playerId: string,
    callback: (event: any) => void
  ) {
    const room = this.getRoom(roomId);
    if (!room) return;
    room.eventListeners.set(playerId, callback);
    const player = room.players.get(playerId);
    if (player) {
      player.connected = true;
      player.lastHeartbeat = Date.now();
    }
  }

  public removeSseListener(roomId: string, playerId: string) {
    const room = this.getRoom(roomId);
    if (!room) return;
    room.eventListeners.delete(playerId);
  }

  public removeConnection(ws: WebSocket): { room: ServerRoom; playerId: string } | null {
    for (const room of this.rooms.values()) {
      for (const [playerId, conn] of room.connections.entries()) {
        if (conn === ws) {
          const player = room.players.get(playerId);
          if (player) {
            player.connected = false;
            player.lastHeartbeat = Date.now();
          }
          room.connections.delete(playerId);

          // If all players disconnected for > 15 minutes, cleanup
          const hasAnyConnected = Array.from(room.players.values()).some((p) => p.connected);
          if (!hasAnyConnected) {
            setTimeout(() => {
              const currentRoom = this.getRoom(room.roomId);
              if (currentRoom) {
                const stillAnyConnected = Array.from(currentRoom.players.values()).some((p) => p.connected);
                if (!stillAnyConnected) {
                  this.rooms.delete(room.roomId);
                }
              }
            }, 60000);
          }

          return { room, playerId };
        }
      }
    }
    return null;
  }

  public toggleReady(roomId: string, playerId: string, isReady?: boolean): ServerRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;
    const player = room.players.get(playerId);
    if (!player) return null;

    player.isReady = isReady !== undefined ? isReady : !player.isReady;
    return room;
  }

  public updateRoomSettings(
    roomId: string,
    language: MultiplayerLanguage,
    format: MatchFormat
  ): ServerRoom | null {
    const room = this.getRoom(roomId);
    if (!room || room.status !== 'lobby') return null;

    room.language = language;
    room.format = format;
    room.totalRounds = format === 'best-of-5' ? 5 : format === 'best-of-3' ? 3 : 1;

    const newText = this.getRandomText(language);
    room.targetText = newText.text;
    room.textId = newText.id;
    room.textTitle = newText.title;

    return room;
  }

  public startCountdown(roomId: string, countdownDurationMs: number = 4000): ServerRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    // Pick new text for the round if needed
    const textObj = this.getRandomText(room.language);
    room.targetText = textObj.text;
    room.textId = textObj.id;
    room.textTitle = textObj.title;

    room.matchId = `MATCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    room.countdownDurationMs = countdownDurationMs;
    room.startTimestamp = Date.now() + countdownDurationMs;
    room.status = 'countdown';
    room.results = [];

    // Reset all players race progress for this match
    for (const player of room.players.values()) {
      player.progress = 0;
      player.wpm = 0;
      player.netWpm = 0;
      player.accuracy = 100;
      player.mistakes = 0;
      player.charsTyped = 0;
      player.wordsTyped = 0;
      player.finished = false;
      player.finishTimeMs = null;
      player.rank = null;
    }

    return room;
  }

  public updatePlayerProgress(
    roomId: string,
    playerId: string,
    payload: {
      progress: number;
      charsTyped: number;
      wordsTyped: number;
      accuracy: number;
      mistakes: number;
      isFinished: boolean;
    }
  ): { room: ServerRoom; isFirstFinished: boolean; allFinished: boolean } | null {
    const room = this.getRoom(roomId);
    if (!room || !room.startTimestamp) return null;

    const player = room.players.get(playerId);
    if (!player) return null;

    const now = Date.now();
    const elapsedSec = Math.max(0.5, (now - room.startTimestamp) / 1000);
    const elapsedMin = elapsedSec / 60;

    // Server-authoritative WPM calculations
    const grossWpm = elapsedMin > 0 ? (payload.charsTyped / 5) / elapsedMin : 0;
    const netWpm = Math.max(0, grossWpm - (payload.mistakes / elapsedMin));

    player.progress = Math.min(100, Math.max(0, payload.progress));
    player.charsTyped = payload.charsTyped;
    player.wordsTyped = payload.wordsTyped;
    player.accuracy = Math.min(100, Math.max(0, payload.accuracy));
    player.mistakes = payload.mistakes;
    player.wpm = Math.round(grossWpm);
    player.netWpm = Math.round(netWpm);
    player.lastHeartbeat = now;

    let isFirstFinished = false;

    if (payload.isFinished || player.progress >= 100) {
      if (!player.finished) {
        player.finished = true;
        player.progress = 100;
        player.finishTimeMs = now - room.startTimestamp;

        // Determine finish rank
        const finishedCount = Array.from(room.players.values()).filter((p) => p.finished).length;
        player.rank = finishedCount;

        if (finishedCount === 1) {
          isFirstFinished = true;
          // Award round score
          room.scores[playerId] = (room.scores[playerId] || 0) + 1;
        }

        // Add to official results
        room.results.push({
          playerId: player.id,
          name: player.name,
          avatar: player.avatar,
          rank: player.rank,
          netWpm: player.netWpm,
          grossWpm: player.wpm,
          accuracy: Number(player.accuracy.toFixed(1)),
          mistakes: player.mistakes,
          finishTimeSeconds: Number((player.finishTimeMs / 1000).toFixed(2)),
          isWinner: player.rank === 1
        });
      }
    }

    const connectedPlayers = Array.from(room.players.values()).filter((p) => p.connected);
    const allFinished = connectedPlayers.length > 0 && connectedPlayers.every((p) => p.finished);

    if (allFinished) {
      room.status = 'finished';
    }

    return { room, isFirstFinished, allFinished };
  }

  public prepareNextRound(roomId: string): ServerRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    room.currentRound += 1;
    room.status = 'lobby';
    room.results = [];
    room.startTimestamp = null;

    for (const player of room.players.values()) {
      player.isReady = player.isHost;
      player.progress = 0;
      player.finished = false;
      player.finishTimeMs = null;
      player.rank = null;
    }

    return room;
  }

  public serializeLobby(room: ServerRoom) {
    return {
      roomId: room.roomId,
      matchId: room.matchId,
      language: room.language,
      format: room.format,
      status: room.status,
      targetText: room.targetText,
      textId: room.textId,
      textTitle: room.textTitle,
      currentRound: room.currentRound,
      totalRounds: room.totalRounds,
      scores: room.scores,
      countdownDurationMs: room.countdownDurationMs,
      startTimestamp: room.startTimestamp,
      players: Array.from(room.players.values()),
      results: room.results
    };
  }

  public broadcastToRoom(room: ServerRoom, message: object) {
    const serialized = JSON.stringify(message);
    
    // Broadcast via WebSockets
    for (const [playerId, conn] of room.connections.entries()) {
      if (conn.readyState === 1 /* OPEN */) {
        try {
          conn.send(serialized);
        } catch (err) {
          console.error(`Failed to send to WS player ${playerId}:`, err);
        }
      }
    }

    // Broadcast via SSE / Event Listeners
    for (const [playerId, callback] of room.eventListeners.entries()) {
      try {
        callback(message);
      } catch (err) {
        console.error(`Failed to dispatch event to SSE listener ${playerId}:`, err);
      }
    }
  }

  public processAction(data: any, ws?: WebSocket): { success: boolean; response?: any; error?: string } {
    try {
      const { type } = data;

      switch (type) {
        case 'JOIN_LOBBY': {
          const { roomId, player, language, format, isCreate } = data;
          if (!roomId || !player?.id) {
            return { success: false, error: 'Missing roomId or player information.' };
          }

          const currentRoomId = roomId.trim().toUpperCase();
          let room = this.getRoom(currentRoomId);
          if (!room) {
            if (isCreate) {
              room = this.createRoom(
                currentRoomId,
                player,
                language || 'nepali',
                format || 'single',
                false
              );
            } else {
              return {
                success: false,
                error: `Room "${currentRoomId}" not found. Please verify the code.`
              };
            }
          }

          this.addPlayerToRoom(currentRoomId, player, ws);
          const lobbyPayload = this.serializeLobby(room);

          this.broadcastToRoom(room, {
            type: 'LOBBY_STATE',
            room: lobbyPayload,
            message: `${player.name} joined the arena.`
          });

          return { success: true, response: { type: 'LOBBY_STATE', room: lobbyPayload } };
        }

        case 'QUICK_MATCH': {
          const { player, language } = data;
          if (!player?.id) return { success: false, error: 'Missing player ID' };

          const chosenLang = language || 'nepali';
          let room = this.findPublicMatchmakingRoom(chosenLang, player.id);
          if (!room) {
            const newRoomCode = `PUB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            room = this.createRoom(newRoomCode, player, chosenLang, 'single', true);
          }

          this.addPlayerToRoom(room.roomId, player, ws);
          const lobbyPayload = this.serializeLobby(room);

          this.broadcastToRoom(room, {
            type: 'LOBBY_STATE',
            room: lobbyPayload,
            message: `${player.name} joined the match.`
          });

          return { success: true, response: { type: 'LOBBY_STATE', room: lobbyPayload } };
        }

        case 'TOGGLE_READY': {
          const { roomId, playerId, isReady } = data;
          if (!roomId || !playerId) return { success: false, error: 'Missing roomId or playerId' };

          const room = this.toggleReady(roomId, playerId, isReady);
          if (room) {
            const lobbyPayload = this.serializeLobby(room);
            this.broadcastToRoom(room, {
              type: 'LOBBY_STATE',
              room: lobbyPayload
            });
            return { success: true, response: { type: 'LOBBY_STATE', room: lobbyPayload } };
          }
          return { success: false, error: 'Room not found' };
        }

        case 'UPDATE_SETTINGS': {
          const { roomId, language, format } = data;
          if (!roomId) return { success: false, error: 'Missing roomId' };

          const room = this.updateRoomSettings(roomId, language, format);
          if (room) {
            const lobbyPayload = this.serializeLobby(room);
            this.broadcastToRoom(room, {
              type: 'LOBBY_STATE',
              room: lobbyPayload
            });
            return { success: true, response: { type: 'LOBBY_STATE', room: lobbyPayload } };
          }
          return { success: false, error: 'Cannot update settings' };
        }

        case 'START_MATCH': {
          const { roomId, countdownDurationMs } = data;
          if (!roomId) return { success: false, error: 'Missing roomId' };

          const room = this.startCountdown(roomId, countdownDurationMs || 4000);
          if (room) {
            const countdownData = {
              type: 'MATCH_COUNTDOWN',
              matchId: room.matchId,
              startTimestamp: room.startTimestamp,
              countdownDurationMs: room.countdownDurationMs,
              targetText: room.targetText,
              textId: room.textId,
              textTitle: room.textTitle,
              language: room.language,
              currentRound: room.currentRound,
              totalRounds: room.totalRounds,
              players: Array.from(room.players.values())
            };
            this.broadcastToRoom(room, countdownData);
            return { success: true, response: countdownData };
          }
          return { success: false, error: 'Failed to start match' };
        }

        case 'UPDATE_PROGRESS': {
          const { roomId, playerId, progress, charsTyped, wordsTyped, accuracy, mistakes, isFinished } = data;
          if (!roomId || !playerId) return { success: false, error: 'Missing roomId or playerId' };

          const result = this.updatePlayerProgress(roomId, playerId, {
            progress,
            charsTyped,
            wordsTyped,
            accuracy,
            mistakes,
            isFinished
          });

          if (result) {
            const { room, allFinished } = result;

            this.broadcastToRoom(room, {
              type: 'PLAYERS_PROGRESS_UPDATE',
              matchId: room.matchId,
              players: Array.from(room.players.values())
            });

            if (allFinished) {
              this.broadcastToRoom(room, {
                type: 'MATCH_FINISHED',
                matchId: room.matchId,
                results: room.results,
                scores: room.scores,
                currentRound: room.currentRound,
                totalRounds: room.totalRounds
              });
            }
            return { success: true };
          }
          return { success: false, error: 'Could not update progress' };
        }

        case 'NEXT_ROUND': {
          const { roomId } = data;
          if (!roomId) return { success: false, error: 'Missing roomId' };

          const room = this.prepareNextRound(roomId);
          if (room) {
            const lobbyPayload = this.serializeLobby(room);
            this.broadcastToRoom(room, {
              type: 'LOBBY_STATE',
              room: lobbyPayload
            });
            return { success: true, response: { type: 'LOBBY_STATE', room: lobbyPayload } };
          }
          return { success: false, error: 'Room not found' };
        }

        case 'HEARTBEAT': {
          const { roomId, playerId } = data;
          if (roomId && playerId) {
            const room = this.getRoom(roomId);
            if (room) {
              const player = room.players.get(playerId);
              if (player) {
                player.lastHeartbeat = Date.now();
                player.connected = true;
              }
            }
          }
          return { success: true, response: { type: 'HEARTBEAT_ACK', timestamp: Date.now() } };
        }

        case 'LEAVE_LOBBY': {
          const { roomId, playerId } = data;
          if (roomId) {
            const room = this.getRoom(roomId);
            if (room && playerId) {
              const player = room.players.get(playerId);
              if (player) {
                player.connected = false;
              }
              this.broadcastToRoom(room, {
                type: 'LOBBY_STATE',
                room: this.serializeLobby(room),
                message: `${player?.name || 'Player'} left the lobby.`
              });
            }
          }
          return { success: true };
        }

        default:
          return { success: false, error: `Unknown action type: ${type}` };
      }
    } catch (err: any) {
      console.error('Error executing action:', err);
      return { success: false, error: err.message || 'Internal error' };
    }
  }

  private getRandomText(language: MultiplayerLanguage) {
    const pool = AUTHORITATIVE_TEXTS[language] || AUTHORITATIVE_TEXTS.nepali;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

export const multiplayerManager = new MultiplayerRoomManager();
