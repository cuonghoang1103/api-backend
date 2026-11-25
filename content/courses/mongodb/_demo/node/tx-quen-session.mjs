// Bài 6.2 — bẫy hay gặp nhất khi dùng transaction trong Node: QUÊN truyền { session } cho MỘT lệnh.
// Lệnh đó chạy NGOÀI transaction: không bị huỷ khi transaction huỷ, và còn có thể bị chặn bởi chính transaction của mình.
// Chạy: node tx-quen-session.mjs
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const db = client.db('ch6');
await db.collection('vi').deleteMany({});
await db.collection('nhatKy').deleteMany({});
await db.collection('vi').insertOne({ _id: 'AN', du: 100000 });

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await db.collection('vi').updateOne({ _id: 'AN' }, { $inc: { du: -50000 } }, { session });
    await db.collection('nhatKy').insertOne({ vi: 'AN', tien: -50000, ghiChu: 'trừ tiền đơn D1' }); // ← quên { session }
    throw new Error('cổng thanh toán từ chối'); // lỗi nghiệp vụ ⇒ transaction bị huỷ
  });
} catch (e) {
  console.log('transaction huỷ:', e.message);
} finally {
  await session.endSession();
}
console.log('ví AN:', (await db.collection('vi').findOne({ _id: 'AN' })).du);
console.log('nhật ký còn lại:', JSON.stringify(await db.collection('nhatKy').find({}, { projection: { _id: 0 } }).toArray()));

// Còn tệ hơn: lệnh quên session đụng CHÍNH tài liệu transaction đang giữ ⇒ tự chặn mình tới khi hết thời gian.
const s2 = client.startSession();
const t0 = Date.now();
try {
  await s2.withTransaction(async () => {
    await db.collection('vi').updateOne({ _id: 'AN' }, { $inc: { du: -1000 } }, { session: s2 });
    await db.collection('vi').updateOne({ _id: 'AN' }, { $set: { capNhat: new Date() } }, { maxTimeMS: 2000 }); // ← quên session
  });
} catch (e) {
  console.log('lệnh quên session:', e.codeName ?? e.message, 'sau', Date.now() - t0, 'ms');
} finally {
  await s2.endSession();
}
await client.close();
