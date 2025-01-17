import { z } from 'zod';
import { UniqueConstraintViolationException } from '@/exceptions/uniqueConstraintViolation.exception';
import { Response } from 'express';
import logger from '@/utils/logger.utils';
import { ErrorMessages } from '@/enums/message.enum';

export class BaseController {
  protected handleError(res: Response, error: unknown): void {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else if (error instanceof UniqueConstraintViolationException) {
      res.status(409).json({ message: error?.message });
    } else {
      logger.error(error);
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : ErrorMessages.InternalServerError,
      });
    }
  }
}
