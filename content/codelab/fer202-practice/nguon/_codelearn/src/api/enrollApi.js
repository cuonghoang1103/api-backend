//@from F5
// src/api/enrollApi.js — bảng enrollments (mọi hàm trả response.data)
import axiosClient from './axiosClient';

const enrollApi = {
  // đăng ký của một học viên + thông tin khoá (_expand=course ⇒ mỗi bản ghi có thêm .course), mới nhất trước
  getByUser: (userId) =>
    axiosClient.get('/enrollments', { params: { userId, _expand: 'course', _sort: 'enrolledAt', _order: 'desc' } }).then((res) => res.data),
  find: (userId, courseId) => axiosClient.get('/enrollments', { params: { userId, courseId } }).then((res) => res.data),
  create: (enrollment) => axiosClient.post('/enrollments', enrollment).then((res) => res.data),
//#F6
  // PATCH CHỈ trường đổi — PUT cả object sẽ ghi luôn trường "course" đã _expand vào db.json
  updateProgress: (id, completedLessons) => axiosClient.patch(`/enrollments/${id}`, { completedLessons }).then((res) => res.data),
//#end
//#F9
  getAll: () => axiosClient.get('/enrollments').then((res) => res.data),
  getByCourse: (courseId) => axiosClient.get('/enrollments', { params: { courseId } }).then((res) => res.data),
//#end
//#F10
  remove: (id) => axiosClient.delete(`/enrollments/${id}`).then((res) => res.data),
//#end
};

export default enrollApi;
