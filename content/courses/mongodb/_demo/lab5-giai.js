// Lab 5.6 — LỜI GIẢI: bảng điều khiển doanh số CT Shop bằng aggregation pipeline (khoá MongoDB, cuongthai.com).
// Dùng: docker exec mgo-lab mongosh --quiet ctshop --eval "load('/demo/lab5-giai.js'); R1()"
// Quy ước: "doanh thu" = đơn PAID + SHIPPED; mọi mốc ngày/tháng theo giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7).
const TZ = 'Asia/Ho_Chi_Minh';
const DA_BAN = ['PAID', 'SHIPPED'];
const vnNgay = (y, m, d) => new Date(Date.UTC(y, m - 1, d) - 7 * 3600 * 1000);   // 00:00 giờ VN của ngày y-m-d, đổi ra UTC

// Index phục vụ mọi báo cáo: status là bằng ($in), createdAt là khoảng — E trước R (Bài 4.3).
function taoIndex() { return db.orders.createIndex({ status: 1, createdAt: 1 }); }

// R1 — doanh thu từng tháng của năm, luỹ kế, tăng trưởng so với tháng trước.
function R1(nam = 2026) {
  return db.orders.aggregate([
    { $match: { status: { $in: DA_BAN }, createdAt: { $gte: vnNgay(nam, 1, 1), $lt: vnNgay(nam + 1, 1, 1) } } },
    { $group: { _id: { $dateToString: { date: '$createdAt', format: '%Y-%m', timezone: TZ } }, soDon: { $sum: 1 }, dt: { $sum: { $toDouble: '$total' } } } },
    { $setWindowFields: { sortBy: { _id: 1 }, output: {
      luyKe: { $sum: '$dt', window: { documents: ['unbounded', 'current'] } },
      truoc: { $shift: { output: '$dt', by: -1 } } } } },
    { $project: { soDon: 1, trieu: { $round: [{ $divide: ['$dt', 1e6] }, 1] }, luyKeTrieu: { $round: [{ $divide: ['$luyKe', 1e6] }, 1] },
      tangTruongPct: { $cond: [{ $eq: ['$truoc', null] }, null, { $round: [{ $multiply: [{ $subtract: [{ $divide: ['$dt', '$truoc'] }, 1] }, 100] }, 1] }] } } },
  ]).toArray();
}

// R2 — n sản phẩm doanh thu cao nhất trong khoảng ngày, kèm danh mục (từ products) và tỉ trọng trong tổng.
function R2(tu = vnNgay(2026, 7, 1), toi = vnNgay(2026, 10, 1), n = 5) {
  return db.orders.aggregate([
    { $match: { status: { $in: DA_BAN }, createdAt: { $gte: tu, $lt: toi } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', ten: { $first: '$items.name' }, sl: { $sum: '$items.qty' }, dt: { $sum: { $toDouble: { $multiply: ['$items.price', '$items.qty'] } } } } },
    { $setWindowFields: { output: { tong: { $sum: '$dt' } } } },
    { $sort: { dt: -1, _id: 1 } }, { $limit: n },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'p', pipeline: [{ $project: { category: 1 } }] } },
    { $project: { ten: 1, danhMuc: { $first: '$p.category' }, sl: 1, trieu: { $round: [{ $divide: ['$dt', 1e6] }, 1] }, tiTrongPct: { $round: [{ $multiply: [{ $divide: ['$dt', '$tong'] }, 100] }, 1] } } },
  ]).toArray();
}

// R3 — k khách mua nhiều nhất ở MỖI thành phố (theo nơi giao), kèm tên.
function R3(k = 2) {
  return db.orders.aggregate([
    { $match: { status: { $in: DA_BAN } } },
    { $group: { _id: { city: '$shipTo.city', kh: '$customerId' }, dt: { $sum: { $toDouble: '$total' } }, soDon: { $sum: 1 } } },
    { $setWindowFields: { partitionBy: '$_id.city', sortBy: { dt: -1 }, output: { hang: { $rank: {} } } } },
    { $match: { hang: { $lte: k } } },
    { $lookup: { from: 'customers', localField: '_id.kh', foreignField: '_id', as: 'c', pipeline: [{ $project: { name: 1 } }] } },
    { $project: { _id: 0, thanhPho: '$_id.city', hang: 1, kh: '$_id.kh', ten: { $first: '$c.name' }, soDon: 1, trieu: { $round: [{ $divide: ['$dt', 1e6] }, 1] } } },
    { $sort: { thanhPho: 1, hang: 1 } },
  ]).toArray();
}

// R4 — trang tổng quan một tháng trong MỘT lượt đọc: KPI, theo trạng thái, phân bố giá trị đơn.
function R4(nam = 2026, thang = 10) {
  return db.orders.aggregate([
    { $match: { createdAt: { $gte: vnNgay(nam, thang, 1), $lt: vnNgay(nam, thang + 1, 1) } } },
    { $facet: {
      kpi: [{ $group: { _id: null, soDon: { $sum: 1 }, daBan: { $sum: { $cond: [{ $in: ['$status', DA_BAN] }, 1, 0] } },
        dt: { $sum: { $cond: [{ $in: ['$status', DA_BAN] }, { $toDouble: '$total' }, 0] } } } },
        { $project: { _id: 0, soDon: 1, tiLeHuyPct: { $round: [{ $multiply: [{ $subtract: [1, { $divide: ['$daBan', '$soDon'] }] }, 100] }, 1] }, trieu: { $round: [{ $divide: ['$dt', 1e6] }, 1] } } }],
      theoTrangThai: [{ $sortByCount: '$status' }],
      giaTri: [{ $bucket: { groupBy: '$total', boundaries: [0, 1e6, 5e6, 2e7, 5e7], default: '≥ 50 triệu', output: { n: { $sum: 1 } } } }],
    } },
  ]).toArray()[0];
}

// R5 — collection tổng hợp doanhThuNgay, chạy hằng đêm cho các ngày từ `tu`; chạy lại bao nhiêu lần cũng ra cùng kết quả.
// $merge chỉ ghi những ngày CÓ đơn: một ngày mà mọi đơn đã bị huỷ/xoá sẽ giữ dòng cũ ⇒ sau khi merge, xoá các dòng trong khoảng
// không được làm mới ở lượt này (capNhatLuc cũ hơn lúc bắt đầu). mongosh chạy trong container nên cùng đồng hồ với $$NOW.
function R5(tu = vnNgay(2026, 1, 1)) {
  const batDau = new Date();
  const ngayTu = new Date(tu.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);   // 'YYYY-MM-DD' theo giờ VN
  db.orders.aggregate([
    { $match: { status: { $in: DA_BAN }, createdAt: { $gte: tu } } },
    { $group: { _id: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d', timezone: TZ } }, soDon: { $sum: 1 }, doanhThu: { $sum: '$total' } } },
    { $set: { capNhatLuc: '$$NOW' } },
    { $merge: { into: 'doanhThuNgay', on: '_id', whenMatched: 'replace', whenNotMatched: 'insert' } },
  ]);
  db.doanhThuNgay.deleteMany({ _id: { $gte: ngayTu }, capNhatLuc: { $lt: batDau } });
  return db.doanhThuNgay.countDocuments();
}
