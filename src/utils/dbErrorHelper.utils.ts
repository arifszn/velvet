import { QueryFailedError } from 'typeorm';
import { UNIQUE_CONSTRAINT } from '../constants/uniqueConstraint.constant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUniqueConstraintViolationColumn(error: any): string | null {
  if (
    error instanceof QueryFailedError &&
    error.driverError &&
    error.driverError.code === 'ER_DUP_ENTRY'
  ) {
    const match = error.driverError.message.match(/for key '([^']+)'/);
    if (match) {
      const constraintKey = match[1];
      for (const key in UNIQUE_CONSTRAINT) {
        if (constraintKey.endsWith(UNIQUE_CONSTRAINT[key].indexName)) {
          return UNIQUE_CONSTRAINT[key].columnName;
        }
      }
      return constraintKey;
    }
  }
  return null;
}
