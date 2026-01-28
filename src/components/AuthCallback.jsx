import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDashboardRoute } from '../utils/routes';

const AuthCallback = () => {
  const { isAuthenticated, isLoading, user: auth0User } = useAuth0();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    // Leer posibles parámetros de error que Auth0 devuelva en la callback
    const err = searchParams.get('error');
    const errDesc = searchParams.get('error_description') || searchParams.get('error_description_uri');
    if (err) {
      setErrorInfo({ error: err, description: errDesc });
    }
  }, [searchParams]);

  useEffect(() => {
    if (errorInfo) return; // si hay error, no intentamos redirigir
    if (isLoading) return;
    if (!isAuthenticated) return; // esperar autenticación

    // Extraer roles del namespace de Auth0 (si existen), Auth0 suele devolver un array de strings
    const namespace = 'https://formex.com/roles';
    const userRoles = auth0User?.[namespace] || [];

    // getDashboardRoute espera un array de objetos { name }, adaptamos si vienen como strings
    const rolesNormalized = Array.isArray(userRoles)
      ? (typeof userRoles[0] === 'string' ? userRoles.map(r => ({ name: r })) : userRoles)
      : [];

    const path = getDashboardRoute(rolesNormalized);
    navigate(path, { replace: true });
  }, [isAuthenticated, isLoading, auth0User, navigate, errorInfo]);

  if (errorInfo) {
    const { error, description } = errorInfo;
    return (
      <div className="max-w-3xl mx-auto p-6 mt-12 bg-red-50 border border-red-200 rounded">
        <h2 className="text-lg font-bold text-red-800 mb-2">Error durante el inicio de sesión</h2>
        <p className="text-sm text-red-700 mb-4">Auth0 devolvió: <strong>{error}</strong></p>
        {description && <pre className="whitespace-pre-wrap text-xs text-red-600 mb-4">{description}</pre>}

        <div className="text-sm text-gray-700">
          <p>Posibles causas y comprobaciones:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>Asegúrate de que <code>VITE_AUTH0_AUDIENCE</code> apunta al Identifier de tu API creada en Auth0 (no al Management API que contiene <code>/api/v2</code>).</li>
            <li>En Auth0 Dashboard → Applications → tu Single Page App, verifica que <strong>Allowed Callback URLs</strong> incluye <code>http://localhost:5173/callback</code>.</li>
            <li>Comprueba que <strong>Allowed Web Origins</strong> incluye <code>http://localhost:5173</code>.</li>
            <li>En Auth0 Dashboard → APIs → tu API, verifica que <strong>Signing Algorithm</strong> es <code>RS256</code> y que el Identifier coincide exactamente con <code>VITE_AUTH0_AUDIENCE</code>.</li>
            <li>Revisa los <strong>Logs</strong> en Auth0 (Monitoring → Logs) para la entrada que corresponde al intento de autorización y ver el motivo exacto (403, invalid_audience, etc.).</li>
          </ul>

          <p className="mt-3">Si necesitas, puedes probar temporalmente iniciar sesión sin solicitar audience (esto sólo autentica al usuario, no entrega token para la API): usa el botón <em>Iniciar sesión (sin audience)</em> abajo.</p>

          <div className="mt-4 flex gap-3">
            <a href="/" className="px-3 py-2 bg-gray-100 rounded">Volver al sitio</a>
            <button onClick={() => window.location.href = '/login'} className="px-3 py-2 bg-orange-500 text-white rounded">Intentar login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg font-medium">Finalizando inicio de sesión...</p>
        <p className="text-sm text-gray-500 mt-2">Serás redirigido a tu panel.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
