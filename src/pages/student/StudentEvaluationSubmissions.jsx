import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Upload, Loader } from "lucide-react";
import api from "../../services/api";

const StudentEvaluationSubmissions = () => {
  const { courseId, evaluationId } = useParams();

  const [evaluation, setEvaluation] = useState(null);
  const [submission, setSubmission] = useState(null); // su entrega
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Traer info de la evaluación
        const { data: evalData } = await api.get(
          `/api/courses/${courseId}/evaluations/${evaluationId}`
        );
        setEvaluation(evalData);

        // Traer entrega del estudiante (solo la suya)
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
    alert("Por favor selecciona un archivo");
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
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    setSubmission(data); // ⭐ CLAVE
    setComment("");
    setFile(null);

    alert("✅ Entrega enviada");
  } catch (err) {
    console.error(err);
    alert("✅ Ya realizaste tu entrega. Solo se permite una entrega por evaluación.");
  } finally {
    setSubmitting(false);
  }
};


  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader className="animate-spin mx-auto mb-2" />
        <p>Cargando evaluación...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to={`/student/course/${courseId}/evaluations`}
          className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <h1 className="text-xl font-bold">{evaluation?.title}</h1>
      </div>

      <p className="text-gray-600 mb-6">{evaluation?.description}</p>

      {/* FORMULARIO DE ENTREGA */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Upload size={16} /> Nueva entrega
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Comentario (opcional)"
            className="w-full border p-2 rounded"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Enviando..." : "Enviar entrega"}
          </button>
        </form>
      </div>

      {/* SU ENTREGA */}
      {submission ? (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">Su entrega</h3>
          {submission.comment && (
            <p className="text-gray-700 mb-2">{submission.comment}</p>
          )}
          {submission.fileUrl && (
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ver archivo enviado
            </a>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Aún no ha enviado ninguna entrega.</p>
      )}
    </div>
  );
};

export default StudentEvaluationSubmissions;
