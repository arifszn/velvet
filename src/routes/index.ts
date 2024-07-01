import { Router } from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import articleRouter from './article.route';

const router = Router();

router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/articles', articleRouter);

export default router;
