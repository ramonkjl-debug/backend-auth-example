import { IHasher } from '@/domain/cryptography/hasher';
import { ICreateUser } from '@/domain/usecases/user/CreateUser';
import { ICreateVerificationCode } from '@/domain/usecases/verificationCode/CreateVerificationCode';
import { buildWelcomeEmailTemplate } from '@/presentation/helpers/emailTemplates/welcomeEmailTemplate';
import { badRequest, ok } from '@/presentation/helpers/httpHelpers';
import { IController } from '@/presentation/protocols/controller';
import { IEmailGateway } from '@/presentation/protocols/EmailGateways';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { signUpSchema } from '@/presentation/validations/authentication/signUpSchema';

export class SignUpController implements IController {
  constructor(
    private readonly createUser: ICreateUser,
    private readonly createVerificationCode: ICreateVerificationCode,
    private readonly hasher: IHasher,
    private readonly emailGateway: IEmailGateway,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { success, data, error } = signUpSchema.safeParse(httpRequest.body);

    if (!success) {
      return badRequest(error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })));
    }

    const { name, email, password, document } = data;

    const hashedPassword = await this.hasher.hash(password);

    const user = await this.createUser.create({ name, email, password: hashedPassword, document });

    const verificationCode = await this.createVerificationCode.create({
      email,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    });

    await this.emailGateway.sendEmail({
      from: `${process.env.APP_NAME}<${process.env.APP_EMAIL}>`,
      to: [email],
      subject: `Bem-vindo ao ${process.env.APP_NAME}! 🎉`,
      html: buildWelcomeEmailTemplate({
        name,
        verificationCode: verificationCode.code,
      }),
    });

    return ok(user);
  }
}
