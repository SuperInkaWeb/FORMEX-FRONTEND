import axios from 'axios';

// 1. Crear instancia apuntando a tu Backend Spring Boot
const api = axios.create({
    baseURL: 'http://localhost:8080', // Puerto de Java
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor: Antes de cada petición, inyectar el Token si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;