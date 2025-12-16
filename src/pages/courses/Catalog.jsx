import React, { useEffect, useState } from 'react';
import { Filter, Search, BookOpen } from 'lucide-react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import CourseService from '../../services/courseService.js';
import { Link } from 'react-router-dom';

const Catalog = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Todas');

    useEffect(() => {
        // Cargar datos reales del Backend al iniciar
        const fetchData = async () => {
            try {
                const [catsData, coursesData] = await Promise.all([
                    CourseService.getCategories(),
                    CourseService.getAllCourses()
                ]);
                setCategories(catsData);
                setCourses(coursesData);
            } catch (error) {
                console.error("Error cargando catálogo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtrado simple en el frontend
    const filteredCourses = filter === 'Todas'
        ? courses
        : courses.filter(c => c.category?.name === filter);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Catálogo de Cursos</h1>
                    <p className="text-gray-500">Explora nuestra oferta académica en vivo.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filtros */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter size={18}/> Categorías
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setFilter('Todas')}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === 'Todas' ? 'bg-orange-50 text-formex-orange font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Todas
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilter(cat.name)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === cat.name ? 'bg-orange-50 text-formex-orange font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid Cursos */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="text-center py-20 text-gray-400">Cargando cursos...</div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500">No hay cursos en esta categoría aún.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group flex flex-col h-full">
                                        <div className="h-48 overflow-hidden relative bg-gray-200">
                                            <img
                                                src={course.imageUrl || "https://via.placeholder.com/400x300?text=Formex+Course"}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Sin+Imagen"}
                                            />
                                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded text-gray-800">
                            {course.level || 'General'}
                        </span>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                        <span className="text-xs font-bold text-formex-orange uppercase mb-2 block">
                            {course.category?.name || 'Tecnología'}
                        </span>
                                            <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight flex-1">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                        <span className="font-bold text-xl text-gray-900">
                            ${course.price}
                        </span>
                                                <Link to={`/course/${course.id}`} className="text-sm font-bold text-formex-orange hover:underline">
                                                    Ver Detalles
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Catalog;