import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string({ required_error: 'Username is required' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6)
    .max(255),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
