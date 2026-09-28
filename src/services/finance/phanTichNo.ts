/**
 * PHÂN TÍCH NỢ — bộ tính THUẦN (không DB, không mạng), 28/09/2026.
 * ─────────────────────────────────────────────────────────────────────
 * Người dùng đã nhập đủ và đúng: gốc, kiểu lãi, lãi suất, kỳ hạn, các kỳ đã
 * tích trả. Mọi con số họ cần nhìn đều suy ra được TỪ LỊCH TRẢ đã lưu —
 * đây là chỗ duy nhất làm phép suy ra đó:
 *
 *   · `phanTichKhoan()`   — gốc còn lại, lãi đã trả / còn phải trả, kỳ tới,
 *                           kỳ quá hạn (đếm ngày theo lịch VN), ngày tất toán
 *                           dự kiến, lịch từng kỳ kèm DƯ NỢ sau kỳ, lãi suất
 *                           THỰC (IRR) để so khoản lãi phẳng với lãi giảm dần.
 *   · `moPhongTatToan()`  — tất toán sớm vào ngày X thì phải chi bao nhiêu và
 *                           tiết kiệm bao nhiêu so với cứ trả theo lịch.
 *   · `moPhongTraNo()`    — trả thêm mỗi tháng / trả thêm một lần, theo thứ
 *                           tự Avalanche (lãi thực cao trước) hoặc Snowball
 *                           (dư nợ nhỏ trước). Mô phỏng THEO TỪNG KIỂU LÃI.
 *
 * ⚠️ Vì sao KHÔNG tính lại lãi từ công thức mà đọc `interestPart` của lịch:
 * lịch là thứ đã lưu và người dùng đã đối chiếu với hợp đồng. Tính lại từ
 * công thức mà lệch một đồng so với lịch (làm tròn khác, ngày khác) là hai
 * con số cho cùng một kỳ — người dùng không biết tin cái nào.
 *
 * Khi trả thêm gốc làm dư nợ thấp hơn lịch, lãi của kỳ được CO THEO TỈ LỆ
 * dư nợ (lãi = dư nợ × lãi suất × độ dài kỳ ⇒ tỉ lệ thuận với dư nợ) — đúng
 * cho dư nợ giảm dần, gốc đều, chỉ trả lãi và lãi ngày. Riêng LÃI PHẲNG thì
 * lãi tính trên gốc BAN ĐẦU nên không đổi chừng nào khoản còn mở — trả thêm
 * chỉ có lợi ở chỗ đóng khoản sớm hơn.
 *
 * Tiền: Prisma.Decimal suốt, làm tròn 2 số lẻ HALF_UP ở từng bước (giống
 * `money.ts`). Ngày: chuỗi `YYYY-MM-DD` theo lịch VN — cột `@db.Date` lưu
 * nửa đêm UTC của đúng ngày lịch đó nên `toISOString().slice(0,10)` là ngày.
 */
import { Prisma } from '@prisma/client';
import { D, round2, sum, clampZero, type Dec, type DecInput } from './money.js';
import { monthlyRateFraction, dailyRateFraction } from './debtCalculator.js';

const ZERO = () => new Prisma.Decimal(0);

// ─── Kiểu dữ liệu vào ────────────────────────────────────────────────────

export interface KyVao {
  id?: number;
  installmentNo: number;
  dueDate: Date | string;
  amountDue: DecInput;
  principalPart: DecInput;
  interestPart: DecInput;
  isPaid: boolean;
}

export interface NoVao {
  id: number;
  lenderName: string;
  lenderType?: string;
  principal: DecInput;
  currency?: string | null;
  interestType: string;
  interestRate: DecInput;
  rateUnit?: string | null;
  startDate: Date | string;
  termMonths?: number | null;
  paymentDay?: number | null;
  status: string;
  prepayFeePct?: DecInput | null;
  schedule: KyVao[];
  payments?: Array<{ amount: DecInput; date: Date | string }>;
}

// ─── Ngày theo lịch (chuỗi YYYY-MM-DD) ──────────────────────────────────

export function ngayCua(d: Date | string): string {
  if (typeof d === 'string') return d.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

/** Số ngày từ `a` tới `b` (b − a), cả hai là ngày lịch. */
export function soNgay(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

export function thangCua(ngay: string): string {
  return ngay.slice(0, 7);
}

/** Số tháng từ tháng `a` tới tháng `b` (YYYY-MM). */
export function soThang(a: string, b: string): number {
  const [ya, ma] = a.split('-').map(Number);
  const [yb, mb] = b.split('-').map(Number);
  return (yb - ya) * 12 + (mb - ma);
}

export function congThang(thang: string, them: number): string {
  const [y, m] = thang.split('-').map(Number);
  const t = y * 12 + (m - 1) + them;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
}

// ─── Lãi suất ────────────────────────────────────────────────────────────

/**
 * Lãi suất danh nghĩa quy về %/tháng và %/năm, như người dùng đã khai.
 * DAILY_PERCENT quy tháng = %/ngày × 30 (quy ước ngành, chỉ để so sánh).
 */
export function laiSuatDanhNghia(no: Pick<NoVao, 'interestType' | 'interestRate' | 'rateUnit'>): { thang: Dec; nam: Dec } {
  if (no.interestType === 'NO_INTEREST') return { thang: ZERO(), nam: ZERO() };
  if (no.interestType === 'DAILY_PERCENT') {
    const ngay = dailyRateFraction(no.interestRate, no.rateUnit).times(100);
    return { thang: ngay.times(30), nam: ngay.times(365) };
  }
  const thang = monthlyRateFraction(no.interestRate, no.rateUnit).times(100);
  return { thang, nam: thang.times(12) };
}

/**
 * Lãi suất THỰC theo tháng (%) — nghiệm IRR của dòng tiền: nhận `goc` ở
 * tháng 0, trả `tong[i]` ở tháng i+1. Đây là con số để so "lãi phẳng 3%/tháng"
 * với "giảm dần 3%/tháng": lãi phẳng tính trên gốc BAN ĐẦU nên thực chất đắt
 * gần gấp đôi. Chia đôi 80 lần — sai số < 1e-20, dư sức cho 2 số lẻ.
 */
export function laiSuatThucThang(goc: DecInput, tong: DecInput[]): Dec | null {
  const P = D(goc);
  if (P.lessThanOrEqualTo(0) || tong.length === 0) return null;
  const A = tong.map(D);
  const tongTra = sum(A);
  if (tongTra.lessThanOrEqualTo(P)) return ZERO(); // không lãi
  const npv = (r: Dec) => {
    const chiet = new Prisma.Decimal(1).dividedBy(r.plus(1));
    let df = new Prisma.Decimal(1);
    let s = P.negated();
    for (const a of A) { df = df.times(chiet); s = s.plus(a.times(df)); }
    return s;
  };
  let lo = ZERO();
  let hi = new Prisma.Decimal(1); // 100%/tháng
  if (npv(hi).greaterThan(0)) return null; // lãi > 100%/tháng — dữ liệu lạ
  for (let i = 0; i < 80; i++) {
    const mid = lo.plus(hi).dividedBy(2);
    if (npv(mid).greaterThan(0)) lo = mid; else hi = mid;
  }
  return lo.plus(hi).dividedBy(2).times(100);
}

// ─── 1. Phân tích một khoản ─────────────────────────────────────────────

export type TrangThaiKy = 'DA_TRA' | 'QUA_HAN' | 'HOM_NAY' | 'CHUA_DEN';

export interface DongLich {
  id?: number;
  ky: number;
  ngay: string;
  goc: Dec;
  lai: Dec;
  tong: Dec;
  /** Dư nợ gốc NGAY TRƯỚC kỳ này (theo lịch). */
  duNoTruoc: Dec;
  /** Dư nợ gốc SAU khi trả kỳ này (theo lịch). */
  duNoSau: Dec;
  trangThai: TrangThaiKy;
  /** >0: đã quá hạn bấy nhiêu ngày; 0: hôm nay; <0: còn bấy nhiêu ngày. */
  soNgayQuaHan: number;
}

export interface PhanTichKhoan {
  id: number;
  ten: string;
  loaiChoVay?: string;
  kieuLai: string;
  tienTe: string;
  trangThai: string;
  daTatToan: boolean;
  gocBanDau: Dec;
  gocDaTra: Dec;
  gocConLai: Dec;
  laiDaTra: Dec;
  laiConPhaiTra: Dec;
  tongConPhaiTra: Dec;
  tongLaiCaKhoan: Dec;
  tongPhaiTraCaKhoan: Dec;
  /** Tổng tiền THỰC đã trả (bảng thanh toán) — có thể khác lịch nếu trả dư/thiếu. */
  daTraThucTe: Dec;
  /** daTraThucTe − tổng `amountDue` các kỳ đã tích. >0: trả dư (phạt/phí?). */
  chenhLechThucTra: Dec;
  soKy: number;
  soKyDaTra: number;
  soKyConLai: number;
  kyToi: DongLich | null;
  ngayTatToanDuKien: string | null;
  quaHan: { soKy: number; soTien: Dec; goc: Dec; lai: Dec; lauNhatNgay: number; cacKy: DongLich[] };
  sapDenHan: DongLich[]; // 0..7 ngày tới
  laiSuat: { danhNghiaThang: Dec; danhNghiaNam: Dec; thucThang: Dec | null; thucNam: Dec | null; donVi: string };
  /** Lãi ngày (chỉ DAILY_PERCENT), tính trên gốc còn lại. */
  laiMoiNgay: Dec | null;
  /** Khoản lãi ngày KHÔNG kỳ hạn: lãi dồn từ ngày vay tới hôm nay trên gốc. */
  laiDonTuNgayVay: Dec | null;
  phiTraTruocPct: Dec | null;
  lich: DongLich[];
  thieuDuLieu: string[];
}

export function phanTichKhoan(no: NoVao, homNay: string): PhanTichKhoan {
  const goc = round2(no.principal);
  const ds = [...no.schedule].sort((a, b) => a.installmentNo - b.installmentNo);
  const thieu: string[] = [];

  let gocLuyKe = ZERO();
  const lich: DongLich[] = ds.map((k) => {
    const p = round2(k.principalPart);
    const duNoTruoc = clampZero(goc.minus(gocLuyKe));
    gocLuyKe = gocLuyKe.plus(p);
    const ngay = ngayCua(k.dueDate);
    const tre = soNgay(ngay, homNay);
    const trangThai: TrangThaiKy = k.isPaid ? 'DA_TRA' : tre > 0 ? 'QUA_HAN' : tre === 0 ? 'HOM_NAY' : 'CHUA_DEN';
    return {
      id: k.id,
      ky: k.installmentNo,
      ngay,
      goc: p,
      lai: round2(k.interestPart),
      tong: round2(k.amountDue),
      duNoTruoc,
      duNoSau: clampZero(goc.minus(gocLuyKe)),
      trangThai,
      soNgayQuaHan: tre,
    };
  });

  const daTra = lich.filter((k) => k.trangThai === 'DA_TRA');
  const chuaTra = lich.filter((k) => k.trangThai !== 'DA_TRA');
  const daTatToan = no.status === 'PAID_OFF';

  const gocDaTra = round2(sum(daTra.map((k) => k.goc)));
  const laiDaTra = round2(sum(daTra.map((k) => k.lai)));
  const daTraThucTe = round2(sum((no.payments ?? []).map((p) => p.amount)));
  const tongLaiCaKhoan = round2(sum(lich.map((k) => k.lai)));

  let gocConLai = clampZero(round2(goc.minus(gocDaTra)));
  let laiConPhaiTra = round2(sum(chuaTra.map((k) => k.lai)));
  let tongConPhaiTra = round2(sum(chuaTra.map((k) => k.tong)));

  const quaHanKy = chuaTra.filter((k) => k.trangThai === 'QUA_HAN');
  const dn = laiSuatDanhNghia(no);

  let laiMoiNgay: Dec | null = null;
  let laiDonTuNgayVay: Dec | null = null;
  if (no.interestType === 'DAILY_PERCENT') {
    const dr = dailyRateFraction(no.interestRate, no.rateUnit);
    laiMoiNgay = round2(gocConLai.times(dr));
    if (lich.length === 0) {
      const ngayVay = ngayCua(no.startDate);
      laiDonTuNgayVay = round2(gocConLai.times(dr).times(Math.max(0, soNgay(ngayVay, homNay))));
      thieu.push(`Khoản "${no.lenderName}" tính lãi theo ngày và CHƯA có kỳ hạn — không có lịch trả nên không tính được tổng lãi còn phải trả, ngày tất toán hay chiến lược trả. Khai số tháng kỳ hạn để có đủ số liệu.`);
    }
  }
  if (lich.length === 0 && no.interestType !== 'DAILY_PERCENT' && !daTatToan) {
    thieu.push(`Khoản "${no.lenderName}" chưa có lịch trả (thiếu kỳ hạn).`);
  }

  // Khoản người dùng đánh dấu tay là đã tất toán: coi như không còn nợ, dù
  // lịch còn kỳ chưa tích (họ tất toán ngoài app).
  if (daTatToan) {
    gocConLai = ZERO();
    laiConPhaiTra = ZERO();
    tongConPhaiTra = ZERO();
  }

  const irr = lich.length > 0 ? laiSuatThucThang(goc, lich.map((k) => k.tong)) : null;

  const chenhLechThucTra = round2(daTraThucTe.minus(sum(daTra.map((k) => k.tong))));

  return {
    id: no.id,
    ten: no.lenderName,
    loaiChoVay: no.lenderType,
    kieuLai: no.interestType,
    tienTe: no.currency || 'VND',
    trangThai: no.status,
    daTatToan,
    gocBanDau: goc,
    gocDaTra,
    gocConLai,
    laiDaTra,
    laiConPhaiTra,
    tongConPhaiTra,
    tongLaiCaKhoan,
    tongPhaiTraCaKhoan: round2(goc.plus(tongLaiCaKhoan)),
    daTraThucTe,
    chenhLechThucTra,
    soKy: lich.length,
    soKyDaTra: daTra.length,
    soKyConLai: daTatToan ? 0 : chuaTra.length,
    kyToi: daTatToan ? null : chuaTra[0] ?? null,
    ngayTatToanDuKien: daTatToan ? null : chuaTra.length ? chuaTra[chuaTra.length - 1].ngay : null,
    quaHan: {
      soKy: daTatToan ? 0 : quaHanKy.length,
      soTien: daTatToan ? ZERO() : round2(sum(quaHanKy.map((k) => k.tong))),
      goc: daTatToan ? ZERO() : round2(sum(quaHanKy.map((k) => k.goc))),
      lai: daTatToan ? ZERO() : round2(sum(quaHanKy.map((k) => k.lai))),
      lauNhatNgay: daTatToan ? 0 : quaHanKy.reduce((m, k) => Math.max(m, k.soNgayQuaHan), 0),
      cacKy: daTatToan ? [] : quaHanKy,
    },
    sapDenHan: daTatToan ? [] : chuaTra.filter((k) => k.soNgayQuaHan <= 0 && k.soNgayQuaHan >= -7),
    laiSuat: {
      danhNghiaThang: dn.thang.toDecimalPlaces(4),
      danhNghiaNam: dn.nam.toDecimalPlaces(4),
      thucThang: irr ? irr.toDecimalPlaces(4) : irr,
      thucNam: irr ? irr.times(12).toDecimalPlaces(4) : irr,
      donVi: no.rateUnit ?? (no.interestType === 'DAILY_PERCENT' ? 'DAY' : 'MONTH'),
    },
    laiMoiNgay,
    laiDonTuNgayVay,
    phiTraTruocPct: no.prepayFeePct == null ? null : D(no.prepayFeePct),
    lich,
    thieuDuLieu: thieu,
  };
}

// ─── 2. Tất toán sớm ─────────────────────────────────────────────────────

export interface KetQuaTatToan {
  ngay: string;
  /** Các kỳ đã tới hạn (≤ ngày tất toán) chưa trả — trả kiểu gì cũng phải trả. */
  kyDenHanPhaiTra: { soKy: number; soTien: Dec };
  gocTatToan: Dec;
  /** Lãi của kỳ đang chạy, tính theo số ngày đã qua trong kỳ. */
  laiDonKyDangChay: Dec;
  soNgayDaQuaTrongKy: number;
  soNgayCuaKy: number;
  phiTraTruoc: Dec;
  chuaKhaiPhi: boolean;
  /** Tiền cần chi để đóng khoản (không gồm các kỳ đã tới hạn). */
  chiPhiTatToan: Dec;
  /** Tổng tiền phải chi trong ngày đó = kỳ tới hạn + chi phí tất toán. */
  tongCanChi: Dec;
  /** Nếu cứ trả theo lịch các kỳ còn lại (sau ngày tất toán). */
  neuTraTheoLich: Dec;
  laiTranhDuoc: Dec;
  tietKiem: Dec;
  soKyBoQua: number;
  giaDinh: string[];
}

export function moPhongTatToan(no: NoVao, pt: PhanTichKhoan, ngay: string): KetQuaTatToan | null {
  if (pt.daTatToan || pt.lich.length === 0) return null;
  const chuaTra = pt.lich.filter((k) => k.trangThai !== 'DA_TRA');
  const denHan = chuaTra.filter((k) => k.ngay <= ngay);
  const sau = chuaTra.filter((k) => k.ngay > ngay);
  const giaDinh: string[] = [];

  const phiPct = no.prepayFeePct == null ? null : D(no.prepayFeePct);
  const chuaKhaiPhi = phiPct === null;
  if (chuaKhaiPhi) giaDinh.push('Chưa khai phí trả trước hạn — đang tính phí = 0. Nếu hợp đồng có phí, số tiết kiệm thật sẽ thấp hơn.');

  const kyDenHanPhaiTra = { soKy: denHan.length, soTien: round2(sum(denHan.map((k) => k.tong))) };

  if (sau.length === 0) {
    return {
      ngay, kyDenHanPhaiTra,
      gocTatToan: ZERO(), laiDonKyDangChay: ZERO(), soNgayDaQuaTrongKy: 0, soNgayCuaKy: 0,
      phiTraTruoc: ZERO(), chuaKhaiPhi,
      chiPhiTatToan: ZERO(), tongCanChi: kyDenHanPhaiTra.soTien,
      neuTraTheoLich: ZERO(), laiTranhDuoc: ZERO(), tietKiem: ZERO(), soKyBoQua: 0,
      giaDinh: [...giaDinh, 'Mọi kỳ còn lại đều đã tới hạn trước ngày này — không còn gì để tất toán sớm.'],
    };
  }

  const gocTatToan = round2(sum(sau.map((k) => k.goc)));
  const kyDangChay = sau[0];
  const viTri = pt.lich.findIndex((k) => k.ky === kyDangChay.ky);
  const dauKy = viTri > 0 ? pt.lich[viTri - 1].ngay : ngayCua(no.startDate);
  const soNgayCuaKy = Math.max(1, soNgay(dauKy, kyDangChay.ngay));
  const soNgayDaQua = Math.min(soNgayCuaKy, Math.max(0, soNgay(dauKy, ngay)));
  const laiDon = round2(kyDangChay.lai.times(soNgayDaQua).dividedBy(soNgayCuaKy));
  if (soNgayDaQua > 0) {
    giaDinh.push(`Lãi kỳ đang chạy tính theo ngày: ${soNgayDaQua}/${soNgayCuaKy} ngày của kỳ ${kyDangChay.ky}.`);
  }
  if (no.interestType === 'FLAT_MONTHLY') {
    giaDinh.push('Lãi phẳng: giả định bên cho vay KHÔNG thu lãi của các kỳ chưa tới (chỉ thu gốc còn lại + lãi đã phát sinh + phí). Một số công ty tài chính thu thêm — xem hợp đồng.');
  }
  const phi = phiPct ? round2(gocTatToan.times(phiPct).dividedBy(100)) : ZERO();
  const chiPhi = round2(gocTatToan.plus(laiDon).plus(phi));
  const neuTraTheoLich = round2(sum(sau.map((k) => k.tong)));
  const laiSau = round2(sum(sau.map((k) => k.lai)));
  return {
    ngay,
    kyDenHanPhaiTra,
    gocTatToan,
    laiDonKyDangChay: laiDon,
    soNgayDaQuaTrongKy: soNgayDaQua,
    soNgayCuaKy,
    phiTraTruoc: phi,
    chuaKhaiPhi,
    chiPhiTatToan: chiPhi,
    tongCanChi: round2(kyDenHanPhaiTra.soTien.plus(chiPhi)),
    neuTraTheoLich,
    laiTranhDuoc: round2(laiSau.minus(laiDon)),
    tietKiem: round2(neuTraTheoLich.minus(chiPhi)),
    soKyBoQua: sau.length,
    giaDinh,
  };
}

// ─── 3. Mô phỏng trả nợ (Avalanche / Snowball / trả thêm một lần) ─────────

export type ChienLuoc = 'AVALANCHE' | 'SNOWBALL' | 'TOI_UU' | 'THEO_LICH' | 'CHI_DINH';

/** Một khoản đã QUY RA VND, sẵn sàng mô phỏng. */
export interface NoMoPhong {
  id: number;
  ten: string;
  kieuLai: string;
  /** Gốc còn lại (VND). */
  gocConLai: Dec;
  /** %/tháng thực (IRR) — thứ tự Avalanche. */
  laiThucThang: Dec;
  phiTraTruocPct: Dec;
  /** Các kỳ CHƯA TRẢ (VND), theo thứ tự, kèm tháng rơi vào. */
  ky: Array<{ thang: string; goc: Dec; lai: Dec; tong: Dec; duNoTruoc: Dec }>;
}

export interface KetQuaMoPhong {
  chienLuoc: ChienLuoc;
  thuTu: Array<{ id: number; ten: string }>;
  soThang: number;
  thangHetNo: string | null;
  tongLai: Dec;
  tongPhi: Dec;
  tongTra: Dec;
  tungKhoan: Array<{ id: number; ten: string; thangTatToan: string | null; lai: Dec; phi: Dec }>;
  /** 24 tháng đầu: tiền chi mỗi tháng và tổng dư nợ cuối tháng. */
  theoThang: Array<{ thang: string; tra: Dec; lai: Dec; duNo: Dec }>;
}

const THANG_TOI_DA = 600;

function thuTuTheo(chienLuoc: ChienLuoc, ds: NoMoPhong[], chiDinh?: number[]): NoMoPhong[] {
  const c = [...ds];
  if (chienLuoc === 'AVALANCHE') {
    c.sort((a, b) => b.laiThucThang.comparedTo(a.laiThucThang) || a.gocConLai.comparedTo(b.gocConLai));
  } else if (chienLuoc === 'SNOWBALL') {
    c.sort((a, b) => a.gocConLai.comparedTo(b.gocConLai) || b.laiThucThang.comparedTo(a.laiThucThang));
  } else if ((chienLuoc === 'CHI_DINH' || chienLuoc === 'TOI_UU') && chiDinh) {
    return chiDinh.map((id) => c.find((d) => d.id === id)).filter((d): d is NoMoPhong => !!d);
  } else {
    return [];
  }
  return c;
}

/**
 * Mô phỏng theo tháng lịch, bắt đầu từ `thangDau` (tháng hiện tại; kỳ quá
 * hạn dồn vào tháng này).
 *
 * Mỗi tháng: (1) mỗi khoản trả đúng phần bắt buộc của kỳ rơi vào tháng đó —
 * lãi co theo dư nợ thật, gốc theo lịch (trả góp đều thì giữ nguyên số tiền
 * kỳ, rút ngắn kỳ hạn); (2) NGÂN SÁCH tháng = tổng tiền kỳ THEO LỊCH của tháng
 * + trả thêm; phần ngân sách còn lại (gồm tiền "rảnh ra" từ khoản đã đóng
 * sớm) dồn vào khoản ưu tiên, trừ phí trả trước nếu có.
 *
 * Trả thêm 0 và không trả một lần ⇒ khớp ĐÚNG lịch đã lưu (kiểm thử giữ).
 */
export function moPhongTraNo(
  dsNo: NoMoPhong[],
  opts: { chienLuoc: ChienLuoc; traThemMoiThang?: DecInput; traMotLan?: DecInput; thangDau: string; chiDinh?: number[] },
): KetQuaMoPhong {
  const them = round2(opts.traThemMoiThang ?? 0);
  let motLan = round2(opts.traMotLan ?? 0);
  const coUuTien = opts.chienLuoc !== 'THEO_LICH';
  const thuTu = thuTuTheo(opts.chienLuoc, dsNo, opts.chiDinh);

  const st = dsNo.map((d) => ({
    d,
    du: round2(d.gocConLai),
    tro: 0, // chỉ số kỳ kế tiếp trong d.ky
    lai: ZERO(),
    phi: ZERO(),
    thangTatToan: null as string | null,
  }));

  let tongLai = ZERO();
  let tongPhi = ZERO();
  let tongTra = ZERO();
  let thangCuoiCoTra: string | null = null;
  const theoThang: KetQuaMoPhong['theoThang'] = [];

  const conNo = () => st.some((s) => s.du.greaterThan(0));
  for (let i = 0; i < THANG_TOI_DA && conNo(); i++) {
    const thang = congThang(opts.thangDau, i);
    let traThang = ZERO();
    let laiThang = ZERO();
    let nganSach = them;
    if (i === 0) nganSach = nganSach.plus(motLan);

    // (1) phần bắt buộc
    for (const s of st) {
      while (s.tro < s.d.ky.length && (s.d.ky[s.tro].thang <= thang)) {
        const k = s.d.ky[s.tro];
        s.tro++;
        nganSach = nganSach.plus(k.tong); // ngân sách theo lịch — dù khoản đã đóng
        if (s.du.lessThanOrEqualTo(0)) continue;
        let lai: Dec;
        if (s.d.kieuLai === 'FLAT_MONTHLY') lai = k.lai;
        else if (k.duNoTruoc.greaterThan(0)) lai = round2(k.lai.times(s.du).dividedBy(k.duNoTruoc));
        else lai = ZERO();
        let goc: Dec;
        const kyCuoi = s.tro === s.d.ky.length;
        if (kyCuoi) goc = s.du;
        else if (s.d.kieuLai === 'REDUCING_BALANCE') goc = Prisma.Decimal.min(s.du, Prisma.Decimal.max(ZERO(), k.tong.minus(lai)));
        else goc = Prisma.Decimal.min(s.du, k.goc);
        goc = round2(goc);
        s.du = round2(s.du.minus(goc));
        s.lai = s.lai.plus(lai);
        tongLai = tongLai.plus(lai);
        laiThang = laiThang.plus(lai);
        const tra = lai.plus(goc);
        traThang = traThang.plus(tra);
        nganSach = nganSach.minus(tra);
        if (s.du.lessThanOrEqualTo(0) && !s.thangTatToan) s.thangTatToan = thang;
      }
    }

    // (2) dồn phần dư vào khoản ưu tiên
    if (coUuTien && nganSach.greaterThan(0)) {
      for (const d of thuTu) {
        if (nganSach.lessThanOrEqualTo(0)) break;
        const s = st.find((x) => x.d.id === d.id)!;
        if (s.du.lessThanOrEqualTo(0)) continue;
        const f = d.phiTraTruocPct.dividedBy(100);
        const canDe = round2(s.du.times(f.plus(1)));
        const tra = Prisma.Decimal.min(nganSach, canDe);
        const goc = tra.equals(canDe) ? s.du : round2(tra.dividedBy(f.plus(1)));
        const phi = round2(tra.minus(goc));
        s.du = round2(s.du.minus(goc));
        s.phi = s.phi.plus(phi);
        tongPhi = tongPhi.plus(phi);
        traThang = traThang.plus(tra);
        nganSach = nganSach.minus(tra);
        if (s.du.lessThanOrEqualTo(0) && !s.thangTatToan) s.thangTatToan = thang;
      }
    }
    // Tiền trả một lần chỉ dùng trong tháng đầu; phần không tiêu hết thì
    // không "cất" sang tháng sau.
    motLan = ZERO();

    tongTra = tongTra.plus(traThang);
    if (traThang.greaterThan(0)) thangCuoiCoTra = thang;
    if (i < 24) theoThang.push({ thang, tra: round2(traThang), lai: round2(laiThang), duNo: round2(sum(st.map((s) => s.du))) });
  }

  const soThangTra = thangCuoiCoTra ? soThang(opts.thangDau, thangCuoiCoTra) + 1 : 0;
  return {
    chienLuoc: opts.chienLuoc,
    thuTu: thuTu.map((d) => ({ id: d.id, ten: d.ten })),
    soThang: soThangTra,
    thangHetNo: conNo() ? null : thangCuoiCoTra,
    tongLai: round2(tongLai),
    tongPhi: round2(tongPhi),
    tongTra: round2(tongTra),
    tungKhoan: st.map((s) => ({ id: s.d.id, ten: s.d.ten, thangTatToan: s.thangTatToan, lai: round2(s.lai), phi: round2(s.phi) })),
    theoThang,
  };
}

/**
 * Chuẩn bị một khoản (đã phân tích) để mô phỏng, quy ra VND bằng `quyDoi`.
 * Trả `null` khi khoản không mô phỏng được (đã tất toán, không có lịch).
 */
export function chuanBiMoPhong(no: NoVao, pt: PhanTichKhoan, thangDau: string, quyDoi: (v: Dec) => Dec): NoMoPhong | null {
  if (pt.daTatToan || pt.lich.length === 0 || pt.gocConLai.lessThanOrEqualTo(0)) return null;
  const chuaTra = pt.lich.filter((k) => k.trangThai !== 'DA_TRA');
  if (chuaTra.length === 0) return null;
  return {
    id: pt.id,
    ten: pt.ten,
    kieuLai: pt.kieuLai,
    gocConLai: quyDoi(pt.gocConLai),
    laiThucThang: pt.laiSuat.thucThang ?? pt.laiSuat.danhNghiaThang,
    phiTraTruocPct: no.prepayFeePct == null ? ZERO() : D(no.prepayFeePct),
    ky: chuaTra.map((k) => {
      const t = thangCua(k.ngay);
      return {
        thang: t < thangDau ? thangDau : t,
        goc: quyDoi(k.goc),
        lai: quyDoi(k.lai),
        tong: quyDoi(k.tong),
        duNoTruoc: quyDoi(k.duNoTruoc),
      };
    }),
  };
}

const chiPhiCua = (k: KetQuaMoPhong) => k.tongLai.plus(k.tongPhi);

function hoanVi<T>(a: T[]): T[][] {
  if (a.length <= 1) return [a];
  return a.flatMap((x, i) => hoanVi([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r]));
}

/**
 * Thứ tự ưu tiên RẺ NHẤT theo mô phỏng thật. Vì sao cần: "lãi cao trả trước"
 * sai với LÃI PHẲNG — trả bớt gốc một khoản lãi phẳng không bớt đồng lãi nào
 * cho tới khi đóng HẲN khoản, nên đổ tiền vào nó dở dang là phí. Đo thật:
 * thẻ 2,5% giảm dần + Momo lãi phẳng 3,02% (lãi thực 5,03%), trả thêm 5tr ⇒
 * Snowball rẻ hơn Avalanche 621.824 ₫. Thử mọi thứ tự khi ≤ 5 khoản; nhiều
 * hơn thì leo dốc (đổi chỗ từng cặp) từ phương án tốt nhất trong hai cách cũ.
 */
function timThuTuToiUu(dsNo: NoMoPhong[], thangDau: string, traThemMoiThang: DecInput, batDau: KetQuaMoPhong[]): KetQuaMoPhong {
  const chay = (ids: number[]) => moPhongTraNo(dsNo, { chienLuoc: 'TOI_UU', chiDinh: ids, thangDau, traThemMoiThang });
  const ids = dsNo.map((d) => d.id);
  let tot: KetQuaMoPhong | null = null;
  const xet = (k: KetQuaMoPhong) => {
    if (!tot || chiPhiCua(k).lessThan(chiPhiCua(tot)) || (chiPhiCua(k).equals(chiPhiCua(tot)) && k.soThang < tot.soThang)) tot = k;
  };
  if (ids.length <= 5) {
    for (const p of hoanVi(ids)) xet(chay(p));
    return tot!;
  }
  for (const b of batDau) xet(chay(b.thuTu.map((t) => t.id)));
  let caiThien = true;
  let vong = 0;
  while (caiThien && vong < 20) {
    caiThien = false;
    vong++;
    const hienTai: number[] = (tot as KetQuaMoPhong | null)!.thuTu.map((t) => t.id);
    for (let i = 0; i < hienTai.length && !caiThien; i++) {
      for (let j = i + 1; j < hienTai.length && !caiThien; j++) {
        const thu = [...hienTai];
        [thu[i], thu[j]] = [thu[j], thu[i]];
        const truoc: KetQuaMoPhong = tot!;
        xet(chay(thu));
        if (tot !== truoc) caiThien = true;
      }
    }
  }
  return tot!;
}

/** So sánh đủ bộ: theo lịch, Avalanche, Snowball, thứ tự tối ưu + đề xuất. */
export function soSanhChienLuoc(dsNo: NoMoPhong[], thangDau: string, traThemMoiThang: DecInput = 0) {
  if (dsNo.length === 0) return null;
  const theoLich = moPhongTraNo(dsNo, { chienLuoc: 'THEO_LICH', thangDau });
  const avalanche = moPhongTraNo(dsNo, { chienLuoc: 'AVALANCHE', thangDau, traThemMoiThang });
  const snowball = moPhongTraNo(dsNo, { chienLuoc: 'SNOWBALL', thangDau, traThemMoiThang });
  const toiUu = timThuTuToiUu(dsNo, thangDau, traThemMoiThang, [avalanche, snowball]);
  const kem = (k: KetQuaMoPhong) => ({ ...k, tietKiemSoVoiLich: round2(chiPhiCua(theoLich).minus(chiPhiCua(k))), somHonThang: theoLich.soThang - k.soThang });
  const coTraThem = D(traThemMoiThang).greaterThan(0);
  return {
    traThemMoiThang: round2(traThemMoiThang),
    theoLich,
    avalanche: kem(avalanche),
    snowball: kem(snowball),
    toiUu: kem(toiUu),
    // Không trả thêm thì mọi thứ tự như nhau (chỉ trả theo lịch) — không đề xuất.
    deXuat: coTraThem ? toiUu.chienLuoc : null,
    avalancheHonSnowball: round2(chiPhiCua(snowball).minus(chiPhiCua(avalanche))),
    giaDinh: [
      'Mỗi tháng vẫn chi đúng tổng tiền các kỳ theo lịch + khoản trả thêm; khoản nào đóng sớm thì tiền kỳ của nó dồn sang khoản ưu tiên kế tiếp.',
      'Trả thêm được tính như trả vào đầu kỳ, trừ phí trả trước hạn nếu đã khai.',
      'Khoản trả góp đều: giữ nguyên số tiền mỗi kỳ, rút ngắn kỳ hạn. Lãi phẳng: lãi mỗi kỳ không đổi cho tới khi đóng hẳn khoản.',
    ],
  };
}

/**
 * Có một khoản tiền `soTien` trả thêm ngay tháng này — dồn vào khoản nào lợi
 * nhất? Thử từng khoản, xếp theo tiền lãi + phí tránh được.
 */
export function xepHangTraMotLan(dsNo: NoMoPhong[], thangDau: string, soTien: DecInput) {
  if (dsNo.length === 0 || D(soTien).lessThanOrEqualTo(0)) return [];
  const goc = moPhongTraNo(dsNo, { chienLuoc: 'THEO_LICH', thangDau });
  const chiPhiGoc = goc.tongLai.plus(goc.tongPhi);
  return dsNo
    .map((d) => {
      const kq = moPhongTraNo(dsNo, { chienLuoc: 'CHI_DINH', chiDinh: [d.id], thangDau, traMotLan: soTien });
      const kh = kq.tungKhoan.find((x) => x.id === d.id)!;
      const khGoc = goc.tungKhoan.find((x) => x.id === d.id)!;
      return {
        id: d.id,
        ten: d.ten,
        tienDungDuoc: round2(Prisma.Decimal.min(D(soTien), d.gocConLai.times(d.phiTraTruocPct.dividedBy(100).plus(1)))),
        tietKiem: round2(chiPhiGoc.minus(kq.tongLai.plus(kq.tongPhi))),
        dongKhoanLuon: kh.thangTatToan === thangDau,
        thangTatToanMoi: kh.thangTatToan,
        thangTatToanCu: khGoc.thangTatToan,
      };
    })
    .sort((a, b) => b.tietKiem.comparedTo(a.tietKiem));
}
