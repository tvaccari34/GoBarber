import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import MockHashProvider from '../providers/HashProvider/mocks/MockHashProvider';
import UpdateProfileService from './UpdateProfileService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let mockUsersRepository: MockUsersRepository;
let mockHashProvider: MockHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockHashProvider = new MockHashProvider();
        updateProfileService = new UpdateProfileService(mockUsersRepository, mockHashProvider);
    })

    it('should be able to update user profile', async () => {

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe test',
            email: 'johndoetest@test.com',
        });

        expect(updatedUser.name).toBe('John Doe test');
        expect(updatedUser.email).toBe('johndoetest@test.com');
    });

    it('should not be able to update user profile within an existing email', async () => {

        await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        const user = await mockUsersRepository.create({
            name: 'John Doe 1',
            email: 'johndoe1@test.com',
            password: '123456789'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: user.name,
            email: 'johndoe@test.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update password', async () => {

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe test',
            email: 'johndoe@test.com',
            old_password: '123456789',
            password: '123456',
        });

        expect(updatedUser.password).toBe('123456');
    });

    it('should not be able to update password without old password', async () => {

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe test',
            email: 'johndoe@test.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update password within different old password', async () => {

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe test',
            email: 'johndoe@test.com',
            old_password: 'testtest',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

});

