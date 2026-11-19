import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { API } from "./api";
import DepartmentList from "./components/DepartmentList";
import EmployeeList from "./components/EmployeeList";
import Dependents from "./components/Dependents";

// The page lives at http://localhost:3000 (route "/").
function CompanyPage() {
  const [employees, setEmployees] = useState([]);
  const [depId, setDepId] = useState(null);       // Q1 -> Q2
  const [selectedId, setSelectedId] = useState(null); // Q2 -> Q3

  useEffect(() => {
    fetch(`${API}/employees`).then((r) => r.json()).then(setEmployees);
  }, []);

  // Q3: after a successful PUT, replace the employee in the shared list
  const handleUpdated = (emp) =>
    setEmployees((list) => list.map((e) => (e.id === emp.id ? emp : e)));

  const selected = employees.find((e) => e.id === selectedId);

  return (
    <Container fluid className="py-3">
      <h1 className="text-center mb-4">COMPANY MANAGEMENT</h1>
      <Row>
        <Col md={3}>
          <DepartmentList employees={employees} onView={(id) => { setDepId(id); setSelectedId(null); }} activeId={depId} />
        </Col>
        <Col md={5}>
          {depId !== null && (
            <EmployeeList employees={employees.filter((e) => e.depId === depId)} onViewDependents={(e) => setSelectedId(e.id)} />
          )}
        </Col>
        <Col md={4}>
          {selected && <Dependents key={selected.id} employee={selected} onUpdated={handleUpdated} />}
        </Col>
      </Row>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CompanyPage />} />
    </Routes>
  );
}

export default App;
