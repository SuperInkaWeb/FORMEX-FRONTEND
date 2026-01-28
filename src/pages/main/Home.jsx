import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CourseService from '../../services/courseService.js';

const Hero = () => {
    const [courses, setCourses] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fadeClass, setFadeClass] = useState('opacity-100');

    useEffect(() => {
        // Cargar cursos disponibles
        const fetchCourses = async () => {
            try {
                const coursesData = await CourseService.getAllCourses();
                // Filtrar cursos que tengan imagen
                const coursesWithImages = coursesData.filter(course => course.imageUrl);
                setCourses(coursesWithImages);
            } catch (error) {
                console.error("Error cargando cursos:", error);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (courses.length === 0) return;

        // Cambiar imagen cada 5 segundos con efecto de desvanecimiento
        const interval = setInterval(() => {
            // Iniciar desvanecimiento
            setFadeClass('opacity-0');

            // Después de 500ms cambiar la imagen y hacer aparecer
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % courses.length);
                setFadeClass('opacity-100');
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, [courses.length]);

    // Imagen por defecto si no hay cursos con imágenes
    const defaultImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    const currentImage = courses.length > 0 ? courses[currentImageIndex].imageUrl : defaultImage;
    const currentTitle = courses.length > 0 ? courses[currentImageIndex].title : "Cursos Formex";

    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="text-left animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-formex-orange text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-formex-orange animate-pulse"></span>

                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                            Domina el futuro <br/>
                            <span className="relative inline-block text-formex-orange">en tiempo real</span>
                        </h1>
                        <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                            Únete a la plataforma de educación en vivo más interactiva. Mentorías personalizadas, proyectos reales y certificación.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/catalog" className="px-8 py-4 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">Explorar Cursos</Link>
                            <Link to="/benefits" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">Ver Beneficios</Link>
                        </div>
                    </div>
                    <div className="relative lg:h-[500px] flex items-center justify-center">
                        <div className="absolute top-10 right-10 w-72 h-72 bg-formex-lime rounded-full filter blur-[80px] opacity-40 animate-pulse"></div>
                        <img
                            src={currentImage}
                            alt={currentTitle}
                            className={`rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 border-4 border-white relative z-10 ${fadeClass}`}
                            onError={(e) => e.target.src = defaultImage}
                        />
                        {courses.length > 0 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                {courses.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setFadeClass('opacity-0');
                                            setTimeout(() => {
                                                setCurrentImageIndex(index);
                                                setFadeClass('opacity-100');
                                            }, 300);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentImageIndex 
                                                ? 'bg-formex-orange w-8' 
                                                : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                        aria-label={`Ver curso ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Home = () => (
    <div className="min-h-screen bg-white font-sans selection:bg-formex-orange selection:text-white">
        <Navbar />
        <Hero />
        {/* Secciones extra simplificadas para el ejemplo */}
        <div className="py-20 bg-gray-50 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para aprender?</h2>
            <Link to="/catalog" className="text-formex-orange font-bold hover:underline">Ver todos los cursos &rarr;</Link>
        </div>
    </div>
);

export default Home;
