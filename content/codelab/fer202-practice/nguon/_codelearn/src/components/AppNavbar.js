//@from F1
// src/components/AppNavbar.js — thanh điều hướng; NavLink tự gắn class "active" cho trang đang mở
//#<F2
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
//#end
//#F2
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout, selectUser } from '../features/auth/authSlice';
//#end

export default function AppNavbar() {
//#F2
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isStudent = user?.role === 'student';

  const handleLogout = () => {
    dispatch(logout());          // store.subscribe (app/store.js) sẽ xoá localStorage
    navigate('/', { replace: true });
  };

//#end
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" id="brand">💻 CodeLearn</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {/* end: "/" chỉ active đúng ở trang chủ, không active ở mọi trang */}
            <Nav.Link as={NavLink} to="/" end id="nav-home">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/courses" id="nav-courses">Courses</Nav.Link>
//#F5
            {isStudent && <Nav.Link as={NavLink} to="/my-courses" id="nav-my-courses">My Courses</Nav.Link>}
//#end
//#F8
            {isStudent && <Nav.Link as={NavLink} to="/progress" id="nav-progress">My Progress</Nav.Link>}
//#end
//#F2
            {user?.role === 'admin' && <Nav.Link as={NavLink} to="/admin" id="nav-admin">Admin</Nav.Link>}
//#end
          </Nav>
//#F2
          <Nav className="align-items-md-center gap-2">
            {user ? (
              <>
                <Navbar.Text id="nav-user">Hi, {user.fullName}</Navbar.Text>
                <Button id="logout-btn" size="sm" variant="outline-light" onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" id="nav-login">Log in</Nav.Link>
                <Nav.Link as={NavLink} to="/register" id="nav-register">Register</Nav.Link>
              </>
            )}
          </Nav>
//#end
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
