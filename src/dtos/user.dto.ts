import { z } from 'zod';
import { User } from '../entities/user.entity';
import { Expose, plainToInstance } from 'class-transformer';
import { BaseQueryInput } from './baseQuery.dto';
import { UserStatus } from '../constants/userStatus.constant';

export const CreateUserInput = z.object({
  name: z.string().max(100),
  email: z.string().email().max(200),
  password: z.string().max(255),
});

export const UpdateUserInput = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().max(200).optional(),
  password: z.string().max(255).optional(),
});

export const QueryUsersInput = BaseQueryInput.extend({
  status: z.nativeEnum(UserStatus).array().optional(),
  sortBy: z.enum(['status', 'createdAt', 'name']).default('createdAt'),
});

export type CreateUserInput = z.infer<typeof CreateUserInput>;
export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
export type QueryUsersInput = z.infer<typeof QueryUsersInput>;

export class UserOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose({ name: 'created_at' })
  created_at: Date;

  static fromEntity(user: User): UserOutput {
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  static fromEntities(users: User[]): UserOutput[] {
    return users.map((user) => this.fromEntity(user));
  }
}
