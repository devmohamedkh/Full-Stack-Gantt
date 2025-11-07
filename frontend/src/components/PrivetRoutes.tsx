import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context";
import { LoaderWithErrorHandling } from "./LoaderWithErrorHandling";

const PrivateRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoaderWithErrorHandling loading />
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
