// Bài 10.2 — giả lập một tác vụ "báo cáo đêm" viết ẩu: mỗi lần chạy tạo MongoClient mới với minPoolSize 50 và KHÔNG close().
// Ba lần chạy chồng nhau ⇒ 150 kết nối nằm im. Dùng để luyện câu hỏi trực ca: "ai đang giữ kết nối?"
//   node giu-ket-noi.mjs 30      (giữ 30 giây rồi thoát)
import { MongoClient } from 'mongodb';
const URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/?directConnection=true';
const clients = [];
for (let lan = 1; lan <= 3; lan++) {
  const c = new MongoClient(URI, { appName: 'bao-cao-dem', minPoolSize: 50, maxPoolSize: 50 });
  await c.db('ctshop').command({ ping: 1 });
  clients.push(c);                                   // lỗi cố ý: không bao giờ gọi c.close()
}
setTimeout(() => process.exit(0), Number(process.argv[2] ?? 30) * 1000);
