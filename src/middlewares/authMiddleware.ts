import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/jwt.constant';
import { AuthJwtPayload } from '../interfaces/authJwtPayload.interface';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { UserService } from '../services/user.service';
import { UserStatus } from '../constants/userStatus.constant';

const userService = new UserService();

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access token is missing or invalid' });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthJwtPayload;

    const user = await userService.getById(payload.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status !== UserStatus.ACTIVE) {
      return res.status(403).json({ message: 'User is not active' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid access token' });
  }
};
