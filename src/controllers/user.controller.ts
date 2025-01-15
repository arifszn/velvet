import { Response } from 'express';
import { UserService } from '@/services/user.service';
import {
  CreateUserInput,
  QueryUsersInput,
  UpdateUserInput,
  UserOutput,
} from '@/dtos/user.dto';
import { AuthRequest } from '@/interfaces/authRequest.interface';
import { z } from 'zod';
import { ErrorMessages } from '@/constants/message.constant';
import { UniqueConstraintViolationException } from '@/exceptions/UniqueConstraintViolationException';
import logger from '@/utils/logger.utils';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(UserOutput.fromEntity(user));
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
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
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
        });
      } else {
        logger.error(error);
        res.status(500).json({
          message: error?.message || ErrorMessages.InternalServerError,
        });
      }
    }
  }

  public async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: ErrorMessages.ResourceNotFound });
      }

      res.status(200).json(UserOutput.fromEntity(user));
    } catch (error) {
      logger.error(error);
      res
        .status(500)
        .json({ message: error?.message || ErrorMessages.InternalServerError });
    }
  }

  public async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const createUserInput = CreateUserInput.parse(req.body);
      const user = await this.userService.createUser(createUserInput);
      res.status(201).json(UserOutput.fromEntity(user));
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

  public async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: ErrorMessages.ResourceNotFound });
        return;
      }

      await this.userService.deleteUsersByIds([id]);
      res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errors: error.errors,
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
