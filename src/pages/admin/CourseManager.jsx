import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Para navegar a Sesiones
import CourseService from '../../services/courseService';
import api from '../../services/api';
import { Plus, Trash2, Edit2, BookOpen, UploadCloud, Loader, Image, Calendar, Users } from 'lucide-react';
import EnrolledStudentsModal from './CourseStudentsPage';
const user = JSON.parse(localStorage.getItem("user"));
const isAdmin =
  user?.roles?.includes("ADMIN") ||
  user?.roles?.includes("ROLE_ADMIN") ||
  user?.role === "ADMIN" ||
  user?.authorities?.some(a => a.authority === "ROLE_ADMIN"); 

const CoursesManager = () => {
    useEffect(() => {
        console.log('CoursesManager isAdmin =', isAdmin, 'user=', JSON.parse(localStorage.getItem('user')));
    }, []);
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);


const [selectedFile, setSelectedFile] = useState(null);




    const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedCourse, setSelectedCourse] = useState(null);
const [instructors, setInstructors] = useState([]);
    const [showStudentsModalAdmin, setShowStudentsModalAdmin] = useState(false);
    const [studentsAdmin, setStudentsAdmin] = useState([]);
    const [studentsAdminLoading, setStudentsAdminLoading] = useState(false);
    const [selectedInstructorId, setSelectedInstructorId] = useState(null);
        const [instructorsLoading, setInstructorsLoading] = useState(false);
        const [instructorsError, setInstructorsError] = useState(null);
        // track which instructor id is being assigned (so only that button shows loading)
        const [assigning, setAssigning] = useState(null);
const openAssignInstructorModal = async (course) => {
    setSelectedCourse(course);
    setShowAssignModal(true);
        setInstructors([]);
        setInstructorsError(null);
        setInstructorsLoading(true);
        try {
            let res;
            try {
                res = await api.get("/api/admin/users?role=INSTRUCTOR");
            } catch (e) {
                // fallback to admin endpoint if available
                res = await api.get("/api/admin/users?role=INSTRUCTOR");
            }
            const payload = res.data;
                const list = Array.isArray(payload) ? payload : (payload?.content || payload?.data || []);
                // mark which users actually have instructor role (safety: backend may return all users)
                const computeDisplayName = (u) => {
                    if (!u) return '';
                    const candidates = [];
                    if (u.displayName) candidates.push(u.displayName);
                    if (u.full_name) candidates.push(u.full_name);
                    if (u.fullName) candidates.push(u.fullName);
                    if (u.name) candidates.push(u.name);
                    if (u.username) candidates.push(u.username);
                    if (u.firstName && u.lastName) candidates.push(`${u.firstName} ${u.lastName}`);
                    if (u.first_name && u.last_name) candidates.push(`${u.first_name} ${u.last_name}`);
                    if (u.given_name && u.family_name) candidates.push(`${u.given_name} ${u.family_name}`);
                    if (u.email) {
                        const beforeAt = String(u.email).split('@')[0];
                        if (beforeAt) candidates.push(beforeAt);
                    }
                    return (candidates.find(s => s && String(s).trim()) || '').toString().trim();
                };

                const listWithFlag = (list || []).map(u => {
                    const roles = u?.roles || u?.authorities || [];
                    const hasInstructorRole = Array.isArray(roles) && roles.some(r => {
                        if (!r) return false;
                        if (typeof r === 'string') return r.includes('INSTRUCTOR');
                        return (r.name && String(r.name).includes('INSTRUCTOR')) || (r.authority && String(r.authority).includes('INSTRUCTOR'));
                    }) || u?.role === 'INSTRUCTOR';
                    const displayName = computeDisplayName(u);
                    return { ...u, isInstructor: !!hasInstructorRole, displayName };
                });
                const onlyInstructors = (listWithFlag || []).filter(u => u.isInstructor);
                setInstructors(onlyInstructors);
                setSelectedInstructorId(onlyInstructors[0]?.id || null);
        } catch (err) {
            console.error('Error loading instructors', err, err?.response);
            const status = err?.response?.status;
            const msg = err?.response?.data?.message || err.message || 'Error cargando instructores';
            setInstructorsError(`Error cargando instructores${status ? ` (status ${status})` : ''}: ${msg}`);
        } finally {
            setInstructorsLoading(false);
        }
};

const assignInstructor = async (instructorId) => {
    if (!instructorId) return alert('Selecciona un instructor');
    setAssigning(instructorId);
    try {
        // Backend expects PUT /api/courses/{id}/assign-instructor/{instructorId}
        const res = await api.put(`/api/courses/${selectedCourse.id}/assign-instructor/${instructorId}`);
        console.log('assign response', res);
        alert(res?.data?.message || 'Instructor asignado');
        setShowAssignModal(false);
        setSelectedCourse(null);
        setSelectedInstructorId(null);
        loadData();
    } catch (e) {
        console.error('Error assigning instructor', e, e?.response);
        const status = e?.response?.status;
        const msg = e?.response?.data?.message || e?.response?.data || e.message || 'Error al asignar instructor';
        setInstructorsError(`Error al asignar instructor${status ? ` (status ${status})` : ''}: ${msg}`);
        alert('Error al asignar instructor — revisa el modal');
    } finally { setAssigning(null); }
};

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
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("level", formData.level);
    data.append("categoryId", formData.categoryId);

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    if (editingId) {
      await api.put(`/api/courses/${editingId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await api.post("/api/courses", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    setShowModal(false);
    loadData();
    alert(editingId ? "Curso actualizado" : "Curso creado");

  } catch (error) {
    console.error(error);
    alert("Error al guardar");
  }
};

const handleDelete = async (courseId) => {
  const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar este curso?");
  if (!confirmDelete) return;

  try {
    await api.delete(`/api/courses/${courseId}`);
    alert("Curso eliminado correctamente");
    loadData(); // recarga la lista
  } catch (error) {
    console.error(error);
    alert("Error al eliminar el curso");
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

                                <button onClick={() => openAssignInstructorModal(course)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Asignar Instructor">
                                    <BookOpen size={18}/>
                                </button>

                              {/* VER ALUMNOS INSCRITOS */}
<Link
  to={`/admin/courses/${course.id}/students`}
  className="p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
  title="Ver alumnos inscritos"
>
  <Users size={18} />
</Link>

{/* INSCRIBIR ALUMNOS */}
<Link
  to={`/admin/courses/${course.id}/enroll`}
  className="p-2 text-formex-orange hover:bg-orange-50 rounded-lg transition-colors"
  title="Inscribir alumnos"
>
  <Plus size={18} />
</Link>


                                <button onClick={() => handleOpenEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit2 size={18}/></button>
                                <button onClick={() => handleDelete(course.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Instructores</h3>
                            <button onClick={() => { setShowAssignModal(false); setSelectedCourse(null); }} className="text-gray-500 hover:text-gray-700">Cerrar</button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Curso: {selectedCourse?.title}</p>

                        <div className="flex flex-col divide-y">
                            {instructorsLoading ? (
                                <div className="py-6 flex items-center justify-center">
                                    <Loader className="animate-spin text-formex-orange" />
                                </div>
                            ) : instructorsError ? (
                                <div className="py-4 text-sm text-red-500">{instructorsError}</div>
                            ) : instructors.length === 0 ? (
                                <p className="py-4 text-sm text-gray-500">No hay instructores registrados.</p>
                            ) : (
                                instructors.map(i => (
                                    <div key={i.id} className="py-3 flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="font-semibold truncate">{i.displayName}</div>
                                            <div className="text-xs text-gray-500 truncate">{i.email}</div>
                                        </div>
                                        <div className="flex items-center gap-2 pl-4">
                                            <button disabled={assigning && assigning !== i.id} onClick={async () => { setSelectedInstructorId(i.id); await assignInstructor(i.id); }} className="py-2 px-3 bg-formex-orange text-white rounded-lg whitespace-nowrap">{assigning === i.id ? 'Asignando...' : 'Asignar'}</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Students Modal (Admin) */}
          {showStudentsModalAdmin && (
            <EnrolledStudentsModal
             courseId={selectedCourse?.id}
           students={studentsAdmin}
           onClose={() => {
        setShowStudentsModalAdmin(false);
       setSelectedCourse(null);
    }}
  />
)}

       

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

                                    <UploadCloud className="text-gray-400" />
                           <span className="text-sm text-gray-500 font-medium">
                             Click para subir portada
                              </span>
                                   <input
                              type="file"
                            className="hidden"
                            accept="image/*"
                           onChange={(e) => setSelectedFile(e.target.files[0])}
                                   />
                                </label>
                                {selectedFile ? (
  <img
    src={URL.createObjectURL(selectedFile)}
    alt="Preview"
    className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200"
  />
) : (
  formData.imageUrl && (
    <img
      src={formData.imageUrl}
      alt="Preview"
      className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200"
    />
  )
)}

                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-formex-orange text-white rounded-lg hover:bg-orange-600 font-bold shadow-lg shadow-orange-200">
  Guardar
</button>
                     </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        
    );

    
};


export default CoursesManager;
