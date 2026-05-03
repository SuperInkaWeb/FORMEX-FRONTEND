import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Video, Calendar, ArrowLeft, Clock, Pencil, BookOpen } from 'lucide-react';
import SessionService from '../../services/sessionService';
import CourseService from '../../services/courseService';
import { toast } from 'sonner';

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
  const [editingSession, setEditingSession] = useState(null);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingSession, setRecordingSession] = useState(null);
  const [recordingLinkValue, setRecordingLinkValue] = useState('');

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

  const hasScheduleConflict = (newStart, newEnd, ignoreSessionId = null) => {
    return instructorSessions.some((s) => {
      if (ignoreSessionId && s.id === ignoreSessionId) return false;
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
      toast.warning('Debes seleccionar fecha y hora de inicio.');
      return;
    }

    if (!formData.meetingLink || !formData.meetingLink.trim()) {
      toast.warning('Debes ingresar el enlace de reunion (Zoom/Meet).');
      return;
    }

    try {
      new URL(formData.meetingLink);
    } catch {
      toast.warning('El enlace de reunion no es valido.');
      return;
    }

    const start = new Date(`${formData.date}T${formData.time}:00`);
    if (Number.isNaN(start.getTime())) {
      toast.warning('La fecha u hora ingresada no es valida.');
      return;
    }

    if (start < new Date()) {
      toast.warning('No puedes crear una sesion en una fecha u hora pasada.');
      return;
    }

    const duration = Number(formData.durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) {
      toast.warning('La duracion debe ser mayor a 0 minutos.');
      return;
    }

    const end = calculateEndTime(start, duration);
    if (hasScheduleConflict(start, end, editingSession?.id)) {
      toast.warning('Conflicto de agenda: ya tienes otra sesion programada en ese horario.');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: `${formData.date}T${formData.time}:00`,
        durationMinutes: duration,
        meetingLink: formData.meetingLink,
        recordingLink: editingSession?.recordingLink || null,
        courseId
      };

      if (editingSession) {
        await SessionService.updateSession(editingSession.id, payload);
        toast.success('Sesion actualizada.');
      } else {
        await SessionService.createSession(payload);
        toast.success('Clase programada.');
      }

      setShowModal(false);
      setFormData(INITIAL_FORM);
      setEditingSession(null);
      await loadData();

    } catch (error) {
      toast.error('Error al guardar sesion.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Borrar esta sesion?')) {
      await SessionService.deleteSession(id);
      toast.success('Sesion eliminada.');
      loadData();
    }
  };

  const handleEdit = (session) => {
    const start = new Date(session.startTime);
    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, '0');
    const dd = String(start.getDate()).padStart(2, '0');
    const hh = String(start.getHours()).padStart(2, '0');
    const min = String(start.getMinutes()).padStart(2, '0');

    setFormData({
      title: session.title || '',
      description: session.description || '',
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:${min}`,
      durationMinutes: session.durationMinutes || 60,
      meetingLink: session.meetingLink || ''
    });

    setEditingSession(session);
    setShowModal(true);
  };

  const openRecordingModal = (session) => {
    setRecordingSession(session);
    setRecordingLinkValue(session.recordingLink || '');
    setShowRecordingModal(true);
  };

  const handleSaveRecordingLink = async (e) => {
    e.preventDefault();

    if (!recordingSession) return;
    if (!recordingLinkValue || !recordingLinkValue.trim()) {
      toast.warning('Debes ingresar el link de la clase grabada.');
      return;
    }

    try {
      new URL(recordingLinkValue);
    } catch {
      toast.warning('El link de la clase grabada no es valido.');
      return;
    }

    try {
      await SessionService.updateSession(recordingSession.id, {
        title: recordingSession.title,
        description: recordingSession.description || '',
        startTime: recordingSession.startTime,
        durationMinutes: recordingSession.durationMinutes || 60,
        meetingLink: recordingSession.meetingLink || '',
        recordingLink: recordingLinkValue.trim()
      });

      setSessions((prev) =>
        prev.map((s) =>
          s.id === recordingSession.id
            ? { ...s, recordingLink: recordingLinkValue.trim() }
            : s
        )
      );

      setShowRecordingModal(false);
      setRecordingSession(null);
      setRecordingLinkValue('');
      toast.success('Link de clase grabada guardado.');
    } catch (error) {
      toast.error('Error al guardar el link de clase grabada.');
    }
  };

  // ─── helpers visuales ───────────────────────────────────────────────
  const isUpcoming = (startTime) => new Date(startTime) >= new Date();

  const inputClass = "w-full border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-formex-orange/30 focus:border-formex-orange transition-colors";
  const labelClass = "block text-xs font-bold text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/instructor"
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Panel Instructor</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">{course?.title || 'Cargando...'}</h1>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingSession(null);
              setFormData(INITIAL_FORM);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-formex-orange text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus size={16} /> Nueva sesión
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Resumen */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">
            Sesiones programadas
          </h2>
          <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
            {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-formex-orange" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay clases programadas</h3>
            <p className="text-gray-500 text-sm mb-5">Crea la primera sesión para este curso.</p>
            <button
              onClick={() => { setEditingSession(null); setFormData(INITIAL_FORM); setShowModal(true); }}
              className="inline-flex items-center gap-2 bg-formex-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} /> Nueva sesión
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const start = new Date(session.startTime);
              const upcoming = isUpcoming(session.startTime);

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden"
                >
                  {/* Franja superior de estado */}
                  <div className={`h-1 w-full ${upcoming ? 'bg-gradient-to-r from-formex-orange to-orange-400' : 'bg-gray-200'}`} />

                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Info */}
                    <div className="flex gap-4 flex-1 min-w-0">
                      {/* Número */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg flex-shrink-0 ${upcoming ? 'bg-orange-50 text-formex-orange' : 'bg-gray-100 text-gray-400'}`}>
                        #{index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-extrabold text-gray-900 text-base truncate">{session.title}</h3>
                          {upcoming ? (
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0">Próxima</span>
                          ) : (
                            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">Realizada</span>
                          )}
                        </div>

                        {session.description && (
                          <p className="text-gray-500 text-sm mb-2 truncate">{session.description}</p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                            <Calendar size={12} className="text-formex-orange" />
                            {start.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                            <Clock size={12} className="text-formex-orange" />
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {session.durationMinutes || 60} min
                          </span>
                          {session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <Video size={12} /> Enlace de clase
                            </a>
                          )}
                          {session.recordingLink ? (
                            <a
                              href={session.recordingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 bg-purple-50 border border-purple-100 text-purple-600 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                              <Video size={12} /> Clase grabada
                            </a>
                          ) : (
                            <span className="flex items-center gap-1 bg-gray-50 border border-gray-100 text-gray-400 px-2 py-1 rounded-lg">
                              <Video size={12} /> Sin grabación
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                      <Link
                        to={`/instructor/course/${courseId}/session/${session.id}/materials`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <BookOpen size={13} /> Materiales
                      </Link>

                      <Link
                        to={`/instructor/course/${courseId}/attendance/${session.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
                      >
                        <Calendar size={13} /> Asistencia
                      </Link>

                      <button
                        onClick={() => openRecordingModal(session)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors"
                      >
                        <Video size={13} /> {session.recordingLink ? 'Editar link' : 'Link grabado'}
                      </button>

                      <button
                        onClick={() => handleEdit(session)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Editar sesión"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Eliminar sesión"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── MODAL: CREAR / EDITAR SESIÓN ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header modal */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-900">
                {editingSession ? 'Editar sesión' : 'Programar nueva clase'}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{course?.title}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Título de la sesión</label>
                <input
                  type="text"
                  placeholder="Ej: Introducción a React Hooks"
                  required
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Descripción <span className="text-gray-400 font-normal">(opcional)</span></label>
                <textarea
                  placeholder="Temas a tratar en esta sesión..."
                  className={`${inputClass} resize-none`}
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Fecha</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    required
                    className={inputClass}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hora inicio</label>
                  <select
                    required
                    className={inputClass}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Duración (min)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    required
                    className={inputClass}
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Hora fin (calculada)</label>
                  <input
                    type="text"
                    readOnly
                    className={`${inputClass} text-gray-400 cursor-not-allowed`}
                    value={getEndTimeLabel()}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Enlace Zoom / Meet</label>
                <input
                  type="url"
                  required
                  placeholder="https://zoom.us/j/..."
                  className={inputClass}
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingSession(null); setFormData(INITIAL_FORM); }}
                  className="flex-1 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm shadow-sm"
                >
                  {editingSession ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: LINK GRABACIÓN ── */}
      {showRecordingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-900">Link de clase grabada</h3>
              <p className="text-sm text-gray-500 mt-0.5">{recordingSession?.title}</p>
            </div>

            <form onSubmit={handleSaveRecordingLink} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>URL de la grabación</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  className={inputClass}
                  value={recordingLinkValue}
                  onChange={(e) => setRecordingLinkValue(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowRecordingModal(false); setRecordingSession(null); setRecordingLinkValue(''); }}
                  className="flex-1 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors text-sm shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSessions;
