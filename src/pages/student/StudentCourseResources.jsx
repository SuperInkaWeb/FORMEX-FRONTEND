import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader } from 'lucide-react';
import ResourceService from '../../services/resourceService';

const StudentCourseResources = () => {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await ResourceService.getByCourse(courseId);
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [courseId]);

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
          <h1 className="text-xl font-bold">Recursos del curso</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando recursos...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No hay recursos disponibles.</p>
          </div>
        ) : (
         <ul className="space-y-4">
  {resources.map((r) => (
    <li
      key={r.id}
      className="bg-white p-4 rounded-lg border flex justify-between items-start"
    >
      <div>
        <h3 className="font-bold flex items-center gap-2">
          <BookOpen size={16} />
          {r.title}
        </h3>
        <p className="text-sm text-gray-500">{r.description}</p>
        <div className="flex gap-3 mt-2">
          <a
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 text-sm hover:underline"
          >
            Abrir recurso
          </a>

          {/* 🔹 Botón Foro */}
          <Link
            to={`/student/course/${courseId}/resources/${r.id}/forum`}
            className="text-green-600 text-sm hover:underline"
          >
            Foro
          </Link>
        </div>
      </div>
    </li>
  ))}
</ul>
        )}
      </main>
    </div>
  );
};

export default StudentCourseResources;
