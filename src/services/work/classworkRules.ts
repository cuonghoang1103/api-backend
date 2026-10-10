/**
 * CT Work — CTW đợt 9b (13/10/2026): LUẬT THUẦN của Bài tập + Sổ điểm (không chạm DB — test unit ở classworkRules.test.ts).
 *
 *   - Nộp muộn: muộn = nộp SAU hạn; số ngày muộn = số ngày BẮT ĐẦU sau hạn (1 phút muộn = 1 ngày). Trừ điểm
 *     `pct × ngày`, trần `maxPct`. Khoá nộp muộn (allowLate=false) ⇒ không nộp được sau hạn.
 *   - Điểm hiển thị cho sinh viên: CHỈ bản đã trả (`returned*`). Điểm nháp không bao giờ lọt ra `studentGrade`.
 *   - Nhóm: một bài nộp chung; điểm từng người = điểm chỉnh riêng (memberPoints) nếu có, không thì điểm chung.
 *   - Kiểm tệp nộp: cỡ, đuôi nguy hiểm, chữ ký đầu tệp khớp đuôi (không nhận .exe đổi tên thành .pdf).
 *   - Sổ điểm hệ 10: POINTS (tổng điểm / tổng tối đa), CATEGORY / TOPIC (trung bình % từng nhóm × trọng số, chỉ tính
 *     nhóm đã có điểm — trọng số chia lại cho đủ 100).
 *   - Nhập điểm từ xlsx: khớp sinh viên theo MSSV hoặc email, cột theo tên bài; báo lỗi từng dòng, không đoán.
 */


export const DAY_MS = 86_400_000;
export const ASSIGNMENT_KINDS = ['INDIVIDUAL', 'GROUP'] as const;
export type AssignmentKind = (typeof ASSIGNMENT_KINDS)[number];
export const SUBMISSION_STATUSES = ['ASSIGNED', 'TURNED_IN', 'RETURNED'] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
export const GRADEBOOK_MODES = ['POINTS', 'CATEGORY', 'TOPIC'] as const;
export type GradebookMode = (typeof GRADEBOOK_MODES)[number];

export const MAX_SUBMISSION_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES_PER_SUBMISSION = 10;
export const MAX_FILES_PER_ASSIGNMENT = 10;
export const MAX_LINKS = 10;
export const MAX_TEXT = 50_000;

const r2 = (n: number) => Math.round(n * 100) / 100;

// ─── Nộp muộn ─────────────────────────────────────────────────────

export function lateInfo(dueAt: Date | null, at: Date): { late: boolean; daysLate: number } {
  if (!dueAt || at.getTime() <= dueAt.getTime()) return { late: false, daysLate: 0 };
  return { late: true, daysLate: Math.ceil((at.getTime() - dueAt.getTime()) / DAY_MS) };
}

export function latePenaltyPct(a: { latePenaltyPct: number; latePenaltyMaxPct: number }, daysLate: number): number {
  if (daysLate <= 0 || a.latePenaltyPct <= 0) return 0;
  return r2(Math.min(Math.max(a.latePenaltyMaxPct, 0), 100, a.latePenaltyPct * daysLate));
}

/** Sau hạn + khoá nộp muộn ⇒ không nộp được. */
export function canTurnIn(a: { dueAt: Date | null; allowLate: boolean }, now: Date): boolean {
  return a.allowLate || !a.dueAt || now.getTime() <= a.dueAt.getTime();
}

export function applyPenalty(points: number | null, pct: number | null | undefined): number | null {
  if (points === null || points === undefined) return null;
  return r2(points * (1 - Math.min(Math.max(pct ?? 0, 0), 100) / 100));
}

// ─── Điểm theo rubric ⇒ điểm bài ─────────────────────────────────

/** Tổng rubric (thang scaleMax) quy về thang maxPoints của bài. */
export function rubricToPoints(total: number | null, scaleMax: number, maxPoints: number): number | null {
  if (total === null || !(scaleMax > 0)) return null;
  return r2((total / scaleMax) * maxPoints);
}

// ─── Điểm người xem thấy ─────────────────────────────────────────

export interface GradeFields {
  status: string;
  points: number | null; scores: unknown; memberPoints: unknown; penaltyPct: number;
  returnedAt: Date | null; returnedPoints: number | null; returnedScores: unknown; returnedMemberPoints: unknown; returnedPenaltyPct: number | null;
}

const asMap = (v: unknown): Record<string, number> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const out: Record<string, number> = {};
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) if (typeof x === 'number' && Number.isFinite(x)) out[k] = x;
  return out;
};

/** Điểm thô của MỘT người (nhóm: điểm chỉnh riêng nếu có). `which`: bản nháp hay bản đã trả. */
export function rawPointsFor(g: GradeFields, userId: number, which: 'draft' | 'returned'): number | null {
  const own = asMap(which === 'draft' ? g.memberPoints : g.returnedMemberPoints)[String(userId)];
  if (own !== undefined) return own;
  return which === 'draft' ? g.points : g.returnedPoints;
}

/** Điểm cuối (đã trừ muộn) của một người. */
export function finalPointsFor(g: GradeFields, userId: number, which: 'draft' | 'returned'): number | null {
  return applyPenalty(rawPointsFor(g, userId, which), which === 'draft' ? g.penaltyPct : g.returnedPenaltyPct);
}

/** Phần điểm sinh viên ĐƯỢC thấy — chỉ bản đã trả; chưa trả ⇒ null hết (điểm nháp không bao giờ lộ). */
export function studentGrade(g: GradeFields, userId: number): { points: number | null; rawPoints: number | null; penaltyPct: number | null; scores: Record<string, number> | null; returnedAt: Date | null } {
  if (!g.returnedAt) return { points: null, rawPoints: null, penaltyPct: null, scores: null, returnedAt: null };
  return {
    points: finalPointsFor(g, userId, 'returned'),
    rawPoints: rawPointsFor(g, userId, 'returned'),
    penaltyPct: g.returnedPenaltyPct ?? 0,
    scores: g.returnedScores ? asMap(g.returnedScores) : null,
    returnedAt: g.returnedAt,
  };
}

/** Trạng thái hiển thị cho giảng viên: Đã trả / Đã nộp / Muộn / Thiếu (quá hạn chưa nộp) / Được giao. */
export type WorkState = 'RETURNED' | 'TURNED_IN' | 'LATE' | 'MISSING' | 'ASSIGNED';
export function workState(sub: { status: string; late: boolean } | null, dueAt: Date | null, now: Date): WorkState {
  if (sub?.status === 'RETURNED') return 'RETURNED';
  if (sub?.status === 'TURNED_IN') return sub.late ? 'LATE' : 'TURNED_IN';
  if (dueAt && now.getTime() > dueAt.getTime()) return 'MISSING';
  return 'ASSIGNED';
}

// ─── Kiểm tệp nộp ────────────────────────────────────────────────

/** Đuôi KHÔNG BAO GIỜ nhận (thực thi, script chạy được trong trình duyệt/OS). */
export const BLOCKED_EXT = new Set([
  'exe', 'msi', 'dll', 'com', 'scr', 'bat', 'cmd', 'ps1', 'psm1', 'vbs', 'vbe', 'wsf', 'wsh', 'hta', 'cpl', 'jar', 'apk', 'app',
  'dmg', 'pkg', 'deb', 'rpm', 'sh', 'bash', 'zsh', 'command', 'lnk', 'reg', 'html', 'htm', 'xhtml', 'svg', 'shtml', 'php', 'iso',
  'docm', 'xlsm', 'pptm', 'js', 'mjs', 'jse',
]);

type Family = 'pdf' | 'png' | 'jpeg' | 'gif' | 'webp' | 'zip' | 'ole' | 'rar' | '7z' | 'text';
const EXT_FAMILY: Record<string, Family> = {
  pdf: 'pdf', png: 'png', jpg: 'jpeg', jpeg: 'jpeg', gif: 'gif', webp: 'webp',
  docx: 'zip', xlsx: 'zip', pptx: 'zip', zip: 'zip', odt: 'zip', ods: 'zip', odp: 'zip',
  doc: 'ole', xls: 'ole', ppt: 'ole', rar: 'rar', '7z': '7z',
  txt: 'text', md: 'text', csv: 'text', json: 'text', xml: 'text', yml: 'text', yaml: 'text', sql: 'text', log: 'text',
  java: 'text', py: 'text', c: 'text', h: 'text', cpp: 'text', hpp: 'text', cs: 'text', ts: 'text', tsx: 'text', jsx: 'text',
  css: 'text', scss: 'text', kt: 'text', go: 'text', rs: 'text', rb: 'text', swift: 'text', dart: 'text', ipynb: 'text', puml: 'text',
};
const FAMILY_MIME: Record<Family, string> = {
  pdf: 'application/pdf', png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', zip: 'application/zip',
  ole: 'application/octet-stream', rar: 'application/vnd.rar', '7z': 'application/x-7z-compressed', text: 'text/plain; charset=utf-8',
};
const OFFICE_MIME: Record<string, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  doc: 'application/msword', xls: 'application/vnd.ms-excel', ppt: 'application/vnd.ms-powerpoint', csv: 'text/csv; charset=utf-8',
};

export const extOf = (name: string) => (/\.([A-Za-z0-9]{1,8})$/.exec(name)?.[1] ?? '').toLowerCase();

function headMatches(f: Family, b: Buffer): boolean {
  const hex = b.subarray(0, 8).toString('hex');
  switch (f) {
    case 'pdf': return b.subarray(0, 5).toString('latin1') === '%PDF-';
    case 'png': return hex.startsWith('89504e47');
    case 'jpeg': return hex.startsWith('ffd8ff');
    case 'gif': return hex.startsWith('47494638');
    case 'webp': return b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP';
    case 'zip': return hex.startsWith('504b0304') || hex.startsWith('504b0506');
    case 'ole': return hex.startsWith('d0cf11e0a1b11ae1');
    case 'rar': return hex.startsWith('526172211a07');
    case '7z': return hex.startsWith('377abcaf271c');
    case 'text': {
      if (b.subarray(0, 2).toString('latin1') === 'MZ' || hex.startsWith('7f454c46')) return false;
      return !b.subarray(0, 65_536).includes(0);
    }
  }
}

export type FileCheck = { ok: true; mime: string; ext: string; fileName: string } | { ok: false; code: 'FILE_EMPTY' | 'FILE_TOO_BIG' | 'FILE_BLOCKED' | 'FILE_TYPE' | 'FILE_SIGNATURE'; message: string };

/** Kiểm một tệp tải lên: cỡ, đuôi bị chặn, đuôi có hỗ trợ, chữ ký đầu tệp khớp đuôi. Kiểu MIME do MÁY CHỦ quyết theo đuôi. */
export function checkClassFile(fileName: string, buf: Buffer, maxBytes = MAX_SUBMISSION_FILE_BYTES): FileCheck {
  const name = fileName.replace(/[\u0000-\u001f\\/]+/g, '_').trim().slice(-200) || 'file';
  if (!buf.length) return { ok: false, code: 'FILE_EMPTY', message: 'The file is empty' };
  if (buf.length > maxBytes) return { ok: false, code: 'FILE_TOO_BIG', message: `Files must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller` };
  const ext = extOf(name);
  // Đuôi kép kiểu "bai.pdf.exe" bị bắt ở đuôi cuối; "bai.exe.pdf" bị bắt ở chữ ký.
  if (BLOCKED_EXT.has(ext)) return { ok: false, code: 'FILE_BLOCKED', message: `.${ext} files are not allowed` };
  const fam = EXT_FAMILY[ext];
  if (!fam) return { ok: false, code: 'FILE_TYPE', message: ext ? `.${ext} files are not supported — zip them first` : 'Add a file extension (e.g. .pdf, .docx, .zip)' };
  if (!headMatches(fam, buf)) return { ok: false, code: 'FILE_SIGNATURE', message: `The file content does not match .${ext}` };
  return { ok: true, mime: OFFICE_MIME[ext] ?? FAMILY_MIME[fam], ext, fileName: name };
}

// ─── Link nộp ────────────────────────────────────────────────────

export interface SubmissionLink { url: string; label: string }

const LINK_KINDS: Array<[RegExp, string]> = [
  [/(^|\.)github\.com$/, 'GitHub'], [/(^|\.)gitlab\.com$/, 'GitLab'], [/^drive\.google\.com$|^docs\.google\.com$/, 'Google Drive'],
  [/(^|\.)sharepoint\.com$|^onedrive\.live\.com$|^1drv\.ms$/, 'OneDrive'], [/(^|\.)figma\.com$/, 'Figma'], [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube'],
  [/(^|\.)notion\.(so|site)$/, 'Notion'], [/(^|\.)canva\.com$/, 'Canva'],
];

export function normalizeLinks(raw: unknown): SubmissionLink[] {
  if (!Array.isArray(raw)) return [];
  const out: SubmissionLink[] = [];
  const seen = new Set<string>();
  for (const x of raw.slice(0, MAX_LINKS * 2)) {
    const s = typeof x === 'string' ? x : typeof (x as SubmissionLink)?.url === 'string' ? (x as SubmissionLink).url : '';
    let u: URL;
    try { u = new URL(s.trim()); } catch { throw new LinkError(`Not a valid link: ${s.slice(0, 80)}`); }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new LinkError('Links must start with https://');
    const href = u.toString().slice(0, 2000);
    if (seen.has(href)) continue;
    seen.add(href);
    const host = u.hostname.toLowerCase();
    const label = (typeof (x as SubmissionLink)?.label === 'string' && (x as SubmissionLink).label.trim()) || LINK_KINDS.find(([re]) => re.test(host))?.[1] || host;
    out.push({ url: href, label: label.slice(0, 80) });
    if (out.length > MAX_LINKS) throw new LinkError(`At most ${MAX_LINKS} links`);
  }
  return out;
}
export class LinkError extends Error {}

// ─── Đối tượng giao bài ──────────────────────────────────────────

export interface Seat { id: number; userId: number | null; groupId: number | null }
export interface Targeting { kind: string; targetAll: boolean; targetGroupIds: number[]; targetStudentIds: number[] }

/** Sinh viên (ghế đã có tài khoản) được giao bài. Bài nhóm: chỉ người ĐÃ có nhóm thuộc nhóm được giao. */
export function assignedSeats<S extends Seat>(a: Targeting, seats: S[]): S[] {
  const withUser = seats.filter((s) => s.userId !== null);
  if (a.kind === 'GROUP') {
    return withUser.filter((s) => s.groupId !== null && (a.targetAll || a.targetGroupIds.includes(s.groupId)));
  }
  if (a.targetAll) return withUser;
  const g = new Set(a.targetGroupIds);
  const st = new Set(a.targetStudentIds);
  return withUser.filter((s) => st.has(s.id) || (s.groupId !== null && g.has(s.groupId)));
}

export const ownerKeyOf = (kind: string, userId: number, groupId: number | null) => (kind === 'GROUP' ? (groupId ? `G${groupId}` : null) : `U${userId}`);

// ─── Sổ điểm ─────────────────────────────────────────────────────

export interface GbItem { key: string; category: string; topic: string | null; maxPoints: number }
export interface GbCell { points: number | null; missing?: boolean }

export function normalizeWeights(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>).slice(0, 40)) {
    const n = Number(v);
    const key = k.trim().slice(0, 80);
    if (key && Number.isFinite(n) && n >= 0 && n <= 100) out[key] = r2(n);
  }
  return out;
}

const groupKey = (mode: GradebookMode, it: GbItem) => (mode === 'TOPIC' ? (it.topic?.trim() || 'No topic') : (it.category?.trim() || 'Assignment'));

/**
 * Điểm tổng hệ 10 của một sinh viên. Ô chưa có điểm bị bỏ qua (missingAsZero ⇒ ô `missing` tính 0).
 * Không có ô nào ⇒ null (không đoán).
 */
export function totalOf(items: GbItem[], cells: Map<string, GbCell>, mode: GradebookMode, weights: Record<string, number>, missingAsZero = false): { total: number | null; byGroup: Record<string, number | null> } {
  const pts = (it: GbItem): number | null => {
    const c = cells.get(it.key);
    if (c?.points !== null && c?.points !== undefined) return c.points;
    if (missingAsZero && c?.missing) return 0;
    return null;
  };
  const scored = items.filter((it) => it.maxPoints > 0 && pts(it) !== null);
  const byGroup: Record<string, number | null> = {};
  if (mode === 'POINTS') {
    if (!scored.length) return { total: null, byGroup };
    const got = scored.reduce((a, it) => a + Math.min(pts(it)!, it.maxPoints * 2), 0);
    const max = scored.reduce((a, it) => a + it.maxPoints, 0);
    return { total: r2(Math.min(10, (got / max) * 10)), byGroup };
  }
  const groups = new Map<string, GbItem[]>();
  for (const it of items) { const k = groupKey(mode, it); groups.set(k, [...(groups.get(k) ?? []), it]); }
  let wsum = 0, acc = 0;
  for (const [k, list] of groups) {
    const s = list.filter((it) => it.maxPoints > 0 && pts(it) !== null);
    if (!s.length) { byGroup[k] = null; continue; }
    const pct = s.reduce((a, it) => a + pts(it)!, 0) / s.reduce((a, it) => a + it.maxPoints, 0);
    byGroup[k] = r2(Math.min(10, pct * 10));
    const w = weights[k] ?? 0;
    if (w > 0) { wsum += w; acc += pct * w; }
  }
  if (!wsum) return { total: null, byGroup };
  return { total: r2(Math.min(10, (acc / wsum) * 10)), byGroup };
}

// ─── Nhập điểm từ xlsx ───────────────────────────────────────────

export interface ImportStudent { userId: number; studentCode: string | null; email: string | null; name: string }
export interface ImportItem { key: string; title: string; maxPoints: number; importable: boolean }
export interface ImportRow { line: number; userId: number | null; who: string; values: Array<{ itemKey: string; points: number | null }>; errors: string[] }
export interface ImportPreview { columns: Array<{ col: number; header: string; itemKey: string | null; reason?: string }>; rows: ImportRow[]; valid: number; invalid: number; cells: number }

const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const norm = (s: string) => fold(String(s ?? '')).replace(/\s+/g, ' ').trim();
const HEAD_CODE = new Set(['mssv', 'student code', 'student id', 'ma sv', 'ma sinh vien', 'roll number', 'code']);
const HEAD_EMAIL = new Set(['email', 'e-mail', 'mail']);
const HEAD_SKIP = new Set(['name', 'full name', 'ho ten', 'ho va ten', 'student', 'sinh vien', 'group', 'nhom', 'total', 'tong', 'total (10)', 'tong (10)', '#', 'stt', 'no']);

/** Đọc bảng (dòng 1 = tiêu đề) ⇒ xem trước. Cột lạ ⇒ bỏ qua có lý do; ô trống ⇒ không đổi; ô sai ⇒ lỗi dòng. */
export function parseGradeImport(table: string[][], items: ImportItem[], students: ImportStudent[]): ImportPreview {
  const head = (table[0] ?? []).map((h) => String(h ?? '').trim());
  const byTitle = new Map<string, ImportItem>();
  for (const it of items) if (!byTitle.has(norm(it.title))) byTitle.set(norm(it.title), it);
  let codeCol = -1, emailCol = -1;
  const columns: ImportPreview['columns'] = [];
  head.forEach((h, i) => {
    const n = norm(h);
    if (!n) return;
    if (codeCol < 0 && HEAD_CODE.has(n)) { codeCol = i; return; }
    if (emailCol < 0 && HEAD_EMAIL.has(n)) { emailCol = i; return; }
    if (HEAD_SKIP.has(n)) return;
    const base = n.replace(/\s*\((max )?[\d.,]+\)\s*$/, '').trim();
    const it = byTitle.get(n) ?? byTitle.get(base);
    if (!it) columns.push({ col: i, header: h, itemKey: null, reason: 'NO_MATCH' });
    else if (!it.importable) columns.push({ col: i, header: h, itemKey: null, reason: 'NOT_IMPORTABLE' });
    else columns.push({ col: i, header: h, itemKey: it.key });
  });
  const byCode = new Map(students.filter((s) => s.studentCode).map((s) => [s.studentCode!.toUpperCase(), s]));
  const byEmail = new Map(students.filter((s) => s.email).map((s) => [s.email!.toLowerCase(), s]));
  const used = columns.filter((c) => c.itemKey);
  const rows: ImportRow[] = [];
  const seen = new Set<number>();
  for (let r = 1; r < Math.min(table.length, 2001); r++) {
    const row = table[r] ?? [];
    if (!row.some((c) => String(c ?? '').trim())) continue;
    const errors: string[] = [];
    const code = codeCol >= 0 ? String(row[codeCol] ?? '').trim().toUpperCase() : '';
    const email = emailCol >= 0 ? String(row[emailCol] ?? '').trim().toLowerCase() : '';
    const st = (code && byCode.get(code)) || (email && byEmail.get(email)) || null;
    if (codeCol < 0 && emailCol < 0) errors.push('NO_ID_COLUMN');
    else if (!st) errors.push('UNKNOWN_STUDENT');
    else if (seen.has(st.userId)) errors.push('DUPLICATE_STUDENT');
    if (st) seen.add(st.userId);
    const values: ImportRow['values'] = [];
    for (const c of used) {
      const raw = String(row[c.col] ?? '').trim();
      if (!raw) continue;
      const it = items.find((x) => x.key === c.itemKey)!;
      const n = Number(raw.replace(',', '.'));
      if (!Number.isFinite(n) || n < 0) { errors.push(`BAD_NUMBER:${c.header}`); continue; }
      if (n > it.maxPoints) { errors.push(`OVER_MAX:${c.header}`); continue; }
      values.push({ itemKey: it.key, points: r2(n) });
    }
    rows.push({ line: r + 1, userId: st?.userId ?? null, who: st?.name ?? (code || email || '—'), values, errors });
  }
  const valid = rows.filter((x) => !x.errors.length);
  return { columns, rows, valid: valid.length, invalid: rows.length - valid.length, cells: valid.reduce((a, x) => a + x.values.length, 0) };
}
