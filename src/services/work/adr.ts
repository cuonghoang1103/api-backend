/**
 * CT Work — dm5 G2 (27/11/2026) B15: ĐÁNH SỐ ADR — phần thuần (test ở dm5b.test.ts).
 *
 *   - Trang tạo từ mẫu ADR (`adr`, `sep490-adr`) nhận số ADR-00n tự tăng trong dự án: tiêu đề "ADR-003: <tiêu đề>", dòng H1 mẫu
 *     "ADR-<number>: …" / "ADR-<số>: …" trong nội dung đổi theo.
 *   - "Superseded by": ADR cũ ⇒ ô Status/Trạng thái = "Superseded by ADR-00m", ADR mới ⇒ ô Related/Liên quan thêm "Supersedes ADR-00n".
 */

import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';

export const ADR_TEMPLATES = ['adr', 'sep490-adr'] as const;
export const isAdrTemplate = (k: string | null | undefined) => !!k && (ADR_TEMPLATES as readonly string[]).includes(k);
export const adrKey = (n: number) => `ADR-${String(n).padStart(3, '0')}`;
/** "ADR-007: Chọn PostgreSQL" ⇒ 7. */
export const adrNumberOf = (title: string): number | null => { const m = /^\s*ADR-?0*(\d{1,5})\b/i.exec(title); return m ? Number(m[1]) : null; };

/** Tiêu đề trang ADR có số: bỏ phần giữ chỗ của mẫu, giữ tiêu đề người gõ. */
export function adrTitle(n: number, title: string): string {
  const rest = title.replace(/^\s*ADR-?(?:<[^>]*>|\d+)?\s*[:–-]?\s*/i, '').replace(/^<[^>]*>$/, '').trim();
  return `${adrKey(n)}: ${rest || 'New decision'}`.slice(0, 255);
}

/** Đổi "ADR-<số>" / "ADR-<number>" của mẫu trong nội dung thành số thật (trong chữ của mọi nút). */
export function numberAdrDoc(doc: PmNode, n: number): PmNode {
  const walk = (node: PmNode): PmNode => ({
    ...node,
    ...(typeof node.text === 'string' ? { text: node.text.replace(/ADR-<(?:số|so|number|n)>/gi, adrKey(n)) } : {}),
    ...(node.content ? { content: node.content.map(walk) } : {}),
  });
  return walk(doc);
}

/** Đặt giá trị cho ô thứ hai của hàng bảng có ô đầu khớp `label` (bảng trường của ADR). Trả true nếu đã đặt. */
export function setFieldRow(doc: PmNode, label: RegExp, value: (old: string) => string): boolean {
  let done = false;
  const walk = (node: PmNode) => {
    if (done) return;
    if (node.type === 'tableRow' && (node.content?.length ?? 0) >= 2 && label.test(plainText(node.content![0]).trim())) {
      const old = plainText(node.content![1]).trim();
      node.content![1] = { ...node.content![1], content: [{ type: 'paragraph', content: [{ type: 'text', text: value(old) }] }] };
      done = true;
      return;
    }
    for (const c of node.content ?? []) walk(c);
  };
  walk(doc);
  return done;
}

/** ADR cũ bị thay ⇒ Status = "Superseded by ADR-00m" (giữ nguyên phần còn lại của trang). */
export function markSuperseded(doc: PmNode, by: number): boolean {
  return setFieldRow(doc, /^(Status|Trạng thái)$/i, () => `Superseded by ${adrKey(by)}`);
}

/** ADR mới ⇒ Related thêm "Supersedes ADR-00n" (không lặp). */
export function markSupersedes(doc: PmNode, old: number): boolean {
  const tag = `Supersedes ${adrKey(old)}`;
  return setFieldRow(doc, /^(Related|Liên quan)$/i, (cur) => (cur.includes(tag) ? cur : [cur, tag].filter(Boolean).join(' · ')));
}
