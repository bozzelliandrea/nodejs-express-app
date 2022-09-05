import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public description: string;

    @Column({default: false})
    public done: boolean

    @ManyToOne(() => User, (user) => user.tasks)
    public assignee: User;


    constructor(title: string, description: string, done: boolean, assignee: User, id?: number) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.done = done;
        this.assignee = assignee;
    }
}