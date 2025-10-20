import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  selectAuthToken,
  selectAuthRole,
  selectAuthLoading,
} from "../slices/authSlice";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = useSelector(selectAuthToken);
  const role = useSelector(selectAuthRole);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
