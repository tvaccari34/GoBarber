import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './error/AppError';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory))

app.use(routes);

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