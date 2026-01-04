import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { tenantWriteValidationMiddleware } from './middleware/multi-tenant.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    // Guard middleware application: some Prisma client builds / runtimes
    // may not expose `$use`. Check before calling to avoid startup crash.
    // If `$use` is not available we skip middleware and warn.
    const maybeUse = (this as unknown as { $use?: (middleware: any) => void })
      .$use;
    if (typeof maybeUse === 'function') {
      // coerce middleware to `any` to avoid unsafe-call errors from its inferred type
      const middleware: any = tenantWriteValidationMiddleware();
      maybeUse.call(this, middleware);
    } else {
      console.warn(
        'Prisma client does not support $use() - skipping tenant middleware',
      );
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
