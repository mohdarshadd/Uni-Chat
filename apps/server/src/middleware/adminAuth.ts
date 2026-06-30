import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-change-me';

export function adminAuth(req: Request, _res: Response, next: NextFunction): void {
  const key = req.headers['admin-key'] as string;
  if (!key || key !== ADMIN_KEY) {
    throw new AppError(401, 'Invalid admin key', 'ADMIN_UNAUTHORIZED');
  }
  next();
}
