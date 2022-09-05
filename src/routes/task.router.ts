import {NextFunction, Request, Response, Router} from "express";
import {TaskService} from "../services/task.service";
import {TaskDto} from "../dto/task.dto";
import {HttpCode} from "../utils/http-code.enum";

const router = Router();
const taskService = new TaskService();

router.route('/')
    .get((req: Request<{}, TaskDto[], {}, {assigneeId?: number, page?: number, pageSize?: number}>, res: Response<TaskDto[]>, next: NextFunction) => {
        taskService.find(req.query.assigneeId, req.query.page, req.query.pageSize)
            .then(response => {
                res.locals._payload = response;
                res.locals._processed = true;
                next()
            })
            .catch(err => next(err))
    })
    .post((req: Request<{}, TaskDto, TaskDto>, res: Response<TaskDto>, next: NextFunction) => {
        taskService.create(req.body)
            .then(response => {
                res.locals._payload = response;
                res.locals._processed = true;
                next();
            })
            .catch(err => next(err))
    })
    .put((req: Request<{}, TaskDto, TaskDto>, res: Response<TaskDto>, next: NextFunction) => {
        taskService.update(req.body)
            .then(response => {
                res.locals._payload = response;
                res.locals._processed = true;
                next();
            })
            .catch(err => next(err))
    });

router.route('/:id')
    .get((req: Request<{id: string}>, res: Response<TaskDto>, next: NextFunction) => {
        taskService.get(req.params.id)
            .then(response => {
                res.locals._payload = response;
                res.locals._processed = true;
                next();
            })
            .catch(err => next(err))
    })
    .delete((req: Request<{id: string}>, res: Response, next: NextFunction) => {
        taskService.delete(req.params.id)
            .then(() => {
                res.locals._processed = true;
                res.status(HttpCode.DELETED);
                next();
            })
            .catch(err => next(err))
    })

export default router;