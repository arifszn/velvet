import { QueryFailedError } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUniqueConstraintViolationError(error: any): boolean {
  return (
    error instanceof QueryFailedError &&
    error.driverError &&
    error.driverError.code === 'ER_DUP_ENTRY'
  );
}
