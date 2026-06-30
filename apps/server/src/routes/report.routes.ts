import { Router, type Request, type Response } from 'express';
import { reportSchema } from '@campus-chat/shared';
import { verifyToken } from '../services/auth.service.js';
import { createReport, getPendingReports, resolveReport } from '../services/report.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { reportLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', reportLimiter, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
  }

  const payload = verifyToken(authHeader.slice(7));
  if (!payload) {
    throw new AppError(401, 'Invalid token', 'INVALID_TOKEN');
  }

  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.errors[0].message, 'INVALID_REPORT');
  }

  const result = await createReport(parsed.data.messageId, payload.sessionId, parsed.data.reason);
  if (!result.success) {
    throw new AppError(400, result.error!, 'REPORT_FAILED');
  }

  res.json({ success: true });
});

router.get('/', async (_req: Request, res: Response) => {
  const reports = await getPendingReports();
  res.json(reports);
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { action } = req.body;
  if (!['dismiss', 'delete_message', 'mute_user'].includes(action)) {
    throw new AppError(400, 'Invalid action', 'INVALID_ACTION');
  }

  const success = await resolveReport(req.params.id as string, action);
  if (!success) {
    throw new AppError(404, 'Report not found', 'REPORT_NOT_FOUND');
  }

  res.json({ success: true });
});

export { router as reportRoutes };
