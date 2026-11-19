import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import SneakerCollection from './pages/SneakerCollection';
import SneakerManagement from './pages/SneakerManagement';
import SneakerForm from './pages/SneakerForm';
import { ROLL } from './constants';

export default function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md">
        <Container>
          <Navbar.Brand>Sneaker Store</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to={`/${ROLL}/sneaker-collection`}>Sneaker Collection</Nav.Link>
            <Nav.Link as={NavLink} to={`/${ROLL}/sneaker-management`}>Sneaker Management</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Navigate to={`/${ROLL}/sneaker-collection`} replace />} />
          <Route path={`/${ROLL}/sneaker-collection`} element={<SneakerCollection />} />
          <Route path={`/${ROLL}/sneaker-management`} element={<SneakerManagement />} />
          <Route path={`/${ROLL}/add-sneaker`} element={<SneakerForm />} />
          <Route path={`/${ROLL}/edit-sneaker/:id`} element={<SneakerForm />} />
        </Routes>
      </Container>
    </>
  );
}