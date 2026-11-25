/**
 * 5.6 — Lab Chương 5: bảng điều khiển doanh số CT Shop (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s05-6-lab'] (MongoDB 8.0.38, ctshop; kịch bản demo/s05/s05-6-lab.txt) — lời giải che trong <details>.
 * Lời giải = ../_demo/lab5-giai.js (chép nguyên vào GIAI_MA bằng thay // Lab 5.6 — LỜI GIẢI: bảng điều khiển doanh số CT Shop bằng aggregation pipeline (khoá MongoDB, cuongthai.com).
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

// R5 — collection tổng hợp doanhThuNgay, chạy hằng đêm cho các ngày từ \`tu\`; chạy lại bao nhiêu lần cũng ra cùng kết quả.
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
} — sửa tệp thì chép lại). Công cụ đo: ../_demo/ke-pipeline.js (Bài 5.5).
 * Số đối chiếu (tất định): R1 tháng 01 133 đơn 2300,8 tr … tháng 10 146 đơn 2491,3 tr, luỹ kế 26718,2 tr; R2 quý 3 SP003 1596,7 tr 19,3%;
 * R3 12 dòng (Cần Thơ KH0066 Trần Thị An 384,7 tr…); R4 tháng 10: 203 đơn, huỷ+chờ 28,1%, 2491,3 tr, giá trị 20/97/34/28/24;
 * R5 287 dòng, chạy lại 287, tổng soDon 1425 = đếm trực tiếp 1425; R1 tháng 10 = 146 = countDocuments; R2 IXSCAN status_1_createdAt_1 433 khoá / 430 tài liệu.
 * Bẫy phát hiện khi chạy thật: $merge từng phần giữ dòng cũ cho ngày mà mọi đơn đã bị xoá (31/10 vẫn 1 đơn) ⇒ R5 xoá dòng không được làm mới.
 * Gắn với dự án xuyên khoá: mốc 5 (mgo-moc-5) — lab này là bản tập dượt.
 */
import { lenh, ma, loiGiai, kv, lienKet } from '../_chung.mjs';

const K = 's05-6-lab';

const GIAI_MA = `// Lab 5.6 — LỜI GIẢI: bảng điều khiển doanh số CT Shop bằng aggregation pipeline (khoá MongoDB, cuongthai.com).
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

// R5 — collection tổng hợp doanhThuNgay, chạy hằng đêm cho các ngày từ \`tu\`; chạy lại bao nhiêu lần cũng ra cùng kết quả.
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
}`;

const GIAI_EN = `<p>The whole solution is one file, <code>_demo/lab5-giai.js</code>, loaded in mongosh. One constant for the time zone, one for the definition of "sold", one helper for Vietnam-time boundaries, one index, five functions:</p>
${ma('javascript', GIAI_MA)}
<p>The index, then each report run for real:</p>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
<p>R5 run twice, and reconciled: the sum of <code>soDon</code> over all rows of <code>doanhThuNgay</code> equals a direct count of sold orders since 1 January (Vietnam time):</p>
${lenh(K, 5)}
<p>A manual check on a small sample — October in R1 against <code>countDocuments</code> with the same definition:</p>
${lenh(K, 6)}
<p>And the index proof for the report with the widest filter (R2, a quarter):</p>
${lenh(K, 7)}
<p>The 23:30 edge case — and a trap it uncovers. An order at 23:30 Vietnam time on 31 October (16:30 UTC) is counted in October (147 instead of 146) and on 31 October, not 1 November. Then the order is deleted and the summary refreshed twice: once with a plain <code>$merge</code> like Lesson 5.5, once with the final R5:</p>
${lenh(K, 8)}
<p>The plain <code>$merge</code> still shows 1 order on 31 October: <code>$merge</code> only writes the days that <em>have</em> orders in this run, so a day whose last order was cancelled or deleted keeps its old row forever. That is why the final R5 records the start time and, after merging, deletes the rows of the refreshed range that were not rewritten (<code>capNhatLuc</code> older than the start). Rubric: a summary that cannot lose a day is part of "R5 correct".</p>
<p>Notes on the choices: <code>$toDouble</code> appears only where a percentage or a division in millions is computed (display values); sums that may be reused stay Decimal128 (R5). R2 groups by product <em>before</em> the <code>$lookup</code>, so the join runs on at most 60 documents. R3 uses <code>$rank</code>, so a tie would show two customers with the same rank — the rubric accepts <code>$denseRank</code> if the README says why. R4 counts "cancel rate" as everything not sold (PENDING + CANCELLED) — write down your definition; accounting may define it differently.</p>`;

const GIAI_VI = `<p>Cả lời giải là một tệp, <code>_demo/lab5-giai.js</code>, nạp trong mongosh. Một hằng cho múi giờ, một hằng cho định nghĩa "đã bán", một hàm phụ tính mốc giờ Việt Nam, một index, năm hàm:</p>
${ma('javascript', GIAI_MA)}
<p>Index, rồi từng báo cáo chạy thật:</p>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
<p>R5 chạy hai lần, và đối soát: tổng <code>soDon</code> trên mọi dòng của <code>doanhThuNgay</code> bằng phép đếm trực tiếp các đơn đã bán từ 1/1 (giờ Việt Nam):</p>
${lenh(K, 5)}
<p>Kiểm tay trên một mẫu nhỏ — tháng 10 của R1 so với <code>countDocuments</code> cùng định nghĩa:</p>
${lenh(K, 6)}
<p>Và bằng chứng index cho báo cáo có bộ lọc rộng nhất (R2, một quý):</p>
${lenh(K, 7)}
<p>Trường hợp biên 23:30 — và cái bẫy nó làm lộ ra. Một đơn lúc 23:30 giờ Việt Nam ngày 31/10 (16:30 UTC) được tính vào tháng 10 (147 thay vì 146) và vào ngày 31/10, không phải 1/11. Rồi đơn bị xoá và bảng tổng hợp được làm mới hai lần: một lần bằng <code>$merge</code> trơn như Bài 5.5, một lần bằng R5 bản cuối:</p>
${lenh(K, 8)}
<p><code>$merge</code> trơn vẫn hiện 1 đơn ngày 31/10: <code>$merge</code> chỉ ghi những ngày <em>có</em> đơn trong lượt chạy này, nên một ngày mà đơn cuối cùng bị huỷ hay xoá sẽ giữ dòng cũ mãi mãi. Vì thế R5 bản cuối ghi lại lúc bắt đầu và, sau khi merge, xoá các dòng trong khoảng được làm mới mà không được ghi lại (<code>capNhatLuc</code> cũ hơn lúc bắt đầu). Rubric: một bảng tổng hợp không thể "kẹt" một ngày là một phần của "R5 đúng".</p>
<p>Ghi chú về các lựa chọn: <code>$toDouble</code> chỉ xuất hiện ở chỗ tính phần trăm hoặc chia ra triệu (giá trị để hiển thị); các tổng có thể được dùng lại thì giữ Decimal128 (R5). R2 gom theo sản phẩm <em>trước</em> <code>$lookup</code>, nên phép nối chỉ chạy trên tối đa 60 tài liệu. R3 dùng <code>$rank</code>, nên nếu hoà sẽ có hai khách cùng hạng — rubric chấp nhận <code>$denseRank</code> nếu README nói vì sao. R4 tính "tỉ lệ huỷ" là mọi thứ chưa bán (PENDING + CANCELLED) — hãy ghi định nghĩa của bạn ra; kế toán có thể định nghĩa khác.</p>`;

export default {
  title: '5.6 — Lab: the CT Shop sales dashboard|||5.6 — Lab: bảng điều khiển doanh số CT Shop',
  slug: 'mgo-5-6-lab',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Lab 90 phút: dựng năm báo cáo của bảng điều khiển doanh số CT Shop bằng aggregation pipeline — doanh thu tháng có luỹ kế và tăng trưởng (giờ Việt Nam), top sản phẩm có danh mục và tỉ trọng ($unwind + $lookup), top khách mỗi thành phố ($setWindowFields), trang tổng quan một tháng ($facet + $bucket), và collection tổng hợp doanhThuNgay bằng $merge chạy lại an toàn. Mỗi báo cáo phải có định nghĩa ghi rõ, đối soát với phép đếm trực tiếp, và explain chứng minh $match đầu dùng index. Rubric 10 điểm, câu hỏi bảo vệ, lời giải che chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab</span>
<h2>Lab: the CT Shop sales dashboard</h2>
<p class="lead">The sales manager of CT Shop wants a dashboard. You will build its five reports as aggregation pipelines — the same job you would get on an e-commerce or ERP project in your first months. The pipelines are the easy half. The other half, the one that separates a junior from a trusted developer, is proving each number: a written definition, a reconciliation against a count done another way, and an explain showing the report will still be fast when the shop has a million orders.</p>

<h3>Setup</h3>
<p>Lab running (Lesson 0.2), CT Shop loaded fresh: <code>docker exec mgo-lab mongosh --quiet /demo/ctshop-seed.js</code>. Work in a file <code>_demo/lab5.js</code> (the folder is mounted at <code>/demo</code> in the container) and run each report with <code>docker exec mgo-lab mongosh --quiet ctshop --eval "load('/demo/lab5.js'); R1()"</code>. The explain tool of Lesson 5.5 is <code>/demo/ke-pipeline.js</code>.</p>
<p><strong>Definitions (given by the manager):</strong> "sold" = status PAID or SHIPPED; every date, day and month is in Vietnam time (<code>Asia/Ho_Chi_Minh</code>); money is in đồng, shown in millions with one decimal.</p>

<h3>The five reports</h3>
<ol>
<li><strong>R1 — Monthly revenue of 2026:</strong> number of sold orders and revenue per month, running total since January, growth in % compared with the previous month (null for January).</li>
<li><strong>R2 — Top products of a period</strong> (default: 1 July – 30 September 2026): top 5 by revenue with name, category (from <code>products</code>), quantity, revenue and share of the period's total in %.</li>
<li><strong>R3 — Best customers per city:</strong> the top 2 customers by sold revenue in each shipping city, with their name and number of orders, ranked.</li>
<li><strong>R4 — One-month overview</strong> (default: October 2026) in <em>one</em> pipeline: KPI (orders, % not sold, revenue), count per status, and distribution of order values in the buckets 0–1, 1–5, 5–20, 20–50 and ≥ 50 million.</li>
<li><strong>R5 — Summary collection:</strong> a job that writes one document per day (<code>_id: 'YYYY-MM-DD'</code>, orders, revenue, refresh time) into <code>doanhThuNgay</code> for all days from a given date. Running it twice must give the same collection.</li>
</ol>

<h3>Tasks</h3>
<ol>
<li><strong>Write the definition</strong> of each report in one sentence in <code>BAO-CAO.md</code> before writing its pipeline.</li>
<li><strong>Build</strong> each pipeline stage by stage; for R1 and R2 paste the document count after each stage.</li>
<li><strong>Index:</strong> create the fewest indexes so that every report's first stage is an IXSCAN; prove it with <code>ke()</code>.</li>
<li><strong>Reconcile:</strong> (a) one month of R1 equals a <code>countDocuments</code> with the same definition; (b) the sum of <code>soDon</code> in <code>doanhThuNgay</code> equals the count of sold orders in the same range; (c) R5 run twice gives the same number of documents.</li>
<li><strong>Edge case:</strong> insert an order created at 23:30 Vietnam time on 31 October and show which month and day it is counted in — then delete it.</li>
</ol>
<p><strong>Advanced:</strong> make R5 incremental (only the last 2 days); add to R4 a facet "top 3 products of the month"; run R1 on <code>ch4.don</code> (one million orders, fields <code>trangThai</code>/<code>ngay</code>/<code>tong</code>) and report whether any stage spills to disk.</p>

<h3>Rubric (10 points)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Five correct reports; outputs pasted; definitions written before the pipelines</td><td>3</td></tr>
<tr><td>Time zone correct everywhere: Vietnam-time <code>$match</code> boundaries <em>and</em> <code>timezone</code> in every grouping; the 23:30 edge case shown</td><td>2</td></tr>
<tr><td>No double counting after <code>$unwind</code> (R2) and join after grouping (R2, R3)</td><td>1</td></tr>
<tr><td>Three reconciliations (month vs count, summary vs count, R5 twice)</td><td>2</td></tr>
<tr><td>Index proof with explain for every report; one index serves all five</td><td>2</td></tr>
</tbody></table>
<p><strong>Common deductions:</strong> grouping by <code>$dateToString</code> without <code>timezone</code> (−2, Lesson 5.3); summing <code>total</code> after <code>$unwind</code> (−2, Lesson 5.2); <code>$lookup</code> before grouping, once per order line (−1); <code>$bucket</code> without <code>default</code> that "works" only on today's data (−1); R5 that duplicates rows on the second run (−2) or keeps a stale row for a day whose orders were all cancelled (−1); money summed as double without saying where it is only for display (−0.5).</p>

<h3>Defend your design (questions a reviewer will ask)</h3>
<ul>
<li>"The accountant counts revenue by payment date, not order date. What changes in your pipelines and your index?"</li>
<li>"Why does R5 replace whole days instead of incrementing counters when an order arrives?"</li>
<li>"R3 shows two customers with rank 2 and none with rank 3. Is that a bug?"</li>
<li>"The shop reaches 5 million orders. Which of your reports would you move to <code>$merge</code> first, and how often would you refresh it?"</li>
<li>"Marketing wants to write their own reports. Can they send you a pipeline?"</li>
</ul>

<h3>Solution</h3>
${loiGiai('Open only after your reports are reconciled — full solution, run on MongoDB 8.0', GIAI_EN)}

<h3>Connect it to your project</h3>
<p>Milestone 5 of the course project (<code>mgo-moc-5</code>) is this lab on your own topic: three reports a manager of your product would ask for, at least one with <code>$lookup</code> and one grouped by day or month in Asia/Ho_Chi_Minh, each starting with a <code>$match</code> that uses an index (explain in the README), with the expected result written by hand for a small sample first.</p>
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-16-4-capstone', title: 'PostgreSQL 16.4 — Capstone', sub: 'If you build the same project on PostgreSQL: the SQL reports to compare with' })}

<h3>🗂 Key terms</h3>
${kv([
  ['Business definition', 'One sentence saying exactly which documents a number counts and in which time zone — written before the pipeline.'],
  ['Reconciliation', 'Checking a report value against the same quantity computed another way (count, other report).'],
  ['Idempotent job', 'A scheduled job that gives the same result however many times it runs.'],
  ['Summary collection', 'A small collection maintained by $merge so that a dashboard reads instead of aggregating.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab</span>
<h2>Lab: bảng điều khiển doanh số CT Shop</h2>
<p class="lead">Quản lý bán hàng của CT Shop muốn có một bảng điều khiển. Bạn sẽ dựng năm báo cáo của nó bằng aggregation pipeline — đúng việc bạn sẽ nhận ở một dự án thương mại điện tử hay ERP trong vài tháng đầu đi làm. Pipeline là nửa dễ. Nửa còn lại, thứ phân biệt một junior với một lập trình viên được tin tưởng, là chứng minh từng con số: một định nghĩa viết ra, một bước đối soát với phép đếm làm bằng cách khác, và một explain cho thấy báo cáo vẫn nhanh khi cửa hàng có một triệu đơn.</p>

<h3>Chuẩn bị</h3>
<p>Lab đang chạy (Bài 0.2), CT Shop vừa nạp lại: <code>docker exec mgo-lab mongosh --quiet /demo/ctshop-seed.js</code>. Làm việc trong tệp <code>_demo/lab5.js</code> (thư mục được gắn vào container ở <code>/demo</code>) và chạy từng báo cáo bằng <code>docker exec mgo-lab mongosh --quiet ctshop --eval "load('/demo/lab5.js'); R1()"</code>. Công cụ explain của Bài 5.5 là <code>/demo/ke-pipeline.js</code>.</p>
<p><strong>Định nghĩa (quản lý đưa ra):</strong> "đã bán" = trạng thái PAID hoặc SHIPPED; mọi ngày, ngày trong tháng và tháng đều theo giờ Việt Nam (<code>Asia/Ho_Chi_Minh</code>); tiền tính bằng đồng, hiển thị theo triệu, một chữ số thập phân.</p>

<h3>Năm báo cáo</h3>
<ol>
<li><strong>R1 — Doanh thu từng tháng năm 2026:</strong> số đơn đã bán và doanh thu mỗi tháng, luỹ kế từ tháng 1, tăng trưởng tính bằng % so với tháng trước (null cho tháng 1).</li>
<li><strong>R2 — Sản phẩm đứng đầu một giai đoạn</strong> (mặc định: 1/7 – 30/9/2026): top 5 theo doanh thu kèm tên, danh mục (lấy từ <code>products</code>), số lượng, doanh thu và tỉ trọng trong tổng của giai đoạn tính bằng %.</li>
<li><strong>R3 — Khách tốt nhất mỗi thành phố:</strong> 2 khách đứng đầu theo doanh thu đã bán ở mỗi thành phố giao hàng, kèm tên và số đơn, có xếp hạng.</li>
<li><strong>R4 — Tổng quan một tháng</strong> (mặc định: tháng 10/2026) trong <em>một</em> pipeline: KPI (số đơn, % chưa bán, doanh thu), số đơn theo trạng thái, và phân bố giá trị đơn trong các khoảng 0–1, 1–5, 5–20, 20–50 và từ 50 triệu.</li>
<li><strong>R5 — Collection tổng hợp:</strong> một việc ghi mỗi ngày một tài liệu (<code>_id: 'YYYY-MM-DD'</code>, số đơn, doanh thu, lúc làm mới) vào <code>doanhThuNgay</code> cho mọi ngày kể từ một ngày cho trước. Chạy hai lần phải ra cùng một collection.</li>
</ol>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Viết định nghĩa</strong> của từng báo cáo thành một câu trong <code>BAO-CAO.md</code> trước khi viết pipeline của nó.</li>
<li><strong>Dựng</strong> từng pipeline theo từng stage; với R1 và R2, dán số tài liệu sau mỗi stage.</li>
<li><strong>Index:</strong> tạo ít index nhất để stage đầu của mọi báo cáo là IXSCAN; chứng minh bằng <code>ke()</code>.</li>
<li><strong>Đối soát:</strong> (a) một tháng của R1 bằng một <code>countDocuments</code> cùng định nghĩa; (b) tổng <code>soDon</code> trong <code>doanhThuNgay</code> bằng số đơn đã bán trong cùng khoảng; (c) R5 chạy hai lần ra cùng số tài liệu.</li>
<li><strong>Trường hợp biên:</strong> chèn một đơn tạo lúc 23:30 giờ Việt Nam ngày 31/10 và chỉ ra nó được tính vào tháng nào, ngày nào — rồi xoá nó.</li>
</ol>
<p><strong>Nâng cao:</strong> làm R5 cập nhật từng phần (chỉ 2 ngày gần nhất); thêm vào R4 một facet "top 3 sản phẩm của tháng"; chạy R1 trên <code>ch4.don</code> (một triệu đơn, các trường <code>trangThai</code>/<code>ngay</code>/<code>tong</code>) và báo có stage nào tràn đĩa không.</p>

<h3>Rubric (10 điểm)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Năm báo cáo đúng; dán output; định nghĩa viết trước pipeline</td><td>3</td></tr>
<tr><td>Múi giờ đúng ở mọi nơi: mốc <code>$match</code> theo giờ Việt Nam <em>và</em> <code>timezone</code> trong mọi phép gom; có trường hợp biên 23:30</td><td>2</td></tr>
<tr><td>Không tính trùng sau <code>$unwind</code> (R2) và nối sau khi gom (R2, R3)</td><td>1</td></tr>
<tr><td>Ba phép đối soát (tháng so với đếm, bảng tổng hợp so với đếm, R5 hai lần)</td><td>2</td></tr>
<tr><td>Bằng chứng index bằng explain cho mọi báo cáo; một index phục vụ cả năm</td><td>2</td></tr>
</tbody></table>
<p><strong>Lỗi hay bị trừ:</strong> gom bằng <code>$dateToString</code> không có <code>timezone</code> (−2, Bài 5.3); cộng <code>total</code> sau <code>$unwind</code> (−2, Bài 5.2); <code>$lookup</code> trước khi gom, mỗi dòng món một lần (−1); <code>$bucket</code> không có <code>default</code> mà chỉ "chạy được" trên dữ liệu hôm nay (−1); R5 nhân đôi dòng ở lần chạy thứ hai (−2) hoặc giữ dòng cũ cho một ngày mà mọi đơn đã bị huỷ (−1); cộng tiền bằng double mà không nói rõ chỗ nào chỉ để hiển thị (−0,5).</p>

<h3>Bảo vệ thiết kế (câu hỏi người review sẽ đặt)</h3>
<ul>
<li>"Kế toán tính doanh thu theo ngày thanh toán, không theo ngày đặt đơn. Pipeline và index của bạn đổi gì?"</li>
<li>"Vì sao R5 thay cả ngày thay vì cộng dồn bộ đếm mỗi khi có đơn tới?"</li>
<li>"R3 hiện hai khách hạng 2 và không ai hạng 3. Đó có phải lỗi không?"</li>
<li>"Cửa hàng chạm 5 triệu đơn. Báo cáo nào bạn chuyển sang <code>$merge</code> trước, và làm mới bao lâu một lần?"</li>
<li>"Bên marketing muốn tự viết báo cáo. Họ gửi pipeline cho bạn được không?"</li>
</ul>

<h3>Lời giải</h3>
${loiGiai('Chỉ mở sau khi báo cáo của bạn đã đối soát xong — lời giải đầy đủ, chạy thật trên MongoDB 8.0', GIAI_VI)}

<h3>Nối vào dự án của bạn</h3>
<p>Mốc 5 của dự án xuyên khoá (<code>mgo-moc-5</code>) chính là lab này trên đề tài của bạn: ba báo cáo mà người quản lý sản phẩm của bạn sẽ hỏi, ít nhất một cái có <code>$lookup</code> và một cái gom theo ngày hoặc tháng ở Asia/Ho_Chi_Minh, mỗi cái bắt đầu bằng một <code>$match</code> dùng được index (explain trong README), và kết quả mong đợi được viết tay cho một mẫu nhỏ trước.</p>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-16-4-capstone', title: 'PostgreSQL 16.4 — Dự án tổng kết', sub: 'Nếu bạn dựng cùng dự án trên PostgreSQL: các báo cáo SQL để so sánh' })}

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Định nghĩa nghiệp vụ', 'Một câu nói chính xác một con số đếm những tài liệu nào và theo múi giờ nào — viết trước pipeline.'],
  ['Đối soát (reconciliation)', 'Kiểm một giá trị báo cáo với cùng đại lượng tính bằng cách khác (phép đếm, báo cáo khác).'],
  ['Việc chạy lại an toàn (idempotent)', 'Việc chạy theo lịch cho cùng kết quả dù chạy bao nhiêu lần.'],
  ['Collection tổng hợp', 'Collection nhỏ được $merge duy trì để bảng điều khiển đọc thay vì aggregate.'],
])}
</div>
`,
};
