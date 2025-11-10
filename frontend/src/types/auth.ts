export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
    role: UserRole;
}

export interface AuthResponse {
    user: AuthUser;
    access_token: string;
    refresh_token: string;
}

export interface RefreshToken {
    refreshToken: string;
}

export interface AccessToken {
    access_token: string;
}

export enum UserRole {
    EMPLOYEE = "employee",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
}
