import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { authApi } from "../services";
import type { AuthUser } from "../types";
import { CookiesService } from "../services/cookiesService";

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const cookieToken = CookiesService.getToken();
        const cookieUser = CookiesService.getUser();


        if (cookieToken && cookieUser) {
            setUser(cookieUser);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await authApi.login({ email, password });
            CookiesService.setSession(res)
            setUser(res.user);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {

            await authApi.logout({ refreshToken: CookiesService.getRefreshToken()! });
        } finally {
            setUser(null);
            CookiesService.clear()
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
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
