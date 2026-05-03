import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Upload, Loader, CheckCircle2, Download, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { toast } from 'sonner';

const StudentEvaluationSubmissions = () => {
  const { courseId, evaluationId } = useParams();

  const [evaluation, setEvaluation] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: evalData } = await api.get(
          `/api/courses/${courseId}/evaluations/${evaluationId}`
        );
        setEvaluation(evalData);

        const { data: submissionData } = await api.get(
          `/api/courses/${courseId}/evaluations/${evaluationId}/my-submission`
        );
        setSubmission(submissionData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId, evaluationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning('Por favor selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("file", file);

    try {
      setSubmitting(true);
      const { data } = await api.post(
        `/api/courses/${courseId}/evaluations/${evaluationId}/submissions`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSubmission(data);
      setComment("");
      setFile(null);
      toast.success('Entrega enviada correctamente');
    } catch (err) {
      console.error(err);
      toast.info('Solo se permite una entrega por evaluación.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadSubmission = async (submissionId) => {
    try {
      const res = await api.get(
        `/api/courses/${courseId}/evaluations/${evaluationId}/submissions/download/${submissionId}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mi_entrega.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Error descargando archivo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-formex-orange" size={32} />
      </div>
    );
  }

  const inputClass = "w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-formex-orange/30 focus:border-formex-orange transition-all";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/student/course/${courseId}/evaluations`}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Evaluaciones</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">Enviar Trabajo</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Info de la Evaluación */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 text-formex-orange rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{evaluation?.title}</h2>
              <p className="text-gray-500 mt-1 text-sm leading-relaxed">{evaluation?.description}</p>
            </div>
          </div>
        </div>

        {/* Sección de Entrega */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Si ya entregó */}
          {submission ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 -mr-5 -mt-5">
                <CheckCircle2 size={120} className="text-emerald-500" />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-extrabold text-emerald-900">¡Tarea entregada!</h3>
                <p className="text-emerald-700 text-sm mt-1 mb-6">Tu entrega ha sido recibida correctamente por el instructor.</p>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-left border border-emerald-200/50 max-w-md mx-auto mb-6">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Tu Comentario</p>
                  <p className="text-sm text-emerald-800 italic">
                    {submission.comment ? `"${submission.comment}"` : "Sin comentarios adicionales."}
                  </p>
                </div>

                <button
                  onClick={() => downloadSubmission(submission.id)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md"
                >
                  <Download size={16} /> Ver mi archivo enviado
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de Nueva Entrega */
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <Upload size={20} className="text-formex-orange" />
                  Subir mi entrega
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Comentario para el instructor</label>
                  <textarea
                    placeholder="Escribe un mensaje opcional..."
                    className={`${inputClass} resize-none`}
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Archivo del trabajo</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <div className={`border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center group-hover:border-formex-orange transition-all ${file ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'}`}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-full ${file ? 'bg-formex-orange text-white' : 'bg-gray-200 text-gray-400'}`}>
                          <Upload size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700">
                            {file ? file.name : "Selecciona o arrastra tu archivo"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Máx. 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl mb-6 text-xs border border-amber-100">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>Solo puedes realizar una entrega. Asegúrate de que el archivo sea el correcto.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !file}
                    className="w-full py-4 bg-formex-orange text-white rounded-2xl font-bold text-base hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader size={20} className="animate-spin" /> Procesando entrega...</>
                    ) : (
                      <><Send size={20} /> Enviar mi trabajo</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentEvaluationSubmissions;
