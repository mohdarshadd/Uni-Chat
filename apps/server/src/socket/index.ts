import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';
import { socketAuthMiddleware } from './middlewares/auth.middleware.js';
import { registerRoomHandlers } from './handlers/room.handler.js';
import { registerMessageHandlers } from './handlers/message.handler.js';
import { registerTypingHandlers } from './handlers/typing.handler.js';

export let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function initializeSocket(httpServer: HttpServer): void {
  io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 10000,
    pingTimeout: 5000,
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id} (${socket.data.displayName})`);

    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTypingHandlers(io, socket);

    socket.on('disconnecting', () => {
      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      rooms.forEach((room) => {
        socket.to(room).emit('typing:update', {
          userId: socket.data.sessionId,
          displayName: socket.data.displayName,
          isTyping: false,
        });
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('[Socket] IO initialized');
}
