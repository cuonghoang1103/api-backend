/**
 * 9.5 — Lab: đột nhập một API có lỗ hổng rồi vá (soạn 24/11/2026, agent mgo). SINH bởi scratchpad/mgo/tmp/dung-lab9.py từ tmp/lab9-khung.mjs.
 * Output thật: ../_ma.mjs OUT['s09-5-lab'] (kịch bản demo/s09/s09-5-lab.txt): 0 bản ngây thơ 2/15 · 1 dựng mgo-lab9 · 2 tu-kiem trên mgo-lab9 · 3 lời giải 15/15.
 * Mã chép NGUYÊN từ _demo/node/lab9-thu.mjs, lab9-ngay-tho.mjs, lab9-du-lieu.mjs, lab9-giai.mjs, _demo/lab9-may-chu.sh. Mọi tấn công chỉ nhắm 127.0.0.1.
 */
import { lenh, ma, loiGiai } from '../_chung.mjs';

const K = 's09-5-lab';
const THU = `// Lab 9.5 — bộ kiểm: TẤN CÔNG bản API của bạn (chỉ lab 127.0.0.1) + soát cấu hình máy chủ MongoDB.
//   node lab9-thu.mjs <URL API> <URI quản trị MongoDB>
//   vd: node lab9-thu.mjs http://127.0.0.1:47091 mongodb://127.0.0.1:47017/?directConnection=true
//       node lab9-thu.mjs http://127.0.0.1:47092 "mongodb://quantri:<mật khẩu>@127.0.0.1:47093/?authSource=admin"
// Khởi động lại API trước mỗi lượt kiểm (API tự nạp lại dữ liệu lab9).
import { MongoClient } from 'mongodb';
import { TAI_KHOAN, MA_DAT_LAI } from './lab9-du-lieu.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:47091';
const ADMIN = process.argv[3] ?? 'mongodb://127.0.0.1:47017/?directConnection=true';
let dat = 0, tong = 0;
const kiem = (ten, dung, chiTiet = '') => { tong++; if (dung) dat++; console.log(\`\${dung ? '✔' : '✘'} \${ten}\${dung ? '' : '  ← ' + String(chiTiet).slice(0, 110)}\`); };
const goi = async (method, path, body, token, tho) => {
  const t = Date.now();
  const r = await fetch(BASE + path, { method, headers: { 'content-type': 'application/json', ...(token && { 'x-token': token }) },
    body: tho ?? (body && JSON.stringify(body)) });
  const text = await r.text(); let j = null; try { j = JSON.parse(text); } catch {}
  return { s: r.status, j, text, ms: Date.now() - t };
};

console.log('— API —');
let r = await goi('POST', '/dang-nhap', { email: 'an@vd.vn', matKhau: 'an123456' });
const tkAn = r.j?.token;
kiem('A1 đăng nhập đúng ⇒ 200 + token', r.s === 200 && !!tkAn, r.text);
r = await goi('POST', '/dang-nhap', { email: 'admin@ctshop.vn', matKhau: { $ne: null } });
kiem('A2 matKhau {"$ne":null} ⇒ bị từ chối, không token', r.s >= 400 && r.s < 500 && !r.j?.token, \`\${r.s} \${r.text}\`);
r = await goi('POST', '/dang-nhap', { email: { $regex: '^adm' }, matKhau: { $gt: '' } });
kiem('A3 email {"$regex"} + matKhau {"$gt":""} ⇒ bị từ chối', r.s >= 400 && r.s < 500 && !r.j?.token, \`\${r.s} \${r.text}\`);
r = await goi('POST', '/quen-mat-khau/kiem', { token: { $regex: '^k' } });
const r2 = await goi('POST', '/quen-mat-khau/kiem', { token: MA_DAT_LAI });
kiem('A4 mã đặt lại {"$regex":"^k"} ⇒ 400; mã thật ⇒ 200', r.s === 400 && r2.s === 200, \`\${r.s} / \${r2.s}\`);
r = await goi('POST', '/tra-cuu', { sdt: '0901000002', maDon: { $ne: null } });
const r3 = await goi('POST', '/tra-cuu', { sdt: '0901000002', maDon: 'DH001' });
kiem('A5 tra cứu maDon {"$ne":null} ⇒ không lộ đơn; đúng mã ⇒ 1 đơn', !Array.isArray(r.j) && r.s >= 400 && r3.s === 200 && JSON.stringify(r3.j).includes('DH001') && !JSON.stringify(r3.j).includes('DH003'),
  \`\${r.s} \${r.text.slice(0, 60)} / \${r3.s}\`);
r = await goi('POST', '/dang-nhap', { email: 'binh@vd.vn', matKhau: 'binh2026' });
const tkBinh = r.j?.token;
r = await goi('GET', '/don/tim?q=' + encodeURIComponent('(a+)+$'), null, tkBinh);
const r4 = await goi('GET', '/don/tim?q=' + encodeURIComponent('a.'), null, tkBinh);
const r5 = await goi('GET', '/don/tim?q=' + encodeURIComponent('Giày'), null, tkBinh);
kiem('A6 tìm "(a+)+$" < 100 ms; "a." là chữ thường (0 kết quả); "Giày" ⇒ 1', r.s === 200 && r.ms < 100 && r4.j?.length === 0 && r5.j?.length === 1,
  \`(a+)+$ \${r.s} \${r.ms} ms · a. \${r4.j?.length} · Giày \${r5.j?.length}\`);
r = await goi('PATCH', '/don/DH001', { trangThai: 'DA_THANH_TOAN' }, tkAn);
const r6 = await goi('PATCH', '/don/DH001', { ghiChu: 'giao giờ hành chính' }, tkAn);
const r7 = await goi('PATCH', '/don/DH002', { ghiChu: 'x' }, tkAn);
kiem('A7 PATCH trangThai ⇒ 400; ghiChu ⇒ 200; đơn người khác ⇒ 404', r.s === 400 && r6.s === 200 && r7.s === 404, \`\${r.s} / \${r6.s} / \${r7.s}\`);
r = await goi('POST', '/dang-ky', { email: 'moi@vd.vn', matKhau: 'Mat-Khau-Moi-2026', ten: 'Mới', vaiTro: 'admin' });
const r8 = await goi('POST', '/dang-nhap', { email: 'moi@vd.vn', matKhau: 'Mat-Khau-Moi-2026' });
kiem('A8 đăng ký gửi kèm vaiTro admin ⇒ vẫn là khach, đăng nhập được', r.s === 201 && r8.s === 200 && r8.j?.vaiTro === 'khach', \`\${r.s} / \${r8.s} \${r8.text}\`);
r = await goi('POST', '/dang-nhap', null, null, '{"email": "an@vd.vn", ');
kiem('A9 JSON hỏng ⇒ 400, không lộ stack/đường dẫn', r.s === 400 && !/node_modules|\\bat \\w|stack/.test(r.text), \`\${r.s} \${r.text}\`);

console.log('— Dữ liệu + máy chủ —');
const ad = new MongoClient(ADMIN, { serverSelectionTimeoutMS: 3000 });
await ad.connect();
const users = await ad.db('lab9').collection('users').find().toArray();
const tho = [...TAI_KHOAN.map((u) => u.matKhau), 'Mat-Khau-Moi-2026'];
const loThu = users.filter((u) => Object.values(u).some((v) => tho.includes(v)));
kiem('D1 không tài liệu users nào chứa mật khẩu thô', users.length >= 4 && loThu.length === 0, \`\${loThu.length}/\${users.length} tài liệu lộ: \${loThu.map((u) => u.email).join(', ')}\`);
const d1 = await ad.db('lab9').collection('don').findOne({ _id: 'DH001' });
kiem('D2 DH001 vẫn CHO_THANH_TOAN sau A7', d1?.trangThai === 'CHO_THANH_TOAN', d1?.trangThai);

const u = new URL(ADMIN.replace(/^mongodb:\\/\\/[^@/]*@/, 'mongodb://'));
const vo = new MongoClient(\`mongodb://\${u.host}/?directConnection=true\`, { serverSelectionTimeoutMS: 3000 });
const voDanh = await vo.db('admin').command({ listDatabases: 1 }).then(() => 'đọc được danh sách database', (e) => e.codeName ?? e.message);
kiem('S1 client không mật khẩu bị từ chối', voDanh !== 'đọc được danh sách database', voDanh);
await vo.close();
const o = (await ad.db('admin').command({ getCmdLineOpts: 1 })).parsed;
kiem('S2 noscripting + không zlib', o.security?.javascriptEnabled === false && !String(o.net?.compression?.compressors ?? 'zlib').includes('zlib'),
  \`javascriptEnabled=\${o.security?.javascriptEnabled} compressors=\${o.net?.compression?.compressors ?? 'mặc định'}\`);
const info = (await ad.db('admin').command({ usersInfo: { user: 'lab9Api', db: 'lab9' }, showPrivileges: true })).users[0];
const hd = new Set((info?.inheritedPrivileges ?? []).flatMap((p) => p.actions));
const nguy = ['dropCollection', 'dropDatabase', 'createIndex', 'dropIndex', 'createCollection', 'collMod', 'createUser', 'grantRole'].filter((a) => hd.has(a));
kiem('S3 user lab9Api có find/insert/update, KHÔNG có quyền xoá collection/index/user', !!info && ['find', 'insert', 'update'].every((a) => hd.has(a)) && nguy.length === 0,
  info ? \`quyền thừa: \${nguy.join(', ') || '(không)'}; thiếu: \${['find', 'insert', 'update'].filter((a) => !hd.has(a)).join(', ')}\` : 'chưa có user lab9Api trong database lab9');
const phien = info && (await ad.db('admin').command({ currentOp: 1, $all: true })).inprog.filter((x) => x.effectiveUsers?.some((e) => e.user === 'lab9Api')).length;
kiem('S4 API đang kết nối bằng lab9Api (thấy trong currentOp)', phien > 0, \`\${phien ?? 0} kết nối của lab9Api\`);
await ad.close();
console.log(\`ĐIỂM: \${dat}/\${tong}\`);`;
const NGAY = `// Lab 9.5 — API "Tra cứu đơn CT Shop" BẢN NGÂY THƠ (cố ý có lỗ hổng — đề bài). Chạy: node lab9-ngay-tho.mjs ⇒ 127.0.0.1:47091
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

app.listen(Number(process.env.PORT ?? 47091), '127.0.0.1', () => console.log('lab9 ngây thơ chạy'));`;
const DULIEU = `// Lab 9.5 — dữ liệu mẫu DÙNG CHUNG cho bản ngây thơ và bản của bạn. API gọi napDuLieu(db, bam) lúc khởi động.
// bam(matKhau) do API truyền vào: bản ngây thơ truyền (x) => x (lưu thô), bản đúng truyền hàm băm của mình.
// Trường lưu mật khẩu tên gì là việc của bạn — hàm trả về đối tượng { [tenTruong]: giaTri } qua bam().
export const TAI_KHOAN = [
  { _id: 1, email: 'admin@ctshop.vn', matKhau: 'Admin-Rat-Kho-Doan-2026', ten: 'Quản trị', vaiTro: 'admin' },
  { _id: 2, email: 'an@vd.vn', matKhau: 'an123456', ten: 'An', vaiTro: 'khach' },
  { _id: 3, email: 'binh@vd.vn', matKhau: 'binh2026', ten: 'Bình', vaiTro: 'khach' },
];
export const MA_DAT_LAI = 'k7Qm2xR9vL4p';     // mã đặt lại mật khẩu đang chờ của admin (gửi qua email thật trong đời thực)

export async function napDuLieu(db, bam) {
  await db.dropDatabase();
  await db.collection('users').insertMany(TAI_KHOAN.map(({ matKhau, ...u }) => ({ ...u, ...bam(matKhau) })));
  await db.collection('don').insertMany([
    { _id: 'DH001', khach: 2, sdt: '0901000002', sp: 'Áo thun', tong: 199000, trangThai: 'CHO_THANH_TOAN', ghiChu: '' },
    { _id: 'DH002', khach: 3, sdt: '0901000003', sp: 'Giày', tong: 899000, trangThai: 'CHO_THANH_TOAN', ghiChu: '' },
    { _id: 'DH003', khach: 2, sdt: '0901000002', sp: 'Mũ', tong: 99000, trangThai: 'DA_GIAO', ghiChu: '' },
    ...Array.from({ length: 300 }, (_, i) => ({ _id: \`DX\${String(i).padStart(3, '0')}\`, khach: 3, sdt: '0901000003',
      sp: 'a'.repeat(20) + '!', tong: 1000, trangThai: 'DA_GIAO', ghiChu: '' })),
  ]);
}`;
const GIAI = `// Lab 9.5 — LỜI GIẢI API. Chạy: LAB9_URI="mongodb://lab9Api:<mật khẩu>@127.0.0.1:47093/lab9" PORT=47092 node lab9-giai.mjs
// Nạp dữ liệu lần đầu bằng tài khoản quản trị (LAB9_SEED_URI) — tài khoản ứng dụng KHÔNG có quyền dropDatabase.
import express from 'express';
import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { napDuLieu, MA_DAT_LAI } from './lab9-du-lieu.mjs';

const bam = (mk, muoi = randomBytes(16)) => \`\${muoi.toString('hex')}:\${scryptSync(mk, muoi, 32).toString('hex')}\`;
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
const thoat = (s) => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');

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
app.listen(Number(process.env.PORT ?? 47092), '127.0.0.1', () => console.log('lab9 lời giải chạy'));`;
const MAYCHU = `#!/usr/bin/env bash
# Lab 9.5 — LỜI GIẢI phần máy chủ: dựng mgo-lab9 đã khoá + tài khoản quyền tối thiểu cho API.
#   export LAB9_ADMIN_PW=$(openssl rand -base64 24) LAB9_API_PW=$(openssl rand -hex 24)   # mật khẩu dài, ngẫu nhiên, không ghi vào mã
#   bash lab9-may-chu.sh up | down
set -euo pipefail
: "\${LAB9_ADMIN_PW:?đặt LAB9_ADMIN_PW}" "\${LAB9_API_PW:?đặt LAB9_API_PW}"
case "\${1:-up}" in
up)
  docker rm -f mgo-lab9 >/dev/null 2>&1 || true
  docker run -d --name mgo-lab9 -p 127.0.0.1:47093:27017 mongo:8.0 \\
    mongod --auth --bind_ip_all --noscripting --networkMessageCompressors snappy,zstd >/dev/null
  until docker exec mgo-lab9 mongosh --quiet --eval 'db.runCommand({ ping: 1 }).ok' >/dev/null 2>&1; do sleep 1; done
  # localhost exception: chỉ từ TRONG container, chỉ để tạo user đầu tiên. Mật khẩu qua biến môi trường, không nằm trên dòng lệnh của tiến trình.
  docker exec -e PW="$LAB9_ADMIN_PW" mgo-lab9 mongosh --quiet admin --eval \\
    'db.createUser({ user: "quantri", pwd: process.env.PW, roles: ["root"] }); print("tạo quantri: ok")'
  docker exec -e PW="$LAB9_ADMIN_PW" -e APW="$LAB9_API_PW" mgo-lab9 sh -c \\
    'mongosh --quiet -u quantri -p "$PW" --authenticationDatabase admin lab9 --eval "
      db.createRole({ role: \\"lab9Ung\\", roles: [], privileges: [
        { resource: { db: \\"lab9\\", collection: \\"\\" }, actions: [\\"find\\", \\"insert\\", \\"update\\"] } ] });
      db.createUser({ user: \\"lab9Api\\", pwd: process.env.APW, roles: [\\"lab9Ung\\"] });
      print(\\"tạo vai trò lab9Ung + user lab9Api: ok\\")"'
  ;;
down) docker rm -f mgo-lab9 >/dev/null; echo "đã xoá mgo-lab9" ;;
esac`;

const CHAY = `cd _demo
# 1) bản ngây thơ trên lab không mật khẩu
node node/lab9-ngay-tho.mjs &                                   # 127.0.0.1:47091
node node/lab9-thu.mjs http://127.0.0.1:47091 "mongodb://127.0.0.1:47017/?directConnection=true"
# 2) bản của bạn: máy chủ mgo-lab9 (127.0.0.1:47093) + API của bạn ở 47092
node node/lab9-thu.mjs http://127.0.0.1:47092 "mongodb://quantri:<mật khẩu đã mã hoá URL>@127.0.0.1:47093/?authSource=admin"`;

export default {
  title: '9.5 — Lab: break into a vulnerable API, then fix it|||9.5 — Lab: đột nhập một API có lỗ hổng rồi vá',
  slug: 'mgo-9-5-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab chương 9 trên chính máy bạn (127.0.0.1): API "Tra cứu đơn CT Shop" viết ngây thơ đạt 2/15 điểm kiểm — đăng nhập admin bằng {"$ne":null} và $regex, lộ mã đặt lại, khách vãng lai xem được đơn người khác, regex làm chậm 0,6 s, sửa được trạng thái đơn thành đã thanh toán, lưu mật khẩu thô, lộ stack, máy chủ không mật khẩu. Bạn vá cả hai tầng: ứng dụng (kiểm kiểu, băm scrypt, mã đặt lại băm + có hạn, thoát regex + maxTimeMS, danh sách trường cho phép, lỗi gọn) và máy chủ (mgo-lab9 với --auth, --noscripting, bỏ zlib, tài khoản lab9Api chỉ find/insert/update). Bộ kiểm 15 mục tự tấn công + soát cấu hình; rubric 10 điểm, câu hỏi bảo vệ, lời giải che đạt 15/15.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5 · Lab</span>
<h2>Lab: break into a vulnerable API, then fix it</h2>
<p class="lead">CT Shop's order-lookup API was written in a hurry: guests look up an order by phone number and order code, customers search and annotate their own orders, and there is a password-reset flow. A short security review is due before the client's go-live. Your job: run the attack suite against it, read every failure, then deliver a fixed API <em>and</em> a hardened database server that pass all 15 checks. Everything runs on 127.0.0.1 against containers you own.</p>

<h3>Setup</h3>
<ul>
<li>Lab from Lesson 0.2 running (<code>mgo-lab</code>, 127.0.0.1:47017), Node 22, <code>_demo/node</code> with <code>npm install</code> done.</li>
<li>Files: <code>node/lab9-du-lieu.mjs</code> (shared seed: 3 accounts, 3 real orders, 300 orders of customer 3 named "aaaa…!"), <code>node/lab9-ngay-tho.mjs</code> (the vulnerable API), <code>node/lab9-thu.mjs</code> (the test suite).</li>
<li>Restart the API before each test run — it reseeds the <code>lab9</code> database on start.</li>
</ul>
${ma('bash', CHAY)}
<details><summary>Show the shared seed (lab9-du-lieu.mjs)</summary>
${ma('js', DULIEU)}
</details>
<details><summary>Show the vulnerable API (lab9-ngay-tho.mjs)</summary>
${ma('js', NGAY)}
</details>
<details><summary>Show the test suite (lab9-thu.mjs)</summary>
${ma('js', THU)}
</details>
${lenh(K, 0)}
<p>The vulnerable version passes 2 checks out of 15. Every ✘ line says what the attack got back: admin tokens from <code>{"$ne": null}</code> and <code>$regex</code> logins, a reset code check that answers 200 to a pattern, a guest lookup that returns all orders of a phone number, a 635 ms regex search, an order marked paid by its customer, plaintext passwords in four documents, a stack trace in the response, and a server that anyone can query.</p>

<h3>Tasks</h3>
<ol>
<li><strong>Server.</strong> Write a script that starts <code>mgo-lab9</code> on 127.0.0.1:47093 with authorization, server-side JavaScript disabled and without zlib; creates an administrator through the localhost exception; creates the user <code>lab9Api</code> in database <code>lab9</code> with a custom role that can only find, insert and update. Passwords come from environment variables, are long and random, and never appear in the script.</li>
<li><strong>Seeding.</strong> The API account must not be able to drop the database, so the seed (<code>napDuLieu</code>) has to run with the administrator account, separately from the running API.</li>
<li><strong>Login and register.</strong> Type-check every field; store passwords as salted hashes (scrypt or bcrypt) compared outside the query; registration accepts only <code>email, ten, matKhau</code>.</li>
<li><strong>Password reset.</strong> Store the reset code hashed, with an expiry; a non-string code is a 400.</li>
<li><strong>Guest lookup.</strong> Both fields must be strings; return at most one order and as few fields as possible.</li>
<li><strong>Search.</strong> User text is literal (escaped), length-limited, with <code>maxTimeMS</code> and a result limit; must answer under 100 ms on the 300 "aaaa…!" orders.</li>
<li><strong>Annotate an order.</strong> Only <code>ghiChu</code> may change; anything else is a 400; another customer's order is a 404.</li>
<li><strong>Errors.</strong> Malformed JSON is a 400; no message, stack or path ever leaves the server.</li>
</ol>

<h3>Rubric (10 points)</h3>
<table>
<tr><th>Points</th><th>Checks</th><th>What it proves</th></tr>
<tr><td>1</td><td>A2 + A3</td><td>Operator injection on login is blocked at the door</td></tr>
<tr><td>1</td><td>A4</td><td>Reset code: no oracle, real code still works</td></tr>
<tr><td>1</td><td>A5</td><td>Guest lookup leaks nothing with an object; exact lookup works</td></tr>
<tr><td>1</td><td>A6</td><td>Regex is literal and bounded (&lt; 100 ms), Vietnamese search still works</td></tr>
<tr><td>1</td><td>A7 + D2</td><td>Status cannot be changed by the customer, notes can; ownership enforced</td></tr>
<tr><td>0.5 + 0.5</td><td>A8 · A9</td><td>Register ignores <code>vaiTro</code> · malformed JSON is a clean 400</td></tr>
<tr><td>1</td><td>D1</td><td>No plaintext password in any document</td></tr>
<tr><td>1</td><td>S1</td><td>Anonymous clients are refused</td></tr>
<tr><td>1</td><td>S2</td><td>--noscripting and no zlib</td></tr>
<tr><td>1</td><td>S3 + S4</td><td>Least-privilege API account, actually used by the running API</td></tr>
</table>
<p>A1 (normal login works) is a gate: if it fails, the submission scores 0 — a secure API that nobody can use is not a fix.</p>

<h3>Defence questions</h3>
<ol>
<li>Your login now rejects objects. Show one other endpoint where the same bug would reappear if a teammate added it tomorrow, and the code review rule that prevents it.</li>
<li>Why does the API account have no <code>remove</code> and no <code>createIndex</code>? Who creates the TTL index on <code>phien</code>?</li>
<li>The suite sends 300 "aaaa…!" orders. What would happen on 3 million, with and without <code>maxTimeMS</code>?</li>
<li>Your reset code is stored as SHA-256 but passwords use scrypt. Why is a fast hash acceptable for one and not the other?</li>
<li>The database still listens on <code>*</code> inside the container (tu-kiem shows bindIp as an error). Is that a problem here? What would you change on a real server?</li>
</ol>

<h3>Solution</h3>
${loiGiai('Show the server script (lab9-may-chu.sh)', ma('bash', MAYCHU))}
${loiGiai('Show the fixed API (lab9-giai.mjs)', ma('js', GIAI))}
${loiGiai('Show the run: self-check on mgo-lab9 and 15/15', `${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>tu-kiem on mgo-lab9: authorization, patch level, compressors and JavaScript are OK; bindIp is <code>*</code> because the container must accept the forwarded port (the host only publishes 127.0.0.1); TLS is left for the extension below. The suite passes 15/15.</p>
<p>Defence answers in short: (1) any new endpoint taking <code>req.body</code> into a filter — rule: "all inputs through a schema/typed helper, no raw req.body in queries", enforced in review and by a lint rule; (2) the API never needs to delete documents (sessions expire by TTL, run by the server itself) or change indexes — the seed/migration step does that with the admin account; (3) without maxTimeMS a single request scans millions of documents at ~2 ms each = hours of CPU; with escaping the pattern is literal, with maxTimeMS the worst case is 200 ms then 503; (4) reset codes are long random values — nobody can brute-force 72 bits; passwords are chosen by humans and short, so they need a slow, salted hash; (5) inside Docker the container network is the boundary; on a VM, bindIp should be 127.0.0.1 plus the private interface only.</p>`)}

<h3>Extensions</h3>
<ul>
<li>Add TLS to mgo-lab9 with the CA from Lesson 9.4 and make tu-kiem print 6/6 OK.</li>
<li>Add an audit collection: every PATCH writes who/what/before/after in the same transaction; give lab9Api insert-only on it.</li>
<li>Port the fixed API to Spring Boot with DTOs and run the same suite against it (Lesson 8.5 shows the pattern).</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5 · Lab</span>
<h2>Lab: đột nhập một API có lỗ hổng rồi vá</h2>
<p class="lead">API tra cứu đơn của CT Shop được viết vội. Khách vãng lai tra đơn bằng số điện thoại và mã đơn, khách đăng nhập tìm và ghi chú đơn của mình, và có cả luồng đặt lại mật khẩu. Trước ngày chạy thật của khách hàng có một buổi soát bảo mật ngắn. Việc của bạn: chạy bộ tấn công vào API, đọc từng lỗi, rồi giao một API đã vá <em>và</em> một máy chủ database đã khoá, qua đủ 15 mục kiểm. Mọi thứ chạy ở 127.0.0.1, trên các container của chính bạn.</p>

<h3>Chuẩn bị</h3>
<ul>
<li>Lab từ Bài 0.2 đang chạy (<code>mgo-lab</code>, 127.0.0.1:47017), có Node 22, đã <code>npm install</code> trong <code>_demo/node</code>.</li>
<li>Các tệp: <code>node/lab9-du-lieu.mjs</code> (dữ liệu dùng chung: 3 tài khoản, 3 đơn thật, 300 đơn của khách số 3 tên "aaaa…!"), <code>node/lab9-ngay-tho.mjs</code> (API có lỗ hổng), <code>node/lab9-thu.mjs</code> (bộ kiểm).</li>
<li>Khởi động lại API trước mỗi lượt kiểm, vì lúc khởi động nó nạp lại database <code>lab9</code>.</li>
</ul>
${ma('bash', CHAY)}
<details><summary>Xem dữ liệu dùng chung (lab9-du-lieu.mjs)</summary>
${ma('js', DULIEU)}
</details>
<details><summary>Xem API có lỗ hổng (lab9-ngay-tho.mjs)</summary>
${ma('js', NGAY)}
</details>
<details><summary>Xem bộ kiểm (lab9-thu.mjs)</summary>
${ma('js', THU)}
</details>
${lenh(K, 0)}
<p>Bản ngây thơ qua 2 trên 15 mục. Mỗi dòng ✘ cho biết đòn kiểm đã lấy được gì: token admin từ đăng nhập bằng <code>{"$ne": null}</code> và <code>$regex</code>; endpoint kiểm mã đặt lại trả 200 cho một mẫu regex; tra cứu của khách vãng lai trả về mọi đơn của một số điện thoại; lần tìm bằng regex mất 635 ms; một đơn bị chính khách hàng đánh dấu đã thanh toán; mật khẩu thô nằm trong bốn tài liệu; stack trace nằm trong câu trả lời; và máy chủ ai cũng truy vấn được.</p>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Máy chủ.</strong> Viết script khởi động <code>mgo-lab9</code> ở 127.0.0.1:47093: bật phân quyền, tắt JavaScript phía máy chủ, không dùng zlib; tạo một quản trị viên qua localhost exception; tạo user <code>lab9Api</code> trong database <code>lab9</code> với vai trò tự định nghĩa chỉ được find, insert và update. Mật khẩu lấy từ biến môi trường, dài, ngẫu nhiên, và không bao giờ xuất hiện trong script.</li>
<li><strong>Nạp dữ liệu.</strong> Tài khoản API không được phép xoá database, nên bước nạp dữ liệu (<code>napDuLieu</code>) phải chạy bằng tài khoản quản trị, tách khỏi API đang chạy.</li>
<li><strong>Đăng nhập và đăng ký.</strong> Kiểm kiểu mọi trường; lưu mật khẩu dạng băm có muối (scrypt hoặc bcrypt), so sánh ngoài truy vấn; đăng ký chỉ nhận <code>email, ten, matKhau</code>.</li>
<li><strong>Đặt lại mật khẩu.</strong> Lưu mã đặt lại dạng băm, có hạn; mã không phải chuỗi ⇒ 400.</li>
<li><strong>Tra cứu của khách vãng lai.</strong> Cả hai trường phải là chuỗi; trả tối đa một đơn và càng ít trường càng tốt.</li>
<li><strong>Tìm kiếm.</strong> Chữ người dùng gõ là chữ thường (đã thoát ký tự), giới hạn độ dài, có <code>maxTimeMS</code> và giới hạn số kết quả; phải trả lời dưới 100 ms trên 300 đơn "aaaa…!".</li>
<li><strong>Ghi chú đơn.</strong> Chỉ <code>ghiChu</code> được đổi; gửi trường khác ⇒ 400; đơn của khách khác ⇒ 404.</li>
<li><strong>Lỗi.</strong> JSON hỏng ⇒ 400; không thông báo, stack hay đường dẫn nào được rời khỏi máy chủ.</li>
</ol>

<h3>Rubric (10 điểm)</h3>
<table>
<tr><th>Điểm</th><th>Mục kiểm</th><th>Chứng minh điều gì</th></tr>
<tr><td>1</td><td>A2 + A3</td><td>Chèn toán tử vào đăng nhập bị chặn ngay ở cửa</td></tr>
<tr><td>1</td><td>A4</td><td>Mã đặt lại: không còn oracle, mã thật vẫn dùng được</td></tr>
<tr><td>1</td><td>A5</td><td>Tra cứu vãng lai không lộ gì khi nhận object; tra đúng mã vẫn chạy</td></tr>
<tr><td>1</td><td>A6</td><td>Regex thành chữ thường và có giới hạn (&lt; 100 ms), tìm tiếng Việt vẫn chạy</td></tr>
<tr><td>1</td><td>A7 + D2</td><td>Khách không đổi được trạng thái, ghi chú được; kiểm đúng chủ đơn</td></tr>
<tr><td>0,5 + 0,5</td><td>A8 · A9</td><td>Đăng ký bỏ qua <code>vaiTro</code> · JSON hỏng trả 400 gọn gàng</td></tr>
<tr><td>1</td><td>D1</td><td>Không tài liệu nào chứa mật khẩu thô</td></tr>
<tr><td>1</td><td>S1</td><td>Client không mật khẩu bị từ chối</td></tr>
<tr><td>1</td><td>S2</td><td>--noscripting và không zlib</td></tr>
<tr><td>1</td><td>S3 + S4</td><td>Tài khoản API quyền tối thiểu, và API đang chạy thật sự dùng nó</td></tr>
</table>
<p>A1 (đăng nhập bình thường chạy được) là điều kiện cửa: trượt mục này thì bài được 0 điểm. Một API an toàn mà không ai dùng được thì chưa phải bản vá.</p>

<h3>Câu hỏi bảo vệ</h3>
<ol>
<li>Đăng nhập của bạn giờ đã từ chối object. Chỉ ra một endpoint khác mà lỗi y hệt sẽ quay lại nếu ngày mai đồng đội thêm vào, và luật review mã ngăn được chuyện đó.</li>
<li>Vì sao tài khoản API không có <code>remove</code> và không có <code>createIndex</code>? Ai tạo TTL index trên <code>phien</code>?</li>
<li>Bộ kiểm dùng 300 đơn "aaaa…!". Với 3 triệu đơn thì chuyện gì xảy ra, khi có và khi không có <code>maxTimeMS</code>?</li>
<li>Mã đặt lại của bạn lưu bằng SHA-256, còn mật khẩu dùng scrypt. Vì sao hàm băm nhanh chấp nhận được với cái này mà không với cái kia?</li>
<li>Bên trong container, database vẫn nghe ở <code>*</code> (tu-kiem báo bindIp là LỖI). Ở đây có sao không? Với máy chủ thật bạn sẽ đổi gì?</li>
</ol>

<h3>Lời giải</h3>
${loiGiai('Xem script máy chủ (lab9-may-chu.sh)', ma('bash', MAYCHU))}
${loiGiai('Xem API đã vá (lab9-giai.mjs)', ma('js', GIAI))}
${loiGiai('Xem lượt chạy: tự kiểm mgo-lab9 và 15/15', `${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>tu-kiem trên mgo-lab9: phân quyền, bản vá, bộ nén và JavaScript đều OK. bindIp là <code>*</code> vì container phải nhận cổng được chuyển tiếp vào (máy host chỉ xuất ra 127.0.0.1). TLS để dành cho phần mở rộng bên dưới. Bộ kiểm đạt 15/15.</p>
<p>Đáp án bảo vệ tóm tắt: (1) mọi endpoint mới đưa <code>req.body</code> vào bộ lọc; luật: "mọi đầu vào đi qua schema/hàm có kiểu, không đưa req.body thô vào truy vấn", giữ bằng review và một luật lint; (2) API không bao giờ cần xoá tài liệu (phiên tự hết hạn nhờ TTL, do chính máy chủ chạy) hay đổi index; việc đó do bước nạp dữ liệu/di trú làm bằng tài khoản quản trị; (3) không có maxTimeMS thì một request quét hàng triệu tài liệu, mỗi cái ~2 ms, tức hàng giờ CPU; có thoát ký tự thì mẫu thành chữ thường, có maxTimeMS thì tệ nhất là 200 ms rồi trả 503; (4) mã đặt lại là giá trị ngẫu nhiên dài, không ai dò nổi 72 bit; mật khẩu do con người chọn và ngắn, nên cần hàm băm chậm, có muối; (5) trong Docker, mạng container là ranh giới; trên máy ảo, bindIp nên chỉ là 127.0.0.1 cộng giao diện mạng riêng.</p>`)}

<h3>Mở rộng</h3>
<ul>
<li>Thêm TLS cho mgo-lab9 bằng CA của Bài 9.4, để tu-kiem in 6/6 OK.</li>
<li>Thêm collection kiểm toán: mỗi PATCH ghi ai/làm gì/trước/sau trong cùng transaction; cho lab9Api chỉ quyền insert trên đó.</li>
<li>Chuyển API đã vá sang Spring Boot với DTO và chạy cùng bộ kiểm (Bài 8.5 có mẫu).</li>
</ul>
</div>
`,
};
