import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle2, XCircle, Loader } from 'lucide-react';
import AttendanceService from '../../services/attendanceService';
import { toast } from 'sonner';

const AttendancePage = () => {
  const { courseId, sessionId } = useParams();

  const [students, setStudents]       = useState([]);
  const [attendance, setAttendance]   = useState({});
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [sessionNumber, setSessionNumber] = useState(sessionId);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await AttendanceService.getAttendance(sessionId);
        setStudents(data.students || []);

        const initialAttendance = {};
        data.students.forEach((s) => {
          initialAttendance[s.userId] = s.status || 'ABSENT';
        });
        setAttendance(initialAttendance);

        if (data.session?.number) {
          setSessionNumber(data.session.number);
        }
      } catch (error) {
        console.error('Error cargando asistencia', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [sessionId]);

  const handleChange = (userId, value) => {
    setAttendance((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        attendance: Object.entries(attendance).map(([userId, status]) => ({
          userId: Number(userId),
          status,
        })),
      };
      await AttendanceService.postBatchAttendance(sessionId, payload);
      toast.success('Asistencia guardada correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar asistencia');
    } finally {
      setSaving(false);
    }
  };

  // ── contadores en tiempo real ─────────────────────────────────────
  const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length;
  const absentCount  = Object.values(attendance).filter(v => v === 'ABSENT').length;

  // ── loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-formex-orange" size={36} />
          <p className="text-gray-500 font-medium">Cargando alumnos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/instructor/course/${courseId}/sessions`}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Sesiones del curso</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">Control de Asistencia</h1>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="flex items-center gap-2 bg-formex-orange text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <><Loader size={14} className="animate-spin" /> Guardando...</>
            ) : (
              'Guardar asistencia'
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ── STAT CHIPS ── */}
        {students.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-lg font-extrabold text-gray-900">
              Alumnos
            </span>
            <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
              {students.length} total
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> {presentCount} presentes
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full">
              <XCircle size={14} /> {absentCount} ausentes
            </span>
          </div>
        )}

        {/* ── LISTA ── */}
        {students.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-formex-orange" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay alumnos inscritos</h3>
            <p className="text-gray-500 text-sm">Cuando haya alumnos inscritos en el curso, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => {
              const isPresent = attendance[student.userId] === 'PRESENT';

              return (
                <div
                  key={student.userId}
                  className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden ${
                    isPresent ? 'border-emerald-200 shadow-emerald-50' : 'border-gray-200'
                  }`}
                >
                  {/* Franja lateral de estado */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Avatar con inicial */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-base flex-shrink-0 ${
                      isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {student.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    {/* Nombre */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{student.fullName}</p>
                      <p className="text-xs text-gray-400">Alumno #{index + 1}</p>
                    </div>

                    {/* Toggle PRESENTE / AUSENTE */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleChange(student.userId, 'PRESENT')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isPresent
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        <CheckCircle2 size={14} /> Presente
                      </button>
                      <button
                        onClick={() => handleChange(student.userId, 'ABSENT')}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          !isPresent
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <XCircle size={14} /> Ausente
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}


          </div>
        )}
      </main>
    </div>
  );
};

export default AttendancePage;
