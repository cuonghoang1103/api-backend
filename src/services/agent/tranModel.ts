/**
 * ============================================================
 * TRẦN CHI TIÊU THEO MODEL × NGƯỜI (18/10/2026)
 * ============================================================
 *
 * Mọi model của bảng CuongMini (`bangModel.ts`) — free hay cần khoá — đều có
 * trần USD theo NGƯỜI, theo THÁNG và NGÀY lịch giờ Việt Nam, khác nhau theo gói
 * (`pro` · `key_terminal`). Admin: không giới hạn (vẫn đếm). Gói khác: 0.
 *
 * Model đắt thì trần thấp hơn (chủ app chốt). Admin chỉnh trên trang admin
 * (`app_settings.cuongmini_tran_model`, JSON), không cần deploy.
 *
 * ĐẾM TỪ SỔ CÓ SẴN `interview_llm_call_logs` (feature `agent`, cột `model` =
 * tên thật): mỗi lượt AI Code ghi một dòng theo ĐÚNG model + cổng đã chạy
 * (`turn.ts › ghiSo`, tách đoạn khi tự chuyển cổng), kể cả lượt tóm tắt hội
 * thoại. Không thêm bảng, không thêm bộ đếm thứ hai để lệch khỏi sổ.
 *
 * Cổng chính hãng còn trần NHÓM free/cao cũ (`hanMuc.ts`) — vẫn áp, chồng lên trần này.
 *
 * Sổ hỏng ⇒ CHẶN với cổng chính hãng (tiền thật); cho qua với modelapi (như `quota.ts`/`viTien.ts`).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { bangModel, type MucModel } from './bangModel.js';
import { dauNgayVn, dauThangVn, goiCuaNguoi, type GoiTaiKhoan } from './anthropicChinhHang/hanMuc.js';
import { tienGiaHanTheoKy } from './giaHanTienSo.js';

export type GoiCoTranModel = 'pro' | 'key_terminal';
export const GOI_TRAN_MODEL: readonly GoiCoTranModel[] = ['pro', 'key_terminal'];
export interface TranUsd { thang: number | null; ngay: number | null }

const KHOA = 'cuongmini_tran_model';

/**
 * Mặc định (USD). Model rẻ trong vòng lặp ⇒ trần cao hơn; model đắt ⇒ thấp.
 * key_terminal ≈ một nửa Pro.
 */
export const TRAN_MODEL_MAC_DINH: Record<string, Record<GoiCoTranModel, TranUsd>> = {
  'cm-invisible': { pro: { thang: 10, ngay: 3 }, key_terminal: { thang: 5, ngay: 1.5 } },
  'cm-optimum': { pro: { thang: 20, ngay: 5 }, key_terminal: { thang: 10, ngay: 2.5 } },
  'cm-sonic': { pro: { thang: 100, ngay: 20 }, /* ×10 theo chủ app 18/10/2026 */ key_terminal: { thang: 5, ngay: 1 } },
  'cm-solid': { pro: { thang: 15, ngay: 3 }, key_terminal: { thang: 8, ngay: 1.5 } },
  'cm-nova': { pro: { thang: 15, ngay: 3 }, key_terminal: { thang: 8, ngay: 1.5 } },
  'cm-shin': { pro: { thang: 5, ngay: 1 }, key_terminal: { thang: 2.5, ngay: 0.5 } },
  'cm-eco': { pro: { thang: 10, ngay: 2 }, key_terminal: { thang: 5, ngay: 1 } },
  'cm-heshin': { pro: { thang: 80, ngay: 20 }, /* ×10 theo chủ app 18/10/2026 */ key_terminal: { thang: 4, ngay: 1 } },
};
const DU_PHONG: Record<GoiCoTranModel, TranUsd> = { pro: { thang: 5, ngay: 1 }, key_terminal: { thang: 2.5, ngay: 0.5 } };

function macDinh(id: string): Record<GoiCoTranModel, TranUsd> {
  return TRAN_MODEL_MAC_DINH[id] ?? DU_PHONG;
}

function docSo(v: unknown, mac: number | null): number | null {
  if (v === null) return null;
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100_000 ? v : mac;
}
function docCap(v: unknown, mac: TranUsd): TranUsd {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return { thang: docSo(o.thang, mac.thang), ngay: docSo(o.ngay, mac.ngay) };
}

/** Bảng trần đang hiệu lực cho MỌI model (đọc app_settings, thiếu ⇒ mặc định). */
export async function docTranModel(): Promise<Record<string, Record<GoiCoTranModel, TranUsd>>> {
  let dat: Record<string, unknown> = {};
  try {
    const r = await prisma.appSetting.findUnique({ where: { key: KHOA } });
    if (r?.value) dat = JSON.parse(r.value) as Record<string, unknown>;
  } catch { /* hỏng ⇒ mặc định */ }
  return gopTran(dat);
}

/** Thuần: JSON admin đã lưu ⇒ bảng đủ mọi model. */
export function gopTran(dat: Record<string, unknown>): Record<string, Record<GoiCoTranModel, TranUsd>> {
  const ra: Record<string, Record<GoiCoTranModel, TranUsd>> = {};
  for (const m of bangModel()) {
    const o = (dat[m.id] && typeof dat[m.id] === 'object' ? dat[m.id] : {}) as Record<string, unknown>;
    const mac = macDinh(m.id);
    ra[m.id] = { pro: docCap(o.pro, mac.pro), key_terminal: docCap(o.key_terminal, mac.key_terminal) };
  }
  return ra;
}

/** Ghi đè (chỉ những ô gửi lên). `null` ở một ô = không giới hạn ô đó. */
export async function datTranModel(moi: unknown): Promise<Record<string, Record<GoiCoTranModel, TranUsd>>> {
  const cu = await docTranModel();
  const o = (moi && typeof moi === 'object' ? moi : {}) as Record<string, any>;
  for (const id of Object.keys(cu)) {
    if (!o[id] || typeof o[id] !== 'object') continue;
    for (const g of GOI_TRAN_MODEL) if (o[id][g]) cu[id]![g] = docCap(o[id][g], cu[id]![g]);
  }
  const value = JSON.stringify(cu);
  await prisma.appSetting.upsert({ where: { key: KHOA }, update: { value }, create: { key: KHOA, value } });
  return cu;
}

async function daDung(userId: number, model: string, tu: Date): Promise<number> {
  const s = await prisma.interviewLLMCallLog.aggregate({
    where: { userId, feature: 'agent', model, createdAt: { gte: tu } },
    _sum: { costUsd: true },
  });
  return Number(s._sum.costUsd ?? 0);
}

export interface HanMucModel {
  id: string;
  goi: GoiTaiKhoan;
  khongGioiHan: boolean;
  daDungThang: number;
  daDungNgay: number;
  tranThang: number | null;
  tranNgay: number | null;
  het: boolean;
  /** Mã gia hạn theo $ (19/10/2026): trần GỐC (admin đặt) và phần đã cấp thêm trong kỳ — `tranThang/Ngay` = gốc + cấp. */
  tranThangGoc?: number | null;
  tranNgayGoc?: number | null;
  giaHanThang?: number;
  giaHanNgay?: number;
}

/** Trần nào đang chặn: tháng (ưu tiên — nới ngày không gỡ được trần tháng) hay ngày. `null` = chưa chạm. */
export function kyDangCham(h: Pick<HanMucModel, 'daDungThang' | 'daDungNgay' | 'tranThang' | 'tranNgay'>): 'thang' | 'ngay' | null {
  if (h.tranThang !== null && h.daDungThang >= h.tranThang) return 'thang';
  if (h.tranNgay !== null && h.daDungNgay >= h.tranNgay) return 'ngay';
  return null;
}

/** Thuần: đã dùng + trần ⇒ chạm chưa. */
export function chamTran(daThang: number, daNgay: number, t: TranUsd): boolean {
  return (t.thang !== null && daThang >= t.thang) || (t.ngay !== null && daNgay >= t.ngay);
}

export async function xemTranModel(userId: number, m: MucModel, luc = new Date()): Promise<HanMucModel> {
  const goiDoc = await goiCuaNguoi(userId).catch(() => null);
  /* Không tra được gói (CSDL hỏng): modelapi cho qua (route `chiPro` đã chặn người không Pro/không key),
     chính hãng chặn — cùng luật "sổ hỏng" bên dưới. */
  if (goiDoc === null && m.cong === 'modelapi') {
    return { id: m.id, goi: 'khac', khongGioiHan: false, daDungThang: 0, daDungNgay: 0, tranThang: null, tranNgay: null, het: false };
  }
  const goi: GoiTaiKhoan = goiDoc ?? 'khac';
  const [thang, ngay] = await Promise.all([
    daDung(userId, m.model, dauThangVn(luc)),
    daDung(userId, m.model, dauNgayVn(luc)),
  ]).catch((err) => {
    logger.warn('[cuongmini] không đọc được sổ để tính trần model', { error: (err as Error).message });
    /* Sổ hỏng: cổng chính hãng (tiền thật từ key của chủ app, như `hanMuc.ts`) ⇒ CHẶN;
       cổng modelapi ⇒ cho qua như hạn mức 5 giờ + ví tiền (`quota.ts`, `viTien.ts`) — còn
       cầu dao tiền chung `budget.ts` phía sau. */
    return m.cong === 'anthropic' ? [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY] : [0, 0];
  });
  const sach = (n: number) => (Number.isFinite(n) ? Math.round(n * 10_000) / 10_000 : 0);
  if (goi === 'admin') {
    return { id: m.id, goi, khongGioiHan: true, daDungThang: sach(thang), daDungNgay: sach(ngay), tranThang: null, tranNgay: null, het: false };
  }
  const goc: TranUsd = goi === 'pro' || goi === 'key_terminal' ? (await docTranModel())[m.id]?.[goi] ?? DU_PHONG[goi] : { thang: 0, ngay: 0 };
  /* Mã gia hạn theo $ (19/10/2026): chỉ gói có trần thật (pro/key_terminal) mới được cấp — trần 0 của gói khác không nới. */
  const g = goi === 'pro' || goi === 'key_terminal' ? await tienGiaHanTheoKy(userId, `model:${m.id}`, luc) : { ngay: 0, thang: 0, cuaSo: 0 };
  const t: TranUsd = {
    thang: goc.thang === null ? null : Math.round((goc.thang + g.thang) * 10_000) / 10_000,
    ngay: goc.ngay === null ? null : Math.round((goc.ngay + g.ngay) * 10_000) / 10_000,
  };
  return {
    id: m.id, goi, khongGioiHan: false,
    daDungThang: sach(thang), daDungNgay: sach(ngay),
    tranThang: t.thang, tranNgay: t.ngay,
    het: chamTran(thang, ngay, t),
    tranThangGoc: goc.thang, tranNgayGoc: goc.ngay, giaHanThang: g.thang, giaHanNgay: g.ngay,
  };
}

const usd = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;

/** Câu báo song ngữ khi chạm trần. */
export function loiHetTranModel(h: HanMucModel, ten: string): string {
  const ngay = h.tranNgay !== null && h.daDungNgay >= h.tranNgay;
  return ngay
    ? `Bạn đã dùng hết hạn mức ${ten} hôm nay (${usd(h.daDungNgay)}/${usd(h.tranNgay!)}); làm mới lúc 0 giờ (giờ Việt Nam). Hãy chọn model khác trong danh sách. `
      + `/ You have used today's ${ten} allowance; it resets at midnight (Vietnam time). Pick another model.`
    : `Bạn đã dùng hết hạn mức ${ten} tháng này (${usd(h.daDungThang)}/${usd(h.tranThang ?? 0)}); làm mới đầu tháng sau. Hãy chọn model khác hoặc nhờ quản trị nới trần. `
      + `/ You have used this month's ${ten} allowance; it resets next month. Pick another model or ask an admin.`;
}
