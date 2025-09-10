import { Hono, Context } from 'hono';
import { AuthService } from './auth.service';
import { HonoContext } from '@/types';
import { ValidationPipe } from '@/common/pipes/validation.pipe';
import { LoginDto, LoginSchema } from './dto/login.dto';

export class AuthController {
  private readonly router: Hono<HonoContext>;
  private authService: AuthService;

  constructor() {
    this.router = new Hono<HonoContext>();
    this.authService = new AuthService();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post('/login', ValidationPipe.validate(LoginSchema), (c) => this.login(c));
    this.router.post('/validate', (c) => this.validateToken(c));
  }

  async login(c: Context) {
    try {
      const credentials: LoginDto = c.get('validatedBody');

      if (!credentials.email || !credentials.password) {
        return c.json({ error: 'Email and password are required' }, 400);
      }

      // Usar c.env.JWT_SECRET
      const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-key';
      const result = await this.authService.login(credentials, JWT_SECRET);

      return c.json(result);
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }
  }

  async validateToken(c: Context) {
    try {
      const authHeader = c.req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Authorization token required' }, 401);
      }

      const token = authHeader.substring(7);
      // Usar c.env.JWT_SECRET
      const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-key';

      const user = await this.authService.validateToken(token, JWT_SECRET);

      return c.json({ valid: true, user });
    } catch (error) {
      console.error('Token validation error:', error);
      return c.json({ error: 'Invalid token' }, 401);
    }
  }

  getRouter() {
    return this.router;
  }
}
