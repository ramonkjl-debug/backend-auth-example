import { VerificationCodeModel } from '@/domain/models/verificationCodeModel';

export interface IFindVerificationCodeByEmailRepository {
  findCodeByEmail(email: string): Promise<VerificationCodeModel | null>
}
