import { AuthController } from './auth.controller';

export class AuthModule {
  private readonly authController: AuthController;

  constructor() {
    this.authController = new AuthController();
  }

  getRoutes() {
    return this.authController.getRouter();
  }
}
