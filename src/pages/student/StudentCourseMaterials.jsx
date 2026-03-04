import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader } from 'lucide-react';
import MaterialService from '../../services/MaterialService';

const StudentCourseMaterials = () => {
  const { courseId, sessionId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await MaterialService.getMaterials(sessionId);
        setMaterials(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            to={`/student/course/${courseId}/sessions`}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold">Materiales de la sesion</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin mx-auto mb-2" />
            <p className="text-gray-700">Cargando materiales...</p>
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-700">No hay materiales en esta sesion.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {materials.map((m) => (
              <li
                key={m.id}
                className="bg-white p-4 rounded-lg border flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    <BookOpen size={16} />
                    {m.title}
                  </h3>
                  <p className="text-sm text-gray-700">{m.description}</p>
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Abrir material
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default StudentCourseMaterials;
