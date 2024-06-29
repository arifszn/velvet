import { CreateUserInput, UpdateUserInput } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { isUniqueConstraintViolationError } from '../utils/dbErrorHelper.utils';
import { UniqueConstraintViolationException } from '../exceptions/UniqueConstraintViolationException';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async getPaginated(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; count: number }> {
    const [users, count] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { users, count };
  }

  public async getById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  public async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const user = this.userRepository.create(createUserInput);
      return this.userRepository.save(user);
    } catch (error) {
      if (isUniqueConstraintViolationError(error)) {
        throw new UniqueConstraintViolationException();
      }
      throw error;
    }
  }

  public async updateById(
    id: number,
    UpdateUserInput: UpdateUserInput,
  ): Promise<User | undefined> {
    await this.userRepository.update(id, UpdateUserInput);
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteByIds(ids: number[]): Promise<void> {
    await this.userRepository.delete(ids);
  }
}
