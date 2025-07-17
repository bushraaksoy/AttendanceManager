import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRoutesProps {
  roles: string[];
  userRole?: string;
  isAuthenticated?: boolean;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({
  roles,
  userRole = "admin", // Default to admin for demo
  isAuthenticated = true, // Default to authenticated for demo
}) => {
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = roles.some(
    (role) => role.toLowerCase() === userRole.toLowerCase(),
  );

  if (!hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
