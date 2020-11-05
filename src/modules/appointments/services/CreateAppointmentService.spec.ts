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

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 10, 2, 10).getTime();
        })

        const appointmentDate = new Date(2020, 10, 2, 13);

        const appointment = await createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: 'user1'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456789');
    });

    it('should not be able to create two appointments on the same time', async () => {

        const appointmentDate = new Date(2020, 11, 10, 11);

        await createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: 'user1'
        });

        await expect(createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async() => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 10, 2, 10).getTime();
        })

        const appointmentDate = new Date(2020, 10, 2, 9);

        await expect(createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment for the same user as himself.', async() => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 10, 2, 10).getTime();
        })

        const appointmentDate = new Date(2020, 10, 2, 13);

        await expect(createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: '123456789'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment outside the availability window.', async() => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 10, 2, 10).getTime();
        })

        let appointmentDate = new Date(2020, 10, 3, 7);

        await expect(createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError);

        appointmentDate = new Date(2020, 10, 3, 18);

        await expect(createAppointmentRepository.execute({
            date: appointmentDate,
            provider_id: '123456789',
            user_id: 'user1'
        })).rejects.toBeInstanceOf(AppError);
    });
});

