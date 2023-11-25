import { z } from 'zod';

export const getPostSchema = z.object({
  slug: z.string({ required_error: 'Slug is required' }),
});

export type GetPostDto = z.infer<typeof getPostSchema>;
