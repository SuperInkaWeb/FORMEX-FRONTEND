import React, { useEffect, useState } from 'react';
import { BookOpen, LogOut, User, Loader, Calendar } from 'lucide-react';
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

// 🔹 Traer puntos reales desde backend al montar
useEffect(() => {
  const fetchPoints = async () => {
    try {
      const { data } = await api.get("/api/student/me");
      setPoints(data.points); // Esto ahora será consistente
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

      // 🔥 Obtener TODAS las sesiones de los cursos del alumno
      let allSessions = [];

      for (const course of myCourses) {
        const sessions = await SessionService.getSessionsByCourse(course.id);
        if (sessions?.length) {
          allSessions = [...allSessions, ...sessions];
        }
      }

      // 🕒 Fecha actual
      const now = new Date();

      // 📅 Filtrar sesiones futuras y ordenar por fecha
      const upcoming = allSessions
        .filter(s => new Date(s.startTime) >= now)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      // 🎯 Próxima clase
      setNextSession(upcoming.length > 0 ? upcoming[0] : null);

    } catch (error) {
      console.error('Error cargando cursos/sesiones', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCoursesAndNextSession();
}, []);
  const [nextSession, setNextSession] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b h-16 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
            <img
              src={logo}
              alt="Formex Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight">Student Panel</span>
        </div>
<div className="flex items-center gap-3">
  <Link
    to="/catalog"
    className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-full border border-formex-orange/30 bg-gradient-to-r from-formex-orange to-orange-500 text-white text-xs font-bold shadow-sm hover:shadow-md hover:brightness-105 transition-all"
  >
    Explorar cursos
  </Link>
  <div className="relative hidden md:block">
    <button
      type="button"
      onClick={() => setShowPointsRules(prev => !prev)}
      className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
    >
      Requisitos de puntos
    </button>
    {showPointsRules && (
      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-sm p-3 z-40">
        <p className="text-xs font-bold text-gray-700 mb-1">Como sumar puntos</p>
        <p className="text-xs text-gray-600">+100 puntos al completar el curso al 100%.</p>
      </div>
    )}
  </div>
  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
  <span className="text-yellow-600 text-sm font-bold">⭐</span>
  <span className="text-sm font-bold text-yellow-700">
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
      <p className="text-xs text-gray-500">Estudiante</p>
    </div>
  </div>
  <button
    onClick={() =>
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
    }
    title="Cerrar sesión"
    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
  >
    <LogOut size={18} />
  </button>
</div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto p-6">
 
        <h1 className="text-2xl font-bold mb-6">Mis Cursos</h1>

        {/* RESUMEN GENERAL */}
<div className="mb-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

    {/* Cursos Asignados */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
        <BookOpen size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-700 font-medium">
          Cursos Asignados
        </p>
        <h3 className="text-2xl font-bold text-gray-900">
          {courses?.length || 0}
        </h3>
      </div>
    </div>

    {/* Próxima Clase */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-50 text-formex-orange rounded-xl flex items-center justify-center">
        <Calendar size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-700 font-medium">
          Próxima Clase
        </p>
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

        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-700">Cargando cursos...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition"
              >
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="text-gray-600" />
                  )}
                </div>

                <h3 className="font-bold text-gray-900">{course.title}</h3>
                <p className="text-xs text-gray-700">
                  {course.category?.name || 'General'}
                </p>
           <Link
              to={`/student/course/${course.id}/sessions`}
                 className="mt-4 block text-center bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700"
             >
                 Entrar al curso
            </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-700 space-y-3">
            <p>Aún no tienes cursos pagados.</p>
            <p className="text-sm text-gray-600">Puedes revisar los cursos disponibles en la opción Explorar cursos.</p>
            <Link
              to="/catalog"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-formex-orange text-white text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              Explorar cursos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
