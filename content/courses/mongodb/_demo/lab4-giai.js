// LỜI GIẢI Lab 4.7 (khoá MongoDB — cuongthai.com/courses/mongodb). Tự thiết kế index của bạn TRƯỚC rồi mới mở tệp này.
// Dùng: docker exec mgo-lab mongosh --quiet ch4 --eval "load('/demo/lab4-giai.js'); taoIndexLab4()"
// Chạy hai lần vẫn an toàn: createIndex với đúng key + tuỳ chọn đã có thì chỉ trả lại tên, không dựng lại.
function taoIndexLab4() {
  return [
    // Q1 (E khach, S ngay) + Q5 (E khach, S ngay, trả ngay/tong/trangThai, bỏ _id ⇒ được phủ) — MỘT index cho cả hai.
    db.don.createIndex({ khach: 1, ngay: -1, tong: 1, trangThai: 1 }),
    // Q2: E trangThai, E tinh, S ngay (tăng dần — đơn chờ lâu nhất trước).
    db.don.createIndex({ trangThai: 1, tinh: 1, ngay: 1 }),
    // Q3: E trangThai ($in ⇒ SORT_MERGE), S tong (giảm dần), R ngay.
    db.don.createIndex({ trangThai: 1, tong: -1, ngay: 1 }),
    // Q4: multikey trên items.sp (E) + R ngay.
    db.don.createIndex({ 'items.sp': 1, ngay: 1 }),
  ];
}
