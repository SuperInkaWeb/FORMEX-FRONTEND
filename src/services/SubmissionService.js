import api from './api';

const SubmissionService = {
  getByEvaluation: (courseId, evaluationId) =>
    api.get(`/api/courses/${courseId}/evaluations/${evaluationId}/submissions`)
       .then(res => res.data),

  create: (courseId, evaluationId, formData) =>
    api.post(
      `/api/courses/${courseId}/evaluations/${evaluationId}/submissions`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),

  delete: (courseId, evaluationId, submissionId) =>
    api.delete(
      `/api/courses/${courseId}/evaluations/${evaluationId}/submissions/${submissionId}`
    ),

  // 🔥 NUEVO – DESCARGA SEGURA
  download: (courseId, evaluationId, submissionId) =>
    api.get(
      `/api/courses/${courseId}/evaluations/${evaluationId}/submissions/download/${submissionId}`,
      { responseType: 'blob' }
    ),

    grade: (courseId, evaluationId, submissionId, grade) =>
    api.put(
      `/api/courses/${courseId}/evaluations/${evaluationId}/submissions/${submissionId}/grade`,
      null,
      { params: { grade } }
    )

    
};



export default SubmissionService;
