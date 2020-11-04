import MockAppointmentRepository from '@modules/appointments/repositories/mocks/MockAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let mockAppointmentsRepository: MockAppointmentRepository;

describe('ListProviderMonthAvailability', () => {

    beforeEach(() => {
        mockAppointmentsRepository = new MockAppointmentRepository();
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(mockAppointmentsRepository);
    });

    it('should be able to list monthly provider`s availability', async () => {
        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 8, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 11, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 20, 10, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 11, 15, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailabilityService.execute({
            provider_id: 'user',
            month: 11,
            year: 2020
        });

        expect(availability).toEqual(expect.arrayContaining([
            { day: 19, available: true },
            { day: 20, available: false },
            { day: 21, available: true },
            { day: 22, available: false },
            { day: 22, available: false },

        ]))

    });

});