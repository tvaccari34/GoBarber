import User from '@modules/users/infra/typeorm/entities/Users';
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
    ){}

    public async execute({ user_id }: IRequest): Promise<User[]> {

        const providers = await this.usersRepository.findAllProviders({
            except_user_id: user_id
        });

        return providers;
    }
}

export default ListProvidersService;