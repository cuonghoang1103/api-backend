/**
 * CT Work — CTW đợt 5 (10/10/2026): LUẬT THUẦN của giảng viên & lớp học (không DB, test bằng teachingRules.test.ts).
 *
 *   - Mã lớp: sinh / chuẩn hoá / trạng thái (mở, đóng, hết hạn, lưu trữ).
 *   - Danh sách sinh viên: đọc CSV (dấu , ; tab, ngoặc kép, BOM) hoặc bảng xlsx đã đọc ⇒ dòng MSSV/họ tên/email + lỗi
 *     từng dòng (email sai, trùng trong tệp, đã có trong lớp).
 *   - Rubric: kiểm tiêu chí (trọng số cộng 100, mức điểm), tính tổng có trọng số, mẫu SWP391 / SEP490 lấy từ nội dung
 *     có sẵn trong repo (`content/projects/labflow-ai.md` mục "Luật chấm SWP391", `capstone.service.ts` Report 1→7).
 *   - Điểm: ai chấm được, ai thấy được (sinh viên chỉ thấy khi đã công bố; điểm cá nhân chỉ chính người đó).
 *   - Việc định kỳ: RRULE đơn giản (DAILY / WEEKLY + BYDAY / MONTHLY + BYMONTHDAY, INTERVAL, giờ) theo múi giờ dự án,
 *     lần đến hạn gần nhất + khoá chống trùng `rec:<ruleId>:<ngày>`.
 *   - Sức khoẻ nhóm cho hub giảng viên: đỏ / vàng / xanh kèm LÝ DO cụ thể (không nhãn người).
 */

import type { ProjectRole, ProjectTemplate } from './constants.js';

// ═══ Môn học ═══════════════════════════════════════════════════════

export const CLASS_SUBJECTS = ['SWP391', 'SWT301', 'SWR302', 'SEP490', 'ISP490', 'OTHER'] as const;
export type ClassSubject = (typeof CLASS_SUBJECTS)[number];

/** Mẫu dự án của nhóm theo môn (CAPSTONE cho đồ án tốt nghiệp). */
export const SUBJECT_TEMPLATE: Record<ClassSubject, ProjectTemplate> = {
  SWP391: 'SWP391', SWT301: 'SWT301', SWR302: 'SWR302', SEP490: 'CAPSTONE', ISP490: 'CAPSTONE', OTHER: 'BLANK',
};
/** Mã dự án mặc định (tiền tố thẻ) — mỗi nhóm ở không gian riêng nên không đụng nhau. */
export const SUBJECT_KEY: Record<ClassSubject, string> = {
  SWP391: 'SWP', SWT301: 'SWT', SWR302: 'SWR', SEP490: 'CAP', ISP490: 'CAP', OTHER: 'PRJ',
};

export const MAX_GROUP_SIZE = 10;
export const MAX_CLASS_STUDENTS = 200;

// ═══ Mã lớp ═══════════════════════════════════════════════════════

/** Không có 0/O/1/I/L — đọc to trong lớp không nhầm. 30^8 ≈ 6,5·10^11 tổ hợp. */
export const JOIN_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ2345679';
export const JOIN_LEN = 8;

export function generateJoinCode(randomBytes: (n: number) => Uint8Array): string {
  const bytes = randomBytes(JOIN_LEN * 2);
  let out = '';
  for (let i = 0; out.length < JOIN_LEN && i < bytes.length; i++) {
    // Loại bỏ byte lệch (256 không chia hết cho 30) để phân bố đều.
    if (bytes[i] >= 240) continue;
    out += JOIN_ALPHABET[bytes[i] % JOIN_ALPHABET.length];
  }
  while (out.length < JOIN_LEN) out += JOIN_ALPHABET[0];
  return out;
}

/** "abcd-efgh", " ABCD EFGH " ⇒ "ABCDEFGH". Ký tự dễ nhầm đổi về chữ đúng (O→0 không có trong bảng ⇒ giữ nguyên để báo sai). */
export function normalizeJoinCode(raw: unknown): string {
  return String(raw ?? '').toUpperCase().replace(/[\s\-_.]/g, '').slice(0, 16);
}

export function formatJoinCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

export const isWellFormedJoinCode = (code: string) => code.length === JOIN_LEN && [...code].every((c) => JOIN_ALPHABET.includes(c));

export type JoinState = 'OK' | 'CLOSED' | 'EXPIRED' | 'ARCHIVED';
export function joinState(c: { joinOpen: boolean; joinExpiresAt: Date | null; archivedAt: Date | null }, now: Date): JoinState {
  if (c.archivedAt) return 'ARCHIVED';
  if (!c.joinOpen) return 'CLOSED';
  if (c.joinExpiresAt && c.joinExpiresAt.getTime() <= now.getTime()) return 'EXPIRED';
  return 'OK';
}

// ═══ Danh sách sinh viên (CSV / xlsx) ═════════════════════════════

/** Đọc CSV: tự đoán dấu phân cách (, ; tab), ngoặc kép kiểu RFC 4180, bỏ BOM, bỏ dòng trống. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] ?? '';
  const counts = [',', ';', '\t'].map((d) => [d, firstLine.split(d).length - 1] as const);
  const delim = counts.sort((a, b) => b[1] - a[1])[0][1] > 0 ? counts[0][0] : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQ = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQ) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; } else inQ = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"') { inQ = true; continue; }
    if (ch === delim) { row.push(cell); cell = ''; continue; }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
      continue;
    }
    cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows.map((r) => r.map((c) => c.trim()));
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const HEADER_ALIASES: Record<'code' | 'name' | 'email', string[]> = {
  code: ['mssv', 'ma sv', 'ma sinh vien', 'student id', 'student code', 'roll number', 'roll no', 'rollnumber', 'id', 'code', 'ma so', 'msv'],
  name: ['ho ten', 'ho va ten', 'full name', 'fullname', 'name', 'student name', 'ten', 'ho ten sinh vien', 'member'],
  email: ['email', 'e mail', 'mail', 'email address', 'fpt email', 'gmail'],
};

export interface RosterRow {
  /** Số dòng trong tệp (1 = dòng đầu tiên của tệp). */
  line: number;
  studentCode: string | null;
  fullName: string | null;
  email: string | null;
  errors: RosterError[];
}
export type RosterError = 'MISSING_EMAIL' | 'BAD_EMAIL' | 'BAD_CODE' | 'DUP_EMAIL_IN_FILE' | 'DUP_CODE_IN_FILE' | 'ALREADY_IN_CLASS' | 'CODE_IN_CLASS';

export const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[a-z]{2,}$/i;
const CODE_RE = /^[A-Za-z0-9]{4,20}$/;

/** Cột nào là MSSV / họ tên / email: theo tiêu đề nếu có, không thì đoán theo nội dung (ô có @ là email). */
export function detectColumns(rows: string[][]): { header: boolean; code: number; name: number; email: number } {
  const head = (rows[0] ?? []).map(fold);
  const find = (k: keyof typeof HEADER_ALIASES) => head.findIndex((h) => HEADER_ALIASES[k].includes(h));
  const hit = { code: find('code'), name: find('name'), email: find('email') };
  if (hit.email >= 0 || (hit.code >= 0 && hit.name >= 0)) return { header: true, ...hit };
  // Không có tiêu đề: email = cột có '@' nhiều nhất; MSSV = cột còn lại "giống mã" nhiều nhất; họ tên = cột còn lại dài nhất.
  const width = Math.max(0, ...rows.map((r) => r.length));
  const score = (col: number, test: (v: string) => boolean) => rows.filter((r) => test(r[col] ?? '')).length;
  const cols = [...Array(width).keys()];
  const email = cols.sort((a, b) => score(b, (v) => v.includes('@')) - score(a, (v) => v.includes('@')))[0] ?? -1;
  const rest = [...Array(width).keys()].filter((c) => c !== email);
  const code = rest.sort((a, b) => score(b, (v) => CODE_RE.test(v) && /\d/.test(v)) - score(a, (v) => CODE_RE.test(v) && /\d/.test(v)))[0] ?? -1;
  const nameCands = [...Array(width).keys()].filter((c) => c !== email && c !== code);
  const avgLen = (c: number) => rows.reduce((a, r) => a + (r[c] ?? '').length, 0);
  const name = nameCands.sort((a, b) => avgLen(b) - avgLen(a))[0] ?? -1;
  return { header: false, code: score(code, (v) => CODE_RE.test(v)) ? code : -1, name, email: score(email, (v) => v.includes('@')) ? email : -1 };
}

/**
 * Bảng (CSV hoặc sheet đầu của xlsx) ⇒ dòng sinh viên đã kiểm. `existing` = email/MSSV đã có trong lớp (chữ thường /
 * chữ hoa) ⇒ báo ALREADY_IN_CLASS / CODE_IN_CLASS (không nhập lại). Email chữ thường; MSSV chữ hoa.
 */
export function rosterFromTable(table: string[][], existing: { emails: ReadonlySet<string>; codes: ReadonlySet<string> } = { emails: new Set(), codes: new Set() }): RosterRow[] {
  const rows = table.filter((r) => r.some((c) => String(c ?? '').trim()));
  if (!rows.length) return [];
  const cols = detectColumns(rows);
  const body = cols.header ? rows.slice(1) : rows;
  const seenEmail = new Map<string, number>();
  const seenCode = new Map<string, number>();
  return body.slice(0, MAX_CLASS_STUDENTS + 50).map((r, i) => {
    const pick = (c: number) => (c >= 0 ? String(r[c] ?? '').trim() : '');
    const email = pick(cols.email).toLowerCase() || null;
    const code = pick(cols.code).toUpperCase() || null;
    const fullName = pick(cols.name).replace(/\s+/g, ' ').slice(0, 120) || null;
    const errors: RosterError[] = [];
    if (!email) errors.push('MISSING_EMAIL');
    else if (!EMAIL_RE.test(email) || email.length > 100) errors.push('BAD_EMAIL');
    if (code && !CODE_RE.test(code)) errors.push('BAD_CODE');
    if (email && !errors.includes('BAD_EMAIL')) {
      if (seenEmail.has(email)) errors.push('DUP_EMAIL_IN_FILE');
      else seenEmail.set(email, i);
      if (existing.emails.has(email)) errors.push('ALREADY_IN_CLASS');
    }
    if (code && !errors.includes('BAD_CODE')) {
      if (seenCode.has(code)) errors.push('DUP_CODE_IN_FILE');
      else seenCode.set(code, i);
      if (existing.codes.has(code) && !errors.includes('ALREADY_IN_CLASS')) errors.push('CODE_IN_CLASS');
    }
    return { line: i + 1 + (cols.header ? 1 : 0), studentCode: code, fullName, email, errors };
  });
}

/** Trần gửi lời mời: một lô ≤ 100 thư, một lớp ≤ 300 thư / 24 giờ, một sinh viên nhận lại sau ≥ 24 giờ, tối đa 3 lần. */
export const INVITE_LIMITS = { perBatch: 100, perClassPerDay: 300, resendAfterHours: 24, maxPerStudent: 3 } as const;

export function canResendInvite(s: { invitedAt: Date | null; inviteCount: number; joinedAt: Date | null; userId: number | null }, now: Date): 'OK' | 'JOINED' | 'TOO_SOON' | 'MAX' {
  if (s.joinedAt) return 'JOINED';
  if (s.inviteCount >= INVITE_LIMITS.maxPerStudent) return 'MAX';
  if (s.invitedAt && now.getTime() - s.invitedAt.getTime() < INVITE_LIMITS.resendAfterHours * 3_600_000) return 'TOO_SOON';
  return 'OK';
}

// ═══ Rubric & điểm ═════════════════════════════════════════════════

export interface RubricLevel { score: number; label: string; description: string }
export interface RubricCriterion { key: string; name: string; weight: number; description: string; levels: RubricLevel[] }

export class RubricError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

const keyOf = (s: string, i: number) => (fold(s).replace(/\s+/g, '_').slice(0, 32) || `c${i + 1}`);

/** Kiểm + chuẩn hoá tiêu chí. Trọng số dương, cộng đúng 100 (sai số 0,01). 1–20 tiêu chí, 0–8 mức mỗi tiêu chí. */
export function normalizeCriteria(raw: unknown, scaleMax = 10): RubricCriterion[] {
  if (!Array.isArray(raw) || !raw.length) throw new RubricError('RUBRIC_EMPTY', 'Add at least one criterion');
  if (raw.length > 20) throw new RubricError('RUBRIC_TOO_MANY', 'A rubric can have at most 20 criteria');
  const keys = new Set<string>();
  const out = raw.map((c, i) => {
    const o = (c ?? {}) as Record<string, unknown>;
    const name = String(o.name ?? '').trim().slice(0, 120);
    if (!name) throw new RubricError('RUBRIC_BAD', `Criterion ${i + 1} needs a name`);
    const weight = Number(o.weight);
    if (!Number.isFinite(weight) || weight <= 0 || weight > 100) throw new RubricError('RUBRIC_BAD', `"${name}": weight must be between 0 and 100`);
    let key = String(o.key ?? '').trim().slice(0, 32) || keyOf(name, i);
    while (keys.has(key)) key = `${key}_${i + 1}`;
    keys.add(key);
    const levelsRaw = Array.isArray(o.levels) ? o.levels : [];
    if (levelsRaw.length > 8) throw new RubricError('RUBRIC_BAD', `"${name}": at most 8 levels`);
    const levels = levelsRaw.map((l) => {
      const x = (l ?? {}) as Record<string, unknown>;
      const score = Number(x.score);
      if (!Number.isFinite(score) || score < 0 || score > scaleMax) throw new RubricError('RUBRIC_BAD', `"${name}": level scores must be 0–${scaleMax}`);
      return { score, label: String(x.label ?? '').trim().slice(0, 60), description: String(x.description ?? '').trim().slice(0, 500) };
    }).sort((a, b) => b.score - a.score);
    return { key, name, weight: Math.round(weight * 100) / 100, description: String(o.description ?? '').trim().slice(0, 1000), levels };
  });
  const sum = out.reduce((a, c) => a + c.weight, 0);
  if (Math.abs(sum - 100) > 0.01) throw new RubricError('RUBRIC_WEIGHTS', `Weights must add up to 100 (now ${Math.round(sum * 100) / 100})`);
  return out;
}

/** Điểm từng tiêu chí (0..scaleMax, bước 0,25). Thiếu tiêu chí = chưa chấm. Khoá lạ ⇒ lỗi. */
export function validateScores(criteria: RubricCriterion[], raw: unknown, scaleMax = 10): Record<string, number> {
  const o = (raw ?? {}) as Record<string, unknown>;
  const keys = new Set(criteria.map((c) => c.key));
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(o)) {
    if (!keys.has(k)) throw new RubricError('GRADE_BAD', `Unknown criterion "${k}"`);
    if (v === null || v === undefined || v === '') continue;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0 || n > scaleMax) throw new RubricError('GRADE_BAD', `Scores must be between 0 and ${scaleMax}`);
    out[k] = Math.round(n * 4) / 4;
  }
  return out;
}

/** Tổng có trọng số trên thang scaleMax (2 chữ số thập phân). Chưa chấm đủ ⇒ null (không đoán). */
export function weightedTotal(criteria: RubricCriterion[], scores: Record<string, number>): number | null {
  if (!criteria.length || criteria.some((c) => scores[c.key] === undefined)) return null;
  const t = criteria.reduce((a, c) => a + (c.weight / 100) * scores[c.key], 0);
  return Math.round(t * 100) / 100;
}

export const gradeSubjectKey = (userId: number | null | undefined) => (userId ? `U${userId}` : 'TEAM');

/** Người chấm: chỉ vai TEACHER (giảng viên vào dự án nhóm). ADMIN dự án là trưởng nhóm sinh viên — không tự chấm. */
export const canGrade = (role: ProjectRole | null) => role === 'TEACHER';

/**
 * Ai thấy một điểm: giảng viên thấy mọi điểm (kể cả nháp); thành viên (ADMIN/MEMBER) chỉ thấy điểm ĐÃ CÔNG BỐ — điểm
 * nhóm thì cả nhóm, điểm cá nhân chỉ chính người đó. Người xem / khách / agent: không.
 */
export function canSeeGrade(viewer: { userId: number; role: ProjectRole | null; agent?: boolean }, g: { publishedAt: Date | null; subjectUserId: number | null }): boolean {
  if (viewer.agent || !viewer.role) return false;
  if (viewer.role === 'TEACHER') return true;
  if (viewer.role !== 'ADMIN' && viewer.role !== 'MEMBER') return false;
  if (!g.publishedAt) return false;
  return g.subjectUserId === null || g.subjectUserId === viewer.userId;
}

export interface RubricTemplate { key: string; name: string; subject: ClassSubject; description: string; scaleMax: number; milestones: string[]; criteria: RubricCriterion[] }

const lv = (rows: Array<[number, string, string]>): RubricLevel[] => rows.map(([score, label, description]) => ({ score, label, description }));

/**
 * Mẫu rubric dựng từ nội dung CÓ SẴN trong repo:
 *   - SWP391 (content/projects/labflow-ai.md, "Luật chấm SWP391 cần nhớ"): ba mốc lặp M1 15% · M2 20% · M3 25% chấm
 *     sản phẩm + tài liệu từng mốc, LOC từng người theo S/M/C × L1/L2/L3; hội đồng cuối 40% = Team 20 · Product 40 ·
 *     Requirement 20 · Design 20.
 *   - SEP490 (capstone.service.ts): Report 1→7 + gói phần mềm theo 6 giai đoạn. Trọng số là MẶC ĐỊNH đề xuất —
 *     bộ môn có rubric riêng thì sửa lại trước khi chấm.
 */
export const RUBRIC_TEMPLATES: readonly RubricTemplate[] = [
  {
    key: 'SWP391_ITERATION', subject: 'SWP391', scaleMax: 10,
    name: 'SWP391 — Iteration milestone (M1–M3)',
    description: 'Grades one iteration milestone: SWP-M1 (15%) requirement analysis & design, SWP-M2 (20%) WF1 & WF2, SWP-M3 (25%) full system & testing. LOC is individual — grade each member on their own screens.',
    milestones: ['SWP-M1 (week 3, 15%)', 'SWP-M2 (week 8, 20%)', 'SWP-M3 (week 10, 25%)'],
    criteria: [
      { key: 'artifacts', name: 'Requirement & design artifacts', weight: 25, description: 'SRS / SDS sections due at this milestone, approved wireframes, use cases and business rules that match the code.', levels: lv([[10, 'Complete', 'Every section due is present, consistent with the product and reviewed.'], [7, 'Mostly', 'Small gaps or inconsistencies.'], [4, 'Partial', 'Key sections missing or out of date.'], [0, 'Missing', 'Not submitted.']]) },
      { key: 'product', name: 'Working features (success + exception flows)', weight: 35, description: 'The workflows due at this milestone run integrated, including unhappy cases (WF0 at M1, WF1 CRUD + WF2 at M2, WF3 + deploy at M3).', levels: lv([[10, 'L3', 'All flows run end to end, failure paths handled cleanly.'], [7.5, 'L2', 'Main flows run, unhappy cases handled.'], [5, 'L1', 'Happy path only.'], [0, 'Not running', 'Cannot be demonstrated.']]) },
      { key: 'loc', name: 'Code quality & LOC (per member)', weight: 20, description: 'LOC points from screen complexity (S 60 · M 120 · C 240) × quality (L1 50% · L2 75% · L3 100%) against the iteration ceiling. Commits must come from the member\'s own account.', levels: lv([[10, 'At ceiling', 'Meets or exceeds the MaxLOC of the iteration at L2+.'], [7, 'Most', 'About three quarters of the ceiling.'], [4, 'Half', 'About half — often screens stuck at L1.'], [0, 'None', 'No own commits.']]) },
      { key: 'process', name: 'Process & teamwork', weight: 10, description: 'Board kept up to date, weekly reports, Q&A with the lecturer, commits spread across the iteration, git tag for the iteration.', levels: lv([[10, 'Strong', 'Visible, steady process.'], [6, 'Uneven', 'Gaps or last-minute work.'], [0, 'Absent', 'No evidence.']]) },
      { key: 'testing', name: 'Testing evidence', weight: 10, description: 'Unit tests, integration / system test cases with results for the features of this milestone (3 rounds of System Test at M3).', levels: lv([[10, 'Complete', 'Cases + results for every feature due.'], [6, 'Partial', 'Some features untested.'], [0, 'None', 'No test evidence.']]) },
    ],
  },
  {
    key: 'SWP391_FINAL', subject: 'SWP391', scaleMax: 10,
    name: 'SWP391 — Final presentation (40%)',
    description: 'Council of two lecturers (not the class lecturer). Team 20 · Product 40 · Requirement 20 · Design 20. Pass needs Final ≥ 5/10.',
    milestones: ['Final presentation'],
    criteria: [
      { key: 'team', name: 'Team', weight: 20, description: 'Who did what and how the team worked together — roles, per-member commit history, the real board.', levels: lv([[10, 'Clear', 'Every member explains their own part and the collaboration.'], [5, 'Uneven', 'Some members cannot explain their part.'], [0, 'Unclear', 'No evidence of teamwork.']]) },
      { key: 'product', name: 'Product', weight: 40, description: 'The system runs and handles bad situations — demo of the core flows including failure paths, reproducible seed data.', levels: lv([[10, 'Robust', 'All demo flows including failure paths.'], [7, 'Works', 'Main flows run, some failures unhandled.'], [4, 'Fragile', 'Demo breaks or needs workarounds.'], [0, 'Fails', 'Cannot demo.']]) },
      { key: 'requirement', name: 'Requirement', weight: 20, description: 'Understands the problem; clear use cases, screen flow, business rules, questions asked to the lecturer.', levels: lv([[10, 'Clear', 'Rules and scope are precise and justified.'], [5, 'Vague', 'Gaps or contradictions.'], [0, 'Missing', 'Cannot explain the requirements.']]) },
      { key: 'design', name: 'Design', weight: 20, description: 'Design with reasons — architecture, ERD, constraints, state machines.', levels: lv([[10, 'Reasoned', 'Choices explained with trade-offs.'], [5, 'Shallow', 'Diagrams without reasons.'], [0, 'Missing', 'No design to show.']]) },
    ],
  },
  {
    key: 'SEP490_STAGE', subject: 'SEP490', scaleMax: 10,
    name: 'SEP490 — Capstone stage review',
    description: 'One rubric for every capstone milestone (Report 1 → Report 7 and the software packages of Iteration 1–3). Default weights — change them to your department\'s rubric before grading.',
    milestones: ['Report 1 — Project Introduction', 'Report 2 — Project Management Plan', 'Report 3 — SRS', 'Report 4 — SDS', 'Report 5 — Test Documentation', 'Iteration 1', 'Iteration 2', 'Iteration 3', 'Report 6 — User Guides', 'Report 7 — Final Report', 'Defense'],
    criteria: [
      { key: 'deliverable', name: 'Deliverable completeness (template sections)', weight: 25, description: 'Every heading of the FPT template for this report is present and filled; versions and Record of Changes kept.', levels: lv([[10, 'Complete', 'All sections, consistent numbering.'], [7, 'Mostly', 'Minor sections thin.'], [4, 'Partial', 'Major sections missing.'], [0, 'Missing', 'Not submitted.']]) },
      { key: 'technical', name: 'Technical quality', weight: 30, description: 'Correctness and depth: requirements testable, design traceable to requirements, code and tests matching the documents.', levels: lv([[10, 'Strong', 'Accurate, traceable, justified.'], [6, 'Adequate', 'Mostly correct, some gaps.'], [3, 'Weak', 'Errors or untraceable parts.'], [0, 'None', 'No technical content.']]) },
      { key: 'product', name: 'Working product / evidence', weight: 25, description: 'For iterations: tagged package, unit + integration test reports. For reports: diagrams and screens backed by the real system.', levels: lv([[10, 'Demonstrated', 'Runs and matches the documents.'], [6, 'Partial', 'Some features missing or mismatched.'], [0, 'None', 'Nothing to demonstrate.']]) },
      { key: 'process', name: 'Process & schedule', weight: 10, description: 'On time for the stage, weekly reports, meeting minutes, risks and Q&A kept up to date.', levels: lv([[10, 'On track', 'On time with visible process.'], [5, 'Late', 'Late or patchy records.'], [0, 'Absent', 'No process evidence.']]) },
      { key: 'presentation', name: 'Presentation & answers', weight: 10, description: 'Explains the work and answers questions; each member can speak to their own part.', levels: lv([[10, 'Confident', 'Clear, correct answers.'], [5, 'Partial', 'Some members struggle.'], [0, 'Unable', 'Cannot explain.']]) },
    ],
  },
];

export function rubricTemplate(key: string): RubricTemplate | undefined {
  return RUBRIC_TEMPLATES.find((t) => t.key === key);
}

// ═══ Việc định kỳ (RRULE đơn giản) ═════════════════════════════════

export const RECUR_FREQS = ['DAILY', 'WEEKLY', 'MONTHLY'] as const;
export type RecurFreq = (typeof RECUR_FREQS)[number];
const WD = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

export interface Recurrence {
  freq: RecurFreq;
  /** Mỗi n ngày / tuần / tháng (1–12). */
  interval: number;
  /** WEEKLY: các thứ trong tuần, 0 = Chủ nhật … 6 = thứ Bảy. Rỗng ⇒ thứ của ngày bắt đầu. */
  byWeekday: number[];
  /** MONTHLY: ngày trong tháng 1–31, −1 = ngày cuối tháng. null ⇒ ngày của ngày bắt đầu. Tháng ngắn hơn ⇒ ngày cuối. */
  byMonthDay: number | null;
  hour: number;
  minute: number;
  /** YYYY-MM-DD theo múi giờ dự án. */
  startDate: string;
  endDate: string | null;
}

export class RecurrenceError extends Error {
  constructor(message: string) { super(message); }
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const dayNum = (day: string) => Date.parse(`${day}T00:00:00Z`) / 86_400_000;
export const weekdayOf = (day: string) => new Date(`${day}T00:00:00Z`).getUTCDay();
const addDay = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

export function normalizeRecurrence(raw: unknown): Recurrence {
  const o = (raw ?? {}) as Record<string, unknown>;
  const freq = String(o.freq ?? '').toUpperCase() as RecurFreq;
  if (!RECUR_FREQS.includes(freq)) throw new RecurrenceError('Pick daily, weekly or monthly');
  const interval = Number(o.interval ?? 1);
  if (!Number.isInteger(interval) || interval < 1 || interval > 12) throw new RecurrenceError('Repeat every 1–12');
  const startDate = String(o.startDate ?? '');
  if (!DAY_RE.test(startDate) || Number.isNaN(dayNum(startDate))) throw new RecurrenceError('Start date must be YYYY-MM-DD');
  const endDate = o.endDate ? String(o.endDate) : null;
  if (endDate && (!DAY_RE.test(endDate) || dayNum(endDate) < dayNum(startDate))) throw new RecurrenceError('End date must be on or after the start date');
  const hour = Number(o.hour ?? 8), minute = Number(o.minute ?? 0);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23 || !Number.isInteger(minute) || minute < 0 || minute > 59) throw new RecurrenceError('Time must be HH:MM');
  const byWeekday = [...new Set((Array.isArray(o.byWeekday) ? o.byWeekday : []).map(Number))].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6).sort();
  let byMonthDay: number | null = o.byMonthDay === null || o.byMonthDay === undefined || o.byMonthDay === '' ? null : Number(o.byMonthDay);
  if (byMonthDay !== null && (!Number.isInteger(byMonthDay) || byMonthDay === 0 || byMonthDay < -1 || byMonthDay > 31)) throw new RecurrenceError('Day of month must be 1–31 or −1 (last day)');
  if (freq !== 'MONTHLY') byMonthDay = null;
  return { freq, interval, byWeekday: freq === 'WEEKLY' ? byWeekday : [], byMonthDay, hour, minute, startDate, endDate };
}

/** Chuỗi RRULE (RFC 5545, tập con) để hiển thị / xuất. */
export function toRrule(r: Recurrence): string {
  const parts = [`FREQ=${r.freq}`];
  if (r.interval !== 1) parts.push(`INTERVAL=${r.interval}`);
  if (r.freq === 'WEEKLY') parts.push(`BYDAY=${(r.byWeekday.length ? r.byWeekday : [weekdayOf(r.startDate)]).map((d) => WD[d]).join(',')}`);
  if (r.freq === 'MONTHLY') parts.push(`BYMONTHDAY=${r.byMonthDay ?? Number(r.startDate.slice(8, 10))}`);
  parts.push(`BYHOUR=${r.hour}`, `BYMINUTE=${r.minute}`);
  if (r.endDate) parts.push(`UNTIL=${r.endDate.replace(/-/g, '')}`);
  return parts.join(';');
}

/** Đọc ngược chuỗi RRULE (tập con ở trên). Ngày bắt đầu phải đưa riêng (DTSTART không nằm trong RRULE). */
export function parseRrule(s: string, startDate: string): Recurrence {
  const kv = new Map(s.replace(/^RRULE:/i, '').split(';').map((p) => p.split('=') as [string, string]).map(([k, v]) => [k?.toUpperCase(), v ?? '']));
  const until = kv.get('UNTIL');
  return normalizeRecurrence({
    freq: kv.get('FREQ'),
    interval: kv.has('INTERVAL') ? Number(kv.get('INTERVAL')) : 1,
    byWeekday: (kv.get('BYDAY') ?? '').split(',').filter(Boolean).map((d) => WD.indexOf(d.toUpperCase().slice(-2) as (typeof WD)[number])).filter((d) => d >= 0),
    byMonthDay: kv.has('BYMONTHDAY') ? Number(kv.get('BYMONTHDAY')) : null,
    hour: kv.has('BYHOUR') ? Number(kv.get('BYHOUR')) : 8,
    minute: kv.has('BYMINUTE') ? Number(kv.get('BYMINUTE')) : 0,
    startDate,
    endDate: until ? `${until.slice(0, 4)}-${until.slice(4, 6)}-${until.slice(6, 8)}` : null,
  });
}

/** Ngày lịch `day` (YYYY-MM-DD) có phải một lần lặp không. */
export function occursOn(r: Recurrence, day: string): boolean {
  if (!DAY_RE.test(day)) return false;
  const d = dayNum(day), s = dayNum(r.startDate);
  if (d < s) return false;
  if (r.endDate && d > dayNum(r.endDate)) return false;
  if (r.freq === 'DAILY') return (d - s) % r.interval === 0;
  if (r.freq === 'WEEKLY') {
    const days = r.byWeekday.length ? r.byWeekday : [weekdayOf(r.startDate)];
    if (!days.includes(weekdayOf(day))) return false;
    // Tuần tính từ thứ Hai của tuần chứa ngày bắt đầu.
    const monday = (x: number, wd: number) => x - ((wd + 6) % 7);
    const weeks = Math.round((monday(d, weekdayOf(day)) - monday(s, weekdayOf(r.startDate))) / 7);
    return weeks % r.interval === 0;
  }
  const [y, m, dd] = day.split('-').map(Number);
  const [sy, sm] = r.startDate.split('-').map(Number);
  const months = (y - sy) * 12 + (m - sm);
  if (months < 0 || months % r.interval !== 0) return false;
  const want = r.byMonthDay ?? Number(r.startDate.slice(8, 10));
  const last = daysInMonth(y, m - 1);
  const target = want === -1 ? last : Math.min(want, last);
  return dd === target;
}

/** n lần lặp kế tiếp từ ngày `fromDay` (tính cả ngày đó). Quét tối đa 3 năm. */
export function nextOccurrences(r: Recurrence, fromDay: string, n: number): string[] {
  const out: string[] = [];
  let day = dayNum(fromDay) < dayNum(r.startDate) ? r.startDate : fromDay;
  for (let i = 0; i < 366 * 3 && out.length < n; i++) {
    if (r.endDate && dayNum(day) > dayNum(r.endDate)) break;
    if (occursOn(r, day)) out.push(day);
    day = addDay(day, 1);
  }
  return out;
}

/** Giờ chạy của lần lặp `day` dưới dạng thời điểm UTC (`midnight` = 00:00 của ngày đó theo múi giờ dự án). */
export const fireTime = (r: Recurrence, midnight: Date) => new Date(midnight.getTime() + (r.hour * 60 + r.minute) * 60_000);

/** Lần lặp đã tới giờ mà chưa quá CATCH_UP_HOURS — cron hằng giờ bỏ lỡ (máy chủ tắt) vẫn bù được trong cửa sổ này. */
export const CATCH_UP_HOURS = 36;

/**
 * Lần lặp đến hạn tại thời điểm `now`: xét hôm nay và hôm qua theo múi giờ dự án (`today` đã đổi sẵn), lấy lần gần nhất
 * đã tới giờ và chưa quá cửa sổ bù. `midnightOf(day)` = 00:00 của ngày đó tại múi giờ dự án (do tầng DB truyền vào).
 */
export function dueOccurrence(r: Recurrence, now: Date, today: string, midnightOf: (day: string) => Date): string | null {
  for (const day of [today, addDay(today, -1)]) {
    if (!occursOn(r, day)) continue;
    const at = fireTime(r, midnightOf(day)).getTime();
    if (at <= now.getTime() && now.getTime() - at <= CATCH_UP_HOURS * 3_600_000) return day;
  }
  return null;
}

export const recurringDedupKey = (ruleId: number, day: string) => `rec:${ruleId}:${day}`;

/** Tiêu đề thẻ: {date} = dd/mm/yyyy, {week} = tuần thứ mấy kể từ ngày bắt đầu (1, 2, …), {n} = lần lặp thứ mấy. */
export function renderRecurringTitle(template: string, day: string, r: Recurrence): string {
  const [y, m, d] = day.split('-');
  const week = Math.floor((dayNum(day) - dayNum(r.startDate)) / 7) + 1;
  let n = 0;
  if (template.includes('{n}')) {
    let cur = r.startDate;
    for (let i = 0; i < 366 * 3 && dayNum(cur) <= dayNum(day); i++) { if (occursOn(r, cur)) n += 1; cur = addDay(cur, 1); }
  }
  return template.replace(/\{date\}/g, `${d}/${m}/${y}`).replace(/\{week\}/g, String(week)).replace(/\{n\}/g, String(n)).slice(0, 255);
}

// ═══ Hồ sơ FPT & sức khoẻ nhóm (hub giảng viên) ═══════════════════

export const FPT_DOCS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'T51', 'T52', 'T53', 'WEEKLY', 'AI'] as const;
export type FptDoc = (typeof FPT_DOCS)[number];
export type DocState = 'SUBMITTED' | 'DRAFT' | 'MISSING' | 'NA';

/** Hồ sơ mà môn yêu cầu (môn khác ⇒ hiện "n/a", không tính thiếu). */
export const EXPECTED_DOCS: Record<ClassSubject | 'CAPSTONE' | 'UNKNOWN', readonly FptDoc[]> = {
  SEP490: FPT_DOCS, ISP490: FPT_DOCS, CAPSTONE: FPT_DOCS,
  SWP391: ['R3', 'R4', 'T51', 'T53', 'WEEKLY', 'AI'],
  SWT301: ['R5', 'T51', 'T52', 'T53', 'WEEKLY'],
  SWR302: ['R3', 'WEEKLY', 'AI'],
  OTHER: ['WEEKLY'], UNKNOWN: ['WEEKLY'],
};

export function subjectOfProject(p: { template: string; subjectCode?: string | null }): keyof typeof EXPECTED_DOCS {
  const s = (p.subjectCode ?? '').toUpperCase().replace(/\s+/g, '');
  if ((CLASS_SUBJECTS as readonly string[]).includes(s)) return s as ClassSubject;
  if (p.template === 'CAPSTONE') return 'CAPSTONE';
  if (p.template === 'SWP391' || p.template === 'SWT301' || p.template === 'SWR302') return p.template;
  return 'UNKNOWN';
}

export interface HealthInput {
  overdue: number;
  open: number;
  sprintAtRisk: boolean;
  unansweredQna: number;
  /** Câu hỏi chưa trả lời lâu nhất (ngày). */
  oldestQnaDays: number;
  openHighRisks: number;
  missingDocs: number;
  attentionMembers: number;
  /** Số ngày cả nhóm không có hoạt động nào (null = không đo được). */
  silentDays: number | null;
}
export interface HealthReason { code: string; level: 'red' | 'amber'; n: number }

/** Đỏ khi có lý do đỏ; vàng khi chỉ có lý do vàng; xanh khi không có gì. Mỗi lý do có mã + con số để giao diện dịch. */
export function groupHealth(h: HealthInput): { status: 'red' | 'amber' | 'green'; reasons: HealthReason[] } {
  const r: HealthReason[] = [];
  if (h.overdue >= 5 || (h.open > 0 && h.overdue / h.open >= 0.3 && h.overdue >= 3)) r.push({ code: 'OVERDUE', level: 'red', n: h.overdue });
  else if (h.overdue > 0) r.push({ code: 'OVERDUE', level: 'amber', n: h.overdue });
  if (h.sprintAtRisk) r.push({ code: 'SPRINT_AT_RISK', level: 'amber', n: 1 });
  if (h.unansweredQna > 0) r.push({ code: 'QNA_WAITING', level: h.oldestQnaDays >= 7 ? 'red' : 'amber', n: h.unansweredQna });
  if (h.openHighRisks > 0) r.push({ code: 'HIGH_RISKS', level: h.openHighRisks >= 3 ? 'red' : 'amber', n: h.openHighRisks });
  if (h.missingDocs > 0) r.push({ code: 'DOCS_MISSING', level: 'amber', n: h.missingDocs });
  if (h.attentionMembers > 0) r.push({ code: 'MEMBERS_ATTENTION', level: 'amber', n: h.attentionMembers });
  if (h.silentDays !== null && h.silentDays >= 7) r.push({ code: 'TEAM_SILENT', level: h.silentDays >= 14 ? 'red' : 'amber', n: h.silentDays });
  const status = r.some((x) => x.level === 'red') ? 'red' : r.length ? 'amber' : 'green';
  return { status, reasons: r };
}
