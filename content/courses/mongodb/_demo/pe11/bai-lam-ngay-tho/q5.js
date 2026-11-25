// Q5 — bài làm ngây thơ: đọc xem ghế còn trống không, rồi mới ghi (kiểm và ghi là HAI bước).
function datGhe(db, suatId, dsGhe, khachId) {
  const s = db.suat.findOne({ _id: suatId });
  const gs = s.ghe.filter((g) => dsGhe.includes(g.ma));
  if (gs.length !== dsGhe.length || gs.some((g) => g.trangThai !== 'TRONG')) return { ok: false, lyDo: 'GHE_DA_DAT' };
  db.suat.updateOne({ _id: suatId }, { $set: { 'ghe.$[g].trangThai': 'DAT', 'ghe.$[g].datBoi': khachId } }, { arrayFilters: [{ 'g.ma': { $in: dsGhe } }] });
  const tong = gs.reduce((a, g) => a + Number(s.giaVe.toString()) + (g.loai === 'VIP' ? 20000 : 0), 0);
  const r = db.ve.insertOne({ khachId, suatId, rapId: s.rapId, phimId: s.phimId, ghe: dsGhe, tong: NumberDecimal(String(tong)), trangThai: 'DA_THANH_TOAN', taoLuc: new Date() });
  return { ok: true, veId: r.insertedId };
}
