import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, DollarSign, Plus, Calendar, User, LogOut, Loader } from 'lucide-react';
import CourseService from '../../services/courseService'; // Reusamos por ahora
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
    const { user, logout } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                // En producción: usar endpoint específico /instructor/courses
                const allCourses = await CourseService.getAllCourses();
                // Filtro simulado para demostración (ajustar según backend real)
                setCourses(allCourses);
            } catch (error) {
                console.error("Error cargando cursos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

            {/* HEADER TIPO DASHBOARD (Sin Navbar pública) */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    {/* Logo / Título */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-formex-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">Instructor Panel</span>
                    </div>

                    {/* Perfil Usuario (Arriba a la derecha) */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <User size={16}/>
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-bold text-gray-800 leading-none">{user?.fullName}</p>
                                <p className="text-xs text-gray-500">Docente</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={20}/>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Bienvenida y Stats */}
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Resumen General</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <BookOpen size={24}/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Cursos Asignados</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{courses.length}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                    <Users size={24}/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Alumnos</p>
                                    <h3 className="text-2xl font-bold text-gray-900">--</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 text-formex-orange rounded-xl flex items-center justify-center">
                                    <Calendar size={24}/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Próxima Clase</p>
                                    <h3 className="text-lg font-bold text-gray-900">Hoy, 18:00</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Mis Cursos */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Mis Cursos</h2>
                        {/* Nota: Si el instructor NO puede crear cursos, quitamos este botón o lo dejamos solo si tiene permiso */}
                        {/* <button className="text-sm font-bold text-formex-orange hover:underline">+ Solicitar Nuevo Curso</button> */}
                    </div>

                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center">
                            <Loader className="animate-spin text-formex-orange mb-2"/>
                            <span className="text-gray-500">Cargando tu contenido...</span>
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-6">Curso</th>
                                    <th className="p-6">Nivel</th>
                                    <th className="p-6">Estado</th>
                                    <th className="p-6 text-right">Gestión</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {courses.map(course => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                    {course.imageUrl ? (
                                                        <img src={course.imageUrl} className="w-full h-full object-cover" alt="miniatura"/>
                                                    ) : (
                                                        <BookOpen className="m-auto text-gray-400" size={20}/>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{course.title}</p>
                                                    <p className="text-xs text-gray-500">{course.category?.name || 'General'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                            {course.level}
                        </span>
                                        </td>
                                        <td className="p-6">
                                            {course.enabled ?
                                                <span className="text-green-600 text-xs font-bold flex items-center gap-1">● Activo</span> :
                                                <span className="text-red-500 text-xs font-bold flex items-center gap-1">● Inactivo</span>
                                            }
                                        </td>
                                        <td className="p-6 text-right">
                                            {/* BOTÓN PRINCIPAL: Gestionar Sesiones (Agregar clases) */}
                                            <Link
                                                to={`/instructor/course/${course.id}/sessions`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-bold text-sm"
                                            >
                                                <Plus size={16}/> Agregar Sesión
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-900">No tienes cursos asignados</h3>
                            <p className="text-gray-500 mb-6">Contacta al administrador para que te asigne una materia.</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default InstructorDashboard;