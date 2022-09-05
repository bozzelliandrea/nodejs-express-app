import {NextFunction, Router, Request, Response} from "express";
import {UserDto} from "../dto/user.dto";
import {UserService} from "../services/user.service";
import {HttpCode} from "../utils/http-code.enum";

const router = Router();
const userService = new UserService();

router.route('/')
    .get((req: Request, res: Response, next: NextFunction) => {
        userService.getAll()
            .then(response => {
                res.locals._payload = response;
                res.locals._processed = true;
                next();
            })
            .catch(err => next(err))
    })
    .put((req: Request<{}, UserDto, UserDto>, res: Response<UserDto>, next: NextFunction) => {
       userService.update(req.body)
           .then(response => {
               res.locals._payload = response;
               res.locals._processed = true;
               next();
           })
           .catch(err => next(err))
    });

router.route('/:id')
    .get((req: Request<{id: string}, UserDto, {}>, res: Response<UserDto>, next: NextFunction) => {
        userService.getById(req.params.id)
            .then(response => {
                res.locals._payload = response;
                res.locals._processed = true;
                next();
            })
            .catch(err => next(err))
    })
    .delete((req: Request<{id: string}>, res: Response, next: NextFunction) => {
            userService.delete(req.params.id)
                .then(() => {
                    res.locals._processed = true;
                    res.status(HttpCode.DELETED);
                    next();
                })
                .catch(err => next(err))
    });

export default router;