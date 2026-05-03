import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader, Download, ExternalLink, MessageCircle } from 'lucide-react';
import ResourceService from '../../services/resourceService';

const StudentCourseResources = () => {
  const { courseId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await ResourceService.getByCourse(courseId);
        setResources(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, [courseId]);

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
              <h1 className="font-extrabold text-gray-900 leading-tight">Recursos del curso</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Contador */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">Biblioteca de Recursos</h2>
          <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
            {resources.length} recurso{resources.length !== 1 ? 's' : ''}
          </span>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-blue-500" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay recursos aún</h3>
            <p className="text-gray-500 text-sm">Tu instructor aún no ha publicado materiales adicionales para este curso.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden group"
              >
                <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />

                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen size={18} className="text-formex-orange" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-gray-900 text-sm leading-snug truncate">{r.title}</h3>
                      {r.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2">
                      {r.fileUrl && (
                        <a
                          href={r.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                        >
                          <Download size={13} /> Descargar
                        </a>
                      )}
                      {r.link && (
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                          <ExternalLink size={13} /> Link
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/student/course/${courseId}/resources/${r.id}/forum`}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100"
                    >
                      <MessageCircle size={14} /> Foro de consultas
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

export default StudentCourseResources;
