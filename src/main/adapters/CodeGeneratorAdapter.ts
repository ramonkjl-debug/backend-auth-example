import { ICodeGenerator } from '@/data/protocols/CodeGenerator';

export class CodeGeneratorAdapter implements ICodeGenerator {
  async generate(_value?: string): Promise<string> {
    const promise = new Promise<string>((resolve) => {
      resolve(Math.floor(100000 + Math.random() * 900000).toString());
    });

    const code = await promise;

    return code;
  }
}
