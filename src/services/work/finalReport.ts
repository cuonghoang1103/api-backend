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
