import { IDecrypter } from '@/domain/cryptography/decrypter';
import { IFindUserById } from '@/domain/usecases/user/FindUserById';
import { ok, unauthorized } from '@/presentation/helpers/httpHelpers';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { IMiddleware } from '@/presentation/protocols/middleware';

export class AuthenticationMiddleware implements IMiddleware {
  constructor(
    private readonly findUserById: IFindUserById,
    private readonly decrypter: IDecrypter,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { authorization } = httpRequest.headers;

    if (!authorization) {
      return unauthorized({
        message: 'Unauthorized',
      });
    }

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      return unauthorized({ message: 'Unauthorized' });
    }

    const payload = await this.decrypter.decrypt(token) as { sub: string; role: string; tenantId: string };

    if (!payload) {
      return unauthorized({ message: 'Unauthorized' });
    }

    const { sub } = payload;

    const user = await this.findUserById.findById(sub);

    if (!user) {
      return unauthorized({ message: 'Unauthorized' });
    }

    return ok({
      account: {
        userId: user.id,
      },
    });
  }
}
