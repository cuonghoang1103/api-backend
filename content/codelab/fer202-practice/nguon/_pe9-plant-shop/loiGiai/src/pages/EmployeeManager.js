import { useState } from "react";
import { Container, Row, Col, Table, Card, Button, Badge } from "react-bootstrap";
import { employees } from "../data/employees";

function EmployeeManager() {
  // Selected employee shown in the detail area (null = nothing selected yet)
  const [selected, setSelected] = useState(null);

  return (
    <Container className="my-4">
      <Row>
        {/* 1.1 LEFT: Employee List */}
        <Col md={8}>
          <h4>Employee List</h4>
          <Table id="employee-table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th><th>Full Name</th><th>Position</th>
                <th>Department</th><th>Salary</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e)}
                  id={`employee-row-${e.id}`}
                  className={`employee-row ${selected?.id === e.id ? "table-primary" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <td>{e.id}</td>
                  <td>{e.fullName}</td>
                  <td>{e.position}</td>
                  <td>{e.department}</td>
                  <td>${e.salary}</td>
                  <td>
                    <Badge bg={e.status === "Active" ? "success" : "secondary"}>{e.status}</Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="primary"
                      className="view-detail"
                      onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}
                    >
                      View Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* 1.2 RIGHT: Employee Detail (separate area) */}
        <Col md={4}>
          <h4>Employee Detail</h4>
          {selected ? (
            <Card id="employee-detail">
              <Card.Body>
                <Row className="g-2">
                  <Col xs={6}><b>ID:</b> {selected.id}</Col>
                  <Col xs={6}><b>Full Name:</b> {selected.fullName}</Col>
                  <Col xs={6}><b>Position:</b> {selected.position}</Col>
                  <Col xs={6}><b>Department:</b> {selected.department}</Col>
                  <Col xs={6}><b>Salary:</b> ${selected.salary}</Col>
                  <Col xs={6}><b>Status:</b> {selected.status}</Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <p className="text-muted detail-placeholder">Please select an employee.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EmployeeManager;
