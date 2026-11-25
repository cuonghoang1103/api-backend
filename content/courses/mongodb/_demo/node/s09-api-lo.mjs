// Bài 9.3 — API CÓ LỖ HỔNG (cố ý, CHỈ chạy trên lab 127.0.0.1). Bản đã vá: s09-api-va.mjs.
//   node s09-api-lo.mjs            ⇒ http://127.0.0.1:47024
// Mỗi route mang một lỗi người ta hay viết thật: tin req.body/req.query là chuỗi, ghép chuỗi người dùng vào $regex,
// $set nguyên req.body, lưu mật khẩu thô.
import express from 'express';
import { client } from './db.mjs';

const users = client.db('ch9').collection('users');
await users.drop().catch(() => {});
await users.insertMany([
  { _id: 1, email: 'admin@ctshop.vn', matKhau: 'Admin-Rat-Kho-Doan-2026', ten: 'Quản trị', vaiTro: 'admin', resetToken: 'k7Qm2xR9vL4p' },
  { _id: 2, email: 'an@vd.vn', matKhau: 'an123456', ten: 'An', vaiTro: 'khach' },
  { _id: 3, email: 'binh@vd.vn', matKhau: 'binh2026', ten: 'Bình', vaiTro: 'khach' },
]);

const app = express();
if (process.env.QUERY === 'extended') app.set('query parser', 'extended');   // cấu hình hay gặp khi nâng từ Express 4
app.use(express.json());

// ✘ 1. Đăng nhập: req.body.matKhau có thể là OBJECT { "$ne": null }
app.post('/dang-nhap', async (req, res) => {
  const u = await users.findOne({ email: req.body.email, matKhau: req.body.matKhau });
  if (!u) return res.status(401).json({ loi: 'sai-thong-tin' });
  res.json({ chao: u.ten, vaiTro: u.vaiTro });
});

// ✘ 2. Kiểm mã đặt lại mật khẩu (trang quên mật khẩu gọi trước khi hiện ô nhập mật khẩu mới)
app.post('/dat-lai/kiem', async (req, res) => {
  const u = await users.findOne({ resetToken: req.body.token }, { projection: { _id: 1 } });
  res.status(u ? 200 : 404).json({ hopLe: !!u });
});
app.post('/dat-lai', async (req, res) => {
  const u = await users.findOneAndUpdate({ resetToken: req.body.token },
    { $set: { matKhau: req.body.matKhauMoi }, $unset: { resetToken: '' } });
  if (!u) return res.status(404).json({ loi: 'ma-khong-hop-le' });
  res.json({ daDoi: u.email });
});

// ✘ 3. Tra khách theo email trên query string
app.get('/khach', async (req, res) => {
  const u = await users.findOne({ email: req.query.email }, { projection: { _id: 0, email: 1, ten: 1 } });
  res.json({ q: req.query, ketQua: u });
});

// ✘ 4. Tìm theo tên: chuỗi người dùng thành biểu thức chính quy
app.get('/tim', async (req, res) => {
  const t = Date.now();
  const ds = await users.find({ ten: { $regex: req.query.q, $options: 'i' } }, { projection: { _id: 0, ten: 1 } }).toArray();
  res.json({ soKetQua: ds.length, ms: Date.now() - t });
});

// ✘ 5. Đăng ký + sửa hồ sơ: $set nguyên req.body
app.post('/dang-ky', async (req, res) => {
  const r = await users.insertOne({ ...req.body, vaiTro: 'khach' });
  res.status(201).json({ id: r.insertedId });
});
app.patch('/ho-so/:id', async (req, res) => {
  await users.updateOne({ _id: Number(req.params.id) }, { $set: req.body });
  res.json(await users.findOne({ _id: Number(req.params.id) }, { projection: { _id: 0, email: 1, ten: 1, vaiTro: 1 } }));
});

// ✘ 6. Lỗi trả nguyên message ra ngoài
app.use((err, req, res, next) => res.status(500).json({ loi: err.message }));

app.listen(47024, '127.0.0.1', () => console.log('API lỗi chạy ở 127.0.0.1:47024'));
