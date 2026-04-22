import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { instructors } from '../../utils/instructorsData';
import { Linkedin, Twitter, Globe, BookOpen, Award, Star, ArrowLeft } from 'lucide-react';

const InstructorProfile = () => {
    const { id } = useParams();

    // Buscar el instructor por ID
    const instructor = instructors.find(inst => inst.id === id);

    // Si no se encuentra el instructor, podemos redirigir o mostrar un mensaje
    if (!instructor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Instructor no encontrado</h2>
                    <Link to="/instructors" className="text-formex-orange font-bold">Volver a la lista</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    
                    {/* Botón Volver */}
                    <Link to="/instructors" className="inline-flex items-center gap-2 text-gray-500 hover:text-formex-orange transition-colors mb-10 font-medium">
                        <ArrowLeft size={20} /> Volver a Instructores
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-12">
                        
                        {/* Columna Izquierda: Foto y Stats */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square">
                                <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                    <Star className="mx-auto text-yellow-400 mb-2" size={20} />
                                    <div className="text-lg font-bold text-formex-dark">{instructor.stats.rating}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">Rating</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                    <BookOpen className="mx-auto text-formex-orange mb-2" size={20} />
                                    <div className="text-lg font-bold text-formex-dark">{instructor.stats.courses}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">Cursos</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                    <Award className="mx-auto text-formex-lime mb-2" size={20} />
                                    <div className="text-lg font-bold text-formex-dark">{instructor.stats.students}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">Alumnos</div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <a 
                                    href={instructor.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex-1 py-4 bg-formex-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                                >
                                    <Linkedin size={20} /> LinkedIn
                                </a>
                                <button className="p-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all">
                                    <Globe size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Columna Derecha: Bio y Cursos */}
                        <div className="lg:col-span-2 space-y-10">
                            <section>
                                <h1 className="text-4xl md:text-5xl font-black text-formex-dark mb-4">{instructor.name}</h1>
                                <p className="text-xl text-formex-orange font-bold mb-6">{instructor.title}</p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {instructor.fullBio}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-formex-dark mb-6">Especialidades</h2>
                                <div className="flex flex-wrap gap-3">
                                    {instructor.skills.map((skill, index) => (
                                        <span key={index} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-formex-dark">Mis Cursos</h2>
                                    <Link to="/catalog" className="text-formex-orange font-bold hover:underline">Ver todo el catálogo</Link>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    {instructor.courses.map(course => (
                                        <div key={course.id} className="group cursor-pointer">
                                            <div className="rounded-2xl overflow-hidden mb-4 relative aspect-video">
                                                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-formex-orange uppercase">
                                                    {course.category}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg text-formex-dark group-hover:text-formex-orange transition-colors">{course.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default InstructorProfile;
