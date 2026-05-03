import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Video, ArrowLeft, Loader, Star, BookOpen, Layers, ClipboardList } from 'lucide-react';
import SessionService from '../../services/sessionService';
import CourseService from '../../services/courseService';
import api from '../../services/api';
import { toast } from 'sonner';

const StudentCourseSessions = () => {
  const { courseId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingEnabled, setRatingEnabled] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, sessionsData] = await Promise.all([
          CourseService.getCourseById(courseId),
          SessionService.getSessionsByCourse(courseId)
        ]);

        setCourse(courseData);
        setSessions(sessionsData || []);

        const now = new Date();
        const hasPastSessions = sessionsData?.some(
          s => new Date(s.startTime) < now
        );
        setRatingEnabled(hasPastSessions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const isUpcoming = (startTime) => new Date(startTime) >= new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-formex-orange" size={36} />
          <p className="text-gray-500 font-medium">Cargando sesiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/student"
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Mis cursos</p>
              <h1 className="font-extrabold text-gray-900 leading-tight truncate max-w-[150px] sm:max-w-xs">{course?.title}</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/student/course/${courseId}/attendance`}
              className="hidden sm:flex items-center gap-2 bg-orange-50 text-formex-orange px-3 py-2 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors border border-orange-100"
            >
              <ClipboardList size={14} /> Asistencia
            </Link>
            <Link
              to={`/student/course/${courseId}/resources`}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Layers size={14} /> Recursos
            </Link>
            <Link
              to={`/student/course/${courseId}/evaluations`}
              className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
            >
              <BookOpen size={14} /> Exámenes
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-formex-orange" />
          Sesiones del curso
        </h2>

        {sessions.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-formex-orange" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay clases programadas</h3>
            <p className="text-gray-500 text-sm">Tu instructor aún no ha programado sesiones para este curso.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s, i) => {
              const upcoming = isUpcoming(s.startTime);
              const start = new Date(s.startTime);

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden"
                >
                  <div className={`h-1 w-full ${upcoming ? 'bg-gradient-to-r from-formex-orange to-orange-400' : 'bg-gray-200'}`} />

                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg flex-shrink-0 ${upcoming ? 'bg-orange-50 text-formex-orange' : 'bg-gray-100 text-gray-400'}`}>
                        #{i + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-extrabold text-gray-900 text-base truncate">{s.title}</h3>
                          {upcoming ? (
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Próxima</span>
                          ) : (
                            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Finalizada</span>
                          )}
                        </div>

                        {s.description && (
                          <p className="text-gray-500 text-sm mb-3 line-clamp-1">{s.description}</p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                            <Calendar size={12} className="text-formex-orange" />
                            {start.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                            <Clock size={12} className="text-formex-orange" />
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {s.meetingLink && (
                            <a
                              href={s.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors font-bold"
                            >
                              <Video size={12} /> Entrar a clase
                            </a>
                          )}

                          {s.recordingLink && (
                            <a
                              href={s.recordingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 bg-purple-50 border border-purple-100 text-purple-600 px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-colors font-bold"
                            >
                              <Video size={12} /> Ver grabación
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/student/course/${courseId}/session/${s.id}/materials`}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors self-end md:self-auto"
                    >
                      <BookOpen size={13} /> Ver materiales
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Evaluación del Instructor */}
        {ratingEnabled && (
          <div className="mt-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 -mr-5 -mt-5">
              <Star size={120} fill="currentColor" className="text-formex-orange" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                ¿Qué tal te pareció el curso?
              </h3>
              <p className="text-sm text-gray-500 mb-6">Tu opinión nos ayuda a mejorar la calidad de nuestra enseñanza.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tu calificación</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map(v => (
                      <button
                        key={v}
                        onClick={() => setRating(v)}
                        className={`flex-1 py-3 rounded-2xl border transition-all font-bold flex items-center justify-center gap-1 ${
                          Number(rating) === v 
                            ? 'bg-orange-50 border-formex-orange text-formex-orange shadow-inner' 
                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {v} <Star size={14} fill={Number(rating) === v ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Comentarios</label>
                  <textarea
                    placeholder="Escribe algo sobre el instructor o las clases..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-gray-100 bg-gray-50 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-formex-orange/30 focus:border-formex-orange outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={async () => {
                    try {
                      await api.post("/api/ratings", {
                        instructorId: course.instructor.id,
                        courseId: course.id,
                        rating: Number(rating),
                        comment
                      });
                      toast.success('¡Gracias por tu evaluación! ⭐');
                    } catch (error) {
                      if (error.response?.status === 409) {
                        toast.warning('Ya evaluaste a este instructor este mes');
                      } else {
                        toast.error('Error al enviar la evaluación');
                      }
                    }
                  }}
                  className="bg-formex-orange text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-md hover:shadow-orange-200"
                >
                  Enviar evaluación
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCourseSessions;
