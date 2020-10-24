import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/error/AppError';
import IUsersRepositories from '../repositories/IUsersRepository';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {

    constructor(private usersRepository: IUsersRepositories){}

    public async execute({ name, email, password }: IRequest): Promise<User> {

        const checkUserExist = await this.usersRepository.findByEmail(email);

        if (checkUserExist) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({ name, email, password: hashedPassword });

        return user;

    }
}

export default CreateUserService;