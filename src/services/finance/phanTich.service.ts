/**
 * PHÂN TÍCH TÀI CHÍNH — một gói số liệu ĐÃ TÍNH cho màn "Phân tích", khối nợ
 * và cố vấn AI (28/09/2026).
 * ─────────────────────────────────────────────────────────────────────
 * Đọc dữ liệu thật của người dùng rồi tính: nợ (gốc/lãi còn lại, lịch từng
 * tháng, quá hạn), dòng tiền ròng (thu − chi − trả nợ) 6 tháng, chi theo
 * nhóm so tháng trước và so CÙNG KỲ, tỷ lệ nợ/thu nhập, quỹ khẩn cấp đủ mấy
 * tháng, đầu tư lãi/lỗ, và danh sách cảnh báo.
 *
 * Luật chung với cả module: tiền là Decimal, mọi tổng quy ra VND bằng tỷ giá
 * người dùng tự đặt (`toVnd`); USD mà chưa có tỷ giá thì KHÔNG cộng bừa —
 * cờ `coUsdChuaQuyDoi` bật lên và UI nói rõ. "Hôm nay / tháng này" theo lịch
 * Việt Nam (`ngayVN`).
 *
 * ⚠️ Chuyển tiền giữa hai ví, gửi tiết kiệm, mua tài sản đầu tư KHÔNG phải
 * chi tiêu: chúng nằm ở `WalletAdjustment`, không ở `Expense`, nên không bị
 * đếm vào "chi". Trả nợ nằm ở `DebtPayment` — cũng không phải `Expense` — nên
 * dòng tiền ròng phải trừ riêng nó (trước đây "Để dành tháng này" = thu − chi,
 * bỏ sót tiền trả nợ và báo dư ảo).
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { D, round2, sum, type Dec } from './money.js';
import { ngayVN } from './helpers.js';
import { getCurrentFxRate, toVnd } from './fx.service.js';
import { runDue } from './recurring.service.js';
import { sweepOverdue, noVaoTu } from './debt.service.js';
import { savingsMaturityInterest } from './debtCalculator.js';
import {
  phanTichKhoan, moPhongTatToan, chuanBiMoPhong, soSanhChienLuoc, xepHangTraMotLan,
  congThang, soNgay, thangCua, type PhanTichKhoan, type NoMoPhong,
} from './phanTichNo.js';

const ZERO = () => new Prisma.Decimal(0);
const pct = (a: Dec, b: Dec): number | null => (b.isZero() ? null : round2(a.dividedBy(b).times(100)).toNumber());

export type MucCanhBao = 'nguy' | 'canh' | 'tin';
export interface CanhBao { muc: MucCanhBao; ma: string; tieuDe: string; chiTiet?: string; lienKet?: string }

function soNgayTrongThang(thang: string): number {
  const [y, m] = thang.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Số kiểu Việt: 47,7 — dấu phẩy thập phân. */
const soVN = (v: number | null | undefined, le = 1) => (v == null ? '' : v.toLocaleString('vi-VN', { maximumFractionDigits: le }));
const usd = (v: Dec) => `$${round2(v).toNumber().toLocaleString('vi-VN', { maximumFractionDigits: 2 })}`;

function vnd(v: Dec): string {
  return `${round2(v).toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP).toNumber().toLocaleString('vi-VN')}₫`;
}

/** Nạp mọi thứ + tính. `homNay` truyền vào được để kiểm thử. */
export async function phanTichTaiChinh(userId: number, homNay: string = ngayVN()) {
  await runDue(userId).catch(() => undefined);
  await sweepOverdue(userId).catch(() => undefined);

  const thang = thangCua(homNay);
  const cacThang = Array.from({ length: 6 }, (_, i) => congThang(thang, i - 5)); // 6 tháng, cũ → mới
  const tu = new Date(`${cacThang[0]}-01T00:00:00.000Z`);
  const den = new Date(`${congThang(thang, 1)}-01T00:00:00.000Z`);

  const [fxRow, debts, wallets, thuRows, chiRows, traNoRows, cats, soTK, dauTu, mucTieu] = await Promise.all([
    getCurrentFxRate(userId),
    prisma.debt.findMany({ where: { userId }, include: { schedule: true, payments: true } }),
    prisma.wallet.findMany({ where: { userId, isArchived: false }, select: { id: true, name: true, balance: true, currency: true } }),
    prisma.incomeEntry.findMany({
      where: { userId, date: { gte: tu, lt: den } },
      select: { amount: true, currency: true, date: true, type: true, source: { select: { id: true, name: true, type: true } } },
    }),
    prisma.expense.findMany({ where: { userId, date: { gte: tu, lt: den } }, select: { amount: true, currency: true, date: true, categoryId: true } }),
    prisma.debtPayment.findMany({ where: { userId, date: { gte: tu, lt: den } }, select: { amount: true, date: true, debtId: true } }),
    prisma.expenseCategory.findMany({ where: { userId }, select: { id: true, name: true, icon: true, color: true, monthlyBudget: true } }),
    prisma.savingsAccount.findMany({ where: { userId, status: { not: 'WITHDRAWN' } } }),
    prisma.investment.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
    prisma.financeSpendingGoal.findMany({ where: { userId, isActive: true }, select: { period: true, amount: true } }),
  ]);

  const rate = fxRow ? D(fxRow.vndPerUsd) : null;
  let coUsd = false;
  const q = (v: Prisma.Decimal.Value | null | undefined, cur: string | null | undefined): Dec => {
    if (cur === 'USD') coUsd = true;
    return toVnd(v ?? 0, cur, rate);
  };
  const coUsdChuaQuyDoi = () => coUsd && !rate;

  // ─── NỢ ────────────────────────────────────────────────────────────
  const debtCur = new Map(debts.map((d) => [d.id, d.currency]));
  const cacKhoan = debts.map((d) => ({ vao: noVaoTu(d), pt: phanTichKhoan(noVaoTu(d), homNay) }));
  const dangNo = cacKhoan.filter((k) => !k.pt.daTatToan);
  const qd = (pt: PhanTichKhoan, v: Dec) => q(v, pt.tienTe);

  const tongNo = {
    gocBanDau: round2(sum(dangNo.map((k) => qd(k.pt, k.pt.gocBanDau)))),
    gocConLai: round2(sum(dangNo.map((k) => qd(k.pt, k.pt.gocConLai)))),
    laiConPhaiTra: round2(sum(dangNo.map((k) => qd(k.pt, k.pt.laiConPhaiTra)))),
    tongConPhaiTra: round2(sum(dangNo.map((k) => qd(k.pt, k.pt.tongConPhaiTra)))),
    laiDaTra: round2(sum(cacKhoan.map((k) => qd(k.pt, k.pt.laiDaTra)))),
    tongLaiCaKhoan: round2(sum(dangNo.map((k) => qd(k.pt, k.pt.tongLaiCaKhoan)))),
    soKhoanDangNo: dangNo.filter((k) => k.pt.gocConLai.greaterThan(0) || k.pt.soKyConLai > 0).length,
    ngayHetNo: dangNo.reduce<string | null>((m, k) => (k.pt.ngayTatToanDuKien && (!m || k.pt.ngayTatToanDuKien > m) ? k.pt.ngayTatToanDuKien : m), null),
  };

  // Lịch trả gộp theo THÁNG (VND): kỳ quá hạn tháng cũ gom riêng.
  const theoThangMap = new Map<string, { goc: Dec; lai: Dec; tong: Dec; soKy: number; daTra: Dec }>();
  const quaHanCu = { goc: ZERO(), lai: ZERO(), tong: ZERO(), soKy: 0 };
  for (const k of dangNo) {
    for (const ky of k.pt.lich) {
      const t = thangCua(ky.ngay);
      if (ky.trangThai === 'DA_TRA') {
        if (t === thang) {
          const e = theoThangMap.get(t) ?? { goc: ZERO(), lai: ZERO(), tong: ZERO(), soKy: 0, daTra: ZERO() };
          e.daTra = e.daTra.plus(qd(k.pt, ky.tong));
          e.soKy += 0;
          theoThangMap.set(t, e);
        }
        continue;
      }
      if (t < thang) {
        quaHanCu.goc = quaHanCu.goc.plus(qd(k.pt, ky.goc));
        quaHanCu.lai = quaHanCu.lai.plus(qd(k.pt, ky.lai));
        quaHanCu.tong = quaHanCu.tong.plus(qd(k.pt, ky.tong));
        quaHanCu.soKy++;
        continue;
      }
      const e = theoThangMap.get(t) ?? { goc: ZERO(), lai: ZERO(), tong: ZERO(), soKy: 0, daTra: ZERO() };
      e.goc = e.goc.plus(qd(k.pt, ky.goc));
      e.lai = e.lai.plus(qd(k.pt, ky.lai));
      e.tong = e.tong.plus(qd(k.pt, ky.tong));
      e.soKy++;
      theoThangMap.set(t, e);
    }
  }
  const lichTheoThang = [...theoThangMap.entries()]
    .filter(([t, v]) => v.soKy > 0 || t === thang)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([t, v]) => ({ thang: t, goc: round2(v.goc), lai: round2(v.lai), tong: round2(v.tong), soKy: v.soKy, daTraTrongThang: round2(v.daTra) }));

  const thangNayNo = theoThangMap.get(thang) ?? { goc: ZERO(), lai: ZERO(), tong: ZERO(), soKy: 0, daTra: ZERO() };
  const noThangNay = {
    conPhaiTra: round2(thangNayNo.tong),
    laiTrongDo: round2(thangNayNo.lai),
    daTra: round2(thangNayNo.daTra),
    tongNghiaVu: round2(thangNayNo.tong.plus(thangNayNo.daTra)),
    quaHanThangTruoc: { soKy: quaHanCu.soKy, tong: round2(quaHanCu.tong), goc: round2(quaHanCu.goc), lai: round2(quaHanCu.lai) },
  };

  const quaHan = dangNo
    .flatMap((k) => k.pt.quaHan.cacKy.map((ky) => ({ debtId: k.pt.id, ten: k.pt.ten, tienTe: k.pt.tienTe, ky: ky.ky, ngay: ky.ngay, soTien: ky.tong, soTienVnd: qd(k.pt, ky.tong), soNgayQuaHan: ky.soNgayQuaHan, kyId: ky.id })))
    .sort((a, b) => b.soNgayQuaHan - a.soNgayQuaHan);
  const sapDenHan = dangNo
    .flatMap((k) => k.pt.sapDenHan.map((ky) => ({ debtId: k.pt.id, ten: k.pt.ten, tienTe: k.pt.tienTe, ky: ky.ky, ngay: ky.ngay, soTien: ky.tong, soTienVnd: qd(k.pt, ky.tong), conNgay: -ky.soNgayQuaHan, kyId: ky.id })))
    .sort((a, b) => a.conNgay - b.conNgay);

  // Mô phỏng: mọi khoản có lịch, quy VND. Khoản USD chưa có tỷ giá bị loại.
  const moPhong: NoMoPhong[] = [];
  const loaiKhoiMoPhong: string[] = [];
  for (const k of dangNo) {
    if (k.pt.tienTe === 'USD' && !rate) { loaiKhoiMoPhong.push(`${k.pt.ten} (USD, chưa đặt tỷ giá)`); continue; }
    const m = chuanBiMoPhong(k.vao, k.pt, thang, (v) => q(v, k.pt.tienTe));
    if (m) moPhong.push(m);
  }
  const tatToanHomNay = dangNo
    .map((k) => {
      const kq = moPhongTatToan(k.vao, k.pt, homNay);
      if (!kq || kq.soKyBoQua === 0) return null;
      return {
        debtId: k.pt.id, ten: k.pt.ten, tienTe: k.pt.tienTe,
        chiPhiTatToan: kq.chiPhiTatToan, tietKiem: kq.tietKiem, kyDenHanPhaiTra: kq.kyDenHanPhaiTra.soTien,
        chiPhiTatToanVnd: qd(k.pt, kq.chiPhiTatToan), tietKiemVnd: qd(k.pt, kq.tietKiem),
        chuaKhaiPhi: kq.chuaKhaiPhi, soKyBoQua: kq.soKyBoQua,
      };
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
    .sort((a, b) => b.tietKiemVnd.comparedTo(a.tietKiemVnd));

  // ─── DÒNG TIỀN 6 THÁNG ───────────────────────────────────────────────
  const tm = new Map(cacThang.map((t) => [t, { thu: ZERO(), chi: ZERO(), traNo: ZERO(), soGhiThu: 0, soGhiChi: 0 }]));
  for (const r of thuRows) { const e = tm.get(thangCua(r.date.toISOString())); if (e) { e.thu = e.thu.plus(q(r.amount, r.currency)); e.soGhiThu++; } }
  for (const r of chiRows) { const e = tm.get(thangCua(r.date.toISOString())); if (e) { e.chi = e.chi.plus(q(r.amount, r.currency)); e.soGhiChi++; } }
  for (const r of traNoRows) { const e = tm.get(thangCua(r.date.toISOString())); if (e) e.traNo = e.traNo.plus(q(r.amount, debtCur.get(r.debtId) ?? 'VND')); }
  const xuHuong = cacThang.map((t) => {
    const e = tm.get(t)!;
    return { thang: t, thu: round2(e.thu), chi: round2(e.chi), traNo: round2(e.traNo), rong: round2(e.thu.minus(e.chi).minus(e.traNo)), coDuLieu: e.soGhiThu + e.soGhiChi > 0 };
  });
  const thangNay = xuHuong[5];
  const thangTruoc = xuHuong[4];

  // Bình quân 3 tháng ĐỦ gần nhất có dữ liệu (không tính tháng đang chạy).
  const ba = xuHuong.slice(2, 5).filter((x) => x.coDuLieu);
  const bq = (f: (x: (typeof xuHuong)[number]) => Dec) => (ba.length ? round2(sum(ba.map(f)).dividedBy(ba.length)) : null);
  const thuBQ = bq((x) => x.thu);
  const chiBQ = bq((x) => x.chi);
  const traNoBQ = bq((x) => x.traNo);

  // ─── CHI TIÊU THÁNG NÀY ──────────────────────────────────────────────
  const ngayTrongThang = Number(homNay.slice(8, 10));
  const soNgayThang = soNgayTrongThang(thang);
  const catMap = new Map(cats.map((c) => [c.id, c]));
  const theoNhom = new Map<number, { nay: Dec; truoc: Dec; truocCungKy: Dec }>();
  let chiCungKyTruoc = ZERO();
  for (const r of chiRows) {
    const t = thangCua(r.date.toISOString());
    const v = q(r.amount, r.currency);
    const e = theoNhom.get(r.categoryId) ?? { nay: ZERO(), truoc: ZERO(), truocCungKy: ZERO() };
    if (t === thang) e.nay = e.nay.plus(v);
    else if (t === thangTruoc.thang) {
      e.truoc = e.truoc.plus(v);
      if (Number(r.date.toISOString().slice(8, 10)) <= ngayTrongThang) { e.truocCungKy = e.truocCungKy.plus(v); chiCungKyTruoc = chiCungKyTruoc.plus(v); }
    }
    theoNhom.set(r.categoryId, e);
  }
  const nhomChi = [...theoNhom.entries()]
    .map(([id, v]) => {
      const c = catMap.get(id);
      const ns = c?.monthlyBudget ? D(c.monthlyBudget) : null;
      return {
        nhomId: id, ten: c?.name ?? '(nhóm đã xoá)', icon: c?.icon ?? null, mau: c?.color ?? null,
        thangNay: round2(v.nay), thangTruoc: round2(v.truoc), cungKyThangTruoc: round2(v.truocCungKy),
        chenh: round2(v.nay.minus(v.truoc)), chenhCungKyPct: pct(v.nay.minus(v.truocCungKy), v.truocCungKy),
        nganSach: ns, tiLeNganSach: ns ? pct(v.nay, ns) : null,
        tiTrong: pct(v.nay, thangNay.chi),
      };
    })
    .filter((x) => x.thangNay.greaterThan(0) || x.thangTruoc.greaterThan(0))
    .sort((a, b) => b.thangNay.comparedTo(a.thangNay));
  const duBaoChiCuoiThang = ngayTrongThang >= 3 && thangNay.chi.greaterThan(0)
    ? round2(thangNay.chi.dividedBy(ngayTrongThang).times(soNgayThang))
    : null;

  // ─── TÀI SẢN / QUỸ KHẨN CẤP ─────────────────────────────────────────
  const tienMat = round2(sum(wallets.map((w) => q(w.balance, w.currency))));
  const tietKiemGui = round2(sum(soTK.map((s) => q(s.amount, s.currency))));
  const chiThietYeu = chiBQ || traNoBQ || noThangNay.tongNghiaVu.greaterThan(0)
    ? round2((chiBQ ?? thangNay.chi).plus(noThangNay.tongNghiaVu))
    : null;
  const quyKhanCap = {
    tienMat,
    tietKiemGui,
    chiMoiThang: chiThietYeu,
    soThang: chiThietYeu && chiThietYeu.greaterThan(0) ? round2(tienMat.dividedBy(chiThietYeu)).toNumber() : null,
    soThangKeCaTietKiem: chiThietYeu && chiThietYeu.greaterThan(0) ? round2(tienMat.plus(tietKiemGui).dividedBy(chiThietYeu)).toNumber() : null,
    coSo: chiBQ ? `chi bình quân ${ba.length} tháng gần nhất + nghĩa vụ nợ tháng này` : 'chi tháng này + nghĩa vụ nợ tháng này (chưa đủ 1 tháng trọn để lấy bình quân)',
  };

  // ─── ĐẦU TƯ ──────────────────────────────────────────────────────────
  const khoanDauTu = dauTu.map((i) => {
    const von = q(i.amount, i.currency);
    const giaTri = i.type === 'ASSET' ? q(i.currentValue ?? i.amount, i.currency) : null;
    const laiLo = giaTri ? round2(giaTri.minus(von)) : null;
    return {
      id: i.id, ten: i.name, loai: i.type, trangThai: i.status, tienTe: i.currency, ngay: i.date.toISOString().slice(0, 10),
      von, giaTri, laiLo, tySuat: laiLo ? pct(laiLo, von) : null,
      daChot: i.status === 'SOLD',
      chuaCapNhatGia: i.type === 'ASSET' && i.status !== 'SOLD' && (i.currentValue == null || D(i.currentValue).equals(D(i.amount))),
    };
  });
  const dangGiu = khoanDauTu.filter((i) => i.loai === 'ASSET' && !i.daChot);
  const daBan = khoanDauTu.filter((i) => i.loai === 'ASSET' && i.daChot);
  const dauTuTong = {
    vonDangGiu: round2(sum(dangGiu.map((i) => i.von))),
    giaTriDangGiu: round2(sum(dangGiu.map((i) => i.giaTri ?? ZERO()))),
    laiLoTamTinh: round2(sum(dangGiu.map((i) => i.laiLo ?? ZERO()))),
    tySuatTamTinh: pct(sum(dangGiu.map((i) => i.laiLo ?? ZERO())), sum(dangGiu.map((i) => i.von))),
    laiLoDaChot: round2(sum(daBan.map((i) => i.laiLo ?? ZERO()))),
    dauTuBanThan: round2(sum(khoanDauTu.filter((i) => i.loai === 'SELF').map((i) => i.von))),
  };
  const soTietKiem = soTK.map((s) => ({
    id: s.id, nganHang: s.bankName, tienTe: s.currency, soTien: s.amount, laiSuatNam: s.interestRatePerYear,
    kyHanThang: s.termMonths, ngayDaoHan: s.maturityDate.toISOString().slice(0, 10),
    conNgay: soNgay(homNay, s.maturityDate.toISOString().slice(0, 10)),
    laiKhiDaoHan: savingsMaturityInterest(s.amount, s.interestRatePerYear, s.termMonths),
  }));

  // ─── THU THEO NGUỒN (3 tháng gần nhất gồm tháng này) ────────────────
  const nguonMap = new Map<string, { ten: string; loai: string; tong: Dec }>();
  for (const r of thuRows) {
    if (thangCua(r.date.toISOString()) < xuHuong[3].thang) continue;
    const key = r.source ? `s${r.source.id}` : `t${r.type}`;
    const e = nguonMap.get(key) ?? { ten: r.source?.name ?? `(${r.type})`, loai: r.source?.type ?? r.type, tong: ZERO() };
    e.tong = e.tong.plus(q(r.amount, r.currency));
    nguonMap.set(key, e);
  }
  const thuTheoNguon = [...nguonMap.values()].map((v) => ({ ...v, tong: round2(v.tong) })).sort((a, b) => b.tong.comparedTo(a.tong));

  // ─── CHỈ SỐ ──────────────────────────────────────────────────────────
  const chiSo = {
    thuBinhQuan3Thang: thuBQ,
    chiBinhQuan3Thang: chiBQ,
    traNoBinhQuan3Thang: traNoBQ,
    soThangLamBinhQuan: ba.length,
    nghiaVuNoThangNay: noThangNay.tongNghiaVu,
    // DTI: nghĩa vụ trả nợ THEO LỊCH tháng này / thu nhập bình quân.
    tyLeNoTrenThu: thuBQ && thuBQ.greaterThan(0) ? pct(noThangNay.tongNghiaVu, thuBQ) : null,
    tyLeTietKiemThangTruoc: pct(thangTruoc.rong, thangTruoc.thu),
    tyLeChiTrenThuThangNay: pct(thangNay.chi, thangNay.thu),
  };

  // ─── CẢNH BÁO ────────────────────────────────────────────────────────
  const canhBao: CanhBao[] = [];
  const quaHanTheoKhoan = new Map<number, typeof quaHan>();
  for (const x of quaHan) { const a = quaHanTheoKhoan.get(x.debtId) ?? []; a.push(x); quaHanTheoKhoan.set(x.debtId, a); }
  for (const [debtId, ds] of quaHanTheoKhoan) {
    const tong = sum(ds.map((x) => x.soTien));
    canhBao.push({
      muc: 'nguy', ma: 'qua_han',
      tieuDe: `${ds[0].ten}: quá hạn ${ds[0].soNgayQuaHan} ngày`,
      chiTiet: `${ds.length} kỳ chưa trả, tổng ${ds[0].tienTe === 'USD' ? usd(tong) : vnd(tong)} (kỳ cũ nhất đến hạn ${ds[ds.length - 1].ngay.split('-').reverse().join('/')}).`,
      lienKet: `/finance/debts/${debtId}`,
    });
  }
  for (const x of sapDenHan.filter((s) => s.conNgay <= 3)) {
    canhBao.push({
      muc: x.conNgay === 0 ? 'nguy' : 'canh', ma: 'sap_han',
      tieuDe: x.conNgay === 0 ? `Hôm nay đến hạn: ${x.ten}` : `Còn ${x.conNgay} ngày đến hạn: ${x.ten}`,
      chiTiet: `Kỳ ${x.ky} · ${x.tienTe === 'USD' ? usd(x.soTien) : vnd(x.soTien)}`,
      lienKet: `/finance/debts/${x.debtId}`,
    });
  }
  for (const n of nhomChi) {
    if (n.tiLeNganSach != null && n.tiLeNganSach > 100) canhBao.push({ muc: 'canh', ma: 'vuot_ngan_sach', tieuDe: `Vượt ngân sách "${n.ten}"`, chiTiet: `Đã chi ${vnd(n.thangNay)} / ${vnd(n.nganSach!)} (${soVN(n.tiLeNganSach)}%).`, lienKet: '/finance/expenses' });
    else if (n.tiLeNganSach != null && n.tiLeNganSach >= 90) canhBao.push({ muc: 'tin', ma: 'gan_ngan_sach', tieuDe: `Sắp chạm ngân sách "${n.ten}"`, chiTiet: `${soVN(n.tiLeNganSach)}% ngân sách tháng.`, lienKet: '/finance/expenses' });
  }
  if (chiCungKyTruoc.greaterThan(0)) {
    const t = pct(thangNay.chi.minus(chiCungKyTruoc), chiCungKyTruoc);
    if (t != null && t >= 20) canhBao.push({ muc: 'canh', ma: 'chi_tang', tieuDe: `Chi tiêu tăng ${soVN(t)}% so với cùng kỳ tháng trước`, chiTiet: `Từ đầu tháng tới ngày ${ngayTrongThang}: ${vnd(thangNay.chi)} (tháng trước cùng kỳ ${vnd(chiCungKyTruoc)}).` });
  }
  if (duBaoChiCuoiThang && thuBQ && duBaoChiCuoiThang.plus(noThangNay.tongNghiaVu).greaterThan(thuBQ)) {
    canhBao.push({ muc: 'canh', ma: 'du_bao_am', tieuDe: 'Theo nhịp chi hiện tại, tháng này chi + trả nợ vượt thu nhập bình quân', chiTiet: `Dự báo chi cả tháng ${vnd(duBaoChiCuoiThang)} + nợ ${vnd(noThangNay.tongNghiaVu)} > thu bình quân ${vnd(thuBQ)}.` });
  }
  if (thangTruoc.coDuLieu && thangTruoc.rong.isNegative()) {
    canhBao.push({ muc: 'canh', ma: 'dong_tien_am', tieuDe: `Tháng ${thangTruoc.thang.slice(5)}/${thangTruoc.thang.slice(0, 4)} dòng tiền ÂM ${vnd(thangTruoc.rong.negated())}`, chiTiet: `Thu ${vnd(thangTruoc.thu)} − chi ${vnd(thangTruoc.chi)} − trả nợ ${vnd(thangTruoc.traNo)}.` });
  }
  if (chiSo.tyLeNoTrenThu != null) {
    if (chiSo.tyLeNoTrenThu > 50) canhBao.push({ muc: 'nguy', ma: 'dti', tieuDe: `Trả nợ chiếm ${soVN(chiSo.tyLeNoTrenThu)}% thu nhập`, chiTiet: 'Trên 50% là vùng nguy hiểm — một tháng thu nhập giảm là trễ hạn.' });
    else if (chiSo.tyLeNoTrenThu > 35) canhBao.push({ muc: 'canh', ma: 'dti', tieuDe: `Trả nợ chiếm ${soVN(chiSo.tyLeNoTrenThu)}% thu nhập`, chiTiet: 'Ngân hàng thường coi trên 35–40% là cao.' });
  }
  if (quyKhanCap.soThang != null) {
    if (quyKhanCap.soThang < 1) canhBao.push({ muc: 'nguy', ma: 'quy_khan_cap', tieuDe: `Tiền trong ví chỉ đủ ${soVN(quyKhanCap.soThang)} tháng chi tiêu + trả nợ` });
    else if (quyKhanCap.soThang < 3) canhBao.push({ muc: 'canh', ma: 'quy_khan_cap', tieuDe: `Quỹ dự phòng đủ ${soVN(quyKhanCap.soThang)} tháng (nên có 3–6 tháng)`, chiTiet: `Tiền trong các ví ${vnd(quyKhanCap.tienMat)} / chi + trả nợ mỗi tháng ${vnd(quyKhanCap.chiMoiThang!)}.` });
  }
  for (const k of dangNo) {
    if (k.pt.chenhLechThucTra.greaterThan(0)) {
      canhBao.push({ muc: 'tin', ma: 'tra_du', tieuDe: `${k.pt.ten}: đã trả nhiều hơn lịch ${k.pt.tienTe === 'USD' ? usd(k.pt.chenhLechThucTra) : vnd(k.pt.chenhLechThucTra)}`, chiTiet: 'Có thể là phí phạt/phí dịch vụ — đối chiếu với hợp đồng.', lienKet: `/finance/debts/${k.pt.id}` });
    }
  }
  const thieuDuLieu = [...dangNo.flatMap((k) => k.pt.thieuDuLieu)];
  const khoanChuaKhaiPhi = dangNo.filter((k) => k.vao.prepayFeePct == null && k.pt.soKyConLai > 0).map((k) => k.pt.ten);
  if (coUsdChuaQuyDoi()) {
    canhBao.push({ muc: 'canh', ma: 'usd', tieuDe: 'Có khoản bằng $ nhưng chưa đặt tỷ giá', chiTiet: 'Các tổng bên dưới CHƯA gồm phần tiền $.', lienKet: '/finance/currency' });
  }
  const thuTu: Record<MucCanhBao, number> = { nguy: 0, canh: 1, tin: 2 };
  canhBao.sort((a, b) => thuTu[a.muc] - thuTu[b.muc]);

  return {
    homNay,
    thang,
    tyGia: fxRow ? { vndPerUsd: fxRow.vndPerUsd, capNhat: fxRow.createdAt } : null,
    coUsdChuaQuyDoi: coUsdChuaQuyDoi(),
    no: {
      tong: tongNo,
      thangNay: noThangNay,
      lichTheoThang,
      quaHan,
      sapDenHan,
      tatToanHomNay,
      cacKhoan: cacKhoan.map((k) => ({ ...k.pt, lich: undefined })),
      moPhongDuoc: moPhong.length,
      loaiKhoiMoPhong,
      khoanChuaKhaiPhi,
    },
    dongTien: { thangNay, thangTruoc, xuHuong },
    chiTieu: {
      thangNay: thangNay.chi,
      thangTruoc: thangTruoc.chi,
      cungKyThangTruoc: round2(chiCungKyTruoc),
      soVoiCungKyPct: pct(thangNay.chi.minus(chiCungKyTruoc), chiCungKyTruoc),
      ngayTrongThang,
      soNgayThang,
      duBaoCuoiThang: duBaoChiCuoiThang,
      nhom: nhomChi,
      mucTieu: mucTieu.map((m) => ({ ky: m.period, soTien: m.amount })),
    },
    chiSo,
    quyKhanCap,
    dauTu: { tong: dauTuTong, cacKhoan: khoanDauTu },
    soTietKiem,
    thuTheoNguon,
    canhBao,
    thieuDuLieu,
    /** Dùng nội bộ (chiến lược, AI) — không gửi ra ngoài. */
    _moPhong: moPhong,
  };
}

export type GoiPhanTich = Awaited<ReturnType<typeof phanTichTaiChinh>>;

/** Bản gửi ra client: bỏ phần nội bộ. */
export async function layPhanTich(userId: number) {
  const { _moPhong, ...goi } = await phanTichTaiChinh(userId);
  void _moPhong;
  return goi;
}

/** Chiến lược trả nợ + xếp hạng trả một lần, cho màn Nợ. */
export async function chienLuocTraNo(userId: number, traThemMoiThang: number, traMotLan: number) {
  const g = await phanTichTaiChinh(userId);
  const them = Number.isFinite(traThemMoiThang) && traThemMoiThang > 0 ? traThemMoiThang : 0;
  const motLan = Number.isFinite(traMotLan) && traMotLan > 0 ? traMotLan : 0;
  return {
    thang: g.thang,
    soSanh: soSanhChienLuoc(g._moPhong, g.thang, them),
    traMotLan: motLan > 0 ? { soTien: round2(motLan), xepHang: xepHangTraMotLan(g._moPhong, g.thang, motLan) } : null,
    loaiKhoiMoPhong: g.no.loaiKhoiMoPhong,
    khoanChuaKhaiPhi: g.no.khoanChuaKhaiPhi,
    thieuDuLieu: g.thieuDuLieu,
  };
}
