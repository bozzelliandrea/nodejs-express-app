export interface TaskDto {
    id?: number;
    assigneeId: number;
    title: string;
    description: string;
    done: boolean;
}