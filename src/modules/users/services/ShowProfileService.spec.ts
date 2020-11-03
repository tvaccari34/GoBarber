import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import ShowProfileService from './ShowProfileService';

let mockUsersRepository: MockUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        showProfileService = new ShowProfileService(mockUsersRepository);
    })

    it('should be able to show user profile', async () => {

        const user = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@test.com');
    });

    it('should not be able to show user profile from non-existing user', async () => {

        await expect(showProfileService.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError);
    });
});

