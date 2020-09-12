import { Router } from 'express';
import AuthenticateUserSession from '../services/AuthenticateUserService';

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

    try {
        const { email, password } = request.body;

        const authenticateUser = new AuthenticateUserSession();

        const { user } = await authenticateUser.execute({
            email,
            password,
        });

        delete user.password;

        return response.json({ user });
    } catch (error) {
        return response.status(400).json({error: error.message})
    }
});

export default sessionsRouter;