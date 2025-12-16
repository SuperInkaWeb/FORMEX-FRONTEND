import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Users, Trophy, CheckCircle, MessageCircle, Star, Zap, Target, Award } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Benefits = () => {
    const benefitsList = [
        {
            icon: <Monitor size={40} />,
            title: "100% En Vivo",
            desc: "Nada de videos grabados en 2019. Aquí el código se escribe en tiempo real. Si el instructor se equivoca, aprendes cómo lo soluciona en vivo.",
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <Users size={40} />,
            title: "Networking Real",
            desc: "Tus compañeros de clase son profesionales como tú. Conecta con desarrolladores de toda Latinoamérica y expande tu red de contactos.",
            color: "text-purple-600 bg-purple-50"
        },
        {
            icon: <Trophy size={40} />,
            title: "Proyectos de Portafolio",
            desc: "No hacemos el típico 'To-Do List'. Construimos clones de aplicaciones reales (Spotify, Airbnb, Trello) que podrás mostrar en tu CV.",
            color: "text-orange-600 bg-orange-50"
        },
        {
            icon: <MessageCircle size={40} />,
            title: "Mentoría 1 a 1",
            desc: "Tendrás acceso a 'Office Hours' semanales donde podrás agendar 15 minutos privados con tu mentor para revisar tu código o dudas de carrera.",
            color: "text-green-600 bg-green-50"
        },
        {
            icon: <Award size={40} />,
            title: "Certificación Validada",
            desc: "Nuestros certificados no se regalan. Validan horas reales de práctica y asistencia, lo que los hace valiosos para los reclutadores.",
            color: "text-red-600 bg-red-50"
        },
        {
            icon: <Zap size={40} />,
            title: "Actualización Constante",
            desc: "Al ser en vivo, nuestros temarios se actualizan cada mes. Si sale una nueva versión de React hoy, la enseñamos mañana.",
            color: "text-yellow-600 bg-yellow-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-formex-dark text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-formex-lime rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-pulse"></div>
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <span className="text-formex-orange font-bold tracking-widest uppercase text-sm mb-4 block">Propuesta de Valor</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        ¿Por qué elegir <span className="text-formex-lime">FORMEX</span>?
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Descubre la diferencia entre ver videos pasivamente y aprender activamente con expertos de la industria.
                    </p>
                </div>
            </section>

            {/* Grid de Beneficios */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefitsList.map((item, idx) => (
                            <div key={idx} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white group">
                                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparativa vs Grabado */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Formex vs. Cursos Grabados</h2>
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="grid grid-cols-3 bg-gray-100 p-4 font-bold text-gray-700 text-center border-b border-gray-200">
                            <div className="text-left pl-4">Característica</div>
                            <div className="text-gray-400">Otros (Grabados)</div>
                            <div className="text-formex-orange">FORMEX (En Vivo)</div>
                        </div>

                        {[
                            { feature: "Resolución de dudas", others: "Foros lentos", formex: "En el momento" },
                            { feature: "Actualización de contenido", others: "Cada 1-2 años", formex: "Cada mes" },
                            { feature: "Corrección de código", others: "Nula", formex: "En vivo / Pantalla compartida" },
                            { feature: "Tasa de finalización", others: "~5-10%", formex: "~85%" },
                            { feature: "Networking", others: "Inexistente", formex: "Comunidad Activa" },
                        ].map((row, idx) => (
                            <div key={idx} className={`grid grid-cols-3 p-4 items-center text-center hover:bg-gray-50 transition-colors ${idx !== 4 ? 'border-b border-gray-100' : ''}`}>
                                <div className="text-left pl-4 font-medium text-gray-900">{row.feature}</div>
                                <div className="text-gray-400">{row.others}</div>
                                <div className="text-formex-dark font-bold flex justify-center items-center gap-2">
                                    <CheckCircle size={16} className="text-formex-lime" /> {row.formex}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Invierte en tu futuro hoy</h2>
                    <p className="text-gray-500 mb-8">
                        Únete a la próxima cohorte y empieza a construir la carrera que mereces.
                    </p>
                    <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <Target size={20} /> Empezar Ahora
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Benefits;