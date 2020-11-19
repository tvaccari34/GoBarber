import User from '@modules/users/infra/typeorm/entities/Users';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepositories from '@modules/users/repositories/IUsersRepository';
import {injectable, inject} from 'tsyringe';


interface IRequest {
    user_id: string,
}

@injectable()
class ListProvidersService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepositories,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ){}

    public async execute({ user_id }: IRequest): Promise<User[]> {

        let providers = await this.cacheProvider.recover<User[]>(`provider-lists:${user_id}`);

        if (!providers) {
            providers = await this.usersRepository.findAllProviders({
                except_user_id: user_id
            });

            await this.cacheProvider.save(`provider-lists:${user_id}`, providers);
        }

        return providers;
    }
}

export default ListProvidersService;