import type {
    AccessToken,
    AuthResponse,
    LoginRequest,
    RefreshToken,
} from "../types/auth";
import axiosInstance from "../utils/axiosInstance";

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post("/auth/login", data);
        return res.data;
    },

    logout: async (data: RefreshToken) => {
        await axiosInstance.post("/auth/logout", data);
    },

    refreshToken: async (data: RefreshToken): Promise<AccessToken> => {
        const res = await axiosInstance.post("/auth/refresh", data);
        return res.data;
    },
};

export default axiosInstance;
