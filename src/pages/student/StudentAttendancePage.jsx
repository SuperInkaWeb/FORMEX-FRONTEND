import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import AttendanceService from '../../services/attendanceService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#ef4444']; // Emerald-500, Red-500

const StudentAttendancePage = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AttendanceService.getAttendanceSummaryByCourse(courseId)
      .then(res => setData(res))
      .catch(err => console.error("ERROR:", err))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-formex-orange" size={32} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <XCircle size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">No hay datos de asistencia</h3>
        <Link to={`/student/course/${courseId}/sessions`} className="mt-4 text-formex-orange font-bold hover:underline">Volver</Link>
      </div>
    );
  }

  const chartData = [
    { name: 'Asistió', value: data.presentes },
    { name: 'Faltó', value: data.ausentes }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/student/course/${courseId}/sessions`}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Panel de estudio</p>
              <h1 className="font-extrabold text-gray-900 leading-tight">Mis Asistencias</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Gráfico */}
          <div className="md:col-span-5 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
            <h2 className="text-lg font-extrabold text-gray-900 mb-8 self-start">Resumen Visual</h2>
            
            <div className="relative w-full aspect-square max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} cornerRadius={10} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* TEXTO CENTRAL */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asistencia</span>
                <span className="text-4xl font-black text-gray-900 leading-none my-1">
                  {data.attendancePercentage.toFixed(0)}%
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Efectividad</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-gray-500">Presentes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-gray-500">Ausentes</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Stats */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 size={20} className="text-formex-orange" />
              Detalle por Sesiones
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Clases</p>
                <p className="text-2xl font-black text-gray-900">{data.totalSessions}</p>
              </div>

              {/* Porcentaje Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Porcentaje</p>
                <p className="text-2xl font-black text-formex-orange">{data.attendancePercentage.toFixed(1)}%</p>
              </div>

              {/* Presentes Card */}
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4 group hover:bg-emerald-100 transition-colors">
                <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-700 leading-none">{data.presentes}</p>
                  <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Presente</p>
                </div>
              </div>

              {/* Ausentes Card */}
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm flex items-center gap-4 group hover:bg-red-100 transition-colors">
                <div className="w-12 h-12 bg-white text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <XCircle size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black text-red-700 leading-none">{data.ausentes}</p>
                  <p className="text-xs font-bold text-red-600/70 uppercase tracking-widest mt-1">Ausente</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 leading-relaxed italic">
                "La asistencia es clave para completar tus cursos al 100% y ganar los **100 puntos extra** de Formex."
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentAttendancePage;
