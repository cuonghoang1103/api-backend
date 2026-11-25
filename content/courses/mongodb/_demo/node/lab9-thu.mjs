// Lab 9.5 — bộ kiểm: TẤN CÔNG bản API của bạn (chỉ lab 127.0.0.1) + soát cấu hình máy chủ MongoDB.
//   node lab9-thu.mjs <URL API> <URI quản trị MongoDB>
//   vd: node lab9-thu.mjs http://127.0.0.1:47091 mongodb://127.0.0.1:47017/?directConnection=true
//       node lab9-thu.mjs http://127.0.0.1:47092 "mongodb://quantri:<mật khẩu>@127.0.0.1:47093/?authSource=admin"
// Khởi động lại API trước mỗi lượt kiểm (API tự nạp lại dữ liệu lab9).
import { MongoClient } from 'mongodb';
import { TAI_KHOAN, MA_DAT_LAI } from './lab9-du-lieu.mjs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:47091';
const ADMIN = process.argv[3] ?? 'mongodb://127.0.0.1:47017/?directConnection=true';
let dat = 0, tong = 0;
const kiem = (ten, dung, chiTiet = '') => { tong++; if (dung) dat++; console.log(`${dung ? '✔' : '✘'} ${ten}${dung ? '' : '  ← ' + String(chiTiet).slice(0, 110)}`); };
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
kiem('A2 matKhau {"$ne":null} ⇒ bị từ chối, không token', r.s >= 400 && r.s < 500 && !r.j?.token, `${r.s} ${r.text}`);
r = await goi('POST', '/dang-nhap', { email: { $regex: '^adm' }, matKhau: { $gt: '' } });
kiem('A3 email {"$regex"} + matKhau {"$gt":""} ⇒ bị từ chối', r.s >= 400 && r.s < 500 && !r.j?.token, `${r.s} ${r.text}`);
r = await goi('POST', '/quen-mat-khau/kiem', { token: { $regex: '^k' } });
const r2 = await goi('POST', '/quen-mat-khau/kiem', { token: MA_DAT_LAI });
kiem('A4 mã đặt lại {"$regex":"^k"} ⇒ 400; mã thật ⇒ 200', r.s === 400 && r2.s === 200, `${r.s} / ${r2.s}`);
r = await goi('POST', '/tra-cuu', { sdt: '0901000002', maDon: { $ne: null } });
const r3 = await goi('POST', '/tra-cuu', { sdt: '0901000002', maDon: 'DH001' });
kiem('A5 tra cứu maDon {"$ne":null} ⇒ không lộ đơn; đúng mã ⇒ 1 đơn', !Array.isArray(r.j) && r.s >= 400 && r3.s === 200 && JSON.stringify(r3.j).includes('DH001') && !JSON.stringify(r3.j).includes('DH003'),
  `${r.s} ${r.text.slice(0, 60)} / ${r3.s}`);
r = await goi('POST', '/dang-nhap', { email: 'binh@vd.vn', matKhau: 'binh2026' });
const tkBinh = r.j?.token;
r = await goi('GET', '/don/tim?q=' + encodeURIComponent('(a+)+$'), null, tkBinh);
const r4 = await goi('GET', '/don/tim?q=' + encodeURIComponent('a.'), null, tkBinh);
const r5 = await goi('GET', '/don/tim?q=' + encodeURIComponent('Giày'), null, tkBinh);
kiem('A6 tìm "(a+)+$" < 100 ms; "a." là chữ thường (0 kết quả); "Giày" ⇒ 1', r.s === 200 && r.ms < 100 && r4.j?.length === 0 && r5.j?.length === 1,
  `(a+)+$ ${r.s} ${r.ms} ms · a. ${r4.j?.length} · Giày ${r5.j?.length}`);
r = await goi('PATCH', '/don/DH001', { trangThai: 'DA_THANH_TOAN' }, tkAn);
const r6 = await goi('PATCH', '/don/DH001', { ghiChu: 'giao giờ hành chính' }, tkAn);
const r7 = await goi('PATCH', '/don/DH002', { ghiChu: 'x' }, tkAn);
kiem('A7 PATCH trangThai ⇒ 400; ghiChu ⇒ 200; đơn người khác ⇒ 404', r.s === 400 && r6.s === 200 && r7.s === 404, `${r.s} / ${r6.s} / ${r7.s}`);
r = await goi('POST', '/dang-ky', { email: 'moi@vd.vn', matKhau: 'Mat-Khau-Moi-2026', ten: 'Mới', vaiTro: 'admin' });
const r8 = await goi('POST', '/dang-nhap', { email: 'moi@vd.vn', matKhau: 'Mat-Khau-Moi-2026' });
kiem('A8 đăng ký gửi kèm vaiTro admin ⇒ vẫn là khach, đăng nhập được', r.s === 201 && r8.s === 200 && r8.j?.vaiTro === 'khach', `${r.s} / ${r8.s} ${r8.text}`);
r = await goi('POST', '/dang-nhap', null, null, '{"email": "an@vd.vn", ');
kiem('A9 JSON hỏng ⇒ 400, không lộ stack/đường dẫn', r.s === 400 && !/node_modules|\bat \w|stack/.test(r.text), `${r.s} ${r.text}`);

console.log('— Dữ liệu + máy chủ —');
const ad = new MongoClient(ADMIN, { serverSelectionTimeoutMS: 3000 });
await ad.connect();
const users = await ad.db('lab9').collection('users').find().toArray();
const tho = [...TAI_KHOAN.map((u) => u.matKhau), 'Mat-Khau-Moi-2026'];
const loThu = users.filter((u) => Object.values(u).some((v) => tho.includes(v)));
kiem('D1 không tài liệu users nào chứa mật khẩu thô', users.length >= 4 && loThu.length === 0, `${loThu.length}/${users.length} tài liệu lộ: ${loThu.map((u) => u.email).join(', ')}`);
const d1 = await ad.db('lab9').collection('don').findOne({ _id: 'DH001' });
kiem('D2 DH001 vẫn CHO_THANH_TOAN sau A7', d1?.trangThai === 'CHO_THANH_TOAN', d1?.trangThai);

const u = new URL(ADMIN.replace(/^mongodb:\/\/[^@/]*@/, 'mongodb://'));
const vo = new MongoClient(`mongodb://${u.host}/?directConnection=true`, { serverSelectionTimeoutMS: 3000 });
const voDanh = await vo.db('admin').command({ listDatabases: 1 }).then(() => 'đọc được danh sách database', (e) => e.codeName ?? e.message);
kiem('S1 client không mật khẩu bị từ chối', voDanh !== 'đọc được danh sách database', voDanh);
await vo.close();
const o = (await ad.db('admin').command({ getCmdLineOpts: 1 })).parsed;
kiem('S2 noscripting + không zlib', o.security?.javascriptEnabled === false && !String(o.net?.compression?.compressors ?? 'zlib').includes('zlib'),
  `javascriptEnabled=${o.security?.javascriptEnabled} compressors=${o.net?.compression?.compressors ?? 'mặc định'}`);
const info = (await ad.db('admin').command({ usersInfo: { user: 'lab9Api', db: 'lab9' }, showPrivileges: true })).users[0];
const hd = new Set((info?.inheritedPrivileges ?? []).flatMap((p) => p.actions));
const nguy = ['dropCollection', 'dropDatabase', 'createIndex', 'dropIndex', 'createCollection', 'collMod', 'createUser', 'grantRole'].filter((a) => hd.has(a));
kiem('S3 user lab9Api có find/insert/update, KHÔNG có quyền xoá collection/index/user', !!info && ['find', 'insert', 'update'].every((a) => hd.has(a)) && nguy.length === 0,
  info ? `quyền thừa: ${nguy.join(', ') || '(không)'}; thiếu: ${['find', 'insert', 'update'].filter((a) => !hd.has(a)).join(', ')}` : 'chưa có user lab9Api trong database lab9');
const phien = info && (await ad.db('admin').command({ currentOp: 1, $all: true })).inprog.filter((x) => x.effectiveUsers?.some((e) => e.user === 'lab9Api')).length;
kiem('S4 API đang kết nối bằng lab9Api (thấy trong currentOp)', phien > 0, `${phien ?? 0} kết nối của lab9Api`);
await ad.close();
console.log(`ĐIỂM: ${dat}/${tong}`);
