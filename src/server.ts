import express from 'express';
import "reflect-metadata";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";
import taskRouter from "./routes/task.router";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import authVerifyMiddleware from "./middlewares/auth-verify.middleware";
import tokenRefresherMiddleware from "./middlewares/token-refresher.middleware";
import notFoundMiddleware from "./middlewares/not-found.middleware";

const server = express();
server.use(express.json());
server.use('/auth', authRouter);
server.use('/users', authVerifyMiddleware, userRouter);
server.use('/tasks', authVerifyMiddleware, taskRouter);
server.use('*', notFoundMiddleware);
server.use(tokenRefresherMiddleware);
server.use(errorHandlerMiddleware);

export default server;