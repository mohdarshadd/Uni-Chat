import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '@campus-chat/shared';
import { University } from '../../models/University.js';
import { getMessages } from '../../services/message.service.js';
import { getRoomPolls } from '../../services/poll.service.js';
import { getOnlineUsers, broadcastRoomMembers } from '../presence.js';

export function registerRoomHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
): void {
  socket.on('room:join', async (data, ack) => {
    const { universityId } = data;

    if (!universityId) {
      ack({ success: false, error: 'University ID is required' });
      return;
    }

    socket.join(universityId);
    socket.data.universityId = universityId;

    ack({ success: true });

    const [universityDoc, messages, polls, users] = await Promise.all([
      University.findById(universityId).lean(),
      getMessages(universityId),
      getRoomPolls(universityId),
      getOnlineUsers(io, universityId),
    ]);

    if (!universityDoc) return;

    socket.emit('room:joined', {
      university: {
        id: universityDoc._id.toString(),
        name: universityDoc.name,
        cityId: universityDoc.cityId.toString(),
        cityName: '',
        isActive: universityDoc.isActive,
        memberCount: universityDoc.memberCount,
      },
      users,
      messages,
      polls,
      onlineCount: users.length,
    });

    broadcastRoomMembers(io, universityId);
  });

  socket.on('room:leave', (data) => {
    socket.leave(data.universityId);
    if (socket.data.universityId === data.universityId) {
      socket.data.universityId = '';
    }
    broadcastRoomMembers(io, data.universityId);
  });
}
