import { FastifyInstance } from 'fastify';
import { createSpeaker, getSpeakerById, updateSpeaker } from '../services/speaker/speaker';

export async function speakerRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const input = request.body as any;
    return await createSpeaker(input);
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const speaker = await getSpeakerById(id);
    if (!speaker) return reply.status(404).send({ error: 'Not found' });
    return speaker;
  });

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;
    return await updateSpeaker(id, data);
  });
}
