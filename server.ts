import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { multiplayerManager } from './server/multiplayerManager.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: Date.now() });
  });

  // Room lookup API
  app.get('/api/multiplayer/room/:roomId', (req, res) => {
    const { roomId } = req.params;
    const room = multiplayerManager.getRoom(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({
      roomId: room.roomId,
      matchId: room.matchId,
      status: room.status,
      language: room.language,
      playerCount: room.players.size,
      players: Array.from(room.players.values()).map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isHost: p.isHost,
        isReady: p.isReady,
        connected: p.connected
      }))
    });
  });

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Attach WebSocket Server for real-time multiplayer
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/multiplayer' });

  wss.on('connection', (ws: WebSocket, req) => {
    let currentPlayerId: string | null = null;
    let currentRoomId: string | null = null;

    ws.on('message', (messageBuffer) => {
      try {
        const data = JSON.parse(messageBuffer.toString());
        const { type } = data;

        switch (type) {
          case 'JOIN_LOBBY': {
            const { roomId, player, language, format, isCreate } = data;
            if (!roomId || !player?.id) {
              return ws.send(JSON.stringify({ type: 'ERROR', message: 'Missing roomId or player data' }));
            }

            currentPlayerId = player.id;
            currentRoomId = roomId.trim().toUpperCase();

            let room = multiplayerManager.getRoom(currentRoomId);
            if (!room) {
              if (isCreate) {
                room = multiplayerManager.createRoom(
                  currentRoomId,
                  player,
                  language || 'nepali',
                  format || 'single',
                  false
                );
              } else {
                return ws.send(
                  JSON.stringify({
                    type: 'ERROR',
                    message: `Room "${currentRoomId}" not found. Please verify the code.`
                  })
                );
              }
            }

            multiplayerManager.addPlayerToRoom(currentRoomId, player, ws);
            const lobbyPayload = multiplayerManager.serializeLobby(room);

            // Broadcast updated lobby to all participants
            multiplayerManager.broadcastToRoom(room, {
              type: 'LOBBY_STATE',
              room: lobbyPayload,
              message: `${player.name} joined the arena.`
            });
            break;
          }

          case 'QUICK_MATCH': {
            const { player, language } = data;
            if (!player?.id) return;

            currentPlayerId = player.id;
            const chosenLang = language || 'nepali';

            // Find existing public room or create a new public room
            let room = multiplayerManager.findPublicMatchmakingRoom(chosenLang, player.id);
            if (!room) {
              const newRoomCode = `PUB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
              room = multiplayerManager.createRoom(newRoomCode, player, chosenLang, 'single', true);
            }

            currentRoomId = room.roomId;
            multiplayerManager.addPlayerToRoom(currentRoomId, player, ws);
            const lobbyPayload = multiplayerManager.serializeLobby(room);

            multiplayerManager.broadcastToRoom(room, {
              type: 'LOBBY_STATE',
              room: lobbyPayload,
              message: `${player.name} matched!`
            });
            break;
          }

          case 'TOGGLE_READY': {
            const { roomId, playerId, isReady } = data;
            const targetRoomId = roomId || currentRoomId;
            const targetPlayerId = playerId || currentPlayerId;
            if (!targetRoomId || !targetPlayerId) return;

            const room = multiplayerManager.toggleReady(targetRoomId, targetPlayerId, isReady);
            if (room) {
              multiplayerManager.broadcastToRoom(room, {
                type: 'LOBBY_STATE',
                room: multiplayerManager.serializeLobby(room)
              });
            }
            break;
          }

          case 'UPDATE_SETTINGS': {
            const { roomId, language, format } = data;
            const targetRoomId = roomId || currentRoomId;
            if (!targetRoomId) return;

            const room = multiplayerManager.updateRoomSettings(targetRoomId, language, format);
            if (room) {
              multiplayerManager.broadcastToRoom(room, {
                type: 'LOBBY_STATE',
                room: multiplayerManager.serializeLobby(room)
              });
            }
            break;
          }

          case 'START_MATCH': {
            const { roomId, countdownDurationMs } = data;
            const targetRoomId = roomId || currentRoomId;
            if (!targetRoomId) return;

            const room = multiplayerManager.startCountdown(targetRoomId, countdownDurationMs || 4000);
            if (room) {
              // Send authoritative start event with target text & start timestamp to all players
              multiplayerManager.broadcastToRoom(room, {
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
              });
            }
            break;
          }

          case 'UPDATE_PROGRESS': {
            const { roomId, playerId, progress, charsTyped, wordsTyped, accuracy, mistakes, isFinished } = data;
            const targetRoomId = roomId || currentRoomId;
            const targetPlayerId = playerId || currentPlayerId;
            if (!targetRoomId || !targetPlayerId) return;

            const result = multiplayerManager.updatePlayerProgress(targetRoomId, targetPlayerId, {
              progress,
              charsTyped,
              wordsTyped,
              accuracy,
              mistakes,
              isFinished
            });

            if (result) {
              const { room, isFirstFinished, allFinished } = result;

              // Broadcast live players progress to all connected screens
              multiplayerManager.broadcastToRoom(room, {
                type: 'PLAYERS_PROGRESS_UPDATE',
                matchId: room.matchId,
                players: Array.from(room.players.values())
              });

              if (allFinished) {
                multiplayerManager.broadcastToRoom(room, {
                  type: 'MATCH_FINISHED',
                  matchId: room.matchId,
                  results: room.results,
                  scores: room.scores,
                  currentRound: room.currentRound,
                  totalRounds: room.totalRounds
                });
              }
            }
            break;
          }

          case 'NEXT_ROUND': {
            const { roomId } = data;
            const targetRoomId = roomId || currentRoomId;
            if (!targetRoomId) return;

            const room = multiplayerManager.prepareNextRound(targetRoomId);
            if (room) {
              multiplayerManager.broadcastToRoom(room, {
                type: 'LOBBY_STATE',
                room: multiplayerManager.serializeLobby(room)
              });
            }
            break;
          }

          case 'HEARTBEAT': {
            const { roomId, playerId } = data;
            const targetRoomId = roomId || currentRoomId;
            const targetPlayerId = playerId || currentPlayerId;
            if (targetRoomId && targetPlayerId) {
              const room = multiplayerManager.getRoom(targetRoomId);
              if (room) {
                const player = room.players.get(targetPlayerId);
                if (player) {
                  player.lastHeartbeat = Date.now();
                  player.connected = true;
                }
              }
            }
            ws.send(JSON.stringify({ type: 'HEARTBEAT_ACK', timestamp: Date.now() }));
            break;
          }

          case 'LEAVE_LOBBY': {
            if (currentRoomId) {
              const room = multiplayerManager.getRoom(currentRoomId);
              if (room && currentPlayerId) {
                const player = room.players.get(currentPlayerId);
                if (player) {
                  player.connected = false;
                }
                multiplayerManager.broadcastToRoom(room, {
                  type: 'LOBBY_STATE',
                  room: multiplayerManager.serializeLobby(room),
                  message: `${player?.name || 'Player'} left the lobby.`
                });
              }
            }
            break;
          }
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      const removed = multiplayerManager.removeConnection(ws);
      if (removed) {
        const { room, playerId } = removed;
        const player = room.players.get(playerId);
        multiplayerManager.broadcastToRoom(room, {
          type: 'LOBBY_STATE',
          room: multiplayerManager.serializeLobby(room),
          message: `${player?.name || 'A player'} disconnected.`
        });
      }
    });
  });

  // Vite middleware in dev or static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Nepali Typing Pro full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
