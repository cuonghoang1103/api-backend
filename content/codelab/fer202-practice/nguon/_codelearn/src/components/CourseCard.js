//@from F3
// src/components/CourseCard.js — thẻ một khoá học (component trình bày: chỉ nhận props, không gọi API)
import { Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';

const LEVEL_COLOR = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };

// "React for Beginners" ⇒ "RB" — ảnh thay thế khi khoá chưa có thumbnail
const initials = (title) => title.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export default function CourseCard({ course, categoryName }) {
  return (
    <Card className="course-card h-100 shadow-sm" id={`course-${course.id}`}>
      {course.thumbnail ? (
        <Card.Img variant="top" src={course.thumbnail} alt={course.title} style={{ height: 130, objectFit: 'cover' }} />
      ) : (
        <div className="course-thumb" aria-hidden="true">{initials(course.title)}</div>
      )}
      <Card.Body>
        <div className="d-flex gap-2 mb-2">
          <Badge bg="info" className="course-category">{categoryName}</Badge>
          <Badge bg={LEVEL_COLOR[course.level] ?? 'secondary'} className="course-level">{course.level}</Badge>
        </div>
        <Card.Title className="course-title fs-6 fw-bold">{course.title}</Card.Title>
        <Card.Text className="course-instructor text-muted small">by {course.instructor}</Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
        <span className="course-price fw-bold">{formatPrice(course.price)}</span>
        <Link to={`/courses/${course.id}`} className="btn btn-sm btn-primary btn-detail">View details</Link>
      </Card.Footer>
    </Card>
  );
}
