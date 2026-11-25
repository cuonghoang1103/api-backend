// Lab 4.7 — năm truy vấn chậm của CT Shop trên ch4.don (1.000.000 đơn, nạp bằng don-trieu.js).
// Dùng: docker exec mgo-lab mongosh --quiet ch4 --eval "load('/demo/lab4-do.js'); doHet()"
// doHet() chạy explain('executionStats') cho cả năm truy vấn và in: index được chọn, có SORT trong bộ nhớ không, keys/docs/nReturned, ms.
const TRUY_VAN = {
  Q1_lichSuKhach: () => db.don.find({ khach: 'KH01234' }).sort({ ngay: -1 }).limit(10),
  Q2_hangChoGiao: () => db.don.find({ trangThai: 'PAID', tinh: 'Hà Nội' }).sort({ ngay: 1 }).limit(50),
  Q3_donLonGanDay: () => db.don.find({ trangThai: { $in: ['PAID', 'SHIPPED'] }, tong: { $gte: 15000000 }, ngay: { $gte: ISODate('2026-10-01') } }).sort({ tong: -1 }).limit(20),
  Q4_donCoSanPham: () => db.don.find({ 'items.sp': 'SP042', ngay: { $gte: ISODate('2026-06-01') } }, { _id: 1, ngay: 1 }),
  Q5_tomTatKhach: () => db.don.find({ khach: 'KH04321' }, { _id: 0, ngay: 1, tong: 1, trangThai: 1 }).sort({ ngay: -1 }),
};
function do1(ten) {
  const x = TRUY_VAN[ten]().explain('executionStats');
  const st = []; let p = x.queryPlanner.winningPlan, ix;
  const di = (p) => { if (!p) return; st.push(p.stage); ix = ix || p.indexName; di(p.inputStage); (p.inputStages || []).forEach(di); };
  di(p);
  const e = x.executionStats;
  return { ten, index: ix || '—', keHoach: [...new Set(st)].join('←'), n: e.nReturned, keys: e.totalKeysExamined, docs: e.totalDocsExamined, ms: e.executionTimeMillis };
}
function doHet() { return Object.keys(TRUY_VAN).map(do1); }
