//@from F5
// src/pages/MyCoursesPage.js — các khoá học viên đã đăng ký (route có bảo vệ: phải đăng nhập)
import { useEffect } from 'react';
//#<F6
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap';
//#end
//#F6
import { Alert, Card, Col, ProgressBar, Row, Spinner } from 'react-bootstrap';
//#end
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import { fetchMyEnrollments } from '../features/enrollments/enrollmentsSlice';
import { formatDate } from '../utils/format';
//#F6
import { calcProgress } from '../utils/learning';
//#end

export default function MyCoursesPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
//#<F6
  const { items, status, error } = useSelector((state) => state.enrollments);
//#end
//#F6
  const { items, totals, status, error } = useSelector((state) => state.enrollments);
//#end

  // luôn tải lại khi mở trang: tiến độ có thể vừa đổi ở trang học
  useEffect(() => {
    dispatch(fetchMyEnrollments(user.id));
  }, [user.id, dispatch]);

  if (status === 'loading' && items.length === 0) {
    return <div id="my-courses-loading" className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <h2 id="my-courses-title">My Courses</h2>
      {status === 'failed' && <Alert variant="danger" id="my-courses-error">Could not load your courses ({error}).</Alert>}
      {status === 'succeeded' && items.length === 0 && (
        <Alert variant="info" id="no-enrollments">
          You have not enrolled in any course yet. <Link to="/courses">Browse courses</Link>
        </Alert>
      )}
      <Row xs={1} md={2} lg={3} className="g-3">
        {items.map((e) => {
//#F6
          const total = totals[e.courseId] ?? 0;
          const pct = calcProgress(Math.min(e.completedLessons.length, total), total);
//#end
          return (
            <Col key={e.id}>
              <Card className="my-course h-100 shadow-sm" id={`my-course-${e.courseId}`}>
                <Card.Body>
                  {/* khoá có thể đã bị admin xoá ⇒ _expand trả undefined */}
                  <Card.Title className="my-course-title fs-6 fw-bold">{e.course?.title ?? 'Course no longer available'}</Card.Title>
                  <Card.Text className="my-course-enrolled small text-muted">Enrolled on {formatDate(e.enrolledAt)}</Card.Text>
//#F6
                  <ProgressBar now={pct} label={`${pct}%`} className="my-course-progress mb-1" variant={pct === 100 ? 'success' : 'primary'} />
                  <div className="small text-muted">{Math.min(e.completedLessons.length, total)}/{total} lessons</div>
//#end
                </Card.Body>
                <Card.Footer className="bg-white">
                  <Link className="btn btn-primary btn-sm btn-continue" to={`/learn/${e.courseId}`}>Continue learning</Link>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
