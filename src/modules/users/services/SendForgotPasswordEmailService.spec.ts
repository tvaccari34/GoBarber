import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockMailProvider from '@shared/container/providers/MailProvider/mocks/MockMailProvider';
import AppError from '@shared/error/AppError';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotEmailPassword', () => {
    it('should be able to recovery password using email', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockMailProvider = new MockMailProvider();
        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(mockUsersRepository, mockMailProvider);


        const user = await mockUsersRepository.create({ name: 'John Doe', email: 'johndoe@test.com', password: '123456' });

        const sendMail = jest.spyOn(mockMailProvider, 'sendMail');

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recovery password if user does not exist', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockMailProvider = new MockMailProvider();
        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(mockUsersRepository, mockMailProvider);

        await expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        })).rejects.toBeInstanceOf(AppError);

    });
});

