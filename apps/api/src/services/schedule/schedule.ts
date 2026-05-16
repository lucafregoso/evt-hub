import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateSlotInput {
  sessionId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
}

export const createSlot = async (input: CreateSlotInput) => {
  // Simple conflict check: check if any slot overlaps for the same room
  const conflict = await prisma.slot.findFirst({
    where: {
      roomId: input.roomId,
      OR: [
        { startTime: { lt: input.endTime }, endTime: { gt: input.startTime } }
      ]
    }
  });

  if (conflict) {
    throw new Error('Scheduling conflict detected');
  }

  return await prisma.slot.create({
    data: input,
  });
};

export const getSlots = async () => {
  return await prisma.slot.findMany();
};
