// src/components/AuthSync.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const AuthSync = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated) return;

      try {
        // 🔹 Obtener el token desde Auth0
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://api.formex.com",
          },
        });

        // 🔹 Mostrar el token en consola para verificar su contenido
        console.log("Token recibido:", token);

        // 🔹 Guardar el token en localStorage para que Axios lo use
        localStorage.setItem("token", token);

        // 🔹 Llamar al backend para obtener datos del usuario autenticado
        const response = await fetch("http://localhost:8080/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error sincronizando usuario");
        }

        const userData = await response.json();
        console.log("Usuario sincronizado:", userData);
      } catch (error) {
        console.error("Error sincronizando usuario:", error);
      }
    };

    syncUser();
  }, [isAuthenticated, getAccessTokenSilently]);

  return null; // Este componente no renderiza nada en pantalla
};

export default AuthSync;
