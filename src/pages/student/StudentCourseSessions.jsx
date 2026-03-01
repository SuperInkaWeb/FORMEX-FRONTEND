import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Video, ArrowLeft, Loader } from 'lucide-react';
import SessionService from '../../services/sessionService';
import CourseService from '../../services/courseService';
import api from '../../services/api';

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

      // 🔥 Habilitar evaluación solo si hay sesiones pasadas
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

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/student" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft />
            </Link>
            <div>
              <h1 className="text-xl font-bold">
                {course?.title || 'Cargando...'}
              </h1>
              <p className="text-xs text-gray-700">Sesiones del curso</p>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-2">
            <Link
              to={`/student/course/${courseId}/attendance`}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              Mis asistencias
            </Link>

            <Link
              to={`/student/course/${courseId}/resources`}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
            >
              Ver recursos
            </Link>
          
             <Link
    to={`/student/course/${courseId}/evaluations`}
    className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
  >
    Evaluaciones
  </Link>
   </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-700">Cargando sesiones...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-700">No hay clases programadas aún.</p>
          </div>
      ) : (
  <>
    <div className="space-y-4">
      {sessions.map((s, i) => (
        <div
          key={s.id}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="font-bold text-lg mb-1">
            #{i + 1} {s.title}
          </h3>

          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
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

    {ratingEnabled && (
      <div className="bg-white p-6 rounded-xl border mt-8">
        <h3 className="font-bold text-lg mb-3">
          Evalúa a tu instructor
        </h3>

        <label className="block text-sm mb-1">Calificación</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        >
          {[5,4,3,2,1].map(v => (
            <option key={v} value={v}>{v} ⭐</option>
          ))}
        </select>

        <textarea
          placeholder="Comentario (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <button
        onClick={async () => {
  try {
    await api.post("/api/ratings", {
      instructorId: course.instructor.id,
      courseId: course.id,
      rating: Number(rating), // 🔴 importante
      comment
    });

    alert("Gracias por tu evaluación ⭐");
  } catch (error) {
  if (error.response?.status === 409) {
    alert("⚠️ Ya evaluaste a este instructor este mes");
  } else {
    alert("❌ Error al enviar la evaluación");
  }
}
}}
          className="bg-formex-orange text-white px-4 py-2 rounded"
        >
          Enviar evaluación
        </button>
      </div>
    )}
  </>
        )
        }
      </main>
    </div>
  );
};


export default StudentCourseSessions;  
