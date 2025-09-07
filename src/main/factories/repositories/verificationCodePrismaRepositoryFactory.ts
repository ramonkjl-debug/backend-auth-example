import { VerificationCodePrismaRepository } from '@/infra/prisma/VerificationCodePrismaRepository';
import { PrismaClient } from '@/main/db/prisma/generated';

export function makeVerificationCodePrismaRepository() {
  return new VerificationCodePrismaRepository(new PrismaClient());
}
