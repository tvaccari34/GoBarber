import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockStorageProvider from '@shared/container/providers/StorageProviders/mocks/MockStorageProvider';
import AppError from '@shared/error/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to update avatar', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockStorageProvider = new MockStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(mockUsersRepository, mockStorageProvider);

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'Avatar.jpg'
        });

        expect(user.avatar).toBe('Avatar.jpg');
    });

    it('should not be able to update avatar for a non authenticated user', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockStorageProvider = new MockStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(mockUsersRepository, mockStorageProvider);

        await expect(updateUserAvatarService.execute({
            user_id: '',
            avatarFileName: 'Avatar.jpg'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update an old avatar to a new one', async () => {
        const mockUsersRepository = new MockUsersRepository();
        const mockStorageProvider = new MockStorageProvider();
        const updateUserAvatarService = new UpdateUserAvatarService(mockUsersRepository, mockStorageProvider);

        const deleteFile = jest.spyOn(mockStorageProvider, 'deleteFile');

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'Avatar.jpg'
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'Avatar1.jpg'
        });

        expect(deleteFile).toHaveBeenCalledWith('Avatar.jpg');
        expect(user.avatar).toBe('Avatar1.jpg');
    });

});

