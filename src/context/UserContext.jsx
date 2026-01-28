/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Valor por defecto seguro: evita que useUser() devuelva null si alguien olvida envolver con el provider
const UserContext = createContext({ userInfo: null, loadingUser: true });

const decodeJwt = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

const normalizeRolesFromClaim = (claim) => {
  if (!claim) return [];
  // claim may be array of strings or array of objects
  if (Array.isArray(claim)) {
    return claim.map(r => (typeof r === 'string' ? r : (r.name || r.authority || r.role || ''))).filter(Boolean);
  }
  return [];
};

export const UserProvider = ({ children }) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (isLoading) return; // ⛔ ESPERA A AUTH0

    const loadUser = async () => {
      if (!isAuthenticated) {
        setUserInfo(null);
        setLoadingUser(false);
        return;
      }

      const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
      const helpMsg = `Auth0: 'Service not found' para audience "${audience}". Asegúrate de que VITE_AUTH0_AUDIENCE coincide con el Identifier de tu API en Auth0 (Dashboard > APIs > tu API > Identifier).`;

      try {
        if (!audience) {
          console.warn('VITE_AUTH0_AUDIENCE no está configurado. Se omite fetch al backend.');
          setUserInfo(null);
          setLoadingUser(false);
          return;
        }

        let token;
        try {
          token = await getAccessTokenSilently({
            authorizationParams: {
              audience,
            },
          });
        } catch (authErr) {
          const errMsg = authErr && authErr.message ? authErr.message : String(authErr);
          console.warn('getAccessTokenSilently con audience falló:', errMsg);

          if (errMsg.includes('Service not found')) {
            if (import.meta.env.DEV) {
              console.warn(helpMsg + ' (DESARROLLO: se intentará fallback sin audience).');
              try {
                token = await getAccessTokenSilently();
              } catch (innerErr) {
                console.error('Fallback sin audience falló:', innerErr && innerErr.message ? innerErr.message : innerErr);
                setUserInfo(null);
                setLoadingUser(false);
                return;
              }
            } else {
              console.error(helpMsg);
              setUserInfo(null);
              setLoadingUser(false);
              return;
            }
          }

          console.error('Error no relacionado con audience al obtener token:', errMsg);
          setUserInfo(null);
          setLoadingUser(false);
          return;
        }

        // Obtener info desde backend
        const res = await fetch("http://localhost:8080/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          console.error(`Backend /api/me responded ${res.status}: ${text}`);
          // Intentar construir userInfo desde el token si existe
          const tokenClaims = token ? decodeJwt(token) : null;
          if (tokenClaims) {
            const mappedUser = {
              sub: tokenClaims.sub,
              email: tokenClaims.email,
              name: tokenClaims.name || tokenClaims.given_name,
              picture: tokenClaims.picture,
              roles: normalizeRolesFromClaim(tokenClaims['https://formex.com/roles'])
            };
            setUserInfo(mappedUser);
          } else {
            setUserInfo(null);
          }
          setLoadingUser(false);
          return;
        }

        const data = await res.json();

        // Si el backend devolvió solo un id o un string, usamos el token para construir userInfo
        if (!data || typeof data === 'string' || !data.roles) {
          const tokenClaims = token ? decodeJwt(token) : null;
          if (tokenClaims) {
            const mappedUser = {
              sub: tokenClaims.sub,
              email: tokenClaims.email,
              name: tokenClaims.name || tokenClaims.given_name,
              picture: tokenClaims.picture,
              // build roles from claim or from backend if present
              roles: data && data.roles ? data.roles : normalizeRolesFromClaim(tokenClaims['https://formex.com/roles'])
            };
            setUserInfo(mappedUser);
          } else {
            // si no hay tokenClaims, usar data tal cual (aunque sea string)
            setUserInfo(typeof data === 'object' ? data : { id: data });
          }
        } else {
          // backend devolvió un objeto con roles
          setUserInfo(data);
        }

      } catch (error) {
        const msg = error && error.message ? error.message : String(error);
        if (msg.includes('Service not found')) {
          console.error(helpMsg);
        } else {
          console.error("Error loading user:", msg);
        }
        setUserInfo(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return (
    <UserContext.Provider value={{ userInfo, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
