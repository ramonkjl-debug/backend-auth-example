import { UserPrismaRepository } from '@/infra/prisma/UserPrismaRepository';
import { PrismaClient } from '@/main/db/prisma/generated';

export function makeUserPrismaRepository() {
  return new UserPrismaRepository(new PrismaClient());
}
