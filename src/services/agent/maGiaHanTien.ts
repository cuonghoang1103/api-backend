/**
 * ============================================================
 * MÃ GIA HẠN THEO $ — mọi trần TIỀN người dùng chạm được (19/10/2026)
 * ============================================================
 *
 * Chủ app chốt: chạm trần ⇒ app (CLI · desktop · VS Code) hiện thẻ "Đã chạm giới hạn … · Nhập mã gia hạn để dùng tiếp".
 *   • Lần 1 trong KỲ của trần đó (ngày / tháng / cửa sổ trượt) — mã đúng ⇒ cộng NGAY một mức = mức GỐC của trần vừa chạm.
 *   • Lần 2 trở đi trong cùng kỳ — mã đúng ⇒ tạo yêu cầu CHỜ DUYỆT; admin web (trang Code Max → "Mã gia hạn") hoặc,
 *     với hạn mức nhóm, NHÀ TÀI TRỢ của dự án duyệt ⇒ cộng thêm một mức; từ chối ⇒ báo rõ. Lặp vô hạn, lần nào cũng chờ.
 *
 * Bốn loại trần (`tran`):
 *   `model:<cm-id>`   trần model × người (`tranModel.ts`) — kỳ `ngay` hoặc `thang` (cái đang chặn; tháng ưu tiên)
 *   `vi`              ví AI Code của người (`viTien.ts`, cửa sổ TRƯỢT 5 giờ) — kỳ `cuaSo`
 *                     (⚠ ví thật đang chặn lượt là `viTien.ts`; `quota.ts › xemViAgent` cũ không còn ai gọi)
 *   `chinhHang:free`  trần nhóm free cổng chính hãng (Sonic 5.5 + Heshin 5.5 — `anthropicChinhHang/hanMuc.ts`)
 *   `nhom:<pid>`      hạn mức nhóm, trần NGƯỜI/NGÀY của đúng người đó trong đúng dự án đó (`hanMucNhom.ts`)
 *
 * Chống lạm dụng:
 *   • mã chỉ lưu BĂM (bcrypt) trong `app_settings` — đổi mã ⇒ `phienBan` tăng, mã cũ sai ngay; KHÔNG BAO GIỜ ghi log/in;
 *   • 5 lần sai / 15 phút ⇒ khoá người đó 15 phút (+ rate-limit theo người ở route);
 *   • MÁY CHỦ tự kiểm "trần này có đang chạm thật không" và tự tính mức — app chỉ nói tên trần;
 *   • model trả phí (`khoa !== 'free'`) chỉ gia hạn được khi vé khoá còn sống — khoá ≠ gia hạn tiền;
 *   • gói không có trần thật (trần 0 của tài khoản thường) không bao giờ "gia hạn" ra tiền.
 *
 * Sổ: bảng `agent_gia_han_tien` (`giaHanTienSo.ts` đọc tổng cho các trần). Lượt 1 trong kỳ chạy trong giao dịch có
 * khoá tư vấn theo (người, trần) — hai lần nhập cùng lúc không thành hai lượt "lần 1".
 */
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { dauKy, type KyGiaHan } from './giaHanTienSo.js';

const KHOA_CAU_HINH = 'cuongmini_ma_gia_han_tien';
/** Trang web nhập mã (app CŨ không hiểu thẻ mới ⇒ câu chữ trỏ về đây). */
export const DUONG_WEB_GIA_HAN = 'cuongthai.com/cuongmini/gia-han';

// ─── Cấu hình mã (chỉ băm) ─────────────────────────────────────────────

export interface CauHinhMa { bam: string | null; phienBan: number }

export function docJsonMa(raw: string | null | undefined): CauHinhMa {
  if (!raw) return { bam: null, phienBan: 0 };
  try {
    const v = JSON.parse(raw) as Partial<CauHinhMa>;
    return {
      bam: typeof v.bam === 'string' && v.bam ? v.bam : null,
      phienBan: Number.isInteger(v.phienBan) && (v.phienBan as number) >= 0 ? (v.phienBan as number) : 0,
    };
  } catch {
    return { bam: null, phienBan: 0 };
  }
}

async function docCauHinhMa(): Promise<CauHinhMa> {
  const r = await prisma.appSetting.findUnique({ where: { key: KHOA_CAU_HINH } });
  return docJsonMa(r?.value);
}

/** Admin đặt/đổi (`ma: string`) hoặc TẮT (`ma: null`). Mỗi lần đều tăng `phienBan` ⇒ mã cũ hết hiệu lực ngay. */
export async function datMaGiaHan(ma: string | null): Promise<{ daBat: boolean; phienBan: number }> {
  if (ma !== null) {
    if (typeof ma !== 'string' || ma.length < 6) throw new GiaHanLoi('Mã tối thiểu 6 ký tự. / The code must be at least 6 characters.', 'GIA_HAN_MA_NGAN', 400);
    if (ma.length > 200) throw new GiaHanLoi('Mã quá dài. / Code too long.', 'GIA_HAN_MA_DAI', 400);
  }
  const cu = await docCauHinhMa();
  const moi: CauHinhMa = { bam: ma ? await bcrypt.hash(ma, 10) : null, phienBan: cu.phienBan + 1 };
  const value = JSON.stringify(moi);
  await prisma.appSetting.upsert({ where: { key: KHOA_CAU_HINH }, update: { value }, create: { key: KHOA_CAU_HINH, value } });
  return { daBat: Boolean(moi.bam), phienBan: moi.phienBan };
}

export async function trangThaiMa(): Promise<{ daBat: boolean; phienBan: number }> {
  const c = await docCauHinhMa();
  return { daBat: Boolean(c.bam), phienBan: c.phienBan };
}

async function coMa(): Promise<boolean> {
  try { return Boolean((await docCauHinhMa()).bam); } catch { return false; }
}

// ─── Lỗi ───────────────────────────────────────────────────────────────

export type MaLoiGiaHan =
  | 'GIA_HAN_CHUA_BAT' | 'GIA_HAN_MA_SAI' | 'GIA_HAN_THU_QUA_NHIEU' | 'GIA_HAN_TRAN_LA' | 'GIA_HAN_KHONG_AP_DUNG'
  | 'GIA_HAN_CHUA_CHAM' | 'GIA_HAN_CAN_KHOA' | 'GIA_HAN_KHONG_THAY' | 'GIA_HAN_DA_XU_LY' | 'GIA_HAN_HET_KY'
  | 'GIA_HAN_KHONG_QUYEN_DUYET' | 'GIA_HAN_MA_NGAN' | 'GIA_HAN_MA_DAI';

export class GiaHanLoi extends Error {
  constructor(message: string, public readonly code: MaLoiGiaHan, public readonly status: number) {
    super(message);
  }
}

// ─── Trần đang chạm ────────────────────────────────────────────────────

/** Một trần ĐANG chạm, máy chủ tự tính — `mucUsd` = mức gốc của kỳ đó (một lần cấp cộng đúng ngần này). */
export interface TranCham {
  tran: string;
  ky: KyGiaHan;
  ten: string;
  tenEn: string;
  mucUsd: number;
  daDungUsd: number;
  /** Trần hiệu lực lúc này (gốc + đã cấp trong kỳ). */
  tranUsd: number;
  projectId?: number;
}

const r4 = (n: number): number => Math.round(n * 10_000) / 10_000;
const KY_VI: Record<KyGiaHan, string> = { ngay: 'hôm nay', thang: 'tháng này', cuaSo: '5 giờ qua' };
const KY_EN: Record<KyGiaHan, string> = { ngay: 'today', thang: 'this month', cuaSo: 'last 5 hours' };

/** THUẦN: trần model × người ⇒ trần đang chạm (chỉ gói có trần thật). */
export function tranChamModel(
  h: { goi: string; daDungThang: number; daDungNgay: number; tranThang: number | null; tranNgay: number | null; tranThangGoc?: number | null; tranNgayGoc?: number | null },
  m: { id: string; ten: string },
): TranCham | null {
  if (h.goi !== 'pro' && h.goi !== 'key_terminal') return null;
  const ky: KyGiaHan | null = h.tranThang !== null && h.daDungThang >= h.tranThang ? 'thang'
    : h.tranNgay !== null && h.daDungNgay >= h.tranNgay ? 'ngay' : null;
  if (!ky) return null;
  const muc = ky === 'thang' ? (h.tranThangGoc ?? h.tranThang) : (h.tranNgayGoc ?? h.tranNgay);
  if (muc === null || muc === undefined || !(muc > 0)) return null;
  return {
    tran: `model:${m.id}`, ky, mucUsd: r4(muc),
    ten: `${m.ten} · ${KY_VI[ky]}`, tenEn: `${m.ten} · ${KY_EN[ky]}`,
    daDungUsd: r4(ky === 'thang' ? h.daDungThang : h.daDungNgay), tranUsd: r4((ky === 'thang' ? h.tranThang : h.tranNgay) ?? 0),
  };
}

/** THUẦN: ví AI Code (cửa sổ trượt). */
export function tranChamVi(v: { mang: string; canVi: boolean; daTieu: number; tran: number; tranGoc?: number; soGio: number }): TranCham | null {
  if (v.mang !== 'code' || !v.canVi) return null;
  const muc = v.tranGoc ?? v.tran;
  if (!(muc > 0)) return null;
  return {
    tran: 'vi', ky: 'cuaSo', mucUsd: r4(muc), daDungUsd: r4(v.daTieu), tranUsd: r4(v.tran),
    ten: `Ví AI Code · ${v.soGio} giờ qua`, tenEn: `AI Code wallet · last ${v.soGio} hours`,
  };
}

/** THUẦN: nhóm free cổng chính hãng (Sonic 5.5 + Heshin 5.5). */
export function tranChamChinhHangFree(h: {
  hang: string; goi: string; het: boolean; daDungThang: number; daDungNgay: number; tranThang: number | null; tranNgay: number | null;
  tranThangGoc?: number | null; tranNgayGoc?: number | null;
}): TranCham | null {
  if (h.hang !== 'free' || !h.het || (h.goi !== 'pro' && h.goi !== 'key_terminal')) return null;
  const ky: KyGiaHan | null = h.tranThang !== null && h.daDungThang >= h.tranThang ? 'thang'
    : h.tranNgay !== null && h.daDungNgay >= h.tranNgay ? 'ngay' : null;
  if (!ky) return null;
  const muc = ky === 'thang' ? (h.tranThangGoc ?? h.tranThang) : (h.tranNgayGoc ?? h.tranNgay);
  if (muc === null || muc === undefined || !(muc > 0)) return null;
  return {
    tran: 'chinhHang:free', ky, mucUsd: r4(muc),
    ten: `CuongMini Code Max miễn phí (Sonic 5.5 + Heshin 5.5) · ${KY_VI[ky]}`, tenEn: `CuongMini Code Max free (Sonic 5.5 + Heshin 5.5) · ${KY_EN[ky]}`,
    daDungUsd: r4(ky === 'thang' ? h.daDungThang : h.daDungNgay), tranUsd: r4((ky === 'thang' ? h.tranThang : h.tranNgay) ?? 0),
  };
}

/** THUẦN: hạn mức nhóm — CHỈ trần người/ngày (trần tháng của nhóm là tiền của nhà tài trợ, trưởng nhóm tự nới). */
export function tranChamNhom(n: { projectId: number; key: string; tranNgayNguoiUsd: number; daDungNgay: number; giaHanNgay?: number; daDungThang: number; tranThangNhomUsd: number }): TranCham | null {
  if (n.daDungThang >= n.tranThangNhomUsd) return null;
  const tran = n.tranNgayNguoiUsd + (n.giaHanNgay ?? 0);
  if (!(n.tranNgayNguoiUsd > 0) || n.daDungNgay < tran) return null;
  return {
    tran: `nhom:${n.projectId}`, ky: 'ngay', mucUsd: r4(n.tranNgayNguoiUsd), daDungUsd: r4(n.daDungNgay), tranUsd: r4(tran), projectId: n.projectId,
    ten: `Hạn mức nhóm ${n.key} · hôm nay`, tenEn: `Team ${n.key} allowance · today`,
  };
}

/** Tên hiển thị của một mã trần (cho bảng admin / trưởng nhóm). */
async function tenTran(tran: string): Promise<{ vi: string; en: string }> {
  if (tran === 'vi') return { vi: 'Ví AI Code', en: 'AI Code wallet' };
  if (tran === 'chinhHang:free') return { vi: 'CuongMini Code Max miễn phí', en: 'CuongMini Code Max free' };
  if (tran.startsWith('model:')) {
    const { mucTheoId } = await import('./bangModel.js');
    const m = mucTheoId(tran.slice(6));
    return { vi: m?.ten ?? tran, en: m?.ten ?? tran };
  }
  if (tran.startsWith('nhom:')) {
    const pid = Number(tran.slice(5));
    const p = Number.isInteger(pid) ? await prisma.workProject.findUnique({ where: { id: pid }, select: { key: true } }).catch(() => null) : null;
    return { vi: `Hạn mức nhóm ${p?.key ?? `#${pid}`}`, en: `Team ${p?.key ?? `#${pid}`} allowance` };
  }
  return { vi: tran, en: tran };
}

const kyHopLe = (k: string): k is KyGiaHan => k === 'ngay' || k === 'thang' || k === 'cuaSo';

/**
 * MÁY CHỦ tự xác định: trần `tran` của người này có ĐANG chạm không, ở kỳ nào, một mức bao nhiêu. Ném `GiaHanLoi` khi
 * không áp dụng / chưa chạm / cần khoá. App chỉ nói TÊN trần — không bao giờ nói số tiền.
 */
export async function xacDinhTran(userId: number, tran: string, o: { congAnthropicVe?: unknown } = {}): Promise<TranCham> {
  const chuaCham = () => new GiaHanLoi('Trần này chưa chạm — chưa cần gia hạn. / This limit has not been reached yet.', 'GIA_HAN_CHUA_CHAM', 409);
  const khongAp = (vi = 'Trần này không gia hạn được bằng mã.', en = 'This limit cannot be extended with a code.') => new GiaHanLoi(`${vi} / ${en}`, 'GIA_HAN_KHONG_AP_DUNG', 400);
  if (typeof tran !== 'string' || tran.length > 60) throw new GiaHanLoi('Không rõ trần cần gia hạn. / Unknown limit.', 'GIA_HAN_TRAN_LA', 400);

  if (tran.startsWith('model:')) {
    const { mucTheoId } = await import('./bangModel.js');
    const m = mucTheoId(tran.slice(6));
    if (!m) throw new GiaHanLoi('Không rõ model cần gia hạn. / Unknown model.', 'GIA_HAN_TRAN_LA', 400);
    if (m.khoa !== 'free') {
      /* Khoá ≠ gia hạn tiền: model trả phí chỉ gia hạn khi vé khoá còn sống. */
      const { daMoKhoa, quyenChinhHang } = await import('./anthropicChinhHang/dinhTuyen.js');
      const q = await quyenChinhHang(userId, o.congAnthropicVe).catch(() => ({ laAdmin: false, modelCao: false, invisible: false }));
      if (!daMoKhoa(m, q)) {
        throw new GiaHanLoi(`${m.ten} cần khoá trước — mã gia hạn không thay khoá. / ${m.ten} needs its key first — an extension code does not replace the key.`, 'GIA_HAN_CAN_KHOA', 403);
      }
    }
    const { xemTranModel } = await import('./tranModel.js');
    const h = await xemTranModel(userId, m);
    if (h.goi !== 'pro' && h.goi !== 'key_terminal') throw khongAp();
    const tc = tranChamModel(h, m);
    if (!tc) throw chuaCham();
    return tc;
  }
  if (tran === 'vi') {
    const { isProEffective } = await import('../pro.service.js');
    const { coKeyTerminalHieuLuc } = await import('./keyTerminal.js');
    if (!(await isProEffective(userId)) && !(await coKeyTerminalHieuLuc(userId))) throw khongAp();
    const { xemViTien } = await import('./viTien.js');
    const tc = tranChamVi(await xemViTien(userId, 'code'));
    if (!tc) throw chuaCham();
    return tc;
  }
  if (tran === 'chinhHang:free') {
    const { xemHanMucChinhHang } = await import('./anthropicChinhHang/hanMuc.js');
    const h = await xemHanMucChinhHang(userId, 'free');
    if (h.goi !== 'pro' && h.goi !== 'key_terminal') throw khongAp();
    const tc = tranChamChinhHangFree(h);
    if (!tc) throw chuaCham();
    return tc;
  }
  if (tran.startsWith('nhom:')) {
    const pid = Number(tran.slice(5));
    if (!Number.isInteger(pid) || pid <= 0) throw new GiaHanLoi('Không rõ dự án. / Unknown project.', 'GIA_HAN_TRAN_LA', 400);
    const { quyetDinhNhom } = await import('./hanMucNhom.js');
    const q = await quyetDinhNhom(userId, pid, { kiemTran: false });
    if (q.loai !== 'nhom') throw new GiaHanLoi(q.cau, 'GIA_HAN_KHONG_AP_DUNG', 403);
    if (q.daDungThang >= q.tranThangNhomUsd) {
      throw khongAp(`Nhóm ${q.key} đã dùng hết hạn mức THÁNG — mã gia hạn chỉ nới trần mỗi người/ngày; trưởng nhóm nới trần tháng ở Project settings → CuongMini.`,
        `Team ${q.key} used up its MONTHLY allowance — a code only extends the per-member daily limit; the team lead raises the monthly cap in Project settings → CuongMini.`);
    }
    const tc = tranChamNhom(q);
    if (!tc) throw chuaCham();
    return tc;
  }
  throw new GiaHanLoi('Không rõ trần cần gia hạn. / Unknown limit.', 'GIA_HAN_TRAN_LA', 400);
}

// ─── Thông tin cho thẻ trong app + câu cho app cũ ──────────────────────

export interface GiaHanTienUi {
  tran: string;
  ky: KyGiaHan;
  ten: string;
  tenEn: string;
  mucUsd: number;
  daDungUsd: number;
  tranUsd: number;
  /** Lần nhập mã kế tiếp sẽ phải chờ duyệt (đã có lượt trong kỳ). */
  canDuyet: boolean;
  /** Yêu cầu đang chờ duyệt (id) — app tự kiểm lại thay vì hỏi mã. */
  dangCho: number | null;
  /** Lần thứ mấy trong kỳ nếu nhập bây giờ. */
  lanThu: number;
  /** Trang web nhập mã (app cũ / người muốn nhập trên web). */
  duongDan: string;
}

const usd = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;

/**
 * Trần vừa chặn ⇒ (1) `ui` cho thẻ "Nhập mã gia hạn" của app mới, (2) câu nối thêm vào thông báo lỗi để app CŨ (không
 * hiểu thẻ) vẫn biết đường: "Vào cuongthai.com/cuongmini/gia-han để nhập mã gia hạn". Admin chưa đặt mã ⇒ không có gì.
 * KHÔNG ném: hỏng thì trả rỗng — câu lỗi gốc vẫn đi.
 */
export async function giaHanChoLoi(userId: number, tc: TranCham | null, luc = new Date()): Promise<{ ui?: GiaHanTienUi; them: string }> {
  if (!tc) return { them: '' };
  try {
    if (!(await coMa())) return { them: '' };
    const tu = dauKy(tc.ky, luc, await soGioCuaSo());
    const [cho, soLuot] = await Promise.all([
      prisma.agentGiaHanTien.findFirst({ where: { userId, tran: tc.tran, ky: tc.ky, trangThai: 'CHO_DUYET', createdAt: { gte: tu } }, select: { id: true }, orderBy: { id: 'desc' } }),
      prisma.agentGiaHanTien.count({ where: { userId, tran: tc.tran, ky: tc.ky, createdAt: { gte: tu }, trangThai: { in: ['DA_CAP', 'CHO_DUYET', 'TU_CHOI', 'HET_KY'] } } }),
    ]);
    const ui: GiaHanTienUi = { ...tc, canDuyet: soLuot > 0, dangCho: cho?.id ?? null, lanThu: soLuot + 1, duongDan: `https://${DUONG_WEB_GIA_HAN}` };
    const them = cho
      ? ` Yêu cầu gia hạn #${cho.id} đang chờ admin duyệt (xem ở ${DUONG_WEB_GIA_HAN}). / Extension request #${cho.id} is waiting for approval (see ${DUONG_WEB_GIA_HAN}).`
      : ` Có mã gia hạn? Vào ${DUONG_WEB_GIA_HAN} để nhập mã gia hạn (+${usd(tc.mucUsd)}${soLuot > 0 ? ', lần này cần admin duyệt' : ''}). / Have an extension code? Go to ${DUONG_WEB_GIA_HAN} to enter it (+${usd(tc.mucUsd)}${soLuot > 0 ? ', needs admin approval this time' : ''}).`;
    return { ui, them };
  } catch (err) {
    logger.warn('[gia-han-tien] không dựng được thông tin gia hạn', { error: (err as Error).message });
    return { them: '' };
  }
}

async function soGioCuaSo(): Promise<number> {
  const { soGioViTien } = await import('./viTien.js');
  return soGioViTien();
}

// ─── Người dùng nhập mã ────────────────────────────────────────────────

const lanSai = new Map<number, { dem: number; tu: number }>();
const CUA_SO_SAI_MS = 15 * 60 * 1000;
export const SAI_TOI_DA = 5;
/** Chỉ cho kiểm thử. */
export function xoaDemSaiGiaHan(): void { lanSai.clear(); }

export type KetQuaNhap =
  | { ketQua: 'daCap'; id: number; soUsd: number; lanThu: number; tran: TranCham }
  | { ketQua: 'choDuyet'; id: number; soUsd: number; lanThu: number; moi: boolean; tran: TranCham };

/** Khoá tư vấn 32-bit theo (người, trần) — FNV-1a. */
function khoaTuVan(userId: number, tran: string): number {
  let h = 0x811c9dc5;
  for (const c of `ghtien:${userId}:${tran}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193); }
  return h | 0;
}

/**
 * Nhập mã cho trần `tran`. Mọi phép kiểm ở đây (không tin app): mã đúng (bcrypt, chưa bị khoá vì sai nhiều), trần CÓ
 * đang chạm, model trả phí có vé. Lần 1 trong kỳ ⇒ cấp ngay; còn lại ⇒ yêu cầu chờ duyệt (đã có yêu cầu chờ ⇒ trả lại nó).
 */
export async function nhapMaGiaHan(
  userId: number,
  o: { ma: string; tran: string; congAnthropicVe?: unknown },
  luc = new Date(),
): Promise<KetQuaNhap> {
  const now = luc.getTime();
  const ch = await docCauHinhMa();
  if (!ch.bam) throw new GiaHanLoi('Quản trị chưa bật mã gia hạn. / The admin has not enabled extension codes.', 'GIA_HAN_CHUA_BAT', 409);

  const sai = lanSai.get(userId);
  if (sai && now - sai.tu < CUA_SO_SAI_MS && sai.dem >= SAI_TOI_DA) {
    throw new GiaHanLoi('Nhập sai quá nhiều lần — thử lại sau 15 phút. / Too many wrong attempts — try again in 15 minutes.', 'GIA_HAN_THU_QUA_NHIEU', 429);
  }
  /*
   * QA đợt 7: kiểm "trần có ĐANG chạm thật" TRƯỚC khi so mã. Trước đây so mã trước ⇒ MỌI tài khoản (kể cả tài khoản
   * thường không có trần nào để gia hạn) đều dò được mã — 5 lần/15 phút mỗi tài khoản, nhân với bao nhiêu tài khoản
   * tự tạo cũng được. Nay chỉ người đang thật sự bị chặn bởi một trần gia hạn được mới được thử mã. Câu trả lời của
   * bước này ("chưa chạm", "không áp dụng") không nói gì về mã — `GET /gia-han-tien` vốn đã cho biết chừng đó.
   */
  const tc0 = await xacDinhTran(userId, o.tran, { congAnthropicVe: o.congAnthropicVe });
  const ma = typeof o.ma === 'string' ? o.ma : '';
  if (!ma || ma.length > 200 || !(await bcrypt.compare(ma, ch.bam))) {
    const moi = sai && now - sai.tu < CUA_SO_SAI_MS ? { dem: sai.dem + 1, tu: sai.tu } : { dem: 1, tu: now };
    lanSai.set(userId, moi);
    const con = Math.max(0, SAI_TOI_DA - moi.dem);
    throw new GiaHanLoi(`Mã gia hạn không đúng (hoặc admin đã đổi mã). Còn ${con} lần thử. / Wrong extension code (or the admin changed it). ${con} attempts left.`, 'GIA_HAN_MA_SAI', 403);
  }
  lanSai.delete(userId);

  const soGio = await soGioCuaSo();
  let tc!: TranCham;
  const kq = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${khoaTuVan(userId, tc0.tran)}::int)`;
    /* QA đợt 7: xác định trần LẠI sau khi giữ khoá. Hai lần nhập cùng lúc (bấm Enter hai lần, hai app) — lượt đầu cấp
       xong là trần KHÔNG còn chạm; trước đây lượt sau vẫn dùng kết quả cũ ⇒ tạo yêu cầu "chờ duyệt" thừa + báo admin. */
    tc = await xacDinhTran(userId, o.tran, { congAnthropicVe: o.congAnthropicVe });
    const tu = dauKy(tc.ky, luc, soGio);
    const cho = await tx.agentGiaHanTien.findFirst({
      where: { userId, tran: tc.tran, ky: tc.ky, trangThai: 'CHO_DUYET', createdAt: { gte: tu } },
      orderBy: { id: 'desc' },
    });
    if (cho) return { ketQua: 'choDuyet' as const, id: cho.id, soUsd: cho.soUsd, lanThu: cho.lanThu, moi: false };
    const n = await tx.agentGiaHanTien.count({
      where: { userId, tran: tc.tran, ky: tc.ky, createdAt: { gte: tu }, trangThai: { in: ['DA_CAP', 'TU_CHOI', 'HET_KY'] } },
    });
    const capNgay = n === 0;
    const r = await tx.agentGiaHanTien.create({
      data: {
        userId, tran: tc.tran, ky: tc.ky, projectId: tc.projectId ?? null, soUsd: tc.mucUsd,
        trangThai: capNgay ? 'DA_CAP' : 'CHO_DUYET', lanThu: n + 1,
        daDungUsd: tc.daDungUsd, tranUsd: tc.tranUsd, phienBanMa: ch.phienBan,
        createdAt: luc, ...(capNgay ? { capLuc: luc } : {}),
      },
    });
    return capNgay
      ? { ketQua: 'daCap' as const, id: r.id, soUsd: r.soUsd, lanThu: r.lanThu }
      : { ketQua: 'choDuyet' as const, id: r.id, soUsd: r.soUsd, lanThu: r.lanThu, moi: true };
  });

  /* ⛔ KHÔNG log mã — chỉ id, trần, số tiền. */
  logger.info('[gia-han-tien] nhập mã gia hạn', { userId, tran: tc.tran, ky: tc.ky, ketQua: kq.ketQua, id: kq.id, soUsd: kq.soUsd, lanThu: kq.lanThu });
  if (kq.ketQua === 'choDuyet' && kq.moi) void baoCoYeuCau(userId, kq.id, tc, kq.lanThu);
  return { ...kq, tran: tc };
}

/** Báo admin (hộp thư admin + Telegram) và — với hạn mức nhóm — nhà tài trợ của dự án (chuông CT Work). Không ném. */
async function baoCoYeuCau(userId: number, id: number, tc: TranCham, lanThu: number): Promise<void> {
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
    const ai = u ? `@${u.username}` : `#${userId}`;
    const { baoAdmin } = await import('../thongBaoAdmin.service.js');
    await baoAdmin({
      loai: 'KHAC',
      mucDo: 'can_xu_ly',
      tieuDe: `CuongMini: ${ai} xin gia hạn ${tc.ten} (lần ${lanThu})`,
      noiDung: `Đã dùng ${usd(tc.daDungUsd)}/${usd(tc.tranUsd)} · duyệt sẽ cộng ${usd(tc.mucUsd)}.`,
      duongDan: '/admin/commerce?tab=anthropic',
      userId,
      entityId: id,
      khoaChongTrung: `GIA_HAN_TIEN:${id}`,
    });
    if (tc.projectId) {
      const { timChuNhom } = await import('./hanMucNhom.js');
      const chu = await timChuNhom(tc.projectId);
      const p = await prisma.workProject.findUnique({ where: { id: tc.projectId }, select: { key: true, workspace: { select: { slug: true } } } });
      if (chu && p) {
        const { notifyWork } = await import('../notification.service.js');
        await notifyWork({
          receiverId: chu.id, senderId: userId, type: 'WORK_ALERT', entityId: tc.projectId,
          payload: {
            issueKey: p.key, title: 'CuongMini',
            message: `${ai} xin gia hạn hạn mức CuongMini của nhóm (lần ${lanThu} hôm nay, +${usd(tc.mucUsd)}) — duyệt ở Project settings → CuongMini / ${ai} asks to extend the team CuongMini allowance — approve in Project settings → CuongMini`,
            url: `/work/${p.workspace.slug}/${p.key}/settings?tab=cuongmini`,
          },
        });
      }
    }
  } catch (err) {
    logger.warn('[gia-han-tien] không báo được yêu cầu mới', { id, error: (err as Error).message });
  }
}

// ─── Trạng thái / danh sách ────────────────────────────────────────────

export interface YeuCauView {
  id: number;
  userId: number;
  username: string | null;
  ten: string | null;
  email?: string | null;
  tran: string;
  tenTran: string;
  tenTranEn: string;
  ky: string;
  soUsd: number;
  lanThu: number;
  daDungUsd: number;
  tranUsd: number;
  trangThai: string;
  lyDoTuChoi: string | null;
  projectId: number | null;
  /** Số lượt ĐÃ CẤP cho (người, trần) trong cùng kỳ với yêu cầu. */
  soLanDaCapKy: number;
  createdAt: string;
  capLuc: string | null;
}

type HangGiaHan = {
  id: number; userId: number; tran: string; ky: string; soUsd: number; lanThu: number; daDungUsd: number; tranUsd: number;
  trangThai: string; lyDoTuChoi: string | null; projectId: number | null; createdAt: Date; capLuc: Date | null;
};

async function dungView(ds: HangGiaHan[], o: { email?: boolean } = {}): Promise<YeuCauView[]> {
  if (!ds.length) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: [...new Set(ds.map((r) => r.userId))] } },
    select: { id: true, username: true, fullName: true, displayName: true, email: true },
  });
  const soGio = await soGioCuaSo();
  const tenNho = new Map<string, { vi: string; en: string }>();
  const ra: YeuCauView[] = [];
  for (const r of ds) {
    const u = users.find((x) => x.id === r.userId);
    if (!tenNho.has(r.tran)) tenNho.set(r.tran, await tenTran(r.tran));
    const t = tenNho.get(r.tran)!;
    const ky = kyHopLe(r.ky) ? r.ky : 'ngay';
    const soLanDaCapKy = await prisma.agentGiaHanTien.count({
      where: { userId: r.userId, tran: r.tran, ky: r.ky, trangThai: 'DA_CAP', createdAt: { gte: dauKy(ky, r.createdAt, soGio) } },
    });
    ra.push({
      id: r.id, userId: r.userId, username: u?.username ?? null, ten: u ? (u.displayName || u.fullName || u.username) : null,
      ...(o.email ? { email: u?.email ?? null } : {}),
      tran: r.tran, tenTran: `${t.vi} · ${KY_VI[ky]}`, tenTranEn: `${t.en} · ${KY_EN[ky]}`, ky: r.ky,
      soUsd: r.soUsd, lanThu: r.lanThu, daDungUsd: r.daDungUsd, tranUsd: r.tranUsd, trangThai: r.trangThai, lyDoTuChoi: r.lyDoTuChoi,
      projectId: r.projectId, soLanDaCapKy, createdAt: r.createdAt.toISOString(), capLuc: r.capLuc?.toISOString() ?? null,
    });
  }
  return ra;
}

/** Trang admin: chờ duyệt (mọi trần) + 50 lượt gần nhất. */
export async function dsYeuCauAdmin(): Promise<{ choDuyet: YeuCauView[]; ganDay: YeuCauView[] }> {
  const [cho, gan] = await Promise.all([
    prisma.agentGiaHanTien.findMany({ where: { trangThai: 'CHO_DUYET' }, orderBy: { id: 'asc' }, take: 200 }),
    prisma.agentGiaHanTien.findMany({ where: { trangThai: { not: 'CHO_DUYET' } }, orderBy: { id: 'desc' }, take: 50 }),
  ]);
  return { choDuyet: await dungView(cho, { email: true }), ganDay: await dungView(gan, { email: true }) };
}

/** Trưởng nhóm: yêu cầu chờ duyệt của nhóm + tổng gia hạn tháng này theo người. */
export async function giaHanCuaNhom(projectId: number, luc = new Date()): Promise<{
  choDuyet: YeuCauView[];
  theoNguoi: Array<{ userId: number; usd: number; soLan: number }>;
}> {
  const tran = `nhom:${projectId}`;
  const [cho, cap] = await Promise.all([
    prisma.agentGiaHanTien.findMany({ where: { tran, trangThai: 'CHO_DUYET' }, orderBy: { id: 'asc' }, take: 100 }),
    prisma.agentGiaHanTien.groupBy({
      by: ['userId'], where: { tran, trangThai: 'DA_CAP', capLuc: { gte: dauKy('thang', luc) } }, _sum: { soUsd: true }, _count: { _all: true },
    }),
  ]);
  return {
    choDuyet: await dungView(cho),
    theoNguoi: cap.map((x) => ({ userId: x.userId, usd: r4(Number(x._sum.soUsd ?? 0)), soLan: x._count._all })),
  };
}

/** App kiểm lại một yêu cầu (chỉ của chính mình). */
export async function xemYeuCauCuaNguoi(userId: number, id: number): Promise<YeuCauView> {
  const r = await prisma.agentGiaHanTien.findFirst({ where: { id, userId } });
  if (!r) throw new GiaHanLoi('Không thấy yêu cầu gia hạn này. / Extension request not found.', 'GIA_HAN_KHONG_THAY', 404);
  return (await dungView([r]))[0]!;
}

/** Trang web nhập mã: các trần ĐANG chạm của người này + 20 lượt gần nhất. */
export async function tongQuanCuaNguoi(userId: number, o: { congAnthropicVe?: unknown } = {}): Promise<{
  coMa: boolean; tranCham: GiaHanTienUi[]; ganDay: YeuCauView[];
}> {
  const ds: TranCham[] = [];
  const thu = async (tran: string) => {
    try { ds.push(await xacDinhTran(userId, tran, o)); } catch { /* không chạm / không áp dụng */ }
  };
  const { bangModel } = await import('./bangModel.js');
  await thu('vi');
  await thu('chinhHang:free');
  for (const m of bangModel()) await thu(`model:${m.id}`);
  const { duAnNhomCuaNguoi } = await import('./hanMucNhom.js');
  for (const p of await duAnNhomCuaNguoi(userId).catch(() => [])) await thu(`nhom:${p.projectId}`);
  const tranCham: GiaHanTienUi[] = [];
  for (const tc of ds) {
    const g = await giaHanChoLoi(userId, tc);
    if (g.ui) tranCham.push(g.ui);
  }
  const gan = await prisma.agentGiaHanTien.findMany({ where: { userId }, orderBy: { id: 'desc' }, take: 20 });
  return { coMa: await coMa(), tranCham, ganDay: await dungView(gan) };
}

// ─── Duyệt / từ chối ───────────────────────────────────────────────────

/**
 * Duyệt (`dongY`) hoặc từ chối một yêu cầu CHỜ DUYỆT.
 *   `quyen: 'admin'` — admin web (route đã `requireAdmin`), mọi trần;
 *   `quyen: { projectId }` — CHỈ yêu cầu `nhom:<projectId>`, và người duyệt phải là NHÀ TÀI TRỢ đang hiệu lực của dự án
 *   (duyệt = tiêu thêm tiền của họ — cùng luật "chỉ nhà tài trợ nới trần" của QA đợt 6).
 * Duyệt khi kỳ của yêu cầu đã qua (trần đã làm mới) ⇒ `HET_KY`, không cấp (không biến thành quà cho kỳ sau).
 */
export async function duyetYeuCau(
  nguoiDuyetId: number, id: number, dongY: boolean,
  o: { quyen: 'admin' | { projectId: number }; lyDo?: string },
  luc = new Date(),
): Promise<YeuCauView> {
  const r = await prisma.agentGiaHanTien.findUnique({ where: { id } });
  if (!r) throw new GiaHanLoi('Không thấy yêu cầu gia hạn này. / Extension request not found.', 'GIA_HAN_KHONG_THAY', 404);
  if (o.quyen !== 'admin') {
    if (r.tran !== `nhom:${o.quyen.projectId}`) throw new GiaHanLoi('Không thấy yêu cầu gia hạn này. / Extension request not found.', 'GIA_HAN_KHONG_THAY', 404);
    const { timChuNhom } = await import('./hanMucNhom.js');
    const chu = await timChuNhom(o.quyen.projectId);
    if (!chu || chu.id !== nguoiDuyetId) {
      throw new GiaHanLoi('Chỉ nhà tài trợ của nhóm (hoặc admin web) duyệt được — duyệt là tiêu thêm tiền của nhà tài trợ. / Only the team sponsor (or a site admin) can decide.', 'GIA_HAN_KHONG_QUYEN_DUYET', 403);
    }
  }
  if (r.trangThai !== 'CHO_DUYET') throw new GiaHanLoi('Yêu cầu này đã được xử lý. / This request was already handled.', 'GIA_HAN_DA_XU_LY', 409);
  const ky = kyHopLe(r.ky) ? r.ky : 'ngay';
  if (dongY && r.createdAt.getTime() < dauKy(ky, luc, await soGioCuaSo()).getTime()) {
    await prisma.agentGiaHanTien.updateMany({ where: { id, trangThai: 'CHO_DUYET' }, data: { trangThai: 'HET_KY', nguoiDuyetId } });
    throw new GiaHanLoi('Kỳ của yêu cầu này đã qua (trần đã tự làm mới) — không cần cấp nữa. / This request\'s period has ended (the limit already reset).', 'GIA_HAN_HET_KY', 409);
  }
  const doi = await prisma.agentGiaHanTien.updateMany({
    where: { id, trangThai: 'CHO_DUYET' },
    data: dongY
      ? { trangThai: 'DA_CAP', capLuc: luc, nguoiDuyetId }
      : { trangThai: 'TU_CHOI', nguoiDuyetId, lyDoTuChoi: (o.lyDo ?? '').trim().slice(0, 300) || null },
  });
  if (!doi.count) throw new GiaHanLoi('Yêu cầu này đã được xử lý. / This request was already handled.', 'GIA_HAN_DA_XU_LY', 409);
  logger.info('[gia-han-tien] xử lý yêu cầu', { id, nguoiDuyetId, dongY, quyen: o.quyen === 'admin' ? 'admin' : 'nhom' });
  const moi = await prisma.agentGiaHanTien.findUniqueOrThrow({ where: { id } });
  return (await dungView([moi]))[0]!;
}
