import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateEventInput {
  name: string;
  date: Date;
  description: string;
}

export const createEvent = async (input: CreateEventInput) => {
  return await prisma.event.create({
    data: input,
  });
};

export const getEvents = async () => {
  return await prisma.event.findMany();
};

export const getEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
  });
};
