//@from F3
// src/api/courseApi.js — categories / courses / chapters / lessons (mọi hàm trả response.data)
import axiosClient from './axiosClient';

const courseApi = {
  getCategories: () => axiosClient.get('/categories').then((res) => res.data),
  // học viên/khách chỉ thấy khoá đã xuất bản (published=true) — lọc ở MÁY CHỦ
  getPublishedCourses: () => axiosClient.get('/courses', { params: { published: true } }).then((res) => res.data),
//#F4
  getCourse: (id) => axiosClient.get(`/courses/${id}`).then((res) => res.data),
  // chương của khoá + bài học lồng bên trong bằng _embed (json-server 0.17: con có khoá chapterId)
  getCurriculum: (courseId) =>
    axiosClient.get('/chapters', { params: { courseId, _embed: 'lessons', _sort: 'order', _order: 'asc' } }).then((res) => res.data),
//#end
//#F6
  // tổng bài học của NHIỀU khoá trong một lần gọi: /lessons?courseId=1&courseId=3 (json-server hiểu là "hoặc")
  getLessonsOfCourses: (courseIds) =>
    axiosClient.get(`/lessons?${courseIds.map((id) => `courseId=${id}`).join('&')}`).then((res) => res.data),
//#end
//#F9
  // ── admin ──
  getAllCourses: () => axiosClient.get('/courses').then((res) => res.data),
  createCourse: (course) => axiosClient.post('/courses', course).then((res) => res.data),
  updateCourse: (id, changes) => axiosClient.patch(`/courses/${id}`, changes).then((res) => res.data),
  deleteCourse: (id) => axiosClient.delete(`/courses/${id}`).then((res) => res.data),
  getByCourse: (resource, courseId) => axiosClient.get(`/${resource}`, { params: { courseId } }).then((res) => res.data),
  createChapter: (chapter) => axiosClient.post('/chapters', chapter).then((res) => res.data),
  deleteChapter: (id) => axiosClient.delete(`/chapters/${id}`).then((res) => res.data),
  createLesson: (lesson) => axiosClient.post('/lessons', lesson).then((res) => res.data),
  updateLesson: (id, changes) => axiosClient.patch(`/lessons/${id}`, changes).then((res) => res.data),
  deleteLesson: (id) => axiosClient.delete(`/lessons/${id}`).then((res) => res.data),
  // xoá nhiều bản ghi con; allSettled: một cái 404 (đã bị json-server tự xoá theo khoá ngoại) không làm hỏng cả lượt
  deleteMany: (resource, ids) => Promise.allSettled(ids.map((id) => axiosClient.delete(`/${resource}/${id}`))),
//#end
};

export default courseApi;
