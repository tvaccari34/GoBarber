import { Router } from 'express';
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

sessionsRouter.post('/', sessionController.create);

export default sessionsRouter;