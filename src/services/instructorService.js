import api from './api';

const InstructorService = {
    // Obtener cursos creados por el instructor actual
    getMyCourses: async () => {
        // Necesitarás crear este endpoint en el backend:
        // @GetMapping("/instructor/courses") -> filtra por instructor_id = current_user_id
        // Por ahora, simularemos filtrando en el frontend o usando el endpoint general si el backend ya filtra por rol
        const { data } = await api.get('/api/public/courses');
        return data;
    },

    // Obtener estudiantes de un curso específico
    getCourseStudents: async (courseId) => {
        // Mock temporal hasta tener la tabla de matrículas
        return [
            { id: 1, name: "Estudiante 1", email: "e1@test.com", progress: 45 },
            { id: 2, name: "Estudiante 2", email: "e2@test.com", progress: 90 },
        ];
    }
};

export default InstructorService;