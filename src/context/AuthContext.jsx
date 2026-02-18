import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const {
        user: auth0User,
        isAuthenticated,
        isLoading: auth0Loading, // Renombrado para claridad
        loginWithRedirect,
        logout: auth0Logout,
        getAccessTokenSilently
    } = useAuth0();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    // Estado de carga interno para sincronizar nuestra lógica
    const [isSyncing, setIsSyncing] = useState(true);

    useEffect(() => {
        const syncUser = async () => {
            // 1. Si Auth0 aún está cargando, esperamos
            if (auth0Loading) {
                return;
            }

            // 2. Si Auth0 dice que estamos autenticados, sincronizamos
            if (isAuthenticated && auth0User) {
                try {
                    const accessToken = await getAccessTokenSilently({
                        authorizationParams: {
                            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                            scope: "openid profile email"
                        }
                    });

                    localStorage.setItem('token', accessToken);
                    setToken(accessToken);

                    const namespace = 'https://formex.com/roles';
                   const userRoles = auth0User[namespace] ?? [];

                    setUser({
                        sub: auth0User.sub,
                        email: auth0User.email,
                        name: auth0User.given_name || auth0User.name,
                        lastname: auth0User.family_name || '',
                        picture: auth0User.picture,
                        roles: userRoles
                    });
                    setRoles(userRoles);

                    

                    // Redirección inteligente SOLO si venimos del login explícito
                    // (Evita redirigir al recargar la página si ya estás en una ruta protegida)
                    const currentPath = window.location.pathname;
                   if (currentPath === '/login' || currentPath === '/callback') {
    if (userRoles.includes('ROLE_ADMIN')) navigate('/admin');
    else if (userRoles.includes('ROLE_INSTRUCTOR')) navigate('/instructor');
    else if (userRoles.includes('ROLE_STUDENT')) navigate('/student');
    else navigate('/'); // fallback
}


                } catch (error) {
                    console.error("Error Auth0:", error);
                    if (error.error === 'consent_required' || error.error === 'login_required') {
                        await loginWithRedirect({
                            authorizationParams: {
                                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                                scope: "openid profile email"
                            }
                        });
                    }
                }
            } else {
                // No autenticado
                localStorage.removeItem('token');
                setUser(null);
                setRoles([]);
                setToken(null);
            }

            // 3. Finalizamos la sincronización
            setIsSyncing(false);
        };

        syncUser();
    }, [isAuthenticated, auth0User, auth0Loading, getAccessTokenSilently, loginWithRedirect, navigate]);

    const login = () => loginWithRedirect();

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        auth0Logout({
            logoutParams: { returnTo: window.location.origin }
        });
    };

    const hasRole = (requiredRole) => {
        if (!roles || roles.length === 0) return false;
        return roles.includes(requiredRole);
    };

    // Renderizamos un spinner mientras Auth0 carga o estamos sincronizando
    // Esto es CLAVE: evita que la app renderice como "deslogueado" antes de tiempo
    if (auth0Loading || isSyncing) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Cargando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated,
            loading: isSyncing,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};