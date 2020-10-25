import { Router } from 'express';
import {container} from 'tsyringe';
import AuthenticateUserSession from '@modules/users/services/AuthenticateUserService';

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

    const authenticateUser = container.resolve(AuthenticateUserSession);

    const { user, token } = await authenticateUser.execute({
        email,
        password,
    });

    delete user.password;

    return response.json({ user, token });
});

export default sessionsRouter;