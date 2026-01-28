import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import { useAuth } from '../context/useAuth';
import { getRoleNames } from '../utils/roles';

const PublicRouteGate = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { userInfo, loadingUser } = useUser();
  const auth = useAuth();

  // ⛔ Esperar Auth0 + backend
  if (isLoading || loadingUser) return null;

  const roles = getRoleNames({ userInfo, authUser: auth.user });

  // 🚫 SOLO Admin e Instructor NO deben ver Home
  const isAdminOrInstructor =
    roles.includes("ROLE_ADMIN") || roles.includes("ROLE_INSTRUCTOR");

  if (isAuthenticated && isAdminOrInstructor) {
    return null;
  }

  // ✅ Público y Estudiante sí ven Home
  return children;
};

export default PublicRouteGate;
