import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';

const typingTimers = new Map<string, NodeJS.Timeout>();

export function registerTypingHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
): void {
  socket.on('typing:start', (data) => {
    const universityId = socket.data.universityId;
    if (!universityId) return;

    socket.to(universityId).emit('typing:update', {
      userId: socket.data.sessionId,
      displayName: socket.data.displayName,
      isTyping: true,
    });

    const existing = typingTimers.get(socket.id);
    if (existing) clearTimeout(existing);

    typingTimers.set(
      socket.id,
      setTimeout(() => {
        socket.to(universityId).emit('typing:update', {
          userId: socket.data.sessionId,
          displayName: socket.data.displayName,
          isTyping: false,
        });
        typingTimers.delete(socket.id);
      }, 2000),
    );
  });

  socket.on('typing:stop', (data) => {
    const universityId = socket.data.universityId;
    if (!universityId) return;

    const existing = typingTimers.get(socket.id);
    if (existing) clearTimeout(existing);
    typingTimers.delete(socket.id);

    socket.to(universityId).emit('typing:update', {
      userId: socket.data.sessionId,
      displayName: socket.data.displayName,
      isTyping: false,
    });
  });
}
