import MockAppointmentRepository from '@modules/appointments/repositories/mocks/MockAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let mockAppointmentsRepository: MockAppointmentRepository;

describe('ListProviderMonthAvailability', () => {

    beforeEach(() => {
        mockAppointmentsRepository = new MockAppointmentRepository();
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(mockAppointmentsRepository);
    });

    it('should be able to list daily provider`s availability', async () => {
        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 14, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 16, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 10, 22, 10).getTime();
        });

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: 'user',
            day: 22,
            month: 11,
            year: 2020
        });

        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 11, available: true },
            { hour: 12, available: true },
            { hour: 13, available: true },
            { hour: 14, available: false },
            { hour: 15, available: true },
            { hour: 16, available: false },
            { hour: 17, available: true },
        ]),);

    });

});