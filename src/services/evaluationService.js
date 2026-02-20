// services/evaluationService.js
import api from "./api";

const EvaluationService = {
  getByCourse: (courseId) =>
    api.get(`/api/courses/${courseId}/evaluations`)
      .then(r => r.data),

  create: (courseId, formData) =>
    api.post(
      `/api/courses/${courseId}/evaluations`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    ),

  delete: (courseId, id) =>
    api.delete(`/api/courses/${courseId}/evaluations/${id}`),

  // 🔥 nuevo método para descargar PDF
  download: (evaluationId) =>
    api.get(`/api/evaluations/${evaluationId}/download`, {
      responseType: "blob"
    })
};

export default EvaluationService;
