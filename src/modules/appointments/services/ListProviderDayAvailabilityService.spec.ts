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
            date: new Date(2020, 10, 22, 8, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 10, 0, 0),
        });

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: 'user',
            day: 22,
            month: 11,
            year: 2020
        });

        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: true },
            { hour: 10, available: false },
            { hour: 11, available: true },
        ]),);

    });

});