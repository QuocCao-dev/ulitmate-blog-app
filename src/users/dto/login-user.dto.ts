import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6)
    .max(255),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
