import request from "supertest";
import server from "../server";
import {HttpCode} from "../utils/http-code.enum";
import {postgresConfig} from "../db/postgres.config";
import {testUser} from "../../test-env.config";
import {User} from "../db/entity/user.entity";
import {UserDto} from "../dto/user.dto";
import {userInfo} from "os";

let bearerToken: string = 'Bearer ';

describe('User test', () => {
    beforeAll(async () => {
        if (!postgresConfig.isInitialized)
            await postgresConfig.initialize();

        await request(server)
            .post('/auth/register')
            .send(testUser)
            .then(response => {
                bearerToken = bearerToken.concat(response.body.token);
            })
    });

    describe('GET /user', () => {
        it('get the users without authorization, should fail', async () => {
            await request(server)
                .get('/users/')
                .expect(HttpCode.UNAUTHORIZED)
        })

        it('get the users', async () => {
            await request(server)
                .get('/users/')
                .set('Authorization', bearerToken)
                .expect(HttpCode.OK)
                .then(response => {
                    expect(response.body).toHaveProperty("payload")
                    expect(response.body.payload).toBeInstanceOf(Array)
                    expect(response.body.payload).not.toHaveLength(0)

                    const foundedUser = (response.body.payload as Array<UserDto>).find(u => u.username === testUser.username);

                    expect(foundedUser).not.toBeNull();
                    expect(foundedUser).toHaveProperty("email")
                    expect(foundedUser).toHaveProperty("id")
                    expect(foundedUser.email).toBe(testUser.email)
                })
        })
    })


    afterAll(async () => {
        await postgresConfig.getRepository(User).delete({email: testUser.email, username: testUser.username})

        if (postgresConfig.isInitialized)
            await postgresConfig.destroy();
    })
})