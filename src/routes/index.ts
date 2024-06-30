import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';

const router = Router();

router.use('/', authRouter);
router.use('/users', userRouter);

export default router;
