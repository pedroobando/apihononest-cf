import { UserService } from '../user/user.service';
import { JwtUtil } from '../../common/utils/jwt';
import * as bcrypt from 'bcryptjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(credentials: LoginCredentials, jwtSecret: string) {
    const { email, password } = credentials;

    // Buscar usuario por email (este método incluye la contraseña para verificación)
    const user = await this.userService.findByEmail(email.toLowerCase());

    if (!user || !user.active) {
      throw new Error('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generar token JWT (excluir password en el payload)
    const { password: _, ...userWithoutPassword } = user;
    const token = await JwtUtil.generateToken({ id: user.id, email: user.email }, jwtSecret);

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateToken(token: string, jwtSecret: string) {
    try {
      const decoded = await JwtUtil.verifyToken(token, jwtSecret);

      // Verificar que el usuario aún existe
      const user = await this.userService.findOne(decoded.id);

      if (!user || !user.active) {
        throw new Error('User not found or inactive');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
