import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { Plus, Trash2, Edit2, Search, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import PasswordInput from '../../components/PasswordInput'; // 👈 IMPORTANTE: Importamos el componente

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Actualizado: Separamos name/lastname y usamos 'role' singular para coincidir con backend
    const initialForm = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'student',
        phone: '',
        enabled: true
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const data = await AdminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
        finally { setLoading(false); }
    };

    const handleOpenEdit = (user) => {
        setEditingId(user.id);
        // Extraer rol principal (ej: ROLE_ADMIN -> admin)
        const roleName = user.roles?.[0]?.name.replace('ROLE_', '').toLowerCase() || 'student';

        setFormData({
            name: user.name || '',          // Backend v1.3 usa name
            lastname: user.lastname || '',  // Backend v1.3 usa lastname
            email: user.email,
            password: '', // Dejamos vacío para no sobrescribir si no se toca
            role: roleName,
            phone: user.phone || '',
            enabled: user.enabled
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se desactivará el acceso a este usuario",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F97316',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, desactivar'
        });

        if (result.isConfirmed) {
            try {
                await AdminService.deleteUser(id);
                Swal.fire('Desactivado', 'El usuario ha sido desactivado.', 'success');
                loadUsers();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // En edición, si password está vacío, el backend debería ignorarlo (ajustar backend si es necesario)
                // O enviar solo campos cambiados. Por simplicidad enviamos todo.
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // No enviar password vacío en update

                await AdminService.updateUser(editingId, payload);
                Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success');
            } else {
                await AdminService.createUser(formData);
                Swal.fire('Creado', 'Usuario creado exitosamente en BD y Auth0', 'success');
            }
            setShowModal(false);
            setFormData(initialForm);
            setEditingId(null);
            loadUsers();
        } catch (error) {
            console.error(error);
            // Mostrar mensaje de error del backend (ej: Password too weak de Auth0)
            const msg = error.response?.data?.message || 'Error al guardar usuario';
            Swal.fire('Error', msg, 'error');
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.lastname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <button
                    onClick={() => { setFormData(initialForm); setEditingId(null); setShowModal(true); }}
                    className="flex items-center gap-2 bg-formex-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                    <Plus size={20} /> Nuevo Usuario
                </button>
            </div>

            {/* Buscador */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o correo..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Usuario</th>
                            <th className="p-4 font-semibold text-gray-600">Rol</th>
                            <th className="p-4 font-semibold text-gray-600">Estado</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">Cargando usuarios...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name} {user.lastname}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            user.roles?.[0]?.name === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.roles?.[0]?.name === 'ROLE_INSTRUCTOR' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                        }`}>
                                            {user.roles?.[0]?.name.replace('ROLE_', '') || 'STUDENT'}
                                        </span>
                                </td>
                                <td className="p-4">
                                    {user.enabled ?
                                        <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle size={16}/> Activo</span> :
                                        <span className="flex items-center gap-1 text-red-500 text-sm"><XCircle size={16}/> Inactivo</span>
                                    }
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => handleOpenEdit(user)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"><Edit2 size={18}/></button>
                                    <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-500"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">
                            {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        value={formData.lastname}
                                        onChange={e => setFormData({...formData, lastname: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    disabled={!!editingId} // No permitir editar email para no romper Auth0 ID link
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            {/* Solo mostrar campo de contraseña al crear, o hacerlo opcional al editar */}
                            {!editingId && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                                    {/* 🔥 COMPONENTE PASSWORD INPUT CON VALIDACIÓN VISUAL */}
                                    <PasswordInput
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        name="password"
                                        placeholder="Crear contraseña temporal"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                    >
                                        <option value="student">Estudiante</option>
                                        <option value="instructor">Instructor</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            {editingId && (
                                <label className="flex items-center gap-2 cursor-pointer pt-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.enabled}
                                        onChange={e => setFormData({...formData, enabled: e.target.checked})}
                                        className="accent-formex-orange w-5 h-5"
                                    />
                                    <span className="text-gray-700 font-medium">Usuario Activo</span>
                                </label>
                            )}

                            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-formex-orange text-white rounded-lg hover:bg-orange-600 font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
                                >
                                    {editingId ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManager;