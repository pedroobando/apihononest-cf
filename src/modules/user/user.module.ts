import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';

export class UserModule {
  private readonly userController: UserController;
  private readonly userService: UserService;

  constructor() {
    // Inicializar servicios y controladores con inyección de dependencias
    this.userService = new UserService(); // Se inicializará correctamente en cada request
    this.userController = new UserController(this.userService);
  }

  getRoutes() {
    return this.userController.getRoutes();
  }
}
