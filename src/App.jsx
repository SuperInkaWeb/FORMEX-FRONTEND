import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AttendancePage from './pages/instructor/AttendancePage';

// Páginas Públicas
import Home from './pages/main/Home';
import About from './pages/main/About';
import Blog from './pages/main/Blog';
import Faq from './pages/main/Faq';
import Support from './pages/main/Support';
import Testimonials from './pages/main/Testimonials';
import Benefits from './pages/main/Benefits';
import Catalog from './pages/courses/Catalog';
import CourseDetail from './pages/courses/CourseDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Páginas ADMIN
import AdminLayout from './pages/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import UsersManager from './pages/admin/UsersManager';
import CoursesManager from './pages/admin/CourseManager';
import CourseSessions from './pages/admin/CourseSessions.jsx';

// Páginas docente
import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import InstructorCourseSessions from "./pages/instructor/CourseSessions.jsx";
import CourseMaterials from "./pages/instructor/CourseMaterials.jsx"; // <-- NUEVA PÁGINA

// Páginas estudiante
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourseSessions from './pages/student/StudentCourseSessions';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/benefits" element={<Benefits />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Rutas ADMIN */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={['ROLE_ADMIN']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<DashboardHome />} />
                        <Route path="users" element={<UsersManager />} />
                        <Route path="courses" element={<CoursesManager />} />
                        <Route path="courses/:courseId/sessions" element={<CourseSessions />} />
                    </Route>

                    {/* Rutas INSTRUCTOR */}
                    <Route path="/instructor" element={
                        <ProtectedRoute roles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                            <InstructorDashboard />
                        </ProtectedRoute>
                    } />
                    {/* Rutas STUDENT */}
                    <Route path="/student" element={
                        <ProtectedRoute roles={['ROLE_STUDENT']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/instructor/course/:courseId/sessions" element={
                        <ProtectedRoute roles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                            <InstructorCourseSessions />
                        </ProtectedRoute>
                    } />

                    {/* Ruta de materiales */}
                    <Route path="/instructor/course/:courseId/session/:sessionId/materials" element={
                        <ProtectedRoute roles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                            <CourseMaterials />
                        </ProtectedRoute>
                    } />

                    {/* Ruta para ver asistencia */}
                    <Route path="/instructor/course/:courseId/attendance/:sessionId"element={
                        <ProtectedRoute roles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                            <AttendancePage />
                        </ProtectedRoute>
                    } />
                    <Route
                     path="/student/course/:courseId/sessions"
                   element={<StudentCourseSessions />}
                    />

                    {/* Ruta por defecto */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
