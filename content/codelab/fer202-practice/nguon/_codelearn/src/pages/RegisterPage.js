//@from F2
// src/pages/RegisterPage.js — đăng ký học viên mới: 4 luật kiểm + chặn email trùng (hỏi máy chủ)
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { clearAuthError, register, selectUser } from '../features/auth/authSlice';
import { validateRegister } from '../utils/validators';

const EMPTY = { fullName: '', email: '', password: '', confirmPassword: '' };
const FIELDS = [
  ['fullName', 'Full name', 'text'],
  ['email', 'Email', 'email'],
  ['password', 'Password', 'password'],
  ['confirmPassword', 'Confirm password', 'password'],
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Đăng ký thành công = đã đăng nhập (thunk trả user) ⇒ về trang chủ
  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    dispatch(register(form));    // email trùng ⇒ thunk rejectWithValue ⇒ #register-error
  };

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 460 }}>
      <Card.Body className="p-4">
        <h2 className="mb-3">Create your account</h2>
        {error && <Alert variant="danger" id="register-error">{error}</Alert>}
        <Form id="register-form" noValidate onSubmit={handleSubmit}>
          {FIELDS.map(([name, label, type]) => (
            <Form.Group className="mb-3" controlId={name} key={name}>
              <Form.Label>{label}</Form.Label>
              <Form.Control type={type} name={name} value={form[name]} onChange={handleChange} isInvalid={!!errors[name]} />
              <Form.Control.Feedback type="invalid" id={`${name}-error`}>{errors[name]}</Form.Control.Feedback>
            </Form.Group>
          ))}
          <Button type="submit" id="register-btn" className="w-100" disabled={status === 'loading'}>
            {status === 'loading' ? <Spinner size="sm" animation="border" /> : 'Register'}
          </Button>
        </Form>
        <p className="mt-3 mb-0 small text-center">
          Already have an account? <Link to="/login" id="to-login">Log in</Link>
        </p>
      </Card.Body>
    </Card>
  );
}
