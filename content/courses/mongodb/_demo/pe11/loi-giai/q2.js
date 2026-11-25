// Q2 (2 điểm) — ba truy vấn.
// a) Phim có CẢ HAI thể loại 'Hành động' và 'Khoa học viễn tưởng' (thứ tự nào cũng được, có thể thêm thể loại khác), diemImdb >= 7.
function q2a(db) {
  return db.phim.find({ theLoai: { $all: ['Hành động', 'Khoa học viễn tưởng'] }, diemImdb: { $gte: 7 } }, { ten: 1, diemImdb: 1 })
    .sort({ diemImdb: -1, _id: 1 }).toArray();
}
// b) _id các suất chiếu ở rạp tại Hà Nội trong NGÀY 05/12/2026 THEO GIỜ VIỆT NAM, sắp _id tăng dần.
function q2b(db) {
  const rapHN = db.rap.distinct('_id', { thanhPho: 'Hà Nội' });
  return db.suat.find({ rapId: { $in: rapHN }, batDau: { $gte: ISODate('2026-12-05T00:00:00+07:00'), $lt: ISODate('2026-12-06T00:00:00+07:00') } }, { _id: 1 })
    .sort({ _id: 1 }).toArray().map((s) => s._id);
}
// c) Phân trang keyset vé của khách K0042: mới nhất trước (taoLuc giảm dần, trùng thì _id giảm dần), 5 vé một trang.
//    sau = null (trang đầu) hoặc vé cuối của trang trước.
function q2c(db, sau) {
  const loc = { khachId: 'K0042' };
  if (sau) loc.$or = [{ taoLuc: { $lt: sau.taoLuc } }, { taoLuc: sau.taoLuc, _id: { $lt: sau._id } }];
  return db.ve.find(loc, { taoLuc: 1, suatId: 1 }).sort({ taoLuc: -1, _id: -1 }).limit(5).toArray();
}
