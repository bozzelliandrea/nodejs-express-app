import {AppErrorDto} from "../dto/app-error.dto";
import {NextFunction, Request, Response} from "express";

export default function (err: AppErrorDto, req: Request, res: Response<AppErrorDto>, next: NextFunction) {
    console.log(err);
    res.status(err.code).send({
        message: err.message,
        code: err.code,
        name: err.name,
    })
}