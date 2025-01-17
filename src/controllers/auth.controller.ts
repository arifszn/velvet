import { Request, Response } from 'express';
import { z } from 'zod';
import { UniqueConstraintViolationException } from '@/exceptions/uniqueConstraintViolation.exception';
import {
  AccessTokenOutput,
  AuthTokenOutput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from '@/dtos/auth.dto';
import { AuthService } from '@/services/auth.service';
import { UnauthorizedException } from '@/exceptions/unauthorized.exception';
import { ErrorMessages } from '@/enums/message.enum';
import logger from '@/utils/logger.utils';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const registerInput = RegisterInput.parse(req.body);
      const { accessToken, refreshToken } =
        await this.authService.register(registerInput);

      res.status(201).json(
        AuthTokenOutput.fromEntity({
          accessToken,
          refreshToken,
        }),
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else if (error instanceof UniqueConstraintViolationException) {
        res.status(409).json({
          message: error?.message,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const loginInput = LoginInput.parse(req.body);
      const { accessToken, refreshToken } =
        await this.authService.login(loginInput);

      res.status(200).json(
        AuthTokenOutput.fromEntity({
          accessToken,
          refreshToken,
        }),
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else if (error instanceof UnauthorizedException) {
        res.status(401).json({
          message: error?.message || ErrorMessages.Unauthorized,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshTokenInput = RefreshTokenInput.parse(req.body);
      const accessToken =
        await this.authService.refreshToken(refreshTokenInput);

      res.status(200).json(
        AccessTokenOutput.fromEntity({
          accessToken,
        }),
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else if (error instanceof UnauthorizedException) {
        res.status(401).json({
          message: error?.message || ErrorMessages.Unauthorized,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
    }
  }
}
