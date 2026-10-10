/**
 * CT Work — CTW đợt 8b: chuyển nội dung NOTION ⇄ DOCS (JSON TipTap). THUẦN (không DB, không mạng) — test ở
 * notionBlocks.test.ts bằng fixture JSON tự dựng (__fixtures__/notion-*.json).
 *
 * Nhập (Notion ⇒ Docs) — `notionToTiptap(blocks, opts)`:
 *   - `blocks` là cây đã kéo đủ con (service gắn `children` cho block `has_children`).
 *   - heading_1/2/3 ⇒ heading 1/2/3 · paragraph · bulleted/numbered_list_item (gộp các mục liền nhau thành MỘT danh sách,
 *     con lồng trong mục) · to_do ⇒ taskList · code ⇒ codeBlock (giữ ngôn ngữ; "mermaid" giữ nguyên ⇒ Docs vẽ sơ đồ) ·
 *     quote ⇒ blockquote · callout ⇒ blockquote mở đầu bằng biểu tượng của callout · toggle ⇒ đoạn "▸ tiêu đề" đậm + nội
 *     dung con trong blockquote (Docs không có khối gập) · divider ⇒ horizontalRule · table/table_row ⇒ bảng (hàng đầu là
 *     tableHeader khi Notion bật "column header") · image ⇒ ảnh (src do service đã tải về kho dự án — `imageSrc`; không tải
 *     được ⇒ đoạn "[Image: … — url]") · bookmark/embed/link_preview/file/pdf/video ⇒ đoạn có liên kết · equation ⇒ codeBlock
 *     "latex" · child_page ⇒ đoạn liên kết tới trang con (service có thể nhập trang con thành trang Docs con) ·
 *     column_list/column/synced_block ⇒ trải phẳng con · loại lạ ⇒ đoạn "[Unsupported Notion block: …]".
 *   - Chữ: bold/italic/strikethrough/code ⇒ mark cùng tên (underline/màu bỏ — Docs không có); liên kết http(s)/mailto ⇒
 *     mark link; mention ⇒ chữ trơn của Notion; equation nội dòng ⇒ mark code.
 *   - Kết quả luôn hợp lệ với lược đồ Docs (collabSchema) — test kiểm bằng `Node.fromJSON(...).check()`.
 *
 * Xuất (Docs ⇒ Notion) — `tiptapToNotion(doc, opts)`:
 *   - heading 1–3 (4+ ⇒ heading_3) · paragraph · list ⇒ list item (con lồng tối đa 2 tầng — giới hạn tạo một lần của Notion
 *     API; sâu hơn trải phẳng có thụt "  ") · taskItem ⇒ to_do · blockquote ⇒ quote · codeBlock ⇒ code (ngôn ngữ ngoài danh
 *     sách Notion ⇒ "plain text") · horizontalRule ⇒ divider · table ⇒ table + table_row · image ⇒ image `file_upload`
 *     (service tải lên Notion trước — `imageUpload`) hoặc đoạn "[Image: …]" nếu không tải được.
 *   - Mỗi rich_text ≤ 2000 ký tự (cắt thành nhiều mẩu, giữ chú thích) — luật của Notion API.
 */

import type { PmMark, PmNode } from './docMarkdown.js';

// ═══ Kiểu Notion (tối thiểu — chỉ trường dùng tới) ═══════════════

export interface NotionRichText {
  type?: 'text' | 'mention' | 'equation';
  plain_text?: string;
  href?: string | null;
  text?: { content: string; link?: { url: string } | null };
  equation?: { expression: string };
  annotations?: { bold?: boolean; italic?: boolean; strikethrough?: boolean; underline?: boolean; code?: boolean; color?: string };
}

export interface NotionBlock {
  id?: string;
  type: string;
  has_children?: boolean;
  /** Service gắn con đã kéo về (đệ quy). */
  children?: NotionBlock[];
  [k: string]: unknown;
}

const MAX_DOCS_HEADING = 4;

// ═══ Notion ⇒ TipTap ═════════════════════════════════════════════

const safeHref = (u: unknown): string | null => {
  const s = typeof u === 'string' ? u.trim() : '';
  return /^(https?:\/\/|mailto:)[^\s"'<>]+$/i.test(s) ? s.slice(0, 2000) : null;
};

/** rich_text[] ⇒ nút text TipTap (giữ mark). Xuống dòng trong chữ ⇒ hardBreak. */
export function richToInline(rich: NotionRichText[] | undefined): PmNode[] {
  const out: PmNode[] = [];
  for (const r of rich ?? []) {
    const text = r.type === 'equation' ? r.equation?.expression ?? r.plain_text ?? '' : r.text?.content ?? r.plain_text ?? '';
    if (!text) continue;
    const marks: PmMark[] = [];
    const a = r.annotations ?? {};
    if (a.bold) marks.push({ type: 'bold' });
    if (a.italic) marks.push({ type: 'italic' });
    if (a.strikethrough) marks.push({ type: 'strike' });
    if (a.code || r.type === 'equation') marks.push({ type: 'code' });
    const href = safeHref(r.text?.link?.url ?? r.href);
    // Mark code của TipTap loại trừ mọi mark khác (excludes: '_') ⇒ code thì bỏ link/đậm.
    const finalMarks = marks.some((m) => m.type === 'code') ? [{ type: 'code' }] : href ? [...marks, { type: 'link', attrs: { href, target: '_blank', rel: 'noopener noreferrer nofollow', class: null } }] : marks;
    text.split('\n').forEach((part, i) => {
      if (i > 0) out.push({ type: 'hardBreak' });
      if (part) out.push({ type: 'text', text: part, ...(finalMarks.length ? { marks: finalMarks } : {}) });
    });
  }
  return out;
}

export const plainOf = (rich: NotionRichText[] | undefined) => (rich ?? []).map((r) => r.plain_text ?? r.text?.content ?? r.equation?.expression ?? '').join('');

const para = (content: PmNode[] = []): PmNode => (content.length ? { type: 'paragraph', content } : { type: 'paragraph' });
const textNode = (text: string, marks?: PmMark[]): PmNode => ({ type: 'text', text, ...(marks?.length ? { marks } : {}) });
const linkPara = (label: string, url: string | null): PmNode => {
  const href = safeHref(url);
  return para(href ? [textNode(label, [{ type: 'link', attrs: { href, target: '_blank', rel: 'noopener noreferrer nofollow', class: null } }])] : [textNode(label)]);
};

/** Ngôn ngữ code của Notion ⇒ tên ngôn ngữ của Docs (lowlight). */
const NOTION_LANG_TO_DOCS: Record<string, string> = {
  'plain text': '', 'c++': 'cpp', 'c#': 'csharp', 'f#': 'fsharp', shell: 'bash', 'java/c/c++/c#': 'java', markup: 'xml', 'visual basic': 'vbnet',
};
const DOCS_LANG_TO_NOTION: Record<string, string> = { cpp: 'c++', csharp: 'c#', fsharp: 'f#', sh: 'shell', bash: 'bash', xml: 'markup', html: 'html', ts: 'typescript', js: 'javascript', py: 'python', yml: 'yaml', md: 'markdown', vbnet: 'visual basic', '': 'plain text' };
/** Danh sách ngôn ngữ Notion API chấp nhận (ngoài danh sách ⇒ 400 từ Notion) — rút gọn những cái hay gặp. */
const NOTION_LANGS = new Set([
  'abap', 'arduino', 'bash', 'basic', 'c', 'clojure', 'coffeescript', 'c++', 'c#', 'css', 'dart', 'diff', 'docker', 'elixir', 'elm', 'erlang', 'flow', 'fortran', 'f#',
  'gherkin', 'glsl', 'go', 'graphql', 'groovy', 'haskell', 'html', 'java', 'javascript', 'json', 'julia', 'kotlin', 'latex', 'less', 'lisp', 'livescript', 'lua',
  'makefile', 'markdown', 'markup', 'matlab', 'mermaid', 'nix', 'objective-c', 'ocaml', 'pascal', 'perl', 'php', 'plain text', 'powershell', 'prolog', 'protobuf',
  'python', 'r', 'reason', 'ruby', 'rust', 'sass', 'scala', 'scheme', 'scss', 'shell', 'sql', 'swift', 'typescript', 'vb.net', 'verilog', 'vhdl', 'visual basic',
  'webassembly', 'xml', 'yaml', 'java/c/c++/c#',
]);

export function docsLangToNotion(lang: unknown): string {
  const l = String(lang ?? '').trim().toLowerCase();
  const m = DOCS_LANG_TO_NOTION[l] ?? l;
  return NOTION_LANGS.has(m) ? m : 'plain text';
}
export function notionLangToDocs(lang: unknown): string | null {
  const l = String(lang ?? '').trim().toLowerCase();
  const m = l in NOTION_LANG_TO_DOCS ? NOTION_LANG_TO_DOCS[l] : l;
  return m && /^[a-z0-9#+.-]{1,30}$/.test(m) ? m : null;
}

export interface NotionImportOptions {
  /** id block ảnh ⇒ src đã tải vào kho dự án (null = không tải được). */
  imageSrc?: (block: NotionBlock) => string | null;
  /** id trang con ⇒ số trang Docs (đã nhập kèm) — có thì đoạn liên kết ghi "→ DOC-n". */
  childPageLabel?: (block: NotionBlock) => string | null;
}

export interface NotionImportResult {
  doc: PmNode;
  /** Ảnh không tải được + loại block lạ — để báo người dùng. */
  warnings: string[];
  /** Trang con gặp trong nội dung (id + tiêu đề) — service quyết định có nhập tiếp không. */
  childPages: Array<{ id: string; title: string }>;
}

const LIST_TYPES: Record<string, 'bulletList' | 'orderedList' | 'taskList'> = { bulleted_list_item: 'bulletList', numbered_list_item: 'orderedList', to_do: 'taskList' };

function payload(b: NotionBlock): Record<string, any> {
  return ((b as Record<string, unknown>)[b.type] ?? {}) as Record<string, any>;
}

function fileUrl(p: Record<string, any>): string | null {
  return (p.type === 'external' ? p.external?.url : p.file?.url) ?? p.external?.url ?? p.file?.url ?? null;
}

export function notionToTiptap(blocks: NotionBlock[], opts: NotionImportOptions = {}): NotionImportResult {
  const warnings: string[] = [];
  const childPages: Array<{ id: string; title: string }> = [];

  const convertList = (list: NotionBlock[]): PmNode[] => {
    const out: PmNode[] = [];
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      const lt = LIST_TYPES[b.type];
      if (lt) {
        // Gộp các mục CÙNG loại liền nhau thành một danh sách.
        const items: PmNode[] = [];
        let j = i;
        while (j < list.length && list[j].type === b.type) {
          const it = list[j];
          const p = payload(it);
          const kids = convertList(it.children ?? []);
          const content = [para(richToInline(p.rich_text)), ...kids];
          items.push(lt === 'taskList' ? { type: 'taskItem', attrs: { checked: !!p.checked }, content } : { type: 'listItem', content });
          j++;
        }
        out.push({ type: lt, ...(lt === 'orderedList' ? { attrs: { start: 1 } } : {}), content: items });
        i = j - 1;
        continue;
      }
      out.push(...convertBlock(b));
    }
    return out;
  };

  const convertBlock = (b: NotionBlock): PmNode[] => {
    const p = payload(b);
    const kids = () => convertList(b.children ?? []);
    switch (b.type) {
      case 'paragraph': {
        const inl = richToInline(p.rich_text);
        return [para(inl), ...kids()];
      }
      case 'heading_1': case 'heading_2': case 'heading_3': {
        const level = Math.min(Number(b.type.slice(-1)), MAX_DOCS_HEADING);
        const inl = richToInline(p.rich_text);
        const head: PmNode = inl.length ? { type: 'heading', attrs: { level }, content: inl.filter((n) => n.type !== 'hardBreak') } : para();
        // Heading dạng toggle (is_toggleable) có con ⇒ con nằm ngay sau.
        return [head, ...kids()];
      }
      case 'quote': {
        const content = [para(richToInline(p.rich_text)), ...kids()];
        return [{ type: 'blockquote', content }];
      }
      case 'callout': {
        const icon = p.icon?.type === 'emoji' && typeof p.icon.emoji === 'string' ? `${p.icon.emoji} ` : '';
        const inl = richToInline(p.rich_text);
        return [{ type: 'blockquote', content: [para(icon ? [textNode(icon), ...inl] : inl), ...kids()] }];
      }
      case 'toggle': {
        const inl = richToInline(p.rich_text).map((n) => (n.type === 'text' && !n.marks?.some((m) => m.type === 'code') ? { ...n, marks: [...(n.marks ?? []), { type: 'bold' }] } : n));
        const body = kids();
        return [para([textNode('▸ ', [{ type: 'bold' }]), ...inl]), ...(body.length ? [{ type: 'blockquote', content: body }] : [])];
      }
      case 'code': {
        const lang = notionLangToDocs(p.language);
        const text = plainOf(p.rich_text);
        return [{ type: 'codeBlock', attrs: { language: lang }, ...(text ? { content: [textNode(text)] } : {}) }];
      }
      case 'equation': {
        const text = String(p.expression ?? '');
        return [{ type: 'codeBlock', attrs: { language: 'latex' }, ...(text ? { content: [textNode(text)] } : {}) }];
      }
      case 'divider':
        return [{ type: 'horizontalRule' }];
      case 'image': {
        const src = opts.imageSrc?.(b) ?? null;
        const caption = plainOf(p.caption).trim();
        if (src) return [{ type: 'image', attrs: { src, alt: caption || null, title: null } }];
        const url = fileUrl(p);
        warnings.push(`An image could not be copied${caption ? ` (“${caption.slice(0, 60)}”)` : ''}`);
        // URL tệp Notion là link ký hết hạn sau 1 giờ — không dán link đó vào trang.
        return [linkPara(`[Image${caption ? `: ${caption}` : ''}]`, p.type === 'external' ? url : null)];
      }
      case 'bookmark': case 'embed': case 'link_preview': {
        const url = p.url ?? null;
        const caption = plainOf(p.caption).trim();
        return [linkPara(caption || url || b.type, url)];
      }
      case 'file': case 'pdf': case 'video': case 'audio': {
        const caption = plainOf(p.caption).trim() || String(p.name ?? '') || b.type;
        return [linkPara(`[${b.type === 'pdf' ? 'PDF' : b.type[0].toUpperCase() + b.type.slice(1)}: ${caption}]`, p.type === 'external' ? fileUrl(p) : null)];
      }
      case 'child_page': {
        const title = String(p.title ?? 'Untitled');
        if (b.id) childPages.push({ id: b.id, title });
        const label = opts.childPageLabel?.(b);
        return [para([textNode('📄 ', []), textNode(label ? `${title} → ${label}` : title, [{ type: 'bold' }])])];
      }
      case 'child_database': {
        warnings.push(`Inline database “${String(p.title ?? '')}” was not copied — import it as issues from the Notion tab`);
        return [para([textNode(`[Notion database: ${String(p.title ?? 'Untitled')}]`)])];
      }
      case 'table': {
        const rows = (b.children ?? []).filter((r) => r.type === 'table_row');
        if (!rows.length) return [];
        const width = Math.max(1, Number(p.table_width) || Math.max(...rows.map((r) => (payload(r).cells ?? []).length)));
        const header = !!p.has_column_header;
        const content = rows.map((r, ri) => {
          const cells = (payload(r).cells ?? []) as NotionRichText[][];
          const row: PmNode[] = [];
          for (let c = 0; c < width; c++) {
            const inl = richToInline(cells[c]);
            row.push({ type: header && ri === 0 ? 'tableHeader' : 'tableCell', attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [para(inl)] });
          }
          return { type: 'tableRow', content: row };
        });
        return [{ type: 'table', content }];
      }
      case 'column_list': case 'column': case 'synced_block': case 'template':
        return kids();
      case 'table_of_contents': case 'breadcrumb':
        return [];
      default: {
        if (b.type === 'unsupported' || !b.type) warnings.push('A block Notion does not share through its API was skipped');
        else warnings.push(`Unsupported Notion block “${b.type}” was kept as text`);
        const text = plainOf(p.rich_text);
        return [para([textNode(text || `[Unsupported Notion block: ${b.type}]`)]), ...kids()];
      }
    }
  };

  const content = convertList(blocks);
  return { doc: { type: 'doc', content: content.length ? content : [para()] }, warnings: [...new Set(warnings)], childPages };
}

// ═══ TipTap ⇒ Notion ═════════════════════════════════════════════

export const NOTION_TEXT_MAX = 2000;
/** Tầng lồng tối đa trong MỘT lời gọi tạo/nối block của Notion API. */
const MAX_NEST = 2;

export interface NotionExportOptions {
  /** src ảnh ⇒ id file_upload của Notion (service đã tải lên) — null ⇒ in chữ thay thế. */
  imageUpload?: (src: string) => string | null;
}

export interface NotionExportResult { blocks: NotionBlock[]; warnings: string[] }

/** Nút inline TipTap ⇒ rich_text Notion (mỗi mẩu ≤ 2000 ký tự). */
export function inlineToRich(nodes: PmNode[] | undefined): NotionRichText[] {
  const out: NotionRichText[] = [];
  const push = (text: string, marks: PmMark[] | undefined) => {
    if (!text) return;
    const ann = {
      bold: !!marks?.some((m) => m.type === 'bold'), italic: !!marks?.some((m) => m.type === 'italic'),
      strikethrough: !!marks?.some((m) => m.type === 'strike'), underline: false, code: !!marks?.some((m) => m.type === 'code'), color: 'default',
    };
    const href = safeHref(marks?.find((m) => m.type === 'link')?.attrs?.href);
    for (let i = 0; i < text.length; i += NOTION_TEXT_MAX) {
      const part = text.slice(i, i + NOTION_TEXT_MAX);
      out.push({ type: 'text', text: { content: part, link: href ? { url: href } : null }, annotations: ann });
    }
  };
  for (const n of nodes ?? []) {
    if (n.type === 'text') push(n.text ?? '', n.marks);
    else if (n.type === 'hardBreak') push('\n', undefined);
    else if (n.type === 'mention') push(`@${String(n.attrs?.label ?? '')}`, undefined);
    else if (n.content) out.push(...inlineToRich(n.content));
  }
  // Gộp mẩu liền nhau cùng chú thích ⇒ ít mẩu hơn (Notion giới hạn 100 mẩu/khối).
  const merged: NotionRichText[] = [];
  for (const r of out) {
    const prev = merged[merged.length - 1];
    if (prev && JSON.stringify(prev.annotations) === JSON.stringify(r.annotations) && JSON.stringify(prev.text?.link ?? null) === JSON.stringify(r.text?.link ?? null)
      && (prev.text!.content.length + r.text!.content.length) <= NOTION_TEXT_MAX) {
      prev.text!.content += r.text!.content;
    } else merged.push({ ...r, text: { ...r.text! } });
  }
  return merged.slice(0, 100);
}

const nb = (type: string, body: Record<string, unknown>, children?: NotionBlock[]): NotionBlock => ({
  object: 'block', type, [type]: children?.length ? { ...body, children } : body,
} as NotionBlock);

const plain = (n: PmNode | undefined): string => (n ? (typeof n.text === 'string' ? n.text : (n.content ?? []).map(plain).join(n.type === 'paragraph' ? '' : '')) : '');

export function tiptapToNotion(doc: unknown, opts: NotionExportOptions = {}): NotionExportResult {
  const warnings: string[] = [];
  const root = (doc && typeof doc === 'object' ? doc : { type: 'doc', content: [] }) as PmNode;

  /** `depth` = tầng lồng hiện tại (0 = cấp trang). Trả các block cùng cấp. */
  const blocks = (nodes: PmNode[] | undefined, depth: number): NotionBlock[] => (nodes ?? []).flatMap((n) => block(n, depth));

  const listItem = (type: 'bulleted_list_item' | 'numbered_list_item' | 'to_do', li: PmNode, depth: number, extra: Record<string, unknown> = {}): NotionBlock[] => {
    const kids = li.content ?? [];
    const first = kids[0]?.type === 'paragraph' ? kids[0] : null;
    const rest = first ? kids.slice(1) : kids;
    const rich = inlineToRich(first?.content);
    if (depth < MAX_NEST) return [nb(type, { rich_text: rich, ...extra }, blocks(rest, depth + 1))];
    // Quá sâu ⇒ trải phẳng, giữ thụt bằng chữ.
    const indent = '  '.repeat(depth - MAX_NEST + 1);
    return [nb(type, { rich_text: [{ type: 'text', text: { content: indent, link: null } }, ...rich], ...extra }), ...blocks(rest, depth)];
  };

  const block = (n: PmNode, depth: number): NotionBlock[] => {
    switch (n.type) {
      case 'heading': {
        const lv = Math.min(Math.max(Number(n.attrs?.level ?? 1), 1), 3);
        return [nb(`heading_${lv}`, { rich_text: inlineToRich(n.content) })];
      }
      case 'paragraph':
        return [nb('paragraph', { rich_text: inlineToRich(n.content) })];
      case 'bulletList':
        return (n.content ?? []).flatMap((li) => listItem('bulleted_list_item', li, depth));
      case 'orderedList':
        return (n.content ?? []).flatMap((li) => listItem('numbered_list_item', li, depth));
      case 'taskList':
        return (n.content ?? []).flatMap((li) => listItem('to_do', li, depth, { checked: !!li.attrs?.checked }));
      case 'blockquote': {
        const kids = n.content ?? [];
        const first = kids[0]?.type === 'paragraph' ? kids[0] : null;
        const rest = first ? kids.slice(1) : kids;
        if (depth < MAX_NEST) return [nb('quote', { rich_text: inlineToRich(first?.content) }, blocks(rest, depth + 1))];
        return [nb('quote', { rich_text: inlineToRich(first?.content) }), ...blocks(rest, depth)];
      }
      case 'codeBlock': {
        const text = plain(n);
        const rich: NotionRichText[] = [];
        for (let i = 0; i < Math.max(1, text.length); i += NOTION_TEXT_MAX) rich.push({ type: 'text', text: { content: text.slice(i, i + NOTION_TEXT_MAX), link: null } });
        return [nb('code', { rich_text: rich.slice(0, 100), language: docsLangToNotion(n.attrs?.language) })];
      }
      case 'horizontalRule':
        return [nb('divider', {})];
      case 'image': {
        const src = String(n.attrs?.src ?? '');
        const alt = String(n.attrs?.alt ?? '').trim();
        const id = src ? opts.imageUpload?.(src) ?? null : null;
        const caption = alt ? [{ type: 'text' as const, text: { content: alt.slice(0, NOTION_TEXT_MAX), link: null } }] : [];
        if (id) return [nb('image', { type: 'file_upload', file_upload: { id }, caption })];
        if (/^https:\/\//i.test(src)) return [nb('image', { type: 'external', external: { url: src }, caption })];
        warnings.push(`An image could not be uploaded to Notion${alt ? ` (“${alt.slice(0, 60)}”)` : ''}`);
        return [nb('paragraph', { rich_text: [{ type: 'text', text: { content: `[Image${alt ? `: ${alt}` : ''}]`, link: null } }] })];
      }
      case 'table': {
        const rows = (n.content ?? []).filter((r) => r.type === 'tableRow');
        if (!rows.length) return [];
        const width = Math.max(1, ...rows.map((r) => (r.content ?? []).length));
        const header = (rows[0].content ?? []).every((c) => c.type === 'tableHeader');
        const tr = rows.map((r) => {
          const cells: NotionRichText[][] = [];
          for (let c = 0; c < width; c++) {
            const cell = r.content?.[c];
            cells.push(inlineToRich((cell?.content ?? []).flatMap((p, i) => [...(i ? [{ type: 'hardBreak' }] : []), ...(p.content ?? [])])));
          }
          return { object: 'block', type: 'table_row', table_row: { cells } } as NotionBlock;
        });
        if (depth >= MAX_NEST) { warnings.push('A table nested too deep was moved up a level'); }
        return [{ object: 'block', type: 'table', table: { table_width: width, has_column_header: header, has_row_header: false, children: tr } } as NotionBlock];
      }
      default:
        // Nút lạ (mention khối, commentAnchor…) ⇒ lấy chữ.
        if (n.content) return n.content.some((c) => c.type === 'text' || c.type === 'hardBreak') ? [nb('paragraph', { rich_text: inlineToRich(n.content) })] : blocks(n.content, depth);
        return [];
    }
  };

  return { blocks: blocks(root.content, 0), warnings: [...new Set(warnings)] };
}

/** Chia block cấp trang thành lô ≤ 100 (giới hạn mỗi lời gọi tạo/nối của Notion API). */
export function chunkBlocks<T>(list: T[], size = 100): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/** Tiêu đề trang Notion từ đối tượng page (thuộc tính kiểu "title"). */
export function notionPageTitle(page: { properties?: Record<string, { type?: string; title?: NotionRichText[] }> } | null | undefined): string {
  const props = page?.properties ?? {};
  for (const v of Object.values(props)) if (v?.type === 'title') return plainOf(v.title).trim() || 'Untitled';
  return 'Untitled';
}

// ═══ Database Notion ⇒ bảng cho bộ nhập (importParsers.parseTable) ══

/** Giá trị một thuộc tính database Notion ⇒ chuỗi (ngày ⇒ YYYY-MM-DD, người ⇒ email nếu có, không thì tên). */
export function notionPropText(p: Record<string, any> | undefined): string {
  if (!p) return '';
  switch (p.type) {
    case 'title': return plainOf(p.title);
    case 'rich_text': return plainOf(p.rich_text);
    case 'number': return p.number === null || p.number === undefined ? '' : String(p.number);
    case 'select': return p.select?.name ?? '';
    case 'status': return p.status?.name ?? '';
    case 'multi_select': return (p.multi_select ?? []).map((x: { name: string }) => x.name).join(', ');
    case 'date': return p.date?.start ? String(p.date.start).slice(0, 10) : '';
    case 'checkbox': return p.checkbox ? 'Done' : '';
    case 'people': return (p.people ?? []).map((u: any) => u?.person?.email ?? u?.name ?? '').filter(Boolean).join(', ');
    case 'created_by': case 'last_edited_by': return p[p.type]?.person?.email ?? p[p.type]?.name ?? '';
    case 'url': return p.url ?? '';
    case 'email': return p.email ?? '';
    case 'phone_number': return p.phone_number ?? '';
    case 'created_time': case 'last_edited_time': return String(p[p.type] ?? '').slice(0, 10);
    case 'formula': {
      const f = p.formula ?? {};
      return f.type === 'date' ? String(f.date?.start ?? '').slice(0, 10) : String(f[f.type] ?? '');
    }
    case 'unique_id': return p.unique_id ? `${p.unique_id.prefix ? `${p.unique_id.prefix}-` : ''}${p.unique_id.number}` : '';
    case 'relation': return (p.relation ?? []).map((r: { id: string }) => r.id).join(', ');
    case 'rollup': return p.rollup?.type === 'number' ? String(p.rollup.number ?? '') : '';
    default: return '';
  }
}

export interface NotionDbRow { id: string; url?: string; properties: Record<string, Record<string, any>> }

/**
 * Hàng database ⇒ bảng chữ: cột đầu "Notion ID" (khoá chống trùng — `externalId`), rồi các thuộc tính theo thứ tự
 * schema. Người dùng ghép cột ⇒ trường ở bước xem trước (MAP_FIELDS của bộ nhập 7b).
 */
export function notionRowsToTable(schema: Array<{ name: string; type: string }>, rows: NotionDbRow[]): string[][] {
  const cols = schema.filter((s) => !['button', 'files', 'verification'].includes(s.type));
  const header = ['Notion ID', ...cols.map((c) => c.name)];
  return [header, ...rows.map((r) => [r.id, ...cols.map((c) => notionPropText(r.properties?.[c.name]))])];
}

/** Gợi ý ghép thuộc tính ⇒ trường theo KIỂU thuộc tính (ngoài gợi ý theo tên của importParsers). */
export function suggestNotionMapping(schema: Array<{ name: string; type: string }>): Record<string, number | null> {
  const out: Record<string, number | null> = { externalId: 0 };
  const idx = (pred: (s: { name: string; type: string }) => boolean) => {
    const i = schema.findIndex(pred);
    return i >= 0 ? i + 1 : null;
  };
  out.title = idx((s) => s.type === 'title');
  out.status = idx((s) => s.type === 'status') ?? idx((s) => s.type === 'select' && /status|state|trạng thái/i.test(s.name));
  out.assignee = idx((s) => s.type === 'people' && /assign|owner|người|phụ trách/i.test(s.name)) ?? idx((s) => s.type === 'people');
  out.due = idx((s) => s.type === 'date' && /due|deadline|hạn/i.test(s.name)) ?? idx((s) => s.type === 'date');
  out.labels = idx((s) => s.type === 'multi_select');
  out.priority = idx((s) => s.type === 'select' && /priority|ưu tiên/i.test(s.name));
  out.storyPoints = idx((s) => s.type === 'number' && /point|estimate|điểm/i.test(s.name));
  out.description = idx((s) => s.type === 'rich_text' && /desc|note|detail|mô tả|ghi chú/i.test(s.name));
  return out;
}
