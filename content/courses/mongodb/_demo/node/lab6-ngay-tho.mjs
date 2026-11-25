// Lab 6.5 — cài đặt NGÂY THƠ (phát sẵn để thấy nó hỏng): đọc → kiểm → ghi, không transaction, không chống gửi trùng.
export async function chuyenTien({ db }, { maGD, tu, den, tien }) {
  const a = await db.collection('vi').findOne({ _id: tu });
  if (a.du < tien) return 'thieu-tien';
  await db.collection('vi').updateOne({ _id: tu }, { $set: { du: a.du - tien } });
  const b = await db.collection('vi').findOne({ _id: den });
  await db.collection('vi').updateOne({ _id: den }, { $set: { du: b.du + tien } });
  await db.collection('giaoDich').insertOne({ maGD, tu, den, tien });
  return 'ok';
}

export async function datHang({ db }, { maDon, khach, mon }) {
  for (const m of mon) {
    const k = await db.collection('kho').findOne({ _id: m.sp });
    if (k.ton < m.sl) return 'het-hang';
  }
  const tien = mon.reduce((s, m) => s + m.sl * 100000, 0);
  const v = await db.collection('vi').findOne({ _id: khach });
  if (v.du < tien) return 'thieu-tien';
  for (const m of mon) await db.collection('kho').updateOne({ _id: m.sp }, { $inc: { ton: -m.sl } });
  await db.collection('vi').updateOne({ _id: khach }, { $inc: { du: -tien } });
  await db.collection('vi').updateOne({ _id: 'SHOP' }, { $inc: { du: tien } });
  await db.collection('don').insertOne({ maDon, khach, mon, tien });
  return 'ok';
}
