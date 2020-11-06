import { getHours, isBefore, startOfHour, format } from 'date-fns';
import {injectable, inject} from 'tsyringe';

import AppError from '@shared/error/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {

    constructor(

        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ){}

    public async execute({provider_id, user_id, date}: IRequest): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError('It is not possible to create an appointment in the past');
        }

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked.');
        }

        if (provider_id === user_id) {
            throw new AppError('It is not possible to create an appointment for yourself.');
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
            throw new AppError('It is not possible to create an appointment outside the available schedule.')
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate
        });

        const dateFormatted = format(appointmentDate, "dd-MM-yyyy 'at' HH:mm'h'");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `New appointment ${dateFormatted}`});

        return appointment;

    }
}

export default CreateAppointmentService;