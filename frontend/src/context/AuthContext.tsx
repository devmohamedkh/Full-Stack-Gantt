import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { authApi } from "../services";
import type { AuthUser } from "../types";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cookieToken = Cookies.get("token");
        const cookieUser = Cookies.get("user");
        if (cookieToken && cookieUser) {
            setToken(cookieToken);
            try {
                const parsedUser: AuthUser = JSON.parse(cookieUser);
                setUser(parsedUser);
            } catch {
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await authApi.login({ email, password });
            const { access_token, refresh_token, user: userInfo } = res;

            Cookies.set("token", access_token, { expires: 7, path: "/", sameSite: "lax" });
            Cookies.set("refresh_token", refresh_token, { expires: 7, path: "/", sameSite: "lax", secure: true });
            Cookies.set("user", JSON.stringify(userInfo), { expires: 7, path: "/", sameSite: "lax" });

            setUser(userInfo);
            setToken(access_token);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            authApi.logout();
        } finally {
            setUser(null);
            setToken(null);
            Cookies.remove("token", { path: "/" });
            Cookies.remove("user", { path: "/" });
            Cookies.remove("refresh_token", { path: "/" });
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
