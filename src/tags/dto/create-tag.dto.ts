import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  description: z.string({ required_error: 'Description is required' }),
});

export type CreateTagDto = z.infer<typeof createTagSchema>;
