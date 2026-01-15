// React y Router
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Componentes globales
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthSync from "./components/AuthSync";
import ProtectedRoute from "./components/ProtectedRoute";

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
import PublicRouteGate from "./components/PublicRouteGate";


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
import CourseMaterials from "./pages/instructor/CourseMaterials";
import AttendancePage from "./pages/instructor/AttendancePage";
import InstructorCourseResources from "./pages/instructor/InstructorCourseResources";
import InstructorResourceForum from "./pages/instructor/ResourceForum";

function App() {
  const location = useLocation();

  // 🔹 Ocultar Navbar/Footer en admin e instructor
  const hideLayout =
  location.pathname.startsWith("/admin") ||
  location.pathname.startsWith("/instructor") ||
  location.pathname.startsWith("/student");
  return (
    <>
      <AuthSync /> {/* 🔹 Se ejecuta al iniciar sesión */}
      {!hideLayout && <Navbar />}
      <Routes>
        {/* Rutas públicas */}
        <Route
       path="/"
     element={
    <PublicRouteGate>
      <Home />
    </PublicRouteGate>
  }
/>
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/support" element={<Support />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/catalog" element={<Catalog />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="courses/:id/sessions" element={<CourseSessions />} />
          <Route path="courses/:courseId/students" element={<CourseStudentsPage />} /> 
          <Route path="courses/:courseId/enroll" element={<CourseEnrollStudentsPage />} />
        </Route>

        {/* Rutas protegidas para instructores */}
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
            <ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
              <InstructorCourseSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/course/:courseId/session/:sessionId/materials"
          element={
            <ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
              <CourseMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/course/:courseId/attendance/:sessionId"
          element={
            <ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/instructor/course/:courseId/resources"
       element={
       <ProtectedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
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
        {/* 🔹 Rutas protegidas para estudiantes */}
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
    </>
  );
}

export default App;
