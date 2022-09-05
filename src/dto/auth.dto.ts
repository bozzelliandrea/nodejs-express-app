import {RoleEnum} from "../utils/role.enum";

export interface AuthDto {
    email?: string;
    username: string;
    password: string;
    role: RoleEnum;
}