import User from '@modules/users/infra/typeorm/entities/Users';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';


class MockUsersRepository
    implements IUserRepository {

    private users: User[] = [];

    public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<User[]> {

        let providers = this.users;

        if (except_user_id) {
            providers = this.users.filter(provider => provider.id != except_user_id);
        }

        return providers;
    }


    public async findById(id: string): Promise<User | undefined> {

        const findUser = this.users.find(user => user.id == id);
        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email == email);
        return findUser;
    }


    public async create({name, email, password}: ICreateUserDTO): Promise<User>{

        const user = new User();

        Object.assign(user, { id: uuid(), name, email, password });

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User>{
        const findIndex = this.users.findIndex(user => user.id == user.id);

        this.users[findIndex] = user;

        return user;

    }
}

export default MockUsersRepository;