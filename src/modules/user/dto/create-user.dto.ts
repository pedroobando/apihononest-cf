import { z } from 'zod';

export const CreateUserSchema = z.object({
  fullname: z
    .string({ error: 'fullname es requerido' })
    .min(2, 'Fullname must be at least 2 characters')
    .max(100, 'Fullname must be less than 100 characters'),

  email: z.email('Invalid email address').transform((email) => email.toLowerCase().trim()),

  password: z
    .string({
      error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be less than 20 characters'),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  // ),
  active: z.boolean().optional().default(true),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
