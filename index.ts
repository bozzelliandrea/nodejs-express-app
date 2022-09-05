import dotenv from 'dotenv';
dotenv.config();

import server from "./src/server";
import {postgresConfig} from "./src/db/postgres.config";

Promise.all([postgresConfig.initialize()]).then(() => {
    server.listen(process.env.SERVER_PORT, () => {
        console.log(`Server Running on http://localhost:${process.env.SERVER_PORT}`)
    })
}).catch(err => {
    console.error("Cannot connect with the db", err)
})

process.on('exit', () => {
    console.log("Backend shutting down")
})

process.on('uncaughtException', function (err) {
    console.log(err);
});