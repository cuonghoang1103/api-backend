import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { API } from '../api';

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [keyword, setKeyword] = useState('');
  // ?status=ACTIVE is the single source of truth for the dropdown,
  // so opening /subjects?status=ACTIVE pre-selects ACTIVE on page load.
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || ''; // '' = All Status
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/subjects`).then((res) => setSubjects(res.data)); // fetched ONCE
  }, []);

  // Unique statuses extracted from the data — not hard-coded
  const statuses = useMemo(() => [...new Set(subjects.map((s) => s.status))], [subjects]);

  // Client-side filtering (no extra API call): name startsWith keyword (case-insensitive) AND status
  const kw = keyword.trim().toLowerCase();
  const filtered = subjects.filter(
    (s) => s.name.toLowerCase().startsWith(kw) && (status === '' || s.status === status)
  );

  const handleStatusChange = (e) => {
    const value = e.target.value;
    if (value) setSearchParams({ status: value });
    else setSearchParams({});
  };

  return (
    <>
      <h2 className="mb-0">Subject List</h2>
      <p className="text-muted">Browse and filter available subjects</p>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2">
            <Col md={9}>
              <Form.Control id="search" placeholder="Search by name..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </Col>
            <Col md={3}>
              <Form.Select id="status-filter" value={status} onChange={handleStatusChange}>
                <option value="">All Status</option>
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <p className="text-muted showing-text">
        Showing <b>{filtered.length}</b> of {subjects.length} subjects
        {kw && <> matching <i>"{keyword.trim()}"</i></>}
        {status && <> with status <b>{status}</b></>}
      </p>

      <Row className="g-3">
        {filtered.map((s) => (
          <Col key={s.id} md={3}>
            <Card className="h-100 subject-card">
              <Card.Body>
                <Card.Title className="fw-bold subject-code">{s.code}</Card.Title>
                <Card.Text className="mb-1 subject-name">{s.name}</Card.Text>
                <Card.Text className="text-muted small">Credits: {s.credits}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge className="subject-status" bg={s.status === 'ACTIVE' ? 'success' : 'secondary'}>{s.status}</Badge>
                  <Button size="sm" className="view-attendance" onClick={() => navigate(`/subjects/${s.id}/attendance`)}>View Attendance</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
