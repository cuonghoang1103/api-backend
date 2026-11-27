/**
 * CT Work — dm5 G4 (27/11/2026): phần THUẦN (không DB, không mạng) của gói "Code, phát hành, báo cáo theo vai, CR/RAID".
 * Test: dm5g4Rules.test.ts.
 *
 *   hatOf / roleWeekly         — C5: giờ theo "mũ" C1–C5 (một người đóng 5 vai), % mỗi vai/tuần + cảnh báo QA < x% / tổng > y giờ
 *   freezeVerdict              — D14: Feature / Code / Hard freeze của version
 *   ciOfSha                    — D14: trạng thái CI ở commit được tag (khớp headSha của PR)
 *   criticize / stripCode      — D11: chế độ "chỉ phản biện" — gỡ mọi khối mã khỏi đầu ra AI, ép gợi ý thành câu hỏi gợi mở
 *   branchFlags / prFlags      — D12: nhánh sống > N ngày, PR > N dòng
 *   repoHealthOf               — D13: 5 mục vệ sinh repo
 *   cleanImpactMatrix / cleanCrOptions / cleanSyncChecklist / childCrKey — C8
 *   normalizeG4Settings        — khoá settings của G4 (aiReviewMode, present, roleAlert, codeHealth, releaseRequireGreenCi)
 */

import type { CodeFinding, CodeReviewResult } from './codeReviewRules.js';

// ═══ C5 — mũ vai ════════════════════════════════════════════════════

export const HATS = ['C1', 'C2', 'C3', 'C4', 'C5'] as const;
export type Hat = (typeof HATS)[number];
export const HAT_LABEL: Record<Hat, string> = { C1: 'PM / Leader', C2: 'BA', C3: 'Dev BE', C4: 'Dev FE', C5: 'QA' };
export const isHat = (v: unknown): v is Hat => typeof v === 'string' && (HATS as readonly string[]).includes(v);

const LABEL_HAT: Record<string, Hat> = { PM: 'C1', LEADER: 'C1', BA: 'C2', BE: 'C3', BACKEND: 'C3', FE: 'C4', FRONTEND: 'C4', QA: 'C5', TEST: 'C5', TESTER: 'C5' };
const FE_WORDS = /\b(fe|ui|ux|frontend|front-end|react|jsp|html|css|giao diện|màn hình|screen)\b/i;

/**
 * Suy mũ của một lần ghi giờ: chọn tay (hat) > nhãn C1…C5 / PM·BA·BE·FE·QA của thẻ > activity (TimeLogs) + nhãn/tiêu đề.
 * Training ⇒ C1 (lập kế hoạch, học) · Analyzing ⇒ C2 · Designing ⇒ C2 (UI ⇒ C4) · Coding/Deploying ⇒ C3 (UI ⇒ C4) · Testing ⇒ C5.
 */
export function hatOf(x: { hat?: string | null; activity?: string | null; labels?: string[]; title?: string; typeKey?: string }): { hat: Hat; source: 'set' | 'label' | 'activity' } {
  if (isHat(x.hat)) return { hat: x.hat, source: 'set' };
  const labels = (x.labels ?? []).map((l) => l.trim().toUpperCase());
  const direct = labels.find(isHat);
  if (direct) return { hat: direct, source: 'label' };
  const byName = labels.map((l) => LABEL_HAT[l]).find(Boolean);
  if (byName) return { hat: byName, source: 'label' };
  const fe = labels.includes('FE') || FE_WORDS.test(x.title ?? '');
  const act = (x.activity ?? '').toLowerCase();
  if (x.typeKey === 'TEST' || act === 'testing') return { hat: 'C5', source: 'activity' };
  if (act === 'training') return { hat: 'C1', source: 'activity' };
  if (act === 'analyzing') return { hat: 'C2', source: 'activity' };
  if (act === 'designing') return { hat: fe ? 'C4' : 'C2', source: 'activity' };
  return { hat: fe ? 'C4' : 'C3', source: 'activity' };
}

export interface RoleAlertSettings { qaMinPct: number; maxWeekHours: number }
export const ROLE_ALERT_DEFAULT: RoleAlertSettings = { qaMinPct: 15, maxWeekHours: 30 };

const VN_MS = 7 * 3_600_000;
/** Thứ Hai (giờ VN) của thời điểm `d`, dạng YYYY-MM-DD. */
export function vnMonday(d: Date): string {
  const vn = new Date(d.getTime() + VN_MS);
  const dow = vn.getUTCDay();
  const mon = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - ((dow + 6) % 7) * 86_400_000);
  return mon.toISOString().slice(0, 10);
}
const h2 = (min: number) => Math.round((min / 60) * 100) / 100;

export interface RoleWeek {
  weekStart: string; totalHours: number; hours: Record<Hat, number>; pct: Record<Hat, number>;
  alerts: Array<{ code: 'QA_LOW' | 'OVER_HOURS'; message: string }>;
}

/** Bảng "Giờ theo vai/tuần": mỗi tuần (thứ Hai giờ VN) × 5 mũ, % theo tổng tuần, cảnh báo theo ngưỡng. */
export function roleWeekly(logs: Array<{ minutes: number; startedAt: Date; hat: Hat }>, alert: RoleAlertSettings = ROLE_ALERT_DEFAULT) {
  const weeks = new Map<string, Record<Hat, number>>();
  const total: Record<Hat, number> = { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 };
  for (const l of logs) {
    const w = vnMonday(l.startedAt);
    const row = weeks.get(w) ?? { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 };
    row[l.hat] += l.minutes;
    total[l.hat] += l.minutes;
    weeks.set(w, row);
  }
  const pctOf = (row: Record<Hat, number>) => {
    const sum = HATS.reduce((a, h) => a + row[h], 0);
    return Object.fromEntries(HATS.map((h) => [h, sum ? Math.round((row[h] / sum) * 1000) / 10 : 0])) as Record<Hat, number>;
  };
  const out: RoleWeek[] = [...weeks.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([weekStart, row]) => {
    const sumMin = HATS.reduce((a, h) => a + row[h], 0);
    const pct = pctOf(row);
    const alerts: RoleWeek['alerts'] = [];
    if (sumMin > 0 && pct.C5 < alert.qaMinPct) alerts.push({ code: 'QA_LOW', message: `QA (C5) is ${pct.C5}% of the week — below ${alert.qaMinPct}%` });
    if (h2(sumMin) > alert.maxWeekHours) alerts.push({ code: 'OVER_HOURS', message: `${h2(sumMin)}h logged this week — above ${alert.maxWeekHours}h (C1–C5 are a split of your real hours, not extra hours)` });
    return { weekStart, totalHours: h2(sumMin), hours: Object.fromEntries(HATS.map((h) => [h, h2(row[h])])) as Record<Hat, number>, pct, alerts };
  });
  const sumAll = HATS.reduce((a, h) => a + total[h], 0);
  return {
    hats: HATS.map((h) => ({ hat: h, label: HAT_LABEL[h] })),
    weeks: out,
    totals: { totalHours: h2(sumAll), hours: Object.fromEntries(HATS.map((h) => [h, h2(total[h])])) as Record<Hat, number>, pct: pctOf(total) },
    thresholds: alert,
  };
}

// ═══ D14 — đóng băng version ════════════════════════════════════════

export const FREEZE_LEVELS = ['NONE', 'FEATURE', 'CODE', 'HARD'] as const;
export type FreezeLevel = (typeof FREEZE_LEVELS)[number];
const FEATURE_TYPES = new Set(['REQUIREMENT', 'STORY', 'EPIC']);

/**
 * Thẻ được vào (tạo mới trong / gắn vào) version đang đóng băng không:
 *   FEATURE ⇒ chặn Requirement / Story / Epic (tính năng mới); việc khác (Task, Bug, Test) vẫn vào.
 *   CODE    ⇒ chỉ Bug ưu tiên P0–P1 (priority 1–2 của CT Work: Highest/High).
 *   HARD    ⇒ không thẻ nào.
 * ADMIN dự án được vượt (override = true ⇒ service ghi audit).
 */
export function freezeVerdict(level: string | null | undefined, x: { typeKey: string; priority: number; isAdmin: boolean }): { ok: true; override: boolean } | { ok: false; reason: string } {
  const lv = (FREEZE_LEVELS as readonly string[]).includes(level ?? '') ? (level as FreezeLevel) : 'NONE';
  let reason: string | null = null;
  if (lv === 'FEATURE' && FEATURE_TYPES.has(x.typeKey)) reason = 'Feature freeze: no new requirements or stories in this version — raise a change request or plan it for the next version';
  if (lv === 'CODE' && !(x.typeKey === 'BUG' && x.priority <= 2)) reason = 'Code freeze: only P0–P1 bugs (priority Highest/High) may go into this version';
  if (lv === 'HARD') reason = 'Hard freeze: this version is locked — nothing can be added';
  if (!reason) return { ok: true, override: false };
  if (x.isAdmin) return { ok: true, override: true };
  return { ok: false, reason };
}

/** CI ở commit được tag: PR có headSha khớp (đủ 7+ ký tự đầu). Nhiều PR ⇒ lấy lần chạy mới nhất. */
export function ciOfSha(sha: string | null | undefined, pulls: Array<{ headSha: string | null; ciState: string | null; ciUrl?: string | null; ciAt?: Date | null; number: number }>) {
  const s = (sha ?? '').trim().toLowerCase();
  if (s.length < 7) return { state: 'unknown' as const, pr: null, url: null };
  const hits = pulls.filter((p) => p.headSha && (p.headSha.toLowerCase().startsWith(s) || s.startsWith(p.headSha.toLowerCase())) && p.ciState);
  hits.sort((a, b) => (b.ciAt?.getTime() ?? 0) - (a.ciAt?.getTime() ?? 0));
  const h = hits[0];
  if (!h) return { state: 'unknown' as const, pr: null, url: null };
  const state = (['success', 'failure', 'pending', 'neutral'] as const).find((x) => x === h.ciState) ?? 'unknown';
  return { state, pr: h.number, url: h.ciUrl ?? null };
}

export const GIT_TAG_RE = /^[A-Za-z0-9][A-Za-z0-9._\-/]{0,99}$/;
export const SHA_RE = /^[0-9a-f]{7,64}$/i;

/** Dòng đầu release notes: tag + SHA + CI (mã viết, không để AI đoán). */
export function releaseHeader(v: { name: string; gitTag: string | null; commitSha: string | null; releaseCi?: string | null }): string {
  const bits = [v.gitTag ? `Tag \`${v.gitTag}\`` : null, v.commitSha ? `commit \`${v.commitSha.slice(0, 12)}\`` : null, v.releaseCi && v.releaseCi !== 'unknown' ? `CI ${v.releaseCi}` : null].filter(Boolean);
  return bits.length ? `> ${v.name} · ${bits.join(' · ')}` : '';
}

// ═══ D11 — AI chỉ phản biện ═════════════════════════════════════════

const FENCE = /```[\s\S]*?(```|$)/g;
/** Dòng trông như mã (thụt ≥ 4 dấu cách, hoặc kết thúc bằng ; { } và có ký hiệu lập trình). */
const CODE_LINE = /^( {4,}|\t)\S|[;{}]\s*$/;

/** Gỡ khối mã ``` … ``` và dòng mã thụt lề; mã nội dòng `x` ngắn (tên hàm, biến) được giữ. Trả về chữ đã gỡ + có gỡ gì không. */
export function stripCode(s: string | null | undefined): { text: string; hadCode: boolean } {
  if (!s) return { text: '', hadCode: false };
  let had = false;
  let t = s.replace(FENCE, () => { had = true; return ' '; });
  t = t.split('\n').filter((line) => {
    const code = CODE_LINE.test(line) && /[=();<>]/.test(line);
    if (code) had = true;
    return !code;
  }).join('\n');
  t = t.replace(/`([^`\n]{41,})`/g, () => { had = true; return '…'; });
  return { text: t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(), hadCode: had };
}

const QUESTION: Record<CodeFinding['category'], [en: string, vi: string]> = {
  correctness: ['What happens here with an empty, duplicated or boundary input? How would you prove the fix with a test?', 'Chuyện gì xảy ra ở đây khi đầu vào rỗng, trùng hoặc ở biên? Em chứng minh bản sửa bằng test nào?'],
  security: ['Who can reach this code and with what input? Which check (permission, validation, parameter binding) is missing?', 'Ai gọi được đoạn này và với đầu vào nào? Thiếu chốt nào (phân quyền, kiểm đầu vào, tham số hoá)?'],
  style: ['Would a teammate understand this name/structure in 6 months? What would make it clearer?', 'Sáu tháng nữa người khác đọc tên/cấu trúc này có hiểu không? Đổi thế nào cho rõ?'],
  tests: ['Which test case (happy, empty, boundary, conflict) would fail today? Can you write it before fixing?', 'Ca test nào (đúng, rỗng, biên, xung đột) sẽ đỏ hôm nay? Em viết test đó trước khi sửa được không?'],
  requirements: ['Which acceptance criterion does this change satisfy, and where is the evidence?', 'Thay đổi này đáp ứng tiêu chí "Xong khi" nào, bằng chứng ở đâu?'],
};

/**
 * Chế độ "chỉ phản biện" (mentor): không có dòng mã nào trong đầu ra; mỗi gợi ý thành câu hỏi gợi mở để sinh viên tự sửa.
 * Gợi ý gốc không có mã và đã là câu hỏi ⇒ giữ; có mã / là chỉ thị ⇒ thay bằng câu hỏi theo loại phát hiện.
 */
export function criticize(r: CodeReviewResult, language: 'vi' | 'en'): CodeReviewResult & { codeRemoved: number } {
  const i = language === 'vi' ? 1 : 0;
  let removed = 0;
  const clean = (s: string | null | undefined) => {
    const x = stripCode(s);
    if (x.hadCode) removed++;
    return x;
  };
  const findings = r.findings.map((f) => {
    const msg = clean(f.message);
    const sug = clean(f.suggestion);
    const asQuestion = !sug.hadCode && sug.text && /\?\s*$/.test(sug.text) ? sug.text : QUESTION[f.category][i];
    return { ...f, message: msg.text || f.message.replace(/`/g, ''), suggestion: asQuestion };
  });
  return {
    ...r,
    summary: clean(r.summary).text,
    findings,
    nextSteps: r.nextSteps.map((s) => clean(s).text).filter(Boolean),
    acceptance: r.acceptance.map((a) => ({ ...a, evidence: a.evidence ? clean(a.evidence).text || null : null })),
    codeRemoved: removed,
  };
}

export const CRITIC_RULES = `MENTOR MODE ("critic only") — the student must write every fix themselves:
- NEVER write code, patches, diffs, snippets or pseudo-code, not even one line. No \`\`\` blocks.
- "suggestion" must be ONE guiding question that leads the student to find the fix (e.g. "What happens when two users book the same slot at the same time?").
- You may name files, functions and variables in plain words.`;

// ═══ D12 / D13 — sức khoẻ code ══════════════════════════════════════

export interface CodeHealthSettings { branchMaxDays: number; prMaxLines: number }
export const CODE_HEALTH_DEFAULT: CodeHealthSettings = { branchMaxDays: 3, prMaxLines: 400 };
const DAY = 86_400_000;

/** Nhánh sống quá N ngày (tính từ lần đầu CT Work thấy nhánh) mà chưa xoá / chưa merge — nhánh mặc định không tính. */
export function branchFlags(b: { name: string; createdAt: Date; deleted: boolean; merged: boolean }, defaultBranch: string | null, s: CodeHealthSettings, now = new Date()) {
  const ageDays = Math.floor((now.getTime() - b.createdAt.getTime()) / DAY);
  const isDefault = !!defaultBranch && b.name === defaultBranch || ['main', 'master', 'develop', 'dev'].includes(b.name);
  return { ageDays, stale: !b.deleted && !b.merged && !isDefault && ageDays > s.branchMaxDays };
}

/** PR quá N dòng đổi (thêm + xoá). */
export function prFlags(p: { additions: number | null; deletions: number | null }, s: CodeHealthSettings) {
  const lines = (p.additions ?? 0) + (p.deletions ?? 0);
  return { lines, large: lines > s.prMaxLines };
}

export type HealthState = 'ok' | 'missing' | 'unknown';
export interface RepoHealthItem { key: 'gitignore' | 'envExample' | 'prTemplate' | 'ci' | 'branchProtection'; state: HealthState; detail: string }

/** 5 mục vệ sinh repo. `paths` = tên tệp ở gốc + trong .github (+ .github/workflows); protection null = không đọc được. */
export function repoHealthOf(x: { rootFiles: string[]; githubFiles: string[]; workflowFiles: string[]; protection: boolean | null; defaultBranch: string; readable: boolean }): RepoHealthItem[] {
  if (!x.readable) {
    return (['gitignore', 'envExample', 'prTemplate', 'ci', 'branchProtection'] as const).map((key) => ({ key, state: 'unknown' as const, detail: 'Could not read the repository (token missing or no access)' }));
  }
  const root = new Set(x.rootFiles.map((f) => f.toLowerCase()));
  const gh = new Set(x.githubFiles.map((f) => f.toLowerCase()));
  const envFile = [...root].find((f) => /^\.env\.(example|sample|template)$/.test(f));
  const prTpl = gh.has('pull_request_template.md') || root.has('pull_request_template.md') || gh.has('pull_request_template');
  const ci = x.workflowFiles.filter((f) => /\.ya?ml$/i.test(f));
  return [
    { key: 'gitignore', state: root.has('.gitignore') ? 'ok' : 'missing', detail: root.has('.gitignore') ? '.gitignore found' : 'Add a .gitignore (target/, node_modules/, .env, *.log…)' },
    { key: 'envExample', state: envFile ? 'ok' : 'missing', detail: envFile ? `${envFile} found` : 'Add .env.example with every variable name (no real secrets)' },
    { key: 'prTemplate', state: prTpl ? 'ok' : 'missing', detail: prTpl ? 'Pull request template found' : 'Add .github/pull_request_template.md (issue key, what changed, how tested)' },
    { key: 'ci', state: ci.length ? 'ok' : 'missing', detail: ci.length ? `CI workflow: ${ci.slice(0, 3).join(', ')}` : 'Add a CI workflow under .github/workflows (build + test on every PR)' },
    {
      key: 'branchProtection', state: x.protection === null ? 'unknown' : x.protection ? 'ok' : 'missing',
      detail: x.protection === null ? `Cannot read branch protection of ${x.defaultBranch} — the token needs the "Administration: read" permission`
        : x.protection ? `${x.defaultBranch} is protected` : `Protect ${x.defaultBranch}: require a pull request + green CI before merge`,
    },
  ];
}

// ═══ C8 — CR có cấu trúc ════════════════════════════════════════════

export const IMPACT_DIMENSIONS = ['scope', 'schedule', 'cost', 'quality', 'risk', 'docs'] as const;
export type ImpactDim = (typeof IMPACT_DIMENSIONS)[number];
export const IMPACT_LEVELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH'] as const;
export type ImpactMatrix = Record<ImpactDim, { level: (typeof IMPACT_LEVELS)[number]; note: string | null }>;

const strCap = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

export function cleanImpactMatrix(raw: unknown): ImpactMatrix | null {
  if (raw === null || raw === undefined || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const out = {} as ImpactMatrix;
  let any = false;
  for (const d of IMPACT_DIMENSIONS) {
    const v = (o[d] && typeof o[d] === 'object' ? o[d] : {}) as Record<string, unknown>;
    const level = (IMPACT_LEVELS as readonly string[]).includes(String(v.level ?? '').toUpperCase()) ? String(v.level).toUpperCase() as ImpactMatrix[ImpactDim]['level'] : 'NONE';
    const note = strCap(v.note, 1000);
    if (level !== 'NONE' || note) any = true;
    out[d] = { level, note };
  }
  return any ? out : null;
}

/** Mức ảnh hưởng chung = chiều nặng nhất. */
export function impactOverall(m: ImpactMatrix | null): (typeof IMPACT_LEVELS)[number] {
  if (!m) return 'NONE';
  return IMPACT_DIMENSIONS.reduce<(typeof IMPACT_LEVELS)[number]>((acc, d) => (IMPACT_LEVELS.indexOf(m[d].level) > IMPACT_LEVELS.indexOf(acc) ? m[d].level : acc), 'NONE');
}

export interface CrOption { key: 'A' | 'B' | 'C'; title: string; effortDays: number | null; pros: string | null; cons: string | null; chosen: boolean }
export function cleanCrOptions(raw: unknown): CrOption[] | null {
  if (!Array.isArray(raw)) return null;
  const keys = ['A', 'B', 'C'] as const;
  const out: CrOption[] = [];
  for (const x of raw.slice(0, 10)) {
    if (out.length >= 3) break;
    const o = (x && typeof x === 'object' ? x : {}) as Record<string, unknown>;
    const title = strCap(o.title, 200);
    if (!title) continue;
    const e = typeof o.effortDays === 'number' && Number.isFinite(o.effortDays) ? Math.max(0, Math.min(1000, Math.round(o.effortDays * 10) / 10)) : null;
    out.push({ key: keys[out.length], title, effortDays: e, pros: strCap(o.pros, 1000), cons: strCap(o.cons, 1000), chosen: o.chosen === true });
  }
  // Chỉ một phương án được chọn: giữ cái chọn đầu tiên.
  let seen = false;
  for (const o of out) { if (o.chosen && !seen) seen = true; else o.chosen = false; }
  return out.length ? out : null;
}

export const SYNC_ITEMS = ['srsRoc', 'trackingQna', 'trackingIssues', 'trackingWbs', 'rtm'] as const;
export type SyncItem = (typeof SYNC_ITEMS)[number];
export const SYNC_LABEL: Record<SyncItem, string> = {
  srsRoc: 'SRS/SDS Record of Changes updated (A/M/D row)',
  trackingQna: 'Project Tracking › Q&A updated (question closed / answer linked)',
  trackingIssues: 'Project Tracking › Issues updated (risk/issue linked to the CR)',
  trackingWbs: 'Project Tracking › WBS updated (new / changed functions + effort)',
  rtm: 'RTM updated (UC/BR ↔ test cases re-linked, affected tests marked for re-run)',
};
export function cleanSyncChecklist(raw: unknown, prev: unknown, userId: number, now = new Date()) {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const p = (prev && typeof prev === 'object' ? prev : {}) as Record<string, unknown>;
  const items = Object.fromEntries(SYNC_ITEMS.map((k) => [k, typeof o[k] === 'boolean' ? o[k] : p[k] === true])) as Record<SyncItem, boolean>;
  return { ...items, note: strCap(o.note, 1000) ?? (typeof p.note === 'string' ? p.note : null), updatedAt: now.toISOString(), updatedById: userId };
}
export const syncDone = (c: unknown) => SYNC_ITEMS.filter((k) => (c as Record<string, unknown> | null)?.[k] === true).length;

/** CR con thứ i (0-based) của CR-n ⇒ "CR-na", "CR-nb"… */
export function childCrKey(parentNumber: number, index: number): string {
  let s = '';
  let n = index;
  do { s = String.fromCharCode(97 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return `CR-${parentNumber}${s}`;
}

// ═══ Khoá settings của G4 ════════════════════════════════════════════

export interface PresentSettings { durationMin: number; marks: Array<{ atMin: number; label: string }>; planBUrl: string | null; planBLabel: string | null }
export const PRESENT_DEFAULT: PresentSettings = {
  durationMin: 15,
  marks: [{ atMin: 2, label: 'Problem & scope' }, { atMin: 7, label: 'Live demo' }, { atMin: 11, label: 'Design & tests' }, { atMin: 14, label: 'Wrap-up' }],
  planBUrl: null, planBLabel: null,
};

const num = (v: unknown, min: number, max: number, d: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : d);
const httpsUrl = (v: unknown) => (typeof v === 'string' && /^https?:\/\/[^\s]{3,}$/i.test(v.trim()) ? v.trim().slice(0, 500) : null);

/**
 * Chuẩn hoá các khoá settings của G4 trong PATCH /projects/:pid (chỉ khoá CÓ MẶT mới bị chạm; null = xoá về mặc định).
 *   aiReviewMode: 'critic' | 'full' · present · roleAlert · codeHealth · releaseRequireGreenCi
 */
export function normalizeG4Settings(input: Record<string, unknown>): Record<string, unknown> {
  const s = { ...input };
  if ('aiReviewMode' in s) s.aiReviewMode = s.aiReviewMode === 'critic' ? 'critic' : s.aiReviewMode === 'full' ? 'full' : null;
  if ('present' in s) {
    const p = s.present as Record<string, unknown> | null;
    if (!p || typeof p !== 'object') s.present = null;
    else {
      const durationMin = num(p.durationMin, 1, 120, PRESENT_DEFAULT.durationMin);
      const marks = (Array.isArray(p.marks) ? p.marks : []).slice(0, 12)
        .map((m) => (m && typeof m === 'object' ? m as Record<string, unknown> : {}))
        .map((m) => ({ atMin: num(m.atMin, 0, durationMin, -1), label: strCap(m.label, 60) ?? '' }))
        .filter((m) => m.atMin >= 0 && m.label)
        .sort((a, b) => a.atMin - b.atMin);
      s.present = { durationMin, marks, planBUrl: httpsUrl(p.planBUrl), planBLabel: strCap(p.planBLabel, 80) };
    }
  }
  if ('roleAlert' in s) {
    const r = s.roleAlert as Record<string, unknown> | null;
    s.roleAlert = r && typeof r === 'object' ? { qaMinPct: num(r.qaMinPct, 0, 100, ROLE_ALERT_DEFAULT.qaMinPct), maxWeekHours: num(r.maxWeekHours, 1, 168, ROLE_ALERT_DEFAULT.maxWeekHours) } : null;
  }
  if ('codeHealth' in s) {
    const c = s.codeHealth as Record<string, unknown> | null;
    s.codeHealth = c && typeof c === 'object' ? { branchMaxDays: num(c.branchMaxDays, 1, 90, CODE_HEALTH_DEFAULT.branchMaxDays), prMaxLines: num(c.prMaxLines, 50, 10_000, CODE_HEALTH_DEFAULT.prMaxLines) } : null;
  }
  if ('releaseRequireGreenCi' in s) s.releaseRequireGreenCi = s.releaseRequireGreenCi === true ? true : null;
  return s;
}

/** Đọc khoá G4 từ settings (mặc định khi thiếu). */
export function g4SettingsOf(settings: unknown) {
  const s = (settings && typeof settings === 'object' ? settings : {}) as Record<string, unknown>;
  const n = normalizeG4Settings({ aiReviewMode: s.aiReviewMode, present: s.present ?? null, roleAlert: s.roleAlert ?? null, codeHealth: s.codeHealth ?? null, releaseRequireGreenCi: s.releaseRequireGreenCi });
  return {
    aiReviewMode: (n.aiReviewMode as 'critic' | 'full' | null) ?? 'full',
    present: (n.present as PresentSettings | null) ?? PRESENT_DEFAULT,
    roleAlert: (n.roleAlert as RoleAlertSettings | null) ?? ROLE_ALERT_DEFAULT,
    codeHealth: (n.codeHealth as CodeHealthSettings | null) ?? CODE_HEALTH_DEFAULT,
    releaseRequireGreenCi: n.releaseRequireGreenCi === true,
  };
}
