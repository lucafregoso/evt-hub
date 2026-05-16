import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateSpeakerInput {
  bio: string;
  contactEmail: string;
  userId: string;
}

export const createSpeaker = async (input: CreateSpeakerInput) => {
  return await prisma.speaker.create({
    data: input,
  });
};

export const getSpeakerById = async (id: string) => {
  return await prisma.speaker.findUnique({
    where: { id },
  });
};

export const updateSpeaker = async (id: string, data: Partial<CreateSpeakerInput>) => {
  return await prisma.speaker.update({
    where: { id },
    data,
  });
};
