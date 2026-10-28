//@from F10
// src/pages/admin/AdminUsersPage.js — quản lý người dùng: tìm, khoá/mở khoá, đổi vai trò, xoá (không tự hại mình)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Form, Spinner, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import authApi from '../../api/authApi';
import enrollApi from '../../api/enrollApi';
import quizApi from '../../api/quizApi';
import { selectUser } from '../../features/auth/authSlice';

export default function AdminUsersPage() {
  const me = useSelector(selectUser);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [u, e] = await Promise.all([authApi.getAll(), enrollApi.getAll()]);
      setUsers(u);
      setEnrollments(e);
      setStatus('succeeded');
    } catch {
      setStatus('failed');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => {
    const k = search.trim().toLowerCase();
    return users.filter((u) => !k || u.fullName.toLowerCase().includes(k) || u.email.toLowerCase().includes(k));
  }, [users, search]);

  // cập nhật MỘT dòng trong state bằng bản máy chủ trả về — không tải lại cả bảng
  const patch = async (user, changes, done) => {
    setError('');
    try {
      const saved = await authApi.update(user.id, changes);
      setUsers((list) => list.map((u) => (u.id === saved.id ? saved : u)));
      setMessage(done);
    } catch {
      setError('Could not update the user.');
    }
  };

  const remove = async (user) => {
    if (!window.confirm(`Delete ${user.fullName}? Their enrolments and quiz results are deleted too.`)) return;
    setError('');
    try {
      const results = await quizApi.getResultsByUser(user.id);
      await Promise.allSettled([
        ...enrollments.filter((e) => e.userId === user.id).map((e) => enrollApi.remove(e.id)),
        ...results.map((r) => quizApi.deleteResult(r.id)),
      ]);
      await authApi.remove(user.id);
      setMessage(`${user.fullName} was deleted.`);
      load();
    } catch {
      setError('Could not delete the user.');
    }
  };

  const enrolledCount = (userId) => enrollments.filter((e) => e.userId === userId).length;

  if (status === 'loading') return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (status === 'failed') return <Alert variant="danger" id="users-load-error">Could not load users.</Alert>;

  return (
    <>
      <h2 id="admin-users-title" className="h4">Users</h2>
      {message && <Alert variant="success" id="users-success" dismissible onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert variant="danger" id="users-error">{error}</Alert>}
      <Form.Control id="user-search" type="search" placeholder="Search by name or email" className="mb-3" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Table responsive hover className="bg-white shadow-sm align-middle" id="users-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Enrolled</th><th className="text-end">Actions</th></tr>
        </thead>
        <tbody>
          {shown.map((u) => {
            const isMe = u.id === me.id;   // admin không tự khoá / tự hạ quyền / tự xoá mình
            return (
              <tr key={u.id} className="admin-user-row" id={`admin-user-${u.id}`}>
                <td className="admin-user-name">{u.fullName}{isMe && <span className="text-muted small"> (you)</span>}</td>
                <td className="admin-user-email">{u.email}</td>
                <td><Badge bg={u.role === 'admin' ? 'dark' : 'info'} className="admin-user-role">{u.role}</Badge></td>
                <td><Badge bg={u.active === false ? 'danger' : 'success'} className="admin-user-status">{u.active === false ? 'Locked' : 'Active'}</Badge></td>
                <td className="admin-user-enrolled">{enrolledCount(u.id)}</td>
                <td className="text-end text-nowrap">
                  <Button size="sm" variant="outline-warning" className="btn-toggle-lock me-1" disabled={isMe}
                    onClick={() => patch(u, { active: u.active === false }, `${u.fullName} was ${u.active === false ? 'unlocked' : 'locked'}.`)}>
                    {u.active === false ? 'Unlock' : 'Lock'}
                  </Button>
                  <Button size="sm" variant="outline-secondary" className="btn-toggle-role me-1" disabled={isMe}
                    onClick={() => patch(u, { role: u.role === 'admin' ? 'student' : 'admin' }, `${u.fullName} is now ${u.role === 'admin' ? 'a student' : 'an admin'}.`)}>
                    {u.role === 'admin' ? 'Make student' : 'Make admin'}
                  </Button>
                  <Button size="sm" variant="outline-danger" className="btn-delete-user" disabled={isMe} onClick={() => remove(u)}>Delete</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {shown.length === 0 && <Alert variant="secondary" id="no-users">No users match “{search}”.</Alert>}
    </>
  );
}
