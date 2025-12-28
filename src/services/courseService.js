import api from './api';

const CourseService = {
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
    getCourseStudents: async (courseId) => {
        try {
            const { data } = await api.get(`/api/instructor/courses/${courseId}/students`);
            return data;
        } catch (err) {
            // If instructor endpoint is forbidden, try admin-scoped endpoint as fallback
            const status = err?.response?.status;
            if (status === 403) {
                const { data } = await api.get(`/api/admin/users/instructor/courses/${courseId}/students`);
                return data;
            }
            throw err;
        }
    },
    
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
    
      updateStudentsPaymentStatus(courseId, payload) {
      return api.put(
      `/api/courses/${courseId}/payments`,
    payload
  );
}


};

export default CourseService;