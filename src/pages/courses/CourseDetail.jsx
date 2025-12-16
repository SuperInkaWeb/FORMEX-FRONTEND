import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Globe, User, Share2, PlayCircle } from 'lucide-react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CourseService from '../../services/courseService.js';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await CourseService.getCourseById(id);
                setCourse(data);
            } catch (error) {
                console.error("Error al cargar curso", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
    if (!course) return <div className="h-screen flex items-center justify-center">Curso no encontrado</div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Header del Curso */}
            <section className="bg-formex-dark text-white pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12 items-center">
                        <div className="md:col-span-2">
                            <div className="flex gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-formex-lime">
                                <span>{course.category?.name}</span>
                                <span>•</span>
                                <span>{course.level}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{course.title}</h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl">{course.description}</p>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8">
                                <div className="flex items-center gap-2"><User size={18}/> Instructor: {course.instructor?.fullName || 'Equipo Formex'}</div>
                                <div className="flex items-center gap-2"><Globe size={18}/> Español</div>
                                <div className="flex items-center gap-2"><Clock size={18}/> En vivo</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenido y Tarjeta de Compra */}
            <section className="py-12 bg-gray-50 min-h-[500px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid md:grid-cols-3 gap-12">

                        {/* Columna Izq: Detalles */}
                        <div className="md:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Lo que aprenderás</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="flex gap-3">
                                            <CheckCircle className="text-formex-orange flex-shrink-0" size={20}/>
                                            <span className="text-gray-600">Habilidad práctica clave #{i}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Columna Der: Tarjeta Flotante (Sticky) */}
                        <div className="relative">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 md:-mt-48 sticky top-24">
                                <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden relative group cursor-pointer">
                                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                        <PlayCircle size={48} className="text-white opacity-90"/>
                                    </div>
                                </div>
                                <div className="text-3xl font-extrabold text-gray-900 mb-6">${course.price}</div>
                                <button className="w-full py-4 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg mb-4">
                                    Comprar Ahora
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

            <Footer />
        </div>
    );
};

export default CourseDetail;