import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { userInfo, loadingUser } = useUser();

  if (isLoading || loadingUser) return <p>Cargando...</p>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!userInfo) return <p>Cargando usuario...</p>;

  const hasRole = (role) => {
    return userInfo.roles?.some(r => r.name === role || r === role);
  };

  if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
