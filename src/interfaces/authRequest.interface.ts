import { Request } from 'express';
import { AuthJwtPayload } from '@/interfaces/authJwtPayload.interface';

export interface AuthRequest extends Request {
  user?: AuthJwtPayload;
}
