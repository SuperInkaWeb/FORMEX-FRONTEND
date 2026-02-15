import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseService from "../../services/courseService";
import { Search, UserPlus, Loader } from "lucide-react";

const CourseEnrollStudentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await CourseService.getAllStudents();
      const data = Array.isArray(res) ? res : res.data;
      setStudents(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
      alert("Error cargando alumnos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const term = value.toLowerCase();

    setFiltered(
      students.filter(
        s =>
          s.fullName?.toLowerCase().includes(term) ||
          s.email?.toLowerCase().includes(term)
      )
    );
  };

  const handleEnroll = async (studentId) => {
    try {
      setEnrolling(studentId);
     await CourseService.enrollStudent(studentId, courseId);
      alert("✅ Alumno inscrito");
    } catch (e) {
      console.error(e);
      alert("❌ Error al inscribir");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Inscribir alumnos
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Volver
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar por nombre o correo"
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* LISTADO */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron alumnos
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map(student => (
            <div
              key={student.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <p className="font-semibold">{student.fullName}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>

              <button
                onClick={() => handleEnroll(student.id)}
                disabled={enrolling === student.id}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {enrolling === student.id ? (
                  "Inscribiendo..."
                ) : (
                  <>
                    <UserPlus size={16} />
                    Inscribir
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseEnrollStudentsPage;
