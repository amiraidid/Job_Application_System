import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN RESOURCE', 403);
  }
}
