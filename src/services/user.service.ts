import {Repository} from "typeorm";
import {User} from "../db/entity/user.entity";
import {postgresConfig} from "../db/postgres.config";
import {UserDto} from "../dto/user.dto";
import {AppErrorDto} from "../dto/app-error.dto";
import {HttpCode} from "../utils/http-code.enum";
import {DeleteResult} from "typeorm/query-builder/result/DeleteResult";

export class UserService {

    private readonly _userRepository: Repository<User>;

    constructor() {
        this._userRepository = postgresConfig.getRepository(User);
    }

    public async getAll(): Promise<UserDto[]> {
        return await this._userRepository.find().then(users => {
            return users.map((user :User) => {
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                } as UserDto
            })
        })
    }

    public async update(request: UserDto): Promise<UserDto> {
        if(!request.id)
            throw new AppErrorDto("user id cannot be null", HttpCode.BAD_REQUEST)

        if(!request.username && !request.email)
            throw new AppErrorDto("email or username needs a value", HttpCode.BAD_REQUEST)

        let user: User = await this._userRepository.findOneBy({
            id: request.id,
        });

        if(request.username) user.username = request.username;
        if(request.email) user.email = request.email;

        user = await this._userRepository.save(user);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        } as UserDto
    }

    public async getById(id: string): Promise<UserDto> {
        if(!id && id != "")
            throw new AppErrorDto("Id cannot be null", HttpCode.BAD_REQUEST);

        const user: User | null = await this._userRepository.findOneBy({
            id: Number(id)
        });

        if(!user)
            throw new AppErrorDto("User not found", HttpCode.NOT_FOUND);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        } as UserDto
    }

    public async delete(id: string): Promise<void> {
        if(!id && id != "")
            throw new AppErrorDto("Id cannot be null", HttpCode.BAD_REQUEST);

        const result: DeleteResult = await this._userRepository.delete(Number(id));

        if(result.affected === 1)
            return;
        else
            throw new AppErrorDto("Delete fail", HttpCode.INTERNAL_SERVER_ERROR);
    }
}