/**
 * CT Work — CTW đợt 4 (09/10/2026): REPORT 7 FINAL (A18) — phần THUẦN ghép Report 1–6 thành bản cuối (test ở ctw4.test.ts).
 *
 * Bố cục theo tệp gốc `Report7_Final Project Report.docx` (đã đọc bằng python-docx): Acknowledgement · Definition and
 * Acronyms · I. Project Introduction · II. Project Management Plan · III. Software Requirement Specification ·
 * IV. Software Design Description · V. Software Testing Documentation · VI. Release Package & User Guides.
 *
 * Mỗi Report k (trang Docs theo mẫu FPT) ⇒ phần k:
 *   - bỏ tiêu đề trang ("Report k – …") nếu có, bỏ mục "Record of Changes" (mỗi Report có riêng — bản Final không lặp),
 *     bỏ ghi chú hướng dẫn của mẫu ("Guide:", "Purpose:"…);
 *   - mục H1 chính của Report (vd "II. Software Requirement Specification") ⇒ thay bằng tiêu đề phần của Report 7, các
 *     mục con giữ nguyên mức (H2 "1. Overall Requirements"…) — đúng như bản gốc;
 *   - bảng "Definition and Acronyms" của Report 1 ⇒ mục Definition and Acronyms của bản Final (nếu Report 7 chưa điền).
 * Phần nào thiếu Report ⇒ GIỮ nội dung đang có của trang Report 7 ở phần đó (không xoá chữ người đã viết).
 */

import type { PmNode } from './docMarkdown.js';
import { plainText } from './docExport.js';
import { findHeading, sectionEnd } from './srs.js';

export const FINAL_PARTS = [
  { n: 1, title: 'I. Project Introduction' },
  { n: 2, title: 'II. Project Management Plan' },
  { n: 3, title: 'III. Software Requirement Specification' },
  { n: 4, title: 'IV. Software Design Description' },
  { n: 5, title: 'V. Software Testing Documentation' },
  { n: 6, title: 'VI. Release Package & User Guides' },
] as const;

const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level }, content: [{ type: 'text', text }] });
const isH = (n: PmNode, level?: number) => n.type === 'heading' && (level === undefined || Number(n.attrs?.level ?? 1) === level);
const isGuide = (n: PmNode) => n.type === 'blockquote' && /^\s*(Guide|Purpose|Who fills|When|Standard|Mục đích|Ai điền|Khi nào|Chuẩn tham chiếu|Hướng dẫn)\s*:/i.test(plainText(n));
const txt = (n: PmNode) => plainText(n).replace(/^(?:[IVX]+\.|\d+(?:\.\d+)*\.?)\s+/, '').trim();

/** Bảng có ít nhất một ô dữ liệu (ngoài hàng tiêu đề) có chữ. */
export function tableHasData(t: PmNode | undefined): boolean {
  if (!t || t.type !== 'table') return false;
  return (t.content ?? []).slice(1).some((r) => (r.content ?? []).some((c) => plainText(c).trim().length > 0));
}

/** Thân + bảng định nghĩa của MỘT Report (nội dung trang). */
export function reportBody(doc: unknown): { body: PmNode[]; definitions: PmNode | null; hasContent: boolean } {
  let blocks = [...(((doc as PmNode | null)?.content) ?? [])].filter((b) => !isGuide(b));
  // Tiêu đề trang "Report 3 – …" (khi trang nhập từ Markdown giữ dòng #).
  if (blocks[0] && isH(blocks[0], 1) && /^Report\s*\d/i.test(plainText(blocks[0]).trim())) blocks = blocks.slice(1);
  let definitions: PmNode | null = null;
  const out: PmNode[] = [];
  const h1 = blocks.map((b, i) => (isH(b, 1) ? i : -1)).filter((i) => i >= 0);
  if (!h1.length) return { body: blocks, definitions, hasContent: blocks.some((b) => plainText(b).trim().length > 0) };
  // Đoạn trước H1 đầu tiên (nếu có) giữ lại.
  out.push(...blocks.slice(0, h1[0]));
  let mainUsed = false;
  h1.forEach((start, k) => {
    const end = k + 1 < h1.length ? h1[k + 1] : blocks.length;
    const title = txt(blocks[start]);
    const inner = blocks.slice(start + 1, end);
    if (/^Record of Changes$/i.test(title)) return;
    if (/^Definitions?( and| &) Acronyms$/i.test(title)) {
      definitions = inner.find((b) => b.type === 'table') ?? null;
      return;
    }
    if (!mainUsed) { out.push(...inner); mainUsed = true; return; }
    // H1 phụ khác ⇒ hạ thành H2 để không chen ngang phần của Report 7.
    out.push(heading(2, plainText(blocks[start]).trim()), ...inner);
  });
  return { body: out, definitions, hasContent: out.some((b) => plainText(b).trim().length > 0 && !isH(b)) };
}

export interface FinalSource { n: number; doc: unknown; label: string }

/**
 * Ghép bản Final vào một BẢN SAO nội dung trang Report 7 (`current`: nội dung đang có, hoặc mẫu Report 7).
 * Trả nội dung mới + phần đã ghép / còn thiếu.
 */
export function assembleFinal(current: unknown, sources: FinalSource[]): { doc: PmNode; merged: number[]; missing: number[]; notes: string[] } {
  const base = JSON.parse(JSON.stringify(current ?? { type: 'doc', content: [] })) as PmNode;
  const blocks = [...(base.content ?? [])];
  const sectionOf = (re: RegExp) => {
    const i = findHeading(blocks, re);
    return i < 0 ? null : { i, end: sectionEnd(blocks, i), body: blocks.slice(i + 1, sectionEnd(blocks, i)) };
  };
  const out: PmNode[] = [];
  // Acknowledgement — giữ chữ người viết trong Report 7.
  const ack = sectionOf(/^Acknowledge?ments?$/i);
  out.push(heading(1, 'Acknowledgement'), ...(ack?.body.length ? ack.body : [{ type: 'paragraph' }]));
  // Definition and Acronyms — của Report 7 nếu đã điền, không thì của Report 1.
  const defs = sectionOf(/^Definitions?( and| &) Acronyms$/i);
  const r1 = sources.find((s) => s.n === 1);
  const r1defs = r1 ? reportBody(r1.doc).definitions : null;
  const ownTable = defs?.body.find((b) => b.type === 'table');
  out.push(heading(1, 'Definition and Acronyms'), ...(tableHasData(ownTable) || !r1defs ? (defs?.body ?? []) : [r1defs]));
  const merged: number[] = [];
  const missing: number[] = [];
  const notes: string[] = [];
  for (const part of FINAL_PARTS) {
    const src = sources.find((s) => s.n === part.n);
    const rb = src ? reportBody(src.doc) : null;
    out.push(heading(1, part.title));
    if (rb && rb.hasContent) {
      out.push(...rb.body);
      merged.push(part.n);
      notes.push(`Report ${part.n} (${src!.label})`);
    } else {
      // Không có Report (hoặc trang còn trống mẫu) ⇒ giữ phần của Report 7.
      const keep = sectionOf(new RegExp(`^${part.title.replace(/^[IVX]+\.\s*/, '').replace(/[.*+?^${}()|[\]\\&]/g, (c) => (c === '&' ? '(&|and)' : `\\${c}`))}$`, 'i'));
      out.push(...(keep?.body ?? []));
      missing.push(part.n);
    }
  }
  base.content = out;
  return { doc: base, merged, missing, notes };
}

// ─── dm5 G2 (B19): ĐỐI SOÁT CHÉO trước khi ghép ──────────────────
//
// Người chấm SEP490 lật Report 7 rồi so: mã FE/UC/BR/SM/LI giữa các phần có khớp không, số test + tỉ lệ pass ở Phần V có
// đúng dữ liệu kiểm thử không, tổng effort Phần II có khớp giờ đã log không, còn sót chữ mẫu không. Hàm thuần dưới đây làm
// đúng các phép so đó trên NỘI DUNG Report 1–6 + số liệu thật của dự án. Có lỗi ⇒ vẫn ghép (người quyết), giao diện hiện
// banner đỏ liệt kê.

export type FinalCheckCode = 'CODE_UNKNOWN' | 'CODE_DUPLICATE' | 'NAME_MISMATCH' | 'TEST_COUNT_MISMATCH' | 'PASS_RATE_MISMATCH' | 'TEST_NUMBERS_MISSING' | 'EFFORT_MISMATCH' | 'TEMPLATE_LEFTOVER';
export interface FinalCheck { code: FinalCheckCode; severity: 'error' | 'warning'; report: number | null; message: string; items: string[] }

export const CODE_FAMILIES = ['FE', 'UC', 'BR', 'SM', 'LI'] as const;
export type CodeFamily = (typeof CODE_FAMILIES)[number];
export interface TestLevelFacts { total: number; passed: number }
export interface FinalFacts {
  /** Mã đang có trong sổ của dự án ⇒ tên (FE-1 ⇒ "Booking"). LI không có sổ ⇒ chỉ soát trùng. */
  registers: Partial<Record<Exclude<CodeFamily, 'LI'>, Map<number, string>>>;
  tests: { unit: TestLevelFacts; integration: TestLevelFacts; system: TestLevelFacts };
  /** Tổng giờ đã log (worklog) của dự án. */
  loggedHours: number;
}

const codeRe = (fam: CodeFamily) => new RegExp(`(?<![A-Za-z0-9])${fam}-?(\\d{1,4})(?![0-9])`, 'g');
const fmtCode = (fam: CodeFamily, n: number) => (fam === 'FE' || fam === 'LI' ? `${fam}-${n}` : `${fam}-${String(n).padStart(2, '0')}`);
const normName = (s: string) => s.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** Mọi bảng của một doc (kể cả lồng trong khối khác). */
function tablesOf(doc: unknown): PmNode[] {
  const out: PmNode[] = [];
  const walk = (n: PmNode) => { if (n.type === 'table') out.push(n); for (const c of n.content ?? []) walk(c); };
  walk((doc ?? { type: 'doc' }) as PmNode);
  return out;
}
const rowsOf = (t: PmNode) => (t.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c).trim()));

/** Mục (đề mục khớp re) ⇒ các khối thân (theo cấp đề mục). */
function sectionBlocks(doc: unknown, re: RegExp): PmNode[][] {
  const blocks = (((doc as PmNode | null)?.content) ?? []);
  const out: PmNode[][] = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type !== 'heading' || !re.test(txt(blocks[i]))) continue;
    out.push(blocks.slice(i + 1, sectionEnd(blocks, i)));
  }
  return out;
}

const PLACEHOLDER_RES: Array<[RegExp, string]> = [
  [/<[^<>\n]{2,60}>/g, '<…>'],
  [/\bTBD\b|\bTODO\b|\bLorem ipsum\b/gi, 'TBD'],
  [/\b(?:Feature|Use case|Screen|Package|Workflow|Table)[ _]name\b|\bTABLE_NAME\b|\bClassName\b|\bActor \d Features?\b|\bMember \d\b|\bFeature group \d\b/g, 'template name'],
];

/** Số nguyên/thập phân trong một ô ("45", "93.3 %", "93,3%"). */
const numIn = (s: string) => { const m = /(\d+(?:[.,]\d+)?)/.exec(s); return m ? Number(m[1].replace(',', '.')) : null; };

/** Số test + % pass người viết ghi ở một mục Phần V (bảng có cột Total/Passed/Pass rate, hoặc câu "45 test cases … 93%"). */
export function statedTestNumbers(blocks: PmNode[]): { totals: number[]; passRates: number[] } {
  const totals: number[] = [];
  const passRates: number[] = [];
  for (const b of blocks) {
    if (b.type === 'table') {
      const rows = rowsOf(b);
      const head = (rows[0] ?? []).map((h) => h.toLowerCase());
      const ti = head.findIndex((h) => /^(total|tổng)|number of (test )?cases|no\.? of (test )?cases|#\s*(test )?cases|test cases?$/.test(h));
      const pi = head.findIndex((h) => /^passed$|^pass$|^đạt$/.test(h));
      const ri = head.findIndex((h) => /pass(ed)?\s*(rate|%|ratio)|tỉ lệ (đạt|pass)/.test(h));
      const data = rows.slice(1).filter((r) => r.some((c) => c));
      const totalRow = data.find((r) => /^(total|tổng|sum)\b/i.test(r[0] ?? ''));
      const use = totalRow ? [totalRow] : data;
      if (ti >= 0) { const v = use.map((r) => numIn(r[ti] ?? '')).filter((x): x is number => x !== null); if (v.length) totals.push(totalRow ? v[0] : v.reduce((a, x) => a + x, 0)); }
      if (ri >= 0) { const v = use.map((r) => numIn(r[ri] ?? '')).filter((x): x is number => x !== null); if (v.length === 1) passRates.push(v[0]); }
      else if (ti >= 0 && pi >= 0) {
        const tt = use.map((r) => numIn(r[ti] ?? '') ?? 0).reduce((a, x) => a + x, 0);
        const pp = use.map((r) => numIn(r[pi] ?? '') ?? 0).reduce((a, x) => a + x, 0);
        if (tt > 0) passRates.push(Math.round((pp / tt) * 1000) / 10);
      }
      continue;
    }
    const text = plainText(b);
    for (const m of text.matchAll(/(\d{1,5})\s*(?:test cases?|test-cases?|TCs?|cases?)\b/gi)) totals.push(Number(m[1]));
    for (const m of text.matchAll(/(?:pass(?:ed|ing)?(?:\s*rate)?|tỉ lệ đạt)[^\d%]{0,20}(\d{1,3}(?:[.,]\d+)?)\s*%|(\d{1,3}(?:[.,]\d+)?)\s*%\s*(?:pass(?:ed)?|đạt)/gi)) passRates.push(Number((m[1] ?? m[2]).replace(',', '.')));
  }
  return { totals, passRates };
}

/** Tổng effort người viết ghi ở Phần II: hàng "Total" của bảng Cost & Time, không có thì cộng các dòng giai đoạn (số nguyên). Đơn vị pds. */
export function statedEffortPds(doc: unknown): number | null {
  for (const blocks of sectionBlocks(doc, /^(Cost & Time Estimations?|Scope & Estimation)$/i)) {
    for (const t of blocks.filter((b) => b.type === 'table')) {
      const rows = rowsOf(t);
      const head = (rows[0] ?? []).map((h) => h.toLowerCase());
      const ei = head.findIndex((h) => /effort|pds|man.?days?|man.?hours?/.test(h));
      if (ei < 0) continue;
      const hours = /hour|giờ/.test(head[ei]);
      const data = rows.slice(1);
      const total = data.find((r) => r.some((c) => /^(total|tổng)\b/i.test(c)));
      const v = total ? numIn(total[ei] ?? '') : data.filter((r) => /^\d+$/.test((r[0] ?? '').trim())).map((r) => numIn(r[ei] ?? '') ?? 0).reduce((a, x) => a + x, 0);
      if (v && v > 0) return hours ? v / 8 : v;
    }
  }
  return null;
}

/**
 * Đối soát Report 1–6 trước khi ghép. `sources` = nội dung các trang Report (như assembleFinal). Trả danh sách phát hiện —
 * rỗng = sạch.
 */
export function finalChecks(sources: FinalSource[], facts: FinalFacts): FinalCheck[] {
  const out: FinalCheck[] = [];
  // 1. Mã: không tồn tại / định nghĩa trùng / tên lệch.
  for (const fam of CODE_FAMILIES) {
    const reg = fam === 'LI' ? undefined : facts.registers[fam];
    const unknown = new Map<string, Set<number>>();
    const defs = new Map<number, Array<{ report: number; name: string }>>();
    for (const s of sources) {
      const text = plainText((s.doc ?? { type: 'doc' }) as PmNode);
      if (reg) for (const m of text.matchAll(codeRe(fam))) { const n = Number(m[1]); if (!reg.has(n)) { const k = fmtCode(fam, n); unknown.set(k, (unknown.get(k) ?? new Set()).add(s.n)); } }
      // Hàng bảng có ô đầu là đúng một mã ⇒ định nghĩa (mã · tên).
      for (const t of tablesOf(s.doc)) for (const r of rowsOf(t).slice(1)) {
        const m = new RegExp(`^${fam}-?(\\d{1,4})$`).exec((r[0] ?? '').trim());
        if (m && r[1]) defs.set(Number(m[1]), [...(defs.get(Number(m[1])) ?? []), { report: s.n, name: r[1] }]);
      }
    }
    if (unknown.size) out.push({ code: 'CODE_UNKNOWN', severity: 'error', report: null, message: `${unknown.size} ${fam} code(s) mentioned in the reports do not exist in CT Work`, items: [...unknown.entries()].map(([k, rs]) => `${k} (Report ${[...rs].join(', ')})`) });
    const dup: string[] = [];
    const mismatch: string[] = [];
    for (const [n, list] of defs) {
      const perReport = new Map<number, string[]>();
      for (const d of list) perReport.set(d.report, [...(perReport.get(d.report) ?? []), d.name]);
      for (const [rep, names] of perReport) if (new Set(names.map(normName)).size > 1) dup.push(`${fmtCode(fam, n)} defined ${names.length}× in Report ${rep}: ${[...new Set(names)].join(' / ')}`);
      const official = reg?.get(n);
      const names = [...new Set(list.map((d) => d.name))];
      if (official) {
        const off = list.filter((d) => normName(d.name) !== normName(official) && !normName(d.name).includes(normName(official)) && !normName(official).includes(normName(d.name)));
        if (off.length) mismatch.push(`${fmtCode(fam, n)} is "${official}" in CT Work but "${off[0].name}" in Report ${off[0].report}`);
      } else if (new Set(names.map(normName)).size > 1 && perReport.size > 1) {
        mismatch.push(`${fmtCode(fam, n)} has different names across reports: ${names.join(' / ')}`);
      }
    }
    if (dup.length) out.push({ code: 'CODE_DUPLICATE', severity: 'error', report: null, message: `${fam} codes defined more than once`, items: dup.slice(0, 40) });
    if (mismatch.length) out.push({ code: 'NAME_MISMATCH', severity: 'warning', report: null, message: `${fam} names that differ between the reports and CT Work`, items: mismatch.slice(0, 40) });
  }
  // 2. Phần V: số test + % pass so với dữ liệu 5.1 / 5.2 / 5.3.
  const r5 = sources.find((s) => s.n === 5);
  if (r5) {
    const LEVELS: Array<{ key: keyof FinalFacts['tests']; label: string; re: RegExp }> = [
      { key: 'unit', label: 'Unit Test (5.1)', re: /^Unit Tests?$/i },
      { key: 'integration', label: 'Integration Test (5.2)', re: /^Integration Tests?$/i },
      { key: 'system', label: 'System Test (5.3)', re: /^System Tests?$/i },
    ];
    const missing: string[] = [];
    for (const lv of LEVELS) {
      const actual = facts.tests[lv.key];
      const secs = sectionBlocks(r5.doc, lv.re);
      const stated = secs.map(statedTestNumbers).reduce((a, x) => ({ totals: [...a.totals, ...x.totals], passRates: [...a.passRates, ...x.passRates] }), { totals: [] as number[], passRates: [] as number[] });
      const rate = actual.total ? Math.round((actual.passed / actual.total) * 1000) / 10 : 0;
      if (!stated.totals.length && !stated.passRates.length) { if (actual.total) missing.push(`${lv.label}: ${actual.total} cases, ${rate}% passed`); continue; }
      const badT = [...new Set(stated.totals.filter((x) => x !== actual.total))];
      if (badT.length) out.push({ code: 'TEST_COUNT_MISMATCH', severity: 'error', report: 5, message: `${lv.label}: the report says ${badT.join(' / ')} test case(s), CT Work has ${actual.total}`, items: [] });
      const badR = [...new Set(stated.passRates.filter((x) => Math.abs(x - rate) > 1))];
      if (badR.length) out.push({ code: 'PASS_RATE_MISMATCH', severity: 'error', report: 5, message: `${lv.label}: the report says ${badR.map((x) => `${x}%`).join(' / ')} passed, CT Work data gives ${rate}% (${actual.passed}/${actual.total})`, items: [] });
    }
    if (missing.length) out.push({ code: 'TEST_NUMBERS_MISSING', severity: 'warning', report: 5, message: 'Part V does not state the test totals — the grader will look for them', items: missing });
  }
  // 3. Phần II: tổng effort so với tổng giờ đã log (> 5% ⇒ cảnh báo).
  const r2 = sources.find((s) => s.n === 2);
  const stated = r2 ? statedEffortPds(r2.doc) : null;
  const actualPds = Math.round((facts.loggedHours / 8) * 10) / 10;
  if (stated !== null && actualPds > 0 && Math.abs(stated - actualPds) / actualPds > 0.05) {
    out.push({ code: 'EFFORT_MISMATCH', severity: 'warning', report: 2, message: `Part II states ${Math.round(stated * 10) / 10} person-days of effort, the work logs add up to ${actualPds} (${Math.round(facts.loggedHours)} h) — a gap of ${Math.round((Math.abs(stated - actualPds) / actualPds) * 100)}%`, items: [] });
  }
  // 4. Chữ mẫu còn sót.
  for (const s of sources) {
    const hits = new Map<string, number>();
    const walk = (n: PmNode) => {
      if (n.type === 'blockquote' && isGuide(n)) return;
      if (n.type === 'text' && n.text) for (const [re] of PLACEHOLDER_RES) for (const m of n.text.matchAll(re)) hits.set(m[0], (hits.get(m[0]) ?? 0) + 1);
      for (const c of n.content ?? []) walk(c);
    };
    walk((s.doc ?? { type: 'doc' }) as PmNode);
    if (hits.size) out.push({ code: 'TEMPLATE_LEFTOVER', severity: 'warning', report: s.n, message: `Report ${s.n} still has template text`, items: [...hits.entries()].slice(0, 20).map(([k, c]) => `"${k}"${c > 1 ? ` ×${c}` : ''}`) });
  }
  return out;
}
