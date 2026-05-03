import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, User, LogOut, Loader, Star, FileText, Layers } from 'lucide-react';
import CourseService from '../../services/courseService';
import { useAuth0 } from "@auth0/auth0-react";
import SessionService from '../../services/sessionService';
import api from '../../services/api';
import logo from '../../assets/formex_logo.jpg';

const InstructorDashboard = () => {
    const { user, logout } = useAuth0();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [nextSession, setNextSession] = useState(null);
    const [totalStudents, setTotalStudents] = useState(0);
    const [points, setPoints] = useState(0);
    const [showPointsRules, setShowPointsRules] = useState(false);

    useEffect(() => {
        const fetchInstructorPoints = async () => {
            try {
                const { data } = await api.get("/api/instructor/me");
                setPoints(data.points);
            } catch (err) {
                console.error("Error obteniendo puntos del instructor:", err);
            }
        };
        fetchInstructorPoints();
    }, []);

    useEffect(() => {
        const fetchMyCoursesAndNextSession = async () => {
            try {
                const myCourses = await CourseService.getInstructorCourses();
                setCourses(myCourses || []);

                let allSessions = [];
                const studentsSet = new Set();

                for (const course of myCourses || []) {
                    const sessions = await SessionService.getSessionsByCourse(course.id);
                    if (sessions?.length) {
                        allSessions.push(...sessions.map(s => ({ ...s, courseTitle: course.title })));
                    }
                    const courseStudents = await CourseService.getCourseStudents(course.id);
                    (courseStudents || []).forEach(s => studentsSet.add(s.id));
                }

                setTotalStudents(studentsSet.size);

                const now = new Date();
                const upcoming = allSessions
                    .filter(s => new Date(s.startTime) >= now)
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                setNextSession(upcoming.length > 0 ? upcoming[0] : null);
            } catch (error) {
                console.error("Error cargando cursos/sesiones del instructor", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCoursesAndNextSession();
    }, [user]);

    const handleOpenStudents = async (course) => {
        setSelectedCourse(course);
        setShowStudentsModal(true);
        setStudentsLoading(true);
        try {
            const resp = await CourseService.getCourseStudents(course.id);
            const list = Array.isArray(resp) ? resp : (resp?.data || resp?.content || resp?.students || resp || []);
            setStudents(list || []);
        } catch (err) {
            console.error('Error fetching students', err);
            setStudents([]);
        } finally {
            setStudentsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── HEADER ── */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* Logo mejorado: más grande, sin borde doble */}
                        <img src={logo} alt="Formex Logo" className="w-11 h-11 object-cover rounded-xl shadow-sm" />
                        <div>
                            <span className="font-extrabold text-gray-900 tracking-tight">Formex</span>
                            <span className="ml-2 text-xs font-bold text-formex-orange bg-orange-50 px-2 py-0.5 rounded-full">Instructor</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Puntos */}
                        <div className="relative">
                            <button
                                onClick={() => setShowPointsRules(prev => !prev)}
                                className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-amber-100 transition-colors"
                            >
                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                {points} pts
                            </button>
                            {showPointsRules && (
                                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[9999]">
                                    <p className="text-xs font-bold text-gray-800 mb-3">¿Cómo ganar puntos?</p>
                                    <ul className="text-xs text-gray-600 space-y-2">
                                        {[
                                            '+10 por cada alumno que culmina y aprueba.',
                                            '+5 extra por evaluación aprobada con nota ≥ 17.',
                                            '+5 por alumno que califica con 4★ o más (una vez/mes).',
                                            '+50 si dicta hasta 20 horas.',
                                            '+10 por publicar nuevos recursos.',
                                        ].map((rule, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-formex-orange font-bold mt-0.5">→</span>
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                            <div className="w-7 h-7 bg-formex-orange/20 text-formex-orange rounded-full flex items-center justify-center">
                                <User size={14} />
                            </div>
                            <span className="hidden md:block text-sm font-bold text-gray-800">
                                {user?.name || user?.given_name || user?.email}
                            </span>
                        </div>

                        <button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* ── BIENVENIDA ── */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Hola, <span className="text-formex-orange">{user?.given_name || user?.name?.split(' ')[0] || 'Instructor'}</span> 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Aquí tienes un resumen de tu actividad docente.</p>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <BookOpen size={26} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Cursos Asignados</p>
                            <p className="text-3xl font-extrabold text-gray-900">{courses.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Users size={26} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Alumnos</p>
                            <p className="text-3xl font-extrabold text-gray-900">{totalStudents}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-formex-orange to-orange-600 rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Calendar size={26} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-white/80 font-medium">Próxima Clase</p>
                            <p className="text-base font-extrabold text-white leading-tight">
                                {nextSession ? (
                                    <>
                                        {new Date(nextSession.startTime).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        <br />
                                        <span className="text-white/90 text-sm font-bold">
                                            {new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </>
                                ) : 'Sin clases próximas'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── MIS CURSOS ── */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-extrabold text-gray-900">Mis Cursos</h2>
                    <span className="text-sm text-gray-400">{courses.length} curso{courses.length !== 1 ? 's' : ''}</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
                        <Loader className="animate-spin text-formex-orange mb-3" size={32} />
                        <span className="text-gray-500 font-medium">Cargando tu contenido...</span>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">

                                {/* Thumbnail */}
                                <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    {course.imageUrl ? (
                                        <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-300">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="text-xs font-bold bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-gray-700 shadow-sm">
                                            {course.level}
                                        </span>
                                        {course.enabled ? (
                                            <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-lg shadow-sm">Activo</span>
                                        ) : (
                                            <span className="text-xs font-bold bg-gray-400 text-white px-2 py-1 rounded-lg shadow-sm">Inactivo</span>
                                        )}
                                    </div>
                                </div>

                                {/* Acento naranja superior + Info */}
                                <div className="flex flex-col flex-1">
                                    <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />
                                    <div className="p-5 flex-1 flex flex-col bg-white">
                                        <span className="text-xs font-bold text-formex-orange uppercase tracking-wider mb-1">{course.category?.name || 'General'}</span>
                                        <h3 className="font-extrabold text-gray-900 text-base mb-4 leading-snug">{course.title}</h3>

                                        <div className="mt-auto grid grid-cols-2 gap-2">
                                            <Link
                                                to={`/instructor/course/${course.id}/sessions`}
                                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-formex-orange text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
                                            >
                                                <Calendar size={13} /> Sesiones
                                            </Link>
                                            <Link
                                                to={`/instructor/course/${course.id}/evaluations`}
                                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
                                            >
                                                <FileText size={13} /> Evaluaciones
                                            </Link>
                                            <Link
                                                to={`/instructor/course/${course.id}/resources`}
                                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                <Layers size={13} /> Recursos
                                            </Link>
                                            <button
                                                onClick={() => handleOpenStudents(course)}
                                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                                            >
                                                <Users size={13} /> Alumnos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-gray-300" size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No tienes cursos asignados</h3>
                        <p className="text-gray-500 text-sm">Contacta al administrador para que te asigne una materia.</p>
                    </div>
                )}
            </main>

            {/* ── MODAL ALUMNOS ── */}
            {showStudentsModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900">Alumnos inscritos</h3>
                                <p className="text-sm text-gray-500">{selectedCourse?.title}</p>
                            </div>
                            <button onClick={() => setShowStudentsModal(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
                        </div>
                        {studentsLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader className="animate-spin text-formex-orange" size={28} />
                            </div>
                        ) : students && students.length > 0 ? (
                            <ul className="space-y-2 max-h-80 overflow-auto pr-1">
                                {students.map((s, i) => (
                                    <li key={s.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="w-9 h-9 rounded-full bg-formex-orange/10 text-formex-orange flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-gray-900 truncate">{s.fullName || s.fullname}</p>
                                            <p className="text-xs text-gray-500 truncate">{s.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10">
                                <Users className="mx-auto text-gray-300 mb-3" size={40} />
                                <p className="text-gray-500">No hay alumnos inscritos en este curso.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorDashboard;
