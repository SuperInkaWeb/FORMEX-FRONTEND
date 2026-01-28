import React, { useEffect, useState } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import api from '../../services/api'; // 👈 tu axios configurado

const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{value}</h3>
            {subtext && (
                <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp size={12}/> {subtext}
                </p>
            )}
        </div>
    </div>
);

const DashboardHome = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/admin/stats');
                console.debug('[DashboardHome] /api/admin/stats response:', res);
                setStats(res.data);
            } catch (error) {
                // Mejor diagnostico visible en UI
                console.error('Error cargando estadísticas:', error);
                let message = 'Error al cargar estadísticas';
                if (error.response) {
                    // axios error con respuesta
                    message = `Error ${error.response.status}: ${error.response.statusText}` + (error.response.data ? ` - ${JSON.stringify(error.response.data)}` : '');
                } else if (error.request) {
                    message = 'No se recibió respuesta del servidor (comprobar API_URL / token)';
                } else if (error.message) {
                    message = error.message;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p>Cargando estadísticas...</p>;
    if (error) return (
        <div className="p-6 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <h3 className="font-bold mb-2">No se pudieron cargar las estadísticas</h3>
            <pre className="whitespace-pre-wrap">{error}</pre>
            <p className="text-xs text-gray-500 mt-2">Comprueba que la API está en ejecución, que el token está en localStorage y que <code>VITE_API_URL</code> apunta al backend correcto.</p>
        </div>
    );
    if (!stats) return <p>Error al cargar estadísticas</p>;

    return (
        <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Estudiantes"
                    value={stats.students}
                    icon={<Users size={28}/>}
                    color="bg-blue-500 shadow-blue-200"
                    subtext={stats.studentsGrowth}
                />

                <StatCard
                    title="Cursos Activos"
                    value={stats.courses}
                    icon={<BookOpen size={28}/>}
                    color="bg-formex-orange shadow-orange-200"
                    subtext={stats.coursesGrowth}
                />

                <StatCard
                    title="Ingresos (Mes)"
                    value={`$${stats.income}`}
                    icon={<DollarSign size={28}/>}
                    color="bg-green-500 shadow-green-200"
                    subtext={stats.incomeGrowth}
                />
            </div>

            {/* === EL RESTO SE MANTIENE TAL CUAL === */}

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
                    <p className="text-gray-400 text-sm mb-6 relative z-10">
                        Todos los servicios operan con normalidad.
                    </p>

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
