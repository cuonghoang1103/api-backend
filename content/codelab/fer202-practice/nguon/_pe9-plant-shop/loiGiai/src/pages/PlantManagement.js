import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, Alert } from "react-bootstrap";
import api from "../api";

const EMPTY = { name: "", price: "", category: "", stock: "" };

// 2.4 Plant validation (returns { field: message })
export function validatePlant(f) {
  const e = {};
  if (!String(f.name).trim()) e.name = "Name is required.";
  if (f.price === "" || !(Number(f.price) > 0)) e.price = "Price must be greater than 0.";
  if (!String(f.category).trim()) e.category = "Category is required.";
  if (f.stock === "" || !(Number(f.stock) >= 0)) e.stock = "Stock must be greater than or equal to 0.";
  return e;
}

function PlantManagement() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 2.1 fetch /plants
  const loadPlants = async () => {
    const res = await api.get("/plants");
    setPlants(res.data);
  };
  useEffect(() => { loadPlants(); }, []);

  const change = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    // once an error is shown, re-check live so it disappears as soon as it is fixed
    if (errors[field]) setErrors(validatePlant(next));
  };

  // 2.2 Create / Update
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validatePlant(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
    };
    if (editingId) {
      await api.put(`/plants/${editingId}`, { ...payload, id: editingId });
      setMessage("Plant updated successfully.");
    } else {
      await api.post("/plants", payload);
      setMessage("Plant added successfully.");
    }
    setForm(EMPTY);
    setEditingId(null);
    loadPlants();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: String(p.price), category: p.category, stock: String(p.stock) });
    setEditingId(p.id);
    setErrors({});
  };

  const cancelEdit = () => { setForm(EMPTY); setEditingId(null); setErrors({}); };

  // 2.2 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plant?")) return;
    await api.delete(`/plants/${id}`);
    if (editingId === id) cancelEdit();
    setMessage("Plant deleted successfully.");
    loadPlants();
  };

  return (
    <div>
      <h3>Plant Management</h3>
      {message && (
        <Alert className="success-msg" variant="success" onClose={() => setMessage("")} dismissible>
          <i>{message}</i>
        </Alert>
      )}

      <h5>{editingId ? `Update Plant #${editingId}` : "Add Plant"}</h5>
      <Form noValidate onSubmit={handleSubmit} className="mb-4">
        <Row className="g-2 align-items-start">
          <Col md>
            <Form.Control id="plant-name" placeholder="Name" value={form.name} onChange={change("name")} isInvalid={!!errors.name} />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Col>
          <Col md>
            <Form.Control id="plant-price" type="number" placeholder="Price" value={form.price} onChange={change("price")} isInvalid={!!errors.price} />
            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
          </Col>
          <Col md>
            <Form.Control id="plant-category" placeholder="Category" value={form.category} onChange={change("category")} isInvalid={!!errors.category} />
            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
          </Col>
          <Col md>
            <Form.Control id="plant-stock" type="number" placeholder="Stock" value={form.stock} onChange={change("stock")} isInvalid={!!errors.stock} />
            <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
          </Col>
          <Col md="auto">
            <Button id="plant-submit" type="submit">{editingId ? "Update Plant" : "Add Plant"}</Button>
            {editingId && (
              <Button variant="secondary" className="ms-2" onClick={cancelEdit}>Cancel</Button>
            )}
          </Col>
        </Row>
      </Form>

      <h5>Plant List</h5>
      <Table id="plant-table" striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.id} id={`plant-row-${p.id}`} className="plant-row">
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.stock}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2 edit-btn" onClick={() => handleEdit(p)}>Edit</Button>
                <Button size="sm" variant="danger" className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PlantManagement;
