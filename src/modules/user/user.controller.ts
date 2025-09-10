import { Context } from 'hono';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HonoContext } from '@/types';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getAllUsers(c: Context<HonoContext>) {
    try {
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

  async createUser(c: Context<HonoContext>) {
    try {
      const createUserDto: CreateUserDto = await c.req.json();

      // Validar que el email no exista
      const existingUser = await this.userService.findByEmail(createUserDto.email);
      if (existingUser) {
        return c.json({ error: 'Email already exists' }, 409);
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
      const updateUserDto: UpdateUserDto = await c.req.json();

      // Validar que el usuario existe
      const existingUser = await this.userService.findOne(id);
      if (!existingUser) {
        return c.json({ error: 'User not found' }, 404);
      }

      // Validar que el email no esté en uso por otro usuario
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const userWithEmail = await this.userService.findByEmail(updateUserDto.email);
        if (userWithEmail) {
          return c.json({ error: 'Email already in use' }, 409);
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
}
