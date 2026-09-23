/**
 * Rút chữ trơn từ JSON của TipTap — cho tìm kiếm, cho AI, cho xem trước.
 * Khối (đoạn, tiêu đề, mục danh sách…) xuống dòng; @nhắc tên giữ lại tên.
 */

const BLOCK_TYPES = new Set([
  'paragraph', 'heading', 'blockquote', 'codeBlock', 'listItem', 'taskItem', 'tableRow', 'horizontalRule',
]);

interface Node {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: Node[];
}

export function tiptapToText(doc: unknown): string {
  const out: string[] = [];
  const walk = (n: Node) => {
    if (!n || typeof n !== 'object') return;
    if (typeof n.text === 'string') out.push(n.text);
    else if (n.type === 'mention') out.push(`@${String(n.attrs?.label ?? n.attrs?.id ?? '')}`);
    else if (n.type === 'hardBreak') out.push('\n');
    if (Array.isArray(n.content)) n.content.forEach(walk);
    if (n.type && BLOCK_TYPES.has(n.type)) out.push('\n');
  };
  walk(doc as Node);
  return out.join('').replace(/\n{3,}/g, '\n\n').trim();
}
