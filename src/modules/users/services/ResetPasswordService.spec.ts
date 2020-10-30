import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import MockUserTokensRepository from '../repositories/mocks/MockUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let mockUsersRepository: MockUsersRepository;
let mockUserTokensRepository: MockUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
let resetPassword: ResetPasswordService;


describe('SendForgotEmailPassword', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockUserTokensRepository = new MockUserTokensRepository();
        resetPassword = new ResetPasswordService(
            mockUsersRepository,
            mockUserTokensRepository
        );
    });

    it('should be able to reset password', async () => {

        const user = await mockUsersRepository.create({ name: 'John Doe', email: 'johndoe@test.com', password: '123456' });

        const { token } = await mockUserTokensRepository.generate(user.id);

        await resetPassword.execute({
            password: '123123',
            token: token
        });

        const updatedUser = await mockUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe('123123');
    });


});

