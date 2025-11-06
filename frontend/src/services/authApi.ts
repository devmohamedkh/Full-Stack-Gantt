import type { AuthResponse, LoginRequest } from "../types/auth";
import axiosInstance from "../utils/axiosInstance";

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post("/auth/login", data);
        return res.data;
    },

    logout: async () => {
        await axiosInstance.post("/auth/logout", {});
    },
};

export default axiosInstance;
