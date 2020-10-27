import MockAppointmentRepository from '@modules/appointments/repositories/mocks/MockAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const mockAppointmentRepository = new MockAppointmentRepository();
        const createAppointmentRepository = new CreateAppointmentService(mockAppointmentRepository);

        const appointment = await createAppointmentRepository.execute({
            date: new Date(),
            provider_id: '123456789'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456789');
    });

    // it('should not be able to create two appointments on the same time', () => {
    //     expect(1 + 2).toBe(3);
    // });
});

