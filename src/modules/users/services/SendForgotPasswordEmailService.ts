import path from 'path';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';


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

        const {token} = await this.userTokensRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Password recovery',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
                },
            },
        });

    }
}

export default SendForgotPasswordEmailService;