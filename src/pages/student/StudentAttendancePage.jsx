import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AttendanceService from '../../services/attendanceService';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

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
  return <div className="text-center py-20">Cargando asistencia...</div>;
}

if (!data) {
  return <div className="text-center py-20">Sin datos</div>;
}


  const chartData = [
    { name: 'Asistió', value: data.presentes },
    { name: 'Faltó', value: data.ausentes }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
              to={`/student/course/${courseId}/sessions`}
              className="p-2 hover:bg-gray-100 rounded-full"
           >

            <ArrowLeft />
          </Link>
          <h1 className="text-xl font-bold">Mis Asistencias</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 flex flex-col items-center">

        <h2 className="text-lg font-bold mb-6">
          Resumen General de Asistencias
        </h2>

        {/* GRÁFICO */}
        <div className="relative">
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          {/* TEXTO CENTRAL */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-500">Total</p>
            <p className="text-3xl font-bold">{data.totalSessions}</p>
            <p className="text-green-600 font-bold">
              {data.attendancePercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* DETALLE */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-green-600 font-bold text-xl">
              {data.presentes}
            </p>
            <p className="text-gray-500">Asistencias</p>
          </div>
          <div className="text-center">
            <p className="text-red-500 font-bold text-xl">
              {data.ausentes}
            </p>
            <p className="text-gray-500">Inasistencias</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentAttendancePage;
