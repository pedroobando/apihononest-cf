import { z } from 'zod';

export const UpdateUserSchema = z
  .object({
    fullname: z
      .string()
      .min(2, 'Fullname must be at least 2 characters')
      .max(100, 'Fullname must be less than 100 characters')
      .optional(),

    email: z
      .email('Invalid email address')
      .transform((email) => email.toLowerCase().trim())
      .optional(),

    roll: z.literal(['user', 'admin']).optional(),

    // password: z
    //   .string()
    //   .min(6, 'Password must be at least 6 characters')
    //   .max(50, 'Password must be less than 50 characters')
    //   .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //     'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    //   )
    //   .optional(),

    active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Asegurar que al menos un campo sea proporcionado
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    },
  );

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
