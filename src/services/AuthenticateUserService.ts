import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/Users';

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: {email }
        });

        if (!user) {
            throw new Error('Incorrect email/password combination.');
        }

        if (user.password) {
            const passwordMatched = await compare(password, user.password);
            if (!passwordMatched) {
                throw new Error('Incorrect email/password combination.');
            }
        }

        const token = sign({}, '1b15c3e498af28e16a2fd4cd978c4742', {
            subject: user.id,
            expiresIn: '1d',
        });

        return {
            user,
            token,
         };
    }
}

export default AuthenticateUserService;