import { FindUserByDocumentUsecase } from '@/data/usecases/user/FindUserByDocumentUsecase';
import { makeUserPrismaRepository } from '@/main/factories/repositories/userPrismaRepositoryFactory';

export function makeFindUserByDocumentFactory() {

  return new FindUserByDocumentUsecase(makeUserPrismaRepository());
}

