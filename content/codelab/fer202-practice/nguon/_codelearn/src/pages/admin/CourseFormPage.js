//@from F9
// src/pages/admin/CourseFormPage.js — MỘT form cho cả thêm (/admin/courses/new) và sửa (/admin/courses/:id/edit)
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseApi from '../../api/courseApi';
import { createCourse, updateCourse } from '../../features/courses/coursesSlice';
import { LEVELS } from '../../utils/courseQuery';
import { todayISO } from '../../utils/format';
import { validateCourse } from '../../utils/validators';

const EMPTY = { title: '', categoryId: '', level: '', price: '', instructor: '', description: '', thumbnail: '', published: true };

export default function CourseFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);   // để kiểm trùng tên
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let cancelled = false;   // rời trang trước khi API trả về ⇒ không setState trên component đã gỡ
    Promise.all([courseApi.getCategories(), courseApi.getAllCourses()])
      .then(([cats, courses]) => {
        if (cancelled) return;
        setCategories(cats);
        setAllCourses(courses);
        if (isEdit) {
          const course = courses.find((c) => c.id === Number(id));
          if (!course) setNotFound(true);
          // điền sẵn (prefill): ô <select>/<input> làm việc với CHUỖI ⇒ đổi số sang chuỗi
          else setForm({ ...EMPTY, ...course, categoryId: String(course.categoryId), price: String(course.price), thumbnail: course.thumbnail ?? '' });
        }
      })
      .catch(() => !cancelled && setSaveError('Could not load data from the server.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateCourse(form, allCourses, isEdit ? Number(id) : null);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // gửi đúng KIỂU: categoryId/price là số (không phải "1", "259000")
    const payload = {
      title: form.title.trim(),
      categoryId: Number(form.categoryId),
      level: form.level,
      price: Number(form.price),
      instructor: form.instructor.trim(),
      description: form.description.trim(),
      thumbnail: form.thumbnail.trim(),
      published: form.published,
    };
    setSaving(true);
    setSaveError('');
    try {
      if (isEdit) await dispatch(updateCourse({ id: Number(id), ...payload })).unwrap();
      else await dispatch(createCourse({ ...payload, createdAt: todayISO() })).unwrap();
      navigate('/admin/courses', { state: { flash: `Course "${payload.title}" was saved.` } });
    } catch {
      setSaveError('Could not save the course. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (notFound) return <Alert variant="danger" id="form-not-found">Course not found. <Link to="/admin/courses">Back to courses</Link></Alert>;

  const field = (name) => ({ name, value: form[name], onChange: handleChange, isInvalid: !!errors[name] });
  const feedback = (name) => <Form.Control.Feedback type="invalid" id={`${name}-error`}>{errors[name]}</Form.Control.Feedback>;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 id="course-form-title" className="h4 mb-3">{isEdit ? 'Edit course' : 'Add a new course'}</h2>
        {saveError && <Alert variant="danger" id="save-error">{saveError}</Alert>}
        <Form id="course-form" noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control {...field('title')} />
            {feedback('title')}
          </Form.Group>
          <Row>
            <Form.Group as={Col} md={4} className="mb-3" controlId="categoryId">
              <Form.Label>Category</Form.Label>
              <Form.Select {...field('categoryId')}>
                <option value="">— Choose —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
              {feedback('categoryId')}
            </Form.Group>
            <Form.Group as={Col} md={4} className="mb-3" controlId="level">
              <Form.Label>Level</Form.Label>
              <Form.Select {...field('level')}>
                <option value="">— Choose —</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </Form.Select>
              {feedback('level')}
            </Form.Group>
            <Form.Group as={Col} md={4} className="mb-3" controlId="price">
              <Form.Label>Price (VND, 0 = free)</Form.Label>
              <Form.Control type="number" min="0" step="1000" {...field('price')} />
              {feedback('price')}
            </Form.Group>
          </Row>
          <Form.Group className="mb-3" controlId="instructor">
            <Form.Label>Instructor</Form.Label>
            <Form.Control {...field('instructor')} />
            {feedback('instructor')}
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} {...field('description')} />
            {feedback('description')}
          </Form.Group>
          <Form.Group className="mb-3" controlId="thumbnail">
            <Form.Label>Thumbnail URL (optional)</Form.Label>
            <Form.Control placeholder="https://…" {...field('thumbnail')} />
            {feedback('thumbnail')}
          </Form.Group>
          <Form.Check type="switch" id="published" name="published" label="Published (visible to students)" checked={form.published} onChange={handleChange} className="mb-3" />
          <div className="d-flex gap-2">
            <Button type="submit" id="save-course" disabled={saving}>{saving ? 'Saving…' : 'Save course'}</Button>
            <Link to="/admin/courses" id="cancel-course" className="btn btn-outline-secondary">Cancel</Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
