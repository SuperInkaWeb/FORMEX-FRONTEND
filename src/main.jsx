import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'sonner';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

// Validaciones útiles en runtime para evitar errores comunes de configuración
if (audience && audience.includes('/api/v2')) {
    console.error("Configuración inválida: VITE_AUTH0_AUDIENCE parece apuntar al Auth0 Management API (contiene '/api/v2').\n" +
        "No solicites tokens para el Management API desde una SPA. Crea en Auth0 una API personalizada (Dashboard → APIs) y usa su 'Identifier' como VITE_AUTH0_AUDIENCE.\n" +
        "Ejemplo de Identifier: https://api.formex.com\n" +
        "Luego actualiza tu .env y reinicia el dev server (npm run dev).\n" +
        "Si necesitas acceso al Management API usa una aplicación de tipo Machine-to-Machine con las credenciales apropiadas.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0Provider
                domain={domain}
                clientId={clientId}
                authorizationParams={{
                    redirect_uri: `${window.location.origin}/callback`,
                    audience: audience,
                }}
                 cacheLocation="localstorage"
                 useRefreshTokens={true}
            >
                <AuthProvider>
                    <UserProvider>
                        <App />
                        <Toaster position="top-right" richColors />
                    </UserProvider>
                </AuthProvider>
            </Auth0Provider>
        </BrowserRouter>
    </React.StrictMode>,
);