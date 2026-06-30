import type { Socket } from 'socket.io';
import { verifyToken } from '../../services/auth.service.js';

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void): void {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return next(new Error('Invalid or expired token'));
  }

  socket.data.sessionId = payload.sessionId;
  socket.data.displayName = payload.displayName;
  socket.data.avatar = payload.avatar;

  next();
}
