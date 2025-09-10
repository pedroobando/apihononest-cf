import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { corsMiddleware, authMiddleware, normalizeEmailMiddleware } from '@/common/middleware';
import { UserModule, PostModule, AuthModule } from '@/modules';

import { HonoContext } from './types';
import { authMiddleware2 } from './common/middleware/auth-middleware';

export class AppModule {
  private readonly app: Hono<HonoContext>;
  private readonly userModule: UserModule;
  private readonly postModule: PostModule;
  private readonly authModule: AuthModule;

  constructor() {
    this.app = new Hono<HonoContext>();
    this.userModule = new UserModule();
    this.postModule = new PostModule();
    this.authModule = new AuthModule();

    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupRoutes() {
    // Health check
    this.app.get('/', (c) => c.json({ status: 'OK', environment: c.env.ENVIRONMENT }));

    // API routes
    // Rutas de autenticación (públicas)
    this.app.route('/auth', this.authModule.getRoutes());
    this.app.route('/users', this.userModule.getRoutes());
    this.app.route('/posts', this.postModule.getRoutes());
  }

  private setupMiddlewares() {
    this.app.use('*', logger());

    // Configurar CORS usando una función para obtener los orígenes del entorno
    this.app.use(
      '*',
      corsMiddleware({
        origins: (c) => {
          // Obtener ALLOWED_ORIGINS del contexto (env)
          const allowedOrigins = c.env.ALLOWED_ORIGINS || '';
          return allowedOrigins.split(',').filter(Boolean);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        maxAge: 600,
      }),
    );

    // this.app.use('/posts', authMiddleware);
    this.app.use('*', normalizeEmailMiddleware);
    this.app.use('/users', authMiddleware());
  }

  getApp() {
    return this.app;
  }
}
