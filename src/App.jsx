// React y Router
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Importamos hook de Auth0

// Componentes globales
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
// PublicRouteGate ya no es necesario si eliminamos las páginas locales de login

// Páginas principales
import Home from "./pages/main/Home";
import About from "./pages/main/About";
import Blog from "./pages/main/Blog";
import Faq from "./pages/main/Faq";
import Support from "./pages/main/Support";
import Testimonials from "./pages/main/Testimonials";
import Benefits from "./pages/main/Benefits";
import Catalog from "./pages/courses/Catalog";
import CourseDetail from "./pages/courses/CourseDetail";

// Páginas de estudiante
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendancePage from "./pages/student/StudentAttendancePage";
import StudentCourseResources from "./pages/student/StudentCourseResources";
import StudentCourseSessions from "./pages/student/StudentCourseSessions";
import StudentResourceForum from "./pages/student/ResourceForum";

// Páginas de admin
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import UsersManager from "./pages/admin/UsersManager";
import CoursesManager from "./pages/admin/CourseManager";
import CourseSessions from "./pages/admin/CourseSessions";
import CourseStudentsPage from "./pages/admin/CourseStudentsPage";
import CourseEnrollStudentsPage from "./pages/admin/CourseEnrollStudentsPage";

// Páginas de instructor
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourseSessions from "./pages/instructor/CourseSessions";
import InstructorCourseMaterials from "./pages/instructor/CourseMaterials";
import InstructorAttendancePage from "./pages/instructor/AttendancePage";
import InstructorCourseResources from "./pages/instructor/InstructorCourseResources";
import InstructorResourceForum from "./pages/instructor/ResourceForum";
import AuthCallback from "./components/AuthCallback.jsx";

// NOTA: Eliminamos los imports de Login, Register, ForgotPassword locales
// porque ahora usamos Auth0 Universal Login.

/**
 * Componente auxiliar para redirigir a Auth0 inmediatamente
 * Útil para mantener la ruta /login activa pero delegando a Auth0
 */
const Auth0Redirect = ({ screenHint }) => {
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        loginWithRedirect({
            authorizationParams: {
                screen_hint: screenHint // 'signup' lleva directo al registro
            }
        });
    }, [loginWithRedirect, screenHint]);

    return <div className="flex justify-center items-center h-screen">Redirigiendo a Auth0...</div>;
};

const App = () => {
    const location = useLocation();

    // Rutas donde NO queremos mostrar Navbar ni Footer
    const hideLayout =
  location.pathname.startsWith("/admin") ||
  location.pathname.startsWith("/student") ||
  location.pathname.startsWith("/instructor");



    return (
        <div className="flex flex-col min-h-screen">
            {/* Sincronizador Auth0 -> Backend */}


            {/* Navbar global */}
            {!hideLayout && <Navbar />}

            <div className="flex-grow">
                <Routes>
                    {/* 🔹 Rutas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/benefits" element={<Benefits />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/testimonials" element={<Testimonials />} />

                    {/* 🔹 Rutas de Autenticación (Redirección a Auth0) */}
                    <Route path="/login" element={<Auth0Redirect />} />
                    <Route path="/register" element={<Auth0Redirect screenHint="signup" />} />
                    {/* Punto de entrada de callback de Auth0 */}
                    <Route path="/callback" element={<AuthCallback />} />

                    {/* Las rutas de 'forgot-password' ahora se manejan en el propio widget de Auth0 */}

                    {/* 🔹 Rutas protegidas para Administradores */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardHome />} />
                        <Route path="users" element={<UsersManager />} />
                        <Route path="courses" element={<CoursesManager />} />
                        <Route path="courses/:courseId/sessions" element={<CourseSessions />} />
                        <Route path="courses/:courseId/students" element={<CourseStudentsPage />} />
                        <Route path="courses/:courseId/enroll" element={<CourseEnrollStudentsPage />} />
                    </Route>

                    {/* 🔹 Rutas protegidas para Instructores */}
                    <Route
                        path="/instructor"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
                                <InstructorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/course/:courseId/sessions"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
                                <InstructorCourseSessions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/course/:courseId/materials"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
                                <InstructorCourseMaterials />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/course/:courseId/attendance"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
                                <InstructorAttendancePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/course/:courseId/resources"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
                                <InstructorCourseResources />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/course/:courseId/resources/:resourceId/forum"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
                                <InstructorResourceForum />
                            </ProtectedRoute>
                        }
                    />

                    {/* 🔹 Rutas protegidas para Estudiantes */}
                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/course/:courseId/sessions"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentCourseSessions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/course/:courseId/resources"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentCourseResources />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/course/:courseId/attendance"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentAttendancePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/course/:courseId/resources/:resourceId/forum"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentResourceForum />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>

            {/* Footer global */}
            {!hideLayout && <Footer />}
        </div>
    );
};

export default App;

