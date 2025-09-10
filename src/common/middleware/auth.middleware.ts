import { Context, Next } from 'hono';
import { JwtUtil } from '@/common/utils/jwt';
import { UserService } from '@/modules/user/user.service';

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    try {
      const authHeader = c.req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Authorization token required' }, 401);
      }

      const token = authHeader.substring(7);
      // Usar c.env.JWT_SECRET
      const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-key';

      // Verificar el token JWT
      const decoded = await JwtUtil.verifyToken(token, JWT_SECRET);
      // const decoded = await verify (token, JWT_SECRET);

      // Verificar que el usuario aún existe y está activo
      const userService = new UserService();
      const user = await userService.findOne(decoded.id);

      if (!user || !user.active) {
        return c.json({ error: 'User not found or inactive' }, 401);
      }

      // Agregar información del usuario al contexto
      // c.set('user', user);
      c.set('jwtPayload', decoded);

      await next();
    } catch (error) {
      console.error('Authentication error:', error);
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
}
