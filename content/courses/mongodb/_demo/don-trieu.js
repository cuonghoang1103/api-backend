// Bộ dữ liệu LỚN cho Chương 4 (index + explain) — 1.000.000 đơn hàng, TẤT ĐỊNH (chạy lại ra đúng dữ liệu cũ).
// Chạy: docker exec mgo-lab mongosh --quiet /demo/don-trieu.js        (≈ 1–2 phút, ~300 MB trên đĩa)
// Tạo database "ch4", collection "don" — CHƯA có index nào ngoài _id (bài 4.1 sẽ tự tạo).
const ch4 = db.getSiblingDB('ch4');
ch4.dropDatabase();

let seed = 20261124;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const tinh = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế'];
// Trạng thái lệch như đời thật: phần lớn đơn đã xong, rất ít đơn còn chờ.
const trangThai = (x) => (x < 0.55 ? 'DELIVERED' : x < 0.80 ? 'PAID' : x < 0.92 ? 'CANCELLED' : x < 0.99 ? 'SHIPPED' : 'NEW');
const goc = Date.UTC(2025, 0, 1);
const N = 1000000, LO = 10000;
const t0 = Date.now();
for (let lo = 0; lo < N / LO; lo++) {
  const docs = [];
  for (let k = 1; k <= LO; k++) {
    const id = lo * LO + k;
    const soMon = int(1, 3);
    const items = [];
    for (let m = 0; m < soMon; m++) items.push({ sp: 'SP' + String(int(1, 500)).padStart(3, '0'), sl: int(1, 3) });
    docs.push({
      _id: id,
      khach: 'KH' + String(int(1, 50000)).padStart(5, '0'),
      trangThai: trangThai(rnd()),
      tinh: tinh[int(0, 5)],
      tong: int(50, 20000) * 1000,
      ngay: new Date(goc + Math.floor(rnd() * 700 * 86400000)),
      items,
    });
  }
  ch4.don.insertMany(docs, { ordered: false });
}
print(`ch4.don: ${ch4.don.estimatedDocumentCount()} đơn, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
