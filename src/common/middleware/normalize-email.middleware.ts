import { Context } from 'hono';

export async function normalizeEmailMiddleware(c: Context, next: Function) {
  try {
    const body = await c.req.json();

    if (body && body.email) {
      body.email = body.email.toLowerCase().trim();
    }

    // Reemplazar el cuerpo de la solicitud con los datos normalizados
    c.req.json = () => Promise.resolve(body);

    await next();
  } catch (error) {
    console.error('Error in email normalization middleware:', error);
    await next();
  }
}
