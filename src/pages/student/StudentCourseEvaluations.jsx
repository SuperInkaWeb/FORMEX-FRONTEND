import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Loader, CheckCircle2, Clock, Send } from "lucide-react";
import api from "../../services/api";

const StudentCourseEvaluations = () => {
  const { courseId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const { data } = await api.get(`/api/courses/${courseId}/evaluations`);
        setEvaluations(data || []);

        const gradesMap = {};
        await Promise.all(
          data.map(async (ev) => {
            try {
              const res = await api.get(`/api/courses/${courseId}/evaluations/${ev.id}/my-submission`);
              gradesMap[ev.id] = res.data?.grade;
            } catch {
              gradesMap[ev.id] = null;
            }
          })
        );
        setGrades(gradesMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvaluations();
  }, [courseId]);

  const downloadPdf = async (evaluationId, title) => {
    try {
      const res = await api.get(
        `/api/courses/${courseId}/evaluations/${evaluationId}/download`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error descargando PDF", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-formex-orange" size={32} />
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
              to={`/student/course/${courseId}/sessions`}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Panel de estudio</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">Evaluaciones</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Contador */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">Exámenes y Prácticas</h2>
          <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
            {evaluations.length} evaluación{evaluations.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {evaluations.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-formex-orange" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay evaluaciones</h3>
            <p className="text-gray-500 text-sm">Aún no se han programado exámenes para este curso.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {evaluations.map(ev => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden group flex flex-col"
              >
                <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />

                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText size={20} className="text-formex-orange" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-gray-900 text-base leading-snug truncate">{ev.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ev.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estado de Calificación */}
                  <div className="mb-5 flex items-center gap-2">
                    {grades[ev.id] !== undefined && (
                      <>
                        {grades[ev.id] !== null ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">
                            <CheckCircle2 size={14} /> Nota: {grades[ev.id]} / 20
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100">
                            <Clock size={14} /> Pendiente de calificación
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadPdf(ev.id, ev.title)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                    >
                      <Download size={14} /> Descargar PDF
                    </button>

                    <Link
                      to={`/student/course/${courseId}/evaluations/${ev.id}/submissions`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Send size={14} /> Enviar tarea
                    </Link>
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

export default StudentCourseEvaluations;