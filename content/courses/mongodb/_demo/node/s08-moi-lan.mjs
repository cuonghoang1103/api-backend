// Bài 8.1 — lỗi hay gặp nhất khi mới dùng driver: tạo MongoClient MỚI cho mỗi request.
// 300 "request" tuần tự, mỗi request đọc một khách. Đếm thời gian và số kết nối máy chủ phải mở (connections.totalCreated).
// Chạy: node s08-moi-lan.mjs
import { MongoClient } from 'mongodb';

const URI = 'mongodb://127.0.0.1:47017/ctshop?directConnection=true';
const N = 300;
const admin = new MongoClient(URI);
const daTao = async () => (await admin.db('admin').command({ serverStatus: 1 })).connections.totalCreated;

async function moiRequestMotClient(i) {           // ✘ SAI: mở – dùng – đóng mỗi lần
  const c = new MongoClient(URI);
  try { return await c.db().collection('customers').findOne({ _id: `KH${String(1 + (i % 200)).padStart(4, '0')}` }); }
  finally { await c.close(); }
}
const chung = new MongoClient(URI);               // ✔ ĐÚNG: một client cho cả tiến trình
async function dungChung(i) {
  return chung.db().collection('customers').findOne({ _id: `KH${String(1 + (i % 200)).padStart(4, '0')}` });
}

for (const [ten, f] of [['mỗi request một MongoClient', moiRequestMotClient], ['một MongoClient dùng chung', dungChung]]) {
  const k0 = await daTao(), t = performance.now();
  for (let i = 0; i < N; i++) await f(i);
  const ms = performance.now() - t;
  console.log(`${ten.padEnd(28)} ${N} request: ${ms.toFixed(0).padStart(5)} ms (${(ms / N).toFixed(2)} ms/request), máy chủ mở thêm ${(await daTao()) - k0} kết nối`);
}
await chung.close(); await admin.close();
