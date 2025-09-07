import jwt from 'jsonwebtoken';

import { IDecrypter } from '@/domain/cryptography/decrypter';
import { IEncrypter } from '@/domain/cryptography/encrypter';

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: any): Promise<string> {
    return jwt.sign(value, this.secret);
  }

  async decrypt(value: string): Promise<Record<string, unknown> | null> {
    try {
      return jwt.verify(value, this.secret) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
