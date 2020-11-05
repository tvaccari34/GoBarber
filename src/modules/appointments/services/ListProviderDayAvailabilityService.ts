import { getHours } from 'date-fns';
import {injectable, inject} from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';


interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ){}

    public async execute({ provider_id, day, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.listDailyProviderAppointmens({
            provider_id,
            day,
            month,
            year
        });

        const hourStart = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (value, index) => index + hourStart,
        )

        const availability = eachHourArray.map(hour => {
            const hasAppointmentsInHour = appointments.find(appointment => {
                return getHours(appointment.date) === hour;
            });

            return {
                hour,
                available: !hasAppointmentsInHour,
            }
        });

        return availability;
    }
}

export default ListProviderDayAvailabilityService;