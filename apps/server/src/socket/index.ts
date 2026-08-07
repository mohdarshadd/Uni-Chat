import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';
import { socketAuthMiddleware } from './middlewares/auth.middleware.js';
import { registerRoomHandlers } from './handlers/room.handler.js';
import { registerMessageHandlers } from './handlers/message.handler.js';
import { registerTypingHandlers } from './handlers/typing.handler.js';
import { registerPollHandlers } from './handlers/poll.handler.js';
import { broadcastRoomMembers } from './presence.js';

export let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function initializeSocket(httpServer: HttpServer): void {
  io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
      origin: true,
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
    registerPollHandlers(io, socket);

    let joinedRooms: string[] = [];

    socket.on('disconnecting', () => {
      joinedRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
      joinedRooms.forEach((room) => {
        socket.to(room).emit('typing:update', {
          userId: socket.data.sessionId,
          displayName: socket.data.displayName,
          isTyping: false,
        });
      });
    });

    socket.on('disconnect', (reason) => {
      joinedRooms.forEach((room) => {
        broadcastRoomMembers(io, room);
      });
      console.log(`[Socket] Disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('[Socket] IO initialized');
}
