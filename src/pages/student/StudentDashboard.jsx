import React, { useEffect, useState } from 'react';
import { BookOpen, LogOut, User, Loader, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StudentCourseService from '../../services/studentCourseService';
import { Link } from 'react-router-dom';
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await StudentCourseService.getMyCourses();
        setCourses(data || []);
      } catch (error) {
        console.error('Error cargando cursos del estudiante', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b h-16 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-formex-orange rounded-lg text-white font-bold flex items-center justify-center">
            F
          </div>
          <span className="font-bold text-lg">Student Panel</span>
        </div>

        <div className="flex items-center gap-3">
          <User size={18} />
          <span className="text-sm font-bold">{user?.fullName}</span>
          <button onClick={logout} title="Cerrar sesión">
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
        <p className="text-sm text-gray-500 font-medium">
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
        <p className="text-sm text-gray-500 font-medium">
          Próxima Clase
        </p>
        <h3 className="text-lg font-bold text-gray-900">
          Hoy, 18:00
        </h3>
      </div>
    </div>

  </div>
</div>

        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando cursos...</p>
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
                    <BookOpen className="text-gray-400" />
                  )}
                </div>

                <h3 className="font-bold text-gray-900">{course.title}</h3>
                <p className="text-xs text-gray-500">
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
          <div className="text-center py-20 text-gray-500">
            Aún no tienes cursos pagados.
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
