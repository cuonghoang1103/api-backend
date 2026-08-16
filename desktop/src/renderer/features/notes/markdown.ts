/**
 * Chuyển đổi giữa ProseMirror JSON (máy chủ lưu) và Markdown (file trên đĩa).
 *
 * ─── VÌ SAO CHUYỆN NÀY NGUY HIỂM ───
 *
 * Hai định dạng KHÔNG tương đương. ProseMirror biểu diễn được bảng, ảnh nhúng,
 * ô đánh dấu, ghi chú lồng — Markdown thuần thì không. Một bộ chuyển đổi "cố
 * gắng hết sức" sẽ âm thầm vứt bỏ những thứ đó, và người dùng chỉ phát hiện khi
 * mở lại ghi chú trên web và thấy bảng biến mất.
 *
 * Vì thế bộ này KHÔNG cố gắng hết sức. Nó khai báo rõ những loại nút mình xử lý
 * được; gặp bất cứ thứ gì ngoài danh sách, nó BÁO RA thay vì đoán. Ghi chú chứa
 * nút lạ sẽ bị app đặt ở chế độ chỉ-đọc — mở xem được, sửa thì mời sang web.
 *
 * Mất một tính năng còn hơn mất nội dung người dùng đã viết.
 */

/** Nút ProseMirror mà bộ chuyển đổi hiểu trọn vẹn cả hai chiều. */
const SUPPORTED_NODES = new Set([
  'doc',
  'paragraph',
  'text',
  'heading',
  'bulletList',
  'orderedList',
  'listItem',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'hardBreak',
]);

/** Đánh dấu (mark) hiểu được. Mark lạ chỉ mất định dạng, không mất chữ. */
const SUPPORTED_MARKS = new Set(['bold', 'italic', 'strike', 'code', 'link']);

interface PmNode {
  type?: string;
  text?: string;
  content?: PmNode[];
  attrs?: Record<string, unknown>;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
}

export interface ConversionCheck {
  /** `true` nếu mọi nút trong tài liệu đều chuyển đổi được an toàn. */
  safe: boolean;
  /** Tên các loại nút không hỗ trợ, để nói cho người dùng biết vướng ở đâu. */
  unsupported: string[];
}

/**
 * Rà toàn bộ tài liệu TRƯỚC khi cho phép sửa.
 *
 * Chạy trước, tách khỏi việc chuyển đổi: biết được "có sửa an toàn không" phải
 * xong trước khi giao diện quyết định mở khoá ô nhập, chứ không phải phát hiện
 * giữa chừng lúc đang lưu.
 */
export function checkConvertible(doc: unknown): ConversionCheck {
  const unsupported = new Set<string>();

  const walk = (node: PmNode | undefined): void => {
    if (!node || typeof node !== 'object') return;
    const type = node.type;
    if (type && !SUPPORTED_NODES.has(type)) unsupported.add(type);
    for (const mark of node.marks ?? []) {
      if (mark.type && !SUPPORTED_MARKS.has(mark.type)) unsupported.add(`mark:${mark.type}`);
    }
    for (const child of node.content ?? []) walk(child);
  };

  walk(doc as PmNode);
  return { safe: unsupported.size === 0, unsupported: [...unsupported].sort() };
}

/** Bọc chữ bằng ký hiệu Markdown theo các mark đang gắn. */
function applyMarks(text: string, marks: PmNode['marks']): string {
  let out = text;
  for (const mark of marks ?? []) {
    switch (mark.type) {
      case 'bold':
        out = `**${out}**`;
        break;
      case 'italic':
        out = `*${out}*`;
        break;
      case 'strike':
        out = `~~${out}~~`;
        break;
      case 'code':
        out = `\`${out}\``;
        break;
      case 'link': {
        const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : '';
        out = href ? `[${out}](${href})` : out;
        break;
      }
      default:
        // Mark lạ: giữ nguyên CHỮ, chỉ mất định dạng. Chữ quan trọng hơn kiểu chữ.
        break;
    }
  }
  return out;
}

function inlineToMarkdown(nodes: PmNode[] | undefined): string {
  return (nodes ?? [])
    .map((node) => {
      if (node.type === 'hardBreak') return '  \n';
      if (node.type === 'text') return applyMarks(node.text ?? '', node.marks);
      // Nút inline lạ — `checkConvertible` đã chặn từ trước, nhưng vẫn giữ chữ
      // nếu có, để không bao giờ trả về một khoảng trống câm lặng.
      return node.text ?? '';
    })
    .join('');
}

/** ProseMirror JSON → Markdown. */
export function toMarkdown(doc: unknown): string {
  const blocks: string[] = [];

  const renderBlock = (node: PmNode, depth = 0): void => {
    switch (node.type) {
      case 'heading': {
        const level = Math.min(6, Math.max(1, Number(node.attrs?.level ?? 1)));
        blocks.push(`${'#'.repeat(level)} ${inlineToMarkdown(node.content)}`);
        break;
      }
      case 'paragraph':
        blocks.push(inlineToMarkdown(node.content));
        break;
      case 'codeBlock': {
        const lang = typeof node.attrs?.language === 'string' ? node.attrs.language : '';
        blocks.push(`\`\`\`${lang}\n${inlineToMarkdown(node.content)}\n\`\`\``);
        break;
      }
      case 'blockquote':
        for (const child of node.content ?? []) {
          const inner: string[] = [];
          const save = blocks.length;
          renderBlock(child, depth);
          inner.push(...blocks.splice(save));
          blocks.push(inner.map((line) => `> ${line}`).join('\n'));
        }
        break;
      case 'bulletList':
      case 'orderedList': {
        // CẢ danh sách là MỘT khối, các mục nối bằng xuống dòng đơn.
        //
        // Đẩy từng mục thành khối riêng sẽ khiến chúng bị nối bằng DÒNG TRỐNG
        // (`blocks.join('\n\n')`), mà dòng trống cắt đứt danh sách trong
        // Markdown — đọc lại thì mỗi mục thành một danh sách mới bắt đầu từ 1.
        // Hệ quả: `1. 2. 3.` biến thành `1. 1. 1.` sau MỘT lần lưu, và trôi
        // thêm mỗi lần sau. Test vòng tròn bắt được đúng lỗi này.
        const ordered = node.type === 'orderedList';
        const indent = '  '.repeat(depth);
        const items = (node.content ?? []).map((item, index) => {
          const marker = ordered ? `${index + 1}.` : '-';
          const text = (item.content ?? [])
            .map((child) => inlineToMarkdown(child.content))
            .join(' ');
          return `${indent}${marker} ${text}`;
        });
        blocks.push(items.join('\n'));
        break;
      }
      case 'horizontalRule':
        blocks.push('---');
        break;
      default:
        for (const child of node.content ?? []) renderBlock(child, depth);
    }
  };

  const root = doc as PmNode | undefined;
  for (const node of root?.content ?? []) renderBlock(node);

  return blocks.join('\n\n').trim();
}

/**
 * Markdown → ProseMirror JSON.
 *
 * CỐ Ý đơn giản: chỉ nhận đúng những cấu trúc mà `toMarkdown` sinh ra. Không cố
 * phân tích mọi thứ Markdown cho phép (bảng, HTML nhúng, chú thích) — nhận vào
 * nhiều hơn xuất ra sẽ tạo ra tài liệu mà chính app không đọc lại được.
 */
export function fromMarkdown(markdown: string): unknown {
  const content: PmNode[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    // Khối mã ```
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      const lang = fence[1] ?? '';
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i] ?? '')) {
        body.push(lines[i] ?? '');
        i += 1;
      }
      i += 1; // bỏ qua ``` đóng
      content.push({
        type: 'codeBlock',
        ...(lang ? { attrs: { language: lang } } : {}),
        content: [{ type: 'text', text: body.join('\n') }],
      });
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      content.push({
        type: 'heading',
        attrs: { level: heading[1]!.length },
        content: inlineFromMarkdown(heading[2] ?? ''),
      });
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      content.push({ type: 'horizontalRule' });
      i += 1;
      continue;
    }

    // Danh sách — gom các dòng liên tiếp cùng kiểu thành MỘT nút list.
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (bullet || ordered) {
      const isOrdered = Boolean(ordered);
      const items: PmNode[] = [];
      while (i < lines.length) {
        const current = lines[i] ?? '';
        const m = isOrdered
          ? /^\s*\d+\.\s+(.*)$/.exec(current)
          : /^\s*[-*]\s+(.*)$/.exec(current);
        if (!m) break;
        items.push({
          type: 'listItem',
          content: [{ type: 'paragraph', content: inlineFromMarkdown(m[1] ?? '') }],
        });
        i += 1;
      }
      content.push({ type: isOrdered ? 'orderedList' : 'bulletList', content: items });
      continue;
    }

    if (line.startsWith('> ')) {
      const quoted: string[] = [];
      while (i < lines.length && (lines[i] ?? '').startsWith('> ')) {
        quoted.push((lines[i] ?? '').slice(2));
        i += 1;
      }
      content.push({
        type: 'blockquote',
        content: [{ type: 'paragraph', content: inlineFromMarkdown(quoted.join(' ')) }],
      });
      continue;
    }

    // Đoạn văn: gom tới dòng trống.
    const para: string[] = [];
    while (i < lines.length && (lines[i] ?? '').trim() !== '') {
      const next = lines[i] ?? '';
      // Dừng nếu gặp thứ mở đầu một khối khác.
      if (/^(#{1,6}\s|```|>\s|-{3,}|\s*[-*]\s|\s*\d+\.\s)/.test(next) && para.length > 0) break;
      para.push(next);
      i += 1;
    }
    if (para.length > 0) {
      content.push({ type: 'paragraph', content: inlineFromMarkdown(para.join(' ')) });
    }
  }

  return { type: 'doc', content: content.length > 0 ? content : [{ type: 'paragraph' }] };
}

/**
 * Phân tích định dạng trong một dòng.
 *
 * Thứ tự quan trọng: `**` phải xét TRƯỚC `*`, nếu không `**đậm**` bị đọc thành
 * hai lần nghiêng rỗng. Tương tự mã nội tuyến phải xét trước mọi thứ, vì nội
 * dung bên trong dấu backtick không được diễn giải.
 */
function inlineFromMarkdown(text: string): PmNode[] {
  const out: PmNode[] = [];
  const pattern =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(~~[^~]+~~)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/;

  let rest = text;
  while (rest.length > 0) {
    const match = pattern.exec(rest);
    if (!match) {
      out.push({ type: 'text', text: rest });
      break;
    }
    if (match.index > 0) {
      out.push({ type: 'text', text: rest.slice(0, match.index) });
    }
    const token = match[0];

    if (token.startsWith('`')) {
      out.push({ type: 'text', text: token.slice(1, -1), marks: [{ type: 'code' }] });
    } else if (token.startsWith('**')) {
      out.push({ type: 'text', text: token.slice(2, -2), marks: [{ type: 'bold' }] });
    } else if (token.startsWith('~~')) {
      out.push({ type: 'text', text: token.slice(2, -2), marks: [{ type: 'strike' }] });
    } else if (token.startsWith('[')) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      out.push({
        type: 'text',
        text: link?.[1] ?? token,
        marks: [{ type: 'link', attrs: { href: link?.[2] ?? '' } }],
      });
    } else {
      out.push({ type: 'text', text: token.slice(1, -1), marks: [{ type: 'italic' }] });
    }

    rest = rest.slice(match.index + token.length);
  }

  return out.filter((node) => (node.text ?? '').length > 0);
}

/** Tên file an toàn cho một ghi chú. Chỉ `.md`, không dấu phân cách. */
export function noteFileName(noteId: number, title: string): string {
  const slug = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .toLowerCase();
  // Id đứng đầu để tên file luôn duy nhất kể cả khi hai ghi chú trùng tiêu đề,
  // và để tìm lại được ghi chú từ tên file mà không cần bảng tra.
  return `${noteId}-${slug || 'ghi-chu'}.md`;
}
