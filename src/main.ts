import { AppModule } from '@/app.module';
import { d1Connection } from './db';
import { HonoContext } from './types';
// import { Env } from './types';

// Crear la aplicación
// const appModule = new AppModule();
// const app = appModule.getApp();

function createApp() {
  const appModule = new AppModule();
  return appModule.getApp();
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Inicializar la conexión a la base de datos si no está inicializada
    if (!d1Connection.isInitialized()) {
      d1Connection.initialize(env.DB1);
    }

    const app = createApp();

    return app.fetch(request, env, ctx);
  },
};
