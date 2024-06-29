import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateRequestBody = (
  schema: ZodSchema<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      return res.status(400).json({ errors: e.errors });
    }
  };
};

export default validateRequestBody;
