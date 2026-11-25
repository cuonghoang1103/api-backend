// LỜI GIẢI Lab Chương 3 (khoá MongoDB — cuongthai.com/courses/mongodb). Làm thiết kế của bạn TRƯỚC rồi mới mở tệp này.
// Dùng trong mongosh:  use lab3  rồi  load('/demo/lab3-giai.js')  — tệp chỉ ĐỊNH NGHĨA hàm, không đụng dữ liệu.
// Lần đầu gọi dungLab3() để xoá database hiện tại rồi dựng collection + validator + index + dữ liệu mẫu.
// Mỗi user story ⇒ một quyết định nhúng/tham chiếu + pattern, ghi ở chú thích ngay trên mã.
function dungLab3() {
  db.dropDatabase();

  // US1 + US5 — Trang sản phẩm: một lần đọc. Thuộc tính biến đổi ⇒ attribute; 3 đánh giá mới nhất ⇒ subset; điểm ⇒ computed;
  // tồn theo kho: một–vài (≤ 10 kho) ⇒ nhúng, giới hạn bằng validator.
  db.createCollection('products', { validator: { $jsonSchema: {
    required: ['name', 'price', 'category'],
    properties: {
      price: { bsonType: 'decimal' },
      attrs: { bsonType: 'array', items: { bsonType: 'object', required: ['k', 'v'] } },
      topReviews: { bsonType: 'array', maxItems: 3 },
      kho: { bsonType: 'array', maxItems: 10, items: { bsonType: 'object', required: ['ma', 'ton'], properties: { ton: { bsonType: 'int', minimum: 0 } } } },
    } } } });
  db.products.createIndex({ 'attrs.k': 1, 'attrs.v': 1 });
  db.products.createIndex({ category: 1, price: 1 });

  // Đánh giá: một–nhiều ⇒ collection riêng, con trỏ về cha + index theo trang "mọi đánh giá".
  db.reviews.createIndex({ productId: 1, at: -1 });
  db.createCollection('customers', { validator: { $jsonSchema: { properties: {
    wishlist: { bsonType: 'array', maxItems: 50, items: { bsonType: 'object', required: ['productId', 'at'] } } } } } });
  db.createCollection('orders', { validator: { $jsonSchema: { required: ['customer', 'items', 'status'], properties: {
    items: { bsonType: 'array', minItems: 1, maxItems: 100 },
    history: { bsonType: 'array', maxItems: 20 } } } } });
  db.orders.createIndex({ 'customer._id': 1, createdAt: -1 });
  db.coupons.insertOne({ _id: 'GIAM50K', toiDa: 2, daDung: 0 });
  db.couponUses.createIndex({ code: 1, customerId: 1 }, { unique: true });
  db.dailyRevenue.createIndex({ ngay: 1 }, { unique: true });
  db.products.insertMany([
    { _id: 'SP002', name: 'Laptop Lập Trình 15', category: 'laptop', price: Decimal128('19008000'),
      attrs: [{ k: 'ramGB', v: 16 }, { k: 'ssdGB', v: 512 }, { k: 'cpu', v: 'i7' }], topReviews: [], rating: { tong: 0, n: 0 },
      kho: [{ ma: 'HN', ton: 3 }, { ma: 'DN', ton: 1 }, { ma: 'HCM', ton: 5 }] },
    { _id: 'SP009', name: 'Clean Code', category: 'book', price: Decimal128('278400'),
      attrs: [{ k: 'author', v: 'Robert C. Martin' }, { k: 'pages', v: 464 }], topReviews: [], rating: { tong: 0, n: 0 }, kho: [{ ma: 'HCM', ton: 40 }] },
  ]);
  db.customers.insertMany([{ _id: 'KH0042', name: 'Ngô Hải Chi', wishlist: [] }, { _id: 'KH0066', name: 'Bùi Ngọc Linh', wishlist: [] }]);
  return 'lab3: đã dựng ' + db.getCollectionNames().sort().join(', ');
}

// US5 — Trừ tồn ở một kho: điều kiện $elemMatch ⇒ không bao giờ âm (Bài 2.5); validator ton ≥ 0 là lớp chặn cuối.
function truKho(productId, ma, sl) {
  return db.products.updateOne({ _id: productId, kho: { $elemMatch: { ma, ton: { $gte: sl } } } }, { $inc: { 'kho.$.ton': -sl } }).modifiedCount;
}

function themDanhGia(productId, customerId, stars, text) {
  const at = new Date();
  db.reviews.insertOne({ productId, customerId, stars, text, at });
  // Subset + computed trong MỘT lệnh cập nhật nguyên tử trên sản phẩm.
  return db.products.updateOne({ _id: productId }, {
    $push: { topReviews: { $each: [{ stars, text: text.slice(0, 200), at }], $position: 0, $slice: 3 } },
    $inc: { 'rating.tong': stars, 'rating.n': 1 } }).modifiedCount;
}

// US2 — Wishlist: một–vài có giới hạn (≤ 50) và chỉ khách đó đọc ⇒ nhúng mảng productId trong khách (KHÔNG chép giá: giá phải là giá hiện tại).
function thich(customerId, productId) {
  // $ne trong bộ lọc ⇒ thêm hai lần cùng sản phẩm không tạo bản trùng (giống $addToSet nhưng giữ được trường at).
  return db.customers.updateOne({ _id: customerId, 'wishlist.productId': { $ne: productId } },
    { $push: { wishlist: { productId, at: new Date() } } }).modifiedCount;
}
function trangWishlist(customerId) {
  const kh = db.customers.findOne({ _id: customerId }, { wishlist: 1 });
  const ids = (kh?.wishlist ?? []).map((w) => w.productId);
  return db.products.find({ _id: { $in: ids } }, { name: 1, price: 1 }).toArray();   // ≤ 50 id ⇒ $in nhỏ, có giới hạn
}

// US3 — Đơn: dòng hàng + giá = ẢNH CHỤP; khách = extended reference { _id, name } (đơn mở được làm mới khi đổi tên);
// lịch sử trạng thái: một–vài (≤ 20 lần chuyển) ⇒ nhúng.
function doiTrangThai(orderId, tu, sang, ai) {
  // Điều kiện status: tu ⇒ hai người cùng đổi một đơn thì chỉ một người thắng (Bài 2.5).
  return db.orders.updateOne({ _id: orderId, status: tu },
    { $set: { status: sang }, $push: { history: { tu, sang, ai, at: new Date() } } }).modifiedCount;
}

// US4 — Mã giảm giá: mỗi khách dùng một lần ⇒ collection nối couponUses + index duy nhất; tổng lượt ⇒ cập nhật có điều kiện.
function dungMa(code, customerId) {
  try { db.couponUses.insertOne({ code, customerId, at: new Date() }); }
  catch (e) { if (e.code === 11000) return 'đã dùng rồi'; throw e; }
  const r = db.coupons.updateOne({ _id: code, $expr: { $lt: ['$daDung', '$toiDa'] } }, { $inc: { daDung: 1 } });
  if (r.modifiedCount === 0) { db.couponUses.deleteOne({ code, customerId }); return 'hết lượt'; }   // hoàn lại lượt giữ chỗ
  return 'ok';
}

// US6 — Doanh thu theo ngày: computed + bucket (một tài liệu mỗi ngày), cập nhật bằng $inc khi đơn được trả tiền.
function ghiDoanhThu(order) {
  const ngay = order.createdAt.toISOString().slice(0, 10);   // UTC; báo cáo theo giờ VN thì đổi múi giờ trước (Bài 1.2)
  db.dailyRevenue.updateOne({ ngay }, { $inc: { tong: order.total, soDon: 1 } }, { upsert: true });
}
