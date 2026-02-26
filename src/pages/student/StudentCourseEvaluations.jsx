import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Loader } from "lucide-react";
import api from "../../services/api";

const StudentCourseEvaluations = () => {
  const { courseId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
const [grades, setGrades] = useState({});

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const { data } = await api.get(
          `/api/courses/${courseId}/evaluations`
        );
        setEvaluations(data);

            // 🔥 cargar nota por evaluación
    const gradesMap = {};

    await Promise.all(
      data.map(async (ev) => {
        try {
          const res = await api.get(
            `/api/courses/${courseId}/evaluations/${ev.id}/my-submission`
          );
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

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            to={`/student/course/${courseId}/sessions`}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold">Evaluaciones</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando evaluaciones...</p>
          </div>
        ) : evaluations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              No hay evaluaciones disponibles.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {evaluations.map(ev => (
              <li
                key={ev.id}
                className="bg-white p-4 rounded-lg border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText size={16} />
                    {ev.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {ev.description}
                  </p>
                </div>

               <div className="flex gap-2">

{grades[ev.id] !== undefined && (
  <p className="mt-2 text-sm ml-2">
    {grades[ev.id] !== null ? (
      <span className="text-green-600 font-semibold">
        ⭐ Nota: {grades[ev.id]} / 20
      </span>
    ) : (
      <span className="text-yellow-600">
        ⏳ Pendiente de calificación
      </span>
    )}
  </p>
)}



  {/* Botón Descargar PDF */}
  <button
    onClick={() => downloadPdf(ev.id, ev.title)}
    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
  >
    <Download size={16} />
    Descargar PDF
  </button>

  {/* Botón Entregas */}
  <Link
    to={`/student/course/${courseId}/evaluations/${ev.id}/submissions`}
    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    Entregas
  </Link>
</div>
</li>
))} 
</ul>
)} 
</main>
</div>
);
};

export default StudentCourseEvaluations;