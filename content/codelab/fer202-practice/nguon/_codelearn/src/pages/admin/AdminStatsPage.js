//@from F11
// src/pages/admin/AdminStatsPage.js — thống kê: 5 chỉ số, top khoá phổ biến, biểu đồ theo khoá / tháng / danh mục
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import authApi from '../../api/authApi';
import courseApi from '../../api/courseApi';
import enrollApi from '../../api/enrollApi';
import quizApi from '../../api/quizApi';
import BarChart from '../../components/BarChart';
import { formatPrice } from '../../utils/format';
import { computeStats } from '../../utils/stats';

function Metric({ id, label, value, sub }) {
  return (
    <Col>
      <Card className="h-100 shadow-sm">
        <Card.Body>
          <div className="small text-muted">{label}</div>
          <div id={id} className="fs-4 fw-bold">{value}</div>
          {sub && <div className="small text-muted">{sub}</div>}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');

  // năm bảng tải SONG SONG; số liệu tính ở client từ dữ liệu thật (không viết cứng con số nào)
  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [users, courses, enrollments, results, categories] = await Promise.all([
        authApi.getAll(), courseApi.getAllCourses(), enrollApi.getAll(), quizApi.getAllResults(), courseApi.getCategories(),
      ]);
      setStats(computeStats({ users, courses, enrollments, results, categories }));
      setStatus('succeeded');
    } catch {
      setStatus('failed');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading' && !stats) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (status === 'failed') return <Alert variant="danger" id="stats-error">Could not load statistics. <Button size="sm" variant="outline-danger" onClick={load}>Try again</Button></Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="admin-stats-title" className="h4 mb-0">Statistics</h2>
        <Button id="refresh-stats" size="sm" variant="outline-primary" onClick={load}>Refresh</Button>
      </div>
      <Row xs={2} lg={5} className="g-3 mb-4">
        <Metric id="stat-courses" label="Courses" value={stats.totalCourses} sub={<span id="stat-published">{stats.published} published</span>} />
        <Metric id="stat-students" label="Students" value={stats.students} />
        <Metric id="stat-enrollments" label="Enrolments" value={stats.enrollments} />
        <Metric id="stat-revenue" label="Revenue (est.)" value={formatPrice(stats.revenue)} />
        <Metric id="stat-pass-rate" label="Quiz pass rate" value={`${stats.passRate}%`} />
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5>Most popular courses</h5>
              {stats.popular.length === 0 ? (
                <Alert variant="secondary" id="no-popular">No enrolments yet.</Alert>
              ) : (
                <>
                  <Table size="sm" id="popular-table">
                    <thead><tr><th>#</th><th>Course</th><th className="text-end">Enrolments</th></tr></thead>
                    <tbody>
                      {stats.popular.map((c, i) => (
                        <tr key={c.id} className="popular-row">
                          <td>{i + 1}</td>
                          <td className="popular-title">{c.title}</td>
                          <td className="popular-count text-end">{c.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <BarChart id="chart-popular" title="Enrolments per course" data={stats.popular.map((c, i) => ({ label: `#${i + 1}`, value: c.count }))} />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5>Enrolments per month</h5>
              <BarChart id="chart-months" title="Enrolments per month" data={stats.byMonth} />
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Enrolments per category</h5>
              <BarChart id="chart-categories" title="Enrolments per category" data={stats.byCategory} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
