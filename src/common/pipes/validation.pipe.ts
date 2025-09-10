import { z } from 'zod';
import { Context } from 'hono';

export class ValidationPipe {
  static validate(schema: z.ZodSchema<any>) {
    return async (c: Context, next: Function) => {
      try {
        const body = await c.req.json();
        const validatedData = schema.parse(body);
        c.set('validatedBody', validatedData);
        await next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return c.json(
            {
              error: 'Validation failed',
              details: errors,
            },
            400,
          );
        }

        return c.json({ error: 'Invalid JSON' }, 400);
      }
    };
  }
}
