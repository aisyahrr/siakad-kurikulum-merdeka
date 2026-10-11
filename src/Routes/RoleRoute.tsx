import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/Hooks/useAuth";
import type { UserRole } from "@/Types/auth";

export function RoleRoute({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
}
