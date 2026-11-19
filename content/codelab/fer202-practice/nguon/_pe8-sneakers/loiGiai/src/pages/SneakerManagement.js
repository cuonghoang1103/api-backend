import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Alert } from 'react-bootstrap';
import { getSneakers, deleteSneaker } from '../api';
import { byIdAsc } from '../utils';
import { ROLL } from '../constants';

export default function SneakerManagement() {
  const [sneakers, setSneakers] = useState([]);
  const [message, setMessage] = useState('');

  const loadSneakers = () =>
    getSneakers().then((data) => setSneakers([...data].sort(byIdAsc))); // 1, 2, ..., 10

  useEffect(() => {
    loadSneakers();
  }, []);

  const handleDelete = async (sneaker) => {
    // 1) confirm BEFORE removing
    if (!window.confirm(`Are you sure you want to delete "${sneaker.sneakerName}"?`)) return;
    await deleteSneaker(sneaker.id);
    // 2) notify the user, 3) reload the list
    setMessage(`Sneaker "${sneaker.sneakerName}" has been deleted successfully.`);
    loadSneakers();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Sneaker Management</h2>
        <Button as={Link} id="add-sneaker" to={`/${ROLL}/add-sneaker`} variant="primary">Add Sneaker</Button>
      </div>
      {message && <Alert className="success-msg" variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
      <Table id="sneaker-table" striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sneaker Name</th>
            <th>Brand Name</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sneakers.map((s) => (
            <tr key={s.id} id={`sneaker-row-${s.id}`} className="sneaker-row">
              <td className="sneaker-id">{s.id}</td>
              <td className="sneaker-name">{s.sneakerName}</td>
              <td>{s.brandName}</td>
              <td>{s.sneakerCategory}</td>
              <td>
                <img className="sneaker-thumb" src={s.sneakerImageUrl} alt={s.sneakerName} width={70} height={70} style={{ objectFit: 'cover' }} />
              </td>
              <td>
                <Link to={`/${ROLL}/edit-sneaker/${s.id}`} className="btn btn-sm btn-warning me-2 edit-link">Edit</Link>
                <Button size="sm" variant="danger" className="delete-btn" onClick={() => handleDelete(s)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}