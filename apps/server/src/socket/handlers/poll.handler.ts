import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';
import { createPoll, votePoll } from '../../services/poll.service.js';

export function registerPollHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
): void {
  socket.on('poll:create', async (data, ack) => {
    try {
      const universityId = socket.data.universityId;
      if (!universityId) {
        ack({ success: false, error: 'Not in a room' });
        return;
      }

      if (!data.question || !data.options || data.options.length < 2) {
        ack({ success: false, error: 'Question and at least 2 options required' });
        return;
      }

      const poll = await createPoll({
        roomId: universityId,
        question: data.question.slice(0, 200),
        options: data.options.map((o) => o.slice(0, 100)),
        createdBy: socket.data.sessionId,
        createdByName: socket.data.displayName,
      });

      io.to(universityId).emit('poll:new', poll);
      ack({ success: true, poll });
    } catch (err) {
      console.error('[Poll] Create error:', err);
      ack({ success: false, error: 'Failed to create poll' });
    }
  });

  socket.on('poll:vote', async (data, ack) => {
    try {
      const universityId = socket.data.universityId;
      if (!universityId) {
        ack({ success: false, error: 'Not in a room' });
        return;
      }

      const poll = await votePoll(data.pollId, data.optionId, socket.data.sessionId);
      if (!poll) {
        ack({ success: false, error: 'Poll not found or closed' });
        return;
      }

      io.to(universityId).emit('poll:updated', poll);
      ack({ success: true, poll });
    } catch (err) {
      console.error('[Poll] Vote error:', err);
      ack({ success: false, error: 'Failed to vote' });
    }
  });
}
