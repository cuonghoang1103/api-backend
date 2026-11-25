// Bài 6.1 — đọc → tính ở ứng dụng → ghi lại, khi 4 tiến trình cùng sửa MỘT giỏ hàng.
//   'GIO-THO': ghi đè cả mảng items + tong như đọc được (không kiểm ai đã sửa trước) ⇒ mất cập nhật.
//   'GIO-VER': khoá lạc quan — chỉ ghi nếu v vẫn bằng v lúc đọc; trượt (matchedCount 0) thì đọc lại và làm lại.
// Chạy: for p in 1 2 3 4; do docker exec mgo-lab mongosh --quiet ch6 --eval "const P=$p" --file /demo/gio-ver.js & done; wait
const tinhTong = (items) => items.reduce((s, x) => s + x.gia * x.sl, 0) * (items.length >= 10 ? 0.95 : 1); // luật giá "phức tạp" ở ứng dụng
let thuLai = 0;
for (let i = 0; i < 50; i++) {
  const mon = { sp: `P${P}-${i}`, gia: 10000, sl: 1 };
  // Cách ngây thơ
  const g = db.gio.findOne({ _id: 'GIO-THO' });
  const items = [...g.items, mon];
  db.gio.updateOne({ _id: 'GIO-THO' }, { $set: { items, tong: tinhTong(items) } });
  // Khoá lạc quan
  for (;;) {
    const h = db.gio.findOne({ _id: 'GIO-VER' });
    const it = [...h.items, mon];
    const r = db.gio.updateOne({ _id: 'GIO-VER', v: h.v }, { $set: { items: it, tong: tinhTong(it) }, $inc: { v: 1 } });
    if (r.matchedCount === 1) break;
    thuLai++;
  }
}
print(`tiến trình ${P}: thêm 50 món, khoá lạc quan phải thử lại ${thuLai} lần`);
