import { JwtPayload } from 'jsonwebtoken';

export interface AuthJwtPayload extends JwtPayload {
  id: number;
  email: string;
  isAdmin: boolean;
}
