import axios from "axios";
import { CookiesService } from "../services/cookiesService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let isRefreshing = false;

type FailedQueueItem = {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
};
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = CookiesService.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for 401 (Unauthorized) and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue requests while refreshing
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] =
                            "Bearer " + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = CookiesService.getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No refresh token found");
                }

                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {
                        refreshToken: refreshToken,
                    }
                );

                const newAccessToken = data.access_token;

                CookiesService.setTokens(newAccessToken, refreshToken);
                axiosInstance.defaults.headers.common["Authorization"] =
                    "Bearer " + newAccessToken;

                processQueue(null, newAccessToken);
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                CookiesService.clear();
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        if (
            error.response &&
            error.response.data &&
            typeof error.response.data.message === "object" &&
            error.response.data.message.message
        ) {
            error.message = error.response.data.message.message;
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
