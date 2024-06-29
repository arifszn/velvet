import 'reflect-metadata';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';
import AppDataSource from './configs/dataSource';
import { bootstrapCronJob } from './utils/cronJob.utils';
import swaggerUi from 'swagger-ui-express';
import apidoc from './apidoc.json';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*',
  }),
);
app.use('/api', routes);
app.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

if (process.env.DISPLAY_SWAGGER === 'true') {
  app.use(
    '/swagger',
    swaggerUi.serve,
    swaggerUi.setup(apidoc, {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
    }),
  );
}

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  }

  try {
    bootstrapCronJob();

    // Start the Express server
    app.listen(port, () => {
      console.log(`[server]: Server is running on port ${port}`);
    });

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[server]: Error starting server:', error);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    console.log('[server]: Shutting down gracefully...');
    console.log('[server]: Server has shut down.');
    process.exit(0);
  } catch (error) {
    console.error('[server]: Error during shutdown:', error);
    process.exit(1);
  }
}

startServer();
