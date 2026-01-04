/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { ICOMPANY_REPO } from 'src/domain/repositories/company.repository';
import type { ICompanyRepository } from 'src/domain/repositories/company.repository';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(@Inject(ICOMPANY_REPO) private companyRepo: ICompanyRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: any; tenantId?: string }>();

    // Resolve tenant from JWT payload if present
    let resolvedTenant: string | undefined =
      req.user?.companyId || req.user?.company || undefined;

    // Fallback to route param if provided
    const paramTenant = (req.params as any)?.tenantId;
    if (!resolvedTenant && paramTenant) resolvedTenant = paramTenant;

    if (!resolvedTenant) {
      throw new ForbiddenException('Tenant could not be resolved');
    }

    // Validate tenant exists
    try {
      const company = await this.companyRepo.GetCompanyById(resolvedTenant);
      if (!company) throw new Error('Not found');
    } catch (err) {
      throw new ForbiddenException(err || 'Invalid tenant');
    }

    // If both param and resolved tenant present, validate they match
    if (paramTenant && resolvedTenant && paramTenant !== resolvedTenant) {
      throw new ForbiddenException('Tenant mismatch');
    }

    // Attach resolved tenant to request for downstream handlers
    req.tenantId = resolvedTenant;
    return true;
  }
}
