import api from './api';

const ResourceService = {

    // 🔹 Obtener recursos por curso
    getByCourse(courseId) {
        return api
            .get(`/api/instructor/courses/${courseId}/resources`)
            .then(res => res.data);
    },

    // 🔹 Crear recurso en un curso
    create(courseId, resource) {
        return api
            .post(`/api/instructor/courses/${courseId}/resources`, resource)
            .then(res => res.data);
    },

    // 🔹 Eliminar recurso
    delete(courseId, resourceId) {
        return api
            .delete(`/api/instructor/courses/${courseId}/resources/${resourceId}`);
    }
};

export default ResourceService;
