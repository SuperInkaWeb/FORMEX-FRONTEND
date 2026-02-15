import api from './api';

const AdminService = {
    getAllUsers: async () => {
        const { data } = await api.get('/api/admin/users');
        return data;
    },
    createUser: async (userData) => {
        const { data } = await api.post('/api/admin/users', userData);
        return data;
    },
    updateUser: async (id, userData) => {
        const { data } = await api.put(`/api/admin/users/${id}`, userData);
        return data;
    },
    deleteUser: async (id) => {
        // Soft delete
        const { data } = await api.delete(`/api/admin/users/${id}`);
        return data;
    },
    reactivateUser: async (id) => {
        // Reactivar usuario manualmente
        const { data } = await api.put(`/api/admin/users/${id}`, { enabled: true });
        return data;
    }
    ,
    assignCourse: async (userId, courseId) => {
        const { data } = await api.put(`/api/admin/users/${userId}/assign-course/${courseId}`);
        return data;
    }
};

export default AdminService;