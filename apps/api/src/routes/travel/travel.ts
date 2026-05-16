import { FastifyInstance } from 'fastify';
import { createTravelRequest, getTravelRequestsBySpeaker } from '../services/travel/travel';

export async function travelRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const input = request.body as any;
    return await createTravelRequest(input);
  });

  fastify.get('/:speakerId', async (request, reply) => {
    const { speakerId } = request.params as { speakerId: string };
    return await getTravelRequestsBySpeaker(speakerId);
  });
}
