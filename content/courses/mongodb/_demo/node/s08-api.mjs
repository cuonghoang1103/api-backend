// Bài 8.1 — API Express 5 tối thiểu dùng db.mjs: kiểm ObjectId trước khi truy vấn, trả 400/404 đúng nghĩa,
// tắt êm khi nhận SIGTERM (đóng HTTP trước, đóng pool sau). Chạy: node s08-api.mjs   (cổng 47081)
import express from 'express';
import { ObjectId } from 'mongodb';
import { client, db } from './db.mjs';

const app = express();
app.get('/khach/:id', async (req, res) => {
  const k = await db.collection('customers').findOne({ _id: req.params.id }, { projection: { name: 1, city: 1 } });
  k ? res.json(k) : res.status(404).json({ loi: 'không có khách này' });
});
app.get('/binh-luan/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ loi: 'id không hợp lệ' });
  const b = await client.db('ch8').collection('binhLuan').findOne({ _id: new ObjectId(req.params.id) });
  b ? res.json({ ...b, gia: b.gia?.toString(), luotThich: b.luotThich?.toString() }) : res.status(404).json({ loi: 'không có' });
});
app.use((err, req, res, next) => { console.error('lỗi:', err.name); res.status(503).json({ loi: 'cơ sở dữ liệu đang bận' }); });

await client.connect();                                // lỗi cấu hình lộ ngay lúc khởi động, không phải ở request đầu tiên
const server = app.listen(47081, '127.0.0.1', () => console.log('nghe 127.0.0.1:47081'));
process.on('SIGTERM', () => {
  console.log('SIGTERM: ngừng nhận request mới');
  server.close(async () => { await client.close(); console.log('đã đóng pool MongoDB, thoát'); process.exit(0); });
});
