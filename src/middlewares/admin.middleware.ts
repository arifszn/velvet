import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/interfaces/authRequest.interface';
import { ErrorMessages } from '@/enums/message.enum';

export const authorizeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: ErrorMessages.Unauthorized });
  }
  next();
};
