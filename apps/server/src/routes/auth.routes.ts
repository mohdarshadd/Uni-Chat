import { Router, type Request, type Response } from 'express';
import { displayNameSchema } from '@campus-chat/shared';
import { env } from '../config/env.js';
import {
  createAnonymousSession,
  refreshSession,
  updateDisplayName,
  verifyToken,
} from '../services/auth.service.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/anonymous', async (_req: Request, res: Response) => {
  const session = await createAnonymousSession();

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token: session.token,
    sessionId: session.sessionId,
    displayName: session.displayName,
    avatar: session.avatar,
  });
});

router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError(401, 'No refresh token', 'NO_REFRESH_TOKEN');
  }

  const result = await refreshSession(refreshToken);
  if (!result) {
    throw new AppError(401, 'Invalid refresh token', 'INVALID_REFRESH_TOKEN');
  }

  res.json({
    token: result.token,
    displayName: result.displayName,
    avatar: result.avatar,
  });
});

router.post('/rename', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
  }

  const payload = verifyToken(authHeader.slice(7));
  if (!payload) {
    throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
  }

  const parsed = displayNameSchema.safeParse(req.body.displayName);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.errors[0].message, 'INVALID_NAME');
  }

  const result = await updateDisplayName(payload.sessionId, parsed.data);
  if (!result) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }

  res.json({
    token: result.token,
    displayName: result.displayName,
  });
});

export { router as authRoutes };
