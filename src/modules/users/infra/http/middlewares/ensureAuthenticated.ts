import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '@shared/error/AppError';
import authConfig from '@config/auth';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void{

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing.', 401);
    }

    const [, token] = authHeader.split('Bearer ');

    try {
        const { secret } = authConfig.jwt;
        const authorizationDecoded = verify(token, secret);

        const { sub } = authorizationDecoded as TokenPayload;

        request.user = {
            id: sub,
        }

        return next();

    } catch {
        throw new AppError('Invalid JWT token.', 401)
    }
}