import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            console.log("Intentando iniciar sesión con:", email);

            // 1. Esperamos la respuesta del login (que incluye los roles)
            const userData = await login(email, password);

            console.log("Login exitoso. Roles detectados:", userData.roles);

            // 2. Lógica de Redirección según Rol
            if (userData.roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else if (userData.roles.includes('ROLE_INSTRUCTOR')) {
                navigate('/instructor');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error("Error en login:", err);
            setError('Credenciales incorrectas o error de conexión con el servidor.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-orange-100 text-formex-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                            <LogIn size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
                        <p className="text-gray-500 text-sm mt-2">Ingresa a tu cuenta para continuar aprendiendo</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100 animate-pulse">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                                <Link to="/forgot-password" className="text-xs font-bold text-formex-orange hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-orange focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Iniciando sesión...' : 'Ingresar a Formex'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        ¿No tienes cuenta aún?{' '}
                        <Link to="/register" className="text-formex-orange font-bold hover:underline">
                            Regístrate gratis
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;