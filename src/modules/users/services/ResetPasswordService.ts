//import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';

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

        @inject('UserTokensProvider')
        private userTokensProvider: IUserTokensRepository,

    ){}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensProvider.findByToken(token);

        if (!userToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id)

        if (!user) {
            throw new AppError('User does not exists');
        }

        user.password = password;

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;