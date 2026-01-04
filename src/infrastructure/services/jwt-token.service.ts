/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ITokenService } from 'src/domain/services/token.interface';
import * as jwt from 'jsonwebtoken';

export class JwtTokenService implements ITokenService {
  private readonly secret = process.env.JWT_SECRET;
  sign(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1d' });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
