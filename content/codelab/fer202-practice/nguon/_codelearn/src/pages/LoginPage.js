//@from F2
// src/pages/LoginPage.js — đăng nhập: kiểm form phía client trước, rồi mới gọi thunk login
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { clearAuthError, login, selectUser } from '../features/auth/authSlice';
import { validateLogin } from '../utils/validators';

export default function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // lỗi của lần đăng nhập trước (hay của trang Register) không hiện lại khi mở trang
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Đã đăng nhập (vừa xong, hoặc gõ /login khi đang có phiên) ⇒ về trang định vào trước đó,
  // không có thì admin ⇒ /admin, học viên ⇒ trang chủ. Điều hướng bằng render <Navigate> nên không "đua" với thunk.
  if (user) {
    const from = location.state?.from;
    const back = from ? `${from.pathname}${from.search ?? ''}` : user.role === 'admin' ? '/admin' : '/';
    return <Navigate to={back} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));   // gõ lại ô nào thì tắt lỗi ô đó
  };

  const handleSubmit = (e) => {
    e.preventDefault();                                   // SPA: không cho trình duyệt tải lại trang
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;            // còn lỗi ⇒ KHÔNG gọi API
    dispatch(login(form));
  };

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 420 }}>
      <Card.Body className="p-4">
        <h2 className="mb-3">Log in</h2>
        {error && <Alert variant="danger" id="login-error">{error}</Alert>}
        <Form id="login-form" noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} placeholder="you@example.com" />
            <Form.Control.Feedback type="invalid" id="email-error">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} isInvalid={!!errors.password} />
            <Form.Control.Feedback type="invalid" id="password-error">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" id="login-btn" className="w-100" disabled={status === 'loading'}>
            {status === 'loading' ? <Spinner size="sm" animation="border" /> : 'Log in'}
          </Button>
        </Form>
        <p className="mt-3 mb-0 small text-center">
          No account yet? <Link to="/register" id="to-register">Register</Link>
        </p>
      </Card.Body>
    </Card>
  );
}
