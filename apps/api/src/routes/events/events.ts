import { FastifyInstance } from 'fastify';
import { createEvent, getEvents, getEventById } from '../services/event/event';

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const { name, date, description } = request.body as any;
    return await createEvent({ name, date: new Date(date), description });
  });

  fastify.get('/', async () => {
    return await getEvents();
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const event = await getEventById(id);
    if (!event) return reply.status(404).send({ error: 'Not found' });
    return event;
  });
}
