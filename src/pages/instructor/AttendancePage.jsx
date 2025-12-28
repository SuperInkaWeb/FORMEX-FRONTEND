import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CourseService from '../../services/courseService';
import AttendanceService from '../../services/attendanceService';
const AttendancePage = () => {
  const { courseId, sessionId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
 useEffect(() => {
  const loadAttendance = async () => {
    try {
      const data = await AttendanceService.getAttendance(sessionId);
         setStudents(data.students);

      const initialAttendance = {};
      data.students.forEach(s => {
        initialAttendance[s.studentId] = s.status || 'PRESENT';
      });

      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error cargando asistencia', error);
    } finally {
      setLoading(false);
    }
  };

  loadAttendance();
}, [sessionId]);

  const handleChange = (studentId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        attendance: Object.entries(attendance).map(
          ([studentId, status]) => ({
            studentId: Number(studentId),
            status, // PRESENT | ABSENT
          })
        ),
      };

      await AttendanceService.postBatchAttendance(sessionId, payload);

      alert('✅ Asistencia guardada correctamente');
    } catch (error) {
      console.error(error);
      alert('❌ Error al guardar asistencia');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando alumnos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <div className="flex items-center justify-between mb-6">
         <Link
           to={`/instructor/course/${courseId}/sessions`}
              className="text-sm text-gray-500 hover:text-orange-500 font-medium"
           >
          ← Volver
           </Link>
 
          <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold">
            Sesión {sessionId}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Control de Asistencia
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay alumnos inscritos.
          </p>
        ) : (
          <>
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">
                      Alumno
                    </th>
                    <th className="text-center px-6 py-3 font-semibold text-gray-600">
                      Asistencia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId} className="border-t">
                      <td className="px-6 py-4 text-gray-800">
                             {student.fullName} 
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={attendance[student.studentId]}
                         onChange={(e) => handleChange(student.studentId, e.target.value)}
                         className={`px-4 py-2 rounded-lg border font-semibold text-sm ${
                          attendance[student.studentId] === 'PRESENT'
                          ? 'bg-green-50 border-green-300 text-green-700'
                              : 'bg-red-50 border-red-300 text-red-600'
                           }`}
                          >
                           <option value="PRESENT">✅ PRESENTE</option>
                            <option value="ABSENT">❌ AUSENTE</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold shadow-md"
              >
                {saving ? 'Guardando...' : 'Guardar Asistencia'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
