import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { authorizeAdmin } from '../middlewares/admin.middleware';

const userRouter = Router();
const userController = new UserController();

userRouter.use(authenticateUser);

userRouter.get('/me', userController.getCurrentUser.bind(userController));

userRouter.get(
  '/',
  authorizeAdmin,
  userController.getPaginatedUsers.bind(userController),
);

userRouter.post(
  '/',
  authorizeAdmin,
  userController.createUser.bind(userController),
);

userRouter.get(
  '/:id(\\d+)/',
  authorizeAdmin,
  userController.getUserById.bind(userController),
);

userRouter.patch(
  '/:id(\\d+)/',
  authorizeAdmin,
  userController.updateUserById.bind(userController),
);

userRouter.delete(
  '/:id(\\d+)/',
  authorizeAdmin,
  userController.deleteUserById.bind(userController),
);

export default userRouter;
