/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  private strategy = new JwtStrategy();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();
    const auth = req.headers.authorization;
    if (!auth) throw new UnauthorizedException('No token');

    const payload = await this.strategy.validate(auth);
    if (!payload) throw new UnauthorizedException('Invalid token');

    req.user = payload;
    return true;
  }
}
