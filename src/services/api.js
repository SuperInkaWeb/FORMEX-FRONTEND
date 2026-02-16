import axios from 'axios';

// Usar variable de entorno - REQUERIDA en producción
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// DEBUG: Log para verificar qué URL se está usando
console.log('[API Config] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('[API Config] Using API_URL:', API_URL);

// Advertencia en producción si usa localhost
if (import.meta.env.PROD && API_URL.includes('localhost')) {
    console.error('⚠️ ERROR: VITE_API_URL no está configurada en Vercel. El frontend está usando localhost como fallback.');
}

const api = axios.create({
    baseURL: API_URL, // Mantenemos la base URL limpia (sin /api extra si tus rutas ya lo tienen)

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