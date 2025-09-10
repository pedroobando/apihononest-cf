import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { corsMiddleware, authMiddleware } from '@/middleware';
import { UserModule, PostModule } from '@/modules';
import { HonoContext } from './types';

export class AppModule {
  private readonly app: Hono<HonoContext>;
  private readonly userModule: UserModule;
  private readonly postModule: PostModule;

  constructor() {
    this.app = new Hono<HonoContext>();
    this.userModule = new UserModule();
    this.postModule = new PostModule();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupRoutes() {
    // Health check
    this.app.get('/', (c) => c.json({ status: 'OK', environment: c.env.ENVIRONMENT }));

    // API routes
    this.app.route('/users', this.userModule.getRoutes());
    this.app.route('/posts', this.postModule.getRoutes());
  }

  private setupMiddleware() {
    this.app.use('*', logger());
    this.app.use('*', corsMiddleware);
    this.app.use('/posts', authMiddleware);
  }

  // private cnnD1() {
  //   this.app.use(async (c) => {
  //     if (!d1Connection.isInitialized()) {
  //       d1Connection.initialize(c.env.DB1);
  //       // c.set('db', db);
  //     }

  //     // const db = drizzle(c.env.DB, { schema });

  //     // await next();
  //   });
  // }

  getApp() {
    return this.app;
  }
}
