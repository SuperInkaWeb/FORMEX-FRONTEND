import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar.jsx';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Llamada al backend
            await register(formData);
            // Redirigir al login tras éxito
            navigate('/login');
            alert("¡Cuenta creada! Por favor inicia sesión.");
        } catch (err) {
            // Manejo de error si el email ya existe (viene del backend MessageResponse)
            const msg = err.response?.data?.message || 'Error al registrarse';
            setError(msg);
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
                        <div className="w-12 h-12 bg-formex-lime text-formex-dark rounded-xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta gratis</h1>
                        <p className="text-gray-500 text-sm mt-2">Únete a más de 3,000 estudiantes hoy</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                            <input name="fullName" type="text" required
                                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-lime focus:ring-4 focus:ring-lime-50 outline-none transition-all"
                                   placeholder="Juan Pérez"
                                   onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
                            <input name="email" type="email" required
                                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-lime focus:ring-4 focus:ring-lime-50 outline-none transition-all"
                                   placeholder="juan@correo.com"
                                   onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                            <input name="phone" type="tel"
                                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-lime focus:ring-4 focus:ring-lime-50 outline-none transition-all"
                                   placeholder="+51 999 000 000"
                                   onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                            <input name="password" type="password" required
                                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-formex-lime focus:ring-4 focus:ring-lime-50 outline-none transition-all"
                                   placeholder="••••••••"
                                   onChange={handleChange}
                            />
                        </div>

                        <div className="text-xs text-gray-500 leading-relaxed">
                            Al registrarte aceptas nuestros <a href="#" className="underline">Términos</a> y <a href="#" className="underline">Política de Privacidad</a>.
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-formex-dark text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Creando cuenta...' : 'Comenzar Aventura'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-formex-orange font-bold hover:underline">
                            Inicia Sesión
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;