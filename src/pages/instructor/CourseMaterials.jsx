import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import MaterialService from '../../services/materialService';

const CourseMaterials = () => {
    const { courseId, sessionId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({

        title: '',
        description: '',
        link: ''
    });

    useEffect(() => {
    if (sessionId) {
        loadMaterials();
    }
    }, [sessionId]);


    const loadMaterials = async () => {
        try {
            const data = await MaterialService.getMaterials( sessionId );
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
            alert('Material agregado');
        } catch (error) {
            alert('Error al agregar material');
        }
    };

    const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar material?")) {
        await MaterialService.deleteMaterial(sessionId, id);
        loadMaterials();
    }
   };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <Link 
                     to={`/instructor/course/${courseId}/sessions`}
                       className="text-gray-500 hover:text-blue-500 flex items-center gap-1"
                       >
                        <ArrowLeft size={16}/> Volver
                         </Link>

                <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
                    <Plus size={16}/> Nuevo material
                </button>
            </div>

            {materials.length === 0 ? (
                <p className="text-gray-500 text-center">No hay materiales aún.</p>
            ) : (
                <ul className="space-y-4">
                    {materials.map(m => (
                        <li key={m.id} className="bg-white p-4 rounded-lg border flex justify-between items-start">
                            <div>
                                <h3 className="font-bold">{m.title}</h3>
                                <p className="text-sm text-gray-500">{m.description}</p>
                                <a href={m.link} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">Abrir enlace</a>
                            </div>
                            <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                <Trash2 size={16}/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Nuevo material</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Título" required className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <textarea placeholder="Descripción" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <input type="url" placeholder="Link de Drive" className="w-full border p-2 rounded" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Agregar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;
