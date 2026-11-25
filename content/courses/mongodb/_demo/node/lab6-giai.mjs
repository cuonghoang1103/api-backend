// Lab 6.5 — LỜI GIẢI. Ba ý: (1) kiểm và trừ trong CÙNG một lệnh có điều kiện ($gte), (2) mọi lệnh của một yêu cầu trong MỘT transaction,
// (3) chống gửi trùng bằng index duy nhất trên mã GD/mã đơn — chèn bản ghi trong chính transaction đó; trùng (E11000) ⇒ trả 'trung', không làm lại.
export const thongKe = { lanChay: 0 };

export async function chuanBi(db) {
  await db.collection('giaoDich').createIndex({ maGD: 1 }, { unique: true });
  await db.collection('don').createIndex({ maDon: 1 }, { unique: true });
}

class TuChoi extends Error {} // lỗi nghiệp vụ: huỷ transaction, KHÔNG thử lại

async function trongTransaction(client, viec) {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => { thongKe.lanChay++; await viec(session); },
      { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } });
    return 'ok';
  } catch (e) {
    if (e instanceof TuChoi) return e.message;
    if (e.code === 11000) return 'trung';
    throw e;
  } finally {
    await session.endSession();
  }
}

export function chuyenTien({ client, db }, { maGD, tu, den, tien }) {
  return trongTransaction(client, async (session) => {
    await db.collection('giaoDich').insertOne({ maGD, tu, den, tien, luc: new Date() }, { session }); // trùng ⇒ E11000 ngay đầu
    const r = await db.collection('vi').updateOne({ _id: tu, du: { $gte: tien } }, { $inc: { du: -tien } }, { session });
    if (r.modifiedCount !== 1) throw new TuChoi('thieu-tien');
    await db.collection('vi').updateOne({ _id: den }, { $inc: { du: tien } }, { session });
  });
}

export function datHang({ client, db }, { maDon, khach, mon }) {
  const tien = mon.reduce((s, m) => s + m.sl * 100000, 0);
  return trongTransaction(client, async (session) => {
    await db.collection('don').insertOne({ maDon, khach, mon, tien, luc: new Date() }, { session });
    for (const m of mon) {
      const r = await db.collection('kho').updateOne({ _id: m.sp, ton: { $gte: m.sl } }, { $inc: { ton: -m.sl } }, { session });
      if (r.modifiedCount !== 1) throw new TuChoi('het-hang');
    }
    const v = await db.collection('vi').updateOne({ _id: khach, du: { $gte: tien } }, { $inc: { du: -tien } }, { session });
    if (v.modifiedCount !== 1) throw new TuChoi('thieu-tien');
    await db.collection('vi').updateOne({ _id: 'SHOP' }, { $inc: { du: tien } }, { session });
  });
}
