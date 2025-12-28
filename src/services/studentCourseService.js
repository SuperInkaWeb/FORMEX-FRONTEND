import api from './api';

const StudentCourseService = {
  getMyCourses() {
    return api.get('/api/student/courses');
  }
};

export default StudentCourseService;
