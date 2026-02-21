import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trash2, ArrowLeft, FileText, Download } from 'lucide-react';
import SubmissionService from "../../services/SubmissionService";

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
      setSubmissions(data);
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
  } catch (error) {
    console.error(error);
    alert('Error al eliminar entrega');
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
    alert('Error al descargar archivo');
  }
};


  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/instructor/course/${courseId}/evaluations`}
          className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Volver
        </Link>

      <h1 className="text-xl font-semibold text-gray-700">
  Entregas de alumnos
</h1>

      </div>

      {/* LISTA */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando entregas...</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay entregas aún.
        </p>
      ) : (
        <ul className="space-y-4">
   {submissions.map(s => (
  <li
    key={s.submissionId}
    className="bg-white p-4 rounded-lg border flex justify-between items-start"
  >
    {/* INFO DEL ALUMNO */}
    <div>
      <h3 className="font-bold flex items-center gap-2">
        <FileText size={16} />
        {s.studentName || 'Alumno'}
      </h3>

      {s.comment && (
        <p className="text-sm text-gray-500 mt-1">{s.comment}</p>
      )}

      {s.fileUrl && (
        <button
  onClick={() => handleDownload(s)}
  className="text-blue-500 text-sm hover:underline mt-2 inline-flex items-center gap-1"
>
  <Download size={14} />
  Descargar archivo
</button>

      )}
    </div>

    <div className="mt-2 flex items-center gap-2">
  <input
    type="number"
    min="0"
    max="20"
    step="0.5"
    defaultValue={s.grade ?? ''}
    onBlur={(e) =>
      SubmissionService.grade(
        courseId,
        evaluationId,
        s.submissionId,
        e.target.value
      )
    }
    className="w-20 border rounded px-2 py-1 text-sm"
    placeholder="Nota"
  />

  <span className="text-xs text-gray-500">/ 20</span>
</div>

    {/* BOTÓN ELIMINAR EN LA ESQUINA DERECHA */}
    <div className="flex items-start">
      <button
        onClick={() => handleDelete(s.submissionId)}
        className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default InstructorEvaluationSubmissions;
