// Bài 8.1 — phép nhân của pool: SỐ BẢN ỨNG DỤNG × maxPoolSize phải nhỏ hơn trần kết nối của máy chủ.
// Mô phỏng 5 bản ứng dụng (5 MongoClient, mặc định maxPoolSize 100), mỗi bản bắn 100 truy vấn chậm cùng lúc.
// Lab chạy trong container giới hạn 1024 tệp mở (Bài 3.5) ⇒ mongod tự đặt trần ~409 kết nối.
// Chạy: node s08-tran-ket-noi.mjs
import { MongoClient } from 'mongodb';

const URI = 'mongodb://127.0.0.1:47017/ctshop?directConnection=true';
const admin = new MongoClient(URI);
const ss = async () => (await admin.db('admin').command({ serverStatus: 1 })).connections;
const c0 = await ss();
console.log(`trần máy chủ: current ${c0.current} + available ${c0.available} = ${c0.current + c0.available} kết nối, rejected ${c0.rejected}`);

const banApp = Array.from({ length: 5 }, () => new MongoClient(URI, { serverSelectionTimeoutMS: 5000 }));
let dinh = 0;
const theoDoi = setInterval(async () => { try { dinh = Math.max(dinh, (await ss()).current); } catch {} }, 100);
const t = performance.now();
const kq = await Promise.allSettled(banApp.flatMap((c, a) => Array.from({ length: 100 }, (_, i) =>
  c.db().collection('customers').findOne({ _id: `KH${String(1 + ((a * 100 + i) % 200)).padStart(4, '0')}`, $where: 'sleep(300) || true' }))));
clearInterval(theoDoi);
const loi = {};
for (const r of kq) if (r.status === 'rejected') { const k = `${r.reason.name}: ${r.reason.message.replace(/connection \d+/, "connection <số>")}`; loi[k] = (loi[k] ?? 0) + 1; }
const c1 = await ss();
console.log(`500 truy vấn trong ${(performance.now() - t).toFixed(0)} ms: ${kq.filter((r) => r.status === 'fulfilled').length} xong, ${kq.length - kq.filter((r) => r.status === 'fulfilled').length} lỗi`);
for (const [k, n] of Object.entries(loi)) console.log(`  ${n} × ${k}`);
console.log(`đỉnh kết nối đo được ${dinh}; máy chủ từ chối thêm ${c1.rejected - c0.rejected} kết nối`);
await Promise.all(banApp.map((c) => c.close())); await admin.close();
