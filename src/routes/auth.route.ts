import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/authMiddleware';

const authRouter = Router();
const authController = new AuthController();
const userController = new UserController();

authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post(
  '/refresh-token',
  authController.refreshToken.bind(authController),
);
authRouter.get('/me', authenticateUser, userController.me.bind(userController));

export default authRouter;
