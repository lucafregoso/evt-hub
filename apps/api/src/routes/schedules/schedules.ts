import { FastifyInstance } from 'fastify';
import { createSlot, getSlots } from '../services/schedule/schedule';

export async function scheduleRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    try {
      const input = request.body as any;
      return await createSlot({
        ...input,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime)
      });
    } catch (err: any) {
      return reply.status(409).send({ error: err.message });
    }
  });

  fastify.get('/', async () => {
    return await getSlots();
  });
}
