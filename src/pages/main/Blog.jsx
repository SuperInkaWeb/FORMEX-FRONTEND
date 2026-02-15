import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "Las 5 tendencias de desarrollo web para 2025",
            excerpt: "Descubre qué lenguajes y frameworks están dominando el mercado y por qué deberías aprenderlos hoy.",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
            category: "Tecnología",
            date: "15 Oct 2025",
            author: "Farid Lazo"
        },
        {
            id: 2,
            title: "¿Por qué aprender en vivo es mejor que grabado?",
            excerpt: "Analizamos las tasas de finalización entre cursos MOOC tradicionales y cohortes en vivo.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
            category: "Educación",
            date: "10 Oct 2025",
            author: "Ana Silva"
        },
        {
            id: 3,
            title: "Guía para conseguir tu primer empleo IT",
            excerpt: "Consejos prácticos para armar tu portafolio, CV y perfil de LinkedIn para destacar ante reclutadores.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
            category: "Carrera",
            date: "05 Oct 2025",
            author: "Carlos Díaz"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            <section className="pt-32 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Blog Formex</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Noticias, tutoriales y consejos sobre tecnología y educación digital.
                    </p>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map(post => (
                        <article key={post.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold rounded-full text-formex-orange uppercase tracking-wide">
                  {post.category}
                </span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                    <div className="flex items-center gap-1"><Calendar size={14}/> {post.date}</div>
                                    <div className="flex items-center gap-1"><User size={14}/> {post.author}</div>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-formex-orange transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-formex-orange group-hover:gap-3 transition-all">
                                    Leer artículo <ArrowRight size={16}/>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;