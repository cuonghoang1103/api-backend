import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Card, Form, Table, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { API } from '../api';
import { todayLocal } from '../dateUtils';

export default function BulkAttendance() {
  const { subjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const classId = searchParams.get('classId') || ''; // ?classId=xxx

  const [subject, setSubject] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // studentId -> 'PRESENT' | 'ABSENT'
  const [date, setDate] = useState(todayLocal()); // defaults to today
  const [error, setError] = useState('');
  const [missingIds, setMissingIds] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`${API}/subjects/${subjectId}`).then((res) => setSubject(res.data));
    axios.get(`${API}/classes?subjectId=${subjectId}`).then((res) => setClasses(res.data));
    axios.get(`${API}/students`).then((res) => setStudents(res.data));
  }, [subjectId]);

  // A different class => clear the radios and messages
  useEffect(() => {
    setStatusMap({});
    setError('');
    setMissingIds([]);
    setSuccess('');
  }, [classId]);

  const currentClass = classes.find((c) => c.id === classId);
  // Only students whose enrollment status is "enrolled" ("dropped" ones are NOT shown)
  const enrolled = currentClass
    ? currentClass.enrollments
        .filter((e) => e.status === 'enrolled')
        .map((e) => students.find((s) => s.id === e.studentId))
        .filter(Boolean)
    : [];

  const handleClassChange = (e) => {
    const value = e.target.value;
    if (value) setSearchParams({ classId: value });
    else setSearchParams({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMissingIds([]);
    setSuccess('');

    if (!classId) return setError('Please select a class.');
    if (!date) return setError('Please select a date.');
    // Rule 1: no future date (YYYY-MM-DD strings compare correctly as text)
    if (date > todayLocal()) return setError('Date cannot be in the future.');
    // Rule 2: every student must have a status
    const missing = enrolled.filter((s) => !statusMap[s.id]);
    if (missing.length > 0) {
      setMissingIds(missing.map((s) => s.id));
      return setError(`Please select attendance status for all students (missing: ${missing.map((s) => s.studentCode).join(', ')}).`);
    }
    // Rule 3: attendance for this date must not exist yet in this class
    const { data: existing } = await axios.get(`${API}/attendances?classId=${classId}`);
    if (existing.some((a) => a.date.slice(0, 10) === date)) {
      return setError(`Attendance for ${date} already exists in this class.`);
    }
    // Success: POST one record per student
    const isoDate = `${date}T00:00:00.000Z`;
    for (const s of enrolled) {
      await axios.post(`${API}/attendances`, { studentId: s.id, classId, date: isoDate, status: statusMap[s.id] });
    }
    setSuccess(`Attendance recorded successfully for ${enrolled.length} student(s) on ${date}.`);
    setStatusMap({}); // reload the page state: radios reset, message kept
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Record Attendance</Card.Title>
        {subject && <Card.Subtitle className="mb-3 text-muted subject-title">{subject.code} — {subject.name}</Card.Subtitle>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Class</Form.Label>
              <Form.Select id="class-select" value={classId} onChange={handleClassChange}>
                <option value="">-- Select class --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.className}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Session Date</Form.Label>
              <Form.Control id="session-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Col>
          </Row>

          {currentClass && <p>Subject: <b>{subject?.name}</b> · Class: <b>{currentClass.className}</b></p>}
          {error && <Alert variant="danger" className="error-msg">{error}</Alert>}
          {success && <Alert variant="success" className="success-msg">{success}</Alert>}

          {currentClass && (
            <Table bordered hover id="student-table">
              <thead className="table-primary">
                <tr>
                  <th>No</th>
                  <th>Student Code</th>
                  <th>Full Name</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.map((s, i) => (
                  <tr key={s.id} id={`student-row-${s.id}`} className={`student-row ${missingIds.includes(s.id) ? 'table-warning' : ''}`}>
                    <td>{i + 1}</td>
                    <td className="student-code">{s.studentCode}</td>
                    <td>{s.fullName}</td>
                    <td>
                      {['PRESENT', 'ABSENT'].map((st) => (
                        <Form.Check
                          key={st}
                          inline
                          type="radio"
                          id={`att-${s.id}-${st}`}
                          name={`status-${s.id}`}
                          label={st}
                          checked={statusMap[s.id] === st}
                          onChange={() => setStatusMap({ ...statusMap, [s.id]: st })}
                        />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <div className="d-flex justify-content-between">
            <Link to="/subjects">← Back to Subjects</Link>
            <Button id="record-attendance" type="submit" variant="success">Record Attendance</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}