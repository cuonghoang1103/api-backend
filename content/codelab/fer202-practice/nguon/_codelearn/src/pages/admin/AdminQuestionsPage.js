//@from F10
// src/pages/admin/AdminQuestionsPage.js — ngân hàng câu hỏi quiz: chọn khoá ▸ chương, thêm / sửa / xoá câu hỏi
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import courseApi from '../../api/courseApi';
import quizApi from '../../api/quizApi';
import { validateQuestion } from '../../utils/validators';

const LETTERS = ['A', 'B', 'C', 'D'];
const EMPTY = { content: '', options: ['', '', '', ''], answer: '', explanation: '' };

export default function AdminQuestionsPage() {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    courseApi.getAllCourses().then(setCourses).catch(() => setLoadError('Could not load courses.'));
  }, []);

  // đổi khoá ⇒ tải chương của khoá đó, bỏ chương đang chọn
  useEffect(() => {
    setChapterId('');
    setChapters([]);
    if (courseId) courseApi.getCurriculum(courseId).then(setChapters).catch(() => setLoadError('Could not load chapters.'));
  }, [courseId]);

  const loadQuestions = useCallback(
    (chId) => quizApi.getQuestions(chId).then(setQuestions).catch(() => setLoadError('Could not load questions.')),
    [],
  );

  useEffect(() => {
    setQuestions([]);
    setEditingId(null);
    setForm(EMPTY);
    if (chapterId) loadQuestions(chapterId);
  }, [chapterId, loadQuestions]);

  const setOption = (i, value) => {
    setForm((f) => ({ ...f, options: f.options.map((o, j) => (j === i ? value : o)) }));   // mảng MỚI, không sửa tại chỗ
    setErrors((er) => ({ ...er, options: undefined }));
  };

  const startEdit = (q) => {
    setEditingId(q.id);
    setForm({ content: q.content, options: [...q.options], answer: String(q.answerIndex), explanation: q.explanation ?? '' });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateQuestion(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const question = {
      chapterId: Number(chapterId),
      courseId: Number(courseId),
      content: form.content.trim(),
      options: form.options.map((o) => o.trim()),
      answerIndex: Number(form.answer),           // SỐ — so === với lựa chọn của học viên
      explanation: form.explanation.trim(),
    };
    try {
      if (editingId) await quizApi.updateQuestion(editingId, question);
      else await quizApi.createQuestion(question);
      setMessage(editingId ? 'Question updated.' : 'Question added.');
      cancelEdit();
      loadQuestions(chapterId);
    } catch {
      setLoadError('Could not save the question.');
    }
  };

  const handleDelete = async (q) => {
    if (!window.confirm('Delete this question?')) return;
    await quizApi.deleteQuestion(q.id);
    setMessage('Question deleted.');
    loadQuestions(chapterId);
  };

  return (
    <>
      <h2 id="admin-questions-title" className="h4">Quiz questions</h2>
      {loadError && <Alert variant="danger" id="questions-error">{loadError}</Alert>}
      {message && <Alert variant="success" id="question-success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
      <Row className="g-2 mb-3">
        <Col md={6}>
          <Form.Select id="q-course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">— Choose a course —</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select id="q-chapter" value={chapterId} onChange={(e) => setChapterId(e.target.value)} disabled={!courseId}>
            <option value="">— Choose a chapter —</option>
            {chapters.map((c, i) => <option key={c.id} value={c.id}>Chapter {i + 1}: {c.title}</option>)}
          </Form.Select>
        </Col>
      </Row>

      {!chapterId ? (
        <Alert variant="secondary" id="choose-chapter">Choose a course and a chapter to manage its questions.</Alert>
      ) : (
        <Row className="g-4">
          <Col lg={7}>
            {questions.length === 0 ? (
              <Alert variant="secondary" id="no-questions-admin">This chapter has no questions yet.</Alert>
            ) : (
              <Table responsive className="bg-white shadow-sm align-middle" id="questions-table">
                <thead><tr><th>#</th><th>Question</th><th>Correct answer</th><th /></tr></thead>
                <tbody>
                  {questions.map((q, i) => (
                    <tr key={q.id} className="admin-question-row" id={`admin-question-${q.id}`}>
                      <td>{i + 1}</td>
                      <td className="admin-question-content">{q.content}</td>
                      <td className="admin-question-answer">{LETTERS[q.answerIndex]}. {q.options[q.answerIndex]}</td>
                      <td className="text-nowrap text-end">
                        <Button size="sm" variant="outline-primary" className="btn-edit-question me-1" onClick={() => startEdit(q)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" className="btn-delete-question" onClick={() => handleDelete(q)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
          <Col lg={5}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 id="question-form-title">{editingId ? 'Edit question' : 'Add a question'}</h5>
                <Form id="question-form" noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-2" controlId="q-content">
                    <Form.Label>Question</Form.Label>
                    <Form.Control as="textarea" rows={2} value={form.content} isInvalid={!!errors.content}
                      onChange={(e) => { setForm((f) => ({ ...f, content: e.target.value })); setErrors((er) => ({ ...er, content: undefined })); }} />
                    <Form.Control.Feedback type="invalid" id="q-content-error">{errors.content}</Form.Control.Feedback>
                  </Form.Group>
                  {form.options.map((o, i) => (
                    <Form.Control key={i} id={`q-option-${i}`} className="mb-2" placeholder={`Option ${LETTERS[i]}`} value={o} isInvalid={!!errors.options} onChange={(e) => setOption(i, e.target.value)} />
                  ))}
                  <div id="q-options-error" className="text-danger small mb-2">{errors.options}</div>
                  <Form.Group className="mb-2" controlId="q-answer">
                    <Form.Label>Correct answer</Form.Label>
                    <Form.Select value={form.answer} isInvalid={!!errors.answer}
                      onChange={(e) => { setForm((f) => ({ ...f, answer: e.target.value })); setErrors((er) => ({ ...er, answer: undefined })); }}>
                      <option value="">— Choose —</option>
                      {LETTERS.map((l, i) => <option key={l} value={i}>Option {l}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid" id="q-answer-error">{errors.answer}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="q-explanation">
                    <Form.Label>Explanation (optional)</Form.Label>
                    <Form.Control value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" id="save-question">{editingId ? 'Update question' : 'Add question'}</Button>
                    {editingId && <Button variant="outline-secondary" id="cancel-question" onClick={cancelEdit}>Cancel</Button>}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
