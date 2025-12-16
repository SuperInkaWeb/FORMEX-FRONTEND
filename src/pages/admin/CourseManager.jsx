import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Para navegar a Sesiones
import CourseService from '../../services/courseService';
import api from '../../services/api';
import { Plus, Trash2, Edit2, BookOpen, UploadCloud, Loader, Image, Calendar } from 'lucide-react';

const CoursesManager = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialForm = { title: '', description: '', price: '', level: 'PRINCIPIANTE', imageUrl: '', categoryId: 1 };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [c, cats] = await Promise.all([CourseService.getAllCourses(), CourseService.getCategories()]);
            setCourses(c);
            setCategories(cats);
        } catch (e) { console.error(e); }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const response = await api.post('/api/media/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setFormData({ ...formData, imageUrl: response.data.url });
        } catch (error) { alert("Error al subir imagen"); }
        finally { setUploading(false); }
    };

    const handleOpenEdit = (course) => {
        setEditingId(course.id);
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            level: course.level,
            imageUrl: course.imageUrl,
            categoryId: course.category?.id || 1
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) await CourseService.updateCourse(editingId, formData);
            else await CourseService.createCourse(formData);
            setShowModal(false);
            loadData();
            alert(editingId ? "Curso actualizado" : "Curso creado");
        } catch (error) { alert("Error al guardar"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar curso? (Se ocultará del catálogo)')) {
            await CourseService.deleteCourse(id);
            loadData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Gestión de Cursos</h2>
                <button onClick={() => { setEditingId(null); setFormData(initialForm); setShowModal(true); }} className="bg-formex-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-md">
                    <Plus size={18}/> Nuevo Curso
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                        <div className="h-40 bg-gray-100 relative overflow-hidden">
                            {course.imageUrl ? (
                                <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="cover"/>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300"><Image size={32}/></div>
                            )}
                            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded-lg shadow-sm text-gray-800">
                 ${course.price}
               </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <span className="text-xs font-bold text-formex-orange uppercase mb-1 tracking-wide">{course.category?.name}</span>
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg">{course.title}</h3>
                            <p className="text-xs text-gray-500 mb-4 flex-1 line-clamp-2 leading-relaxed">{course.description}</p>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
                                {/* --- NUEVO BOTÓN: GESTIONAR SESIONES --- */}
                                <Link
                                    to={`/admin/courses/${course.id}/sessions`}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Gestionar Cronograma (Clases)"
                                >
                                    <Calendar size={18}/>
                                </Link>
                                {/* -------------------------------------- */}

                                <button onClick={() => handleOpenEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={18}/></button>
                                <button onClick={() => handleDelete(course.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Editar Curso' : 'Publicar Curso'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Título" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <textarea placeholder="Descripción" required className="w-full border border-gray-200 p-3 rounded-lg h-24 resize-none focus:border-formex-orange outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Precio ($)" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                <select className="w-full border border-gray-200 p-3 rounded-lg bg-white outline-none" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                                    <option value="PRINCIPIANTE">Principiante</option>
                                    <option value="INTERMEDIO">Intermedio</option>
                                    <option value="AVANZADO">Avanzado</option>
                                </select>
                            </div>
                            <select className="w-full border border-gray-200 p-3 rounded-lg bg-white outline-none" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-orange-50 transition-colors">
                                <label className="cursor-pointer flex flex-col items-center gap-2">
                                    {uploading ? <Loader className="animate-spin text-formex-orange"/> : <UploadCloud className="text-gray-400"/>}
                                    <span className="text-sm text-gray-500 font-medium">{uploading ? 'Subiendo...' : 'Click para subir portada'}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading}/>
                                </label>
                                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200"/>}
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-formex-orange text-white rounded-lg hover:bg-orange-600 font-bold shadow-lg shadow-orange-200" disabled={uploading}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesManager;