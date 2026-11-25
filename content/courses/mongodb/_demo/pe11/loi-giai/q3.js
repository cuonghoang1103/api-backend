// Q3 (1,5 điểm) — index cho màn "lịch chiếu của một phim tại một rạp từ hôm nay":
//   db.suat.find({ phimId, rapId, batDau: { $gte: T } }).sort({ batDau: 1 })
// Luật ESR: hai trường bằng (E) trước, trường vừa sắp xếp vừa là khoảng (S/R) sau ⇒ không SORT, quét đúng số khoá cần.
db.suat.createIndex({ phimId: 1, rapId: 1, batDau: 1 }, { name: 'lich_chieu' });
