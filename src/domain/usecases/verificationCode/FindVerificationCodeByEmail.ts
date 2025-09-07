import { VerificationCodeModel } from '@/domain/models/verificationCodeModel';

export type VerificationCodeByEmail = {
  email: string;
}

export interface IFindVerificationCodeByEmail {
  findByEmail(email: string): Promise<VerificationCodeModel | null>
}
