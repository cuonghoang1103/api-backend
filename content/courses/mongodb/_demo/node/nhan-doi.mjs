// Bài 2.1 — bẫy: driver Node GẮN _id vào chính object bạn truyền cho insertOne. Dùng lại object ⇒ E11000.
import { MongoClient } from 'mongodb';
const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const col = client.db('ch2').collection('logs');
await col.drop().catch(() => {});
const mau = { level: 'INFO', msg: 'đăng nhập' };
for (let i = 1; i <= 3; i++) {
  try { const r = await col.insertOne(mau); console.log(`lần ${i}: chèn _id ${r.insertedId}`); }
  catch (e) { console.log(`lần ${i}: ${e.code} ${e.message}`); }
}
console.log('mau sau vòng lặp =', mau);
await client.close();
