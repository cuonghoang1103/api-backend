/**
 * Ghi nhanh — phần NỘI DUNG thuần (không đụng CSDL, nên test được không cần DB).
 * ────────────────────────────────────────────────────────────────────────────
 * Mọi thứ ghi vào `Note.contentJson` ở đây đều đi qua ĐÚNG MỘT đường:
 *
 *     markdown ──marked──▶ HTML ──generateJSON(noteRealtimeExtensions)──▶ JSON
 *                                                   JSON ──generateHTML──▶ contentHtml
 *
 * `noteRealtimeExtensions` là schema mà cổng cộng tác thời gian thực dùng để
 * nạp `contentJson` vào Yjs. Dựng JSON bằng CHÍNH schema đó nghĩa là:
 *   • thứ gì schema không biết (thẻ <script>, <iframe>, style lạ…) bị bỏ ngay
 *     lúc parse — đây cũng là lớp lọc HTML, không cần sanitize riêng;
 *   • ghi chú tạo ra ở đây mở được trong trình soạn thời gian thực.
 *
 * ⚠️ Schema đó KHÔNG có mark `link` (đo 26/09/2026: `toYdoc` ném "There is no
 * mark type link in this schema"). Nên ở đây KHÔNG BAO GIỜ sinh mark link —
 * đường dẫn về bài học được ghi thành chữ thường. `generateJSON` tự rơi mark
 * link khi nhập markdown (giữ chữ, mất href).
 */
import { generateHTML, generateJSON } from '@tiptap/html';
import { marked } from 'marked';
import type { JSONContent } from '@tiptap/core';
import { noteRealtimeExtensions } from './notesRealtimeSchema.js';

export type TiptapDoc = JSONContent & { type: 'doc'; content: JSONContent[] };

// ─── Chuyển đổi cơ bản ───────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** HTML (bất kỳ) → JSON TipTap đúng schema Notes. Thứ ngoài schema bị bỏ. */
export function htmlToDoc(html: string): TiptapDoc {
  const json = generateJSON(html || '<p></p>', noteRealtimeExtensions) as TiptapDoc;
  if (!Array.isArray(json.content) || json.content.length === 0) {
    json.content = [{ type: 'paragraph' }];
  }
  // `marked` ghi ngôn ngữ vào class của <code>; codeBlock phía máy chủ không đọc
  // class đó. Gán lại theo THỨ TỰ xuất hiện — ProseMirror duyệt cây theo đúng
  // thứ tự tài liệu, cùng thứ tự với regex quét chuỗi HTML.
  const langs = [...html.matchAll(/<pre[^>]*>\s*<code(?:\s+class="([^"]*)")?/g)].map((m) => {
    const cls = m[1] ?? '';
    const found = /(?:^|\s)language-([\w+#.-]{1,30})/.exec(cls);
    return found ? found[1] : '';
  });
  let i = 0;
  walk(json, (n) => {
    if (n.type === 'codeBlock') {
      const lang = langs[i++] ?? '';
      n.attrs = { ...(n.attrs ?? {}), language: lang };
    }
  });
  return json;
}

/** JSON → HTML cache (`contentHtml`), cùng hàm cổng realtime dùng. */
export function docToHtml(doc: TiptapDoc): string {
  return generateHTML(doc, noteRealtimeExtensions);
}

/**
 * Markdown → HTML. `breaks: true` vì người dùng ghi nhanh gõ Enter là muốn
 * xuống dòng thật, không phải chờ một dòng trống.
 */
export function markdownToHtml(md: string): string {
  return marked.parse(md ?? '', { gfm: true, breaks: true, async: false }) as string;
}

export function markdownToDoc(md: string): TiptapDoc {
  return htmlToDoc(markdownToHtml(md));
}

export function walk(node: JSONContent, fn: (n: JSONContent, parent: JSONContent | null) => void, parent: JSONContent | null = null): void {
  fn(node, parent);
  for (const c of node.content ?? []) walk(c, fn, node);
}

/** Toàn bộ chữ trong một nút (nối các text node). */
export function nodeText(node: JSONContent | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  if (node.type === 'hardBreak') return '\n';
  const kids = node.content ?? [];
  // Con là khối (đoạn, dòng bảng…) thì nối bằng xuống dòng; con là chữ thì nối liền.
  const sep = kids.some((k) => k.type !== 'text' && k.type !== 'hardBreak' && k.type !== 'math') ? '\n' : '';
  return kids.map(nodeText).join(sep);
}

/** Tiêu đề từ markdown: dòng `# ...` đầu tiên, không có thì null. */
export function titleFromMarkdown(md: string): string | null {
  const m = /^\s{0,3}#\s+(.+?)\s*#*\s*$/m.exec(md);
  return m ? m[1].replace(/[*_`]/g, '').trim().slice(0, 300) || null : null;
}

// ─── Mẫu trang ───────────────────────────────────────────────

export type TemplateKey = 'ghi-chu-bai-hoc' | 'so-lenh' | 'nhat-ky-loi';

export interface NoteTemplate {
  key: TemplateKey;
  title: string;
  icon: string;
  description: string;
  /** HTML đúng schema Notes — frontend chèn thẳng bằng `insertContent`. */
  html: string;
}

/** Tên cột của Sổ lệnh — nhận diện bảng bằng tên cột, không bằng vị trí. */
export const SO_LENH_COT = ['Lệnh', 'Nghĩa', 'Ví dụ', 'Nhóm', 'Lỗi từng gặp'] as const;
export const SO_LENH_NHOM = ['Terminal', 'Git', 'npm', 'HTML', 'CSS', 'JavaScript', 'SQL', 'Docker', 'Khác'] as const;

export interface DongLenh {
  lenh: string;
  nghia: string;
  viDu?: string;
  nhom?: string;
  loi?: string;
}

const VI_DU_SO_LENH: DongLenh[] = [
  { lenh: 'pwd', nghia: 'in ra thư mục đang đứng', viDu: 'pwd → /Users/cuong/hoc', nhom: 'Terminal', loi: '' },
  { lenh: 'ls -la', nghia: 'liệt kê mọi file, kể cả file ẩn', viDu: 'ls -la ~/Downloads', nhom: 'Terminal', loi: '' },
  { lenh: 'cd <thư-mục>', nghia: 'chuyển sang thư mục khác', viDu: 'cd ..  (lùi một cấp)', nhom: 'Terminal', loi: 'cd: no such file or directory — gõ sai tên, dùng Tab để tự điền' },
  { lenh: 'mkdir -p <tên>', nghia: 'tạo thư mục mới (cả thư mục cha nếu thiếu)', viDu: 'mkdir -p du-an/src', nhom: 'Terminal', loi: 'File exists — thư mục đã có, thêm -p để khỏi báo lỗi' },
];

function cell(tag: 'th' | 'td', inner: string): string {
  return `<${tag}><p>${inner}</p></${tag}>`;
}

export function dongLenhHtml(d: DongLenh): string {
  const lenh = d.lenh.trim() ? `<code>${escapeHtml(d.lenh.trim())}</code>` : '';
  return `<tr>${cell('td', lenh)}${cell('td', escapeHtml(d.nghia ?? ''))}${cell('td', escapeHtml(d.viDu ?? ''))}${cell('td', escapeHtml(d.nhom ?? ''))}${cell('td', escapeHtml(d.loi ?? ''))}</tr>`;
}

function soLenhHtml(): string {
  const head = `<tr>${SO_LENH_COT.map((c) => cell('th', c)).join('')}</tr>`;
  return [
    '<aside data-type="callout" data-kind="tip"><p>Mỗi dòng một lệnh. Cột <strong>Lệnh</strong> để dạng <code>code</code>, cột <strong>Nghĩa</strong> viết bằng lời của bạn — nút “Ôn bằng flashcard” sẽ hỏi ngược: “Lệnh nào để &lt;nghĩa&gt;?”. Ghi nhanh một lệnh từ bất kỳ trang nào: <strong>Alt+Shift+N</strong> (Mac: ⌥⇧N) → thẻ “Sổ lệnh”.</p></aside>',
    `<table><tbody>${head}${VI_DU_SO_LENH.map(dongLenhHtml).join('')}</tbody></table>`,
    '<p></p>',
  ].join('');
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    key: 'ghi-chu-bai-hoc',
    title: 'Ghi chú bài học',
    icon: '📝',
    description: 'Tóm tắt · Lệnh/khái niệm mới · Lỗi gặp · Câu còn thắc mắc',
    html: [
      '<h2>Tóm tắt</h2><p></p>',
      '<h2>Lệnh / khái niệm mới</h2><ul><li><p></p></li></ul>',
      '<h2>Lỗi gặp</h2><ul><li><p></p></li></ul>',
      '<h2>Câu còn thắc mắc</h2><ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p></p></li></ul>',
    ].join(''),
  },
  {
    key: 'so-lenh',
    title: 'Sổ lệnh',
    icon: '⌨️',
    description: 'Bảng Lệnh · Nghĩa · Ví dụ · Nhóm · Lỗi từng gặp — ôn lại bằng flashcard',
    html: soLenhHtml(),
  },
  {
    key: 'nhat-ky-loi',
    title: 'Nhật ký lỗi',
    icon: '🐞',
    description: 'Lỗi → Nguyên nhân → Cách sửa → Bài học',
    html: [
      '<h2>Lỗi</h2><pre><code></code></pre>',
      '<h2>Nguyên nhân</h2><p></p>',
      '<h2>Cách sửa</h2><p></p>',
      '<h2>Bài học</h2><aside data-type="callout" data-kind="tip"><p></p></aside>',
    ].join(''),
  },
];

export function findTemplate(key: unknown): NoteTemplate | null {
  return NOTE_TEMPLATES.find((t) => t.key === key) ?? null;
}

// ─── Sổ lệnh: đọc / thêm dòng trong bảng ─────────────────────

function chuanHoa(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

type CotKey = 'lenh' | 'nghia' | 'viDu' | 'nhom' | 'loi';

function cotCuaTieuDe(text: string): CotKey | null {
  const t = chuanHoa(text);
  if (t === 'lenh' || t.startsWith('lenh ')) return 'lenh';
  if (t.startsWith('nghia')) return 'nghia';
  if (t.startsWith('vi du')) return 'viDu';
  if (t.startsWith('nhom')) return 'nhom';
  if (t.startsWith('loi')) return 'loi';
  return null;
}

interface BangSoLenh {
  table: JSONContent;
  cot: (CotKey | null)[];
}

/** Bảng đầu tiên có cả cột "Lệnh" và "Nghĩa" — nhận theo TÊN cột. */
export function timBangSoLenh(doc: JSONContent): BangSoLenh | null {
  let found: BangSoLenh | null = null;
  walk(doc, (n) => {
    if (found || n.type !== 'table') return;
    const header = n.content?.[0];
    if (!header) return;
    const cot = (header.content ?? []).map((c) => cotCuaTieuDe(nodeText(c)));
    if (cot.includes('lenh') && cot.includes('nghia')) found = { table: n, cot };
  });
  return found;
}

/** Các dòng của Sổ lệnh (bỏ dòng tiêu đề và dòng thiếu lệnh). */
export function docSoLenh(doc: JSONContent): DongLenh[] {
  const bang = timBangSoLenh(doc);
  if (!bang) return [];
  const rows = (bang.table.content ?? []).slice(1);
  const out: DongLenh[] = [];
  for (const r of rows) {
    const d: DongLenh = { lenh: '', nghia: '' };
    (r.content ?? []).forEach((c, i) => {
      const k = bang.cot[i];
      if (k) d[k] = nodeText(c).trim();
    });
    if (d.lenh) out.push(d);
  }
  return out;
}

function cellJson(type: 'tableCell', text: string, code = false): JSONContent {
  const para: JSONContent = { type: 'paragraph' };
  if (text) para.content = [{ type: 'text', text, ...(code ? { marks: [{ type: 'code' }] } : {}) }];
  return { type, attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [para] };
}

/**
 * Thêm một dòng vào bảng Sổ lệnh của `doc` (đổi tại chỗ). Không có bảng thì
 * chèn nguyên bảng mẫu (không kèm dòng ví dụ) vào cuối trang rồi thêm vào đó.
 */
export function themDongSoLenh(doc: TiptapDoc, d: DongLenh): TiptapDoc {
  let bang = timBangSoLenh(doc);
  if (!bang) {
    const head = `<tr>${SO_LENH_COT.map((c) => cell('th', c)).join('')}</tr>`;
    const table = htmlToDoc(`<table><tbody>${head}</tbody></table>`).content[0];
    doc.content.push(table, { type: 'paragraph' });
    bang = timBangSoLenh(doc)!;
  }
  const row: JSONContent = {
    type: 'tableRow',
    content: bang.cot.map((k) => {
      if (k === 'lenh') return cellJson('tableCell', d.lenh.trim(), true);
      return cellJson('tableCell', k ? String(d[k] ?? '').trim() : '');
    }),
  };
  bang.table.content = [...(bang.table.content ?? []), row];
  return doc;
}

/** Mặt trước thẻ ôn: "Lệnh nào để <nghĩa>?" */
export function matTruocThe(nghia: string): string {
  const n = nghia.trim().replace(/[.?!…]+$/, '');
  return `Lệnh nào để ${n}?`;
}

// ─── Đoạn lưu từ bài học ─────────────────────────────────────

/**
 * Khối nội dung cho MỘT đoạn lưu từ bài học: trích dẫn (hoặc khối code nếu
 * người dùng bôi đen trong <pre>) + một dòng nhỏ ghi giờ lưu.
 */
export function doanLuuBlocks(text: string, laCode: boolean, luc: Date): JSONContent[] {
  const gio = luc.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
  const khoi: JSONContent = laCode
    ? { type: 'codeBlock', attrs: { language: '' }, content: text ? [{ type: 'text', text }] : undefined }
    : {
      type: 'blockquote',
      content: text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => {
        const lines = p.split('\n');
        const content: JSONContent[] = [];
        lines.forEach((l, i) => {
          if (i > 0) content.push({ type: 'hardBreak' });
          if (l) content.push({ type: 'text', text: l });
        });
        return { type: 'paragraph', content: content.length ? content : undefined };
      }),
    };
  if (khoi.type === 'blockquote' && (khoi.content ?? []).length === 0) khoi.content = [{ type: 'paragraph' }];
  return [khoi, { type: 'paragraph', content: [{ type: 'text', text: `🕒 Lưu lúc ${gio}`, marks: [{ type: 'italic' }] }] }];
}

/** Các đoạn đã lưu = mọi trích dẫn / khối code ở cấp cao nhất của trang bài. */
export function docDoanDaLuu(doc: JSONContent | null | undefined): { text: string; laCode: boolean }[] {
  if (!doc) return [];
  return (doc.content ?? [])
    .filter((n) => n.type === 'blockquote' || n.type === 'codeBlock')
    .map((n) => ({
      laCode: n.type === 'codeBlock',
      text: n.type === 'codeBlock'
        ? nodeText(n)
        : (n.content ?? []).map((p) => (p.content ?? []).map((c) => (c.type === 'hardBreak' ? '\n' : c.text ?? '')).join('')).join('\n\n'),
    }))
    .filter((s) => s.text.trim().length > 0);
}
