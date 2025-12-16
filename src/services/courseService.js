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
    getCourseById: async (id) => {
        const { data } = await api.get(`/api/public/courses/${id}`);
        return data;
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
};

export default CourseService;