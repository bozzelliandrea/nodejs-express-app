import request from 'supertest';
import server from "../server";
import {HttpCode} from "../utils/http-code.enum";
import {testUser} from "../../test-env.config";
import {postgresConfig} from "../db/postgres.config";
import {User} from "../db/entity/user.entity";

describe('Auth Test', () => {

    beforeAll(async () => {
        if (!postgresConfig.isInitialized)
            return await postgresConfig.initialize();
    });

    describe('POST auth/register/', () => {
        it('register a new user', async () => {
            await request(server)
                .post('/auth/register')
                .send(testUser)
                .expect(HttpCode.CREATED)
                .then(value => {
                    expect(value.body).toHaveProperty("token");
                    expect(value.body).toHaveProperty("payload");
                    expect(value.body.payload).toHaveProperty("email");
                    expect(value.body.payload).toHaveProperty("username");
                    expect(value.body.payload.username).toBe("test");
                })
        });

        it('try to register the same user and fail', async () => {
            await request(server)
                .post('/auth/register')
                .send(testUser)
                .expect(HttpCode.CONFLICT)
                .then(value => {
                    expect(value.body).toHaveProperty("message");
                    expect(value.body).toHaveProperty("name");
                    expect(value.body.message).toBe("User already exist");
                    expect(value.body.name).toBe("CONFLICT");
                })
        });

        it('register a new user with username null', async () => {
            await request(server)
                .post('/auth/register')
                .send({
                    ...testUser,
                    username: null
                })
                .expect(HttpCode.BAD_REQUEST)
                .then(value => {
                    expect(value.body).toHaveProperty("message");
                    expect(value.body).toHaveProperty("name");
                    expect(value.body.message).toBe("Auth parameter cannot be null");
                    expect(value.body.name).toBe("BAD_REQUEST");
                })
        });
    })

    describe('POST auth/login/', () => {
        it('login with the registered user', async () => {
            await request(server)
                .post('/auth/login')
                .send(testUser)
                .expect(HttpCode.OK)
                .then(value => {
                    expect(value.body).toHaveProperty("token");
                    expect(value.body.token).not.toBeNull();
                    expect(value.body.token).not.toBeInstanceOf(String);
                })
        });

        it('login with null password', async () => {
            await request(server)
                .post('/auth/login')
                .send({
                    ...testUser,
                    password: null
                })
                .expect(HttpCode.BAD_REQUEST)
                .then(value => {
                    expect(value.body).toHaveProperty("message");
                    expect(value.body).toHaveProperty("name");
                    expect(value.body.message).toBe("Auth parameter cannot be null");
                    expect(value.body.name).toBe("BAD_REQUEST");
                })
        });

        it('login with fake user, should fail', async () => {
            await request(server)
                .post('/auth/login')
                .send({
                    username: "ImTheImpostorHacker",
                    password: "fakePassword"
                })
                .expect(HttpCode.INTERNAL_SERVER_ERROR)
                .then(value => {
                    expect(value.body).toHaveProperty("message");
                    expect(value.body).toHaveProperty("name");
                    expect(value.body.message).toBe("User does not exist");
                    expect(value.body.name).toBe("INTERNAL_SERVER_ERROR");
                })
        });
    })

    afterAll(async () => {
        await postgresConfig.getRepository(User).delete({email: testUser.email, username: testUser.username})
        if (postgresConfig.isInitialized)
            await postgresConfig.destroy();
    });
})

