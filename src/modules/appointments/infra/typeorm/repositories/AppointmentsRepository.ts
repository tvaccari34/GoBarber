import { getRepository, Raw, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IMonthlyProviderAppointmentDTO from '@modules/appointments/dtos/IMonthlyProviderAppointmentDTO';
import IDailyProviderAppointmentDTO from '@modules/appointments/dtos/IDailyProviderAppointmentDTO';


class AppointmentsRepository
    implements IAppointmentRepository {

    private ormRepository: Repository<Appointment>

    constructor() {
        this.ormRepository = getRepository(Appointment);

    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {

        const findAppointment = await this.ormRepository.findOne({
            where: { date }
        });

        return findAppointment;
    }

    public async listMonthlyProviderAppointmens({ provider_id, month, year }: IMonthlyProviderAppointmentDTO): Promise<Appointment[]> {
        const parsedMonth = month.toString().padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'MM-YYYY') - '${month}-${year}'`
                ),
             }
        });

        return appointments;
    }

    public async listDailyProviderAppointmens({ provider_id, day, month, year }: IDailyProviderAppointmentDTO): Promise<Appointment[]> {
        const parsedDay = day.toString().padStart(2, '0');
        const parsedMonth = month.toString().padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName =>
                    `to_char(${dateFieldName}, 'DD-MM-YYYY') - '${parsedDay}-${parsedMonth}-${year}'`
                ),
             }
        });

        return appointments;
    }


    public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment>{
        const appointment = this.ormRepository.create({provider_id, date});

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;