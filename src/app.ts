import 'reflect-metadata';
import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
import routes from '@/routes';
import helmet from 'helmet';
import cors from 'cors';
import AppDataSource from '@/configs/dataSource';
import { bootstrapCronJob } from '@/utils/cronJob.utils';
import { setupDocRoutes } from '@/routes/doc.route';
import { CSP_CONFIG } from '@/constants/CSP.constant';
import logger from '@/utils/logger.utils';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(helmet(CSP_CONFIG));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
  }),
);
app.get('/', (_, res: Response) => {
  res.json({ status: 'OK' });
});
app.use('/api', routes);

setupDocRoutes(app);

async function startServer() {
  try {
    await AppDataSource.initialize();
    logger.info('Data Source has been initialized!');
  } catch (err) {
    logger.error('Error during Data Source initialization', err);
    process.exit(1);
  }

  try {
    bootstrapCronJob();

    // Start the Express server
    app.listen(port, () => {
      logger.info(`[server]: Server is running on port ${port}`);
    });

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('[server]: Error starting server:', error);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    logger.info('[server]: Shutting down gracefully...');
    logger.info('[server]: Server has shut down.');
    process.exit(0);
  } catch (error) {
    logger.error('[server]: Error during shutdown:', error);
    process.exit(1);
  }
}

startServer();

export default app;
