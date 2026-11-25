// Lab 10.7 — dựng sự cố "xoá nhầm lúc 14:03" trên database lab10 (chạy bởi lab10-su-co.sh, KHÔNG chạy tay).
// Pha (biến PHA): 'nap' = nạp 3000 đơn · 'a' = ứng dụng chạy sau bản sao lưu · 'xoa' = lệnh xoá nhầm · 'b' = ứng dụng chạy tiếp sau sự cố.
// TẤT ĐỊNH (LCG) ⇒ chạy lại ra đúng cùng một sự cố.
const d = db.getSiblingDB('lab10');
let seed = 1403 + { nap: 0, a: 1, b: 2, xoa: 3 }[PHA];
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const TT = ['NEW', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const goc = Date.UTC(2026, 9, 1);
const donMoi = (id) => ({ _id: id, khach: 'KH' + String(int(1, 300)).padStart(4, '0'), trangThai: 'NEW',
  tong: NumberDecimal(String(int(50, 5000) * 1000)), ngay: new Date(), ghiChu: [] });
if (PHA === 'nap') {
  d.dropDatabase();
  const docs = [];
  for (let i = 1; i <= 3000; i++) docs.push({ _id: i, khach: 'KH' + String(int(1, 300)).padStart(4, '0'), trangThai: TT[int(1, 4)],
    tong: NumberDecimal(String(int(50, 5000) * 1000)), ngay: new Date(goc + Math.floor(rnd() * 50 * 86400000)), ghiChu: [] });
  d.orders.insertMany(docs);
  d.orders.createIndex({ khach: 1, ngay: -1 });
  print(`lab10.orders: ${d.orders.countDocuments()} đơn, ${d.orders.countDocuments({ ngay: { $lt: ISODate('2026-10-20') } })} đơn trước 20/10`);
} else if (PHA === 'a' || PHA === 'b') {
  const tu = PHA === 'a' ? 3001 : 3101, soMoi = PHA === 'a' ? 100 : 60, soSua = PHA === 'a' ? 200 : 150;
  let sua = 0, truot = 0;
  for (let i = 0; i < soMoi; i++) d.orders.insertOne(donMoi(tu + i));
  for (let k = 0; k < soSua; k++) {
    const id = int(1, tu + soMoi - 1);
    const r = d.orders.updateOne({ _id: id }, { $set: { trangThai: TT[int(1, 4)] }, $push: { ghiChu: `pha ${PHA} lượt ${k}` } });
    r.matchedCount ? sua++ : truot++;
  }
  print(`pha ${PHA}: ${soMoi} đơn mới, ${sua} lần sửa trúng, ${truot} lần sửa trượt (matched 0 — đơn đã không còn)`);
} else if (PHA === 'xoa') {
  const r = d.orders.deleteMany({ ngay: { $lt: ISODate('2026-10-20') } });   // định chạy trên lab10.orders_luu_tru, gõ nhầm collection
  print(`14:03 — deleteMany: ${r.deletedCount} đơn bị xoá`);
}
