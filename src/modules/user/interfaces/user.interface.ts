import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  findAll(): Promise<Omit<User, 'password' | 'email' | 'active' | 'roll'>[]>;
  findOne(id: string): Promise<Omit<User, 'password'> | null>;
  create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'> | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'> | null>;
  delete(id: string): Promise<boolean>;
}
