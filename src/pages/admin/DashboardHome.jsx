import React from 'react';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{value}</h3>
            {subtext && <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><TrendingUp size={12}/> {subtext}</p>}
        </div>
    </div>
);

const DashboardHome = () => {
    return (
        <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Datos simulados (Idealmente vendrían de un endpoint /api/admin/stats) */}
                <StatCard
                    title="Estudiantes"
                    value="1,240"
                    icon={<Users size={28}/>}
                    color="bg-blue-500 shadow-blue-200"
                    subtext="+12% este mes"
                />
                <StatCard
                    title="Cursos Activos"
                    value="24"
                    icon={<BookOpen size={28}/>}
                    color="bg-formex-orange shadow-orange-200"
                    subtext="4 nuevos esta semana"
                />
                <StatCard
                    title="Ingresos (Mes)"
                    value="$8,450"
                    icon={<DollarSign size={28}/>}
                    color="bg-green-500 shadow-green-200"
                    subtext="+5% vs mes anterior"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">U</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Nuevo usuario registrado</p>
                                    <p className="text-xs text-gray-500">Hace {i * 15} minutos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-formex-dark rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-formex-lime rounded-full mix-blend-overlay filter blur-[60px] opacity-20"></div>
                    <h2 className="text-lg font-bold mb-2 relative z-10">Estado del Sistema</h2>
                    <p className="text-gray-400 text-sm mb-6 relative z-10">Todos los servicios operan con normalidad.</p>
                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center text-sm">
                            <span>Base de Datos</span>
                            <span className="text-green-400 font-bold">Online</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>API Gateway</span>
                            <span className="text-green-400 font-bold">Online</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Almacenamiento</span>
                            <span className="text-green-400 font-bold">85% Libre</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;