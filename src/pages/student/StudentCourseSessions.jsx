import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Video, ArrowLeft, Loader } from 'lucide-react';
import SessionService from '../../services/sessionService';
import CourseService from '../../services/courseService';

const StudentCourseSessions = () => {
  const { courseId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, sessionsData] = await Promise.all([
          CourseService.getCourseById(courseId),
          SessionService.getSessionsByCourse(courseId)
        ]);
        setCourse(courseData);
        setSessions(sessionsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/student" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{course?.title || 'Cargando...'}</h1>
            <p className="text-xs text-gray-500">Sesiones del curso</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando sesiones...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No hay clases programadas aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s, i) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <h3 className="font-bold text-lg mb-1">
                  #{i + 1} {s.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(s.startTime).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(s.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                  {s.meetingLink && (
                    <a
                      href={s.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Video size={14} /> Entrar a la clase
                    </a>
                  )}
                </div>

                {s.description && (
                  <p className="text-sm text-gray-600 mt-2">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCourseSessions;
