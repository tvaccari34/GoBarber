import { Repository, EntityRepository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';


@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>
    implements IAppointmentRepository {
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // const findAppointment = this.appointments.find(appointment =>
        //     isEqual(date, appointment.date),
        // );

        const findAppointment = await this.findOne({
            where: { date }
        });

        return findAppointment;
    }
}

export default AppointmentsRepository;