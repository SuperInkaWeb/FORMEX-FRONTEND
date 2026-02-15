import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Usar el hook useAuth directamente desde AuthContext
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // Obtenemos el contexto de autenticación
    const auth = useAuth();

    // Si el contexto no está disponible (componente fuera de <AuthProvider>) evitamos romper
    if (!auth) {
        console.error('ProtectedRoute: useAuth() devolvió undefined. Asegúrate de envolver la app con <AuthProvider>.');
        return <Navigate to="/login" replace />;
    }

    const { isAuthenticated, hasRole, loading } = auth;
    const location = useLocation();

    // 1. Esperar a que Auth0 termine de cargar (Evita redirecciones prematuras)
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // 2. Si no está autenticado, mandar al login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Verificación de Roles (Si la ruta lo requiere)
    if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = allowedRoles.some(role => hasRole(role));

        if (!hasPermission) {
            return <Navigate to="/" replace />;
        }
    }

    // 4. Si pasa todo, mostrar el contenido
    return children;
};

export default ProtectedRoute;