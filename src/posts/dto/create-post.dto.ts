import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, { message: 'Description must be at least 10 characters' }),
  text: z.string({ required_error: 'Text is required' }),
  tagIds: z.array(z.object({ id: z.string() })).optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
