import User from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';

import IUsersRepositories from '../repositories/IUsersRepository';

interface IRequest {
    user_id: string,
}

@injectable()
class ShowProfileService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories,
    ){}

    public async execute({ user_id }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found.');
        }

        return user;

    }
}

export default ShowProfileService;