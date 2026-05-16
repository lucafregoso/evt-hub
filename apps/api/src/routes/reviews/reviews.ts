import { FastifyInstance } from 'fastify';
import { createReview, getReviewsBySession } from '../services/review/review';

export async function reviewRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const input = request.body as any;
    return await createReview(input);
  });

  fastify.get('/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    return await getReviewsBySession(sessionId);
  });
}
