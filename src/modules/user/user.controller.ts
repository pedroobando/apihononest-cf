import { Context, Hono } from 'hono';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserSchema, UpdateUserDto, UpdateUserSchema } from './dto';
import { ValidationPipe } from '@/common/pipes/validation.pipe';
import { HonoContext } from '@/types';

export class UserController {
  private readonly router: Hono<HonoContext>;

  constructor(private readonly userService: UserService) {
    this.router = new Hono<HonoContext>();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get('/', (c) => this.getAllUsers(c));
    this.router.get('/:id', (c) => this.getUserById(c));
    this.router.post('/', ValidationPipe.validate(CreateUserSchema), (c) => this.createUser(c));

    this.router.put('/:id', ValidationPipe.validate(UpdateUserSchema), (c) => this.updateUser(c));
    this.router.delete('/:id', (c) => this.deleteUser(c));
  }

  async getAllUsers(c: Context<HonoContext>) {
    try {
      const currentUser = c.get('user');
      const currentpayload = c.get('jwtPayload');
      console.log(currentUser, currentpayload);

      const users = await this.userService.findAll();
      return c.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async getUserById(c: Context<HonoContext>) {
    try {
      const id = c.req.param('id');
      const user = await this.userService.findOne(id);

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      return c.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async createUser(c: Context<HonoContext, any, {}>) {
    try {
      // Solo usuarios autenticados pueden crear usuarios
      // Opcional: verificar permisos específicos si es necesario
      const currentUser = c.get('user');
      // const currentpayload = c.get('jwtPayload');
      // console.log(currentUser, currentpayload);

      const createUserDto: CreateUserDto = c.get('validatedBody');

      // Validar que el email no exista (ya normalizado por Zod y el servicio)
      const existingUser = await this.userService.findByEmail(createUserDto.email);
      if (existingUser) {
        return c.json(
          {
            error: 'Email already exists',
            details: [{ field: 'email', message: 'Email already exists' }],
          },
          409,
        );
      }

      const user = await this.userService.create(createUserDto);
      return c.json(user, 201);
    } catch (error) {
      console.error('Error creating user:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async updateUser(c: Context<HonoContext>) {
    try {
      const id = c.req.param('id');
      const updateUserDto: UpdateUserDto = c.get('validatedBody');
      // const updateUserDto: UpdateUserDto = await c.req.json();

      // Validar que el usuario existe
      const existingUser = await this.userService.findOne(id);
      if (!existingUser) {
        return c.json({ error: 'User not found' }, 404);
      }

      // Validar que el email no esté en uso por otro usuario
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const userWithEmail = await this.userService.findByEmail(updateUserDto.email);
        if (userWithEmail) {
          return c.json(
            {
              error: 'Email already in use',
              details: [{ field: 'email', message: 'Email already in use' }],
            },
            409,
          );
        }
      }

      const user = await this.userService.update(id, updateUserDto);
      return c.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  async deleteUser(c: Context<HonoContext>) {
    try {
      const id = c.req.param('id');
      const result = await this.userService.delete(id);

      if (!result) {
        return c.json({ error: 'User not found' }, 404);
      }

      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  getRoutes() {
    return this.router;
  }
}
