import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import SubjectList from './pages/SubjectList';
import BulkAttendance from './pages/BulkAttendance';

export default function App() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Attendance System</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/subjects">Subjects</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/subjects" replace />} />
          <Route path="/subjects" element={<SubjectList />} />
          <Route path="/subjects/:subjectId/attendance" element={<BulkAttendance />} />
        </Routes>
      </Container>
    </>
  );
}
