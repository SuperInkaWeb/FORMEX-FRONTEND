import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import CourseService from '../../services/courseService';
import { Plus, Trash2, Edit2, Search, CheckCircle, XCircle } from 'lucide-react';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);


    const initialForm = { fullname: '', email: '', password: '', roles: 'student', phone: '', enabled: true };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const data = await AdminService.getAllUsers();
            setUsers(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleOpenEdit = (user) => {
        setEditingId(user.id);
        const roleName = user.roles?.[0]?.name.replace('ROLE_', '').toLowerCase() || 'student';
        setFormData({
            fullname: user.fullName || user.fullname || '',
            email: user.email,
            password: '',
            roles: roleName,
            phone: user.phone || '',
            enabled: user.enabled,
            // try to pick first assigned course if exists
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = { ...formData, roles: [formData.roles] };

        if (editingId) {
            await AdminService.updateUser(editingId, payload);
            alert("Usuario actualizado");
        } else {
            await AdminService.createUser(payload);
            alert("Usuario creado");
        }

        setShowModal(false);
        loadUsers();
    } catch (error) {
        alert("Error: " + (error.response?.data?.message || "Revisa los datos"));
    }
};


    const handleDelete = async (id) => {
        if (window.confirm('¿Desactivar usuario?')) {
            await AdminService.deleteUser(id);
            loadUsers();
        }
    };

    const filteredUsers = users.filter(u =>
        (u.fullName || u.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <button onClick={() => { setEditingId(null); setFormData(initialForm); setShowModal(true); }} className="bg-formex-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-md">
                    <Plus size={18}/> Nuevo Usuario
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-2">
                <Search className="text-gray-400" size={20}/>
                <input
                    type="text" placeholder="Buscar por nombre o correo..."
                    className="flex-1 outline-none text-gray-700"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="p-4">Usuario</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <p className="font-bold text-gray-900">{user.fullName || user.fullname}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </td>
                            <td className="p-4">
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-100">
                    {user.roles[0]?.name.replace('ROLE_', '')}
                  </span>
                            </td>
                            <td className="p-4">
                                {user.enabled ?
                                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle size={14}/> Activo</span> :
                                    <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle size={14}/> Inactivo</span>
                                }
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button onClick={() => handleOpenEdit(user)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"><Edit2 size={18}/></button>
                                {user.enabled && <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={18}/></button>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Nombre Completo" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.fullname} onChange={e => setFormData({...formData, fullname: e.target.value})} />
                            <input type="email" placeholder="Correo" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            {!editingId && <input type="password" placeholder="Contraseña" required className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />}
                            <input type="text" placeholder="Teléfono" className="w-full border border-gray-200 p-3 rounded-lg focus:border-formex-orange outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            <select className="w-full border border-gray-200 p-3 rounded-lg bg-white outline-none" value={formData.roles} onChange={e => setFormData({...formData, roles: e.target.value})}>
                                <option value="student">Estudiante</option>
                                <option value="instructor">Instructor</option>
                                <option value="admin">Administrador</option>
                            </select>
                            {editingId && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} className="accent-formex-orange w-5 h-5"/>
                                    <span className="text-gray-700 font-medium">Usuario Activo</span>
                                </label>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 bg-formex-orange text-white rounded-lg hover:bg-orange-600 font-bold shadow-lg shadow-orange-200">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManager;