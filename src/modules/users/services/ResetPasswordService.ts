//import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';
import { differenceInMinutes } from 'date-fns';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

//import AppError from '@shared/error/AppError';
import IUsersRepositories from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories,

        @inject('UserTokensRepository')
        private UserTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

    ){}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.UserTokensRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id)

        if (!user) {
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = userToken.created_at;

        console.log(Date.now());
        console.log(new Date())
        console.log(tokenCreatedAt);

        const tokentExpiration = differenceInMinutes(Date.now(), tokenCreatedAt);

        if (tokentExpiration > 30) {
            throw new AppError('Token expired');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;