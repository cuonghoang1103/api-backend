// Bài 2.4 — "mất cập nhật" (lost update): 4 tiến trình chạy CÙNG LÚC, mỗi tiến trình tăng bộ đếm 500 lần.
//   cách 1 (sai):  đọc n về ứng dụng → cộng 1 → ghi lại bằng $set
//   cách 2 (đúng): để máy chủ tự cộng bằng $inc (nguyên tử trên một tài liệu)
// Chạy: for p in 1 2 3 4; do docker exec mgo-lab mongosh --quiet ch2 --file /demo/doc-sua-ghi.js & done; wait
for (let i = 0; i < 500; i++) {
  const cu = db.dem.findOne({ _id: 'luotXem' }).n;
  db.dem.updateOne({ _id: 'luotXem' }, { $set: { n: cu + 1 } });
  db.dem.updateOne({ _id: 'luotXemInc' }, { $inc: { n: 1 } });
}
