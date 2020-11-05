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
            date: new Date(2020, 10, 22, 9, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 10, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 11, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 12, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 13, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 14, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 15, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 16, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 22, 17, 0, 0),
        });

        await mockAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 10, 23, 11, 0, 0),
        });

        const availability = await listProviderMonthAvailabilityService.execute({
            provider_id: 'user',
            month: 11,
            year: 2020
        });

        expect(availability).toEqual(expect.arrayContaining([
            { day: 21, available: true },
            { day: 22, available: false },
            { day: 23, available: true },
        ]),);

    });

});