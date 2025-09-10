import { Hono } from 'hono';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import { HonoContext } from '@/types';

export class UserModule {
  private readonly userController: UserController;
  private readonly userService: UserService;
  private readonly router: Hono<HonoContext>;

  constructor() {
    this.router = new Hono<HonoContext>();

    // Inicializar servicios y controladores con inyección de dependencias
    this.userService = new UserService({} as HonoContext); // Se inicializará correctamente en cada request
    this.userController = new UserController(this.userService);

    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get('/', (c) => {
      return this.userController.getAllUsers(c);
    });

    this.router.get('/:id', (c) => this.userController.getUserById(c));
    this.router.post('/', (c) => this.userController.createUser(c));
    this.router.put('/:id', (c) => this.userController.updateUser(c));
    this.router.delete('/:id', (c) => this.userController.deleteUser(c));
  }

  getRoutes() {
    return this.router;
  }
}
