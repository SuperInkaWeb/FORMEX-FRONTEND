import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, BookOpen } from 'lucide-react';
import ResourceService from '../../services/resourceService';

const InstructorCourseResources = () => {
    const { courseId } = useParams();

    const [resources, setResources] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: ''
    });

    useEffect(() => {
        loadResources();
    }, [courseId]);

    const loadResources = async () => {
        try {
            const data = await ResourceService.getByCourse(courseId);
            setResources(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await ResourceService.create(courseId, formData);

            setShowModal(false);
            setFormData({ title: '', description: '', link: '' });
            loadResources();
            alert('✅ Recurso agregado');
        } catch (error) {
            console.error(error);
            alert('❌ Error al agregar recurso');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar recurso?')) {
            await ResourceService.delete(courseId, id);
            loadResources();
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <Link
                  to={`/instructor/`}
                 className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
                   >
                <ArrowLeft size={16} /> Volver
                 </Link>


                {/* 🔥 BOTÓN ESQUINA */}
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg
                               flex items-center gap-2 hover:bg-blue-600"
                >
                    <Plus size={16} /> Agregar recurso
                </button>
            </div>

            {/* LISTA */}
            {resources.length === 0 ? (
                <p className="text-gray-500 text-center">
                    No hay recursos aún.
                </p>
            ) : (
                <ul className="space-y-4">
                  {resources.map(r => (
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
          Abrir enlace
        </a>

        {/* 🔹 Botón Foro */}
        <Link
          to={`/instructor/course/${courseId}/resources/${r.id}/forum`}
          className="text-green-600 text-sm hover:underline"
        >
          Foro
        </Link>
      </div>
    </div>

    <button
      onClick={() => handleDelete(r.id)}
      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
    >
      <Trash2 size={16} />
    </button>
  </li>
))}
                </ul>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center
                                justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">
                            Nuevo recurso
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Título"
                                required
                                className="w-full border p-2 rounded"
                                value={formData.title}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value
                                    })
                                }
                            />

                            <textarea
                                placeholder="Descripción"
                                className="w-full border p-2 rounded"
                                value={formData.description}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })
                                }
                            />

                            <input
                                type="url"
                                placeholder="Link"
                                required
                                className="w-full border p-2 rounded"
                                value={formData.link}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        link: e.target.value
                                    })
                                }
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 text-gray-600
                                               hover:bg-gray-100 rounded"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 bg-blue-500
                                               text-white rounded hover:bg-blue-600"
                                >
                                    {loading ? 'Guardando...' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorCourseResources;
