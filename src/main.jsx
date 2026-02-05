import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // 1. Importar BrowserRouter
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

// Validaciones útiles en runtime para evitar errores comunes de configuración
if (audience && audience.includes('/api/v2')) {
    // El Management API de Auth0 no debe usarse como audience desde una SPA pública
    // porque requiere permisos y no está pensado como API para usuarios finales.
    // Mostrar instrucción clara en la consola del navegador.
    console.error("Configuración inválida: VITE_AUTH0_AUDIENCE parece apuntar al Auth0 Management API (contiene '/api/v2').\n" +
        "No solicites tokens para el Management API desde una SPA. Crea en Auth0 una API personalizada (Dashboard → APIs) y usa su 'Identifier' como VITE_AUTH0_AUDIENCE.\n" +
        "Ejemplo de Identifier: https://api.formex.com\n" +
        "Luego actualiza tu .env y reinicia el dev server (npm run dev).\n" +
        "Si necesitas acceso al Management API usa una aplicación de tipo Machine-to-Machine con las credenciales apropiadas.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter> {/* 2. Envolver todo con BrowserRouter al inicio */}
            <Auth0Provider
                domain={domain}
                clientId={clientId}
                authorizationParams={{
                    redirect_uri: `${window.location.origin}/callback`,
                    audience: audience,
                }}
            >
                <AuthProvider>
                    <UserProvider>
                        <App />
                    </UserProvider>
                </AuthProvider>
            </Auth0Provider>
        </BrowserRouter>
    </React.StrictMode>,
);