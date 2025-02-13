import { User } from '@/entities/user.entity';
import { UserRepository } from '@/repositories/user.repository';
import { getUniqueConstraintViolationColumn } from '@/utils/dbErrorHelper.utils';
import { UniqueConstraintViolationException } from '@/exceptions/uniqueConstraintViolation.exception';
import { LoginInput, RefreshTokenInput, RegisterInput } from '@/dtos/auth.dto';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@/exceptions/unauthorized.exception';
import { UserStatus } from '@/enums/userStatus.enum';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '@/constants/jwt.constant';
import { AuthJwtPayload } from '@/interfaces/authJwtPayload.interface';
import { ErrorMessages } from '@/enums/message.enum';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(data: RegisterInput): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = this.userRepository.create(data);
      await this.userRepository.save(user);
      return {
        accessToken: this.generateAccessToken(user),
        refreshToken: this.generateRefreshToken(user),
      };
    } catch (error) {
      const uniqueConstraintKey = getUniqueConstraintViolationColumn(error);
      if (uniqueConstraintKey) {
        throw new UniqueConstraintViolationException(
          `The ${uniqueConstraintKey} already exists`,
        );
      }
      throw error;
    }
  }

  public async login(data: LoginInput): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { email: data.email, status: UserStatus.ACTIVE },
    });
    if (!user || !(await user.validatePassword(data.password))) {
      throw new UnauthorizedException(ErrorMessages.InvalidCredentials);
    }
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  public async refreshToken(data: RefreshTokenInput): Promise<string> {
    try {
      const payload = jwt.verify(
        data.refresh_token,
        REFRESH_TOKEN_SECRET,
      ) as AuthJwtPayload;

      const user = await this.userRepository.findOne({
        where: { id: payload.id, status: UserStatus.ACTIVE },
      });
      if (!user) {
        throw new UnauthorizedException(ErrorMessages.InvalidRefreshToken);
      }
      return this.generateAccessToken(user);
    } catch (error) {
      throw new UnauthorizedException(
        error?.message || ErrorMessages.InvalidRefreshToken,
      );
    }
  }

  private generateAccessToken(user: User): string {
    const payload: AuthJwtPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    });
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
    });
  }
}
