import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col, Alert } from "react-bootstrap";
import api from "../api";

const EMPTY = { customerName: "", plantId: "", quantity: "" };

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const load = async () => {
    const [o, p] = await Promise.all([api.get("/orders"), api.get("/plants")]);
    setOrders(o.data);
    setPlants(p.data); // needed for the <select> and for the name mapping
  };
  useEffect(() => { load(); }, []);

  // 2.3 mapping plantId -> plant
  const findPlant = (id) => plants.find((x) => String(x.id) === String(id));

  // 2.4 Order validation (+ bonus: quantity must not exceed stock)
  const validate = (f) => {
    const e = {};
    if (!f.customerName.trim()) e.customerName = "Customer name is required.";
    if (!f.plantId) e.plantId = "Please select a plant.";
    if (f.quantity === "" || !(Number(f.quantity) > 0)) e.quantity = "Quantity must be greater than 0.";
    else {
      const p = findPlant(f.plantId);
      if (p && Number(f.quantity) > p.stock) e.quantity = `Quantity exceeds stock (only ${p.stock} left).`;
    }
    return e;
  };

  const change = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    if (errors[field]) setErrors(validate(next));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    const plant = findPlant(form.plantId);
    const quantity = Number(form.quantity);
    await api.post("/orders", {
      customerName: form.customerName.trim(),
      plantId: plant.id, // keep the same type as plants.id
      quantity,
    });
    // bonus: reduce plant stock when an order is created
    await api.patch(`/plants/${plant.id}`, { stock: plant.stock - quantity });
    setForm(EMPTY);
    setMessage("Order added successfully.");
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    setMessage("Order deleted successfully.");
    load();
  };

  return (
    <div>
      <h3>Order Management</h3>
      {message && (
        <Alert className="success-msg" variant="success" onClose={() => setMessage("")} dismissible>{message}</Alert>
      )}

      <h5>Add Order</h5>
      <Form noValidate onSubmit={handleSubmit} className="mb-4">
        <Row className="g-2 align-items-start">
          <Col md>
            <Form.Control id="order-customer" placeholder="Customer Name" value={form.customerName} onChange={change("customerName")} isInvalid={!!errors.customerName} />
            <Form.Control.Feedback type="invalid">{errors.customerName}</Form.Control.Feedback>
          </Col>
          <Col md>
            <Form.Select id="order-plant" value={form.plantId} onChange={change("plantId")} isInvalid={!!errors.plantId}>
              <option value="">-- Select Plant --</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (stock: {p.stock})</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.plantId}</Form.Control.Feedback>
          </Col>
          <Col md>
            <Form.Control id="order-quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={change("quantity")} isInvalid={!!errors.quantity} />
            <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
          </Col>
          <Col md="auto">
            <Button id="order-submit" type="submit">Add Order</Button>
          </Col>
        </Row>
      </Form>

      <h5>Order List</h5>
      <Table id="order-table" striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Customer Name</th><th>Plant Name</th><th>Quantity</th><th>Total Price</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const p = findPlant(o.plantId);
            return (
              <tr key={o.id} id={`order-row-${o.id}`} className="order-row">
                <td>{o.id}</td>
                <td>{o.customerName}</td>
                <td className="order-plant-name">{p ? p.name : "Unknown"}</td>
                <td>{o.quantity}</td>
                <td className="order-total">{p ? p.price * o.quantity : "-"}</td>
                <td>
                  <Button size="sm" variant="danger" className="order-delete" onClick={() => handleDelete(o.id)}>Delete</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderManagement;
