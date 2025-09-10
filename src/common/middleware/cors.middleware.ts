import { Context } from 'hono';

interface CorsOptions {
  origins?: string[] | ((c: Context) => string[]);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export function corsMiddleware(options: CorsOptions = {}) {
  const {
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    exposedHeaders = [],
    credentials = true,
    maxAge = 600,
  } = options;

  return async (c: Context, next: Function) => {
    // Obtener los orígenes permitidos, que pueden ser un array o una función que devuelve un array
    let origins: string[] = [];
    if (options.origins) {
      if (typeof options.origins === 'function') {
        origins = options.origins(c);
      } else {
        origins = options.origins;
      }
    }

    const origin = c.req.header('Origin');
    const isAllowedOrigin = origins.length === 0 || (origin && origins.includes(origin));

    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
      if (isAllowedOrigin && origin) {
        c.header('Access-Control-Allow-Origin', origin);
      }
      c.header('Access-Control-Allow-Methods', methods.join(', '));
      c.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
      c.header('Access-Control-Expose-Headers', exposedHeaders.join(', '));
      c.header('Access-Control-Max-Age', maxAge.toString());

      if (credentials) {
        c.header('Access-Control-Allow-Credentials', 'true');
      }

      return c.body(null, 204);
    }

    // Handle actual requests
    if (isAllowedOrigin && origin) {
      c.header('Access-Control-Allow-Origin', origin);
    }

    c.header('Access-Control-Allow-Credentials', credentials ? 'true' : 'false');
    c.header('Access-Control-Expose-Headers', exposedHeaders.join(', '));

    await next();
  };
}
