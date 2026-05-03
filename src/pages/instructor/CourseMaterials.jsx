import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, ExternalLink, BookOpen, FileText } from 'lucide-react';
import MaterialService from '../../services/MaterialService.js';
import { toast } from 'sonner';

const CourseMaterials = () => {
    const { courseId, sessionId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', link: '' });

    useEffect(() => {
        if (sessionId) loadMaterials();
    }, [sessionId]);

    const loadMaterials = async () => {
        try {
            const data = await MaterialService.getMaterials(sessionId);
            setMaterials(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MaterialService.createMaterial(sessionId, formData);
            setShowModal(false);
            setFormData({ title: '', description: '', link: '' });
            loadMaterials();
            toast.success('Material agregado');
        } catch (error) {
            toast.error('Error al agregar material');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar material?')) {
            await MaterialService.deleteMaterial(sessionId, id);
            toast.success('Material eliminado.');
            loadMaterials();
        }
    };

    const inputClass = "w-full border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-formex-orange/30 focus:border-formex-orange transition-colors";
    const labelClass = "block text-xs font-bold text-gray-500 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── HEADER ── */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/instructor/course/${courseId}/sessions`}
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Sesiones del curso</p>
                            <h1 className="font-extrabold text-gray-900 leading-tight">Materiales de la sesión</h1>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-formex-orange text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Nuevo material
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

                {/* Contador */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">Materiales</h2>
                    <span className="text-sm text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full font-medium">
                        {materials.length} material{materials.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                {materials.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-blue-500" size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No hay materiales aún</h3>
                        <p className="text-gray-500 text-sm mb-5">Agrega links de Drive, PDFs o recursos externos para esta sesión.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 bg-formex-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                        >
                            <Plus size={16} /> Nuevo material
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {materials.map((m, index) => (
                            <div
                                key={m.id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden group"
                            >
                                {/* Franja superior naranja */}
                                <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        {/* Ícono + Info */}
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <FileText size={18} className="text-formex-orange" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-extrabold text-gray-900 text-sm leading-snug truncate">{m.title}</h3>
                                                {m.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Eliminar */}
                                        <button
                                            onClick={() => handleDelete(m.id)}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                            title="Eliminar material"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>

                                    {/* Botón enlace */}
                                    {m.link && (
                                        <a
                                            href={m.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            <ExternalLink size={13} /> Abrir enlace
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ── MODAL: NUEVO MATERIAL ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Header modal */}
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-extrabold text-gray-900">Nuevo material</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Agrega un recurso externo para esta sesión</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Título</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Presentación clase 1"
                                    required
                                    className={inputClass}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Descripción <span className="text-gray-400 font-normal">(opcional)</span></label>
                                <textarea
                                    placeholder="Breve descripción del material..."
                                    className={`${inputClass} resize-none`}
                                    rows={2}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Enlace</label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    className={inputClass}
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setFormData({ title: '', description: '', link: '' }); }}
                                    className="flex-1 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm shadow-sm"
                                >
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;
