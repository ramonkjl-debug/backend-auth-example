import { VerificationCodeModel } from '@/domain/models/verificationCodeModel';

export type CreateCodeParams = {
  email: string;
  code: string;
  expiresAt: Date;
}

export interface ICreateVerificationCodeRepository {
  create(params: CreateCodeParams): Promise<VerificationCodeModel>
}
