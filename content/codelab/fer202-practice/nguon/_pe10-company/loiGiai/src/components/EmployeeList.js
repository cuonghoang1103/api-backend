import { useEffect, useState } from "react";
import { Accordion, Table, Button } from "react-bootstrap";
import { API } from "../api";

// salary = floor(empSalary / 176 * workHours)
export const salaryOf = (emp, w) => Math.floor((emp.empSalary / 176) * w.workHours);
export const vnd = (n) => n.toLocaleString("vi-VN"); // 4261363 -> "4.261.363"

// Question 2 — employees of the chosen department + project work
function EmployeeList({ employees, onViewDependents }) {
  const [projects, setProjects] = useState([]);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetch(`${API}/projects`).then((r) => r.json()).then(setProjects);
    fetch(`${API}/works`).then((r) => r.json()).then(setWorks);
  }, []);

  const projectName = (pid) => projects.find((p) => p.id === pid)?.projectName ?? "";

  return (
    <div>
      <h2>Employee List</h2>
      {employees.length === 0 && <p className="text-muted">No employees</p>}
      <Accordion id="employee-accordion" defaultActiveKey="0">
        {employees.map((emp, idx) => {
          const ws = works.filter((w) => w.employeeId === emp.id);
          const total = ws.reduce((s, w) => s + salaryOf(emp, w), 0);
          return (
            <Accordion.Item eventKey={String(idx)} key={emp.id} id={`emp-item-${emp.id}`} className="employee-item">
              <Accordion.Header className="employee-header">
                <b>#{idx + 1} - {emp.fullname}</b>
                {emp.supervisorId === null && <b className="text-primary">&nbsp;- Manager</b>}
              </Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>EmployeeId: {emp.id}</li>
                  <li>Gender: {emp.gender}</li>
                  <li>BirthDate: {emp.birthdate}</li>
                </ul>
                <Button className="view-dependents" onClick={() => onViewDependents(emp)}>View Dependents</Button>
                <h6 className="mt-3">Work on projects</h6>
                <Table borderless size="sm">
                  <thead>
                    <tr><th>WorkId</th><th>Project name</th><th>Work hours</th><th>Salary (VND)</th></tr>
                  </thead>
                  <tbody>
                    {ws.length === 0 && (<tr><td colSpan={4} className="text-muted">No projects</td></tr>)}
                    {ws.map((w) => (
                      <tr key={w.id} className="work-row">
                        <td>{w.id}</td>
                        <td>{projectName(w.projectId)}</td>
                        <td>{w.workHours}</td>
                        <td className="work-salary">{vnd(salaryOf(emp, w))}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="p-2 fw-bold projects-salary" style={{ background: "#cfe2ff" }}>
                  Projects Salary: {vnd(total)} VND
                </div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}

export default EmployeeList;
