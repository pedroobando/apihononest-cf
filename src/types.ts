import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './db/schema';

interface Env {
  DB1: D1Database;
  ENVIRONMENT: string;
  JWT_SECRET: string;
  JWT_EXPIRES: number;
  ALLOWED_ORIGINS: string[];
}

export type HonoContext = {
  Bindings: Env;
  Variables: {
    user?: any; // Para almacenar información del usuario autenticado
    db: DrizzleD1Database<typeof schema>;
    validatedBody: any;
  };
};

// export type Env = {
//   Bindings: {
//     DB: D1Database;
//     JWT_SECRET: string;
//     JWT_EXPIRES: number;
//   };
//   Variables: {
//     db: DrizzleD1Database<typeof schema> & { $client: D1Database };
//   };
// };
