/**
 * CT Work — CTW đợt 3A: phần THUẦN của "điền từ dữ liệu dự án" cho tài liệu (test ở docFill.test.ts).
 *
 *   - A10 Record of Changes: dựng từ lịch sử phiên bản trang. Mỗi phiên bản một dòng (server đã gộp các lần tự lưu
 *     của cùng người trong 10 phút). A/M/D suy từ ĐỀ MỤC: bản đầu = A; bản sau thêm đề mục = A, mất đề mục = D,
 *     còn lại = M. Mô tả = ghi chú của phiên bản (Save version…) nếu có, không thì tên các mục đã đổi.
 *   - Thay bảng NGAY SAU một đề mục (theo tên đề mục) — cách mẫu FPT đặt bảng: "1.3 Project Team" + bảng, "1.3 Project
 *     Risks" + bảng… Không tìm thấy đề mục ⇒ không đụng gì (trang không theo mẫu vẫn an toàn).
 */

import type { PmNode } from './docMarkdown.js';
import { plainText } from './docExport.js';

export interface VersionLite {
  n: number;
  kind: string;
  note: string | null;
  createdAt: Date;
  author: string | null;
  contentJson: unknown;
}

export interface ChangeRow { date: string; action: 'A' | 'M' | 'D'; inCharge: string; description: string; /** ms — để trộn dòng phiên bản với dòng CR theo thời gian. */ at?: number }

const ddmmyyyy = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

/** Đề mục (mức ≤ 3) ⇒ chữ của khúc nội dung dưới nó. Dùng để biết mục nào được thêm/xoá/sửa. */
export function sectionsOf(doc: unknown): Map<string, string> {
  const out = new Map<string, string>();
  let cur = '';
  let buf: string[] = [];
  const flush = () => { if (cur) out.set(cur, buf.join('\n')); };
  for (const b of ((doc as PmNode | null)?.content ?? [])) {
    if (b.type === 'heading' && Number(b.attrs?.level ?? 1) <= 3) {
      flush();
      cur = plainText(b).trim();
      buf = [];
      continue;
    }
    buf.push(JSON.stringify(b));
  }
  flush();
  return out;
}

const list = (xs: string[], max = 4) => (xs.length > max ? `${xs.slice(0, max).join(', ')} and ${xs.length - max} more` : xs.join(', '));

/** Lịch sử phiên bản (tăng dần theo n) ⇒ các dòng Record of Changes. */
export function recordOfChanges(versions: VersionLite[]): ChangeRow[] {
  const rows: ChangeRow[] = [];
  const sorted = [...versions].sort((a, b) => a.n - b.n);
  let prev: Map<string, string> | null = null;
  for (const v of sorted) {
    const cur = sectionsOf(v.contentJson);
    const inCharge = v.author ?? '';
    const date = ddmmyyyy(v.createdAt);
    const at = v.createdAt.getTime();
    const note = v.note?.replace(/^Created from template “.*”$/, '').trim() || '';
    if (!prev || v.kind === 'CREATE') {
      rows.push({ date, at, action: 'A', inCharge, description: note || (cur.size ? `First version: ${list([...cur.keys()])}` : 'First version') });
    } else if (v.kind === 'RESTORE') {
      rows.push({ date, at, action: 'M', inCharge, description: note || 'Restored an earlier version' });
    } else {
      const added = [...cur.keys()].filter((k) => !prev!.has(k));
      const removed = [...prev.keys()].filter((k) => !cur.has(k));
      const changed = [...cur.keys()].filter((k) => prev!.has(k) && prev!.get(k) !== cur.get(k));
      const out: ChangeRow[] = [];
      if (added.length) out.push({ date, at, action: 'A', inCharge, description: `Added ${list(added)}` });
      if (removed.length) out.push({ date, at, action: 'D', inCharge, description: `Deleted ${list(removed)}` });
      if (changed.length) out.push({ date, at, action: 'M', inCharge, description: `Updated ${list(changed)}` });
      if (!out.length) out.push({ date, at, action: 'M', inCharge, description: 'Edited the document' });
      // Ghi chú người viết ("Save version…") nói đúng ý hơn danh sách mục ⇒ thay mô tả dòng đầu.
      if (note) out[0].description = note;
      rows.push(...out);
    }
    prev = cur;
  }
  return rows;
}

// ─── dm5 G2 (B21): Record of Changes từ Change Request đã IMPLEMENTED ─

export interface CrLite { number: number; title: string; reason: string | null; implementedAt: Date; inCharge: string | null; refs: string[] }

/** A/M/D của một CR suy từ chữ (tiêu đề + lý do): thêm ⇒ A, bỏ/xoá ⇒ D, còn lại ⇒ M. */
export function crAction(text: string): 'A' | 'M' | 'D' {
  const v = text.toLowerCase();
  if (/\b(remove[sd]?|delete[sd]?|drop(?:ped|s)?|retire[sd]?|deprecate[sd]?)\b|\b(xo[áa]|bỏ|loại bỏ|gỡ)\b/.test(v)) return 'D';
  if (/\b(add(?:s|ed)?|new|introduce[sd]?|create[sd]?)\b|\b(thêm|bổ sung|tạo mới)\b/.test(v)) return 'A';
  return 'M';
}

/** Mỗi CR đã IMPLEMENTED một dòng: "CR-4: <tiêu đề> (UC-03, BR-02)". */
export function crChangeRows(crs: CrLite[]): ChangeRow[] {
  return [...crs].sort((a, b) => a.implementedAt.getTime() - b.implementedAt.getTime() || a.number - b.number).map((c) => ({
    date: ddmmyyyy(c.implementedAt), at: c.implementedAt.getTime(), action: crAction(`${c.title} ${c.reason ?? ''}`), inCharge: c.inCharge ?? '',
    description: `CR-${c.number}: ${c.title}${c.refs.length ? ` (${c.refs.slice(0, 8).join(', ')}${c.refs.length > 8 ? '…' : ''})` : ''}`.slice(0, 600),
  }));
}

/** Trộn dòng phiên bản trang + dòng CR theo thời gian (giữ thứ tự gốc khi cùng lúc: phiên bản trước, CR sau). */
export function mergeChangeRows(versionRows: ChangeRow[], crRows: ChangeRow[]): ChangeRow[] {
  const tagged = [...versionRows.map((r, i) => ({ r, k: 0, i })), ...crRows.map((r, i) => ({ r, k: 1, i }))];
  return tagged.sort((a, b) => (a.r.at ?? 0) - (b.r.at ?? 0) || a.k - b.k || a.i - b.i).map((x) => x.r);
}

// ─── Bảng sau đề mục ─────────────────────────────────────────────

const txt = (t: string): PmNode => ({ type: 'text', text: t });
const cellP = (t: string, bold = false): PmNode => (t ? { type: 'paragraph', content: [bold ? { type: 'text', text: t, marks: [{ type: 'bold' }] } : txt(t)] } : { type: 'paragraph' });

export function buildTable(header: string[], rows: string[][]): PmNode {
  const cols = header.length;
  const cell = (type: string, t: string): PmNode => ({ type, attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [cellP(t)] });
  return {
    type: 'table',
    content: [
      { type: 'tableRow', content: header.map((h) => cell('tableHeader', h)) },
      ...(rows.length ? rows : [Array.from({ length: cols }, () => '')]).map((r) => ({
        type: 'tableRow',
        content: Array.from({ length: cols }, (_, i) => cell('tableCell', r[i] ?? '')),
      })),
    ],
  };
}

/** Chữ các ô của một dòng bảng (đọc lại bảng đang có — giữ cột đầu khi chỉ thay tiêu đề). */
export function tableRowsText(table: PmNode): string[][] {
  return (table.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c).trim()));
}

/**
 * Tìm đề mục khớp `match` (theo chữ, bỏ số thứ tự), rồi bảng ĐẦU TIÊN sau nó trước đề mục kế; `make(old)` trả bảng mới.
 * Không có bảng ⇒ chèn ngay sau đề mục (bỏ qua ghi chú/đoạn mở đầu). Trả số chỗ đã thay.
 */
export function replaceTableAfterHeading(doc: PmNode, match: RegExp, make: (old: PmNode | null) => PmNode | null): number {
  const blocks = doc.content ?? [];
  let done = 0;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== 'heading' || !match.test(plainText(b).replace(/^(?:[IVX]+\.|\d+(?:\.\d+)*\.?)\s+/, '').trim())) continue;
    let j = i + 1;
    while (j < blocks.length && blocks[j].type !== 'heading' && blocks[j].type !== 'table') j++;
    const old = j < blocks.length && blocks[j].type === 'table' ? blocks[j] : null;
    const next = make(old);
    if (!next) continue;
    if (old) blocks[j] = next;
    else blocks.splice(i + 1, 0, next);
    done++;
  }
  doc.content = blocks;
  return done;
}

// ─── Dữ liệu Report 1/2 ──────────────────────────────────────────

export interface TeamMember { name: string; role: string }
export interface RiskLite { title: string; description: string | null; probability: number | null; impact: number | null; mitigation: string | null; response: string | null }
export interface StageLite { n: number; name: string; issues: Array<{ title: string; isEpic: boolean; effortDays: number | null; due: Date | null }> }
export interface VersionMilestone { name: string; releaseDate: Date | null; status: string }

const level = (v: number | null) => (v === null ? '' : v >= 4 ? 'High' : v >= 3 ? 'Medium' : 'Low');
const pds = (n: number) => (Math.round(n * 10) / 10).toString();

export const teamTable = (team: TeamMember[]) => buildTable(['Full Name', 'Role', 'Email', 'Mobile'], team.map((m) => [m.name, m.role, '', '']));

export const risksTable = (risks: RiskLite[]) => buildTable(
  ['#', 'Risk Description', 'Impact', 'Possibility', 'Response Plans'],
  risks.map((r, i) => [String(i + 1), r.description ? `${r.title} — ${r.description}`.slice(0, 600) : r.title, level(r.impact), level(r.probability), (r.mitigation || (r.response ? r.response.charAt(0) + r.response.slice(1).toLowerCase() : '')).slice(0, 600)]),
);

/** Cost & Time Estimations: mỗi giai đoạn một dòng (tổng effort + hạn muộn nhất), dưới là epic/việc của giai đoạn; cuối là mốc phát hành (version). */
export function scheduleTable(stages: StageLite[], versions: VersionMilestone[]): PmNode {
  const rows: string[][] = [];
  const latest = (ds: Array<Date | null>) => ds.filter((d): d is Date => !!d).sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  stages.forEach((s, si) => {
    const total = s.issues.reduce((a, x) => a + (x.effortDays ?? 0), 0);
    rows.push([String(si + 1), /^Stage \d+\s*:/i.test(s.name) ? s.name : `Stage ${si + 1}: ${s.name}`, total ? pds(total) : '', latest(s.issues.map((x) => x.due)) ? ddmmyyyy(latest(s.issues.map((x) => x.due))!) : '']);
    const items = s.issues.filter((x) => x.isEpic).length ? s.issues.filter((x) => x.isEpic) : s.issues;
    items.slice(0, 30).forEach((x, k) => rows.push([`${si + 1}.${k + 1}`, x.title, x.effortDays ? pds(x.effortDays) : '', x.due ? ddmmyyyy(x.due) : '']));
  });
  if (versions.length) {
    const m = stages.length + 1;
    rows.push([String(m), 'Milestones (releases)', '', '']);
    versions.forEach((v, k) => rows.push([`${m}.${k + 1}`, `${v.name}${v.status === 'RELEASED' ? ' (released)' : ''}`, '', v.releaseDate ? ddmmyyyy(v.releaseDate) : '']));
  }
  return buildTable(['#', 'Work Package', 'Est. Effort (pds)', 'Deadline'], rows);
}

/** RACI: giữ cột "Work Package" (các dòng của mẫu), đổi cột thành viên theo người thật của dự án; ô cũ giữ nếu cùng vị trí người. */
export function raciTable(old: PmNode | null, people: string[]): PmNode | null {
  if (!people.length) return null;
  const prev = old ? tableRowsText(old) : [];
  const packages = prev.length > 1 ? prev.slice(1).map((r) => r[0] ?? '') : ['Project Planning & Tracking'];
  const oldHead = prev[0] ?? [];
  return buildTable(['Work Package', ...people], packages.map((wp, ri) => [wp, ...people.map((p) => {
    const ci = oldHead.indexOf(p);
    return ci > 0 ? (prev[ri + 1]?.[ci] ?? '') : '';
  })]));
}

// ─── dm5 G2 (B2): RACI Report 2 §3 theo VAI ──────────────────────

export type RaciMode = 'people' | 'roles' | 'honest';
export const RACI_MODES: RaciMode[] = ['people', 'roles', 'honest'];
export interface RaciMatrixLite {
  activities: Array<{ id: number; name: string }>;
  stakeholders: Array<{ id: number; name: string; kind: string; userId: number | null; role: string | null }>;
  cells: Array<{ activityId: number; stakeholderId: number; role: string }>;
}
export interface RaciPerson { userId: number; name: string; lecturer: boolean }

/** Gộp nhiều mũ thành một cột (chế độ trung thực): A thắng R thắng C thắng I. */
export function mergeRaci(roles: string[]): string {
  for (const r of ['A', 'R', 'C', 'I']) if (roles.includes(r)) return r;
  return '';
}
const SUPERVISOR_RE = /supervisor|lecturer|mentor|advisor|giảng viên|gvhd|teacher/i;
/** Hoạt động yêu cầu mặc định (SWR) — thuộc RACI của SRS, không phải gói việc Report 2. */
const REQ_ACTIVITIES = new Set(['elicit requirements', 'analyze and model requirements', 'write the srs', 'review and validate requirements', 'approve the requirements baseline', 'decide on change requests', 'accept the delivered product']);
export const REPORT2_PACKAGES = ['Project Planning & Tracking', 'Prepare Project Introduction Document', 'Prepare SRS Document', 'Prepare SDS Document', 'Software Testing Documentation', 'Software User Guide', 'Final Report', 'Presentation Slide'];

/**
 * Bảng RACI Report 2 §3: hàng = gói việc của mẫu (giữ hàng người đã gõ) + hoạt động tự thêm trong ma trận RACI (trừ hoạt
 * động yêu cầu mặc định của SRS). Cột theo chế độ:
 *   roles   một cột mỗi stakeholder kiểu ROLE (5 mũ C1–C5) — RACI NỘI BỘ để điều phối, không nộp
 *   honest  một cột mỗi người thật (gộp mọi mũ của người đó: A > R > C > I) + cột "Supervisor" — bản NỘP trường khi làm một mình
 *   people  một cột mỗi người thật (như cũ), ô lấy từ ma trận nếu có
 * Ô ma trận không có ⇒ giữ ô cũ cùng tên cột (không xoá chữ người đã gõ).
 */
export function raciReport2Table(old: PmNode | null, o: { mode: RaciMode; people: RaciPerson[]; matrix: RaciMatrixLite }): PmNode | null {
  const prev = old ? tableRowsText(old) : [];
  const oldHead = prev[0] ?? [];
  const base = prev.length > 1 ? prev.slice(1).map((r) => r[0] ?? '').filter(Boolean) : [...REPORT2_PACKAGES];
  const extra = o.matrix.activities.filter((a) => !REQ_ACTIVITIES.has(a.name.trim().toLowerCase()) && !base.some((b) => b.trim().toLowerCase() === a.name.trim().toLowerCase())).map((a) => a.name);
  const packages = [...base, ...extra];
  const actOf = new Map(o.matrix.activities.map((a) => [a.name.trim().toLowerCase(), a.id]));
  const roleOf = (activityId: number | undefined, ids: number[]) => (activityId === undefined ? '' : mergeRaci(o.matrix.cells.filter((c) => c.activityId === activityId && ids.includes(c.stakeholderId)).map((c) => c.role)));
  const hats = o.matrix.stakeholders.filter((s) => s.kind === 'ROLE');
  const students = o.people.filter((p) => !p.lecturer);
  const lecturerIds = new Set(o.people.filter((p) => p.lecturer).map((p) => p.userId));
  /** stakeholder của một người: PERSON gắn userId + mũ ROLE gắn userId (một người duy nhất ⇒ mọi mũ chưa gắn ai). */
  const idsOfPerson = (p: RaciPerson) => o.matrix.stakeholders.filter((s) => s.userId === p.userId || (s.kind === 'ROLE' && s.userId === null && students.length === 1)).map((s) => s.id);
  const supervisorIds = o.matrix.stakeholders.filter((s) => (s.userId !== null && lecturerIds.has(s.userId)) || SUPERVISOR_RE.test(`${s.name} ${s.role ?? ''}`)).map((s) => s.id);
  let cols: Array<{ head: string; ids: number[] }>;
  if (o.mode === 'roles') cols = hats.map((h) => ({ head: h.name, ids: [h.id] }));
  else if (o.mode === 'honest') cols = [...students.map((p) => ({ head: p.name, ids: idsOfPerson(p) })), { head: 'Supervisor', ids: supervisorIds }];
  else cols = students.map((p) => ({ head: p.name, ids: idsOfPerson(p) }));
  if (!cols.length) return null;
  return buildTable(['Work Package', ...cols.map((c) => c.head)], packages.map((wp) => {
    const ri = prev.findIndex((r, i) => i > 0 && (r[0] ?? '').trim().toLowerCase() === wp.trim().toLowerCase());
    return [wp, ...cols.map((c) => {
      const v = roleOf(actOf.get(wp.trim().toLowerCase()), c.ids);
      if (v) return v;
      const ci = oldHead.indexOf(c.head);
      return ci > 0 && ri > 0 ? (prev[ri]?.[ci] ?? '') : '';
    })];
  }));
}

/** Câu ghi chú dưới bảng RACI trung thực (bài s01/b6): một người luân phiên các mũ. */
export function honestRaciNote(hats: string[]): string {
  return `Note: this is a one-person project — the student rotates across the ${hats.length ? hats.join(', ') : 'BA, Architect, Developer and QA'} hats; the internal per-hat RACI is kept in CT Work.`;
}

export const changesTable = (rows: ChangeRow[]) => buildTable(['Date', 'A* M, D', 'In charge', 'Change Description'], rows.map((r) => [r.date, r.action, r.inCharge, r.description]));
