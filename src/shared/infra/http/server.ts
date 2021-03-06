import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/error/AppError';
import routes from './routes';


import '@shared/infra/typeorm';
import '@shared/container';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(rateLimiter);

app.use(routes);

app.use(errors());

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'Error',
            message: error.message,
        });
    }

    console.log(error);

    return response.status(500).json({
        status: 'Error',
        message: 'Internal server error',
    });
});

app.listen(3333, () => {
    console.log('🚀 Server started on port 3333!');
});