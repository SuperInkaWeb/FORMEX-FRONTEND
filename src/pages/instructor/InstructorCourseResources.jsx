import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, BookOpen, Download, ExternalLink, MessageCircle, Loader, FileText } from 'lucide-react';
import ResourceService from '../../services/resourceService';
import { toast } from 'sonner';

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
    const [file, setFile] = useState(null);

    useEffect(() => {
        loadResources();
    }, [courseId]);

    const loadResources = async () => {
        try {
            const data = await ResourceService.getByCourse(courseId);
            setResources(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (file) {
                const data = new FormData();
                data.append('title', formData.title);
                data.append('description', formData.description);
                if (formData.link) data.append('link', formData.link);
                data.append('file', file);
                await ResourceService.createWithFile(courseId, data);
            } else {
                await ResourceService.create(courseId, formData);
            }

            setShowModal(false);
            setFormData({ title: '', description: '', link: '' });
            setFile(null);
            loadResources();
            toast.success('Recurso agregado');
        } catch (error) {
            console.error(error);
            toast.error('Error al agregar recurso');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar recurso?')) {
            await ResourceService.delete(courseId, id);
            toast.success('Recurso eliminado.');
            loadResources();
        }
    };

    const inputClass = "w-full border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-formex-orange/30 focus:border-formex-orange transition-colors";
    const labelClass = "block text-xs font-bold text-gray-500 mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── HEADER ── */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/instructor"
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="w-px h-6 bg-gray-200" />
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Panel Instructor</p>
                            <h1 className="font-extrabold text-gray-900 leading-tight">Recursos del curso</h1>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-formex-orange text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Agregar recurso
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                {/* Resumen */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-extrabold text-gray-900">
                        Material de Estudio
                    </h2>
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
                        <p className="text-gray-500 text-sm mb-5">Sube PDFs, libros o links útiles para tus alumnos.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 bg-formex-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                        >
                            <Plus size={16} /> Agregar recurso
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {resources.map(r => (
                            <div
                                key={r.id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden group"
                            >
                                <div className="h-1 w-full bg-gradient-to-r from-formex-orange to-orange-400" />

                                <div className="p-5 flex flex-col h-full">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <BookOpen size={20} className="text-formex-orange" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-extrabold text-gray-900 text-base leading-snug truncate">{r.title}</h3>
                                                {r.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                                            title="Eliminar recurso"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                                                    <Download size={13} /> PDF
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
                                            to={`/instructor/course/${courseId}/resources/${r.id}/forum`}
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

            {/* ── MODAL: NUEVO RECURSO ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-extrabold text-gray-900">Nuevo recurso</h3>
                            <p className="text-sm text-gray-500 mt-0.5">Sube archivos o comparte enlaces útiles</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Título</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Guía de estudio"
                                    required
                                    className={inputClass}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Descripción</label>
                                <textarea
                                    placeholder="Breve detalle del recurso..."
                                    className={`${inputClass} resize-none`}
                                    rows={2}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className={labelClass}>Enlace externo <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className={inputClass}
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Archivo <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={e => setFile(e.target.files[0])}
                                        />
                                        <div className={`border-2 border-dashed border-gray-200 rounded-xl p-4 text-center group-hover:border-formex-orange transition-colors ${file ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'}`}>
                                            <div className="flex flex-col items-center gap-1">
                                                <FileText size={24} className={file ? 'text-formex-orange' : 'text-gray-300'} />
                                                <span className="text-xs font-bold text-gray-500 truncate max-w-[200px]">
                                                    {file ? file.name : 'Subir archivo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setFormData({ title: '', description: '', link: '' }); setFile(null); }}
                                    className="flex-1 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 bg-formex-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm shadow-sm disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader size={14} className="animate-spin" /> Guardando...
                                        </span>
                                    ) : 'Agregar recurso'}
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
