import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context";
import { LoaderWithErrorHandling } from "./LoaderWithErrorHandling";
import type { UserRole } from "../types";

interface PrivateRoutesProps {
    allowRoles?: UserRole[];
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ allowRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoaderWithErrorHandling loading />
    }

    if (!user || Array.isArray(allowRoles) &&
        allowRoles.length > 0 &&
        (!user.role || !allowRoles.includes(user.role))) {
        return <Navigate to="/login" replace />;
    }


    return <Outlet />;
};

export default PrivateRoutes;
