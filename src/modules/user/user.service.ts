import bcrypt from 'bcryptjs';
import { HonoContext } from '@/types';
import { IUserService } from './interfaces/user.interface';
import { User } from './entities/user.entity';

import { CreateUserDto, UpdateUserDto } from './dto';
import { d1Connection, user } from '@/db';
import { eq } from 'drizzle-orm';

// Tipo para usuario sin password
export type UserWithoutPassword = Omit<User, 'password'>;

export class UserService implements IUserService {
  private db;

  constructor(private readonly context: HonoContext) {
    this.db = d1Connection.getDB();
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    return await this.db.query.user.findMany({
      columns: {
        id: true,
        fullname: true,
        email: true,
        active: true,
        roll: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (user, { asc }) => [asc(user.fullname)],
    });
  }

  async findOne(id: string): Promise<UserWithoutPassword | null> {
    const result = await this.db.query.user.findFirst({
      columns: {
        id: true,
        fullname: true,
        email: true,
        active: true,
        roll: true,
        createdAt: true,
        updatedAt: true,
      },
      where: (user, { eq }) => eq(user.id, id),
    });
    return result || null;
  }

  async findByEmail(email: string): Promise<UserWithoutPassword | null> {
    const result = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email.trim().toLowerCase()),
    });
    return result || null;
  }

  async create(cUserDto: CreateUserDto): Promise<UserWithoutPassword | null> {
    const newUser = {
      ...cUserDto,
      email: cUserDto.email.toLowerCase(),
      password: bcrypt.hashSync(cUserDto.password.trim()),
      roll: 'user',
      active: true,
    };
    const result = await this.db.insert(user).values(newUser).returning({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      roll: user.roll,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return result[0] || null;
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<UserWithoutPassword | null> {
    const result = await this.db
      .update(user)
      .set({
        ...updateUserDto,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        roll: user.roll,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .update(user)
      .set({
        active: false,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));

    return result.success;
  }
}
