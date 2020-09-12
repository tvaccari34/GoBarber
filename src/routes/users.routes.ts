import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';


const usersRouter = Router();

interface User {
  name: string;
  email: string;
  password?: string;
  id: string;
  created_at: Date;
  updated_at: Date;
}


usersRouter.post('/', async (request, response) => {

    try {

        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user: User = await createUser.execute({
            name,
            email,
            password
        });

        delete user.password;

        return response.json(user);
    } catch (error) {
        return response.status(400).json({error: error.message})
    }
});

export default usersRouter;