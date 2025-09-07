import { IEncrypter } from '@/domain/cryptography/encrypter';
import { IHashComparer } from '@/domain/cryptography/hashComparer';
import { IFindUserByEmail } from '@/domain/usecases/user/FindUserByEmail';
import { badRequest, ok, unauthorized } from '@/presentation/helpers/httpHelpers';
import { IController } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { signInSchema } from '@/presentation/validations/authentication/signInSchema';

export class SignInController implements IController {
  constructor(
    private readonly findUserByEmailRepository: IFindUserByEmail,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { success, data, error } = signInSchema.safeParse(httpRequest.body);

    if (!success) {
      return badRequest(error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })));
    }

    const { email, password } = data;

    const user = await this.findUserByEmailRepository.findByEmail(email);

    if (!user) {
      return unauthorized({ message: 'Credentials are incorrect' });
    }

    const isValid = await this.hashComparer.compare(password, user.password);

    if (!isValid) {
      return unauthorized({ message: 'Credentials are incorrect' });
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id
    });

    return ok({ accessToken });
  }
}
