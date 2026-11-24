/**
 * Ô CHỌN MODEL của trợ lý CuongMini trong CT Work (24/11/2026).
 *
 * Bốn lựa chọn: Mặc định (chuỗi cổng cũ — không gián đoạn việc của thành viên) · Pro 2 · Max · Fable Max. Cùng mã, cùng
 * KHOÁ/VÉ 48 giờ với CuongMini CLI (`anthropicChinhHang/ve.ts`): admin đặt mật khẩu ở /admin/commerce?tab=anthropic,
 * admin đổi mật khẩu ⇒ vé cũ chết; ADMIN không cần vé, không trần. Model đã chọn chạy: chính hãng → gwai → chuỗi mặc định
 * → GPT, tự chuyển trong cùng lượt (aiCong.ts `chuoiChoLuot`).
 */
import { AppError } from '../../middleware/errorHandler.js';
import { MA_MODEL_CT_WORK, type ChonModelCtWork, type MaModelCtWork } from './aiCong.js';

export interface ModelTroLy {
  id: 'cm-default' | MaModelCtWork;
  name: string;
  /** Cần nhập khoá (người thường chưa có vé loại này). */
  locked: boolean;
  /** Loại khoá cần nhập khi `locked`. */
  loaiKhoa?: 'chung' | 'invisible';
  available: boolean;
  default?: boolean;
  /** Đắt bất thường ⇒ giao diện nhắc. */
  dat?: boolean;
  /** Vì sao không dùng được — CHỈ admin nhận. */
  lyDo?: string;
}

export function laMaModelCtWork(v: unknown): v is MaModelCtWork {
  return typeof v === 'string' && (MA_MODEL_CT_WORK as readonly string[]).includes(v);
}

/** Danh sách cho giao diện. `ve` = bó vé trình duyệt đang giữ (chuỗi) hoặc không có. */
export async function dsModelTroLy(userId: number, ve: unknown): Promise<ModelTroLy[]> {
  const { quyenChinhHang, daMoKhoa, lyDoKhongDung } = await import('../agent/anthropicChinhHang/dinhTuyen.js');
  const { mucTheoId, gwaiChayDuoc } = await import('../agent/bangModel.js');
  const { coKeyKhaDung } = await import('../agent/anthropicChinhHang/khoKey.js');
  const q = await quyenChinhHang(userId, ve);
  const coKey = await coKeyKhaDung('work_ai').catch(() => false);
  const coGwai = gwaiChayDuoc();
  const ra: ModelTroLy[] = [{ id: 'cm-default', name: 'CuongMini', locked: false, available: true, default: true }];
  for (const ma of MA_MODEL_CT_WORK) {
    const m = mucTheoId(ma);
    if (!m) continue;
    const available = coKey || coGwai;
    ra.push({
      id: ma,
      name: m.ten,
      locked: !daMoKhoa(m, q),
      ...(m.khoa !== 'free' ? { loaiKhoa: m.khoa as 'chung' | 'invisible' } : {}),
      available,
      ...(m.dat ? { dat: true } : {}),
      ...(!available && q.laAdmin ? { lyDo: lyDoKhongDung(m, coKey, coGwai) } : {}),
    });
  }
  return ra;
}

/**
 * Model gửi kèm câu hỏi ⇒ lựa chọn của lượt (hoặc `null` = Mặc định). Model cần khoá mà vé không mở ⇒ 403 rõ ràng (giao
 * diện hỏi khoá) — KHÔNG lặng lẽ chạy Mặc định, để người dùng biết model mình chọn chưa được dùng.
 */
export async function giaiModelChon(userId: number, ma: unknown, ve: unknown): Promise<ChonModelCtWork | null> {
  if (ma === undefined || ma === null || ma === '' || ma === 'cm-default') return null;
  if (!laMaModelCtWork(ma)) throw new AppError('Unknown model.', 400, 'WORK_AI_MODEL_LA', { vi: 'Model không hợp lệ.', en: 'Unknown model.' });
  const { quyenChinhHang, daMoKhoa } = await import('../agent/anthropicChinhHang/dinhTuyen.js');
  const { mucTheoId } = await import('../agent/bangModel.js');
  const m = mucTheoId(ma);
  if (!m) return null;
  const q = await quyenChinhHang(userId, ve);
  if (!daMoKhoa(m, q)) {
    throw new AppError(`${m.ten} needs a key — enter the key your admin gave you.`, 403, 'WORK_AI_MODEL_KHOA', {
      vi: `${m.ten} cần khoá. Nhập khoá do quản trị cấp (dùng được 48 giờ).`,
      en: `${m.ten} needs a key — enter the key your admin gave you (valid for 48 hours).`,
    });
  }
  return { ma, laAdmin: q.laAdmin };
}
