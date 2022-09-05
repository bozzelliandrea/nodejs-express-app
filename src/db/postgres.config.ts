import {DataSource} from "typeorm";

export const postgresConfig = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB_NAME,
    synchronize: true,
    logging: true,
    entities: ['src/db/entity/*.entity.ts'],
})
