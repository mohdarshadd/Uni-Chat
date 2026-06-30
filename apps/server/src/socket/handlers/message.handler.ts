import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';
import { messageContentSchema } from '@campus-chat/shared';
import { createMessage, deleteMessage, toggleLike } from '../../services/message.service.js';

export function registerMessageHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
): void {
  socket.on('message:send', async (data, ack) => {
    try {
      const universityId = socket.data.universityId;
      if (!universityId) {
        ack({ success: false, error: 'Not in a room' });
        return;
      }

      const parsed = messageContentSchema.safeParse(data.content);
      if (!parsed.success) {
        ack({ success: false, error: parsed.error.errors[0].message });
        return;
      }

      const message = await createMessage({
        roomId: universityId,
        senderId: socket.data.sessionId,
        senderName: socket.data.displayName,
        avatar: socket.data.avatar,
        content: parsed.data,
        replyTo: data.replyTo,
      });

      io.to(universityId).emit('message:new', message);

      ack({ success: true, message });
    } catch (err) {
      console.error('[Message] Send error:', err);
      ack({ success: false, error: 'Failed to send message' });
    }
  });

  socket.on('message:delete', async (data) => {
    try {
      const { messageId } = data;
      const deleted = await deleteMessage(messageId, socket.data.sessionId);
      if (deleted && socket.data.universityId) {
        io.to(socket.data.universityId).emit('message:deleted', { messageId });
      }
    } catch (err) {
      console.error('[Message] Delete error:', err);
    }
  });

  socket.on('message:like', async (data) => {
    try {
      const { messageId } = data;
      const likes = await toggleLike(messageId, socket.data.sessionId);
      if (likes && socket.data.universityId) {
        io.to(socket.data.universityId).emit('message:liked', { messageId, likes });
      }
    } catch (err) {
      console.error('[Message] Like error:', err);
    }
  });
}
