import { FastifyInstance } from 'fastify';
import { generateTokens } from '../services/auth/auth';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    // Mock user lookup
    const payload = { userId: '1', role: 'ADMIN' as const };
    const tokens = generateTokens(payload);
    
    reply.setCookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict'
    });
    
    return { accessToken: tokens.accessToken };
  });

  fastify.post('/refresh', async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) return reply.status(401).send({ error: 'Missing token' });
    
    // In production, verify refresh token against database
    const payload = { userId: '1', role: 'ADMIN' as const };
    const tokens = generateTokens(payload);
    
    return { accessToken: tokens.accessToken };
  });
}
