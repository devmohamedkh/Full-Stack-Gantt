import Cookies from "js-cookie";
import type { AuthResponse } from "../types";

const cookiesOpt: Cookies.CookieAttributes = {
    expires: 7,
    path: "/",
    sameSite: "Lax",
    secure: true,
};

export const CookiesService = {
    getToken: () => Cookies.get("token"),
    getRefreshToken: () => Cookies.get("refresh_token"),
    getUser: () => JSON.parse(Cookies.get("user") ?? "null"),

    setTokens: (access: string, refresh: string) => {
        Cookies.set("token", access, cookiesOpt);
        Cookies.set("refresh_token", refresh, cookiesOpt);
    },

    setSession: ({ access_token, refresh_token, user }: AuthResponse) => {
        CookiesService.setTokens(access_token, refresh_token);
        Cookies.set("user", JSON.stringify(user), cookiesOpt);
    },

    clear: () => {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
        Cookies.remove("user", { path: "/" });
    },
};
