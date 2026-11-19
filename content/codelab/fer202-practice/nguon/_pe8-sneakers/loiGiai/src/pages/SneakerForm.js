import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { getSneaker, createSneaker, updateSneaker } from '../api';
import { CATEGORIES, validateSneaker } from '../utils';
import { ROLL } from '../constants';

const EMPTY = {
  sneakerName: '',
  brandName: '',
  sneakerCategory: '', // empty by default: the user has to pick one
  sneakerImageUrl: '',
  retailPriceK: '',
  isLimitedEdition: false, // switch, default false
};

// One component for both /add-sneaker and /edit-sneaker/:id
export default function SneakerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY);
      return;
    }
    // Pre-fill the edit form with the selected sneaker's current data
    getSneaker(id).then((s) =>
      setForm({
        sneakerName: s.sneakerName,
        brandName: s.brandName,
        sneakerCategory: s.sneakerCategory,
        sneakerImageUrl: s.sneakerImageUrl,
        retailPriceK: String(s.retailPriceK),
        isLimitedEdition: Boolean(s.isLimitedEdition),
      })
    );
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSneaker(form); // same rules for Add and Edit
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      sneakerName: form.sneakerName.trim(),
      brandName: form.brandName.trim(),
      sneakerCategory: form.sneakerCategory,
      sneakerImageUrl: form.sneakerImageUrl.trim(),
      retailPriceK: Number(form.retailPriceK), // store a Number, as in the schema
      isLimitedEdition: form.isLimitedEdition, // store a Boolean
    };

    if (isEdit) {
      await updateSneaker(id, payload); // PUT /:id
      alert('Sneaker updated successfully!');
    } else {
      await createSneaker(payload); // POST
      alert('Sneaker added successfully!');
    }
    navigate(`/${ROLL}/sneaker-management`); // the table re-fetches and shows the new data
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 600 }}>
      <Card.Body>
        <Card.Title className="mb-3 form-title">{isEdit ? 'Edit Sneaker' : 'Add Sneaker'}</Card.Title>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Sneaker Name</Form.Label>
            <Form.Control id="sneakerName" name="sneakerName" value={form.sneakerName} onChange={handleChange} isInvalid={!!errors.sneakerName} />
            <Form.Control.Feedback type="invalid">{errors.sneakerName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control id="brandName" name="brandName" value={form.brandName} onChange={handleChange} isInvalid={!!errors.brandName} />
            <Form.Control.Feedback type="invalid">{errors.brandName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sneaker Category</Form.Label>
            <Form.Select id="sneakerCategory" name="sneakerCategory" value={form.sneakerCategory} onChange={handleChange} isInvalid={!!errors.sneakerCategory}>
              <option value="">-- Select a category --</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.sneakerCategory}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control id="sneakerImageUrl" name="sneakerImageUrl" value={form.sneakerImageUrl} onChange={handleChange} isInvalid={!!errors.sneakerImageUrl} />
            <Form.Control.Feedback type="invalid">{errors.sneakerImageUrl}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Retail Price (thousand VND)</Form.Label>
            <Form.Control id="retailPriceK" name="retailPriceK" value={form.retailPriceK} onChange={handleChange} isInvalid={!!errors.retailPriceK} />
            <Form.Control.Feedback type="invalid">{errors.retailPriceK}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="isLimitedEdition"
              name="isLimitedEdition"
              label="Limited Edition"
              checked={form.isLimitedEdition}
              onChange={handleChange}
            />
          </Form.Group>

          <Button id="save-sneaker" type="submit" variant="primary" className="me-2">{isEdit ? 'Update' : 'Add'}</Button>
          <Button variant="secondary" onClick={() => navigate(`/${ROLL}/sneaker-management`)}>Cancel</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}