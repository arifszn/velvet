import { Router, Request, Response } from 'express';
import authRouter from './auth.route';

const router = Router();

router.get('/status', (_: Request, res: Response) =>
  res.status(200).send('OK'),
);
router.use('/', authRouter);

export default router;
