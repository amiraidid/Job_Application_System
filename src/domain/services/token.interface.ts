export interface ITokenService {
  sign(payload: any): string;
  verify(token: string): any;
}

export const ITokenService_REPO = Symbol('ITokenService_REPO');
