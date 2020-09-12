import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/Users';

interface RequestDTO {
    email: string;
    password: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: RequestDTO): Promise<any> {
        const usersRepository = getRepository(User);

        const hashedPassword = hash(password, 8);

        const user = await usersRepository.findOne({
            where: {email }
        });

        if (!user) {
            throw new Error('Incorrect email/password combination.');
        }
    }
}

export default AuthenticateUserService;