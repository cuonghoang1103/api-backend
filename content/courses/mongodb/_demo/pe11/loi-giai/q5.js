// Q5 (2 điểm) — đặt nhiều ghế: TẤT CẢ hoặc KHÔNG ghế nào, không bao giờ hai vé cùng một ghế, kể cả khi nhiều người bấm cùng lúc.
// Trả về { ok: true, veId } hoặc { ok: false, lyDo }.
function datGhe(db, suatId, dsGhe, khachId) {
  const s = db.getMongo().startSession();
  try {
    let kq;
    s.withTransaction(() => {
      const sd = s.getDatabase(db.getName());
      // Kiểm và ghi trong MỘT lệnh: chỉ khớp khi MỌI ghế cần đặt đang TRONG.
      const doc = sd.suat.findOneAndUpdate(
        { _id: suatId, ghe: { $all: dsGhe.map((m) => ({ $elemMatch: { ma: m, trangThai: 'TRONG' } })) } },
        { $set: { 'ghe.$[g].trangThai': 'DAT', 'ghe.$[g].datBoi': khachId } },
        { arrayFilters: [{ 'g.ma': { $in: dsGhe } }], projection: { rapId: 1, phimId: 1, giaVe: 1, ghe: 1 } });
      if (!doc) { kq = { ok: false, lyDo: 'GHE_DA_DAT' }; return; }
      const gia = doc.giaVe;
      let tong = NumberDecimal('0');
      for (const g of doc.ghe.filter((x) => dsGhe.includes(x.ma)))
        tong = NumberDecimal(String(Number(tong.toString()) + Number(gia.toString()) + (g.loai === 'VIP' ? 20000 : 0)));
      const r = sd.ve.insertOne({ khachId, suatId, rapId: doc.rapId, phimId: doc.phimId, ghe: dsGhe, tong, trangThai: 'DA_THANH_TOAN', taoLuc: new Date() });
      kq = { ok: true, veId: r.insertedId };
    });
    return kq;
  } finally { s.endSession(); }
}
