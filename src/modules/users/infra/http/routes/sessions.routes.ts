import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SessionsController from '../controllers/SessionsController';


const sessionsRouter = Router();
const sessionController = new SessionsController;


interface User {
    name: string;
    email: string;
    password?: string;
    id: string;
    created_at: Date;
    updated_at: Date;
  }

sessionsRouter.post('/', celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }
}), sessionController.create);

export default sessionsRouter;