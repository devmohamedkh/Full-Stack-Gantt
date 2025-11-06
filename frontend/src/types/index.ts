export enum ActivityStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    BLOCKED = "blocked",
}

export enum ActivityType {
    TASK = "task",
    MILESTONE = "milestone",
}

export interface Activity {
    id: number;
    name: string;
    description: string | null;
    start: Date;
    end: Date;
    progress: number;
    status: ActivityStatus;
    type: ActivityType;
    color: string | null;
    dependencies: number[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
