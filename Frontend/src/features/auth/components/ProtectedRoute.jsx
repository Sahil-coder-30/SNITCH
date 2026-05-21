import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute component to handle role-based access control and authentication checks.
 * If user is not authenticated, redirects to /login.
 * If user does not have required role, redirects to /.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isLoading } = useSelector((state) => state.auth);

    // While checking if the user is authenticated (e.g. during initial page load), show nothing or a loader.
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
