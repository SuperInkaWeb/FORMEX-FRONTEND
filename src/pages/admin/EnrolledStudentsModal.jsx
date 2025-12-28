import React, { useEffect, useState } from 'react';
import CourseService from '../../services/courseService';

const EnrolledStudentsModal = ({ courseId, students, onClose }) => {

  const [payments, setPayments] = useState({});
  const [saving, setSaving] = useState(false);

  // Inicializar estados de pago
  useEffect(() => {
    if (students?.length > 0) {
      const initialPayments = {};
      students.forEach(s => {
         initialPayments[s.id] = s.paymentStatus || 'PENDING';
      });
      setPayments(initialPayments);
    }
  }, [students]);

  const handleSavePayments = async () => {
    try {
      setSaving(true);

      const payload = Object.entries(payments).map(
        ([studentId, paymentStatus]) => ({
          studentId: Number(studentId),
          paymentStatus
        })
      );

      await CourseService.updateStudentsPaymentStatus(courseId, payload);

      alert('✅ Estado de pago actualizado');
      onClose();
    } catch (error) {
      console.error(error);
      alert('❌ Error al guardar pagos');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Alumnos inscritos
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            Cerrar
          </button>
        </div>

        {students.length === 0 ? (
          <p className="text-gray-500 text-center">
            No hay alumnos inscritos
          </p>
        ) : (
          <>
            {students.map(student => (
              <div
                key={student.id}
                className="flex items-center justify-between border p-3 rounded-lg mb-2"
              >
                <div>
                  <p className="font-semibold">{student.fullName}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>

               <select
     value={payments[student.id]}
      onChange={(e) =>
    setPayments(prev => ({
      ...prev,
      [student.id]: e.target.value
    }))
    }
  className={`px-3 py-2 rounded-lg font-semibold text-sm border
    ${
      payments[student.id] === 'PAID'
        ? 'bg-green-50 text-green-700 border-green-300'
        : 'bg-yellow-50 text-yellow-700 border-yellow-300'
    }`}
    >
  <option value="PENDING">⏳ Pendiente</option>
  <option value="PAID">✅ Pagado</option>
   </select>

              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSavePayments}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsModal;
