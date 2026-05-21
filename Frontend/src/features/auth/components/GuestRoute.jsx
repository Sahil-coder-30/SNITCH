import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * GuestRoute — only accessible to unauthenticated users.
 * If a logged-in user visits a guest-only route (e.g. "/"),
 * they are redirected to their role-specific dashboard.
 */
const GuestRoute = () => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) return null;

    if (user) {
        const role = user.role?.toUpperCase();
        if (role === 'SELLER') return <Navigate to="/seller" replace />;
        if (role === 'BUYER')  return <Navigate to="/buyer"  replace />;
        // Fallback for unknown roles — still redirect away from public storefront
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
