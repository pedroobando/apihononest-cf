import { sign, decode, verify } from 'hono/jwt';

const JWT_DUMMY: string = 'my-secret-key';

export class JwtUtil {
  static async generateToken(payload: any, JWT_SECRET: string = JWT_DUMMY, JWT_EXPIRES: number = 30): Promise<string> {
    const payloadNew = generarPayload(payload, JWT_EXPIRES);
    return await sign(payloadNew, JWT_SECRET);
  }

  static verifyToken(token: string, JWT_SECRET: string = JWT_DUMMY): Promise<any> {
    return verify(token, JWT_SECRET);
  }

  static decodetoken = (tokenToDecode: string) => decode(tokenToDecode);
}

// export const decodetoken = (tokenToDecode: string) => decode(tokenToDecode);

const generarPayload = (payload: any, minutesExp: number) => {
  return {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * minutesExp, // Token expires in 5 minutes
  };
};
