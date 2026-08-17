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
    res.json(multiplayerManager.serializeLobby(room));
  });

  // Authoritative REST Action Endpoint (Dual transport fallback)
  app.post('/api/multiplayer/action', (req, res) => {
    const result = multiplayerManager.processAction(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Action failed' });
    }
    res.json({ success: true, response: result.response });
  });

  // Server-Sent Events (SSE) Real-time Stream Endpoint
  app.get('/api/multiplayer/events', (req, res) => {
    const roomId = (req.query.roomId as string || '').trim().toUpperCase();
    const playerId = (req.query.playerId as string || '').trim();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*'
    });

    // Send initial connected confirmation
    res.write(`data: ${JSON.stringify({ type: 'SSE_CONNECTED', serverTime: Date.now() })}\n\n`);

    if (roomId && playerId) {
      const room = multiplayerManager.getRoom(roomId);
      if (room) {
        // Send initial lobby state
        res.write(`data: ${JSON.stringify({ type: 'LOBBY_STATE', room: multiplayerManager.serializeLobby(room) })}\n\n`);
      }

      // Register listener
      const eventCallback = (event: any) => {
        try {
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (err) {
          // Client disconnected
        }
      };

      multiplayerManager.addSseListener(roomId, playerId, eventCallback);

      // Keepalive ping every 10s
      const pingInterval = setInterval(() => {
        try {
          res.write(': keepalive\n\n');
        } catch {
          clearInterval(pingInterval);
        }
      }, 10000);

      req.on('close', () => {
        clearInterval(pingInterval);
        multiplayerManager.removeSseListener(roomId, playerId);
      });
    } else {
      req.on('close', () => {});
    }
  });

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Attach WebSocket Server
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws: WebSocket, req) => {
    let currentPlayerId: string | null = null;
    let currentRoomId: string | null = null;

    ws.on('message', (messageBuffer) => {
      try {
        const data = JSON.parse(messageBuffer.toString());
        if (data.roomId) currentRoomId = String(data.roomId).trim().toUpperCase();
        if (data.player?.id) currentPlayerId = String(data.player.id);
        if (data.playerId) currentPlayerId = String(data.playerId);

        const result = multiplayerManager.processAction(data, ws);
        if (!result.success && result.error) {
          ws.send(JSON.stringify({ type: 'ERROR', message: result.error }));
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

  // Explicit WebSocket Upgrade Handling
  httpServer.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname : '';
    if (pathname === '/ws/multiplayer' || pathname.startsWith('/ws/multiplayer')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      // Don't terminate other upgrades unless necessary
    }
  });

  // Vite middleware in dev or static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
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
