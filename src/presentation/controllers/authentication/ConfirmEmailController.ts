import { IFindUserByEmail } from '@/domain/usecases/user/FindUserByEmail';
import { IUpdateUser } from '@/domain/usecases/user/UpdateUser';
import { IDeleteVerificationCode } from '@/domain/usecases/verificationCode/DeleteVerificationCode';
import { IFindVerificationCode } from '@/domain/usecases/verificationCode/FindVerificationCode';
import { badRequest, conflict, noContent } from '@/presentation/helpers/httpHelpers';
import { IController } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { confirmEmailSchema } from '@/presentation/validations/authentication/confirmEmailSchema';

export class ConfirmEmailController implements IController {
  constructor(
    private readonly findUserByEmail: IFindUserByEmail,
    private readonly findVerificationCode: IFindVerificationCode,
    private readonly deleteVerificationCode: IDeleteVerificationCode,
    private readonly updateUser: IUpdateUser,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { success, data, error } = confirmEmailSchema.safeParse(httpRequest.body);

    if (!success) {
      return badRequest(error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })));
    }

    const { code, email } = data;

    const user = await this.findUserByEmail.findByEmail(email);

    if (!user) {
      return badRequest([{ field: 'email', message: 'E-mail not found' }]);
    }

    if (user.isEmailVerified) {
      return conflict({ message: 'Email already verified' });
    }

    const verificationCode = await this.findVerificationCode.find({ email, code });

    if (!verificationCode) {
      return badRequest([{ field: 'code', message: 'Invalid code' }]);
    }

    if (verificationCode.expiresAt < new Date()) {
      await this.deleteVerificationCode.delete({ email, code });

      return badRequest([{ field: 'code', message: 'Code expired' }]);
    }

    await this.deleteVerificationCode.delete({ email, code });

    await this.updateUser.update({
      id: user.id,
      isEmailVerified: true,
      email: user.email,
      name: user.name,
    });

    return noContent();
  }
}
