export class UniqueConstraintViolationException extends Error {
  constructor(message: string = 'Resource already exists') {
    super(message);
    this.name = 'UniqueConstraintViolationException';
    Object.setPrototypeOf(this, UniqueConstraintViolationException.prototype);
  }
}
