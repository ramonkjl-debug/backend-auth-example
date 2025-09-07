export interface IDeleteVerificationCode {
  delete(params: { email: string; code: string }): Promise<void>;
}
