import { useState } from "react";
import { Table, Form, Button, Alert } from "react-bootstrap";
import { API } from "../api";

const RELATIONSHIPS = ["Wife", "Son", "Daughter", "Father", "Mother", "Father in law", "Mother in law"];

// today as "yyyy-mm-dd" in LOCAL time (an <input type="date"> value has the same format)
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Question 3 — dependents of the selected employee (parent passes key={employee.id})
function Dependents({ employee, onUpdated }) {
  const [form, setForm] = useState({ fullname: "", birthdate: "", relationship: "" });
  const [errors, setErrors] = useState([]);
  const deps = employee.dependents || [];

  const validate = () => {
    const errs = [];
    if (!form.fullname.trim()) errs.push("Fullname is required");
    if (!form.birthdate) errs.push("Birthdate is required");
    else if (form.birthdate >= todayStr()) errs.push("Birthdate must be before today");
    if (!form.relationship) errs.push("Please choose a relationship");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    const newDep = {
      id: deps.reduce((m, d) => Math.max(m, Number(d.id) || 0), 0) + 1,
      name: form.fullname.trim(),
      birthdate: form.birthdate,
      relationship: form.relationship,
    };
    const updated = { ...employee, dependents: [...deps, newDep] };
    const res = await fetch(`${API}/employees/${employee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    onUpdated(await res.json()); // update the UI immediately
    setForm({ fullname: "", birthdate: "", relationship: "" });
  };

  return (
    <div id="dependents">
      <h2>Dependents List</h2>
      <p className="mb-1"><b>{employee.fullname}</b></p>
      {deps.length === 0 ? (
        <p className="text-danger no-dependents">No dependents</p>
      ) : (
        <Table borderless size="sm">
          <thead><tr><th>No.</th><th>Name</th><th>Birthdate</th><th>Relationship</th></tr></thead>
          <tbody>
            {deps.map((d, i) => (
              <tr key={d.id} className="dependent-row"><td>{i + 1}</td><td>{d.name}</td><td>{d.birthdate}</td><td>{d.relationship}</td></tr>
            ))}
          </tbody>
        </Table>
      )}

      <h4 className="mt-3">Add new dependents</h4>
      {errors.length > 0 && (
        <Alert variant="danger" className="error-list">
          <ul className="mb-0">{errors.map((m) => <li key={m}>{m}</li>)}</ul>
        </Alert>
      )}
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Fullname</Form.Label>
          <Form.Control id="dep-fullname" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control id="dep-birthdate" type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Relationship</Form.Label>
          <Form.Select id="dep-relationship" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}>
            <option value="">--- Type of relationship ---</option>
            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Form.Select>
        </Form.Group>
        <Button id="dep-add" type="submit" variant="success">Add</Button>
      </Form>
    </div>
  );
}

export default Dependents;
