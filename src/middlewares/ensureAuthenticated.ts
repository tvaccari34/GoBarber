import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import auth from '../config/auth';
import authConfig from '../config/auth';

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void{

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new Error('JWT token is missing.');
    }

    const [, token] = authHeader.split('Bearer ');



    try {
        const { secret } = authConfig.jwt;
        const authorizationDecoded = verify(token, secret);

        console.log(authorizationDecoded);

        return next();

    } catch {
        throw new Error('Invalid JWT token.')
    }
}