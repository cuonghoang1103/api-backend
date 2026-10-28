//@from F2
// src/pages/admin/AdminLayout.js — khung khu quản trị (route lồng: các trang admin hiện ở <Outlet />)
//#<F9
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <>
      <h2 id="admin-title">Admin dashboard</h2>
      <p className="text-muted">Course, quiz and user management arrive in F9–F11.</p>
      <Outlet />
    </>
  );
}
//#end
//#F9
import { Col, Nav, Row } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <Row>
      <Col md={3} lg={2} className="mb-3">
        <div className="admin-sidebar bg-white rounded-3 shadow-sm p-2">
          <div className="fw-bold small text-uppercase text-muted px-2 py-1">Admin</div>
          <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/admin/courses" id="admin-nav-courses">Courses</Nav.Link>
//#F10
            <Nav.Link as={NavLink} to="/admin/questions" id="admin-nav-questions">Quiz questions</Nav.Link>
            <Nav.Link as={NavLink} to="/admin/users" id="admin-nav-users">Users</Nav.Link>
//#end
//#F11
            <Nav.Link as={NavLink} to="/admin/stats" id="admin-nav-stats">Statistics</Nav.Link>
//#end
          </Nav>
        </div>
      </Col>
      <Col md={9} lg={10}>
        <Outlet />
      </Col>
    </Row>
  );
}
//#end
