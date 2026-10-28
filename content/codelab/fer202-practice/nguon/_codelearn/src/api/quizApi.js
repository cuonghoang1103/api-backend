//@from F7
// src/api/quizApi.js — questions + results (mọi hàm trả response.data)
// ⚠ json-server trả cả answerIndex về trình duyệt — máy chủ thật phải chấm ở server và giấu đáp án.
import axiosClient from './axiosClient';

const quizApi = {
  getChapter: (id) => axiosClient.get(`/chapters/${id}`).then((res) => res.data),
  getQuestions: (chapterId) => axiosClient.get('/questions', { params: { chapterId, _sort: 'id' } }).then((res) => res.data),
  saveResult: (result) => axiosClient.post('/results', result).then((res) => res.data),
//#F8
  // lịch sử làm bài của MỘT học viên, kèm tên chương (_expand=chapter), mới nhất trước
  getResultsByUser: (userId) =>
    axiosClient.get('/results', { params: { userId, _expand: 'chapter', _sort: 'submittedAt', _order: 'desc' } }).then((res) => res.data),
//#end
//#F9
  getByCourse: (courseId) => axiosClient.get('/questions', { params: { courseId } }).then((res) => res.data),
//#end
//#F10
  // ── admin ──
  createQuestion: (question) => axiosClient.post('/questions', question).then((res) => res.data),
  updateQuestion: (id, question) => axiosClient.put(`/questions/${id}`, question).then((res) => res.data),
  deleteQuestion: (id) => axiosClient.delete(`/questions/${id}`).then((res) => res.data),
  deleteResult: (id) => axiosClient.delete(`/results/${id}`).then((res) => res.data),
//#end
//#F11
  getAllResults: () => axiosClient.get('/results').then((res) => res.data),
//#end
};

export default quizApi;
