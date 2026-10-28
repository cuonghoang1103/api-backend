//@from F1
// src/pages/HomePage.js — trang chủ: giới thiệu ngắn + nút sang danh sách khoá học
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🎬', title: 'Video lessons', text: 'Short, focused lessons with a video and notes.' },
  { icon: '📝', title: 'Chapter quizzes', text: 'Check what you learned at the end of every chapter.' },
  { icon: '📈', title: 'Track progress', text: 'See completed lessons and quiz scores in one place.' },
];

export default function HomePage() {
  return (
    <>
      <section className="p-5 mb-4 bg-white rounded-3 shadow-sm text-center">
        <h1 id="home-title" className="display-5 fw-bold">Learn to code with CodeLearn</h1>
        <p className="lead text-muted">Find a course, enrol, learn lesson by lesson and test yourself with quizzes.</p>
        <Link to="/courses" id="browse-btn" className="btn btn-primary btn-lg">Browse courses</Link>
      </section>
      <Row xs={1} md={3} className="g-3">
        {FEATURES.map((f) => (
          <Col key={f.title}>
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <div className="fs-2">{f.icon}</div>
              <h5 className="mt-2">{f.title}</h5>
              <p className="text-muted mb-0">{f.text}</p>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
}
