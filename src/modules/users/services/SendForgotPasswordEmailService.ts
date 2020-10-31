//import User from '@modules/users/infra/typeorm/entities/Users';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';

//import AppError from '@shared/error/AppError';
import IUsersRepositories from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

    ){}

    public async execute({ email }: IRequest): Promise<void> {

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email address does not exists.');
        }

        await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail(email, 'Recovery email received');

    }
}

export default SendForgotPasswordEmailService;