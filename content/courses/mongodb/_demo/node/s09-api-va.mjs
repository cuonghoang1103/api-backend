// Bài 9.3 — CÙNG API với s09-api-lo.mjs nhưng đã vá. node s09-api-va.mjs ⇒ http://127.0.0.1:47025
// Năm lớp: (1) kiểm KIỂU từng trường đầu vào, (2) không so mật khẩu trong truy vấn — băm scrypt + so hằng thời gian,
// (3) mã đặt lại lưu dạng băm + có hạn, (4) regex: thoát ký tự + giới hạn độ dài + maxTimeMS, (5) chỉ nhận trường trong danh sách cho phép.
import express from 'express';
import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { client } from './db.mjs';

const users = client.db('ch9').collection('users');
const bam = (mk, muoi = randomBytes(16)) => `${muoi.toString('hex')}:${scryptSync(mk, muoi, 32).toString('hex')}`;
const dung = (mk, luu) => { const [m, h] = luu.split(':'); return timingSafeEqual(scryptSync(mk, Buffer.from(m, 'hex'), 32), Buffer.from(h, 'hex')); };
const sha = (s) => createHash('sha256').update(s).digest('hex');

await users.drop().catch(() => {});
await users.insertMany([
  { _id: 1, email: 'admin@ctshop.vn', matKhauBam: bam('Admin-Rat-Kho-Doan-2026'), ten: 'Quản trị', vaiTro: 'admin',
    resetBam: sha('k7Qm2xR9vL4p'), resetHet: new Date(Date.now() + 15 * 60_000) },
  { _id: 2, email: 'an@vd.vn', matKhauBam: bam('an123456'), ten: 'An', vaiTro: 'khach' },
  { _id: 3, email: 'binh@vd.vn', matKhauBam: bam('binh2026'), ten: 'Bình', vaiTro: 'khach' },
]);

class LoiVao extends Error {}
// (1) Lấy một trường CHUỖI, có giới hạn độ dài — object/mảng/số ⇒ 400 ngay ở cửa
const chuoi = (v, ten, max = 200) => {
  if (typeof v !== 'string' || v.length === 0 || v.length > max) throw new LoiVao(ten);
  return v;
};
const thoatRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const app = express();
app.use(express.json({ limit: '10kb' }));

app.post('/dang-nhap', async (req, res) => {
  const email = chuoi(req.body?.email, 'email'), mk = chuoi(req.body?.matKhau, 'matKhau');
  const u = await users.findOne({ email });                         // (2) chỉ tìm theo email
  if (!u || !dung(mk, u.matKhauBam)) return res.status(401).json({ loi: 'sai-thong-tin' });   // cùng một câu cho cả hai trường hợp
  res.json({ chao: u.ten, vaiTro: u.vaiTro });
});

app.post('/dat-lai/kiem', async (req, res) => {
  const tk = chuoi(req.body?.token, 'token', 64);
  const u = await users.findOne({ resetBam: sha(tk), resetHet: { $gt: new Date() } }, { projection: { _id: 1 } });   // (3)
  res.status(u ? 200 : 404).json({ hopLe: !!u });
});
app.post('/dat-lai', async (req, res) => {
  const tk = chuoi(req.body?.token, 'token', 64), moi = chuoi(req.body?.matKhauMoi, 'matKhauMoi');
  const u = await users.findOneAndUpdate({ resetBam: sha(tk), resetHet: { $gt: new Date() } },
    { $set: { matKhauBam: bam(moi) }, $unset: { resetBam: '', resetHet: '' } });
  if (!u) return res.status(404).json({ loi: 'ma-khong-hop-le' });
  res.json({ daDoi: true });
});

app.get('/khach', async (req, res) => {
  const email = chuoi(req.query.email, 'email');
  res.json({ ketQua: await users.findOne({ email }, { projection: { _id: 0, email: 1, ten: 1 } }) });
});

app.get('/tim', async (req, res) => {
  const q = chuoi(req.query.q, 'q', 40);                            // (4)
  const t = Date.now();
  const ds = await users.find({ ten: { $regex: '^' + thoatRegex(q), $options: 'i' } }, { projection: { _id: 0, ten: 1 } })
    .limit(20).maxTimeMS(200).toArray();
  res.json({ soKetQua: ds.length, ms: Date.now() - t });
});

const CHO_PHEP = ['ten', 'sdt'];                                    // (5) danh sách cho phép, không phải danh sách cấm
app.post('/dang-ky', async (req, res) => {
  const r = await users.insertOne({ email: chuoi(req.body?.email, 'email'), ten: chuoi(req.body?.ten, 'ten', 60), vaiTro: 'khach' });
  res.status(201).json({ id: r.insertedId });
});
app.patch('/ho-so/:id', async (req, res) => {
  const $set = {};
  for (const k of CHO_PHEP) if (k in (req.body ?? {})) $set[k] = chuoi(req.body[k], k, 60);
  const la = Object.keys(req.body ?? {}).filter((k) => !CHO_PHEP.includes(k));
  if (la.length) return res.status(400).json({ loi: 'truong-khong-duoc-sua', truong: la });
  await users.updateOne({ _id: Number(req.params.id) }, { $set });
  res.json(await users.findOne({ _id: Number(req.params.id) }, { projection: { _id: 0, email: 1, ten: 1, vaiTro: 1 } }));
});

app.use((err, req, res, next) => {
  if (err instanceof LoiVao) return res.status(400).json({ loi: 'du-lieu-sai', truong: err.message });
  if (err?.code === 50) return res.status(503).json({ loi: 'qua-thoi-gian' });   // MaxTimeMSExpired
  console.error(err); res.status(500).json({ loi: 'loi-may-chu' });              // (6) không trả err.message ra ngoài
});

app.listen(47025, '127.0.0.1', () => console.log('API đã vá chạy ở 127.0.0.1:47025'));
