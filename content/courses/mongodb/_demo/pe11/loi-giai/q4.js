// Q4 (2 điểm) — báo cáo.
// a) Doanh thu theo rạp theo THÁNG của suất chiếu (giờ Việt Nam), chỉ vé DA_THANH_TOAN.
//    Kết quả: [{ rap, thang: '2026-11', doanhThu (Decimal128), soVe }] sắp theo rap, rồi thang.
function q4a(db) {
  return db.ve.aggregate([
    { $match: { trangThai: 'DA_THANH_TOAN' } },
    { $lookup: { from: 'suat', localField: 'suatId', foreignField: '_id', as: 's', pipeline: [{ $project: { batDau: 1 } }] } },
    { $set: { s: { $first: '$s' } } },
    { $group: { _id: { rap: '$rapId', thang: { $dateToString: { date: '$s.batDau', format: '%Y-%m', timezone: 'Asia/Ho_Chi_Minh' } } },
                doanhThu: { $sum: '$tong' }, soVe: { $sum: 1 } } },
    { $project: { _id: 0, rap: '$_id.rap', thang: '$_id.thang', doanhThu: 1, soVe: 1 } },
    { $sort: { rap: 1, thang: 1 } },
  ]).toArray();
}
// b) Top 5 phim theo SỐ GHẾ đã bán (vé DA_THANH_TOAN), kèm tên phim. Trùng số ghế thì phimId tăng dần.
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
