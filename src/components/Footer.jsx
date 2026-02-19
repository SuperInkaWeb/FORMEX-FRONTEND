import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageCircle } from 'lucide-react';

const Footer = () => (
    <footer className="bg-formex-dark text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-formex-lime rounded flex items-center justify-center text-formex-dark font-bold">F</div>
                    <span className="text-xl font-bold">FORMEX</span>
                </div>
                <p className="text-gray-400 max-w-sm leading-relaxed">La plataforma educativa que conecta estudiantes con expertos reales. Aprende haciendo, no solo viendo.</p>
                <div className="flex gap-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-formex-orange transition-colors cursor-pointer"><Users size={18}/></div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-formex-orange transition-colors cursor-pointer"><MessageCircle size={18}/></div>
                </div>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-formex-lime">Explora</h4>
                <ul className="space-y-4 text-gray-400">
                    <li><Link to="/catalog" className="hover:text-white transition-colors">Cursos</Link></li>
                    <li><Link to="/benefits" className="hover:text-white transition-colors">Beneficios</Link></li>
                    <li><Link to="/testimonials" className="hover:text-white transition-colors">Testimonios</Link></li>
                    <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-formex-lime">Soporte</h4>
                <ul className="space-y-4 text-gray-400">
                    <li><Link to="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                    <li><Link to="/support" className="hover:text-white transition-colors">Contáctanos</Link></li>
                    <li><Link to="/about" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2026 Formex Education. Hecho con código y café.
        </div>
    </footer>
);

export default Footer;
