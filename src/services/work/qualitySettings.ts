/**
 * dm5 G3 (27/11/2026) — khoá cài đặt dự án của vùng KIỂM THỬ · REVIEW · UAT. Hàm thuần (test không cần DB).
 *
 *   settings.reviewChecklists   — mẫu checklist review CẤP DỰ ÁN (ngoài 12 mẫu dựng sẵn ở reviewRules.ts). Mỗi mẫu:
 *                                 { key "P_…", name, kind DOC|CODE, sections [{ name, items: string[] }] } — một ngôn ngữ
 *                                 (chữ người dùng gõ), ≤ 20 mẫu × 20 nhóm × 40 câu.
 *   settings.reviewCoolOffHours — "làm nguội": không đặt quyết định review trước N giờ kể từ lúc mở phiên
 *                                 (0/null = tắt, tối đa 72). Máy chủ chặn ⇒ 409 WORK_REVIEW_COOLOFF.
 *   settings.testGate           — 'block' ⇒ cycle PLANNED → IN_PROGRESS khi tiêu chí VÀO của Test Plan chưa đạt và Release
 *                                 version khi tiêu chí RA chưa đạt ⇒ 409 WORK_TEST_GATE · 'warn' ⇒ chỉ cảnh báo · null = tắt.
 *   settings.uatRevokeOnClose   — true ⇒ phiên UAT được DUYỆT thì thu hồi lời mời CLIENT còn treo + gỡ quyền cổng của
 *                                 người thử (khách duyệt phiên đó) không còn phiên duyệt nào đang chờ.
 *
 * projects.service › updateProject gọi `normalizeQualitySettings` đúng MỘT dòng (§4.5 kế hoạch dm5).
 */

import { BadRequestError } from '../../middleware/errorHandler.js';

export interface ProjectChecklist {
  key: string;
  name: string;
  kind: 'DOC' | 'CODE';
  sections: Array<{ name: string; items: string[] }>;
}

export const LIMITS = { checklists: 20, sections: 20, items: 40, itemChars: 1000, nameChars: 120 } as const;
export const MAX_COOL_OFF_HOURS = 72;
export const TEST_GATE_MODES = ['block', 'warn'] as const;
export type TestGateMode = (typeof TEST_GATE_MODES)[number];

const bad = (msg: string) => new BadRequestError(msg, 'WORK_BAD_SETTINGS');
const str = (v: unknown) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');

/** Khoá mẫu cấp dự án: "P_" + chữ HOA/số/_ (không bao giờ trùng mẫu dựng sẵn — mẫu dựng sẵn không có tiền tố P_). */
export function checklistKeyOf(name: string, taken: Set<string>): string {
  const base = `P_${name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'D').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 26) || 'CHECKLIST'}`;
  let k = base, i = 2;
  while (taken.has(k)) k = `${base.slice(0, 26)}_${i++}`;
  return k;
}

export function normalizeChecklists(raw: unknown): ProjectChecklist[] | null {
  if (raw === null) return null;
  if (!Array.isArray(raw)) throw bad('reviewChecklists must be a list');
  if (raw.length > LIMITS.checklists) throw bad(`At most ${LIMITS.checklists} project checklists`);
  const taken = new Set<string>();
  const out = raw.map((c, ci): ProjectChecklist => {
    const o = (c ?? {}) as Record<string, unknown>;
    const name = str(o.name).slice(0, LIMITS.nameChars);
    if (!name) throw bad(`Checklist ${ci + 1} needs a name`);
    const kind = o.kind === 'CODE' ? 'CODE' : 'DOC';
    const sectionsRaw = Array.isArray(o.sections) ? o.sections : [];
    if (!sectionsRaw.length) throw bad(`"${name}": add at least one section`);
    if (sectionsRaw.length > LIMITS.sections) throw bad(`"${name}": at most ${LIMITS.sections} sections`);
    const sections = sectionsRaw.map((s, si) => {
      const so = (s ?? {}) as Record<string, unknown>;
      const items = (Array.isArray(so.items) ? so.items : []).map((q) => str(q).slice(0, LIMITS.itemChars)).filter(Boolean);
      if (!items.length) throw bad(`"${name}" section ${si + 1}: add at least one question`);
      if (items.length > LIMITS.items) throw bad(`"${name}" section ${si + 1}: at most ${LIMITS.items} questions`);
      return { name: str(so.name).slice(0, LIMITS.nameChars) || `Section ${si + 1}`, items };
    });
    const wanted = str(o.key).toUpperCase();
    const key = /^P_[A-Z0-9_]{1,30}$/.test(wanted) && !taken.has(wanted) ? wanted : checklistKeyOf(name, taken);
    taken.add(key);
    return { key, name, kind, sections };
  });
  return out.length ? out : null;
}

export function normalizeCoolOff(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === '' || raw === 0) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > MAX_COOL_OFF_HOURS) throw bad(`reviewCoolOffHours must be between 0 and ${MAX_COOL_OFF_HOURS}`);
  return Math.round(n * 4) / 4 || null;
}

/** Chuẩn hoá các khoá G3 trong một bản vá settings; khoá không có trong bản vá thì không đụng. */
export function normalizeQualitySettings<T extends Record<string, unknown>>(settings: T): T {
  const s: Record<string, unknown> = { ...settings };
  if ('reviewChecklists' in s) s.reviewChecklists = normalizeChecklists(s.reviewChecklists);
  if ('reviewCoolOffHours' in s) s.reviewCoolOffHours = normalizeCoolOff(s.reviewCoolOffHours);
  if ('testGate' in s) s.testGate = (TEST_GATE_MODES as readonly unknown[]).includes(s.testGate) ? s.testGate : null;
  if ('uatRevokeOnClose' in s) s.uatRevokeOnClose = s.uatRevokeOnClose === true ? true : null;
  // Danh sách khách bị thu hồi quyền cổng (máy chủ tự ghi khi chốt UAT; ADMIN sửa tay được) — chỉ số nguyên dương.
  if ('portalRevokedUserIds' in s) s.portalRevokedUserIds = Array.isArray(s.portalRevokedUserIds) ? [...new Set((s.portalRevokedUserIds as unknown[]).filter((x): x is number => Number.isInteger(x) && (x as number) > 0))].slice(0, 500) : [];
  return s as T;
}

/** Đọc lại từ settings đã lưu (dữ liệu cũ/hỏng ⇒ mặc định, không ném). */
export function qualitySettingsOf(settings: unknown): { reviewChecklists: ProjectChecklist[]; reviewCoolOffHours: number | null; testGate: TestGateMode | null; uatRevokeOnClose: boolean } {
  const o = (settings ?? {}) as Record<string, unknown>;
  let lists: ProjectChecklist[] = [];
  try { lists = normalizeChecklists(o.reviewChecklists ?? null) ?? []; } catch { lists = []; }
  let cool: number | null = null;
  try { cool = normalizeCoolOff(o.reviewCoolOffHours); } catch { cool = null; }
  return {
    reviewChecklists: lists,
    reviewCoolOffHours: cool,
    testGate: (TEST_GATE_MODES as readonly unknown[]).includes(o.testGate) ? (o.testGate as TestGateMode) : null,
    uatRevokeOnClose: o.uatRevokeOnClose === true,
  };
}

/** Còn bao lâu mới được ra quyết định (ms; ≤ 0 = được rồi). */
export function coolOffRemainingMs(openedAt: Date, hours: number | null, now = new Date()): number {
  if (!hours) return 0;
  return +openedAt + hours * 3_600_000 - +now;
}
