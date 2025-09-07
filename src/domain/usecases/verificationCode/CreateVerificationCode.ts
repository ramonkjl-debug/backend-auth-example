import { VerificationCodeModel } from '@/domain/models/verificationCodeModel';

export type CreateVerificationCodeParams = {
  email: string;
  expiresAt: Date;
}

export interface ICreateVerificationCode {
  create(params: CreateVerificationCodeParams): Promise<VerificationCodeModel>;
}
