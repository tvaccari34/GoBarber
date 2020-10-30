import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import MockUserTokensRepository from '../repositories/mocks/MockUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let mockUsersRepository: MockUsersRepository;
let mockUserTokensRepository: MockUserTokensRepository;
let mockHashProvider: MockHashProvider;
let resetPassword: ResetPasswordService;


describe('ResetPasswordService', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockUserTokensRepository = new MockUserTokensRepository();
        mockHashProvider = new MockHashProvider();
        resetPassword = new ResetPasswordService(
            mockUsersRepository,
            mockUserTokensRepository,
            mockHashProvider
        );
    });

    it('should be able to reset password', async () => {

        const user = await mockUsersRepository.create({ name: 'John Doe', email: 'johndoe@test.com', password: '123456' });

        const { token } = await mockUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(mockHashProvider, 'generateHash')

        await resetPassword.execute({
            password: '123123',
            token: token
        });

        const updatedUser = await mockUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');

        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset password within non-existing token', async () => {

        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456'
            })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password within non-existing user', async () => {

        const {token} = await mockUserTokensRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if link has more then 30 minutes', async () => {

        const user = await mockUsersRepository.create({ name: 'John Doe', email: 'johndoe@test.com', password: '123456' });

        const {token} = await mockUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setMinutes(customDate.getMinutes() + 31);
        });

        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            })).rejects.toBeInstanceOf(AppError);
    });

});

