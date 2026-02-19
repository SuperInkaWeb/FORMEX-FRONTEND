import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Users, Globe, ArrowRight, CheckCircle } from 'lucide-react';


const About = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
          

            {/* 1. HERO SECTION (Dark Mode para contraste) */}
            <section className="pt-32 pb-20 bg-formex-dark text-white relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-formex-orange rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-formex-lime rounded-full mix-blend-multiply filter blur-[100px] opacity-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-formex-lime font-bold tracking-widest uppercase text-sm mb-4 block">Nuestra Historia</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                        Revolucionando la <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-formex-orange to-orange-500">educación en vivo</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        En FORMEX creemos que la educación pre-grabada está obsoleta.
                        Nacimos para conectar a estudiantes ambiciosos con expertos reales que trabajan hoy en la industria.
                    </p>
                </div>
            </section>

            {/* 2. MISIÓN Y VISIÓN (Grid dividido) */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Columna Texto */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-formex-orange text-xs font-bold uppercase mb-6">
                                <Target size={14} />
                                Nuestro Propósito
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Democratizar el acceso al conocimiento técnico real
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                No vendemos cursos, creamos carreras. Nuestra misión es cerrar la brecha entre lo que enseñan las universidades y lo que realmente piden las empresas tecnológicas hoy en día.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Eliminar la barrera de los videos desactualizados.",
                                    "Fomentar el networking real entre Latinoamérica.",
                                    "Validar habilidades con proyectos, no solo exámenes."
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle className="text-formex-lime mt-1 flex-shrink-0" size={20} fill="#1a1a1a" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/catalog" className="inline-flex items-center gap-2 text-formex-orange font-bold hover:gap-3 transition-all">
                                Ver nuestra metodología <ArrowRight size={20}/>
                            </Link>
                        </div>

                        {/* Columna Imagen */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-formex-lime/20 rounded-3xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Equipo trabajando"
                                className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                            />

                            {/* Stats Flotantes */}
                            <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="bg-orange-100 p-2 rounded-lg text-formex-orange">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">3,000+</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Estudiantes Graduados</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. NUESTROS VALORES */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">Lo que nos mueve</h2>
                        <p className="text-gray-500 mt-4">Los pilares fundamentales de la cultura Formex.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe size={32}/>,
                                title: "Sin Fronteras",
                                desc: "El talento está distribuido equitativamente, las oportunidades no. Nosotros llevamos las oportunidades a donde estés.",
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                icon: <Heart size={32}/>,
                                title: "Comunidad Primero",
                                desc: "No eres un número de matrícula. Eres parte de una red de apoyo profesional que te acompañará por años.",
                                color: "bg-red-100 text-red-600"
                            },
                            {
                                icon: <Target size={32}/>,
                                title: "Excelencia Práctica",
                                desc: "La teoría es importante, pero la práctica es vital. Si no puedes construirlo, no lo has aprendido.",
                                color: "bg-purple-100 text-purple-600"
                            }
                        ].map((val, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className={`w-14 h-14 ${val.color} rounded-xl flex items-center justify-center mb-6`}>
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. CTA FINAL */}
            <section className="py-24 bg-formex-dark text-white relative overflow-hidden text-center">
                <div className="relative z-10 max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">¿Listo para transformar tu carrera?</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Únete a la próxima generación de profesionales digitales. Sin riesgos, con garantía de satisfacción.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="px-8 py-4 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30">
                            Comenzar Ahora
                        </Link>
                        <Link to="/contact" className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                            Hablar con Admisión
                        </Link>
                    </div>
                </div>
            </section>

        
        </div>
    );
};

export default About;