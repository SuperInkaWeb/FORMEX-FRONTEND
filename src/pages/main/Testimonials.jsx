import React from 'react';
import { Star, Quote } from 'lucide-react';


const Testimonials = () => {
    const reviews = [
        { name: "María González", role: "Frontend Dev @ Globant", img: "10", text: "Formex cambió mi carrera. La metodología en vivo me obligó a estar presente y aprender de verdad. 100% recomendado." },
        { name: "Juan Pérez", role: "Freelancer", img: "12", text: "Pude armar mi portafolio en solo 3 meses. Los mentores son increíbles y siempre están dispuestos a ayudar." },
        { name: "Carla Rivas", role: "UX Designer", img: "25", text: "Lo mejor fue la comunidad. Conocí a mis actuales socios en el curso de Diseño de Producto." },
        { name: "Roberto Gómez", role: "CTO @ Startup", img: "33", text: "Contratamos a 3 egresados de Formex para nuestro equipo tech. El nivel con el que salen es impresionante." },
        { name: "Andrea Torres", role: "Data Analyst", img: "41", text: "Los proyectos reales marcan la diferencia. No es solo teoría, es práctica pura." },
        { name: "Luis Meza", role: "Backend Dev", img: "55", text: "La inversión valió cada centavo. Recuperé el costo del curso con mi primer trabajo freelance." }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
          

            <section className="pt-32 pb-20 bg-formex-dark text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-extrabold mb-6">Historias de éxito real</h1>
                    <p className="text-xl text-gray-400">
                        Más de 3,000 estudiantes ya están transformando sus carreras con nosotros.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {reviews.map((review, i) => (
                            <div key={i} className="break-inside-avoid bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <Quote className="text-formex-lime mb-4 opacity-50" size={40} />
                                <p className="text-gray-600 mb-6 italic leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={`https://i.pravatar.cc/100?img=${review.img}`} alt={review.name} className="w-12 h-12 rounded-full border-2 border-gray-100"/>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                                        <p className="text-xs text-formex-orange font-medium">{review.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mt-4 text-yellow-400">
                                    {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

          
        </div>
    );
};

export default Testimonials;