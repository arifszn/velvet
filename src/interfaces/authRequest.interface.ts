import { Request } from 'express';
import { AuthJwtPayload } from './authJwtPayload.interface';

export interface AuthRequest extends Request {
  user?: AuthJwtPayload;
}
