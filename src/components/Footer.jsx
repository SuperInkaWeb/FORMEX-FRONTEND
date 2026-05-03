import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import whatsappIcon from '../assets/whatsapp-logo-messenger-icon-realistic-social-media-logotype-whats-app-button-transparent-background-272905344.webp';
import facebookIcon from '../assets/facebook-logo-icon-free-png.webp';
import instagramIcon from '../assets/OIP.webp';
import tiktokIcon from '../assets/Untitled_design_5_-min.webp';
import linkedinIcon from '../assets/linkedin-icon-logo-symbol-free-png.png';
import xIcon from '../assets/1000_F_712652764_DqFA8x1yJuDxeOlxxwvzdJZGkVdcQONh.jpg';
import youtubeIcon from '../assets/youtube-icon-free-png.webp';
import logoFormex from "../assets/formex_logo.jpg";

const scrollToTop = () => {
    window.scrollTo(0, 0);
};

const Footer = () => {
    const [hiddenIcons, setHiddenIcons] = useState({});

    const socialLinks = [
        { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61574837372226', icon: facebookIcon, fallback: 'f' },
        { name: 'Instagram', url: 'https://www.instagram.com/formexglobal', icon: instagramIcon, fallback: 'ig' },
        { name: 'TikTok', url: 'https://www.tiktok.com/@formex.digital', icon: tiktokIcon, fallback: 'tt' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/company/formex-global/?viewAsMember=true', icon: linkedinIcon, fallback: 'in' },
        { name: 'X', url: 'https://x.com/formexperu', icon: xIcon, fallback: 'x' },
        { name: 'YouTube', url: 'https://www.youtube.com/@Formex-h1v', icon: youtubeIcon, fallback: 'yt' },
    ];

    return (
        <footer className="bg-formex-dark text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <img src={logoFormex} alt="Formex Logo" className="w-10 h-10 object-contain rounded" />
                        <span className="text-xl font-bold">FORMEX</span>
                    </div>
                    <p className="text-gray-400 max-w-sm leading-relaxed">La plataforma educativa que conecta estudiantes con expertos reales. Aprende haciendo, no solo viendo.</p>
                    <div className="flex gap-4 mt-6">
                        {socialLinks.map((social) => {
                            const iconClassByName = social.name === 'TikTok'
                                ? 'w-[108%] h-[108%] max-w-none object-cover'
                                : social.name === 'X'
                                    ? 'w-[112%] h-[112%] max-w-none object-cover'
                                    : 'w-full h-full object-cover rounded-full';
                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    title={social.name}
                                    className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center hover:bg-formex-orange transition-colors"
                                >
                                    {social.icon && !hiddenIcons[social.name] ? (
                                        <img
                                            src={social.icon}
                                            alt={social.name}
                                            className={iconClassByName}
                                            onError={() =>
                                                setHiddenIcons((prev) => ({ ...prev, [social.name]: true }))
                                            }
                                        />
                                    ) : (
                                        <span className="text-xs font-bold uppercase">{social.fallback}</span>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-formex-lime">Explora</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/catalog" onClick={scrollToTop} className="hover:text-white transition-colors">Cursos</Link></li>
                        <li><Link to="/benefits" className="hover:text-white transition-colors">Beneficios</Link></li>
                        <li><Link to="/testimonials" onClick={scrollToTop} className="hover:text-white transition-colors">Testimonios</Link></li>
                        <li><Link to="/blog" onClick={scrollToTop} className="hover:text-white transition-colors">Blog</Link></li>
                        <li><Link to="/instructors" onClick={scrollToTop} className="hover:text-white transition-colors">Instructores</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-formex-lime">Soporte</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/faq" onClick={scrollToTop} className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                        <li><Link to="/support" onClick={scrollToTop} className="hover:text-white transition-colors">Contáctanos</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                        <li><Link to="/be-instructor" onClick={scrollToTop} className="hover:text-white transition-colors">Conviértete en Instructor</Link> </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                © 2026 Formex Education. Hecho por Qoribex.
            </div>
        </footer>
    );
};

export default Footer;
