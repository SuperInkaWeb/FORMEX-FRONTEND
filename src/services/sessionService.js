import api from './api';

const SessionService = {
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
    deleteSession: async (id) => {
        const { data } = await api.delete(`/api/sessions/${id}`);
        return data;
    }
};

export default SessionService;