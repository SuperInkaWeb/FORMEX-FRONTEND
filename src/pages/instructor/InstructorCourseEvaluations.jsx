import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, FileText, Download, Users, Loader, BookOpen } from 'lucide-react';
import EvaluationService from '../../services/evaluationService';
import { toast } from 'sonner';

const InstructorCourseEvaluations = () => {
  const { courseId } = useParams();

  const [evaluations, setEvaluations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdf: null
  });

  const downloadPdf = async (courseId, evaluationId, title) => {
    try {
      const res = await EvaluationService.download(courseId, evaluationId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error descargando PDF", err);
      toast.error('Error al descargar PDF');
    }
  };

  useEffect(() => {
    loadEvaluations();
  }, [courseId]);

  const loadEvaluations = async () => {
    const data = await EvaluationService.getByCourse(courseId);
    setEvaluations(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            title: formData.title,
            description: formData.description
          })
        ],
        { type: "application/json" }
      )
    );
    data.append("file", formData.pdf);

    try {
      setLoading(true);
      await EvaluationService.create(courseId, data);
      setShowModal(false);
      setFormData({ title: '', description: '', pdf: null });
      loadEvaluations();
      toast.success('Evaluación creada');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear evaluación');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar evaluación?")) {
      await EvaluationService.delete(courseId, id);
      toast.success('Evaluación eliminada.');
      loadEvaluations();
    }
  };

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
              <h1 className="font-extrabold text-gray-900 leading-tight">Evaluaciones del curso</h1>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-formex-orange text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus size={16} /> Nueva evaluación
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Resumen */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">
            Lista de Evaluaciones
          </h2>
          <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
            {evaluations.length} evaluación{evaluations.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {evaluations.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-formex-orange" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay evaluaciones aún</h3>
            <p className="text-gray-500 text-sm mb-5">Crea el primer examen o práctica para tus alumnos.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-formex-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} /> Nueva evaluación
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {evaluations.map(e => (
              <div
                key={e.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden group"
              >
                {/* Franja superior */}
                <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />

                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText size={20} className="text-formex-orange" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-gray-900 text-base leading-snug truncate">{e.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{e.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                      title="Eliminar evaluación"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <button
                      onClick={() => downloadPdf(courseId, e.id, e.title)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors border border-orange-100"
                    >
                      <Download size={14} /> Descargar PDF
                    </button>

                    <Link
                      to={`/instructor/course/${courseId}/evaluations/${e.id}/submissions`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Users size={14} /> Ver entregas
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── MODAL: NUEVA EVALUACIÓN ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-900">Nueva evaluación</h3>
              <p className="text-sm text-gray-500 mt-0.5">Sube un examen en formato PDF</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Título de la evaluación</label>
                <input
                  type="text"
                  placeholder="Ej: Examen Parcial"
                  required
                  className={inputClass}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                  placeholder="Instrucciones o detalles..."
                  className={`${inputClass} resize-none`}
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className={labelClass}>Archivo PDF (Examen)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={e => setFormData({ ...formData, pdf: e.target.files[0] })}
                  />
                  <div className={`border-2 border-dashed border-gray-200 rounded-xl p-4 text-center group-hover:border-formex-orange transition-colors ${formData.pdf ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'}`}>
                    <div className="flex flex-col items-center gap-1">
                      <FileText size={24} className={formData.pdf ? 'text-formex-orange' : 'text-gray-300'} />
                      <span className="text-xs font-bold text-gray-500">
                        {formData.pdf ? formData.pdf.name : 'Seleccionar archivo PDF'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({ title: '', description: '', pdf: null }); }}
                  className="flex-1 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size={14} className="animate-spin" /> Creando...
                    </span>
                  ) : "Crear evaluación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseEvaluations;
