import { Router } from 'express';
import AuthenticateUserSession from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {

    try {
        const { email, password } = request.body;

        const authenticateUser = new AuthenticateUserSession();

        const response = await authenticateUser.execute({
            email,
            password,
        });

        return response.json({ ok: true });
    } catch (error) {
        return response.status(400).json({error: error.message})
    }
});

export default sessionsRouter;