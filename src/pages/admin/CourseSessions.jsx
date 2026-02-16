import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CourseService from '../../services/courseService';
import { Calendar, Clock, Video, Trash2, Plus, ArrowLeft, CheckCircle, Edit2, Filter } from 'lucide-react';

const CourseSessions = () => {

  const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Estados de control
    const [editingId, setEditingId] = useState(null);
    const [filterMonth, setFilterMonth] = useState('all'); // 'all' o número de mes (0-11)

    const initialForm = {
        title: '',
        date: '',
        time: '09:00',
        durationMinutes: 60,
        meetingLink: ''
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        loadData();

    }, [courseId]);


    const loadData = async () => {
        try {
            const [courseData, sessionsData] = await Promise.all([

                CourseService.getCourseById(courseId),
                CourseService.getSessionsByCourse(courseId)

            ]);
            setCourse(courseData);
            setSessions(sessionsData);
        } catch (error) {
            console.error("Error cargando datos", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE FILTRADO ---
    const filteredSessions = sessions.filter(session => {
        if (filterMonth === 'all') return true;
        const sessionDate = new Date(session.startTime);
        return sessionDate.getMonth() === parseInt(filterMonth);
    });

    // --- ACCIONES CRUD ---

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData(initialForm);
        setShowModal(true);
    };

    const handleOpenEdit = (session) => {
        setEditingId(session.id);

        // Convertir ISO string a inputs de fecha y hora
        const dateObj = new Date(session.startTime);
        const dateStr = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = dateObj.toTimeString().substring(0, 5); // HH:MM

        setFormData({
            title: session.title,
            date: dateStr,
            time: timeStr,
            durationMinutes: session.durationMinutes,
            meetingLink: session.meetingLink || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (sessionId) => {
        if (window.confirm('¿Borrar esta sesión del calendario?')) {
            await CourseService.deleteSession(sessionId);
            loadData();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalDateTime = `${formData.date}T${formData.time}:00`;
            const payload = {
                title: formData.title,
                startTime: finalDateTime,
                durationMinutes: formData.durationMinutes,
                meetingLink: formData.meetingLink,
                courseId: courseId
            };

            if (editingId) {
                await CourseService.updateSession(editingId, payload);
                alert("Clase actualizada correctamente");
            } else {
                await CourseService.createSession(payload);
                alert("Clase agendada exitosamente");
            }

            setShowModal(false);
            loadData();
        } catch (error) {
            alert("Error al guardar sesión");
        }
    };

    // Generador de opciones de hora
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 7; hour <= 22; hour++) {
            for (let min = 0; min < 60; min += 15) {
                const h = hour.toString().padStart(2, '0');
                const m = min.toString().padStart(2, '0');
                times.push(`${h}:${m}`);
            }
        }
        return times;
    };

    // Nombres de meses para el filtro
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    if (loading) return <div className="p-10 text-center">Cargando cronograma...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <Link to="/admin/courses" className="text-gray-500 hover:text-formex-orange flex items-center gap-2 mb-2 text-sm font-bold">
                        <ArrowLeft size={16}/> Volver a Cursos
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Cronograma: {course?.title}</h1>
                    <p className="text-gray-500 text-sm">
                        {sessions.length} clases agendadas en total
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* --- FILTRO POR MES --- */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                        <select
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-formex-orange text-sm appearance-none cursor-pointer hover:border-gray-300"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                        >
                            <option value="all">Todos los meses</option>
                            {months.map((m, idx) => (
                                <option key={idx} value={idx}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleOpenCreate} className="bg-formex-orange text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-md font-bold">
                        <Plus size={20}/> Agendar
                    </button>
                </div>
            </div>

            {/* Lista de Sesiones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredSessions.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Calendar size={32} className="text-gray-300"/>
                        </div>
                        <p className="font-medium">No hay clases para mostrar.</p>
                        {filterMonth !== 'all' && <p className="text-sm">Prueba cambiando el filtro de mes.</p>}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredSessions.map((session, index) => {
                            const date = new Date(session.startTime);
                            return (
                                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                                    <div className="flex gap-4">
                                        {/* Fecha Badge */}
                                        <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-600 w-16 h-16 rounded-xl border border-blue-100 flex-shrink-0">
                                            <span className="text-xs font-bold uppercase">{date.toLocaleDateString('es-ES', { month: 'short' })}</span>
                                            <span className="text-2xl font-bold">{date.getDate()}</span>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-formex-orange transition-colors">
                                                {session.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <Clock size={14}/> {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({session.durationMinutes} min)
                        </span>
                                                {session.meetingLink ? (
                                                    <a href={session.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                                                        <Video size={14}/> Link Zoom
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 flex items-center gap-1"><Video size={14}/> Sin link</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                        {session.enabled ? (
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1 mr-2">
                            <CheckCircle size={12}/> Activa
                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded mr-2">Cancelada</span>
                                        )}

                                        <button onClick={() => handleOpenEdit(session)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                            <Edit2 size={18}/>
                                        </button>

                                        <button onClick={() => handleDelete(session.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Crear/Editar Sesión */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Editar Clase' : 'Agendar Nueva Clase'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Título de la Clase</label>
                                <input type="text" placeholder="Ej: Introducción a React" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Fecha</label>
                                    <input type="date" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none text-sm bg-white" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hora Inicio</label>
                                    <select required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none text-sm bg-white" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                                        {generateTimeOptions().map(t => ( <option key={t} value={t}>{t}</option> ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Duración (min)</label>
                                    <input type="number" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value)})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Enlace de Reunión</label>
                                <input type="url" placeholder="https://zoom.us/j/..." className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-formex-orange text-white rounded-lg hover:bg-orange-600 font-bold shadow-lg shadow-orange-200">
                                    {editingId ? 'Guardar Cambios' : 'Agendar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSessions;