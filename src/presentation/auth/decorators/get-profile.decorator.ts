/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: unknown;
}

export const GetProfile = createParamDecorator(
  (field: string | undefined, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest<RequestWithUser>().user;
    return field ? user?.[field] : user;
  },
);
