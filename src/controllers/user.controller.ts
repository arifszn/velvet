import { Response } from 'express';
import { UserService } from '../services/user.service';
import { UserOutput } from '../dtos/user.dto';
import { AuthRequest } from '../interfaces/authRequest.interface';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await this.userService.getById(req.user.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(UserOutput.fromEntity(user));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  }
}
