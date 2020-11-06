import MockAppointmentRepository from '@modules/appointments/repositories/mocks/MockAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';


let listProviderAppointmentsService: ListProviderAppointmentsService;
let mockAppointmentsRepository: MockAppointmentRepository;

describe('ListProviderMonthAvailability', () => {

    beforeEach(() => {
        mockAppointmentsRepository = new MockAppointmentRepository();
        listProviderAppointmentsService = new ListProviderAppointmentsService(mockAppointmentsRepository);
    });

    it('should be able to list daily provider`s appointments', async () => {
        const appointment1 = await mockAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user1',
            date: new Date(2020, 10, 22, 14, 0, 0),
        });

        const appointment2 = await mockAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user1',
            date: new Date(2020, 10, 22, 16, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 10, 22, 10).getTime();
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            day: 22,
            month: 11,
            year: 2020
        });

        expect(appointments).toEqual(expect.arrayContaining([
            appointment1,
            appointment2
        ]),);

    });

});