import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';

import AppError from '@shared/error/AppError';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let authenticateUser: AuthenticateUserService;
let mockCacheProvider: MockCacheProvider;

describe('AuthenticateUser', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockHashProvider = new MockHashProvider();
        mockCacheProvider = new MockCacheProvider();
        authenticateUser = new AuthenticateUserService(mockUsersRepository, mockHashProvider, mockCacheProvider);
    })

    it('should be able to authenticate', async () => {

        const user = await mockUsersRepository.create({
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

        await expect(authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456788'}),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate within incorrect email', async () => {


        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await expect(authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456788'})).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate within incorrect password', async () => {

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await expect(authenticateUser.execute({
            email: 'johndoe@test.com',
            password: '123456788'})).rejects.toBeInstanceOf(AppError);
    });


});

