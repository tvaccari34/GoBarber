import User from '@modules/users/infra/typeorm/entities/Users';
import path from 'path';
import fs from 'fs';
import AppError from '@shared/error/AppError';
import {injectable, inject} from 'tsyringe';

import uploadConfig from '@config/upload';
import IUsersRepositories from '../repositories/IUsersRepository';



interface IRequest {
    user_id: string,
    avatarFileName: string,
}

@injectable()
class UpdateUserAvatarService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories
    ){}

    public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        if (user.avatar) {
            //Remove avatar
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName;

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;