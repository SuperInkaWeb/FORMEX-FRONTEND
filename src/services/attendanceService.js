import api from './api';

const AttendanceService = {
  getAttendance: async (sessionId) => {
    const { data } = await api.get(`/api/sessions/${sessionId}/attendance`);
    return data;
  },

  // 🔥 RECIBE EL PAYLOAD COMPLETO
  postBatchAttendance: async (sessionId, payload) => {
    const { data } = await api.post(
      `/api/sessions/${sessionId}/attendance`,
      payload   // ✅ YA NO SE ENVUELVE
    );
    return data;
  },

  postSingleAttendance: async (sessionId, studentId, status) => {
    const { data } = await api.post(
      `/api/sessions/${sessionId}/attendance/${studentId}`,
      { status }
    );
    return data;
  },

  getAttendanceSummaryByCourse: async (courseId) => {
  const { data } = await api.get(
    `/api/student/courses/${courseId}/attendance-summary`
  );
  return data;
}
  
};


export default AttendanceService;
