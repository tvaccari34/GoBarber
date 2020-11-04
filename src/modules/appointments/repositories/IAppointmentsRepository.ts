import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthlyProviderAppointmentDTO from '../dtos/IMonthlyProviderAppointmentDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    listMonthlyProviderAppointmens(data: IMonthlyProviderAppointmentDTO): Promise<Appointment[]>;
}