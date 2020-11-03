import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import MockStorageProvider from '@shared/container/providers/StorageProviders/mocks/MockStorageProvider';
import AppError from '@shared/error/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let mockUsersRepository: MockUsersRepository;
let mockStorageProvider: MockStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        mockStorageProvider = new MockStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(mockUsersRepository, mockStorageProvider);
    })

    it('should be able to update avatar', async () => {

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

        await expect(updateUserAvatarService.execute({
            user_id: '',
            avatarFileName: 'Avatar.jpg'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update an old avatar to a new one', async () => {

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

