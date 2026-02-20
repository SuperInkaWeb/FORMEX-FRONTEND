import api from './api';

const CourseService = {

  /* =========================
     CATEGORÍAS / CURSOS
  ========================== */

  getCategories: async () => {
    const { data } = await api.get('/api/public/categories');
    return data;
  },

  getAllCourses: async () => {
    const { data } = await api.get('/api/public/courses');
    return data;
  },

  getInstructorCourses: async () => {
    const { data } = await api.get('/api/instructor/courses');
    return data;
  },

  getCourseById: async (id) => {
    const { data } = await api.get(`/api/public/courses/${id}`);
    return data;
  },

  /* =========================
     ALUMNOS INSCRITOS (VER)
  ========================== */

  getCourseStudents: async (courseId) => {
    const { data } = await api.get(`/api/courses/${courseId}/students`);
    return data;
  },
  updateStudentPaymentStatus: async (courseId, payload) => {
  const { data } = await api.put(`/api/courses/${courseId}/payments/status`, payload);
  return data;
},

  /* =========================
     🔥 INSCRIBIR ALUMNOS
  ========================== */

  getAllStudents: async () => {
    const { data } = await api.get('/api/students');
    return data;
  },

  enrollStudent: async (studentId, courseId) => {
    const { data } = await api.put(
      `/api/admin/users/${studentId}/assign-course/${courseId}`
    );
    return data;
  },

    // 🔹 NUEVO: Desinscribir alumno de un curso
  unenrollStudent: async (studentId, courseId) => {
  const { data } = await api.delete(
    `/api/students/courses/${courseId}/students/${studentId}`
  );
  return data;
  },

  /* =========================
     CRUD CURSO
  ========================== */

  createCourse: async (courseData) => {
    const { data } = await api.post('/api/courses', courseData);
    return data;
  },

  updateCourse: async (id, courseData) => {
    const { data } = await api.put(`/api/courses/${id}`, courseData);
    return data;
  },

  deleteCourse: async (id) => {
    const { data } = await api.delete(`/api/courses/${id}`);
    return data;
  },

  updateStudentsPaymentStatus: async (courseId, payload) => {
    const { data } = await api.put(`/api/courses/${courseId}/payments`, payload);
    return data;
  },

  /* =========================
     📅 SESIONES / CLASES
  ========================== */

  getSessionsByCourse: async (courseId) => {
  const { data } = await api.get(`/api/public/courses/${courseId}/sessions`);
  return data;
},


  createSession: async (sessionData) => {
    const { data } = await api.post('/api/sessions', sessionData);
    return data;
  },

  updateSession: async (sessionId, sessionData) => {
    const { data } = await api.put(`/api/sessions/${sessionId}`, sessionData);
    return data;
  },

  deleteSession: async (sessionId) => {
    const { data } = await api.delete(`/api/sessions/${sessionId}`);
    return data;
  }
};

export default CourseService;
