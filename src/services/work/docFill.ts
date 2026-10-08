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

export interface ChangeRow { date: string; action: 'A' | 'M' | 'D'; inCharge: string; description: string }

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
    const note = v.note?.replace(/^Created from template “.*”$/, '').trim() || '';
    if (!prev || v.kind === 'CREATE') {
      rows.push({ date, action: 'A', inCharge, description: note || (cur.size ? `First version: ${list([...cur.keys()])}` : 'First version') });
    } else if (v.kind === 'RESTORE') {
      rows.push({ date, action: 'M', inCharge, description: note || 'Restored an earlier version' });
    } else {
      const added = [...cur.keys()].filter((k) => !prev!.has(k));
      const removed = [...prev.keys()].filter((k) => !cur.has(k));
      const changed = [...cur.keys()].filter((k) => prev!.has(k) && prev!.get(k) !== cur.get(k));
      const out: ChangeRow[] = [];
      if (added.length) out.push({ date, action: 'A', inCharge, description: `Added ${list(added)}` });
      if (removed.length) out.push({ date, action: 'D', inCharge, description: `Deleted ${list(removed)}` });
      if (changed.length) out.push({ date, action: 'M', inCharge, description: `Updated ${list(changed)}` });
      if (!out.length) out.push({ date, action: 'M', inCharge, description: 'Edited the document' });
      // Ghi chú người viết ("Save version…") nói đúng ý hơn danh sách mục ⇒ thay mô tả dòng đầu.
      if (note) out[0].description = note;
      rows.push(...out);
    }
    prev = cur;
  }
  return rows;
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

export const changesTable = (rows: ChangeRow[]) => buildTable(['Date', 'A* M, D', 'In charge', 'Change Description'], rows.map((r) => [r.date, r.action, r.inCharge, r.description]));
