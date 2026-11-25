// Lab 9.5 — LỜI GIẢI API. Chạy: LAB9_URI="mongodb://lab9Api:<mật khẩu>@127.0.0.1:47093/lab9" PORT=47092 node lab9-giai.mjs
// Nạp dữ liệu lần đầu bằng tài khoản quản trị (LAB9_SEED_URI) — tài khoản ứng dụng KHÔNG có quyền dropDatabase.
import express from 'express';
import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { napDuLieu, MA_DAT_LAI } from './lab9-du-lieu.mjs';

const bam = (mk, muoi = randomBytes(16)) => `${muoi.toString('hex')}:${scryptSync(mk, muoi, 32).toString('hex')}`;
const dung = (mk, luu) => { const [m, h] = String(luu).split(':'); return !!h && timingSafeEqual(scryptSync(mk, Buffer.from(m, 'hex'), 32), Buffer.from(h, 'hex')); };
const sha = (s) => createHash('sha256').update(s).digest('hex');

if (process.env.LAB9_SEED_URI) {                                   // bước nạp dữ liệu: quản trị, chạy rồi đóng ngay
  const sc = new MongoClient(process.env.LAB9_SEED_URI);
  const sdb = sc.db('lab9');
  await napDuLieu(sdb, (mk) => ({ matKhauBam: bam(mk) }));
  await sdb.collection('users').updateOne({ _id: 1 }, { $set: { resetBam: sha(MA_DAT_LAI), resetHet: new Date(Date.now() + 15 * 60_000) } });
  await sdb.collection('phien').createIndex({ tao: 1 }, { expireAfterSeconds: 3600 });   // phiên tự hết hạn sau 1 giờ
  await sdb.collection('users').createIndex({ email: 1 }, { unique: true });
  await sc.close();
}
const client = new MongoClient(process.env.LAB9_URI, { appName: 'lab9-api' });   // không có giá trị mặc định: thiếu biến ⇒ chết ngay
const db = client.db('lab9');
await db.command({ ping: 1 });
const users = db.collection('users'), don = db.collection('don'), phien = db.collection('phien');

class LoiVao extends Error {}
const chuoi = (v, ten, max = 200) => { if (typeof v !== 'string' || !v || v.length > max) throw new LoiVao(ten); return v; };
const thoat = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const app = express();
app.use(express.json({ limit: '10kb' }));
const canDangNhap = async (req, res, next) => {
  const p = await phien.findOne({ token: chuoi(req.get('x-token') ?? '', 'x-token', 64) });
  if (!p) return res.status(401).json({ loi: 'chua-dang-nhap' });
  req.uid = p.uid; next();
};

app.post('/dang-ky', async (req, res) => {
  const b = req.body ?? {};
  const r = await users.insertOne({ _id: Date.now(), email: chuoi(b.email, 'email'), ten: chuoi(b.ten, 'ten', 60),
    matKhauBam: bam(chuoi(b.matKhau, 'matKhau')), vaiTro: 'khach' });   // chỉ lấy đúng các trường cho phép
  res.status(201).json({ id: r.insertedId });
});
app.post('/dang-nhap', async (req, res) => {
  const email = chuoi(req.body?.email, 'email'), mk = chuoi(req.body?.matKhau, 'matKhau');
  const u = await users.findOne({ email });
  if (!u || !dung(mk, u.matKhauBam)) return res.status(401).json({ loi: 'sai-thong-tin' });
  const token = randomBytes(16).toString('hex');
  await phien.insertOne({ token, uid: u._id, tao: new Date() });
  res.json({ token, vaiTro: u.vaiTro });
});
app.post('/quen-mat-khau/kiem', async (req, res) => {
  const u = await users.findOne({ resetBam: sha(chuoi(req.body?.token, 'token', 64)), resetHet: { $gt: new Date() } }, { projection: { _id: 1 } });
  res.status(u ? 200 : 404).json({ hopLe: !!u });
});
app.post('/tra-cuu', async (req, res) => {
  const d = await don.findOne({ sdt: chuoi(req.body?.sdt, 'sdt', 15), _id: chuoi(req.body?.maDon, 'maDon', 20) },
    { projection: { sdt: 0, khach: 0 } });                        // trả ít nhất có thể cho khách vãng lai
  if (!d) return res.status(404).json({ loi: 'khong-thay' });
  res.json([d]);
});
app.get('/don/tim', canDangNhap, async (req, res) => {
  const q = chuoi(req.query.q, 'q', 40);
  res.json(await don.find({ khach: req.uid, sp: { $regex: thoat(q), $options: 'i' } }).limit(50).maxTimeMS(200).toArray());
});
app.patch('/don/:ma', canDangNhap, async (req, res) => {
  const b = req.body ?? {};
  const la = Object.keys(b).filter((k) => k !== 'ghiChu');
  if (la.length) return res.status(400).json({ loi: 'truong-khong-duoc-sua', truong: la });
  const r = await don.findOneAndUpdate({ _id: chuoi(req.params.ma, 'ma', 20), khach: req.uid },
    { $set: { ghiChu: chuoi(b.ghiChu, 'ghiChu', 300) } }, { returnDocument: 'after' });
  if (!r) return res.status(404).json({ loi: 'khong-thay' });
  res.json(r);
});
app.use((err, req, res, next) => {
  if (err instanceof LoiVao) return res.status(400).json({ loi: 'du-lieu-sai', truong: err.message });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ loi: 'json-hong' });
  if (err?.code === 50) return res.status(503).json({ loi: 'qua-thoi-gian' });
  if (err?.code === 11000) return res.status(409).json({ loi: 'da-ton-tai' });
  console.error(err); res.status(500).json({ loi: 'loi-may-chu' });
});
app.listen(Number(process.env.PORT ?? 47092), '127.0.0.1', () => console.log('lab9 lời giải chạy'));
