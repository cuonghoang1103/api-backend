/**
 * CT Work — CHẾ ĐỘ ĐÓNG VAI (27/11/2026): MỘT tài khoản đóng đủ 5 vai C1–C5 của đồ án "một mình 5 vai"
 * (khoá `du-an-mot-minh-5-vai`). Trước đây bài học bắt tạo 5 tài khoản vì các luật tách quyền so theo NGƯỜI
 * (notAssignee — người được giao không tự chuyển; WORK_REVIEW_SELF — tác giả không tự duyệt).
 *
 * ─── THIẾT KẾ: vai đi THEO TỪNG YÊU CẦU (header `X-CTW-Vai: C3`), không lưu trạng thái ở máy chủ ───
 *   - 5 phiên CuongMini CLI chạy SONG SONG (C1 lập kế hoạch, C3 code, C5 test…) cùng một token: trạng thái
 *     "vai hiện tại" lưu ở máy chủ theo người × dự án thì phiên này đổi vai làm hỏng phiên kia. Header thì mỗi
 *     phiên một vai, không giẫm nhau.
 *   - Web nhớ vai theo dự án ở trình duyệt (localStorage) và gắn header vào mọi yêu cầu của dự án đó.
 *   - MCP: header `X-CTW-Vai` của kết nối HOẶC `params._meta["ctwork/vai"]` của từng `tools/call` (CLI đổi vai
 *     giữa phiên bằng `/vai` mà không phải nối lại).
 *   - Không có header / dự án không bật `settings.soloRoles.enabled` ⇒ không có vai ⇒ HÀNH VI CŨ (so theo người).
 *   - Token AI agent gửi vai ⇒ 403 `WORK_ROLE_AGENT`: vai là của NGƯỜI đóng, agent không đội mũ của ai.
 *
 * ─── TRUNG THỰC ───
 * Không có user giả. Mọi bản ghi vẫn mang userId thật; vai chỉ là thông tin THÊM (`acting_role`). Mọi chỗ hiển
 * thị / xuất ghi "Tên SV (vai C3 · BE)" + ghi chú "1 sinh viên đóng 5 vai" — không bao giờ trình bày như 5 người.
 *
 * Phần thuần (parseVai, luật tự duyệt, notAssignee theo vai, nhắc trái vai, tên theo vai) có test: vaiDong.test.ts.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { HAT_LABEL, HATS, isHat, type Hat } from './dm5g4Rules.js';

export { HATS, isHat, type Hat };

/** Tên ngắn của vai trong nhãn "C3 · BE". */
export const VAI_NGAN: Record<Hat, string> = { C1: 'PM', C2: 'BA', C3: 'BE', C4: 'FE', C5: 'QA' };
export const VAI_DAY_DU = HAT_LABEL;

/** "C3 · BE". */
export const nhanVai = (h: Hat): string => `${h} · ${VAI_NGAN[h]}`;

/** Ghi chú trung thực đi kèm mọi bản xuất của dự án bật chế độ đóng vai. */
export const SOLO_NOTE_EN = 'One student plays all 5 roles (C1 PM · C2 BA · C3 BE · C4 FE · C5 QA) on one account — roles are shown in brackets; they are not separate people.';
export const SOLO_NOTE_VI = '1 sinh viên đóng cả 5 vai (C1 PM · C2 BA · C3 BE · C4 FE · C5 QA) trên một tài khoản — vai ghi trong ngoặc, không phải 5 người khác nhau.';

/** "Nguyễn Văn A (role C3 · BE)" / "(vai C3 · BE)". Không có vai ⇒ tên giữ nguyên. */
export function tenTheoVai(name: string, hat: Hat | null | undefined, lang: 'vi' | 'en' = 'en'): string {
  if (!name || !hat) return name;
  return `${name} (${lang === 'vi' ? 'vai' : 'role'} ${nhanVai(hat)})`;
}

/**
 * Chuỗi người dùng gõ ⇒ vai. Nhận "C3", "c3", "3", "BE", "backend", "QA"… Rỗng ⇒ null (không có vai).
 * Không nhận ra ⇒ 'INVALID' (tầng gọi trả 400, không lặng lẽ bỏ — gõ nhầm "C6" mà chạy như không có vai thì
 * luật tách quyền đổi nghĩa mà người dùng không biết).
 */
export function parseVai(raw: unknown): Hat | null | 'INVALID' {
  if (raw === undefined || raw === null) return null;
  const s = String(Array.isArray(raw) ? raw[0] : raw).trim().toUpperCase();
  if (!s || s === 'NONE' || s === 'OFF' || s === '-') return null;
  const m = /^C?([1-5])\b/.exec(s);
  if (m) return `C${m[1]}` as Hat;
  const BY_NAME: Record<string, Hat> = {
    PM: 'C1', LEADER: 'C1', LEAD: 'C1', BA: 'C2', BE: 'C3', BACKEND: 'C3', 'DEV BE': 'C3', FE: 'C4', FRONTEND: 'C4', 'DEV FE': 'C4', QA: 'C5', TEST: 'C5', TESTER: 'C5',
  };
  return BY_NAME[s] ?? 'INVALID';
}

// ─── Cấu hình dự án ──────────────────────────────────────────────

export interface SoloRolesSettings { enabled: boolean }

export function soloRolesOf(settings: unknown): SoloRolesSettings {
  const r = (settings as { soloRoles?: { enabled?: unknown } } | null | undefined)?.soloRoles;
  return { enabled: r?.enabled === true };
}

/** Chuẩn hoá khoá `soloRoles` của settings (updateProject gọi). Thiếu khoá ⇒ không đụng. */
export function normalizeSoloSettings(settings: Record<string, unknown>): Record<string, unknown> {
  if (!('soloRoles' in settings)) return settings;
  const raw = settings.soloRoles as { enabled?: unknown } | null | undefined;
  return { ...settings, soloRoles: raw && raw.enabled === true ? { enabled: true } : null };
}

// ─── Luật tách quyền theo vai (thuần) ────────────────────────────

/**
 * Tác giả có được tự ra quyết định / đóng phiên review của mình không?
 * Chỉ khi: có vai đang đóng, mọi dòng AUTHOR của người này đều GHI vai, và không dòng nào trùng vai đang đóng.
 * (Dòng AUTHOR không ghi vai = phiên cũ / mở không có vai ⇒ vẫn chặn như trước — không suy đoán.)
 */
export function tacGiaDuocDuyet(authorHats: Array<string | null>, vai: Hat | null): boolean {
  if (!vai || !authorHats.length) return false;
  return authorHats.every((h) => isHat(h) && h !== vai);
}

/**
 * notAssignee theo vai: thẻ ghi vai được giao (trường Role C1–C5 / nhãn C1…C5). Người được giao đang đóng
 * ĐÚNG vai đó ⇒ chặn; đóng vai KHÁC ⇒ cho. Thẻ không ghi vai ⇒ chặn kèm gợi ý đặt Role (không đoán từ tiêu đề).
 */
export function notAssigneeTheoVai(cardHat: Hat | null, vai: Hat | null): 'allow' | 'same-role' | 'no-card-role' | 'no-role' {
  if (!vai) return 'no-role';
  if (!cardHat) return 'no-card-role';
  return cardHat === vai ? 'same-role' : 'allow';
}

/** Vai thường làm loại việc này. Khoá = đường REST (sau /projects/:pid) hoặc tên lệnh MCP. */
const VIEC_CUA_VAI: Array<{ re: RegExp; vai: Hat[] }> = [
  { re: /(^|\/|_)(tests?|test-cases|test-cycles|test-runs|test-plans|test-designs|fpt-unit|fpt-it|fpt_unit|fpt_it|uat|exploratory|defects?)(\/|_|$)/i, vai: ['C5'] },
  { re: /(^|\/|_)(srs|swr|requirements?|use-cases?|glossary|stakeholders?|elicitation|system-messages?|system_message|qna|surveys?)(\/|_|$)/i, vai: ['C2', 'C1'] },
  { re: /(^|\/|_)(sprints?|planning|raid|change-requests|change_requests?|meetings?|wbs|weekly|retro|stages|capacity|poker)(\/|_|$)/i, vai: ['C1'] },
];

/**
 * Nhắc NHẸ khi thao tác trái vai (không chặn): trả các vai thường làm việc này, hoặc null nếu đang đúng vai /
 * việc không thuộc vai cụ thể nào. Chỉ áp cho lệnh ghi.
 */
export function nhacTraiVai(khoa: string, vai: Hat | null, ghi = true): Hat[] | null {
  if (!vai || !ghi) return null;
  const hit = VIEC_CUA_VAI.find((x) => x.re.test(khoa));
  if (!hit || hit.vai.includes(vai)) return null;
  return hit.vai;
}

export function cauNhacTraiVai(vai: Hat, dung: Hat[]): string {
  return `Role note: you are acting as ${nhanVai(vai)}, but this kind of work usually belongs to ${dung.map(nhanVai).join(' / ')}. Switch role if that is what you are doing (it is recorded on the change).`;
}

/** Gợi ý ngắn cho trợ lý AI (CuongMini CLI / Ask AI) theo vai đang đóng. */
export const GOI_Y_VAI: Record<Hat, string> = {
  C1: 'You support the student acting as C1 PM / Leader: plan sprints, WBS, risks (RAID), change requests, meetings and the weekly report. Keep scope and dates honest; do not write production code.',
  C2: 'You support the student acting as C2 BA: requirements, use cases, business rules, system messages, glossary, Q&A. Ask for missing acceptance criteria; trace every requirement.',
  C3: 'You support the student acting as C3 Dev BE: backend code, APIs, database, unit tests. Link work to the issue, keep PRs small, never approve your own work.',
  C4: 'You support the student acting as C4 Dev FE: screens, UI states, validation messages, accessibility, front-end tests. Match the screen names in the SRS.',
  C5: 'You support the student acting as C5 QA: test design, test cases, test runs, defects, UAT and review decisions. Be independent from the author — question, verify, record evidence.',
};

// ─── Ngữ cảnh một yêu cầu (AsyncLocalStorage) ────────────────────

interface VaiCtx { vai: Hat | null; solo: Map<number, boolean> }
const store = new AsyncLocalStorage<VaiCtx>();

/** Chạy phần còn lại của yêu cầu với vai đã chọn (đã kiểm hợp lệ + không phải agent ở tầng gọi). */
export function chayVoiVai<T>(vai: Hat | null, fn: () => T): T {
  return store.run({ vai, solo: new Map() }, fn);
}

/** Vai NGƯỜI GỌI khai cho yêu cầu này (chưa xét dự án có bật chế độ hay không). */
export function vaiYeuCau(): Hat | null {
  return store.getStore()?.vai ?? null;
}

/** Dự án có bật chế độ đóng vai không (đệm theo yêu cầu). */
export async function soloBat(projectId: number): Promise<boolean> {
  const ctx = store.getStore();
  const hit = ctx?.solo.get(projectId);
  if (hit !== undefined) return hit;
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true } });
  const on = soloRolesOf(p?.settings).enabled;
  ctx?.solo.set(projectId, on);
  return on;
}

/**
 * Vai ĐANG ĐÓNG trong dự án này cho yêu cầu hiện tại: có vai khai + dự án bật chế độ. Còn lại ⇒ null (hành vi cũ).
 */
export async function vaiDangDong(projectId: number | null | undefined): Promise<Hat | null> {
  const vai = vaiYeuCau();
  if (!vai || !projectId) return null;
  return (await soloBat(projectId)) ? vai : null;
}

/** `{ actingRole }` để rải vào `data` của bản ghi (rỗng khi không có vai). */
export async function vaiGhi(projectId: number | null | undefined): Promise<{ actingRole?: Hat }> {
  const v = await vaiDangDong(projectId);
  return v ? { actingRole: v } : {};
}

/** Kiểm vai từ header / tham số — dùng chung REST + MCP. `isAgent` ⇒ có vai là lỗi. */
export function kiemVaiKhai(raw: unknown, isAgent: boolean): Hat | null {
  const v = parseVai(raw);
  if (v === 'INVALID') throw new AppError('The acting role must be C1, C2, C3, C4 or C5 (or empty for none)', 400, 'WORK_BAD_ROLE');
  if (v && isAgent) throw new AppError('An AI agent token cannot act in a person\'s role (C1–C5) — roles belong to the student who plays them', 403, 'WORK_ROLE_AGENT');
  return v;
}

// ─── Vai được giao của một thẻ ───────────────────────────────────

type Db = Pick<typeof prisma, 'workCustomField' | 'workCustomValue' | 'workIssueLabel'>;
const ROLE_FIELD_RE = /^(role|vai)\b/i;

/** Vai ghi trên thẻ: trường Role (C1–C5) của dự án > nhãn C1…C5. Không có ⇒ null (không đoán). */
export async function vaiCuaThe(db: Db, projectId: number, issueId: number): Promise<Hat | null> {
  const fields = await db.workCustomField.findMany({ where: { projectId, kind: 'SELECT' }, select: { id: true, name: true, options: true } });
  const f = fields.find((x) => ROLE_FIELD_RE.test(x.name.trim()));
  if (f) {
    const v = await db.workCustomValue.findFirst({ where: { issueId, fieldId: f.id }, select: { value: true } });
    if (typeof v?.value === 'string') {
      const opt = (Array.isArray(f.options) ? f.options as Array<{ id?: string; label?: string }> : []).find((o) => o.id === v.value);
      const hat = parseVai(opt?.label ?? v.value);
      if (hat && hat !== 'INVALID') return hat;
    }
  }
  const labels = await db.workIssueLabel.findMany({ where: { issueId }, select: { label: { select: { name: true } } } });
  const hat = labels.map((l) => l.label.name.trim().toUpperCase()).find(isHat);
  return hat ?? null;
}

/** Vai được giao của nhiều thẻ (bản xuất). */
export async function vaiCuaNhieuThe(projectId: number, issueIds: number[]): Promise<Map<number, Hat>> {
  const out = new Map<number, Hat>();
  if (!issueIds.length) return out;
  const fields = await prisma.workCustomField.findMany({ where: { projectId, kind: 'SELECT' }, select: { id: true, name: true, options: true } });
  const f = fields.find((x) => ROLE_FIELD_RE.test(x.name.trim()));
  if (f) {
    const opts = Array.isArray(f.options) ? f.options as Array<{ id?: string; label?: string }> : [];
    const vals = await prisma.workCustomValue.findMany({ where: { fieldId: f.id, issueId: { in: issueIds } }, select: { issueId: true, value: true } });
    for (const v of vals) {
      if (typeof v.value !== 'string') continue;
      const hat = parseVai(opts.find((o) => o.id === v.value)?.label ?? v.value);
      if (hat && hat !== 'INVALID') out.set(v.issueId, hat);
    }
  }
  const rest = issueIds.filter((id) => !out.has(id));
  if (rest.length) {
    const labels = await prisma.workIssueLabel.findMany({ where: { issueId: { in: rest } }, select: { issueId: true, label: { select: { name: true } } } });
    for (const l of labels) {
      const n = l.label.name.trim().toUpperCase();
      if (isHat(n) && !out.has(l.issueId)) out.set(l.issueId, n);
    }
  }
  return out;
}
