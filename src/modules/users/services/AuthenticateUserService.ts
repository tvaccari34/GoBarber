import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/error/AppError';

import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepositories from '../repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

class AuthenticateUserService {

    constructor(private usersRepository: IUsersRepositories){}

    public async execute({ email, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        if (user.password) {
            const passwordMatched = await compare(password, user.password);
            if (!passwordMatched) {
                throw new AppError('Incorrect email/password combination.', 401);
            }
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
         };
    }
}

export default AuthenticateUserService;