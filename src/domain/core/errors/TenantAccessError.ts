// core/errors/TenantAccessError.ts
import { AppError } from './AppError';

export class TenantAccessError extends AppError {
  constructor(message = 'Access denied for this tenant') {
    super(message, 'TENANT_ACCESS_DENIED', 403);
  }
}
