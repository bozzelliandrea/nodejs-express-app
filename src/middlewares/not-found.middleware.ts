import {NextFunction, Request, Response} from "express";
import {AppErrorDto} from "../dto/app-error.dto";
import {HttpCode} from "../utils/http-code.enum";

export default function (req: Request, res: Response, next: NextFunction) {
    if (!res.locals._processed)
        throw new AppErrorDto("Resource not found", HttpCode.NOT_FOUND);

    next();
}