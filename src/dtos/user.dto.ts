import { z } from 'zod';
import { User } from '../entities/user.entity';
import { Expose, plainToInstance } from 'class-transformer';

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

export const DeleteUsersInput = z.object({
  ids: z.array(z.number()),
});

export type CreateUserInput = z.infer<typeof CreateUserInput>;
export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
export type DeleteUsersInput = z.infer<typeof DeleteUsersInput>;

export class UserOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  static fromEntity(user: User): UserOutput {
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  static fromEntities(users: User[]): UserOutput[] {
    return users.map((user) => this.fromEntity(user));
  }
}
