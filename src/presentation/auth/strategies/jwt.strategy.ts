/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ITokenService } from 'src/domain/services/token.interface';
import { JwtTokenService } from 'src/infrastructure/services/jwt-token.service';

@Injectable()
export class JwtStrategy {
  private jwtService: ITokenService = new JwtTokenService();

  async validate(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return error;
    }
  }
}
