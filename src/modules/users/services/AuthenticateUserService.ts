import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/Users';
import IUsersRepositories from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ){}

    public async execute({ email, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        if (user.password) {
            const passwordMatched = await this.hashProvider.compareHash(password, user.password);
            if (!passwordMatched) {
                throw new AppError('Incorrect email/password combination.', 401);
            }
        }

        const { secret, expiresIn } = authConfig.jwt;

        if (!secret) {
            throw new AppError('It is not possible to log in. Please, contact the system administrator.');
        }

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