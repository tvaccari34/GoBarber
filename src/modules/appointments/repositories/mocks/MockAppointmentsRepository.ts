import {uuid} from 'uuidv4';
import {isEqual, getMonth, getYear, getDate } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthlyProviderAppointmentDTO from '@modules/appointments/dtos/IMonthlyProviderAppointmentDTO';
import IDailyProviderAppointmentDTO from '@modules/appointments/dtos/IDailyProviderAppointmentDTO';


class AppointmentsRepository
    implements IAppointmentRepository {

    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {

        const findAppointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date));

        return findAppointment;
    }

    public async listMonthlyProviderAppointmens({ provider_id, month, year }: IMonthlyProviderAppointmentDTO): Promise<Appointment[]> {

        const appointments = this.appointments.filter(appointment =>
            appointment.provider_id == provider_id &&
            getMonth(appointment.date) + 1 == month &&
            getYear(appointment.date) == year
        );

        return appointments;
    }

    public async listDailyProviderAppointmens({ provider_id, day, month, year }: IDailyProviderAppointmentDTO): Promise<Appointment[]> {

        const appointments = this.appointments.filter(appointment =>
            appointment.provider_id == provider_id &&
            getDate(appointment.date) == day &&
            getMonth(appointment.date) + 1 == month &&
            getYear(appointment.date) == year
        );

        return appointments;
    }


    public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment>{
        const appointment = new Appointment();

        Object.assign(appointment, { id: uuid(), date, provider_id});

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;