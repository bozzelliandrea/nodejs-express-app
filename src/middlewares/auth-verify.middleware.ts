import {NextFunction, Request, Response} from "express";
import {AppErrorDto} from "../dto/app-error.dto";
import {HttpCode} from "../utils/http-code.enum";
import jwt, {JwtPayload} from "jsonwebtoken";
import {RoleEnum} from "../utils/role.enum";

export default function (req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];

    if (!auth || !auth.startsWith('Bearer'))
        throw new AppErrorDto("No auth token found", HttpCode.UNAUTHORIZED)

    const token: string = auth.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, {}, (error: any, decoded: JwtPayload) => {
        if (error) {
            console.error(error);
            throw new AppErrorDto("auth token invalid", HttpCode.UNAUTHORIZED);
        }

        console.debug("Authentication found for user ", decoded)
        res.locals._whoami = decoded.username;
        res.locals._role = decoded.role;
        next();
    });
}

export function adminRequired(req: Request, res: Response, next: NextFunction) {
    if(res.locals._role !== RoleEnum.Admin.toString()){
        throw new AppErrorDto("Insufficient privileges", HttpCode.FORBIDDEN);
    }
    next();
}