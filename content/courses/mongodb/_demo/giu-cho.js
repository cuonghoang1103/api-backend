// Bài 2.5 — bán quá số hàng tồn (oversell). Kho còn 5 chiếc mỗi mã; 4 tiến trình mua CÙNG LÚC, mỗi tiến trình thử mua 5 lần.
//   'NGAY-THO': đọc tồn kho → nếu còn thì ghi stock - 1        (kiểm và ghi là HAI bước tách rời)
//   'NGUYEN-TU': updateOne({ _id, stock: { $gte: 1 } }, { $inc: { stock: -1 } })   (kiểm và ghi trong MỘT thao tác)
// Chạy: for p in 1 2 3 4; do docker exec mgo-lab mongosh --quiet ch2 --file /demo/giu-cho.js & done; wait
for (let i = 0; i < 5; i++) {
  const sp = db.kho.findOne({ _id: 'NGAY-THO' });
  if (sp.stock >= 1) {
    db.kho.updateOne({ _id: 'NGAY-THO' }, { $set: { stock: sp.stock - 1 } });
    db.ban.insertOne({ sp: 'NGAY-THO' });
  }
  const r = db.kho.updateOne({ _id: 'NGUYEN-TU', stock: { $gte: 1 } }, { $inc: { stock: -1 } });
  if (r.modifiedCount === 1) db.ban.insertOne({ sp: 'NGUYEN-TU' });
}
