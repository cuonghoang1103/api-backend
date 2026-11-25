// Q2 — bài làm ngây thơ
function q2a(db) {
  return db.phim.find({ theLoai: { $all: ['Hành động', 'Khoa học viễn tưởng'] }, diemImdb: { $gte: 7 } }, { ten: 1, diemImdb: 1 })
    .sort({ diemImdb: -1, _id: 1 }).toArray();
}
function q2b(db) {
  const rapHN = db.rap.distinct('_id', { thanhPho: 'Hà Nội' });
  return db.suat.find({ rapId: { $in: rapHN }, batDau: { $gte: ISODate('2026-12-05'), $lt: ISODate('2026-12-06') } }, { _id: 1 })
    .sort({ _id: 1 }).toArray().map((s) => s._id);
}
function q2c(db, sau) {
  const loc = { khachId: 'K0042' };
  if (sau) loc.taoLuc = { $lt: sau.taoLuc };
  return db.ve.find(loc, { taoLuc: 1, suatId: 1 }).sort({ taoLuc: -1 }).limit(5).toArray();
}
