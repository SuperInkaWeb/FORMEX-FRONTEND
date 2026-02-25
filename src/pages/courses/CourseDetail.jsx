import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, Globe, User, Share2, PlayCircle, Lock } from 'lucide-react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CourseService from '../../services/courseService.js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto de Auth0
import Swal from 'sweetalert2'; // Importamos alertas visuales

// Cargar Stripe con la clave pública desde variables de entorno
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CourseDetail = () => {
    const { id } = useParams();
    const { isAuthenticated, login, user } = useAuth(); // Obtenemos estado de autenticación
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await CourseService.getCourseById(id);
                setCourse(data);
            } catch (error) {
                console.error("Error cargando curso:", error);
                Swal.fire('Error', 'No se pudo cargar la información del curso', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handlePay = async () => {
        // 1. VALIDACIÓN VISUAL: Si no está logueado, interrumpimos y pedimos login
        if (!isAuthenticated) {
            Swal.fire({
                title: '¡Casi listo!',
                text: 'Para inscribirte en este curso, necesitas iniciar sesión o crear una cuenta.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Iniciar Sesión / Registrarse',
                cancelButtonText: 'Seguir mirando',
                confirmButtonColor: '#F97316', // Naranja corporativo
                cancelButtonColor: '#64748B'
            }).then((result) => {
                if (result.isConfirmed) {
                    login(); // Redirige a Auth0
                }
            });
            return;
        }

        // 2. PROCESO DE PAGO
        try {
            // Feedback visual de carga
            Swal.fire({
                title: 'Preparando pago...',
                text: 'Te estamos redirigiendo a la pasarela segura de Stripe.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

            const response = await fetch(
                `${API_URL}/api/payments/stripe/create-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Enviamos el token para que el backend sepa quién está comprando
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        courseId: Number(id)
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Error al crear sesión de pago');
            }

            const data = await response.json();

            // Redirigir a Stripe
            window.location.href = data.url;

        } catch (error) {
            console.error("Error de pago:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al iniciar el pago. Por favor intenta de nuevo.',
                icon: 'error'
            });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!course) return <div className="text-center py-20 text-xl">Curso no encontrado</div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white pt-32 pb-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-orange-500/20 text-orange-300 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                            {course.category?.name || 'Formex Original'}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">{course.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-8">
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-orange-400"/>
                                Instructor: {course.instructor ? `${course.instructor.name} ${course.instructor.lastname}` : 'Formex Team'}
                            </div>
                            <div className="flex items-center gap-2"><Globe size={18} className="text-orange-400"/> Español</div>
                            <div className="flex items-center gap-2"><Clock size={18} className="text-orange-400"/> Acceso de por vida</div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-slate-800 rounded-2xl overflow-hidden shadow-2xl aspect-video flex items-center justify-center border border-slate-700">
                            {course.imageUrl ? (
                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <PlayCircle size={64} className="text-white/80" />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Detalles y Sidebar de Compra */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Izquierda: Info */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Lo que aprenderás</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[1,2,3,4].map((item) => (
                                        <div key={item} className="flex gap-3 items-start">
                                            <CheckCircle className="text-green-500 shrink-0 mt-1" size={20}/>
                                            <span className="text-gray-600">Dominarás las habilidades fundamentales requeridas.</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Derecha: Tarjeta de Precio */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                               <div className="text-3xl font-extrabold text-gray-900 mb-6">
                                S/ {Number(course.price).toFixed(2)}
                              </div>

                                {/* BOTÓN DINÁMICO SEGÚN AUTENTICACIÓN */}
                                <button
                                    onClick={handlePay}
                                    className={`w-full py-4 font-bold rounded-xl shadow-lg mb-4 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                                        isAuthenticated
                                            ? 'bg-formex-orange text-white hover:bg-orange-600'
                                            : 'bg-slate-800 text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {isAuthenticated ? (
                                        <>Comprar Ahora</>
                                    ) : (
                                        <><Lock size={18} /> Inicia sesión para comprar</>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mb-6">Garantía de devolución de 15 días</p>
                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <h4 className="font-bold text-gray-900">Este curso incluye:</h4>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex gap-3"><Clock size={18}/> Clases 100% en vivo</li>
                                        <li className="flex gap-3"><Share2 size={18}/> Acceso de por vida</li>
                                        <li className="flex gap-3"><CheckCircle size={18}/> Certificado de finalización</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default CourseDetail;