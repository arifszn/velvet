import { CreateUserInput, UpdateUserInput } from '@/dtos/user.dto';
import { User } from '@/entities/user.entity';
import { UserRepository } from '@/repositories/user.repository';
import { UniqueConstraintViolationException } from '@/exceptions/UniqueConstraintViolationException';
import { getUniqueConstraintViolationColumn } from '@/utils/dbErrorHelper.utils';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async getPaginatedUsers(
    page: number,
    limit: number,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    searchQuery?: string,
    status?: string[],
  ): Promise<{ users: User[]; count: number }> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    if (searchQuery) {
      queryBuilder.andWhere('users.email LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
      queryBuilder.andWhere('users.name LIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
    }

    if (status && status.length > 0) {
      queryBuilder.andWhere('users.status IN (:...status)', { status });
    }

    queryBuilder
      .orderBy(`users.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [users, count] = await queryBuilder.getManyAndCount();

    return { users, count };
  }

  public async getUserById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  public async createUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = this.userRepository.create({
        name: createUserInput.name,
        email: createUserInput.email,
        password: createUserInput.password,
      });
      return await this.userRepository.save(user);
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

  public async updateUserById(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User | undefined> {
    await this.userRepository.update(
      {
        id,
      },
      {
        name: updateUserInput.name,
        email: updateUserInput.email,
        password: updateUserInput.password,
      },
    );
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUsersByIds(ids: number[]): Promise<void> {
    await this.userRepository.delete(ids);
  }
}
