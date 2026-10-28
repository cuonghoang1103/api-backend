//@from F6
// src/pages/LearnPage.js — học từng bài: video YouTube + nội dung, đánh dấu hoàn thành, tiến độ %
//   /learn/:courseId                    ⇒ chuyển tới bài "học tiếp" (bài đầu tiên chưa xong)
//   /learn/:courseId/lessons/:lessonId  ⇒ học bài đó
import { useEffect, useMemo } from 'react';
import { Alert, Button, Col, ListGroup, ProgressBar, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';
import { fetchCourseDetail } from '../features/courses/coursesSlice';
import { fetchMyEnrollments, toggleLessonComplete } from '../features/enrollments/enrollmentsSlice';
import { calcProgress, resumeLesson, toEmbedUrl } from '../utils/learning';

export default function LearnPage() {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const detail = useSelector((state) => state.courses.detail);
  const { items, status: enrollStatus, savingLesson } = useSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
  }, [courseId, dispatch]);
  useEffect(() => {
    dispatch(fetchMyEnrollments(user.id));
  }, [user.id, dispatch]);

  // mọi bài của khoá theo đúng thứ tự (chương 1 bài 1, 2…, chương 2 …) — dùng cho Trước/Sau và % hoàn thành
  const lessons = useMemo(() => detail.chapters.flatMap((ch) => ch.lessons), [detail.chapters]);

  // detail có thể còn là khoá trang trước ⇒ chỉ coi là sẵn sàng khi đúng id
  const ready = detail.status === 'succeeded' && detail.course?.id === Number(courseId) && enrollStatus === 'succeeded';
  if (detail.status === 'failed') return <Alert variant="danger" id="course-not-found">Course not found.</Alert>;
  if (!ready) return <div id="learn-loading" className="text-center py-5"><Spinner animation="border" /></div>;

  const enrollment = items.find((e) => e.courseId === Number(courseId));
  if (!enrollment) {
    return (
      <Alert variant="warning" id="not-enrolled">
        You are not enrolled in this course. <Link to={`/courses/${courseId}`}>View the course</Link> to enrol first.
      </Alert>
    );
  }
  if (lessons.length === 0) return <Alert variant="secondary" id="no-content">This course has no lessons yet.</Alert>;

  // chưa chọn bài ⇒ chuyển (replace) tới bài học tiếp — nút Back không kẹt ở /learn/:courseId
  if (!lessonId) {
    return <Navigate to={`/learn/${courseId}/lessons/${resumeLesson(lessons, enrollment.completedLessons).id}`} replace />;
  }

  const index = lessons.findIndex((l) => l.id === Number(lessonId));
  if (index < 0) {
    return (
      <Alert variant="danger" id="lesson-not-found">
        This lesson does not belong to this course. <Link to={`/learn/${courseId}`}>Continue learning</Link>
      </Alert>
    );
  }
  const lesson = lessons[index];
  const isDone = (id) => enrollment.completedLessons.includes(id);
  // chỉ đếm bài CÒN trong khoá (admin có thể đã xoá bài từng hoàn thành)
  const doneCount = lessons.filter((l) => isDone(l.id)).length;
  const pct = calcProgress(doneCount, lessons.length);
  const embed = toEmbedUrl(lesson.videoUrl);
  const go = (l) => navigate(`/learn/${courseId}/lessons/${l.id}`);

  return (
    <Row className="g-4">
      <Col lg={4} xl={3}>
        <h5 id="learn-course-title" className="mb-2">{detail.course.title}</h5>
        <ProgressBar id="progress-bar" now={pct} label={`${pct}%`} className="mb-1" variant={pct === 100 ? 'success' : 'primary'} />
        <p id="progress-text" className="small text-muted">{doneCount}/{lessons.length} lessons completed ({pct}%)</p>
        <div id="lesson-list">
          {detail.chapters.map((ch, i) => (
            <div key={ch.id} className="mb-3">
              <div className="small fw-semibold text-uppercase text-muted mb-1">Chapter {i + 1}: {ch.title}</div>
              <ListGroup>
                {ch.lessons.map((l) => (
                  <ListGroup.Item
                    key={l.id}
                    action
                    as={Link}
                    to={`/learn/${courseId}/lessons/${l.id}`}
                    id={`lesson-link-${l.id}`}
                    className={`lesson-link${isDone(l.id) ? ' done' : ''}${l.id === lesson.id ? ' active' : ''}`}
                  >
                    {isDone(l.id) ? '✓ ' : ''}{l.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
//#F7
              <Link to={`/quiz/${ch.id}`} className="chapter-quiz small d-inline-block mt-1" id={`quiz-link-${ch.id}`}>📝 Chapter quiz</Link>
//#end
            </div>
          ))}
        </div>
      </Col>
      <Col lg={8} xl={9}>
        {pct === 100 && <Alert variant="success" id="course-complete">🎉 Congratulations! You completed this course.</Alert>}
        <p id="lesson-position" className="small text-muted mb-1">Lesson {index + 1} of {lessons.length}</p>
        <h3 id="lesson-title">{lesson.title}</h3>
        {embed ? (
          <div className="ratio ratio-16x9 mb-3 bg-dark rounded">
            <iframe
              id="lesson-video"
              src={embed}
              title={lesson.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Alert variant="secondary" id="no-video">No video for this lesson.</Alert>
        )}
        <div id="lesson-content" className="lesson-content bg-white rounded-3 p-3 shadow-sm mb-3">{lesson.content}</div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button id="prev-lesson" variant="outline-secondary" disabled={index === 0} onClick={() => go(lessons[index - 1])}>← Previous</Button>
          <Button
            id="mark-complete"
            variant={isDone(lesson.id) ? 'outline-success' : 'success'}
            disabled={savingLesson}
            onClick={() => dispatch(toggleLessonComplete({ enrollment, lessonId: lesson.id }))}
          >
            {isDone(lesson.id) ? 'Mark as incomplete' : 'Mark as complete'}
          </Button>
          <Button id="next-lesson" variant="outline-primary" disabled={index === lessons.length - 1} onClick={() => go(lessons[index + 1])}>Next →</Button>
        </div>
      </Col>
    </Row>
  );
}
