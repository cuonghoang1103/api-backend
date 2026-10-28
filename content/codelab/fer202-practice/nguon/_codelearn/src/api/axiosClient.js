// src/api/axiosClient.js — MỘT chỗ duy nhất biết địa chỉ API (ĐÃ CHO SẴN)
// Đọc từ .env (REACT_APP_API_URL) — không viết cứng "http://localhost:9999" ở bất kỳ đâu khác.
// ⚠ CRA chỉ đọc .env lúc `npm start` khởi động: sửa .env thì phải tắt và chạy lại.
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Quy ước của dự án: mỗi hàm trong src/api/*.js tự trả `response.data`
// (không dựa vào interceptor để "bóc" data — đọc code là thấy ngay hàm trả gì).
export default axiosClient;
