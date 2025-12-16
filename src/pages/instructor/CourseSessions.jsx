import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Video, Calendar, ArrowLeft, Clock } from 'lucide-react';
import SessionService from '../../services/sessionService';
import CourseService from '../../services/courseService';
import Navbar from '../../components/Navbar';

const CourseSessions = () => {
    const { courseId } = useParams(); // Obtenemos el ID de la URL
    const [sessions, setSessions] = useState([]);
    const [course, setCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Formulario
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '', // datetime-local string
        meetingLink: ''
    });

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        try {
            const [courseData, sessionsData] = await Promise.all([
                CourseService.getCourseById(courseId),
                SessionService.getSessionsByCourse(courseId)
            ]);
            setCourse(courseData);
            setSessions(sessionsData);
        } catch (error) {
            console.error("Error cargando datos", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await SessionService.createSession({ ...formData, courseId });
            setShowModal(false);
            setFormData({ title: '', description: '', startTime: '', meetingLink: '' });
            loadData();
            alert("¡Clase programada!");
        } catch (error) {
            alert("Error al crear sesión");
        }
    };

    const handleDelete = async (id) => {
        if(confirm("¿Borrar esta sesión?")) {
            await SessionService.deleteSession(id);
            loadData();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header Simple para Instructor */}
            <header className="bg-white border-b border-gray-200 p-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/instructor" className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><ArrowLeft/></Link>
                        <div>
                            <h1 className="font-bold text-xl text-gray-900">{course?.title || 'Cargando...'}</h1>
                            <p className="text-xs text-gray-500">Gestión de Sesiones</p>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)} className="bg-formex-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-600 transition-colors">
                        <Plus size={18}/> Nueva Sesión
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 py-8">

                {sessions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Calendar className="mx-auto text-gray-300 mb-4" size={48}/>
                        <p className="text-gray-500">No hay clases programadas aún.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session, index) => (
                            <div key={session.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-formex-orange transition-colors">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{session.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(session.startTime).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={14}/> {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            {session.meetingLink && (
                                                <a href={session.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                                    <Video size={14}/> Link de Clase
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2">{session.description}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(session.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded transition-colors self-end md:self-auto">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Programar Nueva Clase</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Título de la sesión" required className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <textarea placeholder="Descripción (Temas a tratar)" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Fecha y Hora</label>
                                <input type="datetime-local" required className="w-full border p-2 rounded" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            </div>

                            <input type="url" placeholder="Link de Zoom / Meet" className="w-full border p-2 rounded" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 bg-formex-orange text-white rounded hover:bg-orange-600">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSessions;