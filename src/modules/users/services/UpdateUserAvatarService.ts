import { getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/Users';
import path from 'path';
import fs from 'fs';
import AppError from '@shared/error/AppError';

import uploadConfig from '@config/upload';



interface RequestDTO {
    user_id: string,
    avatarFileName: string,
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFileName }: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id)

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

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;