import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, FileText } from 'lucide-react';
import EvaluationService from '../../services/evaluationService';

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

const downloadPdf = async (evaluationId, title) => {
  try {
    // 👇 ahora solo pasamos evaluationId
    const res = await EvaluationService.download(evaluationId);

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error descargando PDF", err);
    alert("❌ Error al descargar PDF");
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
      alert("✅ Evaluación creada");
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear evaluación");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar evaluación?")) {
      await EvaluationService.delete(courseId, id);
      loadEvaluations();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/instructor"
          className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Volver
        </Link>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600"
        >
          <Plus size={16} /> Nueva evaluación
        </button>
      </div>

 {/* LISTA */}
{evaluations.length === 0 ? (
  <p className="text-gray-500 text-center">No hay evaluaciones aún.</p>
) : (
  <ul className="space-y-4">
    {evaluations.map(e => (
      <li
        key={e.id}
        className="bg-white p-4 rounded-lg border flex justify-between items-start"
      >
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <FileText size={16} />
            {e.title}
          </h3>
          <p className="text-sm text-gray-500">{e.description}</p>

          <button
  onClick={() => downloadPdf(e.id, e.title)}
  className="text-orange-600 text-sm hover:underline mt-2 inline-block"
>
  Descargar examen
</button>

        </div>

        {/* Botones a la derecha en fila */}
        <div className="flex items-center gap-2">
          <Link
            to={`/instructor/course/${courseId}/evaluations/${e.id}/submissions`}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Entregas
          </Link>

          <button
            onClick={() => handleDelete(e.id)}
            className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </li>
    ))}
  </ul>
)}



      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Nueva evaluación</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Título"
                required
                className="w-full border p-2 rounded"
                value={formData.title}
                onChange={e =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <textarea
                placeholder="Descripción"
                className="w-full border p-2 rounded"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                type="file"
                accept="application/pdf"
                required
                className="w-full border p-2 rounded"
                onChange={e =>
                  setFormData({ ...formData, pdf: e.target.files[0] })
                }
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  {loading ? "Guardando..." : "Crear"}
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
