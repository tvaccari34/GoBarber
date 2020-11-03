import MockAppointmentRepository from '@modules/appointments/repositories/mocks/MockAppointmentsRepository';
import AppError from '@shared/error/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let mockAppointmentRepository: MockAppointmentRepository;
let createAppointmentRepository: CreateAppointmentService;

describe('CreateAppointment', () => {

    beforeEach(() => {
        mockAppointmentRepository = new MockAppointmentRepository();
        createAppointmentRepository = new CreateAppointmentService(mockAppointmentRepository);
    })

    it('should be able to create a new appointment', async () => {

        const appointment = await createAppointmentRepository.execute({
            date: new Date(),
            provider_id: '123456789'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456789');
    });

    it('should not be able to create two appointments on the same time', async () => {

        const appointmentDate = new Date(2020, 11, 10, 11);

        await createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789'
        });

        await expect(createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789'
        })).rejects.toBeInstanceOf(AppError);
    });
});

