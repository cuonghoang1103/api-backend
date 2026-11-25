// Truy vấn chính của CT Shop (ví dụ tệp TV cho kiem-du-an.js, Bài 11.1) — mỗi màn hình quan trọng một dòng.
const TRUY_VAN = [
  { ten: 'đơn của tôi', coll: 'orders', loc: { customerId: 'KH0042' }, sapXep: { createdAt: -1 } },
  { ten: 'đơn chờ giao ở Huế', coll: 'orders', loc: { status: 'PAID', 'shipTo.city': 'Huế' }, sapXep: { createdAt: 1 } },
  { ten: 'sách theo giá', coll: 'products', loc: { category: 'book', price: { $lte: NumberDecimal('300000') } }, sapXep: { price: 1 } },
];
