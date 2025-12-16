import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, LogOut, Home, User } from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar - Barra Lateral */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-formex-orange rounded flex items-center justify-center text-white font-bold">A</div>
                    <span className="font-bold text-lg text-gray-800">Panel Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-formex-orange rounded-lg transition-colors font-medium">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-formex-orange rounded-lg transition-colors font-medium">
                        <Users size={20} /> Usuarios
                    </Link>
                    <Link to="/admin/courses" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-formex-orange rounded-lg transition-colors font-medium">
                        <BookOpen size={20} /> Cursos
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
                        <Home size={16} /> Ver Sitio Web
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors font-medium">
                        <LogOut size={16} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content - Área de Trabajo */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                {/* Header Móvil */}
                <header className="bg-white shadow-sm p-4 md:hidden flex justify-between items-center sticky top-0 z-20">
                    <span className="font-bold text-gray-800">Formex Admin</span>
                    <button onClick={logout} className="text-red-500"><LogOut size={20}/></button>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user?.fullName || 'Admin'}</h1>
                            <p className="text-gray-500 text-sm">Gestiona tu plataforma educativa desde aquí.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-formex-orange">
                                <User size={16} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Administrador</span>
                        </div>
                    </header>

                    {/* Aquí se renderizan las sub-páginas (Users, Courses, DashboardHome) */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;