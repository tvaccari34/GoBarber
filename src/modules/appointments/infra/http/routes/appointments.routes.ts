import { Router } from 'express';
import { parseISO } from 'date-fns';
import {container} from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';


const appointmentsRouter = Router();


//Will apply the ensureAuthenticated middleware for all routes
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//     console.log(request.user);
//     const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// })

appointmentsRouter.post('/', async (request, response) => {

    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService)
    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate
    });

    return response.json(appointment);

});

export default appointmentsRouter;