import { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { getSneakers } from '../api';
import { formatVnd, byNameDesc } from '../utils';

export default function SneakerCollection() {
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSneakers()
      .then((data) => setSneakers([...data].sort(byNameDesc))) // Z -> A by sneakerName
      .catch(() => setError('Cannot load the sneaker list.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h2 className="mb-4">Sneaker Collection</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {sneakers.map((s) => (
          <Col key={s.id}>
            <Card className="h-100 shadow-sm sneaker-card">
              <Card.Img variant="top" className="sneaker-img" src={s.sneakerImageUrl} alt={s.sneakerName} />
              <Card.Body>
                <Card.Title className="sneaker-name">{s.sneakerName}</Card.Title>
                <Card.Text className="mb-1 sneaker-brand">Brand: {s.brandName}</Card.Text>
                <Card.Text className="mb-1 sneaker-category">Category: {s.sneakerCategory}</Card.Text>
                <Card.Text className="mb-2 sneaker-price">Price: {formatVnd(s.retailPriceK)}</Card.Text>
                {s.isLimitedEdition && <Badge bg="danger" className="limited-badge">Limited Edition</Badge>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}