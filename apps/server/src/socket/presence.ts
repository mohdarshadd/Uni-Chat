import type { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  User,
} from '@campus-chat/shared';

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export async function getOnlineUsers(io: AppServer, roomId: string): Promise<User[]> {
  const sockets = await io.in(roomId).fetchSockets();
  const users: User[] = [];
  const seen = new Set<string>();

  for (const remote of sockets) {
    const { sessionId, displayName, avatar, universityId } = remote.data ?? {};
    if (!sessionId || seen.has(sessionId)) continue;
    seen.add(sessionId);
    users.push({
      sessionId,
      displayName: displayName || 'Anonymous',
      avatar: avatar || '',
      universityId: universityId || roomId,
      isOnline: true,
      lastActive: new Date().toISOString(),
    });
  }

  return users;
}

export async function broadcastRoomMembers(io: AppServer, roomId: string): Promise<void> {
  const users = await getOnlineUsers(io, roomId);
  io.to(roomId).emit('room:members', { users, onlineCount: users.length });
}
