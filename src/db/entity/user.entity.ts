import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Task} from "./task.entity";
import {RoleEnum} from "../../utils/role.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column()
    public username: string;

    @Column()
    public password: string;

    @Column()
    public salt: string;

    @Column({
        type: "enum",
        enum: RoleEnum,
        default: RoleEnum.User,
    })
    public role: RoleEnum;

    @OneToMany(() => Task, (task: Task) => task.assignee)
    public tasks: Task[];

    constructor(email: string, username: string, password: string, salt: string) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.salt = salt;
    }
}