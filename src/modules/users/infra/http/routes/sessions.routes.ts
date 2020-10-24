import { Router } from 'express';
import AuthenticateUserSession from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionsRouter = Router();


interface User {
    name: string;
    email: string;
    password?: string;
    id: string;
    created_at: Date;
    updated_at: Date;
  }

sessionsRouter.post('/', async (request, response) => {

    const { email, password } = request.body;

    const usersRepository = new UsersRepository();

    const authenticateUser = new AuthenticateUserSession(usersRepository);

    const { user, token } = await authenticateUser.execute({
        email,
        password,
    });

    delete user.password;

    return response.json({ user, token });
});

export default sessionsRouter;