import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context";

const PrivateRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
