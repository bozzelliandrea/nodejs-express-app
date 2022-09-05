import {NextFunction, Request, Response} from "express";
import {ResponseDto} from "../dto/response.dto";
import {AuthService} from "../services/auth.service";

export default function (req: Request, res: Response<ResponseDto<any>>, next: NextFunction) {
    if (!res.locals._whoami) {
        next();
    }

    res.send({
        payload: res.locals._payload,
        token: AuthService.generateToken(res.locals._whoami)
    })
}