import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { API } from "../api";

// Question 1 — Department List
function DepartmentList({ employees, onView, activeId }) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch(`${API}/departments`).then((r) => r.json()).then(setDepartments);
  }, []);

  // manager full name: look up managerId in employees
  const managerName = (managerId) => {
    const m = employees.find((e) => String(e.id) === String(managerId));
    return m ? m.fullname : "";
  };

  return (
    <div>
      <h2>Department List</h2>
      <Table borderless id="department-table">
        <thead>
          <tr><th>DepName</th><th>Manager</th><th>Employees</th></tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id} id={`dep-row-${d.id}`} className="department-row">
              <td>{d.depName}</td>
              <td className="manager-name">{managerName(d.managerId)}</td>
              <td>
                <Button className="view-btn" variant={activeId === d.id ? "success" : "info"} onClick={() => onView(d.id)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DepartmentList;
