import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Video, Calendar, ArrowLeft, Clock } from 'lucide-react';
import SessionService from '../../services/sessionService';
import CourseService from '../../services/courseService';

const INITIAL_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  durationMinutes: 60,
  meetingLink: ''
};

const CourseSessions = () => {
  const { courseId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [instructorSessions, setInstructorSessions] = useState([]);
  const [course, setCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const generateHalfHourOptions = () => {
    const opts = [];
    for (let h = 7; h <= 23; h++) {
      const hh = String(h).padStart(2, '0');
      opts.push(`${hh}:00`);
      if (h !== 23) opts.push(`${hh}:30`);
    }
    return opts;
  };

  const getTodayDate = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const calculateEndTime = (startDate, durationMinutes) => {
    return new Date(startDate.getTime() + Number(durationMinutes || 0) * 60 * 1000);
  };

  const getEndTimeLabel = () => {
    if (!formData.date || !formData.time || !formData.durationMinutes) return '--:--';
    const start = new Date(`${formData.date}T${formData.time}:00`);
    if (Number.isNaN(start.getTime())) return '--:--';
    const end = calculateEndTime(start, formData.durationMinutes);
    return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasScheduleConflict = (newStart, newEnd) => {
    return instructorSessions.some((s) => {
      const existingStart = new Date(s.startTime);
      const existingEnd = calculateEndTime(existingStart, s.durationMinutes || 60);
      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseData, sessionsData, instructorCourses] = await Promise.all([
        CourseService.getCourseById(courseId),
        SessionService.getSessionsByCourse(courseId),
        CourseService.getInstructorCourses()
      ]);

      const sessionsByCourse = await Promise.all(
        (instructorCourses || []).map(async (c) => {
          const data = await SessionService.getSessionsByCourse(c.id);
          return data || [];
        })
      );

      setCourse(courseData);
      setSessions(sessionsData || []);
      setInstructorSessions(sessionsByCourse.flat());
    } catch (error) {
      console.error('Error cargando datos', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      alert('Debes seleccionar fecha y hora de inicio.');
      return;
    }

    if (!formData.meetingLink || !formData.meetingLink.trim()) {
      alert('Debes ingresar el enlace de reunion (Zoom/Meet).');
      return;
    }

    try {
      new URL(formData.meetingLink);
    } catch {
      alert('El enlace de reunion no es valido.');
      return;
    }

    const start = new Date(`${formData.date}T${formData.time}:00`);
    if (Number.isNaN(start.getTime())) {
      alert('La fecha u hora ingresada no es valida.');
      return;
    }

    if (start < new Date()) {
      alert('No puedes crear una sesion en una fecha u hora pasada.');
      return;
    }

    const duration = Number(formData.durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      alert('La duracion debe ser mayor a 0 minutos.');
      return;
    }

    const end = calculateEndTime(start, duration);
    if (hasScheduleConflict(start, end)) {
      alert('Conflicto de agenda: ya tienes otra sesion programada en ese horario.');
      return;
    }

    try {
      await SessionService.createSession({
        title: formData.title,
        description: formData.description,
        startTime: `${formData.date}T${formData.time}:00`,
        durationMinutes: duration,
        meetingLink: formData.meetingLink,
        courseId
      });

      setShowModal(false);
      setFormData(INITIAL_FORM);
      await loadData();
      alert('Clase programada.');
    } catch (error) {
      alert('Error al crear sesion.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Borrar esta sesion?')) {
      await SessionService.deleteSession(id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/instructor" className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><ArrowLeft /></Link>
            <div>
              <h1 className="font-bold text-xl text-gray-900">{course?.title || 'Cargando...'}</h1>
              <p className="text-xs text-gray-500">Gestion de sesiones</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-formex-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} /> Nueva sesion
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 py-8">
        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No hay clases programadas aun.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const start = new Date(session.startTime);
              return (
                <div
                  key={session.id}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-formex-orange transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{session.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {start.toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.durationMinutes || 60} min)
                        </span>
                        {session.meetingLink && (
                          <a href={session.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            <Video size={14} /> Link de clase
                          </a>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-2">{session.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Link
                      to={`/instructor/course/${courseId}/session/${session.id}/materials`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1 font-bold"
                    >
                      <Plus size={16} /> Ver materiales
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Link
                      to={`/instructor/course/${courseId}/attendance/${session.id}`}
                      className="mr-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                      title="Ver asistencia"
                    >
                      Asistencia
                    </Link>

                    <button onClick={() => handleDelete(session.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Programar nueva clase</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Titulo de la sesion"
                required
                className="w-full border p-2 rounded"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <textarea
                placeholder="Descripcion (temas a tratar)"
                className="w-full border p-2 rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Fecha</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    required
                    className="w-full border p-2 rounded"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Hora inicio</label>
                  <select
                    required
                    className="w-full border p-2 rounded"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  >
                    <option value="">-- Hora --</option>
                    {generateHalfHourOptions().map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Duracion (min)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    className="w-full border p-2 rounded"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Hora fin</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full border p-2 rounded bg-gray-50 text-gray-600"
                    value={getEndTimeLabel()}
                  />
                </div>
              </div>

              <input
                type="url"
                required
                placeholder="Link de Zoom / Meet"
                className="w-full border p-2 rounded"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-formex-orange text-white rounded hover:bg-orange-600">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSessions;
