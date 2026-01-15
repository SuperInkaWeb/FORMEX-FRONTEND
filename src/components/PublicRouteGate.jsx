import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";

const PublicRouteGate = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { userInfo, loadingUser } = useUser();

  // ⛔ Esperar Auth0 + backend
  if (isLoading || loadingUser) return null;

  const roles = userInfo?.roles?.map(r => r.name) || [];

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
