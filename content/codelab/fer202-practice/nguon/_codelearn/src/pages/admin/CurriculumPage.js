//@from F9
// src/pages/admin/CurriculumPage.js — chương & bài học của MỘT khoá: thêm/xoá chương, thêm/sửa/xoá bài
// Dữ liệu chỉ dùng ở trang này ⇒ state cục bộ + courseApi (không cần đưa vào Redux)
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import courseApi from '../../api/courseApi';
import quizApi from '../../api/quizApi';
import { validateChapter, validateLesson } from '../../utils/validators';

const EMPTY_LESSON = { chapterId: '', title: '', videoUrl: '', duration: '', content: '' };
const nextOrder = (list) => list.reduce((m, x) => Math.max(m, x.order ?? 0), 0) + 1;

export default function CurriculumPage() {
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState('loading');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterError, setChapterError] = useState('');
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);
  const [lessonErrors, setLessonErrors] = useState({});
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [message, setMessage] = useState('');

  // tải lại cả cây sau mỗi thay đổi — đơn giản và luôn khớp máy chủ
  const load = useCallback(async () => {
    try {
      const [c, chs] = await Promise.all([courseApi.getCourse(courseId), courseApi.getCurriculum(courseId)]);
      setCourse(c);
      setChapters(chs.map((ch) => ({ ...ch, lessons: (ch.lessons ?? []).slice().sort((a, b) => a.order - b.order) })));
      setStatus('succeeded');
    } catch {
      setStatus('failed');
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const addChapter = async (e) => {
    e.preventDefault();
    const err = validateChapter(chapterTitle, chapters);
    setChapterError(err ?? '');
    if (err) return;
    await courseApi.createChapter({ courseId, title: chapterTitle.trim(), order: nextOrder(chapters) });
    setChapterTitle('');
    setMessage('Chapter added.');
    load();
  };

  const removeChapter = async (ch) => {
    if (!window.confirm(`Delete chapter "${ch.title}" and its ${ch.lessons.length} lesson(s)?`)) return;
    const questions = (await quizApi.getQuestions(ch.id)).map((q) => q.id);
    await courseApi.deleteMany('lessons', ch.lessons.map((l) => l.id));
    await courseApi.deleteMany('questions', questions);
    await courseApi.deleteChapter(ch.id);
    setMessage('Chapter deleted.');
    load();
  };

  const changeLesson = (e) => {
    const { name, value } = e.target;
    setLessonForm((f) => ({ ...f, [name]: value }));
    setLessonErrors((er) => ({ ...er, [name]: undefined }));
  };

  const editLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm({ chapterId: String(lesson.chapterId), title: lesson.title, videoUrl: lesson.videoUrl, duration: String(lesson.duration), content: lesson.content });
    setLessonErrors({});
  };

  const cancelEdit = () => {
    setEditingLessonId(null);
    setLessonForm(EMPTY_LESSON);
    setLessonErrors({});
  };

  const saveLesson = async (e) => {
    e.preventDefault();
    const found = validateLesson(lessonForm);
    setLessonErrors(found);
    if (Object.keys(found).length > 0) return;
    const chapterId = Number(lessonForm.chapterId);
    const data = {
      chapterId,
      courseId,
      title: lessonForm.title.trim(),
      videoUrl: lessonForm.videoUrl.trim(),
      duration: Number(lessonForm.duration),
      content: lessonForm.content.trim(),
    };
    const target = chapters.find((c) => c.id === chapterId);
    const old = chapters.flatMap((c) => c.lessons).find((l) => l.id === editingLessonId);
    if (editingLessonId) {
      // đổi sang chương khác ⇒ xếp cuối chương mới
      await courseApi.updateLesson(editingLessonId, old && old.chapterId === chapterId ? data : { ...data, order: nextOrder(target.lessons) });
      setMessage('Lesson updated.');
    } else {
      await courseApi.createLesson({ ...data, order: nextOrder(target.lessons) });
      setMessage('Lesson added.');
    }
    cancelEdit();
    load();
  };

  const removeLesson = async (lesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    await courseApi.deleteLesson(lesson.id);
    setMessage('Lesson deleted.');
    load();
  };

  if (status === 'loading') return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (status === 'failed') return <Alert variant="danger" id="curriculum-error">Course not found. <Link to="/admin/courses">Back</Link></Alert>;

  const lessonField = (name) => ({ name, value: lessonForm[name], onChange: changeLesson, isInvalid: !!lessonErrors[name] });
  const lessonFeedback = (name, key = name) => <Form.Control.Feedback type="invalid" id={`lesson-${key}-error`}>{lessonErrors[name]}</Form.Control.Feedback>;

  return (
    <>
      <Link to="/admin/courses" className="small">← Courses</Link>
      <h2 id="curriculum-title" className="h4 mt-2">Curriculum — {course.title}</h2>
      {message && <Alert variant="success" id="curriculum-success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
      <Row className="g-4">
        <Col lg={7}>
          {chapters.length === 0 && <Alert variant="secondary" id="no-chapters">No chapters yet — add the first one.</Alert>}
          {chapters.map((ch, i) => (
            <Card key={ch.id} className="admin-chapter mb-3" id={`admin-chapter-${ch.id}`}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span className="admin-chapter-title fw-semibold">Chapter {i + 1}: {ch.title}</span>
                <Button size="sm" variant="outline-danger" className="btn-delete-chapter" onClick={() => removeChapter(ch)}>Delete</Button>
              </Card.Header>
              <ListGroup variant="flush">
                {ch.lessons.map((l) => (
                  <ListGroup.Item key={l.id} className="admin-lesson d-flex justify-content-between align-items-center" id={`admin-lesson-${l.id}`}>
                    <span><span className="admin-lesson-title">{l.title}</span> <small className="text-muted">· {l.duration} min</small></span>
                    <span className="text-nowrap">
                      <Button size="sm" variant="outline-primary" className="btn-edit-lesson me-1" onClick={() => editLesson(l)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" className="btn-delete-lesson" onClick={() => removeLesson(l)}>Delete</Button>
                    </span>
                  </ListGroup.Item>
                ))}
                {ch.lessons.length === 0 && <ListGroup.Item className="small text-muted">No lessons in this chapter.</ListGroup.Item>}
              </ListGroup>
            </Card>
          ))}
          <Form id="chapter-form" noValidate onSubmit={addChapter} className="d-flex gap-2 align-items-start">
            <div className="flex-grow-1">
              <Form.Control id="chapter-title" placeholder="New chapter title" value={chapterTitle} isInvalid={!!chapterError}
                onChange={(e) => { setChapterTitle(e.target.value); setChapterError(''); }} />
              <Form.Control.Feedback type="invalid" id="chapter-title-error">{chapterError}</Form.Control.Feedback>
            </div>
            <Button type="submit" id="add-chapter">Add chapter</Button>
          </Form>
        </Col>
        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 id="lesson-form-title">{editingLessonId ? 'Edit lesson' : 'Add a lesson'}</h5>
              <Form id="lesson-form" noValidate onSubmit={saveLesson}>
                <Form.Group className="mb-2" controlId="lesson-chapter">
                  <Form.Label>Chapter</Form.Label>
                  <Form.Select {...lessonField('chapterId')}>
                    <option value="">— Choose —</option>
                    {chapters.map((c, i) => <option key={c.id} value={c.id}>Chapter {i + 1}: {c.title}</option>)}
                  </Form.Select>
                  {lessonFeedback('chapterId', 'chapter')}
                </Form.Group>
                <Form.Group className="mb-2" controlId="lesson-title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control {...lessonField('title')} />
                  {lessonFeedback('title')}
                </Form.Group>
                <Form.Group className="mb-2" controlId="lesson-video">
                  <Form.Label>YouTube URL</Form.Label>
                  <Form.Control placeholder="https://www.youtube.com/watch?v=…" {...lessonField('videoUrl')} />
                  {lessonFeedback('videoUrl', 'video')}
                </Form.Group>
                <Form.Group className="mb-2" controlId="lesson-duration">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control type="number" min="1" max="300" {...lessonField('duration')} />
                  {lessonFeedback('duration')}
                </Form.Group>
                <Form.Group className="mb-3" controlId="lesson-content">
                  <Form.Label>Content</Form.Label>
                  <Form.Control as="textarea" rows={3} {...lessonField('content')} />
                  {lessonFeedback('content')}
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button type="submit" id="save-lesson">{editingLessonId ? 'Update lesson' : 'Add lesson'}</Button>
                  {editingLessonId && <Button variant="outline-secondary" id="cancel-edit" onClick={cancelEdit}>Cancel</Button>}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
