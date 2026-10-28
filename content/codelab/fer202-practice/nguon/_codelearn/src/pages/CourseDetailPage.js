//@from F4
// src/pages/CourseDetailPage.js — chi tiết khoá: thông tin + chương trình học (chương ▸ bài)
//#F5
//   + khối đăng ký (enroll) bên phải
//#end
//#<F5
import { useEffect } from 'react';
import { Alert, Badge, Card, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
//#end
//#F5
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import { enrollCourse, fetchMyEnrollments, selectEnrollmentByCourse } from '../features/enrollments/enrollmentsSlice';
//#end
import { fetchCourseDetail } from '../features/courses/coursesSlice';
import { formatPrice } from '../utils/format';

export default function CourseDetailPage() {
  const { id } = useParams();                  // LUÔN là chuỗi: "1"
  const dispatch = useDispatch();
  const { course, categoryName, chapters, status, error } = useSelector((state) => state.courses.detail);
//#F5
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const enrollment = useSelector((state) => selectEnrollmentByCourse(state, Number(id)));
  const enrolling = useSelector((state) => state.enrollments.enrollStatus === 'loading');
  const [message, setMessage] = useState('');
  const [enrollError, setEnrollError] = useState('');
//#end

  useEffect(() => {
    dispatch(fetchCourseDetail(id));
  }, [id, dispatch]);
//#F5

  // biết học viên đã đăng ký khoá này chưa ⇒ tải danh sách đăng ký của chính họ
  useEffect(() => {
    if (user?.role === 'student') dispatch(fetchMyEnrollments(user.id));
  }, [user, dispatch]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });   // đăng nhập xong quay lại đúng trang này
      return;
    }
    setEnrollError('');
    try {
      await dispatch(enrollCourse({ userId: user.id, courseId: course.id })).unwrap();
      setMessage(`You are enrolled in ${course.title}`);
    } catch (err) {
      if (err?.name === 'ConditionError') return;            // cú bấm thứ hai khi đang gửi — bỏ qua
      setEnrollError('Could not enroll, please try again.');
    }
  };
//#end

  if (status === 'loading' || status === 'idle') {
    return <div id="detail-loading" className="text-center py-5"><Spinner animation="border" /></div>;
  }
  if (status === 'failed') {
    return (
      <Alert variant="danger" id="course-not-found">
        {error === 'notFound' ? 'Course not found.' : `Could not load the course (${error}).`}{' '}
        <Link to="/courses">Back to courses</Link>
      </Alert>
    );
  }

  const lessonCount = chapters.reduce((n, ch) => n + ch.lessons.length, 0);
  const minutes = chapters.reduce((n, ch) => n + ch.lessons.reduce((m, l) => m + l.duration, 0), 0);

  return (
    <>
      <Link to="/courses" id="back-to-courses" className="small">← All courses</Link>
      <Row className="mt-2 g-4">
        <Col lg={8}>
          <h1 id="course-title" className="h2">{course.title}</h1>
          <p id="course-meta" className="text-muted">
            <Badge bg="info" className="me-2">{categoryName}</Badge>
            {course.level} · by {course.instructor}
          </p>
          <p id="course-description">{course.description}</p>

          <h4 className="mt-4">Curriculum</h4>
          <p id="lesson-count" className="text-muted small">{lessonCount} lessons · {minutes} min</p>
          {chapters.length === 0 ? (
            <Alert variant="secondary" id="no-content">Curriculum coming soon.</Alert>
          ) : (
            chapters.map((ch, i) => (
              <Card key={ch.id} className="chapter mb-3" id={`chapter-${ch.id}`}>
                <Card.Header className="chapter-title fw-semibold">Chapter {i + 1}: {ch.title}</Card.Header>
                <ListGroup variant="flush">
                  {ch.lessons.map((l) => (
                    <ListGroup.Item key={l.id} className="lesson-item d-flex justify-content-between">
                      <span className="lesson-name">▶ {l.title}</span>
                      <span className="lesson-duration text-muted small">{l.duration} min</span>
                    </ListGroup.Item>
                  ))}
                  {ch.lessons.length === 0 && <ListGroup.Item className="text-muted small">No lessons yet</ListGroup.Item>}
                </ListGroup>
              </Card>
            ))
          )}
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm" id="enroll-card">
            <Card.Body>
              <div id="course-price" className="fs-3 fw-bold mb-3">{formatPrice(course.price)}</div>
//#<F5
              <p className="text-muted small mb-0">Enrolment opens in F5.</p>
//#end
//#F5
              {user?.role === 'admin' ? (
                <Alert variant="info" id="admin-note" className="mb-0">Admins manage courses and cannot enrol.</Alert>
              ) : enrollment ? (
                <Link to={`/learn/${course.id}`} id="continue-btn" className="btn btn-success w-100">Go to course</Link>
              ) : (
                <Button id="enroll-btn" className="w-100" disabled={enrolling} onClick={handleEnroll}>
                  {!user ? 'Log in to enroll' : enrolling ? 'Enrolling…' : 'Enroll now'}
                </Button>
              )}
              {message && <Alert variant="success" id="enroll-success" className="mt-3 mb-0">{message}</Alert>}
              {enrollError && <Alert variant="danger" id="enroll-error" className="mt-3 mb-0">{enrollError}</Alert>}
//#end
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
