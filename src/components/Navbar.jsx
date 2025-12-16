import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import logoFormex from "../assets/formex_logo.jpg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path ? 'text-formex-orange font-bold' : 'text-gray-600 hover:text-formex-orange font-medium';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-gray-100 py-3 shadow-sm' : 'bg-white border-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center group">
                        <img
                            src={logoFormex}
                            alt="Formex Logo"
                            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    <div className="hidden lg:flex items-center space-x-8">
                        <Link to="/" className={`${isActive('/')} transition-colors`}>Inicio</Link>
                        <Link to="/catalog" className={`${isActive('/catalog')} transition-colors`}>Cursos</Link>
                        <Link to="/about" className={`${isActive('/about')} transition-colors`}>Nosotros</Link>
                        <Link to="/blog" className={`${isActive('/blog')} transition-colors`}>Blog</Link>
                        <Link to="/faq" className={`${isActive('/faq')} transition-colors`}>Ayuda</Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <Link to="/login" className="text-gray-700 font-bold hover:text-formex-orange px-4 transition-colors">Ingresar</Link>
                        <Link to="/register" className="px-5 py-2.5 bg-formex-dark text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                            Empieza Gratis <ArrowRight size={16} className="text-formex-lime"/>
                        </Link>
                    </div>

                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Móvil */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-2xl h-screen pb-20">
                    <div className="px-6 pt-8 space-y-6">
                        <div className="space-y-4">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-gray-800">Inicio</Link>
                            <Link to="/catalog" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-gray-800">Cursos</Link>
                            <Link to="/about" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-gray-800">Nosotros</Link>
                            <Link to="/blog" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-gray-800">Blog</Link>
                            <Link to="/faq" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-gray-800">Ayuda</Link>
                        </div>
                        <div className="pt-8 border-t border-gray-100 space-y-4">
                            <Link to="/login" className="block w-full py-3 text-center font-bold text-gray-600 bg-gray-50 rounded-xl">Ingresar</Link>
                            <Link to="/register" className="block w-full py-3 text-center font-bold text-formex-dark bg-formex-lime rounded-xl">Crear Cuenta Gratis</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;