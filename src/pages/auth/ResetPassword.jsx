import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';
import Navbar from '../../components/Navbar.jsx';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Capturamos el token de la URL

    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        if (!token) {
            setStatus('error');
            return;
        }

        try {
            // Endpoint: /auth/reset-password?token=XYZ
            await api.post(`/auth/reset-password?token=${token}`, { password });
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000); // Redirigir tras 3 seg
        } catch (error) {
            setStatus('error');
        }
    };

    if (!token) return <div className="p-10 text-center text-red-500">Token inválido o faltante.</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">

                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">¡Contraseña Actualizada!</h2>
                            <p className="text-gray-500 mt-2">Redirigiendo al login...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-orange-100 text-formex-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Lock size={24} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Nueva Contraseña</h1>
                                <p className="text-gray-500 text-sm mt-2">Ingresa tu nueva clave segura.</p>
                            </div>

                            {status === 'error' && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                                    El enlace ha expirado o es inválido.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-orange outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all"
                                >
                                    {status === 'loading' ? 'Actualizando...' : 'Cambiar Contraseña'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;