import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';

export function registerRoomHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
): void {
  socket.on('room:join', (data, ack) => {
    const { universityId } = data;

    if (!universityId) {
      ack({ success: false, error: 'University ID is required' });
      return;
    }

    socket.join(universityId);
    socket.data.universityId = universityId;

    ack({ success: true });
  });

  socket.on('room:leave', (data) => {
    socket.leave(data.universityId);
  });
}
