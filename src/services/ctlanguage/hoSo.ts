/**
 * CT Language — hồ sơ học (app iOS, docs/ct-language-app.md mục 7 bước 1).
 *
 * Một người có MỘT hồ sơ: ngôn ngữ đang học + lựa chọn lúc làm quen của TỪNG ngôn ngữ đã chọn (trình độ, mục
 * tiêu, mốc muốn đạt, phút/ngày) + giờ nhắc. Đổi ngôn ngữ trong Cài đặt chỉ đổi `activeLang` — lựa chọn của
 * ngôn ngữ kia vẫn giữ, nên quay lại không phải làm quen lại.
 *
 * App chạy được KHÔNG đăng nhập (bài học + từ điển free): hồ sơ khách sống trên máy, đăng nhập thì app đẩy lên
 * đây. Phần kiểm hình dạng (`chuanHoaHoSo`) là hàm THUẦN để kiểm được không cần CSDL.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

export const NGON_NGU = ['en', 'ja', 'zh'] as const;
export type NgonNgu = (typeof NGON_NGU)[number];

/** Trình độ hiện tại người học tự chọn lúc làm quen. `0` = chưa biết gì. */
export const TRINH_DO: Readonly<Record<NgonNgu, readonly string[]>> = Object.freeze({
  en: ['0', 'a1', 'a2', 'b1', 'b2', 'c1'],
  ja: ['0', 'n5', 'n4', 'n3', 'n2', 'n1'],
  zh: ['0', 'hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'],
});

/** Mốc muốn đạt. Tiếng Anh theo band IELTS (trục của lộ trình), Nhật theo JLPT, Trung theo HSK. */
export const MOC_DICH: Readonly<Record<NgonNgu, readonly string[]>> = Object.freeze({
  en: ['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0'],
  ja: ['n5', 'n4', 'n3', 'n2', 'n1'],
  zh: ['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'],
});

export const MUC_TIEU = ['thi', 'giao-tiep', 'cong-viec', 'du-hoc', 'so-thich'] as const;
export const PHUT_MOI_NGAY = [5, 10, 15, 20, 30, 45, 60] as const;

export interface LuaChonNgonNgu {
  level: string;
  goal: (typeof MUC_TIEU)[number];
  target: string | null;
  minutesPerDay: number;
  /** ISO — lần đầu chọn ngôn ngữ này. */
  startedAt: string;
}

export interface HoSo {
  activeLang: NgonNgu;
  langs: Partial<Record<NgonNgu, LuaChonNgonNgu>>;
  reminder: string | null;
  updatedAt?: string;
}

const laNgonNgu = (x: unknown): x is NgonNgu => typeof x === 'string' && (NGON_NGU as readonly string[]).includes(x);

/**
 * Kiểm + chuẩn hoá thân `PUT /ctlanguage/me`. Ném `BadRequestError` (mã `CTL_HO_SO_SAI`) với câu nói rõ trường nào.
 * `bayGio` truyền vào để phép kiểm cố định được `startedAt` mặc định.
 */
export function chuanHoaHoSo(than: unknown, bayGio: Date = new Date()): HoSo {
  const sai = (m: string): never => { throw new BadRequestError(m, 'CTL_HO_SO_SAI'); };
  if (!than || typeof than !== 'object' || Array.isArray(than)) sai('Hồ sơ phải là một đối tượng.');
  const t = than as Record<string, unknown>;

  if (!laNgonNgu(t.activeLang)) sai('activeLang phải là en, ja hoặc zh.');
  const activeLang = t.activeLang as NgonNgu;

  const vao = t.langs;
  if (!vao || typeof vao !== 'object' || Array.isArray(vao)) sai('langs phải là một đối tượng.');
  const langs: Partial<Record<NgonNgu, LuaChonNgonNgu>> = {};
  for (const [ma, gt] of Object.entries(vao as Record<string, unknown>)) {
    if (!laNgonNgu(ma)) sai(`Ngôn ngữ "${ma}" không hỗ trợ.`);
    const nn = ma as NgonNgu;
    if (!gt || typeof gt !== 'object' || Array.isArray(gt)) sai(`langs.${nn} phải là một đối tượng.`);
    const l = gt as Record<string, unknown>;
    if (typeof l.level !== 'string' || !TRINH_DO[nn].includes(l.level)) sai(`langs.${nn}.level không hợp lệ.`);
    if (typeof l.goal !== 'string' || !(MUC_TIEU as readonly string[]).includes(l.goal)) sai(`langs.${nn}.goal không hợp lệ.`);
    let target: string | null = null;
    if (l.target != null) {
      if (typeof l.target !== 'string' || !MOC_DICH[nn].includes(l.target)) sai(`langs.${nn}.target không hợp lệ.`);
      target = l.target as string;
    }
    const phut = Number(l.minutesPerDay);
    if (!(PHUT_MOI_NGAY as readonly number[]).includes(phut)) sai(`langs.${nn}.minutesPerDay phải là một trong ${PHUT_MOI_NGAY.join(', ')}.`);
    let startedAt = bayGio.toISOString();
    if (l.startedAt != null) {
      const d = typeof l.startedAt === 'string' ? new Date(l.startedAt) : null;
      if (!d || Number.isNaN(d.getTime())) sai(`langs.${nn}.startedAt không phải ngày hợp lệ.`);
      // Ngày tương lai (đồng hồ máy lệch) ⇒ kẹp về hiện tại, không từ chối cả hồ sơ.
      startedAt = (d!.getTime() > bayGio.getTime() ? bayGio : d!).toISOString();
    }
    langs[nn] = { level: l.level as string, goal: l.goal as LuaChonNgonNgu['goal'], target, minutesPerDay: phut, startedAt };
  }
  if (!langs[activeLang]) sai('Ngôn ngữ đang học phải có trong langs.');

  let reminder: string | null = null;
  if (t.reminder != null) {
    if (typeof t.reminder !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(t.reminder)) sai('reminder phải dạng HH:mm.');
    reminder = t.reminder as string;
  }
  return { activeLang, langs, reminder };
}

function raHoSo(r: { activeLang: string; langs: unknown; reminder: string | null; updatedAt: Date }): HoSo {
  return {
    activeLang: r.activeLang as NgonNgu,
    langs: (r.langs ?? {}) as HoSo['langs'],
    reminder: r.reminder,
    updatedAt: r.updatedAt.toISOString(),
  };
}

/** `null` = người này chưa từng lưu hồ sơ (app đẩy hồ sơ khách lên). */
export async function docHoSo(userId: number): Promise<HoSo | null> {
  const r = await prisma.ctLanguageProfile.findUnique({ where: { userId } });
  return r ? raHoSo(r) : null;
}

/** Ghi ĐÈ cả hồ sơ (app luôn gửi bản đầy đủ). */
export async function luuHoSo(userId: number, than: unknown): Promise<HoSo> {
  const h = chuanHoaHoSo(than);
  const data = { activeLang: h.activeLang, langs: h.langs as object, reminder: h.reminder };
  const r = await prisma.ctLanguageProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  return raHoSo(r);
}
