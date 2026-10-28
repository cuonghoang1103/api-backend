//@from F9
// src/pages/admin/AdminCoursesPage.js — quản lý khoá học: bảng mọi khoá (cả bản nháp), thêm / sửa / xoá
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { deleteCourse, fetchAdminCourses } from '../../features/courses/coursesSlice';
import { formatPrice } from '../../utils/format';

export default function AdminCoursesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items, students, status, error } = useSelector((state) => state.courses.admin);
  const categories = useSelector((state) => state.courses.categories);
  // thông báo "đã lưu" gửi sang từ trang form qua location.state
  const [success, setSuccess] = useState(location.state?.flash ?? '');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    dispatch(fetchAdminCourses());
  }, [dispatch]);

  const handleDelete = async (course) => {
    setSuccess('');
    setActionError('');
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteCourse(course)).unwrap();
      setSuccess(`Course "${course.title}" was deleted.`);
    } catch (err) {
      setActionError(typeof err === 'string' ? err : 'Could not delete the course.');
    }
  };

  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? '—';
  const sorted = items.slice().sort((a, b) => a.id - b.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="admin-courses-title" className="mb-0">Courses</h2>
        <Link to="/admin/courses/new" id="add-course" className="btn btn-primary">+ Add course</Link>
      </div>
      {success && <Alert variant="success" id="admin-success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      {actionError && <Alert variant="danger" id="admin-error" dismissible onClose={() => setActionError('')}>{actionError}</Alert>}
      {status === 'loading' && items.length === 0 && <div className="text-center py-5"><Spinner animation="border" /></div>}
      {status === 'failed' && <Alert variant="danger" id="admin-load-error">Could not load courses ({error}).</Alert>}
      {items.length > 0 && (
        <Table responsive hover className="bg-white shadow-sm align-middle" id="admin-courses-table">
          <thead>
            <tr><th>#</th><th>Title</th><th>Category</th><th>Level</th><th>Price</th><th>Students</th><th>Status</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.id} className="admin-course-row" id={`admin-course-${c.id}`}>
                <td>{c.id}</td>
                <td className="admin-course-title">{c.title}</td>
                <td>{categoryName(c.categoryId)}</td>
                <td>{c.level}</td>
                <td className="admin-course-price">{formatPrice(c.price)}</td>
                <td className="admin-course-students">{students[c.id] ?? 0}</td>
                <td><Badge bg={c.published ? 'success' : 'secondary'} className="badge-status">{c.published ? 'Published' : 'Draft'}</Badge></td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/courses/${c.id}/edit`} className="btn btn-sm btn-outline-primary btn-edit me-1">Edit</Link>
                  <Link to={`/admin/courses/${c.id}/curriculum`} className="btn btn-sm btn-outline-secondary btn-curriculum me-1">Curriculum</Link>
                  <Button size="sm" variant="outline-danger" className="btn-delete" onClick={() => handleDelete(c)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
