import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '@campus-chat/shared';

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMITS.MESSAGE_SEND.windowMs,
  max: RATE_LIMITS.MESSAGE_SEND.max,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests, please slow down' } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const reportLimiter = rateLimit({
  windowMs: RATE_LIMITS.REPORT.windowMs,
  max: RATE_LIMITS.REPORT.max,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many reports, please slow down' } },
  standardHeaders: true,
  legacyHeaders: false,
});
