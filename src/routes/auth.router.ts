import {NextFunction, Request, Response, Router} from "express";
import {AuthDto} from "../dto/auth.dto";
import {AuthService} from "../services/auth.service";
import {HttpCode} from "../utils/http-code.enum";

const router = Router();
const authService = new AuthService();

router.post('/register', (req: Request<{}, AuthDto, AuthDto>, res: Response<AuthDto>, next: NextFunction) => {
    authService.register(req.body)
        .then((response: AuthDto) => {
            res.status(HttpCode.CREATED);
            res.locals._payload = response;
            res.locals._whoami = response.username;
            res.locals._processed = true;
            next();
        })
        .catch(err => next(err));
})

router.post('/login', (req: Request<{}, {}, AuthDto>, res: Response<{}>, next: NextFunction) => {
    authService.login(req.body)
        .then(() => {
            res.locals._whoami = req.body.username
            res.locals._processed = true;
            next();
        })
        .catch(err => next(err));
})

export default router;