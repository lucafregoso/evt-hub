import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateReviewInput {
  sessionId: string;
  reviewerId: string;
  score: number;
  comments: string;
}

export const createReview = async (input: CreateReviewInput) => {
  return await prisma.review.create({
    data: input,
  });
};

export const getReviewsBySession = async (sessionId: string) => {
  return await prisma.review.findMany({
    where: { sessionId },
  });
};
