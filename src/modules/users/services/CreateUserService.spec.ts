import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const createUserRepository = new CreateUserService(mockUsersRepository);

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
        const mockUsersRepository = new MockUsersRepository();
        const createUserRepository = new CreateUserService(mockUsersRepository);

        await createUserRepository.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        expect(createUserRepository.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        })).rejects.toBeInstanceOf(AppError);
    });
});

