// Máy chấm đề thi thực hành 11.2 — chạy bởi cham.sh (KHÔNG chạy tay). Biến: BAI = thư mục bài làm (trong container), CAU = câu cần chấm.
// Đáp án KHÔNG nằm ở đây: chỉ có mã băm md5 (12 ký tự đầu) của kết quả đúng, sau khi chuẩn hoá. Dữ liệu tất định ⇒ băm cố định.
const crypto = require('crypto');
const bam = (x) => crypto.createHash('md5').update(JSON.stringify(x)).digest('hex').slice(0, 12);
const DAP = { q2a: '8728705a4ad9', q2b: '6cbf184ae986', q2c: '543c912406c7', q4a: 'f76669ff8140', q4b: '45e7088bf437' };
const GHI = typeof GHI_DAP !== 'undefined';           // chế độ người ra đề: in băm thay vì chấm
let diem = 0;
const dong = (ten, dat, d, max, chu) => { if (dat) diem += d; print(`  ${dat ? '✔' : '✘'} ${ten.padEnd(46)} ${(dat ? d : 0).toFixed(2)}/${max.toFixed(2)}${chu ? '  — ' + chu : ''}`); };
const thu = (f) => { try { return { kq: f() }; } catch (e) { return { loi: (e.codeName || e.name || 'Error') + ': ' + String(e.message).slice(0, 90) }; } };
const soSanh = (ten, f, chuan, max) => {
  const r = thu(f);
  if (r.loi) return dong(ten, false, max, max, r.loi);
  const b = bam(chuan(r.kq));
  if (GHI) return print(`  ${ten}: ${b}`);
  dong(ten, b === DAP[ten.slice(0, 3)], max, max, b === DAP[ten.slice(0, 3)] ? '' : `sai kết quả (${Array.isArray(r.kq) ? r.kq.length + ' dòng' : typeof r.kq})`);
};
const nap = (q) => { const r = thu(() => load(BAI + '/' + q + '.js')); if (r.loi) print('  ! không nạp được ' + q + '.js: ' + r.loi); return !r.loi; };
const giaiDoan = (x) => { const s = []; const di = (o) => { if (o && typeof o === 'object') { if (o.stage) s.push(o.stage); Object.values(o).forEach(di); } }; di(x); return s; };
const gheMoi = () => { const g = []; for (const h of 'ABCDEFGH') for (let c = 1; c <= 10; c++) g.push({ ma: h + c, loai: 'GH'.includes(h) ? 'VIP' : 'THUONG', trangThai: 'TRONG' }); return g; };

if (CAU === 'q1') {
  print('Q1 — validator cho ve (1,5 điểm)');
  nap('q1');
  const tot = { khachId: 'K0001', suatId: 'S0010', ghe: ['A1'], tong: NumberDecimal('90000'), trangThai: 'DA_THANH_TOAN', taoLuc: new Date() };
  const chen = (doc) => thu(() => db.ve.insertOne(doc));
  const r = chen(tot); dong('vé hợp lệ được nhận', !r.loi, 0.5, 0.5, r.loi); if (!r.loi) db.ve.deleteOne({ _id: r.kq.insertedId });
  const { taoLuc, ...thieu } = tot;
  for (const [ten, doc] of [['thiếu taoLuc bị từ chối', thieu], ['ghe rỗng bị từ chối', { ...tot, ghe: [] }],
    ['9 ghế một vé bị từ chối', { ...tot, ghe: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] }],
    ['tong kiểu double bị từ chối', { ...tot, tong: 90000.5 }], ["trangThai 'PAID' bị từ chối", { ...tot, trangThai: 'PAID' }]]) {
    const x = chen(doc); dong(ten, !!x.loi, 0.2, 0.2); if (!x.loi) db.ve.deleteOne({ _id: x.kq.insertedId });
  }
}
if (CAU === 'q2') {
  print('Q2 — truy vấn (2 điểm)');
  if (nap('q2')) {
    soSanh('q2a phim Hành động + Khoa học viễn tưởng', () => q2a(db), (k) => k.map((x) => ({ _id: x._id, ten: x.ten, diemImdb: Number(x.diemImdb) })), 0.75);
    soSanh('q2b suất ở Hà Nội ngày 05/12 (giờ VN)', () => q2b(db), (k) => k.map(String), 0.75);
    soSanh('q2c phân trang keyset vé K0042', () => { const het = []; let sau = null;
      for (let i = 0; i < 40; i++) { const t = q2c(db, sau); if (!t.length) break; het.push(...t.map((x) => String(x._id))); sau = t[t.length - 1]; }
      return het; }, (k) => k, 0.5);
  }
}
if (CAU === 'q3') {
  print('Q3 — index cho lịch chiếu (1,5 điểm)');
  const truoc = db.suat.getIndexes().length;
  nap('q3');
  const moi = db.suat.getIndexes().length - truoc;
  const ex = db.suat.find({ phimId: 'P007', rapId: 'R2', batDau: { $gte: ISODate('2026-11-20T00:00:00+07:00') } }).sort({ batDau: 1 }).explain('executionStats');
  const g = giaiDoan(ex.queryPlanner.winningPlan), st = ex.executionStats;
  print(`  kế hoạch: ${g.join(' ← ')} · nReturned ${st.nReturned} · keys ${st.totalKeysExamined} · docs ${st.totalDocsExamined} · index mới ${moi}`);
  const rai = moi > 2;
  dong('dùng index (IXSCAN)', !rai && g.includes('IXSCAN'), 0.5, 0.5, rai ? 'tạo quá 2 index mới — rải index không được điểm' : '');
  dong('không sắp xếp trong bộ nhớ (không SORT)', !rai && g.includes('IXSCAN') && !g.includes('SORT'), 0.5, 0.5);
  dong('quét đúng số cần: keys = docs = nReturned', !rai && st.totalKeysExamined === st.nReturned && st.totalDocsExamined === st.nReturned, 0.5, 0.5);
}
if (CAU === 'q4') {
  print('Q4 — báo cáo (2 điểm)');
  if (nap('q4')) {
    soSanh('q4a doanh thu theo rạp × tháng (giờ VN)', () => q4a(db), (k) => k.map((x) => ({ rap: x.rap, thang: x.thang, doanhThu: String(x.doanhThu), soVe: Number(x.soVe) })), 1);
    soSanh('q4b top 5 phim theo số ghế', () => q4b(db), (k) => k.map((x) => ({ phimId: x.phimId, ten: x.ten, soGhe: Number(x.soGhe) })), 1);
  }
}
if (CAU === 'q5') {
  print('Q5 — đặt ghế nguyên tử (2 điểm)');
  if (nap('q5')) {
    db.suat.updateOne({ _id: 'S0300' }, { $set: { ghe: gheMoi() } }); db.ve.deleteMany({ suatId: 'S0300' });
    const gia = Number(db.suat.findOne({ _id: 'S0300' }).giaVe.toString());
    const a = thu(() => datGhe(db, 'S0300', ['G1', 'G2'], 'K0001'));
    const s1 = db.suat.findOne({ _id: 'S0300' }), v1 = db.ve.find({ suatId: 'S0300' }).toArray();
    const okA = !a.loi && a.kq && a.kq.ok === true && s1.ghe.filter((g) => ['G1', 'G2'].includes(g.ma) && g.trangThai === 'DAT' && g.datBoi === 'K0001').length === 2
      && v1.length === 1 && String(v1[0].tong) === String(2 * (gia + 20000));
    dong('đặt G1+G2 (VIP): ghế DAT, có vé, tong đúng', okA, 0.5, 0.5, a.loi || '');
    const b = thu(() => datGhe(db, 'S0300', ['G3', 'G2'], 'K0002'));
    const s2 = db.suat.findOne({ _id: 'S0300' });
    const okB = !b.loi && b.kq && b.kq.ok === false && s2.ghe.find((g) => g.ma === 'G3').trangThai === 'TRONG' && db.ve.countDocuments({ suatId: 'S0300' }) === 1;
    dong('G3+G2 (G2 đã bán): từ chối, G3 vẫn TRONG', okB, 0.5, 0.5, b.loi || '');
  }
  // chuẩn bị bài thử đồng thời: 40 suất S0401–S0440 trống hết
  db.suat.updateMany({ _id: { $gte: 'S0401', $lte: 'S0440' } }, { $set: { ghe: gheMoi() } }); db.ve.deleteMany({ suatId: { $gte: 'S0401', $lte: 'S0440' } });
}
if (CAU === 'q5kiem') {
  let trung = 0, lech = 0;
  for (const s of db.suat.find({ _id: { $gte: 'S0401', $lte: 'S0440' } })) {
    const ves = db.ve.find({ suatId: s._id, trangThai: 'DA_THANH_TOAN' }).toArray();
    const dem = {}; for (const v of ves) for (const m of v.ghe) dem[m] = (dem[m] || 0) + 1;
    trung += Object.values(dem).filter((n) => n > 1).length;
    lech += s.ghe.filter((g) => (g.trangThai === 'DAT') !== (dem[g.ma] >= 1)).length;
  }
  print(`  4 tiến trình × 40 suất: ${db.ve.countDocuments({ suatId: { $gte: 'S0401', $lte: 'S0440' } })} vé · ${trung} ghế bán cho hơn một vé · ${lech} ghế lệch giữa suat và ve`);
  dong('bắn đồng thời: không ghế nào bán hai lần', trung === 0 && lech === 0, 1, 1);
}
if (CAU === 'q6') {
  print('Q6 — computed pattern soGheTrong (1 điểm)');
  nap('q6');
  const sai = db.suat.aggregate([{ $project: { dung: { $size: { $filter: { input: '$ghe', cond: { $eq: ['$$this.trangThai', 'TRONG'] } } } }, soGheTrong: 1 } },
    { $match: { $expr: { $ne: ['$dung', '$soGheTrong'] } } }, { $count: 'n' }]).toArray();
  const n = sai.length ? sai[0].n : 0;
  dong('mọi suất có soGheTrong đúng', n === 0, 1, 1, n ? `${n}/600 suất sai` : '');
}
print('DIEM ' + diem);
