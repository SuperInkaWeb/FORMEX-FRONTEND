import axios from 'axios';

// Usar variable de entorno con fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL, // Mantenemos la base URL limpia (sin /api extra si tus rutas ya lo tienen)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el Token (solo si existe y es válido)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // CORRECCIÓN CRÍTICA: Solo agregamos el header si el token existe Y no es "undefined" o "null" (texto)
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;