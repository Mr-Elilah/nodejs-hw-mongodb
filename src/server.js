import cors from 'cors';
import dotenv from 'dotenv';
import router from './routers/index.js';
import express from 'express';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { UPLOAD_DIR } from './constants/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: `Server is running on port ${PORT}`,
    });
  });

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
