import {Repository} from "typeorm";
import {Task} from "../db/entity/task.entity";
import {postgresConfig} from "../db/postgres.config";
import {TaskDto} from "../dto/task.dto";
import {AppErrorDto} from "../dto/app-error.dto";
import {HttpCode} from "../utils/http-code.enum";
import {User} from "../db/entity/user.entity";
import {DeleteResult} from "typeorm/query-builder/result/DeleteResult";

export class TaskService {

    private readonly _taskRepository: Repository<Task>;
    private readonly _userRepository: Repository<User>;

    constructor() {
        this._taskRepository = postgresConfig.getRepository(Task);
        this._userRepository = postgresConfig.getRepository(User);
    }

    public async find(assigneeId: number, page: number, pageSize: number): Promise<TaskDto[]> {

        const user: User | null = await this._userRepository.findOneBy({id: assigneeId});

        if (!user)
            throw new AppErrorDto("User not found", HttpCode.NOT_FOUND)

        return await this._taskRepository.find({
            take: pageSize,
            skip: pageSize * page,
            where: {
                assignee: user
            }
        }).then(tasks => {
            return tasks.map(task => {
                return {
                    id: task.id,
                    assigneeId: user.id,
                    title: task.title,
                    description: task.description,
                    done: task.done
                } as TaskDto
            })
        })
    }

    public async create(request: TaskDto): Promise<TaskDto> {

        if (!request.assigneeId || !request.title || !request.description)
            throw new AppErrorDto("Input validation failed", HttpCode.BAD_REQUEST)

        const user: User | null = await this._userRepository.findOneBy({id: request.assigneeId});

        if (!user)
            throw new AppErrorDto("Assignee not found", HttpCode.NOT_FOUND)

        const task: Task = await this._taskRepository.save(new Task(request.title, request.description, false, user));

        return {
            id: task.id,
            assigneeId: user.id,
            title: task.title,
            description: task.description,
            done: task.done
        } as TaskDto;
    }

    public async update(request: TaskDto): Promise<TaskDto> {
        if (!request.id || !request.assigneeId || !request.title || !request.description)
            throw new AppErrorDto("Input validation failed", HttpCode.BAD_REQUEST)

        const user: User | null = await this._userRepository.findOneBy({id: request.assigneeId});

        if (!user)
            throw new AppErrorDto("Assignee not found", HttpCode.NOT_FOUND)

        let savedTask: Task = await this._taskRepository.findOneBy({id: request.id});

        if (!savedTask)
            throw new AppErrorDto("Task not found", HttpCode.NOT_FOUND)

        savedTask.assignee = user;
        savedTask.title = request.title;
        savedTask.description = request.description;
        savedTask.done = request.done;

        savedTask = await this._taskRepository.save(savedTask);

        return {
            id: savedTask.id,
            assigneeId: savedTask.assignee.id,
            title: savedTask.title,
            description: savedTask.description,
            done: savedTask.done
        } as TaskDto;
    }

    public async get(taskId: string): Promise<TaskDto> {
        if (!taskId)
            throw new AppErrorDto("Task id cannot be null", HttpCode.BAD_REQUEST);

        const task: Task = await this._taskRepository.findOne({
            relations: {
                assignee: true
            },
            where: {
                id: Number(taskId),
            }
        });

        return {
            id: task.id,
            assigneeId: task.assignee.id,
            title: task.title,
            description: task.description,
            done: task.done
        } as TaskDto;
    }

    public async delete(taskId: string): Promise<void> {
        if (!taskId)
            throw new AppErrorDto("Task id cannot be null", HttpCode.BAD_REQUEST);

        const result: DeleteResult = await this._taskRepository.delete(Number(taskId));

        if (result.affected === 1)
            return;
        else
            throw new AppErrorDto("Delete fail", HttpCode.INTERNAL_SERVER_ERROR);
    }
}