import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';

import IUsersRepositories from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    user_id: string,
    name: string,
    email: string,
    old_password?: string,
    password?: string,
}

@injectable()
class UpdateProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ){}

    public async execute({ user_id, name, email, old_password, password }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id != user_id) {
            throw new AppError('Email already exists.');
        }

        user.name = name;
        user.email = email;

        if(password && !old_password)
        {
            throw new AppError('Old password should be informed.')
        }


        if (password && user.password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            )

            if (!checkOldPassword) {
                throw new AppError('Old password does not match.')
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        const updatedUser = await this.usersRepository.save(user);

        return updatedUser;

    }
}

export default UpdateProfileService;