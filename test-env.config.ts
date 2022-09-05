import dotenv from 'dotenv';
import {AuthDto} from "./src/dto/auth.dto";

dotenv.config({path: './.env.test'});

export const testUser: AuthDto = {
    email: "test@test",
    username: "test",
    password: "myPassword"
}