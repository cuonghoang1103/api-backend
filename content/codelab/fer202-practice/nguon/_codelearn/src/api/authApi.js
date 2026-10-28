//@from F2
// src/api/authApi.js — bảng users trên json-server (mọi hàm trả response.data)
// ⚠ json-server KHÔNG phải máy chủ xác thực thật: mật khẩu nằm trần trong db.json — chỉ để học.
import axiosClient from './axiosClient';

const authApi = {
  // GET /users?email=... — json-server lọc khớp CHÍNH XÁC (phân biệt hoa/thường) ⇒ luôn lưu & tìm email chữ thường
  findByEmail: (email) => axiosClient.get('/users', { params: { email } }).then((res) => res.data),
  create: (user) => axiosClient.post('/users', user).then((res) => res.data),
//#F10
  getAll: () => axiosClient.get('/users').then((res) => res.data),
  // PATCH chỉ gửi trường đổi (active / role) — không ghi đè cả bản ghi
  update: (id, changes) => axiosClient.patch(`/users/${id}`, changes).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/users/${id}`).then((res) => res.data),
//#end
};

export default authApi;
