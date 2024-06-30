import { CONFLICT_ERROR_MESSAGE } from '../constants/message.constant';

export class UniqueConstraintViolationException extends Error {
  constructor(message: string = CONFLICT_ERROR_MESSAGE) {
    super(message);
    this.name = 'UniqueConstraintViolationException';
    Object.setPrototypeOf(this, UniqueConstraintViolationException.prototype);
  }
}
