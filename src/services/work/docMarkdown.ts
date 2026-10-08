/**
 * CT Work — TÀI LIỆU DỰ ÁN (đợt S2a): Markdown ⇄ TipTap JSON + so sánh dòng.
 *
 * THUẦN (không chạm DB) để test bằng chính 36 mẫu thật — docMarkdown.test.ts.
 *
 * Markdown → TipTap đi qua cây mdast của remark (remark-parse + remark-gfm, đã
 * có sẵn trong repo — xem projectMarkdown.service.ts), KHÔNG qua HTML: mọi chữ
 * chỉ thành nút `text`, không có đường nào cho HTML lạ lọt vào trang.
 *
 * Bộ nút sinh ra khớp trình soạn thảo tài liệu (RichEditor chế độ `docs`):
 *   StarterKit (heading 1–4, list, blockquote, codeBlock, hr, hardBreak,
 *   bold/italic/strike/code) + Link + TaskList/TaskItem + Table/Row/Header/Cell
 *   + Image (khối, đợt 3A — chỉ nguồn `safeImageSrc`). Sơ đồ Mermaid = codeBlock
 *   language "mermaid" (```mermaid giữ nguyên hai chiều).
 * Tiêu đề #####/###### gộp về mức 4 (editor chỉ có 1–4). Bảng GFM ⇒ bảng TipTap,
 * hàng thiếu ô được đệm ô rỗng (ProseMirror cần bảng chữ nhật).
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

export interface PmMark { type: string; attrs?: Record<string, unknown> }
export interface PmNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PmNode[];
  marks?: PmMark[];
  text?: string;
}

/** Mức tiêu đề cao nhất trình soạn thảo tài liệu hỗ trợ. */
export const MAX_HEADING = 4;

// Kiểu mdast tối thiểu (tránh phụ thuộc @types/mdast vào code chạy).
interface Md {
  type: string;
  value?: string;
  depth?: number;
  ordered?: boolean | null;
  start?: number | null;
  checked?: boolean | null;
  lang?: string | null;
  url?: string;
  alt?: string | null;
  children?: Md[];
}

const parser = unified().use(remarkParse).use(remarkGfm);

/**
 * CTW đợt 3A: nguồn ảnh được nhận trong tài liệu — ảnh đã tải lên dự án (`/api/v1/work/projects/:pid/images/:id`)
 * hoặc ảnh https công khai. Không nhận `data:`/`javascript:`/http thường.
 */
export const DOC_IMAGE_SRC_RE = /^\/api\/v1\/work\/projects\/(\d+)\/images\/(\d+)$/;
export function safeImageSrc(src: string | undefined | null): string | null {
  if (!src) return null;
  const s = src.trim();
  if (DOC_IMAGE_SRC_RE.test(s) || /^https:\/\/[^\s"'<>]+$/i.test(s)) return s.slice(0, 2000);
  return null;
}

/** Chỉ nhận liên kết an toàn: http(s), mailto, đường dẫn tương đối gốc '/' và neo '#'. */
export function safeHref(href: string | undefined | null): string | null {
  if (!href) return null;
  const h = href.trim();
  if (/^(https?:|mailto:)/i.test(h) || h.startsWith('/') || h.startsWith('#')) return h.slice(0, 2000);
  return null;
}

const P = (content: PmNode[] = []): PmNode => (content.length ? { type: 'paragraph', content } : { type: 'paragraph' });

function addMark(marks: PmMark[], m: PmMark): PmMark[] {
  return marks.some((x) => x.type === m.type) ? marks : [...marks, m];
}

function inline(nodes: Md[] | undefined, marks: PmMark[] = []): PmNode[] {
  const out: PmNode[] = [];
  const text = (t: string, mk: PmMark[]) => {
    if (!t) return;
    out.push(mk.length ? { type: 'text', text: t, marks: mk } : { type: 'text', text: t });
  };
  for (const n of nodes ?? []) {
    switch (n.type) {
      case 'text':
        text((n.value ?? '').replace(/\n/g, ' '), marks);
        break;
      case 'strong':
        out.push(...inline(n.children, addMark(marks, { type: 'bold' })));
        break;
      case 'emphasis':
        out.push(...inline(n.children, addMark(marks, { type: 'italic' })));
        break;
      case 'delete':
        out.push(...inline(n.children, addMark(marks, { type: 'strike' })));
        break;
      case 'inlineCode':
        // Mark `code` của TipTap không đi chung với mark khác (excludes: '_').
        text(n.value ?? '', [{ type: 'code' }]);
        break;
      case 'link': {
        const href = safeHref(n.url);
        out.push(...inline(n.children, href ? addMark(marks, { type: 'link', attrs: { href, target: '_blank', rel: 'noopener noreferrer nofollow' } }) : marks));
        break;
      }
      case 'image':
        // Trang tài liệu chưa nhận ảnh từ mẫu — giữ chữ thay thế + liên kết.
        text(n.alt || n.url || '', safeHref(n.url) ? addMark(marks, { type: 'link', attrs: { href: safeHref(n.url), target: '_blank', rel: 'noopener noreferrer nofollow' } }) : marks);
        break;
      case 'break':
        out.push({ type: 'hardBreak' });
        break;
      case 'html':
        if (/^<br\s*\/?>$/i.test((n.value ?? '').trim())) out.push({ type: 'hardBreak' });
        else text(n.value ?? '', marks);
        break;
      default:
        // footnoteReference, linkReference… ⇒ chữ trơn của nó.
        if (n.children) out.push(...inline(n.children, marks));
        else if (n.value) text(n.value, marks);
    }
  }
  // Gộp các nút text liền nhau có cùng mark (JSON gọn, so sánh ổn định).
  const merged: PmNode[] = [];
  for (const n of out) {
    const last = merged[merged.length - 1];
    if (last && last.type === 'text' && n.type === 'text' && JSON.stringify(last.marks ?? []) === JSON.stringify(n.marks ?? [])) {
      last.text = `${last.text ?? ''}${n.text ?? ''}`;
    } else merged.push({ ...n });
  }
  return merged;
}

function listItem(n: Md, task: boolean): PmNode {
  let content = blocks(n.children);
  if (!content.length || content[0].type !== 'paragraph') content = [P(), ...content];
  return task
    ? { type: 'taskItem', attrs: { checked: n.checked === true }, content }
    : { type: 'listItem', content };
}

function block(n: Md): PmNode[] {
  switch (n.type) {
    case 'heading': {
      const c = inline(n.children);
      return [{ type: 'heading', attrs: { level: Math.min(Math.max(n.depth ?? 1, 1), MAX_HEADING) }, ...(c.length ? { content: c } : {}) }];
    }
    case 'paragraph': {
      // CTW đợt 3A: đoạn CHỈ gồm ảnh (`![alt](src)` đứng riêng) ⇒ nút ảnh khối của editor.
      const kids = (n.children ?? []).filter((k) => !(k.type === 'text' && !(k.value ?? '').trim()));
      if (kids.length && kids.every((k) => k.type === 'image' && safeImageSrc(k.url))) {
        return kids.map((k) => ({ type: 'image', attrs: { src: safeImageSrc(k.url), alt: k.alt || null, title: null } }));
      }
      const c = inline(n.children);
      return c.length ? [P(c)] : [];
    }
    case 'thematicBreak':
      return [{ type: 'horizontalRule' }];
    case 'blockquote': {
      const c = blocks(n.children);
      return [{ type: 'blockquote', content: c.length ? c : [P()] }];
    }
    case 'code':
      return [{ type: 'codeBlock', attrs: { language: n.lang || null }, ...(n.value ? { content: [{ type: 'text', text: n.value }] } : {}) }];
    case 'list': {
      const items = n.children ?? [];
      const task = items.some((i) => i.checked === true || i.checked === false);
      if (task) return [{ type: 'taskList', content: items.map((i) => listItem(i, true)) }];
      if (n.ordered) return [{ type: 'orderedList', attrs: { start: n.start ?? 1 }, content: items.map((i) => listItem(i, false)) }];
      return [{ type: 'bulletList', content: items.map((i) => listItem(i, false)) }];
    }
    case 'table': {
      const rows = n.children ?? [];
      const cols = Math.max(1, ...rows.map((r) => r.children?.length ?? 0));
      return [{
        type: 'table',
        content: rows.map((r, ri) => {
          const cells = [...(r.children ?? [])];
          while (cells.length < cols) cells.push({ type: 'tableCell', children: [] });
          return {
            type: 'tableRow',
            content: cells.slice(0, cols).map((c) => ({
              type: ri === 0 ? 'tableHeader' : 'tableCell',
              attrs: { colspan: 1, rowspan: 1, colwidth: null },
              content: [P(inline(c.children))],
            })),
          };
        }),
      }];
    }
    case 'html': {
      const t = (n.value ?? '').trim();
      return t ? [P([{ type: 'text', text: t }])] : [];
    }
    case 'definition':
    case 'footnoteDefinition':
    case 'yaml':
      return [];
    default:
      if (n.children) return blocks(n.children);
      return n.value ? [P([{ type: 'text', text: n.value }])] : [];
  }
}

function blocks(nodes: Md[] | undefined): PmNode[] {
  return (nodes ?? []).flatMap(block);
}

function plain(n: PmNode | undefined): string {
  if (!n) return '';
  if (typeof n.text === 'string') return n.text;
  return (n.content ?? []).map(plain).join('');
}

export interface ConvertedDoc {
  /** Chữ của tiêu đề mức 1 đầu tiên (rỗng nếu không có). */
  title: string;
  doc: PmNode;
}

/**
 * Markdown ⇒ TipTap. `dropTitle`: bỏ tiêu đề mức 1 ĐẦU TIÊN khỏi nội dung (trang
 * có ô tiêu đề riêng, giữ lại thì thấy hai lần).
 */
export function markdownToTiptap(md: string, opts: { dropTitle?: boolean } = {}): ConvertedDoc {
  const tree = parser.parse(md.replace(/\r\n?/g, '\n')) as unknown as Md;
  const content = blocks(tree.children);
  const firstH1 = content.findIndex((b) => b.type === 'heading' && b.attrs?.level === 1);
  const title = firstH1 >= 0 ? plain(content[firstH1]).trim() : '';
  if (opts.dropTitle && firstH1 === 0) content.splice(0, 1);
  return { title, doc: { type: 'doc', content: content.length ? content : [P()] } };
}

// ─── TipTap ⇒ Markdown (xuất một trang) ──────────────────────────

function escapeText(t: string): string {
  return t.replace(/([\\`*_[\]~])/g, '\\$1');
}

function inlineMd(nodes: PmNode[] | undefined): string {
  let out = '';
  for (const n of nodes ?? []) {
    if (n.type === 'hardBreak') { out += '  \n'; continue; }
    if (n.type === 'mention') { out += `@${String(n.attrs?.label ?? n.attrs?.id ?? '')}`; continue; }
    if (n.type !== 'text') { out += inlineMd(n.content); continue; }
    const marks = n.marks ?? [];
    let t = marks.some((m) => m.type === 'code') ? `\`${n.text ?? ''}\`` : escapeText(n.text ?? '');
    if (marks.some((m) => m.type === 'bold')) t = `**${t}**`;
    if (marks.some((m) => m.type === 'italic')) t = `*${t}*`;
    if (marks.some((m) => m.type === 'strike')) t = `~~${t}~~`;
    const link = marks.find((m) => m.type === 'link');
    const href = safeHref(String(link?.attrs?.href ?? ''));
    if (link && href) t = `[${t}](${href})`;
    out += t;
  }
  return out;
}

function indent(s: string, pad: string): string {
  return s.split('\n').map((l, i) => (i === 0 || !l ? l : pad + l)).join('\n');
}

function blockMd(n: PmNode): string {
  switch (n.type) {
    case 'heading':
      return `${'#'.repeat(Number(n.attrs?.level ?? 1))} ${inlineMd(n.content)}`;
    case 'paragraph':
      return inlineMd(n.content);
    case 'horizontalRule':
      return '---';
    case 'image': {
      const src = safeImageSrc(String(n.attrs?.src ?? ''));
      return src ? `![${String(n.attrs?.alt ?? '').replace(/[[\]]/g, '')}](${src})` : '';
    }
    case 'blockquote':
      return blocksMd(n.content).split('\n').map((l) => (l ? `> ${l}` : '>')).join('\n');
    case 'codeBlock':
      return `\`\`\`${String(n.attrs?.language ?? '')}\n${plain(n)}\n\`\`\``;
    case 'bulletList':
      return (n.content ?? []).map((li) => `- ${indent(blocksMd(li.content), '  ')}`).join('\n');
    case 'orderedList': {
      const start = Number(n.attrs?.start ?? 1);
      return (n.content ?? []).map((li, i) => `${start + i}. ${indent(blocksMd(li.content), '   ')}`).join('\n');
    }
    case 'taskList':
      return (n.content ?? []).map((li) => `- [${li.attrs?.checked ? 'x' : ' '}] ${indent(blocksMd(li.content), '  ')}`).join('\n');
    case 'table': {
      const rows = (n.content ?? []).map((r) => (r.content ?? []).map((c) => blocksMd(c.content).replace(/\n+/g, ' ').replace(/\|/g, '\\|')));
      if (!rows.length) return '';
      const cols = Math.max(...rows.map((r) => r.length));
      const line = (r: string[]) => `| ${Array.from({ length: cols }, (_, i) => r[i] ?? '').join(' | ')} |`;
      return [line(rows[0]), `|${Array.from({ length: cols }, () => '---').join('|')}|`, ...rows.slice(1).map(line)].join('\n');
    }
    default:
      return n.content ? blocksMd(n.content) : plain(n);
  }
}

function blocksMd(nodes: PmNode[] | undefined): string {
  // Mục danh sách liền nhau (paragraph + list con) xuống dòng đơn; khối khác cách một dòng trống.
  return (nodes ?? []).map(blockMd).filter((s) => s !== '').join('\n\n');
}

/** Một trang ⇒ Markdown (tiêu đề trang làm `#` đầu file). */
export function tiptapToMarkdown(doc: unknown, title?: string): string {
  const body = blocksMd((doc as PmNode | null)?.content ?? []);
  return `${title ? `# ${title}\n\n` : ''}${body}`.trim() + '\n';
}

// ─── So sánh dòng (phiên bản) ────────────────────────────────────

export interface DiffLine { op: 'eq' | 'add' | 'del'; text: string }

/** Trần ô của bảng LCS (dòng cũ × dòng mới sau khi cắt đầu/đuôi chung). */
const DIFF_CELLS = 4_000_000;

/**
 * So sánh hai văn bản theo dòng (LCS). Cắt phần đầu/đuôi giống nhau trước —
 * sửa một chỗ trong tài liệu dài chỉ phải so một khúc nhỏ. Khúc giữa quá lớn
 * (> DIFF_CELLS) ⇒ trả "xoá hết khúc cũ, thêm hết khúc mới" thay vì treo máy.
 */
export function lineDiff(a: string, b: string): { lines: DiffLine[]; added: number; removed: number } {
  const A = a.split('\n');
  const B = b.split('\n');
  let pre = 0;
  while (pre < A.length && pre < B.length && A[pre] === B[pre]) pre++;
  let suf = 0;
  while (suf < A.length - pre && suf < B.length - pre && A[A.length - 1 - suf] === B[B.length - 1 - suf]) suf++;
  const a2 = A.slice(pre, A.length - suf);
  const b2 = B.slice(pre, B.length - suf);
  const mid: DiffLine[] = [];
  const n = a2.length;
  const m = b2.length;
  if ((n + 1) * (m + 1) > DIFF_CELLS) {
    for (const t of a2) mid.push({ op: 'del', text: t });
    for (const t of b2) mid.push({ op: 'add', text: t });
  } else {
    const w = m + 1;
    const L = new Uint32Array((n + 1) * w);
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        L[i * w + j] = a2[i] === b2[j] ? L[(i + 1) * w + j + 1] + 1 : Math.max(L[(i + 1) * w + j], L[i * w + j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (a2[i] === b2[j]) { mid.push({ op: 'eq', text: a2[i] }); i++; j++; }
      else if (L[(i + 1) * w + j] >= L[i * w + j + 1]) { mid.push({ op: 'del', text: a2[i] }); i++; }
      else { mid.push({ op: 'add', text: b2[j] }); j++; }
    }
    while (i < n) mid.push({ op: 'del', text: a2[i++] });
    while (j < m) mid.push({ op: 'add', text: b2[j++] });
  }
  const lines: DiffLine[] = [
    ...A.slice(0, pre).map((text) => ({ op: 'eq' as const, text })),
    ...mid,
    ...A.slice(A.length - suf).map((text) => ({ op: 'eq' as const, text })),
  ];
  return { lines, added: lines.filter((l) => l.op === 'add').length, removed: lines.filter((l) => l.op === 'del').length };
}
