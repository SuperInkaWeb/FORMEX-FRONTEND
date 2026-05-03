import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trash2, ArrowLeft, FileText, Download, User, Loader, CheckCircle2 } from 'lucide-react';
import SubmissionService from "../../services/SubmissionService";
import { toast } from 'sonner';

const InstructorEvaluationSubmissions = () => {
  const { courseId, evaluationId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, [evaluationId]);

  const loadSubmissions = async () => {
    try {
      const data = await SubmissionService.getByEvaluation(courseId, evaluationId);
      setSubmissions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm('¿Eliminar entrega del alumno?')) return;

    try {
      await SubmissionService.delete(courseId, evaluationId, submissionId);
      loadSubmissions();
      toast.success('Entrega eliminada');
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar entrega');
    }
  };

  const handleDownload = async (submission) => {
    try {
      const response = await SubmissionService.download(
        courseId,
        evaluationId,
        submission.submissionId
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = submission.fileName || 'entrega.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error('Error al descargar archivo');
    }
  };

  const handleGrade = async (submissionId, grade) => {
    if (grade === '') return;
    try {
      await SubmissionService.grade(courseId, evaluationId, submissionId, grade);
      toast.success('Nota actualizada', { duration: 1000 });
    } catch (error) {
      toast.error('Error al calificar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-formex-orange" size={36} />
          <p className="text-gray-500 font-medium">Cargando entregas...</p>
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
              to={`/instructor/course/${courseId}/evaluations`}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Evaluaciones</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">Entregas de alumnos</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Resumen */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">
            Lista de Entregas
          </h2>
          <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
            {submissions.length} entrega{submissions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-blue-500" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay entregas aún</h3>
            <p className="text-gray-500 text-sm">Los trabajos de los alumnos aparecerán aquí conforme los suban.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((s, index) => (
              <div
                key={s.submissionId}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 flex flex-col md:flex-row justify-between gap-6">
                  {/* Info Alumno */}
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-gray-900 text-base">{s.studentName || 'Alumno'}</h3>
                      {s.comment ? (
                        <p className="text-sm text-gray-500 mt-1 italic">"{s.comment}"</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 italic">Sin comentarios del alumno</p>
                      )}

                      {s.fileUrl && (
                        <button
                          onClick={() => handleDownload(s)}
                          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <Download size={14} /> Descargar archivo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Calificación y Acciones */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex flex-col items-center sm:items-end">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nota Final</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          defaultValue={s.grade ?? ''}
                          onBlur={(e) => handleGrade(s.submissionId, e.target.value)}
                          className="w-16 h-10 text-center font-extrabold text-gray-900 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-formex-orange/30 focus:border-formex-orange outline-none transition-all"
                          placeholder="--"
                        />
                        <span className="text-sm font-bold text-gray-400">/ 20</span>
                      </div>
                    </div>

                    <div className="w-px h-8 bg-gray-200 hidden sm:block mx-1" />

                    <div className="flex items-center gap-2">
                      {s.grade !== null && s.grade !== undefined && (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          <CheckCircle2 size={12} />
                          <span className="text-[10px] font-bold uppercase">Calificado</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDelete(s.submissionId)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Eliminar entrega"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorEvaluationSubmissions;
