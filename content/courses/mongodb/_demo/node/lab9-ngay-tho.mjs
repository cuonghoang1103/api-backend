// Lab 9.5 — API "Tra cứu đơn CT Shop" BẢN NGÂY THƠ (cố ý có lỗ hổng — đề bài). Chạy: node lab9-ngay-tho.mjs ⇒ 127.0.0.1:47091
// URI lấy từ LAB9_URI (mặc định lab không mật khẩu 47017).
import express from 'express';
import { randomBytes } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { napDuLieu, MA_DAT_LAI } from './lab9-du-lieu.mjs';

const client = new MongoClient(process.env.LAB9_URI ?? 'mongodb://127.0.0.1:47017/lab9?directConnection=true');
const db = client.db('lab9');
await napDuLieu(db, (mk) => ({ matKhau: mk }));
await db.collection('users').updateOne({ _id: 1 }, { $set: { resetToken: MA_DAT_LAI } });
const users = db.collection('users'), don = db.collection('don'), phien = db.collection('phien');

const app = express();
app.use(express.json());
const canDangNhap = async (req, res, next) => {
  const p = await phien.findOne({ token: req.get('x-token') });
  if (!p) return res.status(401).json({ loi: 'chua-dang-nhap' });
  req.uid = p.uid; next();
};

app.post('/dang-ky', async (req, res) => {
  const r = await users.insertOne({ _id: Date.now(), ...req.body, vaiTro: 'khach' });
  res.status(201).json({ id: r.insertedId });
});
app.post('/dang-nhap', async (req, res) => {
  const u = await users.findOne({ email: req.body.email, matKhau: req.body.matKhau });
  if (!u) return res.status(401).json({ loi: 'sai-thong-tin' });
  const token = randomBytes(16).toString('hex');
  await phien.insertOne({ token, uid: u._id });
  res.json({ token, vaiTro: u.vaiTro });
});
app.post('/quen-mat-khau/kiem', async (req, res) => {
  const u = await users.findOne({ resetToken: req.body.token });
  res.status(u ? 200 : 404).json({ hopLe: !!u });
});
// Khách vãng lai tra cứu đơn bằng số điện thoại + mã đơn (không cần đăng nhập)
app.post('/tra-cuu', async (req, res) => {
  const ds = await don.find({ sdt: req.body.sdt, _id: req.body.maDon }).toArray();
  if (!ds.length) return res.status(404).json({ loi: 'khong-thay' });
  res.json(ds);
});
app.get('/don/tim', canDangNhap, async (req, res) => {
  res.json(await don.find({ khach: req.uid, sp: { $regex: req.query.q } }).toArray());
});
app.patch('/don/:ma', canDangNhap, async (req, res) => {
  const r = await don.findOneAndUpdate({ _id: req.params.ma, khach: req.uid }, { $set: req.body }, { returnDocument: 'after' });
  if (!r) return res.status(404).json({ loi: 'khong-thay' });
  res.json(r);
});
app.use((err, req, res, next) => res.status(500).json({ loi: err.message, stack: err.stack }));

app.listen(Number(process.env.PORT ?? 47091), '127.0.0.1', () => console.log('lab9 ngây thơ chạy'));
