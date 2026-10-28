//@from F8
// src/pages/ProgressPage.js — bảng tiến độ của học viên: 5 con số tổng + tiến độ từng khoá + lịch sử quiz
import { useEffect } from 'react';
import { Alert, Badge, Card, Col, ProgressBar, Row, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import { fetchMyEnrollments } from '../features/enrollments/enrollmentsSlice';
import { fetchMyResults } from '../features/quiz/quizSlice';
import { formatDate } from '../utils/format';
import { calcProgress } from '../utils/learning';

function StatCard({ id, label, value }) {
  return (
    <Col>
      <Card className="h-100 shadow-sm text-center">
        <Card.Body>
          <div id={id} className="fs-3 fw-bold">{value}</div>
          <div className="small text-muted">{label}</div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default function ProgressPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { items, totals, status } = useSelector((state) => state.enrollments);
  const { history, historyStatus } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchMyEnrollments(user.id));
    dispatch(fetchMyResults(user.id));
  }, [user.id, dispatch]);

  if (status !== 'succeeded' || historyStatus !== 'succeeded') {
    if (status === 'failed' || historyStatus === 'failed') return <Alert variant="danger" id="progress-error">Could not load your progress.</Alert>;
    return <div id="progress-loading" className="text-center py-5"><Spinner animation="border" /></div>;
  }

  // mọi con số đều SUY RA từ dữ liệu máy chủ — không lưu "đã xong bao nhiêu" ở đâu khác
  const rows = items.map((e) => {
    const total = totals[e.courseId] ?? 0;
    const done = Math.min(e.completedLessons.length, total);
    const attempts = history.filter((r) => r.courseId === e.courseId);
    return {
      id: e.id,
      title: e.course?.title ?? 'Course no longer available',
      done,
      total,
      pct: calcProgress(done, total),
      best: attempts.length ? Math.max(...attempts.map((r) => r.percent)) : null,
    };
  });
  const passedChapters = new Set(history.filter((r) => r.passed).map((r) => r.chapterId)).size;
  const avg = history.length ? `${Math.round(history.reduce((s, r) => s + r.percent, 0) / history.length)}%` : '—';

  return (
    <>
      <h2 id="progress-title">My Progress</h2>
      <Row xs={2} md={5} className="g-3 mb-4">
        <StatCard id="stat-enrolled" label="Courses enrolled" value={items.length} />
        <StatCard id="stat-completed" label="Courses completed" value={rows.filter((r) => r.total > 0 && r.pct === 100).length} />
        <StatCard id="stat-lessons" label="Lessons completed" value={rows.reduce((s, r) => s + r.done, 0)} />
        <StatCard id="stat-quizzes" label="Quizzes passed" value={passedChapters} />
        <StatCard id="stat-avg" label="Average quiz score" value={avg} />
      </Row>

      <h4>Courses</h4>
      {rows.length === 0 ? (
        <Alert variant="info" id="no-progress">Start a course to see your progress here. <Link to="/courses">Browse courses</Link></Alert>
      ) : (
        <Table responsive hover className="bg-white shadow-sm align-middle" id="progress-table">
          <thead>
            <tr><th>Course</th><th>Lessons</th><th style={{ minWidth: 160 }}>Progress</th><th>Best quiz</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="progress-row">
                <td className="progress-course">{r.title}</td>
                <td className="progress-lessons">{r.done}/{r.total}</td>
                <td className="progress-percent"><ProgressBar now={r.pct} label={`${r.pct}%`} variant={r.pct === 100 ? 'success' : 'primary'} /></td>
                <td className="progress-best">{r.best === null ? '—' : `${r.best}%`}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h4 className="mt-4">Quiz history</h4>
      {history.length === 0 ? (
        <Alert variant="secondary" id="no-quiz-history">No quiz attempts yet.</Alert>
      ) : (
        <Table responsive className="bg-white shadow-sm align-middle" id="quiz-history">
          <thead>
            <tr><th>Chapter</th><th>Date</th><th>Score</th><th>Result</th></tr>
          </thead>
          <tbody>
            {history.map((r) => (
              <tr key={r.id} className="quiz-row">
                <td className="quiz-chapter">{r.chapter?.title ?? `Chapter #${r.chapterId}`}</td>
                <td className="quiz-date">{formatDate(r.submittedAt)}</td>
                <td className="quiz-score">{r.score}/{r.total} ({r.percent}%)</td>
                <td className="quiz-status"><Badge bg={r.passed ? 'success' : 'danger'}>{r.passed ? 'Passed' : 'Failed'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
