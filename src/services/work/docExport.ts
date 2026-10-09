/**
 * CT Work — CTW đợt 3A (A9): XUẤT MỘT TRANG DOCS RA WORD (.docx) VÀ PDF.
 *
 * Một bước chuẩn bị (`prepareDoc`) + hai bộ vẽ. Cả hai đọc thẳng JSON TipTap đã lưu — không đi qua HTML/Markdown
 * nên bảng, ảnh, khối code, danh sách lồng giữ đúng cấu trúc.
 *
 *   - Đề mục 1–4 ⇒ Heading 1–4 THẬT của Word (kiểu chữ giống mẫu FPT: Calibri, H1 16pt đỏ sẫm C00000) + bookmark
 *     ⇒ Mục lục là trường TOC thật của Word có sẵn mục (cachedEntries) — mở ra đã thấy, F9 cập nhật số trang.
 *     PDF: trang mục lục có số trang thật (vẽ sau cùng nhờ bufferPages) + outline (bookmark của trình đọc PDF).
 *   - Ảnh: chỉ ảnh đã tải lên dự án (`resolveImage` do route cấp — đọc kho lưu trữ, kiểm đúng dự án). Ảnh https
 *     ngoài KHÔNG tải về máy chủ (chống SSRF) ⇒ in dòng "[Image: alt — url]".
 *   - Mermaid: máy chủ không có trình duyệt để vẽ ⇒ client vẽ sẵn PNG gửi kèm (`diagrams`, theo thứ tự khối
 *     ```mermaid trong trang). Thiếu ảnh ⇒ in mã nguồn sơ đồ như khối code, có chú thích.
 *   - Ghi chú hướng dẫn của mẫu (khối trích dẫn mở đầu "Guide:" / "Purpose:"…) bị bỏ khi `stripGuides`.
 *
 * PDF dùng lại font có dấu tiếng Việt của CV Builder (như exchange.service.ts) — Helvetica mặc định của pdfkit
 * không có glyph tiếng Việt và KHÔNG báo lỗi. THUẦN (không DB) — test ở docExport.test.ts.
 */

import {
  AlignmentType, BookmarkEnd, BookmarkStart, BorderStyle, Document, ExternalHyperlink, Footer, HeadingLevel, ImageRun,
  LevelFormat, Packer, PageBreak, PageNumber, Paragraph, ShadingType, Table, TableCell, TableOfContents, TableRow, TextRun,
  WidthType, type ParagraphChild,
} from 'docx';
import PDFDocument from 'pdfkit';
import { notoSansViBoldBuffer, notoSansViBuffer } from '../cv/export/font.js';
import type { PmMark, PmNode } from './docMarkdown.js';

export interface ExportImage { buffer: Buffer; type: 'png' | 'jpg'; width: number; height: number }

export interface ExportMeta {
  title: string;
  projectName: string;
  projectKey: string;
  /** "DOC-12" — in trên trang bìa. */
  docLabel: string;
  version: number | null;
  date: Date;
  /** Trang thuộc bộ mẫu FPT Capstone ⇒ bìa "CAPSTONE PROJECT REPORT" như bản gốc. */
  capstone: boolean;
  /**
   * CTW đợt 4 (A18): bìa của Report 7 Final như tệp gốc `Report7_Final Project Report.docx` — "MINISTRY OF EDUCATION AND
   * TRAINING / FPT UNIVERSITY / Capstone Project Document / <tên dự án>" + bảng mã nhóm · Group Members · Supervisor ·
   * Ext Supervisor + "– <nơi>, <tháng năm> –". Có thì thay bìa capstone thường.
   */
  finalCover?: FinalCover | null;
}

export interface FinalCover {
  projectTitle: string;
  groupCode: string | null;
  members: string[];
  supervisor: string | null;
  extSupervisor?: string | null;
  place?: string | null;
}

export interface ExportOptions {
  stripGuides?: boolean;
  toc?: boolean;
  cover?: boolean;
  /** Ảnh theo `src` của nút image (null = không lấy được ⇒ in chữ thay thế). */
  resolveImage: (src: string) => Promise<ExportImage | null>;
  /** PNG của các khối Mermaid, theo thứ tự xuất hiện. null = client không vẽ được khối đó. */
  diagrams?: Array<ExportImage | null>;
}

// ─── Chuẩn bị ────────────────────────────────────────────────────

export interface PreparedHeading { level: number; text: string; anchor: string }

export interface Prepared {
  blocks: PmNode[];
  headings: PreparedHeading[];
  /** Ánh xạ nút heading ⇒ anchor (theo thứ tự duyệt). */
  anchorOf: Map<PmNode, string>;
  /** Thứ tự khối Mermaid ⇒ chỉ số trong `diagrams`. */
  mermaidIndex: Map<PmNode, number>;
  imageSrcs: string[];
}

export function plainText(n: PmNode | undefined): string {
  if (!n) return '';
  if (typeof n.text === 'string') return n.text;
  if (n.type === 'mention') return `@${String(n.attrs?.label ?? '')}`;
  if (n.type === 'hardBreak') return '\n';
  return (n.content ?? []).map(plainText).join('');
}

/** Khối trích dẫn là GHI CHÚ HƯỚNG DẪN của mẫu (không phải nội dung nộp). */
export function isGuideNote(n: PmNode): boolean {
  if (n.type !== 'blockquote') return false;
  return /^\s*(Guide|Purpose|Who fills|When|Standard|Mục đích|Ai điền|Khi nào|Chuẩn tham chiếu|Hướng dẫn)\s*:/i.test(plainText(n));
}

export function isMermaid(n: PmNode): boolean {
  return n.type === 'codeBlock' && String(n.attrs?.language ?? '').toLowerCase() === 'mermaid';
}

export function prepareDoc(doc: unknown, opts: { stripGuides?: boolean } = {}): Prepared {
  const root = (doc && typeof doc === 'object' ? doc : { type: 'doc', content: [] }) as PmNode;
  const blocks = (root.content ?? []).filter((b) => !(opts.stripGuides && isGuideNote(b)));
  const headings: PreparedHeading[] = [];
  const anchorOf = new Map<PmNode, string>();
  const mermaidIndex = new Map<PmNode, number>();
  const imageSrcs: string[] = [];
  const walk = (n: PmNode) => {
    if (n.type === 'heading') {
      const text = plainText(n).trim();
      if (text) {
        const anchor = `_Toc_ctw${headings.length + 1}`;
        headings.push({ level: Math.min(Math.max(Number(n.attrs?.level ?? 1), 1), 4), text, anchor });
        anchorOf.set(n, anchor);
      }
    }
    if (isMermaid(n)) mermaidIndex.set(n, mermaidIndex.size);
    if (n.type === 'image' && typeof n.attrs?.src === 'string') imageSrcs.push(n.attrs.src);
    for (const c of n.content ?? []) walk(c);
  };
  for (const b of blocks) walk(b);
  return { blocks, headings, anchorOf, mermaidIndex, imageSrcs };
}

/** Ảnh vừa khung: rộng tối đa `maxW` (cùng đơn vị với width/height của ảnh), giữ tỉ lệ. */
export function fitImage(w: number, h: number, maxW: number, maxH = Infinity): { width: number; height: number } {
  const W = Math.max(1, w || 1);
  const H = Math.max(1, h || 1);
  const k = Math.min(1, maxW / W, maxH / H);
  return { width: Math.max(1, Math.round(W * k)), height: Math.max(1, Math.round(H * k)) };
}

function httpLink(marks: PmMark[] | undefined): string | null {
  const l = marks?.find((m) => m.type === 'link');
  const href = String(l?.attrs?.href ?? '');
  return /^(https?:|mailto:)/i.test(href) ? href : null;
}

const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Ảnh cho mọi nút image của trang (tải song song, lỗi ⇒ null). */
async function loadImages(p: Prepared, resolve: ExportOptions['resolveImage']): Promise<Map<string, ExportImage | null>> {
  const out = new Map<string, ExportImage | null>();
  const uniq = [...new Set(p.imageSrcs)].slice(0, 200);
  await Promise.all(uniq.map(async (src) => {
    try { out.set(src, await resolve(src)); } catch { out.set(src, null); }
  }));
  return out;
}

// ═══ WORD (.docx) ════════════════════════════════════════════════

const FONT = 'Calibri';
const MONO = 'Consolas';
/** Bề rộng vùng chữ A4 lề 1 inch ≈ 6,27 in ≈ 600 px (docx tính ảnh theo px 96 dpi). */
const DOCX_MAX_IMG_W = 600;
const DOCX_MAX_IMG_H = 820;
const HEADINGS = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4];
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: '8EAADB' };

interface DocxCtx {
  p: Prepared;
  images: Map<string, ExportImage | null>;
  diagrams: Array<ExportImage | null>;
  /** Mỗi danh sách đánh số một `instance` riêng ⇒ đánh số lại từ 1. */
  listInstance: number;
}

function docxRuns(nodes: PmNode[] | undefined, base: { bold?: boolean } = {}): ParagraphChild[] {
  const out: ParagraphChild[] = [];
  for (const n of nodes ?? []) {
    if (n.type === 'hardBreak') { out.push(new TextRun({ text: '', break: 1 })); continue; }
    if (n.type === 'mention') { out.push(new TextRun({ text: `@${String(n.attrs?.label ?? '')}`, bold: true, font: FONT })); continue; }
    if (n.type !== 'text') { out.push(...docxRuns(n.content, base)); continue; }
    const marks = n.marks ?? [];
    const has = (t: string) => marks.some((m) => m.type === t);
    const code = has('code');
    const href = httpLink(marks);
    const run = new TextRun({
      text: n.text ?? '',
      bold: base.bold || has('bold') || undefined,
      italics: has('italic') || undefined,
      strike: has('strike') || undefined,
      font: code ? MONO : FONT,
      ...(code ? { shading: { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' } } : {}),
      ...(href ? { style: 'Hyperlink' } : {}),
    });
    out.push(href ? new ExternalHyperlink({ link: href, children: [run] }) : run);
  }
  return out;
}

function imageParagraph(img: ExportImage, caption?: string | null): Paragraph[] {
  const size = fitImage(img.width, img.height, DOCX_MAX_IMG_W, DOCX_MAX_IMG_H);
  const out = [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: caption ? 40 : 160 },
    children: [new ImageRun({ type: img.type, data: img.buffer, transformation: size, altText: caption ? { name: caption.slice(0, 120), description: caption, title: caption.slice(0, 120) } : undefined })],
  })];
  if (caption) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: caption, italics: true, size: 18, color: '595959', font: FONT })] }));
  return out;
}

function codeParagraphs(text: string, caption?: string): Paragraph[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out = lines.map((line, i) => new Paragraph({
    shading: { type: ShadingType.CLEAR, fill: 'F5F5F5', color: 'auto' },
    spacing: { before: i === 0 ? 120 : 0, after: i === lines.length - 1 ? 120 : 0, line: 260 },
    children: [new TextRun({ text: line || ' ', font: MONO, size: 19 })],
  }));
  if (caption) out.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: caption, italics: true, size: 18, color: '595959', font: FONT })] }));
  return out;
}

function docxBlocks(nodes: PmNode[] | undefined, ctx: DocxCtx, list?: { ref: 'ctw-bullet' | 'ctw-number'; level: number; instance: number }): Array<Paragraph | Table> {
  const out: Array<Paragraph | Table> = [];
  for (const n of nodes ?? []) out.push(...docxBlock(n, ctx, list));
  return out;
}

function docxBlock(n: PmNode, ctx: DocxCtx, list?: { ref: 'ctw-bullet' | 'ctw-number'; level: number; instance: number }): Array<Paragraph | Table> {
  switch (n.type) {
    case 'heading': {
      const level = Math.min(Math.max(Number(n.attrs?.level ?? 1), 1), 4);
      const anchor = ctx.p.anchorOf.get(n);
      const runs = docxRuns(n.content);
      // BookmarkStart/End tự đánh id: `new Bookmark()` của thư viện docx cho MỌI bookmark cùng w:id="1" (mỗi lần tạo một
      // bộ đếm mới) ⇒ Word coi là trùng. id lấy theo số thứ tự đề mục.
      const bid = anchor ? Number(anchor.replace(/\D+/g, '')) : 0;
      return [new Paragraph({
        heading: HEADINGS[level - 1],
        children: anchor ? [new BookmarkStart(anchor, bid) as unknown as ParagraphChild, ...runs, new BookmarkEnd(bid) as unknown as ParagraphChild] : runs,
      })];
    }
    case 'paragraph':
      return [new Paragraph({
        children: docxRuns(n.content),
        ...(list ? { numbering: { reference: list.ref, level: Math.min(list.level, 5), ...(list.ref === 'ctw-number' ? { instance: list.instance } : {}) } } : {}),
      })];
    case 'horizontalRule':
      return [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFBFBF', space: 1 } }, children: [] })];
    case 'blockquote':
      // Đoạn trong trích dẫn: thụt lề + vạch trái; khối khác (danh sách, bảng…) vẽ như thường.
      return (n.content ?? []).flatMap((k) => (k.type === 'paragraph'
        ? [new Paragraph({ indent: { left: 360 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'BFBFBF', space: 8 } }, children: docxRuns(k.content) })]
        : docxBlock(k, ctx)));
    case 'codeBlock': {
      const text = plainText(n);
      if (isMermaid(n)) {
        const img = ctx.diagrams[ctx.p.mermaidIndex.get(n) ?? -1] ?? null;
        return img ? imageParagraph(img) : codeParagraphs(text, 'Mermaid diagram (source) — open the page in CT Work to see it drawn.');
      }
      return codeParagraphs(text);
    }
    case 'image': {
      const src = String(n.attrs?.src ?? '');
      const img = ctx.images.get(src) ?? null;
      const alt = String(n.attrs?.alt ?? '').trim();
      if (img) return imageParagraph(img, alt || null);
      return [new Paragraph({ children: [new TextRun({ text: `[Image${alt ? `: ${alt}` : ''}${/^https:/i.test(src) ? ` — ${src}` : ''}]`, italics: true, color: '7F7F7F', font: FONT })] })];
    }
    case 'bulletList':
    case 'orderedList':
    case 'taskList': {
      const ref = n.type === 'orderedList' ? 'ctw-number' as const : 'ctw-bullet' as const;
      const level = list ? list.level + 1 : 0;
      const instance = n.type === 'orderedList' ? ++ctx.listInstance : 0;
      const out: Array<Paragraph | Table> = [];
      for (const li of n.content ?? []) {
        const kids = li.content ?? [];
        kids.forEach((k, i) => {
          if (n.type === 'taskList' && i === 0 && k.type === 'paragraph') {
            const box = li.attrs?.checked ? '☑ ' : '☐ ';
            out.push(new Paragraph({ indent: { left: 360 * (level + 1) }, children: [new TextRun({ text: box, font: 'Segoe UI Symbol' }), ...docxRuns(k.content)] }));
          } else if (i === 0 && k.type === 'paragraph' && n.type !== 'taskList') {
            out.push(...docxBlock(k, ctx, { ref, level, instance }));
          } else if (k.type === 'paragraph') {
            out.push(new Paragraph({ indent: { left: 720 * (level + 1) }, children: docxRuns(k.content) }));
          } else out.push(...docxBlock(k, ctx, { ref, level, instance }));
        });
      }
      return out;
    }
    case 'table': {
      const rows = n.content ?? [];
      const cols = Math.max(1, ...rows.map((r) => (r.content ?? []).length));
      return [new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER, insideHorizontal: CELL_BORDER, insideVertical: CELL_BORDER },
        rows: rows.map((r, ri) => {
          const cells = r.content ?? [];
          const header = cells.length > 0 && cells.every((c) => c.type === 'tableHeader');
          return new TableRow({
            tableHeader: header && ri === 0,
            children: Array.from({ length: cols }, (_, ci) => {
              const c = cells[ci];
              const isHead = c?.type === 'tableHeader';
              // Ô tiêu đề: chữ đậm + nền xanh nhạt như bảng mẫu FPT. Ô rỗng vẫn phải có một đoạn (Word đòi).
              const kids = isHead
                ? (c?.content ?? []).map((pp) => new Paragraph({ children: docxRuns(pp.content, { bold: true }) }))
                : docxBlocks(c?.content, ctx);
              return new TableCell({
                ...(isHead ? { shading: { type: ShadingType.CLEAR, fill: 'D9E2F3', color: 'auto' } } : {}),
                columnSpan: Number(c?.attrs?.colspan ?? 1) > 1 ? Number(c?.attrs?.colspan) : undefined,
                children: kids.length ? kids : [new Paragraph({ children: [] })],
              });
            }),
          });
        }),
      })];
    }
    default:
      return n.content ? docxBlocks(n.content, ctx, list) : (n.text ? [new Paragraph({ children: [new TextRun({ text: n.text, font: FONT })] })] : []);
  }
}

export async function renderDocx(doc: unknown, meta: ExportMeta, opts: ExportOptions): Promise<Buffer> {
  const p = prepareDoc(doc, { stripGuides: opts.stripGuides ?? true });
  const images = await loadImages(p, opts.resolveImage);
  const ctx: DocxCtx = { p, images, diagrams: opts.diagrams ?? [], listInstance: 0 };
  const body = docxBlocks(p.blocks, ctx);

  const front: Array<Paragraph | Table | TableOfContents> = [];
  if (opts.cover ?? true) {
    const big = (text: string, size: number, opts2: { bold?: boolean; color?: string; before?: number } = {}) => new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: opts2.before ?? 0, after: 200 },
      children: [new TextRun({ text, size, bold: opts2.bold, color: opts2.color, font: FONT })],
    });
    if (meta.finalCover) {
      const fc = meta.finalCover;
      front.push(big('MINISTRY OF EDUCATION AND TRAINING', 24, { before: 600 }));
      front.push(big('FPT UNIVERSITY', 32, { bold: true }));
      front.push(big('Capstone Project Document', 40, { bold: true, before: 1200 }));
      front.push(big(fc.projectTitle, 36, { bold: true, color: 'C00000' }));
      const coverRow = (label: string, value: string) => new TableRow({
        children: [
          new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, font: FONT })] })] }),
          new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, children: (value ? value.split('\n') : ['']).map((v) => new Paragraph({ children: [new TextRun({ text: v, font: FONT })] })) }),
        ],
      });
      front.push(new Paragraph({ spacing: { before: 600 }, children: [] }));
      front.push(new Table({
        width: { size: 80, type: WidthType.PERCENTAGE }, alignment: AlignmentType.CENTER,
        borders: { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER, insideHorizontal: CELL_BORDER, insideVertical: CELL_BORDER },
        rows: [
          coverRow(fc.groupCode || meta.projectKey, fc.groupCode || meta.projectKey),
          coverRow('Group Members', fc.members.join('\n')),
          coverRow('Supervisor', fc.supervisor ?? ''),
          coverRow('Ext Supervisor', fc.extSupervisor ?? ''),
        ],
      }));
      front.push(big(`– ${fc.place || 'Hanoi'}, ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][meta.date.getMonth()]} ${meta.date.getFullYear()} –`, 24, { before: 1200 }));
    } else if (meta.capstone) {
      front.push(big('CAPSTONE PROJECT REPORT', 44, { bold: true, before: 2400 }));
      front.push(big(meta.title, 36, { bold: true, color: 'C00000' }));
      front.push(big(meta.projectName, 28));
      front.push(big(`– ${MONTH[meta.date.getMonth()]} ${meta.date.getFullYear()} –`, 24, { before: 1200 }));
    } else {
      front.push(big(meta.projectName, 28, { before: 2400 }));
      front.push(big(meta.title, 40, { bold: true }));
    }
    front.push(big(`${meta.projectKey} · ${meta.docLabel}${meta.version ? ` · version ${meta.version}` : ''} · ${fmtDate(meta.date)}`, 18, { color: '7F7F7F', before: 600 }));
    front.push(new Paragraph({ children: [new PageBreak()] }));
  }
  if ((opts.toc ?? true) && p.headings.length) {
    front.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Table of Contents', bold: true, size: 32, font: FONT, color: '2F5496' })] }));
    front.push(new TableOfContents('Table of Contents', {
      hyperlink: true,
      headingStyleRange: '1-4',
      cachedEntries: p.headings.map((h) => ({ title: h.text, level: h.level, href: h.anchor })),
    }));
    front.push(new Paragraph({ children: [new PageBreak()] }));
  }

  const document = new Document({
    creator: 'CT Work',
    title: meta.title,
    description: `${meta.projectName} — ${meta.docLabel}`,
    features: { updateFields: true },
    styles: {
      default: { document: { run: { font: FONT, size: 22 }, paragraph: { spacing: { after: 120, line: 276 } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 32, bold: true, color: 'C00000' }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0, keepNext: true } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 26, bold: true }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 2, keepNext: true } },
        { id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 22, bold: true, italics: true }, paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 3, keepNext: true } },
      ],
      characterStyles: [{ id: 'Hyperlink', name: 'Hyperlink', basedOn: 'DefaultParagraphFont', run: { color: '0563C1', underline: { type: 'single' } } }],
    },
    numbering: {
      config: [
        { reference: 'ctw-bullet', levels: Array.from({ length: 6 }, (_, i) => ({ level: i, format: LevelFormat.BULLET, text: ['•', '◦', '▪'][i % 3], alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360 * (i + 1), hanging: 260 } } } })) },
        { reference: 'ctw-number', levels: Array.from({ length: 6 }, (_, i) => ({ level: i, format: [LevelFormat.DECIMAL, LevelFormat.LOWER_LETTER, LevelFormat.LOWER_ROMAN][i % 3], text: `%${i + 1}.`, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360 * (i + 1), hanging: 300 } } } })) },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1417 } } },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [`${meta.title} · `, PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES], size: 16, color: '7F7F7F', font: FONT })] })] }),
      },
      children: [...front, ...body],
    }],
  });
  return Packer.toBuffer(document);
}

/** Liên kết trong mục lục Word trỏ tới bookmark — dùng trong test để chắc anchor hợp lệ (≤ 40 ký tự, bắt đầu bằng chữ/_) . */
export const ANCHOR_RE = /^_Toc_ctw\d+$/;

// ═══ PDF ═════════════════════════════════════════════════════════

type Pdf = PDFKit.PDFDocument;
const PT_PER_PX = 0.75;
const PDF_MARGIN = 56;
const C = { text: '#111827', muted: '#6b7280', h1: '#c00000', rule: '#cbd5e1', codeBg: '#f3f4f6', headBg: '#d9e2f3', link: '#0563c1' };
const H_SIZE = [18, 14, 12.5, 11.5];

interface PdfCtx {
  doc: Pdf;
  p: Prepared;
  images: Map<string, ExportImage | null>;
  diagrams: Array<ExportImage | null>;
  /** anchor ⇒ số trang (0-based trong bộ đệm) */
  headingPage: Map<string, number>;
}

/** Font Roboto nhúng chỉ có Latin + tiếng Việt: ký tự ngoài bộ (mũi tên, ô tích…) đổi sang chữ thường thay vì in ô trống. */
const PDF_SUBST: Record<string, string> = { '→': '->', '←': '<-', '⇒': '=>', '⇐': '<=', '↔': '<->', '✓': 'v', '✔': 'v', '✗': 'x', '☐': '[ ]', '☑': '[x]', '•': '•', '≤': '<=', '≥': '>=', '≠': '!=' };
export const pdfSafe = (t: string) => t.replace(/[→←⇒⇐↔✓✔✗☐☑≤≥≠]/g, (c) => PDF_SUBST[c] ?? c);

const left = (d: Pdf) => d.page.margins.left;
const width = (d: Pdf) => d.page.width - d.page.margins.left - d.page.margins.right;
const bottom = (d: Pdf) => d.page.height - d.page.margins.bottom;
function ensure(d: Pdf, h: number) {
  if (d.y + h > bottom(d)) d.addPage();
}

/** Vẽ một dòng chữ nhiều kiểu (đậm/nghiêng/gạch/code/link) bằng chuỗi text(..., { continued }). */
function pdfInline(d: Pdf, nodes: PmNode[] | undefined, o: { x?: number; width?: number; size?: number; bold?: boolean; color?: string; destination?: string } = {}) {
  const segs: Array<{ text: string; bold: boolean; italic: boolean; strike: boolean; code: boolean; link: string | null }> = [];
  const walk = (ns: PmNode[] | undefined) => {
    for (const n of ns ?? []) {
      if (n.type === 'hardBreak') { segs.push({ text: '\n', bold: false, italic: false, strike: false, code: false, link: null }); continue; }
      if (n.type === 'mention') { segs.push({ text: `@${String(n.attrs?.label ?? '')}`, bold: true, italic: false, strike: false, code: false, link: null }); continue; }
      if (n.type !== 'text') { walk(n.content); continue; }
      const m = n.marks ?? [];
      const has = (t: string) => m.some((x) => x.type === t);
      segs.push({ text: pdfSafe(n.text ?? ''), bold: !!o.bold || has('bold'), italic: has('italic'), strike: has('strike'), code: has('code'), link: httpLink(m) });
    }
  };
  walk(nodes);
  const size = o.size ?? 10.5;
  const x = o.x ?? left(d);
  const w = o.width ?? width(d) - (x - left(d));
  if (!segs.length || !segs.some((s) => s.text.trim())) { d.font('vi').fontSize(size).text(' ', x, d.y, { width: w, ...(o.destination ? { destination: o.destination } : {}) }); return; }
  segs.forEach((s, i) => {
    const last = i === segs.length - 1;
    d.font(s.bold ? 'vi-bold' : 'vi').fontSize(s.code ? size - 1 : size).fillColor(s.link ? C.link : s.code ? '#9a3412' : (o.color ?? C.text));
    // link phải đặt RÕ null ở mẩu không có link: pdfkit giữ tuỳ chọn của mẩu trước khi `continued`.
    const opt = {
      width: w, continued: !last, oblique: s.italic ? 10 : false, strike: s.strike, underline: !!s.link,
      link: (s.link ?? null) as unknown as string,
      ...(i === 0 && o.destination ? { destination: o.destination } : {}),
    };
    if (i === 0) d.text(s.text, x, d.y, opt);
    else d.text(s.text, opt);
  });
  d.fillColor(C.text);
}

function pdfImage(d: Pdf, img: ExportImage, caption?: string | null) {
  const maxW = width(d);
  const maxH = bottom(d) - d.page.margins.top - 40;
  const s = fitImage(img.width * PT_PER_PX, img.height * PT_PER_PX, maxW, maxH);
  ensure(d, s.height + (caption ? 18 : 6));
  const x = left(d) + (maxW - s.width) / 2;
  d.image(img.buffer, x, d.y, { width: s.width, height: s.height });
  d.y += s.height + 4;
  if (caption) { d.font('vi').fontSize(9).fillColor(C.muted).text(caption, left(d), d.y, { width: maxW, align: 'center', oblique: 10 }); d.fillColor(C.text); }
  d.moveDown(0.5);
}

function pdfCode(d: Pdf, text: string, caption?: string) {
  const w = width(d);
  d.font('vi').fontSize(8.5);
  const lines = pdfSafe(text).replace(/\r\n?/g, '\n').split('\n');
  // Từng khúc vừa trang: khối dài cắt qua nhiều trang.
  let i = 0;
  while (i < lines.length) {
    ensure(d, 24);
    const room = bottom(d) - d.y - 8;
    const chunk: string[] = [];
    let h = 0;
    while (i < lines.length) {
      const lh = d.heightOfString(lines[i] || ' ', { width: w - 12 });
      if (chunk.length && h + lh > room) break;
      chunk.push(lines[i] || ' ');
      h += lh;
      i++;
    }
    const y = d.y;
    d.save().rect(left(d), y, w, h + 8).fill(C.codeBg).restore();
    d.fillColor('#1f2937').text(chunk.join('\n'), left(d) + 6, y + 4, { width: w - 12 });
    d.y = y + h + 10;
    if (i < lines.length) d.addPage();
  }
  if (caption) { d.font('vi').fontSize(8.5).fillColor(C.muted).text(caption, left(d), d.y, { width: w, oblique: 10 }); d.fillColor(C.text); }
  d.moveDown(0.4);
}

function pdfTable(d: Pdf, n: PmNode, ctx: PdfCtx) {
  const rows = n.content ?? [];
  if (!rows.length) return;
  const cols = Math.max(1, ...rows.map((r) => (r.content ?? []).length));
  const total = width(d);
  // Bề rộng cột theo độ dài chữ (có trần/sàn) — bảng FPT hay có cột "#" hẹp + cột mô tả rộng.
  const text = (c: PmNode | undefined) => pdfSafe((c?.content ?? []).map((b) => plainText(b)).join('\n'));
  const lens = Array.from({ length: cols }, (_, ci) => Math.min(60, Math.max(4, ...rows.map((r) => text(r.content?.[ci]).split('\n').reduce((m, l) => Math.max(m, l.length), 0)))));
  // Sàn = từ dài nhất của cột (chữ tiêu đề "Deadline" không bị bẻ giữa từ).
  d.font('vi-bold').fontSize(9);
  const minW = Array.from({ length: cols }, (_, ci) => Math.min(total / cols, Math.max(28, ...rows.flatMap((r) => text(r.content?.[ci]).split(/\s+/).map((wd) => d.widthOfString(wd) + 10)))));
  const sum = lens.reduce((a, b) => a + b, 0);
  const colW = lens.map((l, ci) => Math.max(minW[ci], (l / sum) * total));
  const scale = total / colW.reduce((a, b) => a + b, 0);
  for (let i = 0; i < colW.length; i++) colW[i] *= scale;
  const header = rows[0]?.content?.every((c) => c.type === 'tableHeader') ? rows[0] : null;
  const size = 9;
  const rowH = (r: PmNode, isHead: boolean) => {
    d.font(isHead ? 'vi-bold' : 'vi').fontSize(size);
    return Math.max(...Array.from({ length: cols }, (_, ci) => d.heightOfString(text(r.content?.[ci]) || ' ', { width: colW[ci] - 8 }))) + 8;
  };
  const drawRow = (r: PmNode, isHead: boolean) => {
    const cells = Array.from({ length: cols }, (_, ci) => text(r.content?.[ci]));
    const h = rowH(r, isHead);
    // Dòng tiêu đề không được nằm trơ một mình cuối trang: cần chỗ cho cả dòng dữ liệu đầu.
    if (isHead && rows[1] && d.y + h + rowH(rows[1], false) > bottom(d)) d.addPage();
    if (d.y + h > bottom(d)) { d.addPage(); if (header && !isHead) drawRow(header, true); d.font(isHead ? 'vi-bold' : 'vi').fontSize(size); }
    const y = d.y;
    let x = left(d);
    cells.forEach((t, ci) => {
      if (isHead) d.save().rect(x, y, colW[ci], h).fill(C.headBg).restore();
      d.save().lineWidth(0.5).strokeColor('#8eaadb').rect(x, y, colW[ci], h).stroke().restore();
      d.fillColor(C.text).font(isHead ? 'vi-bold' : 'vi').fontSize(size).text(t, x + 4, y + 4, { width: colW[ci] - 8 });
      x += colW[ci];
    });
    d.y = y + h;
  };
  rows.forEach((r, ri) => drawRow(r, ri === 0 && !!header));
  // Ảnh trong ô bảng (hiếm) không vẽ được trong ô — liệt kê ngay dưới bảng để không mất.
  for (const r of rows) for (const c of r.content ?? []) for (const b of c.content ?? []) if (b.type === 'image') pdfBlock(d, b, ctx);
  d.x = left(d);
  d.moveDown(0.6);
}

function pdfBlocks(d: Pdf, nodes: PmNode[] | undefined, ctx: PdfCtx, indent = 0) {
  for (const n of nodes ?? []) pdfBlock(d, n, ctx, indent);
}

function pdfBlock(d: Pdf, n: PmNode, ctx: PdfCtx, indent = 0) {
  const x = left(d) + indent;
  switch (n.type) {
    case 'heading': {
      const level = Math.min(Math.max(Number(n.attrs?.level ?? 1), 1), 4);
      const size = H_SIZE[level - 1];
      ensure(d, size * 3.2);
      d.moveDown(level === 1 ? 0.8 : 0.5);
      const anchor = ctx.p.anchorOf.get(n);
      if (anchor) ctx.headingPage.set(anchor, d.bufferedPageRange().start + d.bufferedPageRange().count - 1);
      pdfInline(d, n.content, { size, bold: true, color: level === 1 ? C.h1 : C.text, destination: anchor });
      d.moveDown(0.3);
      return;
    }
    case 'paragraph':
      ensure(d, 16);
      pdfInline(d, n.content, { x });
      d.moveDown(0.35);
      return;
    case 'horizontalRule':
      ensure(d, 12);
      d.save().moveTo(left(d), d.y + 4).lineTo(left(d) + width(d), d.y + 4).lineWidth(0.6).strokeColor(C.rule).stroke().restore();
      d.y += 12;
      return;
    case 'blockquote': {
      const y0 = d.y;
      const page0 = d.bufferedPageRange().count;
      pdfBlocks(d, n.content, ctx, indent + 12);
      if (d.bufferedPageRange().count === page0) d.save().moveTo(x + 3, y0).lineTo(x + 3, d.y - 4).lineWidth(2).strokeColor(C.rule).stroke().restore();
      return;
    }
    case 'codeBlock': {
      if (isMermaid(n)) {
        const img = ctx.diagrams[ctx.p.mermaidIndex.get(n) ?? -1] ?? null;
        if (img) { pdfImage(d, img); return; }
        pdfCode(d, plainText(n), 'Mermaid diagram (source) — open the page in CT Work to see it drawn.');
        return;
      }
      pdfCode(d, plainText(n));
      return;
    }
    case 'image': {
      const src = String(n.attrs?.src ?? '');
      const img = ctx.images.get(src) ?? null;
      const alt = String(n.attrs?.alt ?? '').trim();
      if (img) { pdfImage(d, img, alt || null); return; }
      ensure(d, 16);
      d.font('vi').fontSize(10).fillColor(C.muted).text(`[Image${alt ? `: ${alt}` : ''}${/^https:/i.test(src) ? ` — ${src}` : ''}]`, x, d.y, { width: width(d) - indent, oblique: 10 });
      d.fillColor(C.text).moveDown(0.3);
      return;
    }
    case 'bulletList':
    case 'orderedList':
    case 'taskList': {
      const start = Number(n.attrs?.start ?? 1);
      (n.content ?? []).forEach((li, i) => {
        const marker = n.type === 'orderedList' ? `${start + i}.` : n.type === 'taskList' ? (li.attrs?.checked ? '[x]' : '[ ]') : '•';
        const kids = li.content ?? [];
        ensure(d, 16);
        const y = d.y;
        d.font('vi').fontSize(10.5).fillColor(C.text).text(marker, x, y, { width: 22 });
        d.y = y;
        const first = kids[0];
        if (first?.type === 'paragraph') {
          pdfInline(d, first.content, { x: x + 22 });
          d.moveDown(0.2);
          pdfBlocks(d, kids.slice(1), ctx, indent + 22);
        } else pdfBlocks(d, kids, ctx, indent + 22);
      });
      d.moveDown(0.2);
      return;
    }
    case 'table':
      pdfTable(d, n, ctx);
      return;
    default:
      if (n.content) pdfBlocks(d, n.content, ctx, indent);
  }
}

export async function renderPdf(doc: unknown, meta: ExportMeta, opts: ExportOptions): Promise<Buffer> {
  const p = prepareDoc(doc, { stripGuides: opts.stripGuides ?? true });
  const images = await loadImages(p, opts.resolveImage);
  const d = new PDFDocument({ size: 'A4', margin: PDF_MARGIN, bufferPages: true, info: { Title: meta.title, Author: meta.projectName, Creator: 'CT Work' } });
  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    d.on('data', (c: Buffer) => chunks.push(c));
    d.on('end', () => resolve(Buffer.concat(chunks)));
    d.on('error', reject);
  });
  d.registerFont('vi', notoSansViBuffer());
  d.registerFont('vi-bold', notoSansViBoldBuffer());

  // Bìa.
  if (opts.cover ?? true) {
    const w = width(d);
    d.y = 200;
    if (meta.finalCover) {
      const fc = meta.finalCover;
      d.y = 120;
      d.font('vi').fontSize(12).fillColor(C.text).text('MINISTRY OF EDUCATION AND TRAINING', left(d), d.y, { width: w, align: 'center' }).moveDown(0.3);
      d.font('vi-bold').fontSize(16).text('FPT UNIVERSITY', { width: w, align: 'center' }).moveDown(2.5);
      d.font('vi-bold').fontSize(20).text('Capstone Project Document', { width: w, align: 'center' }).moveDown(0.6);
      d.font('vi-bold').fontSize(18).fillColor(C.h1).text(pdfSafe(fc.projectTitle), { width: w, align: 'center' }).moveDown(2);
      d.fillColor(C.text);
      const rows: Array<[string, string]> = [[fc.groupCode || meta.projectKey, ''], ['Group Members', fc.members.join('\n')], ['Supervisor', fc.supervisor ?? ''], ['Ext Supervisor', fc.extSupervisor ?? '']];
      for (const [k, v] of rows) {
        const y = d.y;
        d.font('vi-bold').fontSize(11).text(pdfSafe(k), left(d) + 60, y, { width: 140 });
        const yk = d.y;
        d.font('vi').fontSize(11).text(pdfSafe(v), left(d) + 210, y, { width: w - 270 });
        d.y = Math.max(yk, d.y) + 6;
      }
      d.moveDown(3).font('vi').fontSize(12).text(`– ${fc.place || 'Hanoi'}, ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][meta.date.getMonth()]} ${meta.date.getFullYear()} –`, left(d), d.y, { width: w, align: 'center' });
    } else if (meta.capstone) {
      d.font('vi-bold').fontSize(24).fillColor(C.text).text('CAPSTONE PROJECT REPORT', left(d), d.y, { width: w, align: 'center' }).moveDown(0.8);
      d.font('vi-bold').fontSize(20).fillColor(C.h1).text(meta.title, { width: w, align: 'center' }).moveDown(0.6);
      d.font('vi').fontSize(14).fillColor(C.text).text(meta.projectName, { width: w, align: 'center' }).moveDown(3);
      d.font('vi').fontSize(12).text(`– ${MONTH[meta.date.getMonth()]} ${meta.date.getFullYear()} –`, { width: w, align: 'center' });
    } else {
      d.font('vi').fontSize(14).fillColor(C.text).text(meta.projectName, left(d), d.y, { width: w, align: 'center' }).moveDown(0.6);
      d.font('vi-bold').fontSize(22).text(meta.title, { width: w, align: 'center' });
    }
    d.moveDown(2).font('vi').fontSize(9).fillColor(C.muted).text(`${meta.projectKey} · ${meta.docLabel}${meta.version ? ` · version ${meta.version}` : ''} · ${fmtDate(meta.date)}`, { width: w, align: 'center' });
    d.fillColor(C.text);
  }
  // Chỗ cho mục lục: ~34 dòng một trang; vẽ SAU khi biết số trang của từng đề mục.
  const wantToc = (opts.toc ?? true) && p.headings.length > 0;
  const tocPages = wantToc ? Math.ceil(p.headings.length / 34) : 0;
  const tocStart = (opts.cover ?? true) ? 1 : 0;
  for (let i = 0; i < tocPages; i++) { if (i > 0 || (opts.cover ?? true)) d.addPage(); }
  if (tocPages || (opts.cover ?? true)) d.addPage();
  const bodyStart = d.bufferedPageRange().count - 1;

  const ctx: PdfCtx = { doc: d, p, images, diagrams: opts.diagrams ?? [], headingPage: new Map() };
  pdfBlocks(d, p.blocks, ctx);

  // Mục lục có số trang thật + outline cho trình đọc PDF.
  if (wantToc) {
    d.switchToPage(tocStart);
    d.y = d.page.margins.top;
    d.font('vi-bold').fontSize(16).fillColor('#2f5496').text('Table of Contents', left(d), d.y).moveDown(0.6);
    let page = tocStart;
    for (const h of p.headings) {
      if (d.y + 16 > bottom(d) && page < tocStart + tocPages - 1) { page++; d.switchToPage(page); d.y = d.page.margins.top; }
      const pg = (ctx.headingPage.get(h.anchor) ?? bodyStart) + 1;
      const x = left(d) + (h.level - 1) * 14;
      const y = d.y;
      d.font(h.level === 1 ? 'vi-bold' : 'vi').fontSize(h.level === 1 ? 10.5 : 10).fillColor(C.text);
      d.text(pdfSafe(h.text), x, y, { width: width(d) - (x - left(d)) - 40, goTo: h.anchor, lineBreak: false, ellipsis: true, height: 14 });
      d.text(String(pg), left(d), y, { width: width(d), align: 'right', goTo: h.anchor, lineBreak: false });
      d.y = y + 16;
    }
    for (const h of p.headings) if (h.level <= 2) d.outline.addItem(h.text);
  }
  // Chân trang: tên tài liệu + số trang (bỏ trang bìa).
  const range = d.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    if ((opts.cover ?? true) && i === 0) continue;
    d.switchToPage(i);
    // Viết trong lề dưới: tạm bỏ lề, không thì pdfkit tưởng tràn trang và tự thêm trang trắng.
    const mb = d.page.margins.bottom;
    d.page.margins.bottom = 0;
    const y = d.page.height - mb + 18;
    d.font('vi').fontSize(8).fillColor(C.muted).text(`${meta.title} · ${i + 1} / ${range.count}`, left(d), y, { width: width(d), align: 'right', lineBreak: false });
    d.page.margins.bottom = mb;
  }
  d.end();
  return done;
}
