// src/components/HomeRedirect.jsx
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "../utils/routes";

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth0();
  const { userInfo, loadingUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userInfo && !loadingUser) {
      const path = getDashboardRoute(userInfo.roles);
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, userInfo, loadingUser, navigate]);

  return null; // este componente solo redirige
};

export default HomeRedirect;
