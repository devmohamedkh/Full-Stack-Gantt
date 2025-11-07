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

export type PickedActivityNameId = Pick<Activity, "id" | "name">;

export interface CreateActivityDto {
    name: string;
    description?: string;
    start: string;
    end: string;
    progress?: number;
    status?: ActivityStatus;
    type?: ActivityType;
    color?: string;
    dependencies?: number[];
    order?: number;
}

export interface UpdateActivityDto {
    name?: string;
    description?: string;
    start?: string;
    end?: string;
    progress?: number;
    status?: ActivityStatus;
    type?: ActivityType;
    color?: string;
    dependencies?: number[];
    order?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface RawActivity {
    id: number;
    name: string;
    description: string | null;
    start: string;
    end: string;
    progress: number;
    status: ActivityStatus;
    type: ActivityType;
    color: string | null;
    dependencies: number[];
    order: number;
    createdAt: string;
    updatedAt: string;
}
