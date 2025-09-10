import { HonoContext } from '@/types';

export class DatabaseService {
  constructor(private readonly context: HonoContext) {}

  async query(sql: string, params: any[] = []) {
    try {
      // return await this.context.env.DB.prepare(sql)
      return this.context.Bindings.DB1.prepare(sql)
        .bind(...params)
        .all();
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async first(sql: string, params: any[] = []) {
    try {
      return await this.context.Bindings.DB1.prepare(sql)
        .bind(...params)
        .first();
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async run(sql: string, params: any[] = []) {
    try {
      return await this.context.Bindings.DB1.prepare(sql)
        .bind(...params)
        .run();
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}
