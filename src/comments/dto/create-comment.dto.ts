import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string({ required_error: 'Body is required' }).min(1).max(255),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
