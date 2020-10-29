import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockMailProvider from '@shared/container/providers/MailProvider/mocks/MockMailProvider';
import AppError from '@shared/error/AppError';
import MockUserTokensRepository from '../repositories/mocks/MockUserTokenRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let mockUsersRepository: MockUsersRepository;
let mockMailProvider: MockMailProvider;
let mockUserTokensRepository: MockUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;


describe('SendForgotEmailPassword', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockMailProvider = new MockMailProvider();
        mockUserTokensRepository = new MockUserTokensRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            mockUsersRepository,
            mockMailProvider,
            mockUserTokensRepository
        );
    });

    it('should be able to recovery password using email', async () => {

        const user = await mockUsersRepository.create({ name: 'John Doe', email: 'johndoe@test.com', password: '123456' });

        const sendMail = jest.spyOn(mockMailProvider, 'sendMail');

        const userToken = await sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recovery password if user does not exist', async () => {

        await expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should generate a forgot password token', async () => {

        const generatedToken = jest.spyOn(mockUserTokensRepository, 'generate');

        const user = await mockUsersRepository.create({ name: 'John Doe', email: 'johndoe@test.com', password: '123456' });

        await sendForgotPasswordEmail.execute({
            email: 'johndoe@test.com',
        });

        expect(generatedToken).toHaveBeenCalledWith(user.id);

    });
});

