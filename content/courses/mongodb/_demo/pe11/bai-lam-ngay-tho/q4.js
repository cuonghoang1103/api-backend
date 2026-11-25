// Q4 — bài làm ngây thơ
function q4a(db) {
  return db.ve.aggregate([
    { $match: { trangThai: 'DA_THANH_TOAN' } },
    { $lookup: { from: 'suat', localField: 'suatId', foreignField: '_id', as: 's' } },
    { $unwind: '$s' },
    { $group: { _id: { rap: '$rapId', thang: { $dateToString: { date: '$s.batDau', format: '%Y-%m' } } }, doanhThu: { $sum: '$tong' }, soVe: { $sum: 1 } } },
    { $project: { _id: 0, rap: '$_id.rap', thang: '$_id.thang', doanhThu: 1, soVe: 1 } },
    { $sort: { rap: 1, thang: 1 } },
  ]).toArray();
}
function q4b(db) {
  return db.ve.aggregate([
    { $match: { trangThai: 'DA_THANH_TOAN' } },
    { $group: { _id: '$phimId', soGhe: { $sum: { $size: '$ghe' } } } },
    { $sort: { soGhe: -1, _id: 1 } },
    { $limit: 5 },
    { $lookup: { from: 'phim', localField: '_id', foreignField: '_id', as: 'p' } },
    { $project: { _id: 0, phimId: '$_id', ten: { $first: '$p.ten' }, soGhe: 1 } },
  ]).toArray();
}
