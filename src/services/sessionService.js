import api from './api';

const SessionService = {
  // 📌 Listar sesiones públicas de un curso
  // BACKEND: GET /api/public/courses/{courseId}/sessions
  getSessionsByCourse: async (courseId) => {
    const { data } = await api.get(
      `/api/public/courses/${courseId}/sessions`
    );
    return data;
  },

  // 📌 Crear sesión (ADMIN o INSTRUCTOR)
  // BACKEND: POST /api/sessions
  createSession: async (sessionData) => {
    const { data } = await api.post(
      '/api/sessions',
      sessionData
    );
    return data;
  },

  // 📌 Actualizar sesión (ADMIN o INSTRUCTOR)
  // BACKEND: PUT /api/sessions/{id}
  updateSession: async (id, sessionData) => {
    const { data } = await api.put(
      `/api/sessions/${id}`,
      sessionData
    );
    return data;
  },

  // 📌 Eliminar sesión (soft delete)
  // BACKEND: DELETE /api/sessions/{id}
  deleteSession: async (id) => {
    const { data } = await api.delete(
      `/api/sessions/${id}`
    );
    return data;
  }
};

export default SessionService;
