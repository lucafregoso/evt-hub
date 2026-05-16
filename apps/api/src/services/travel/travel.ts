import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTravelRequestInput {
  speakerId: string;
  requirements: string;
}

export const createTravelRequest = async (input: CreateTravelRequestInput) => {
  return await prisma.travelRequest.create({
    data: {
      ...input,
      status: 'PENDING',
    },
  });
};

export const getTravelRequestsBySpeaker = async (speakerId: string) => {
  return await prisma.travelRequest.findMany({
    where: { speakerId },
  });
};
