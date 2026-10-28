// src/App.js — khai báo MỌI route của CodeLearn ở một chỗ (nhìn là thấy cả sơ đồ trang)
//#<F1
// (STARTER) Bắt đầu từ F1: tạo Layout (navbar + footer), các trang và route 404.
export default function App() {
  return (
    <div className="container py-5">
      <h1>CodeLearn</h1>
      <p className="lead">Online programming courses — FER202 assignment starter.</p>
      <p>Start with <b>F1</b>: layout, routing and the 404 page. Run <code>npm run dev</code> to start React + json-server.</p>
    </div>
  );
}
//#end
//#F1
//#<F9
import { Route, Routes } from 'react-router-dom';
//#end
//#F9
import { Navigate, Route, Routes } from 'react-router-dom';
//#end
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import NotFoundPage from './pages/NotFoundPage';
//#F2
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './pages/admin/AdminLayout';
//#end
//#F4
import CourseDetailPage from './pages/CourseDetailPage';
//#end
//#F5
import MyCoursesPage from './pages/MyCoursesPage';
//#end
//#F6
import LearnPage from './pages/LearnPage';
//#end
//#F7
import QuizPage from './pages/QuizPage';
//#end
//#F8
import ProgressPage from './pages/ProgressPage';
//#end
//#F9
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import CourseFormPage from './pages/admin/CourseFormPage';
import CurriculumPage from './pages/admin/CurriculumPage';
//#end
//#F10
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
//#end
//#F11
import AdminStatsPage from './pages/admin/AdminStatsPage';
//#end

export default function App() {
  return (
    <Routes>
      {/* Layout chung: navbar + <Outlet /> + footer cho mọi trang */}
      <Route element={<Layout />}>
        {/* ── Khách (guest) xem được ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
//#F4
        <Route path="/courses/:id" element={<CourseDetailPage />} />
//#end
//#F2
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Phải đăng nhập (học viên) ── */}
        <Route element={<ProtectedRoute />}>
//#F5
          <Route path="/my-courses" element={<MyCoursesPage />} />
//#end
//#F6
          <Route path="/learn/:courseId" element={<LearnPage />} />
          <Route path="/learn/:courseId/lessons/:lessonId" element={<LearnPage />} />
//#end
//#F7
          <Route path="/quiz/:chapterId" element={<QuizPage />} />
//#end
//#F8
          <Route path="/progress" element={<ProgressPage />} />
//#end
        </Route>

        {/* ── Chỉ ADMIN — route lồng: AdminLayout có sidebar + <Outlet /> ── */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
//#F9
          <Route index element={<Navigate to="courses" replace />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="courses/new" element={<CourseFormPage />} />
          <Route path="courses/:id/edit" element={<CourseFormPage />} />
          <Route path="courses/:id/curriculum" element={<CurriculumPage />} />
//#end
//#F10
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
//#end
//#F11
          <Route path="stats" element={<AdminStatsPage />} />
//#end
        </Route>
//#end

        {/* Mọi đường dẫn không khớp ⇒ 404 (luôn để CUỐI) */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
//#end
