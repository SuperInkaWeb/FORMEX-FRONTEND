import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    // 1. Si no está logueado -> Redirigir al Login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Si se requieren roles específicos (ej: ['ROLE_ADMIN']) y el usuario no los tiene
    if (roles && roles.length > 0) {
        const userRoles = user.roles || []; // Asumiendo que el backend devuelve roles como array de strings

        // Verificamos si tiene AL MENOS UNO de los roles requeridos
        // Nota: Ajusta esto si tu backend devuelve objetos {id, name} en lugar de strings
        const hasRole = roles.some(requiredRole =>
            userRoles.includes(requiredRole) ||
            userRoles.some(r => r.name === requiredRole) // Soporte por si viene como objeto
        );

        if (!hasRole) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
                    <p className="text-gray-600 text-lg mb-6">No tienes permiso para acceder a esta página.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-formex-dark text-white rounded-lg hover:bg-black transition-colors"
                    >
                        Regresar
                    </button>
                </div>
            );
        }
    }

    // 3. Si todo está bien, mostrar la página protegida
    return children;
};

export default ProtectedRoute;