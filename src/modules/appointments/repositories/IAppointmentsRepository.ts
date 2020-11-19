import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthlyProviderAppointmentDTO from '../dtos/IMonthlyProviderAppointmentDTO';
import IDailyProviderAppointmentDTO from '../dtos/IDailyProviderAppointmentDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
    listMonthlyProviderAppointmens(data: IMonthlyProviderAppointmentDTO): Promise<Appointment[]>;
    listDailyProviderAppointmens(data: IDailyProviderAppointmentDTO): Promise<Appointment[]>;
}