import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { IEmailGateway, SendEmailParams } from '@/presentation/protocols/EmailGateways';

import { env } from '../config/env';

export class SESGatewayAdapter implements IEmailGateway {
  async sendEmail({ from, to, subject, html }: SendEmailParams): Promise<void> {
    const sesClient = new SESClient({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
      },
    });

    const sendEmailCommand = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
      },
    });

    await sesClient.send(sendEmailCommand);
  }
}
