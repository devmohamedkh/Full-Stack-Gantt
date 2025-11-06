import {
    ActivityStatus,
    type Activity,
    type CreateActivityDto,
    type PaginatedResponse,
    type PaginationParams,
    type RawActivity,
    type UpdateActivityDto,
} from "../types";
import axiosInstance from "../utils/axiosInstance";

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
        const response = await axiosInstance.get<
            PaginatedResponse<RawActivity>
        >("/activities", { params });

        return response.data?.data.map(transformActivity);
    },

    getById: async (id: number): Promise<Activity> => {
        const response = await axiosInstance.get<RawActivity>(
            `/activities/${id}`
        );
        return transformActivity(response.data);
    },

    create: async (data: CreateActivityDto): Promise<Activity> => {
        const response = await axiosInstance.post<RawActivity>(
            "/activities",
            data
        );
        return transformActivity(response.data);
    },

    update: async (id: number, data: UpdateActivityDto): Promise<Activity> => {
        const response = await axiosInstance.patch<RawActivity>(
            `/activities/${id}`,
            data
        );
        return transformActivity(response.data);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/activities/${id}`);
    },
};
