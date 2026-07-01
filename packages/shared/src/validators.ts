import { z } from 'zod';

export const displayNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(30, 'Name must be at most 30 characters')
  .regex(/^[a-zA-Z0-9 _-]+$/, 'Name can only contain letters, numbers, spaces, underscores, and hyphens');

export const messageContentSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(1000, 'Message must be at most 1000 characters')
  .transform((s) => s.trim());

export const gifUrlSchema = z
  .string()
  .url('Invalid GIF URL')
  .regex(/\.gif/i, 'URL must point to a GIF');

export const messageSendSchema = z.object({
  content: messageContentSchema,
  contentType: z.enum(['text', 'gif']).optional().default('text'),
  mediaUrl: gifUrlSchema.optional(),
  replyTo: z.string().nullable().optional(),
});

export const roomJoinSchema = z.object({
  universityId: z.string().min(1, 'University ID is required'),
});

export const reportSchema = z.object({
  messageId: z.string().min(1),
  reason: z
    .string()
    .min(10, 'Please provide a reason (at least 10 characters)')
    .max(500, 'Reason must be at most 500 characters'),
});

export const universitySearchSchema = z.object({
  query: z.string().min(1).max(100),
  cityId: z.string().optional(),
});
