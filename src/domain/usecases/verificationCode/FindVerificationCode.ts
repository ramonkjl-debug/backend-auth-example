import { VerificationCodeModel } from '@/domain/models/verificationCodeModel';

export type VerificationCodeParams = {
  email: string;
  code: string
}

export interface IFindVerificationCode {
  find(params: VerificationCodeParams): Promise<VerificationCodeModel | null>
}
