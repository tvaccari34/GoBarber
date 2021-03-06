import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import MockCacheProvider from '@shared/container/providers/CacheProvider/mocks/MockCacheProvider';
import CreateUserService from './CreateUserService';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let createUserRepository: CreateUserService;
let mockCacheProvider: MockCacheProvider;

describe('CreateUser', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockHashProvider = new MockHashProvider();
        mockCacheProvider = new MockCacheProvider();
        createUserRepository = new CreateUserService(mockUsersRepository, mockHashProvider, mockCacheProvider);
    })

    it('should be able to create a new user', async () => {

        const user = await createUserRepository.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('johndoe@test.com');
    });

    it('should not be able to create the same user twice', async () => {

        await createUserRepository.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await expect(createUserRepository.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        })).rejects.toBeInstanceOf(AppError);
    });
});

