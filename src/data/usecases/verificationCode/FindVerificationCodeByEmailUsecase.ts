import { IFindVerificationCodeByEmailRepository } from '@/data/protocols/repositories/verificationCode/FindVerificationCodeByEmailRepository';
import { VerificationCodeModel } from '@/domain/models/verificationCodeModel';
import { IFindVerificationCodeByEmail } from '@/domain/usecases/verificationCode/FindVerificationCodeByEmail';

export class FindVerificationCodeByEmailUsecase implements IFindVerificationCodeByEmail {
  constructor(private readonly verificationCodeRepository: IFindVerificationCodeByEmailRepository) {}

  async findByEmail(email: string): Promise<VerificationCodeModel | null> {
    const verificationCode = await this.verificationCodeRepository.findCodeByEmail(email);

    return verificationCode;
  }
}
