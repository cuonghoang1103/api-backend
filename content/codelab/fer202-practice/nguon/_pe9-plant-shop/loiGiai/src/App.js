import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import PlantManagement from "./pages/PlantManagement";
import OrderManagement from "./pages/OrderManagement";
import EmployeeManager from "./pages/EmployeeManager";

function App() {
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand as={NavLink} to="/plants">Plant Shop</Navbar.Brand>
          <Nav>
            <Nav.Link as={NavLink} to="/employees">Employees (Q1)</Nav.Link>
            <Nav.Link as={NavLink} to="/plants">Plant Management</Nav.Link>
            <Nav.Link as={NavLink} to="/orders">Order Management</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/plants" replace />} />
          <Route path="/plants" element={<PlantManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/employees" element={<EmployeeManager />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
