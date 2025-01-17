import { Response } from 'express';
import { UserService } from '@/services/user.service';
import {
  CreateUserInput,
  QueryUsersInput,
  UpdateUserInput,
  UserOutput,
} from '@/dtos/user.dto';
import { AuthRequest } from '@/interfaces/authRequest.interface';
import { ErrorMessages } from '@/enums/message.enum';
import { BaseController } from '@/controllers/base.controller';

export class UserController extends BaseController {
  private readonly userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  public async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({ message: ErrorMessages.UserNotFound });
        return;
      }
      res.status(200).json(UserOutput.fromEntity(user));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async getPaginatedUsers(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const {
        page,
        limit,
        search_query: searchQuery,
        status,
        sortOrder,
        sortBy,
      } = QueryUsersInput.parse(req.query);
      const { users, count } = await this.userService.getPaginatedUsers(
        page,
        limit,
        sortBy,
        sortOrder,
        searchQuery,
        status,
      );

      res
        .status(200)
        .json({ data: UserOutput.fromEntities(users), meta: { count } });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: ErrorMessages.UserNotFound });
        return;
      }

      res.status(200).json(UserOutput.fromEntity(user));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const createUserInput = CreateUserInput.parse(req.body);
      const user = await this.userService.createUser(createUserInput);
      res.status(201).json(UserOutput.fromEntity(user));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updateUserInput = UpdateUserInput.parse(req.body);
      const user = await this.userService.updateUserById(id, updateUserInput);
      if (!user) {
        res.status(404).json({ message: ErrorMessages.ResourceNotFound });
        return;
      }
      res.status(200).json(UserOutput.fromEntity(user));
    } catch (error) {
      this.handleError(res, error);
    }
  }

  public async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: ErrorMessages.UserNotFound });
        return;
      }

      await this.userService.deleteUsersByIds([id]);
      res.status(204).send();
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
