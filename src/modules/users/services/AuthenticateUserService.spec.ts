import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';

import AppError from '@shared/error/AppError';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockHashProvider = new MockHashProvider();
        const createUser = new CreateUserService(mockUsersRepository, mockHashProvider);
        const authenticateUser = new AuthenticateUserService(mockUsersRepository, mockHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456789'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate within non existing user', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockHashProvider = new MockHashProvider();
        const authenticateUser = new AuthenticateUserService(mockUsersRepository, mockHashProvider);

        expect(authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456788'}),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate within incorrect email', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockHashProvider = new MockHashProvider();
        const createUser = new CreateUserService(mockUsersRepository, mockHashProvider);
        const authenticateUser = new AuthenticateUserService(mockUsersRepository, mockHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        expect(authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456788'})).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate within incorrect password', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockHashProvider = new MockHashProvider();
        const createUser = new CreateUserService(mockUsersRepository, mockHashProvider);
        const authenticateUser = new AuthenticateUserService(mockUsersRepository, mockHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        expect(authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456788'})).rejects.toBeInstanceOf(AppError);
    });

    // it('should not be able to create the same user twice', async () => {
    //     const mockUsersRepository = new MockUsersRepository();
    //     const createUserRepository = new AuthenticateUserService(mockUsersRepository);

    //     await createUserRepository.execute({
    //         name: 'John Doe',
    //         email: 'johndoe@test.com',
    //         password: '123456789'
    //     });

    //     expect(createUserRepository.execute({
    //         name: 'John Doe',
    //         email: 'johndoe@test.com',
    //         password: '123456789'
    //     })).rejects.toBeInstanceOf(AppError);
    // });
});

