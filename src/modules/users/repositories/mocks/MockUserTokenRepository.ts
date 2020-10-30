import usersRouter from '@modules/users/infra/http/routes/users.routes';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { uuid } from 'uuidv4';


class MockUserTokensRepository
    implements IUserTokensRepository {

    private usertokens: UserToken[] = [];

    public async generate(user_id: string): Promise<UserToken> {

        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id,
            created_at: new Date(),
            updated_at: new Date(),
         })

        this.usertokens.push(userToken);

        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {

        const userToken = this.usertokens.find(findToken => findToken.token == token);

        return userToken;
    }
}

export default MockUserTokensRepository;