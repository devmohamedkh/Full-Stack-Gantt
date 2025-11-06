import axios from "axios";
import { ActivityStatus, type ActivityType } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// Raw activity data from API (with string dates)
interface RawActivity {
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

// Paginated response structure
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Transform date strings to Date objects
const transformActivity = (activity: RawActivity): Activity => {
    return {
        ...activity,
        start: new Date(activity.start),
        end: new Date(activity.end),
        createdAt: new Date(activity.createdAt),
        updatedAt: new Date(activity.updatedAt),
    };
};

export const activitiesApi = {
    getAll: async (
        params?: PaginationParams & { status?: ActivityStatus }
    ): Promise<Activity[]> => {
        const response = await api.get<PaginatedResponse<RawActivity>>(
            "/activities",
            { params }
        );

        return response.data?.data.map(transformActivity);
    },

    getById: async (id: number): Promise<Activity> => {
        const response = await api.get<RawActivity>(`/activities/${id}`);
        return transformActivity(response.data);
    },

    create: async (data: CreateActivityDto): Promise<Activity> => {
        const response = await api.post<RawActivity>("/activities", data);
        return transformActivity(response.data);
    },

    update: async (id: number, data: UpdateActivityDto): Promise<Activity> => {
        const response = await api.patch<RawActivity>(
            `/activities/${id}`,
            data
        );
        return transformActivity(response.data);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/activities/${id}`);
    },
};

export default api;
