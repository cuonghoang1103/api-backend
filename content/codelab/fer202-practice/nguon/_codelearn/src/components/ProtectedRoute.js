//@from F2
// src/components/ProtectedRoute.js — chặn route theo đăng nhập và vai trò
//   <Route element={<ProtectedRoute />}> … </Route>                    ⇒ phải đăng nhập
//   <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>      ⇒ phải là admin
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';

export default function ProtectedRoute({ role, children }) {
  const user = useSelector(selectUser);
  const location = useLocation();

  // Chưa đăng nhập ⇒ sang /login, NHỚ trang đang muốn vào (state.from) để đăng nhập xong quay lại.
  // replace: nút Back không đưa người dùng về trang bị chặn rồi bị đẩy đi lần nữa.
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // Đăng nhập rồi nhưng sai vai trò ⇒ 403 (không phải 404, không phải đá về /login)
  if (role && user.role !== role) {
    return (
      <Alert variant="danger" id="forbidden" className="mt-3">
        <Alert.Heading>403 — Access denied</Alert.Heading>
        <p className="mb-0">This page is for administrators only.</p>
      </Alert>
    );
  }

  return children ?? <Outlet />;
}
