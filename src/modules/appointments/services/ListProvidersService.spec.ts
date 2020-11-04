import MockUsersRepository from '@modules/users/repositories/mocks/MockUsersRepository';
import AppError from '@shared/error/AppError';
import ListProvidersService from './ListProvidersService';

let mockUsersRepository: MockUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {

    beforeEach(() => {
        mockUsersRepository = new MockUsersRepository();
        listProvidersService = new ListProvidersService(mockUsersRepository);
    });

    it('should be able to list providers', async () => {

        const provider1 = await mockUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456789'
        });

        const provider2 = await mockUsersRepository.create({
            name: 'John Doe Doe',
            email: 'johndoedoe@test.com',
            password: '123456789'
        });

        const provider3 = await mockUsersRepository.create({
            name: 'John Doe Doe Doe',
            email: 'johndoedoedoe@test.com',
            password: '123456789'
        });

        const loggedUser = await mockUsersRepository.create({
            name: 'John Logged',
            email: 'johnlogged@test.com',
            password: '123456789'
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([provider1, provider2, provider3]);
    });

});