import { Router, type Request, type Response } from 'express';
import { verifyToken } from '../services/auth.service.js';
import { getMessages, deleteMessage, toggleLike } from '../services/message.service.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/:universityId', async (req: Request, res: Response) => {
  const universityId = req.params.universityId as string;
  const { before } = req.query;

  const messages = await getMessages(
    universityId,
    typeof before === 'string' ? before : undefined,
  );

  res.json(messages);
});

router.post('/:id/like', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
  }

  const payload = verifyToken(authHeader.slice(7));
  if (!payload) {
    throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
  }

  const likes = await toggleLike(req.params.id as string, payload.sessionId);
  if (!likes) {
    throw new AppError(404, 'Message not found', 'MESSAGE_NOT_FOUND');
  }

  res.json({ likes });
});

router.delete('/:id', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
  }

  const payload = verifyToken(authHeader.slice(7));
  if (!payload) {
    throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
  }

  const deleted = await deleteMessage(req.params.id as string, payload.sessionId);
  if (!deleted) {
    throw new AppError(404, 'Message not found or not authorized', 'NOT_FOUND');
  }

  res.json({ success: true });
});

export { router as messagesRoutes };
