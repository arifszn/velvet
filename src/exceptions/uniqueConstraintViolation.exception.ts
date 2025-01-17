import { ErrorMessages } from '@/enums/message.enum';

export class UniqueConstraintViolationException extends Error {
  constructor(message: string = ErrorMessages.Conflict) {
    super(message);
    this.name = 'UniqueConstraintViolationException';
    Object.setPrototypeOf(this, UniqueConstraintViolationException.prototype);
  }
}
