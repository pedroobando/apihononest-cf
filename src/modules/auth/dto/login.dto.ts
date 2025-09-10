import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Invalid email address').transform((email) => email.toLowerCase().trim()), // Normalizar email a minúsculas

  password: z
    .string({
      error: 'Password is required',
    })
    .min(1, 'Password cannot be empty'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
