import { Router } from 'express';
import authRouter from '@/routes/auth.route';
import userRouter from '@/routes/user.route';
import articleRouter from '@/routes/article.route';

const router = Router();

router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/articles', articleRouter);

export default router;
