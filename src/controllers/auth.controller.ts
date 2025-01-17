import { Request, Response } from 'express';
import {
  AccessTokenOutput,
  AuthTokenOutput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from '@/dtos/auth.dto';
import { AuthService } from '@/services/auth.service';
import { BaseController } from '@/controllers/base.controller';

export class AuthController extends BaseController {
  private readonly authService: AuthService;

  constructor() {
    super();
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
      this.handleError(res, error);
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
      this.handleError(res, error);
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
      this.handleError(res, error);
    }
  }
}
