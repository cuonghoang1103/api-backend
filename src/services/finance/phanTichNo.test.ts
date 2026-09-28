/**
 * Kiểm thử bộ tính nợ (28/09/2026). Mỗi con số được đối chiếu với một cách
 * tính ĐỘC LẬP (công thức đóng bằng số thực JS, hoặc cộng tay) — không lấy
 * chính bộ tính để kiểm bộ tính.
 *
 * Chạy: npx tsx --test src/services/finance/phanTichNo.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeDebt, type DebtCalcInput } from './debtCalculator.js';
import {
  phanTichKhoan, moPhongTatToan, moPhongTraNo, chuanBiMoPhong, soSanhChienLuoc,
  xepHangTraMotLan, laiSuatThucThang, type NoVao,
} from './phanTichNo.js';
import { ngayVN, toDateOnly } from './helpers.js';
import { D } from './money.js';

const n = (v: { toNumber(): number } | number) => (typeof v === 'number' ? v : v.toNumber());
const gan = (a: number, b: number, sai = 0.011, msg?: string) =>
  assert.ok(Math.abs(a - b) <= sai, msg ?? `${a} ≠ ${b} (sai ${Math.abs(a - b)})`);

/** Dựng NoVao từ đầu vào máy tính + đánh dấu `daTra` kỳ đầu đã trả. */
function taoNo(id: number, ten: string, inp: DebtCalcInput, daTra = 0, extra: Partial<NoVao> = {}): NoVao {
  const c = computeDebt(inp);
  return {
    id, lenderName: ten, principal: inp.principal, currency: 'VND',
    interestType: inp.interestType, interestRate: inp.interestRate, rateUnit: inp.rateUnit ?? null,
    startDate: inp.startDate, termMonths: inp.termMonths, paymentDay: inp.paymentDay, status: 'ACTIVE',
    schedule: c.schedule.map((k) => ({ ...k, isPaid: k.installmentNo <= daTra })),
    ...extra,
  };
}

const bat = new Date('2026-01-15T00:00:00Z');

// ── Trả góp đều (annuity) — số chuẩn đề bài ─────────────────────────────
test('dư nợ giảm dần, 100tr · 12%/năm · 24 tháng ⇒ trả đều 4.707.347 ₫/tháng', () => {
  const inp: DebtCalcInput = { principal: 100_000_000, interestType: 'REDUCING_BALANCE', interestRate: 12, rateUnit: 'YEAR', startDate: bat, termMonths: 24 };
  const c = computeDebt(inp);
  // Độc lập: EMI = P·r / (1 − (1+r)^−n) bằng số thực
  const P = 100_000_000, r = 0.01, N = 24;
  const emi = (P * r) / (1 - Math.pow(1 + r, -N));
  assert.equal(Math.round(emi), 4_707_347);
  assert.equal(Math.round(n(c.schedule[0].amountDue)), 4_707_347);
  gan(n(c.schedule[0].amountDue), emi, 0.005);
  // Tổng lãi: độc lập = N·EMI − P (sai số làm tròn từng kỳ < 1 ₫)
  gan(n(c.totalInterest), N * emi - P, 1);
  // Tổng gốc khớp ĐÚNG gốc
  assert.equal(c.schedule.reduce((s, k) => s + n(k.principalPart), 0), P);
  // Nhập 1%/tháng hay 12%/năm ra CÙNG một lịch
  const c2 = computeDebt({ ...inp, interestRate: 1, rateUnit: 'MONTH' });
  assert.equal(c2.totalInterest.toString(), c.totalInterest.toString());
  const c3 = computeDebt({ ...inp, interestRate: 1, rateUnit: null });
  assert.equal(c3.totalInterest.toString(), c.totalInterest.toString());
});

test('lãi năm KHÔNG chia hết 12 (10%/năm) không bị tròn mất lãi suất', () => {
  const c = computeDebt({ principal: 100_000_000, interestType: 'REDUCING_BALANCE', interestRate: 10, rateUnit: 'YEAR', startDate: bat, termMonths: 12 });
  const r = 0.1 / 12;
  const emi = (1e8 * r) / (1 - Math.pow(1 + r, -12));
  gan(n(c.schedule[0].amountDue), emi, 0.005);
});

// ── Gốc đều, lãi giảm dần ──────────────────────────────────────────────
test('gốc đều 120tr · 12%/năm · 12 tháng ⇒ tổng lãi 7.800.000 (= P·r·(n+1)/2)', () => {
  const c = computeDebt({ principal: 120_000_000, interestType: 'EQUAL_PRINCIPAL', interestRate: 12, rateUnit: 'YEAR', startDate: bat, termMonths: 12 });
  assert.equal(n(c.totalInterest), (120e6 * 0.01 * 13) / 2);
  assert.equal(n(c.schedule[0].amountDue), 10_000_000 + 1_200_000);
  assert.equal(n(c.schedule[11].amountDue), 10_000_000 + 100_000);
});

// ── Lãi phẳng — số thật của người dùng (Momo) ───────────────────────────
test('lãi phẳng 45tr · 3,02%/tháng · 18 kỳ ⇒ lãi 1.359.000/tháng, tổng 24.462.000', () => {
  const c = computeDebt({ principal: 45_000_000, interestType: 'FLAT_MONTHLY', interestRate: 3.02, startDate: bat, termMonths: 18 });
  assert.equal(n(c.schedule[0].interestPart), 1_359_000);
  assert.equal(n(c.totalInterest), 24_462_000);
  assert.equal(n(c.schedule[0].amountDue), 2_500_000 + 1_359_000);
});

test('lãi suất thực (IRR): giảm dần 1% ⇒ 1%; lãi phẳng 3,02% ⇒ ~5,4%/tháng', () => {
  const giam = computeDebt({ principal: 100_000_000, interestType: 'REDUCING_BALANCE', interestRate: 1, startDate: bat, termMonths: 24 });
  gan(n(laiSuatThucThang(1e8, giam.schedule.map((k) => k.amountDue))!), 1, 0.0005);
  const phang = computeDebt({ principal: 45_000_000, interestType: 'FLAT_MONTHLY', interestRate: 3.02, startDate: bat, termMonths: 18 });
  // Độc lập: chia đôi bằng số thực
  const A = 3_859_000;
  let lo = 0, hi = 1;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    const npv = -45e6 + A * (1 - Math.pow(1 + m, -18)) / m;
    if (npv > 0) lo = m; else hi = m;
  }
  gan(n(laiSuatThucThang(45e6, phang.schedule.map((k) => k.amountDue))!), lo * 100, 0.0005);
  assert.ok(lo * 100 > 5 && lo * 100 < 6);
});

test('chỉ trả lãi: 50tr · 1,5%/tháng · 6 kỳ ⇒ 750.000/tháng, gốc ở kỳ cuối', () => {
  const c = computeDebt({ principal: 50_000_000, interestType: 'INTEREST_ONLY', interestRate: 1.5, startDate: bat, termMonths: 6 });
  assert.equal(n(c.schedule[0].amountDue), 750_000);
  assert.equal(n(c.schedule[5].amountDue), 50_750_000);
  assert.equal(n(c.totalInterest), 4_500_000);
});

// ── Phân tích một khoản ────────────────────────────────────────────────
test('phân tích: đã trả 12/24 kỳ ⇒ gốc còn lại = dư nợ công thức B12', () => {
  const inp: DebtCalcInput = { principal: 100_000_000, interestType: 'REDUCING_BALANCE', interestRate: 1, startDate: bat, termMonths: 24 };
  const no = taoNo(1, 'Ngân hàng', inp, 12);
  const pt = phanTichKhoan(no, '2027-01-20');
  const r = 0.01, emi = 4_707_347.19;
  const B12 = 1e8 * Math.pow(1 + r, 12) - emi * (Math.pow(1 + r, 12) - 1) / r;
  gan(n(pt.gocConLai), B12, 1);
  assert.equal(pt.soKyConLai, 12);
  assert.equal(pt.lich[11].duNoSau.toString(), pt.gocConLai.toString());
  // lãi đã trả + lãi còn lại = tổng lãi cả khoản
  assert.equal(pt.laiDaTra.plus(pt.laiConPhaiTra).toString(), pt.tongLaiCaKhoan.toString());
  assert.equal(pt.ngayTatToanDuKien, '2028-01-15');
});

test('quá hạn đếm theo NGÀY VIỆT NAM — qua nửa đêm VN là quá hạn 1 ngày', () => {
  // 23:59 ngày 15/02 giờ VN = 16:59Z → vẫn "hôm nay"
  assert.equal(ngayVN(new Date('2026-02-15T16:59:00Z')), '2026-02-15');
  // 00:30 ngày 16/02 giờ VN = 17:30Z ngày 15 theo UTC → đã sang 16/02
  assert.equal(ngayVN(new Date('2026-02-15T17:30:00Z')), '2026-02-16');
  const no = taoNo(2, 'App', { principal: 12_000_000, interestType: 'FLAT_MONTHLY', interestRate: 2, startDate: bat, termMonths: 6 });
  const truoc = phanTichKhoan(no, ngayVN(new Date('2026-02-15T16:59:00Z')));
  assert.equal(truoc.kyToi!.trangThai, 'HOM_NAY');
  assert.equal(truoc.quaHan.soKy, 0);
  const sau = phanTichKhoan(no, ngayVN(new Date('2026-02-15T17:30:00Z')));
  assert.equal(sau.quaHan.soKy, 1);
  assert.equal(sau.quaHan.lauNhatNgay, 1);
  assert.equal(n(sau.quaHan.soTien), 2_000_000 + 240_000);
});

test('toDateOnly: thời điểm ISO lấy ngày VN, chuỗi YYYY-MM-DD giữ nguyên', () => {
  assert.equal(toDateOnly('2026-09-27T18:30:00Z').toISOString().slice(0, 10), '2026-09-28');
  assert.equal(toDateOnly('2026-09-27').toISOString().slice(0, 10), '2026-09-27');
});

// ── Tất toán sớm ───────────────────────────────────────────────────────
test('tất toán đúng ngày kỳ 12 (đã trả): chi = B12, tiết kiệm = 12·EMI − B12', () => {
  const inp: DebtCalcInput = { principal: 100_000_000, interestType: 'REDUCING_BALANCE', interestRate: 1, startDate: bat, termMonths: 24 };
  const no = taoNo(1, 'NH', inp, 12, { prepayFeePct: 0 });
  const pt = phanTichKhoan(no, '2027-01-15');
  const kq = moPhongTatToan(no, pt, '2027-01-15')!;
  const r = 0.01, emi = 4_707_347.19;
  const B12 = 1e8 * Math.pow(1 + r, 12) - emi * (Math.pow(1 + r, 12) - 1) / r;
  gan(n(kq.chiPhiTatToan), B12, 1);
  assert.equal(n(kq.laiDonKyDangChay), 0);
  // tiết kiệm độc lập: tổng 12 kỳ còn lại (theo lịch đã lưu) − B12
  const conLai = no.schedule.filter((k) => !k.isPaid).reduce((s, k) => s + Number(k.amountDue), 0);
  gan(n(kq.tietKiem), conLai - B12, 1);
  assert.equal(kq.chuaKhaiPhi, false);
});

test('tất toán giữa kỳ + phí 2%: lãi dồn theo ngày, phí trên gốc còn lại', () => {
  const inp: DebtCalcInput = { principal: 60_000_000, interestType: 'EQUAL_PRINCIPAL', interestRate: 1.5, startDate: bat, termMonths: 6 };
  const no = taoNo(3, 'NH', inp, 2, { prepayFeePct: 2 }); // đã trả kỳ 1 (15/02), 2 (15/03)
  const pt = phanTichKhoan(no, '2026-03-30');
  const kq = moPhongTatToan(no, pt, '2026-03-30')!;
  // gốc còn lại 40tr; kỳ 3 (15/03→15/04, 31 ngày) lãi = 40tr·1,5% = 600.000; đã qua 15 ngày
  assert.equal(n(kq.gocTatToan), 40_000_000);
  assert.equal(kq.soNgayCuaKy, 31);
  assert.equal(kq.soNgayDaQuaTrongKy, 15);
  gan(n(kq.laiDonKyDangChay), (600_000 * 15) / 31, 0.006);
  assert.equal(n(kq.phiTraTruoc), 800_000);
  // theo lịch: 4 kỳ gốc 10tr + lãi 600k/450k/300k/150k
  assert.equal(n(kq.neuTraTheoLich), 40_000_000 + 1_500_000);
  gan(n(kq.tietKiem), 41_500_000 - (40_000_000 + (600_000 * 15) / 31 + 800_000), 0.006);
});

test('tất toán khi còn kỳ quá hạn: kỳ quá hạn tách riêng, không tính vào "tiết kiệm"', () => {
  const no = taoNo(4, 'App', { principal: 12_000_000, interestType: 'FLAT_MONTHLY', interestRate: 2, startDate: bat, termMonths: 6 });
  const pt = phanTichKhoan(no, '2026-03-20');
  const kq = moPhongTatToan(no, pt, '2026-03-20')!;
  assert.equal(kq.kyDenHanPhaiTra.soKy, 2);
  assert.equal(n(kq.kyDenHanPhaiTra.soTien), 2 * 2_240_000);
  assert.equal(kq.chuaKhaiPhi, true);
  assert.equal(n(kq.gocTatToan), 8_000_000);
});

// ── Mô phỏng trả nợ ────────────────────────────────────────────────────
function haiKhoan() {
  const a = taoNo(10, 'Thẻ tín dụng', { principal: 20_000_000, interestType: 'REDUCING_BALANCE', interestRate: 2.5, startDate: bat, termMonths: 12 });
  const b = taoNo(11, 'Vay mua xe', { principal: 80_000_000, interestType: 'REDUCING_BALANCE', interestRate: 0.9, startDate: bat, termMonths: 36 });
  const c = taoNo(12, 'App Momo', { principal: 45_000_000, interestType: 'FLAT_MONTHLY', interestRate: 3.02, startDate: bat, termMonths: 18 });
  return [a, b, c];
}

test('trả thêm 0 ⇒ mô phỏng khớp ĐÚNG tổng lãi còn lại của lịch, mọi kiểu lãi', () => {
  const ds = [
    ...haiKhoan(),
    taoNo(13, 'Gốc đều', { principal: 30_000_000, interestType: 'EQUAL_PRINCIPAL', interestRate: 1.1, startDate: bat, termMonths: 10 }),
    taoNo(14, 'Chỉ lãi', { principal: 10_000_000, interestType: 'INTEREST_ONLY', interestRate: 2, startDate: bat, termMonths: 5 }),
    taoNo(15, 'Lãi ngày', { principal: 5_000_000, interestType: 'DAILY_PERCENT', interestRate: 0.1, startDate: bat, termMonths: 4 }),
  ];
  const homNay = '2026-01-20';
  const pts = ds.map((d) => phanTichKhoan(d, homNay));
  const mp = ds.map((d, i) => chuanBiMoPhong(d, pts[i], '2026-01', (v) => v)!);
  for (const chienLuoc of ['THEO_LICH', 'AVALANCHE', 'SNOWBALL'] as const) {
    const kq = moPhongTraNo(mp, { chienLuoc, thangDau: '2026-01' });
    const laiLich = pts.reduce((s, p) => s + n(p.laiConPhaiTra), 0);
    gan(n(kq.tongLai), laiLich, 0.001, `${chienLuoc}: ${n(kq.tongLai)} ≠ ${laiLich}`);
    const traLich = pts.reduce((s, p) => s + n(p.tongConPhaiTra), 0);
    gan(n(kq.tongTra), traLich, 0.001);
    assert.equal(kq.thangHetNo, '2029-01'); // khoản 36 kỳ từ 15/01/2026
  }
});

test('trả thêm 1 khoản giảm dần: khớp mô phỏng số thực độc lập', () => {
  const no = taoNo(20, 'NH', { principal: 100_000_000, interestType: 'REDUCING_BALANCE', interestRate: 1, startDate: bat, termMonths: 24 });
  const pt = phanTichKhoan(no, '2026-01-20');
  const mp = [chuanBiMoPhong(no, pt, '2026-01', (v) => v)!];
  const kq = moPhongTraNo(mp, { chienLuoc: 'AVALANCHE', thangDau: '2026-01', traThemMoiThang: 3_000_000 });
  // Độc lập (số thực): mỗi tháng lãi = dư × 1%, trả EMI + 3tr
  // Tháng 1/2026 chưa tới kỳ đầu (15/02) ⇒ khoản trả thêm tháng đầu trả
  // thẳng vào gốc; từ tháng 2 mỗi tháng trả EMI + 3tr.
  let du = 1e8 - 3_000_000, lai = 0, thang = 1;
  const emi = 4_707_347.19;
  while (du > 0.005) {
    thang++;
    const l = Math.round(du * 0.01 * 100) / 100;
    lai += l;
    du = du + l - Math.min(du + l, emi + 3_000_000);
  }
  gan(n(kq.tongLai), lai, 2); // ±2 ₫ do làm tròn từng bước
  assert.equal(kq.soThang, thang);
  assert.ok(kq.soThang < 24);
});

test('thứ tự tối ưu ≤ Avalanche & Snowball; lãi phẳng làm "lãi cao trước" thua', () => {
  const ds = haiKhoan();
  const pts = ds.map((d) => phanTichKhoan(d, '2026-01-20'));
  const mp = ds.map((d, i) => chuanBiMoPhong(d, pts[i], '2026-01', (v) => v)!);
  const ss = soSanhChienLuoc(mp, '2026-01', 5_000_000)!;
  // khoản lãi phẳng 3,02% có lãi THỰC cao nhất ⇒ Avalanche trả nó trước
  assert.equal(ss.avalanche.thuTu[0].ten, 'App Momo');
  assert.equal(ss.snowball.thuTu[0].ten, 'Thẻ tín dụng');
  assert.ok(ss.avalanche.tietKiemSoVoiLich.greaterThan(0));
  assert.ok(ss.snowball.tietKiemSoVoiLich.greaterThan(0));
  const cp = (k: { tongLai: { plus(x: unknown): { toNumber(): number } }; tongPhi: unknown }) => k.tongLai.plus(k.tongPhi).toNumber();
  assert.ok(cp(ss.toiUu) <= cp(ss.avalanche) && cp(ss.toiUu) <= cp(ss.snowball));
  assert.equal(ss.deXuat, 'TOI_UU');
  // Thử tay mọi thứ tự bằng chính mô phỏng CHI_DINH: không thứ tự nào rẻ hơn
  const ids = [10, 11, 12];
  const perms = [[10, 11, 12], [10, 12, 11], [11, 10, 12], [11, 12, 10], [12, 10, 11], [12, 11, 10]];
  for (const p of perms) {
    const k = moPhongTraNo(mp, { chienLuoc: 'CHI_DINH', chiDinh: p, thangDau: '2026-01', traThemMoiThang: 5_000_000 });
    assert.ok(cp(ss.toiUu) <= cp(k), `thứ tự ${p} rẻ hơn tối ưu`);
  }
  assert.equal(ids.length, 3);
  // không trả thêm ⇒ không đề xuất
  assert.equal(soSanhChienLuoc(mp, '2026-01', 0)!.deXuat, null);
});

test('trả thêm một lần: khoản lãi phẳng đóng hẳn ⇒ tránh trọn lãi các kỳ còn lại', () => {
  // Kỳ 1 (15/02) đã trả; hôm nay 20/02 ⇒ trả một lần 50tr trong tháng 2.
  const ds = haiKhoan().map((d) => ({ ...d, schedule: d.schedule.map((k) => ({ ...k, isPaid: k.installmentNo === 1 })) }));
  const pts = ds.map((d) => phanTichKhoan(d, '2026-02-20'));
  const mp = ds.map((d, i) => chuanBiMoPhong(d, pts[i], '2026-02', (v) => v)!);
  const hang = xepHangTraMotLan(mp, '2026-02', 50_000_000);
  const momo = hang.find((h) => h.ten === 'App Momo')!;
  assert.equal(momo.dongKhoanLuon, true);
  // Đóng trong tháng 2: tránh trọn 17 kỳ lãi còn lại (kỳ 2..18)
  gan(n(momo.tietKiem), 17 * 1_359_000, 0.001);
  assert.equal(hang[0].ten, 'App Momo');
});

test('song tệ: khoản $ quy ra VND theo tỷ giá khi mô phỏng', () => {
  const no = taoNo(30, 'USD loan', { principal: 1000, interestType: 'REDUCING_BALANCE', interestRate: 1, startDate: bat, termMonths: 10 }, 0, { currency: 'USD' });
  const pt = phanTichKhoan(no, '2026-01-20');
  assert.equal(pt.tienTe, 'USD');
  const rate = D(25_000);
  const mp = chuanBiMoPhong(no, pt, '2026-01', (v) => v.times(rate).toDecimalPlaces(2))!;
  assert.equal(n(mp.gocConLai), 25_000_000);
  const kq = moPhongTraNo([mp], { chienLuoc: 'THEO_LICH', thangDau: '2026-01' });
  gan(n(kq.tongLai), n(pt.laiConPhaiTra) * 25_000, 0.5);
});

test('khoản đánh dấu tay "đã tất toán" không còn tính vào nợ', () => {
  const no = taoNo(40, 'X', { principal: 10_000_000, interestType: 'NO_INTEREST', interestRate: 0, startDate: bat, termMonths: 5 }, 2, { status: 'PAID_OFF' });
  const pt = phanTichKhoan(no, '2026-09-01');
  assert.equal(n(pt.gocConLai), 0);
  assert.equal(pt.quaHan.soKy, 0);
  assert.equal(chuanBiMoPhong(no, pt, '2026-09', (v) => v), null);
});
