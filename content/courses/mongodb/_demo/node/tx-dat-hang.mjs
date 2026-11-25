// Bài 6.2 — 40 khách đặt hàng CÙNG LÚC, mỗi đơn trừ kho 2 sản phẩm + chèn đơn trong MỘT transaction (driver Node chính thức).
// Kho: K1 còn 30, K2 còn 30. Mỗi đơn lấy 1 K1 + 1 K2 ⇒ tối đa 30 đơn thành công, 10 đơn phải bị từ chối, kho không bao giờ âm.
// Đếm: số lần hàm callback chạy (withTransaction tự chạy lại khi gặp TransientTransactionError) so với số đơn commit.
// Chạy: node tx-dat-hang.mjs   (lab ở 127.0.0.1:47017, Bài 0.2)
import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:47017/?directConnection=true');
const db = client.db('ch6');
await db.collection('kho').deleteMany({});
await db.collection('donTx').deleteMany({});
await db.collection('kho').insertMany([{ _id: 'K1', ton: 30 }, { _id: 'K2', ton: 30 }]);

let lanChay = 0;
const datHang = async (khach) => {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      lanChay++;
      for (const sp of ['K1', 'K2']) {
        const r = await db.collection('kho').updateOne({ _id: sp, ton: { $gte: 1 } }, { $inc: { ton: -1 } }, { session });
        if (r.modifiedCount !== 1) throw new Error('HET_HANG ' + sp);
      }
      await db.collection('donTx').insertOne({ khach, sp: ['K1', 'K2'] }, { session });
    });
    return 'ok';
  } catch (e) {
    return e.message.startsWith('HET_HANG') ? 'het' : 'loi ' + e.message;
  } finally {
    await session.endSession();
  }
};

const kq = await Promise.all(Array.from({ length: 40 }, (_, i) => datHang('KH' + i)));
const dem = kq.reduce((m, x) => ({ ...m, [x]: (m[x] ?? 0) + 1 }), {});
console.log('kết quả 40 đơn:', JSON.stringify(dem));
console.log('callback đã chạy:', lanChay, 'lần cho', dem.ok ?? 0, 'đơn commit');
console.log('kho:', JSON.stringify(await db.collection('kho').find().toArray()), '| đơn trong DB:', await db.collection('donTx').countDocuments());
await client.close();
