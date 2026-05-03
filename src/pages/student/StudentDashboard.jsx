import React, { useEffect, useState } from 'react';
import { BookOpen, LogOut, User, Loader, Calendar, Star, Compass, HelpCircle } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import StudentCourseService from '../../services/studentCourseService';
import SessionService from '../../services/sessionService';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import logo from '../../assets/formex_logo.jpg';

const StudentDashboard = () => {
  const [points, setPoints] = useState(0);
  const [showPointsRules, setShowPointsRules] = useState(false);
  const { user, logout } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextSession, setNextSession] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const { data } = await api.get("/api/student/me");
        setPoints(data.points);
      } catch (err) {
        console.error("Error obteniendo puntos:", err);
      }
    };
    fetchPoints();
  }, []);

  useEffect(() => {
    const fetchCoursesAndNextSession = async () => {
      try {
        const { data } = await StudentCourseService.getMyCourses();
        const myCourses = data || [];
        setCourses(myCourses);

        let allSessions = [];
        for (const course of myCourses) {
          const sessions = await SessionService.getSessionsByCourse(course.id);
          if (sessions?.length) {
            allSessions = [...allSessions, ...sessions];
          }
        }

        const now = new Date();
        const upcoming = allSessions
          .filter(s => new Date(s.startTime) >= now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setNextSession(upcoming.length > 0 ? upcoming[0] : null);
      } catch (error) {
        console.error('Error cargando cursos/sesiones', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndNextSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Formex Logo" className="w-11 h-11 object-cover rounded-xl shadow-sm" />
            <div>
              <span className="font-extrabold text-gray-900 tracking-tight">Formex</span>
              <span className="ml-2 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Estudiante</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/support"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-all"
              >
                <HelpCircle size={14} /> Ayuda
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-formex-orange text-formex-orange text-xs font-bold hover:bg-orange-50 transition-all"
              >
                <Compass size={14} /> Explorar
              </Link>
            </div>

            {/* Puntos Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPointsRules(prev => !prev)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Star size={16} fill="white" />
                <span className="text-sm font-bold">{points} pts</span>
              </button>
              {showPointsRules && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[9999]">
                  <p className="text-xs font-bold text-gray-800 mb-3">¿Cómo ganar puntos?</p>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-formex-orange font-bold">●</span>
                      <span>+100 puntos al completar un curso al 100%</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-formex-orange font-bold">●</span>
                      <span>+50 puntos por cada evaluación aprobada</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-gray-100 hidden sm:block" />

            {/* Perfil */}
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden md:block text-right">
                <p className="text-xs font-extrabold text-gray-900 leading-none">
                  {user?.name || user?.given_name || 'Estudiante'}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Nivel 1</p>
              </div>
              <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-inner">
                <User size={18} />
              </div>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Bienvenida */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">Hola, {user?.given_name || user?.name || 'Estudiante'} 👋</h2>
          <p className="text-gray-500 mt-1 font-medium text-sm">Es un buen día para seguir aprendiendo.</p>
        </div>

        {/* Estadísticas Compactas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Card: Cursos */}
          <div className="relative overflow-hidden bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
              <BookOpen size={48} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cursos Enrolados</p>
                <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{courses?.length || 0}</h3>
              </div>
            </div>
          </div>

          {/* Card: Próxima Clase */}
          <div className="relative overflow-hidden bg-gradient-to-br from-formex-orange to-orange-600 p-4 rounded-2xl shadow-lg group hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-[0.1] group-hover:scale-110 transition-transform text-white">
              <Calendar size={48} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center shadow-sm">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Próxima Clase</p>
                <h3 className="text-lg font-bold text-white mt-1">
                  {nextSession ? (
                    <>
                      {new Date(nextSession.startTime).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} ·{" "}
                      {new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </>
                  ) : (
                    'Sin clases próximas'
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Grilla de Cursos */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-gray-900">Mis cursos actuales</h3>
          {courses.length > 0 && (
            <Link to="/catalog" className="text-sm font-bold text-formex-orange hover:underline">Ver catálogo completo</Link>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Loader className="animate-spin text-formex-orange mb-3" size={32} />
            <p className="text-gray-500 font-bold">Cargando tu aprendizaje...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
                      <BookOpen size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-gray-700 shadow-sm">
                      {course.level || 'General'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1">
                  <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />
                  <div className="p-5 flex-1 flex flex-col bg-white">
                    <span className="text-[10px] font-bold text-formex-orange uppercase tracking-widest mb-1">{course.category?.name || 'General'}</span>
                    <h3 className="font-extrabold text-gray-900 text-lg mb-4 leading-tight line-clamp-2">{course.title}</h3>

                    <Link
                      to={`/student/course/${course.id}/sessions`}
                      className="mt-auto block w-full py-3 text-center bg-formex-dark text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      Continuar aprendiendo
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="text-formex-orange" size={40} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Aún no tienes cursos</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-6">Explora nuestro catálogo y comienza tu camino hoy mismo.</p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-formex-orange text-white font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
            >
              <Compass size={18} /> Ver cursos disponibles
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
