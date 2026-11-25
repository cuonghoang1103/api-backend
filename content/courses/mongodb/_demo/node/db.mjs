// Bài 8.1 — MỘT MongoClient cho cả tiến trình: tạo ở mô-đun này, mọi route import dùng chung.
// URI lấy từ biến môi trường (không ghi mật khẩu vào mã); mặc định là lab 127.0.0.1:47017.
import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/ctshop?directConnection=true', {
  maxPoolSize: Number(process.env.MONGO_POOL ?? 20),   // nhân với số bản ứng dụng phải < trần máy chủ
  waitQueueTimeoutMS: 2000,                            // chờ kết nối quá 2 s ⇒ báo lỗi nhanh thay vì treo request
  appName: 'ctshop-api',                               // hiện trong log/currentOp của máy chủ ⇒ biết ai đang gọi
});
export const db = client.db();                         // database lấy từ URI (ctshop)
