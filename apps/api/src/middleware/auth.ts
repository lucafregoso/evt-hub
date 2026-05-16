import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyAccessToken, UserPayload } from '../services/auth/auth';

export const authorize = (allowedRoles: UserPayload['role'][]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);

      if (!allowedRoles.includes(payload.role)) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      request.user = payload;
    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  };
};

declare module 'fastify' {
  interface FastifyRequest {
    user: UserPayload;
  }
}
