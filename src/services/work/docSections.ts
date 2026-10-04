/**
 * CT Work — đợt S5c: thay / nối MỘT MỤC của trang Docs (TipTap JSON) theo tiêu đề. Hàm THUẦN (test s5c.test.ts).
 *
 * Dùng cho đề xuất AI `update_page_section`: model chỉ viết lại một mục ("## 3. Functional requirements"),
 * không phải cả trang ⇒ phần người khác đang viết ở mục khác không bị ghi đè.
 *
 * Mục = nút heading có chữ khớp (bỏ hoa/thường, khoảng trắng thừa, số thứ tự đầu dòng "3." / "3.1") + mọi nút sau nó
 * cho tới heading kế tiếp có mức ≤ mức của nó. Không tìm thấy ⇒ thêm heading mới (mức 2) + nội dung vào CUỐI trang.
 */

export interface PmNode { type: string; attrs?: Record<string, unknown>; content?: PmNode[]; text?: string; marks?: unknown[] }

const textOf = (n: PmNode): string => (n.text ?? '') + (n.content ?? []).map(textOf).join('');

/** Chuẩn hoá chữ tiêu đề để so khớp: bỏ số mục đầu dòng, dấu câu cuối, hoa/thường, khoảng trắng. */
export function normHeading(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(/^\s*(\d+(\.\d+)*\.?|[ivx]+\.)\s+/i, '').replace(/[\s:.\-–—]+$/g, '').replace(/\s+/g, ' ').trim();
}

export interface SectionResult { doc: PmNode; found: boolean; replacedBlocks: number }

export function replaceSection(doc: PmNode, heading: string, blocks: PmNode[], mode: 'replace' | 'append' = 'replace'): SectionResult {
  const content = [...(doc.content ?? [])];
  const want = normHeading(heading);
  const at = want ? content.findIndex((n) => n.type === 'heading' && normHeading(textOf(n)) === want) : -1;
  // Nội dung model đưa có thể mở đầu bằng chính tiêu đề mục — bỏ để không thành hai tiêu đề.
  const body = blocks.length && blocks[0].type === 'heading' && normHeading(textOf(blocks[0])) === want ? blocks.slice(1) : blocks;
  if (at < 0) {
    const h: PmNode = { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: heading.trim().slice(0, 200) || 'New section' }] };
    const trimmed = content.length === 1 && content[0].type === 'paragraph' && !textOf(content[0]).trim() ? [] : content;
    return { doc: { ...doc, type: 'doc', content: [...trimmed, h, ...body] }, found: false, replacedBlocks: 0 };
  }
  const level = Number(content[at].attrs?.level ?? 1);
  let end = at + 1;
  while (end < content.length && !(content[end].type === 'heading' && Number(content[end].attrs?.level ?? 1) <= level)) end++;
  const old = content.slice(at + 1, end);
  const next = mode === 'append' ? [...old, ...body] : body;
  content.splice(at + 1, end - at - 1, ...next);
  return { doc: { ...doc, type: 'doc', content }, found: true, replacedBlocks: mode === 'append' ? 0 : old.length };
}

/** Danh sách tiêu đề của trang (để model biết mục nào có thật) — "## 3. Functional requirements". */
export function headingsOf(doc: PmNode, max = 60): string[] {
  return (doc.content ?? []).filter((n) => n.type === 'heading').slice(0, max).map((n) => `${'#'.repeat(Number(n.attrs?.level ?? 1))} ${textOf(n).trim()}`);
}
