import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, 'VALIDATION_ERROR', 400);
  }
}
