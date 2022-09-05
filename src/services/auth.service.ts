import {Repository} from "typeorm";
import {User} from "../db/entity/user.entity";
import {postgresConfig} from "../db/postgres.config";
import {AuthDto} from "../dto/auth.dto";
import {AppErrorDto} from "../dto/app-error.dto";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import {HttpCode} from "../utils/http-code.enum";

export class AuthService {

    private readonly _userRepository: Repository<User>

    constructor() {
        this._userRepository = postgresConfig.getRepository(User);
    }

    public async register(dto: AuthDto): Promise<AuthDto> {

        if (!dto.email || !dto.username || !dto.password) {
            throw new AppErrorDto("Auth parameter cannot be null", HttpCode.BAD_REQUEST);
        }

        let user: User | null = await this._userRepository.findOneBy([
            {username: dto.username},
            {email: dto.email}
        ])

        if (user) {
            throw new AppErrorDto("User already exist", HttpCode.CONFLICT);
        }

        const {salt, hash} = this._generateHashPassword(dto.password);

        try {
            user = await this._userRepository.save(new User(dto.email, dto.username, hash, salt))
        } catch (err) {
            throw new AppErrorDto("Failed to save user", HttpCode.UNPROCESSABLE_ENTITY)
        }

        return {
            email: user.email,
            username: user.username,
        } as AuthDto;
    }

    public async login(dto: AuthDto): Promise<void> {

        if (!dto.username || !dto.password)
            throw new AppErrorDto("Auth parameter cannot be null", HttpCode.BAD_REQUEST);

        let user: User | null = await this._userRepository.findOneBy([
            {username: dto.username},
            {email: dto.email}
        ]);

        if (!user)
            throw new AppErrorDto("User does not exist");

        if (!this._validatePassword(dto.password, user.password, user.salt))
            throw new AppErrorDto("Wrong password", HttpCode.UNAUTHORIZED);

        return;
    }

    public static generateToken(username: string): string {
        return jwt.sign(
            {username},
            process.env.TOKEN_SECRET + '',
            {
                expiresIn: process.env.TOKEN_VALIDITY + 's'
            });
    }

    private _generateHashPassword(password: string): { salt: string, hash: string } {
        const salt: string = crypto.randomBytes(32).toString("hex");
        const hash: string = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString('hex');

        return {
            salt,
            hash
        }
    }

    private _validatePassword(password: string, hash: string, salt: string): boolean {
        const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString('hex');
        return newHash === hash;
    }
}