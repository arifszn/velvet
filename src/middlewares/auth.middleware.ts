import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/jwt.constant';
import { AuthJwtPayload } from '../interfaces/authJwtPayload.interface';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { UserService } from '../services/user.service';
import { UserStatus } from '../constants/userStatus.constant';
import { ErrorMessages } from '../constants/message.constant';

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
      .json({ message: ErrorMessages.InvalidOrMissingAccessToken });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthJwtPayload;

    const user = await userService.getUserById(payload.id);

    if (!user) {
      return res.status(401).json({ message: ErrorMessages.UserNotFound });
    }

    if (user.status !== UserStatus.ACTIVE) {
      return res.status(403).json({ message: ErrorMessages.UserInactive });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: ErrorMessages.InvalidAccessToken });
  }
};
