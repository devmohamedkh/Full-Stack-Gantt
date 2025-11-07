import Cookies from "js-cookie";
import type { AuthResponse } from "../types";

export const CookiesService = {
    getToken: () => Cookies.get("token"),
    getRefreshToken: () => Cookies.get("refresh_token"),
    getUser: () => JSON.parse(Cookies.get("user") ?? "null"),

    setSession: ({ access_token, refresh_token, user }: AuthResponse) => {
        Cookies.set("token", access_token, { expires: 7, path: "/" });
        Cookies.set("refresh_token", refresh_token, { expires: 7, path: "/" });
        Cookies.set("user", JSON.stringify(user), { expires: 7, path: "/" });
    },

    clear: () => {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
        Cookies.remove("user", { path: "/" });
    },
};
