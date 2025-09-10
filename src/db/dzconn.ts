import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Objetivo crear el mapa del schema
 */
export type DzD1Dbase = DrizzleD1Database<typeof schema> & { $client: D1Database };

/**
 * La conexión con la base de datos D1
 * @param d1 el binculo de la base de datos. => Env.DB
 * @returns la conexion con la base de datos con su schema
 */
export const createDzClient = (d1: D1Database) => drizzle(d1, { schema });
