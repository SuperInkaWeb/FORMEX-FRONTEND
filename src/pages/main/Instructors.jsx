import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { instructors } from '../../utils/instructorsData';
import { Linkedin, Twitter, ExternalLink } from 'lucide-react';

const Instructors = () => {

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header de la sección */}
            <header className="pt-32 pb-16 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-formex-dark mb-6">
                        Nuestros <span className="text-formex-orange">Expertos</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        En FORMEX no solo aprendes teoría. Aprendes de profesionales reales que están moldeando el futuro de sus industrias hoy mismo.
                    </p>
                </div>
            </header>

            {/* Grid de Instructores */}
            <main className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {instructors.map((instructor) => (
                        <div
                            key={instructor.id}
                            className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            {/* Imagen del Instructor */}
                            <div className="relative mb-6 overflow-hidden rounded-2xl aspect-square bg-gray-100">
                                <Link to={`/instructor/${instructor.id}`} className="block w-full h-full">
                                    <img 
                                        src={instructor.image} 
                                        alt={instructor.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                    />
                                </Link>
                                <div className="absolute inset-0 bg-gradient-to-t from-formex-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                                    <div className="flex gap-3 pointer-events-auto">
                                        <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-formex-orange transition-colors">
                                            <Linkedin size={18} />
                                        </a>
                                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-formex-orange transition-colors">
                                            <Twitter size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-formex-orange bg-formex-orange/10 px-3 py-1 rounded-full">
                                    {instructor.specialty}
                                </span>
                                <h3 className="text-2xl font-bold text-formex-dark group-hover:text-formex-orange transition-colors">
                                    {instructor.name}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                    {instructor.shortBio}
                                </p>
                            </div>

                            {/* Botón Call to Action */}
                            <Link
                                to={`/instructor/${instructor.id}`}
                                className="mt-8 w-full py-4 border-2 border-gray-100 rounded-2xl text-gray-700 font-bold group-hover:border-formex-orange group-hover:text-formex-orange transition-all flex items-center justify-center gap-2"
                            >
                                Ver Perfil Completo <ExternalLink size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            </main>

            {/* Sección de CTA */}
            <section className="bg-formex-dark py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                        ¿Eres un experto en tu campo?
                    </h2>
                    <p className="text-gray-400 mb-10 max-w-xl mx-auto">
                        Únete a nuestra red de instructores y ayuda a formar a la próxima generación de talentos.
                    </p>
                    <Link 
                        to="/be-instructor"
                        className="inline-block px-10 py-4 bg-formex-orange text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/20"
                    >
                        Convertirme en Instructor
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Instructors;
