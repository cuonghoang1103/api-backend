// Bài 10.3 — gom ghi: cùng 10.000 đơn, ghi bằng 4 cách, đo thời gian thật. Mỗi cách ghi vào collection rỗng ch10.ghi.
//   node gom-ghi.mjs        (nối tới mgo-lab 127.0.0.1:47017; database ch10 bị ghi đè)
import { MongoClient } from 'mongodb';
const URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/?directConnection=true';
const client = new MongoClient(URI, { appName: 'gom-ghi', maxPoolSize: 50 });
const c = client.db('ch10').collection('ghi');
const N = 10_000;
const don = (i) => ({ _id: i, khach: 'KH' + String(1 + (i % 200)).padStart(4, '0'), trangThai: 'NEW', tong: 199000, ngay: new Date(Date.UTC(2026, 10, 1) + i * 1000) });

async function do_(ten, f) {
  await c.drop().catch(() => {});
  await c.insertOne({ _id: -1 }); await c.deleteOne({ _id: -1 });          // tạo collection trước, không tính vào thời gian
  const t0 = performance.now(); const soLanGui = await f(); const ms = performance.now() - t0;
  const n = await c.countDocuments();
  console.log(`${ten.padEnd(40)} ${String(n).padStart(6)} đơn  ${ms.toFixed(0).padStart(6)} ms  ${String(Math.round(n / ms * 1000)).padStart(7)} đơn/s  ${String(soLanGui).padStart(6)} lần gửi`);
}
await client.connect();
await do_('insertOne từng cái, tuần tự', async () => { for (let i = 0; i < N; i++) await c.insertOne(don(i)); return N; });
await do_('insertOne từng cái, writeConcern w:1', async () => { for (let i = 0; i < N; i++) await c.insertOne(don(i), { writeConcern: { w: 1 } }); return N; });
await do_('insertOne, 50 cái song song (Promise.all)', async () => {
  for (let i = 0; i < N; i += 50) await Promise.all(Array.from({ length: 50 }, (_, k) => c.insertOne(don(i + k)))); return N; });
await do_('insertMany lô 100', async () => { for (let i = 0; i < N; i += 100) await c.insertMany(Array.from({ length: 100 }, (_, k) => don(i + k))); return N / 100; });
await do_('insertMany một lô 10.000', async () => { await c.insertMany(Array.from({ length: N }, (_, k) => don(k))); return 1; });
// cập nhật: 10.000 đơn đổi trạng thái — từng lệnh vs một bulkWrite
await do_('updateOne từng cái (sau khi nạp lô)', async () => {
  await c.insertMany(Array.from({ length: N }, (_, k) => don(k)));
  const t = performance.now(); for (let i = 0; i < N; i++) await c.updateOne({ _id: i }, { $set: { trangThai: 'PAID' } });
  console.log(`   (riêng phần updateOne: ${(performance.now() - t).toFixed(0)} ms)`); return N; });
await do_('bulkWrite 10.000 updateOne, ordered:false', async () => {
  await c.insertMany(Array.from({ length: N }, (_, k) => don(k)));
  const t = performance.now();
  const r = await c.bulkWrite(Array.from({ length: N }, (_, i) => ({ updateOne: { filter: { _id: i }, update: { $set: { trangThai: 'PAID' } } } })), { ordered: false });
  console.log(`   (riêng phần bulkWrite: ${(performance.now() - t).toFixed(0)} ms, modified ${r.modifiedCount})`); return 1; });
// một phần tử lỗi giữa lô: ordered (mặc định) dừng ngay, ordered:false ghi nốt
await c.drop(); await c.insertOne({ _id: 500 });
try { await c.insertMany(Array.from({ length: 1000 }, (_, k) => don(k))); } catch (e) { console.log(`ordered (mặc định), trùng _id 500: ghi được ${e.insertedCount ?? e.result?.insertedCount} rồi dừng — ${e.code}`); }
await c.drop(); await c.insertOne({ _id: 500 });
try { await c.insertMany(Array.from({ length: 1000 }, (_, k) => don(k)), { ordered: false }); } catch (e) { console.log(`ordered:false, trùng _id 500: ghi được ${e.insertedCount ?? e.result?.insertedCount}, ${e.writeErrors?.length ?? 1} lỗi — ${e.code}`); }
await c.drop();
await client.close();
