import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../services/api.js';
import Navbar from '../../components/Navbar.jsx';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('success');
            setMessage('Hemos enviado un enlace de recuperación a tu correo.');
        } catch (error) {
            setStatus('error');
            setMessage('No pudimos encontrar ese correo o hubo un error.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">

                    <Link to="/login" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6 text-sm font-bold">
                        <ArrowLeft size={16} /> Volver al Login
                    </Link>

                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Correo Enviado!</h2>
                            <p className="text-gray-500 mb-6">{message}</p>
                            <Link to="/login" className="text-formex-orange font-bold hover:underline">Ir a Iniciar Sesión</Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail size={24} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
                                <p className="text-gray-500 text-sm mt-2">Ingresa tu correo y te enviaremos instrucciones.</p>
                            </div>

                            {status === 'error' && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-orange outline-none"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3 bg-formex-dark text-white font-bold rounded-xl hover:bg-black transition-all"
                                >
                                    {status === 'loading' ? 'Enviando...' : 'Enviar Enlace'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;