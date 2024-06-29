import { Expose, plainToInstance } from 'class-transformer';
import { z } from 'zod';

export const RegisterInput = z.object({
  name: z.string().max(100),
  email: z.string().email().max(200),
  password: z.string().max(255),
});

export const LoginInput = z.object({
  email: z.string().email().max(200),
  password: z.string().max(255),
});

export const RefreshTokenInput = z.object({
  refresh_token: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterInput>;
export type LoginInput = z.infer<typeof LoginInput>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenInput>;

export class AuthTokenOutput {
  @Expose({ name: 'accessToken' })
  access_token: number;

  @Expose({ name: 'refreshToken' })
  refresh_token: string;

  static fromEntity(authToken: {
    accessToken: string;
    refreshToken: string;
  }): AuthTokenOutput {
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }
}

export class AccessTokenOutput {
  @Expose({ name: 'accessToken' })
  access_token: number;

  static fromEntity(authToken: { accessToken: string }): AccessTokenOutput {
    return plainToInstance(AccessTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
