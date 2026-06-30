import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';

export function registerMessageHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
): void {
  socket.on('message:send', (data, ack) => {
    const universityId = socket.data.universityId;
    if (!universityId) {
      ack({ success: false, error: 'Not in a room' });
      return;
    }

    ack({ success: true });
  });

  socket.on('message:delete', (data) => {
    // Handled in a future phase
  });
}
