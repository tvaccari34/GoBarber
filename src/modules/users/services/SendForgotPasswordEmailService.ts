//import User from '@modules/users/infra/typeorm/entities/Users';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import {injectable, inject} from 'tsyringe';

//import AppError from '@shared/error/AppError';
import IUsersRepositories from '../repositories/IUsersRepository';

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

    ){}

    public async execute({ email }: IRequest): Promise<void> {
        this.mailProvider.sendMail(email, 'Recovery email received');

    }
}

export default SendForgotPasswordEmailService;