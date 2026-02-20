import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CourseService from "../../services/courseService";
import CertificateService from "../../services/certificateService";

const CourseStudentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ===============================
     CARGAR ALUMNOS (AUTO REFRESH)
  ================================ */
  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await CourseService.getCourseStudents(courseId);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents(); // carga inicial

    const interval = setInterval(loadStudents, 5000); // cada 5s
    return () => clearInterval(interval);
  }, [courseId]);

  /* ===============================
     FILTRO BUSCADOR
  ================================ */
  const filteredStudents = students.filter(s =>
    (s.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(search.toLowerCase())
  );

const handlePaymentStatusChange = async (studentId, newStatus) => {
  try {
    await CourseService.updateStudentPaymentStatus(courseId, {
      studentId,
      status: newStatus,
    });

    setStudents(prev =>
      prev.map(s =>
        s.id === studentId ? { ...s, paymentStatus: newStatus } : s
      )
    );
  } catch (err) {
    console.error(err);
    alert("❌ Error al actualizar estado de pago");
  }
};


  /* ===============================
     CERTIFICADO
  ================================ */
  const handleGenerateCertificate = async (student) => {
    const percentage = Number(student.attendancePercentage ?? 0);

    if (percentage < 85) {
      alert("❌ El alumno no cumple el 85% de asistencia");
      return;
    }

    try {
      const res = await CertificateService.generateCertificate({
        studentId: student.id,
        fullName: student.fullName,
         courseId: Number(courseId), // ⭐ CLAVE
        courseName: student.courseName,
        attendancePercentage: percentage
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `certificado_${student.fullName}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("❌ Error al generar certificado");
    }
  };

  /* ===============================
     UI
  ================================ */
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Alumnos inscritos</h2>
        <button onClick={() => navigate(-1)}>← Volver</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-2">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      {loading ? (
        <p className="text-center">Cargando alumnos...</p>
      ) : (
        filteredStudents.map(student => {
          const percentage = Number(student.attendancePercentage ?? 0);

          return (
            <div
              key={student.id}
              className="flex justify-between items-center border p-3 mb-2 rounded"
            >
              <div>
                <p className="font-semibold">{student.fullName}</p>
                <p className="text-xs text-gray-500">{student.email}</p>
              </div>

              <select
  value={student.paymentStatus}
  onChange={e => handlePaymentStatusChange(student.id, e.target.value)}
  className="border px-3 py-2 bg-white"
>
  <option value="PENDING">⏳ Pendiente</option>
  <option value="PAID">✅ Pagado</option>
</select>

              <button
                disabled={percentage < 85}
                onClick={() => handleGenerateCertificate(student)}
                className={`px-3 py-2 rounded ${
                  percentage >= 85
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                🎓 Certificado
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CourseStudentsPage;
