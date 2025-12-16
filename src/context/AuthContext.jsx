import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Al cargar la app, verificar si hay un token guardado
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Opcional: Validar token con el backend (Entregable 1.06)
                    const { data } = await api.get('/api/users/me');
                    setUser(data);
                } catch (error) {
                    console.error("Sesión expirada");
                    logout();
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // 2. Función de Login
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token); // Guardar el JWT
        // Guardamos datos básicos del usuario
        setUser({
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            roles: data.roles
        });
        return data;
    };

    // 3. Función de Registro
    const register = async (userData) => {
        // userData debe coincidir con tu SignupRequest de Java
        const { data } = await api.post('/auth/register', userData);
        return data;
    };

    // 4. Función de Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácil
export const useAuth = () => useContext(AuthContext);