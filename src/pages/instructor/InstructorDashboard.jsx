import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, DollarSign, Plus, Calendar, User, LogOut, Loader } from 'lucide-react';
import CourseService from '../../services/courseService'; // Reusamos por ahora
import { useAuth0 } from "@auth0/auth0-react";
import SessionService from '../../services/sessionService';
import api from '../../services/api';

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
      const studentsSet = new Set(); // ✅ AQUÍ

      for (const course of myCourses || []) {

        // 🔹 sesiones
        const sessions = await SessionService.getSessionsByCourse(course.id);
        if (sessions?.length) {
          allSessions.push(
            ...sessions.map(s => ({
              ...s,
              courseTitle: course.title
            }))
          );
        }

        // 🔹 alumnos (REALES)
        const students = await CourseService.getCourseStudents(course.id);
        (students || []).forEach(s => studentsSet.add(s.id));
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
            // normalize possible response shapes: array, { data: [...] }, { content: [...] }, { students: [...] }
            const list = Array.isArray(resp)
                ? resp
                : (resp?.data || resp?.content || resp?.students || resp || []);
            setStudents(list || []);
        } catch (err) {
            console.error('Error fetching students', err);
            setStudents([]);
        } finally {
            setStudentsLoading(false);
        }
    };

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
                        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
                <span className="text-indigo-600 text-sm font-bold">🏆</span>
              <span className="text-sm font-bold text-indigo-700">
              {points} pts
               </span>
                 </div>
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <User size={16}/>
                            </div>
                            <div className="hidden md:block text-sm">
                                   <p className="font-bold text-gray-800 leading-none">
                             {user?.name || user?.given_name || user?.email}
                                 </p>
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
                                    <h3 className="text-2xl font-bold text-gray-900">{totalStudents}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 text-formex-orange rounded-xl flex items-center justify-center">
                                    <Calendar size={24}/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Próxima Clase</p>
                                    <h3 className="text-lg font-bold text-gray-900">
                         {nextSession ? (
                           <>
                        {new Date(nextSession.startTime).toLocaleDateString()}{" "}
                         {new Date(nextSession.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                               </>
                             ) : (
                          'Sin clases próximas'
                                    )}
                                 </h3>

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
                                                   <div className="inline-flex items-center gap-3">
                                                     <Link
                      to={`/instructor/course/${course.id}/evaluations`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-bold text-sm"
                    >
                    📄 Evaluaciones
                    </Link>

    {/* 🔥 NUEVO BOTÓN RECURSOS */}
    <Link
        to={`/instructor/course/${course.id}/resources`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-bold text-sm"
    >
        <BookOpen size={16}/> Recursos
    </Link>

    <button
        onClick={() => handleOpenStudents(course)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
    >
        <Users size={16}/> Alumnos
    </button>

    <Link
        to={`/instructor/course/${course.id}/sessions`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-bold text-sm"
    >
        <Plus size={16}/> Agregar Sesión
    </Link>
</div>

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

            {/* Students Modal */}
            {showStudentsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Alumnos inscritos - {selectedCourse?.title}</h3>
                            <button onClick={() => setShowStudentsModal(false)} className="text-gray-400 hover:text-gray-700">Cerrar</button>
                        </div>
                        {studentsLoading ? (
                            <div className="text-center py-8">Cargando alumnos...</div>
                        ) : students && students.length > 0 ? (
                            <ul className="space-y-3 max-h-72 overflow-auto">
                                {students.map(s => (
                                    <li key={s.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{s.fullName || s.fullname}</p>
                                            <p className="text-xs text-gray-500">{s.email}</p>
                                        </div>
                                        <div className="text-xs text-gray-500">{s.phone || ''}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-gray-500">No hay alumnos inscritos en este curso.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorDashboard;
