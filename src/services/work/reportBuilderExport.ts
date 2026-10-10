/**
 * CT Work — CTW đợt 8b: VẼ báo cáo của Builder thành PDF (pdfkit) và DOCX (docx). THUẦN (không DB) — test ở ctw8b.test.ts.
 *
 *   - Bìa: ảnh bìa dự án (hoặc dải màu nhấn), logo không gian trên thẻ trắng, tiêu đề, phụ đề, dự án, kỳ, ngày dựng.
 *   - Mục lục có số trang thật (PDF vẽ SAU khi biết trang của từng đề mục — bufferPages; DOCX là trường TOC thật có sẵn mục).
 *   - Đầu trang: dự án · tiêu đề; chân trang: "Trang X / Y" (theo ngôn ngữ báo cáo); đường kẻ màu nhấn.
 *   - Khối: ô KPI (lưới 3 cột), biểu đồ = PNG từ SVG (chữ là đường — không phụ thuộc font máy chủ), bảng thẻ (tiêu đề lặp lại
 *     khi sang trang, dòng kẻ xen màu), rủi ro (nhãn mức), nhận xét AI (hộp riêng, ghi rõ do AI viết).
 *   - Font PDF: Roboto nhúng đủ dấu tiếng Việt (cv/export/font.ts — như docExport); ký tự ngoài bộ glyph đổi qua pdfSafe.
 */

import {
  AlignmentType, BookmarkEnd, BookmarkStart, BorderStyle, Document, Footer, Header, HeadingLevel, ImageRun, PageBreak, PageNumber, Packer, Paragraph,
  ShadingType, Table, TableCell, TableLayoutType, TableOfContents, TableRow, TextRun, WidthType, type ParagraphChild,
} from 'docx';
import PDFDocument from 'pdfkit';
import { notoSansViBoldBuffer, notoSansViBuffer } from '../cv/export/font.js';
import { fitImage, pdfSafe } from './docExport.js';
import type { Period } from './reportBuilder.js';

export type ResolvedBlock =
  | { id: string; type: 'heading'; text: string; level: number }
  | { id: string; type: 'text'; text: string }
  | { id: string; type: 'pageBreak' }
  | { id: string; type: 'kpis'; title: string | null; items: Array<{ key: string; label: string; value: string; hint: string | null }> }
  | { id: string; type: 'chart'; title: string; svg: string }
  | { id: string; type: 'issues'; title: string | null; columns: string[]; colKeys: string[]; rows: string[][]; total: number }
  | { id: string; type: 'risks'; title: string; items: Array<{ key: string; title: string; level: string | null; score: number | null; owner: string | null; mitigation: string | null }>; note: string | null }
  | { id: string; type: 'ai'; title: string; text: string; generatedAt: string | null; note: string }
  | { id: string; type: 'error'; message: string };

export interface ResolvedReport {
  title: string;
  subtitle: string | null;
  lang: 'en' | 'vi';
  period: Period;
  project: { name: string; key: string };
  workspace: { name: string };
  accent: string;
  generatedAt: string;
  options: { cover: boolean; toc: boolean; logo: boolean; coverImage: boolean; accent?: string | null };
  blocks: ResolvedBlock[];
  brand: { logoUrl: string | null; coverUrl: string | null };
}

export interface PngImage { buffer: Buffer; width: number; height: number }
export interface BrandAssets { logo: PngImage | null; cover: PngImage | null; charts: Map<string, PngImage> }

const T = {
  en: { contents: 'Contents', page: (a: number, b: number) => `Page ${a} of ${b}`, period: 'Period', generated: 'Generated', sprint: 'Sprint', showing: (n: number, t: number) => `Showing ${n} of ${t} issues`, none: 'No issues match this filter.', noRisks: 'No open risks.', owner: 'Owner', unavailable: 'Not available', prepared: 'Prepared with CT Work' },
  vi: { contents: 'Mục lục', page: (a: number, b: number) => `Trang ${a} / ${b}`, period: 'Kỳ báo cáo', generated: 'Ngày lập', sprint: 'Sprint', showing: (n: number, t: number) => `Hiển thị ${n}/${t} thẻ`, none: 'Không có thẻ nào khớp bộ lọc.', noRisks: 'Không có rủi ro đang mở.', owner: 'Phụ trách', unavailable: 'Không có dữ liệu', prepared: 'Lập bằng CT Work' },
};

const fmtDay = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const periodText = (r: ResolvedReport) => `${fmtDay(r.period.from)} – ${fmtDay(r.period.to)}${r.period.sprint ? ` · ${r.period.sprint.name}` : ''}`;
const LEVEL_COLOR: Record<string, string> = { CRITICAL: '#b91c1c', HIGH: '#dc2626', MEDIUM: '#d97706', LOW: '#16a34a' };

/** "#4f5bd5" ⇒ màu nhạt (trộn với trắng) để tô nền. */
function tint(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * k).toString(16).padStart(2, '0');
  return `#${mix((n >> 16) & 255)}${mix((n >> 8) & 255)}${mix(n & 255)}`;
}

/** Đề mục cho mục lục (theo thứ tự). */
function headingsOf(r: ResolvedReport) {
  return r.blocks.filter((b): b is Extract<ResolvedBlock, { type: 'heading' }> => b.type === 'heading' && !!b.text.trim()).map((b, i) => ({ id: b.id, text: b.text.trim(), level: b.level, anchor: `_Toc_rb${i + 1}` }));
}

// ═══ PDF ═════════════════════════════════════════════════════════

type Pdf = PDFKit.PDFDocument;
const M = 50;
const INK = '#111827';
const MUTED = '#6b7280';
const LINE = '#e5e7eb';

export async function renderReportPdf(r: ResolvedReport, a: BrandAssets): Promise<Buffer> {
  const t = T[r.lang];
  const d: Pdf = new PDFDocument({ size: 'A4', margins: { top: M + 18, bottom: M + 10, left: M, right: M }, bufferPages: true, info: { Title: r.title, Author: r.workspace.name, Subject: `${r.project.name} — ${periodText(r)}`, Creator: 'CT Work' } });
  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((res, rej) => { d.on('data', (c: Buffer) => chunks.push(c)); d.on('end', () => res(Buffer.concat(chunks))); d.on('error', rej); });
  d.registerFont('vi', notoSansViBuffer());
  d.registerFont('vi-bold', notoSansViBoldBuffer());
  const W = d.page.width - M * 2;
  const bottom = () => d.page.height - d.page.margins.bottom;
  const ensure = (h: number) => { if (d.y + h > bottom()) d.addPage(); };
  const s = (x: string) => pdfSafe(x);
  const headings = headingsOf(r);
  const headingPage = new Map<string, number>();

  // ── Bìa ──
  let coverPage = false;
  if (r.options.cover) {
    coverPage = true;
    const bandH = 300;
    if (a.cover) {
      d.image(a.cover.buffer, 0, 0, { cover: [d.page.width, bandH], align: 'center', valign: 'center' });
      d.save().rect(0, 0, d.page.width, bandH).fillOpacity(0.18).fill('#000000').restore();
    } else {
      d.rect(0, 0, d.page.width, bandH).fill(r.accent);
      d.save().fillOpacity(0.12).circle(d.page.width - 60, 40, 180).fill('#ffffff').circle(80, bandH, 140).fill('#ffffff').restore();
    }
    d.rect(0, bandH, d.page.width, 5).fill(r.accent);
    // Logo trên thẻ trắng.
    const box = 96;
    d.save().roundedRect(M, bandH - box / 2, box, box, 14).fill('#ffffff').restore();
    d.save().roundedRect(M, bandH - box / 2, box, box, 14).lineWidth(1).stroke(LINE).restore();
    if (a.logo) {
      const f = fitImage(a.logo.width, a.logo.height, box - 20, box - 20);
      d.image(a.logo.buffer, M + (box - f.width) / 2, bandH - box / 2 + (box - f.height) / 2, { width: f.width, height: f.height });
    } else {
      const ini = r.workspace.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || 'CT';
      d.font('vi-bold').fontSize(30).fillColor(r.accent).text(s(ini), M, bandH - 18, { width: box, align: 'center', lineBreak: false });
    }
    d.y = bandH + 80;
    d.font('vi').fontSize(11).fillColor(MUTED).text(s(`${r.workspace.name} · ${r.project.name} (${r.project.key})`), M, d.y, { width: W });
    d.moveDown(0.5);
    d.font('vi-bold').fontSize(28).fillColor(INK).text(s(r.title), M, d.y, { width: W });
    if (r.subtitle) d.moveDown(0.3).font('vi').fontSize(14).fillColor(MUTED).text(s(r.subtitle), { width: W });
    d.moveDown(1.2);
    const meta = [[t.period, periodText(r)], [t.generated, fmtDay(r.generatedAt.slice(0, 10))]];
    for (const [k, v] of meta) {
      const y = d.y;
      d.font('vi-bold').fontSize(10.5).fillColor(INK).text(s(k), M, y, { width: 110 });
      d.font('vi').fontSize(10.5).fillColor(INK).text(s(v), M + 115, y, { width: W - 115 });
      d.moveDown(0.3);
    }
    // Viết trong lề dưới: tạm bỏ lề, không thì pdfkit tưởng tràn trang và tự thêm trang (chữ rơi sang trang mục lục).
    const mb = d.page.margins.bottom;
    d.page.margins.bottom = 0;
    d.font('vi').fontSize(9).fillColor(MUTED).text(s(t.prepared), M, d.page.height - M - 10, { width: W, lineBreak: false });
    d.page.margins.bottom = mb;
  }

  // ── Chỗ cho mục lục ──
  const wantToc = r.options.toc && headings.length > 0;
  const tocPages = wantToc ? Math.ceil(headings.length / 30) : 0;
  const tocStart = coverPage ? 1 : 0;
  if (coverPage || tocPages) d.addPage();
  for (let i = 1; i < tocPages; i++) d.addPage();
  if (tocPages) d.addPage();
  d.y = d.page.margins.top;

  // ── Thân ──
  const anchorOf = new Map(headings.map((h) => [h.id, h.anchor]));
  const textBlock = (raw: string) => {
    for (const para of raw.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
      const lines = para.split('\n');
      if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
        for (const l of lines) {
          ensure(16);
          const y = d.y;
          d.font('vi').fontSize(10.5).fillColor(INK).text('•', M + 4, y, { width: 12 });
          d.y = y;
          d.text(s(l.replace(/^\s*[-*•]\s+/, '')), M + 18, y, { width: W - 18 });
        }
      } else {
        ensure(16);
        d.font('vi').fontSize(10.5).fillColor(INK).text(s(para), M, d.y, { width: W, lineGap: 2 });
      }
      d.moveDown(0.5);
    }
  };

  for (const b of r.blocks) {
    switch (b.type) {
      case 'heading': {
        const size = b.level === 1 ? 17 : b.level === 2 ? 13.5 : 12;
        ensure(size * 3.5);
        d.moveDown(b.level === 1 ? 0.6 : 0.4);
        const anchor = anchorOf.get(b.id);
        if (anchor) headingPage.set(anchor, d.bufferedPageRange().start + d.bufferedPageRange().count - 1);
        d.font('vi-bold').fontSize(size).fillColor(b.level === 1 ? r.accent : INK).text(s(b.text), M, d.y, { width: W, destination: anchor });
        if (b.level === 1) d.save().moveTo(M, d.y + 2).lineTo(M + W, d.y + 2).lineWidth(0.8).strokeColor(tint(r.accent, 0.6)).stroke().restore();
        d.moveDown(0.5);
        break;
      }
      case 'text': textBlock(b.text); break;
      case 'pageBreak': d.addPage(); break;
      case 'error':
        ensure(16);
        d.font('vi').fontSize(9.5).fillColor(MUTED).text(s(`[${t.unavailable}: ${b.message}]`), M, d.y, { width: W, oblique: 10 }).moveDown(0.4);
        break;
      case 'kpis': {
        if (b.title) { ensure(30); d.font('vi-bold').fontSize(11).fillColor(INK).text(s(b.title), M, d.y, { width: W }).moveDown(0.3); }
        const cols = 3, gap = 10, tw = (W - gap * (cols - 1)) / cols, th = 64;
        for (let i = 0; i < b.items.length; i += cols) {
          ensure(th + gap);
          const y = d.y;
          b.items.slice(i, i + cols).forEach((k, j) => {
            const x = M + j * (tw + gap);
            d.save().roundedRect(x, y, tw, th, 8).fillAndStroke('#f9fafb', LINE).restore();
            d.save().rect(x, y + 10, 3, th - 20).fill(r.accent).restore();
            d.font('vi').fontSize(8.5).fillColor(MUTED).text(s(k.label), x + 12, y + 9, { width: tw - 20, lineBreak: false, ellipsis: true, height: 11 });
            d.font('vi-bold').fontSize(20).fillColor(INK).text(s(k.value), x + 12, y + 22, { width: tw - 20, lineBreak: false });
            if (k.hint) d.font('vi').fontSize(7.5).fillColor(MUTED).text(s(k.hint), x + 12, y + 47, { width: tw - 20, lineBreak: false, ellipsis: true, height: 10 });
          });
          d.y = y + th + gap;
        }
        d.moveDown(0.3);
        break;
      }
      case 'chart': {
        const img = a.charts.get(b.id);
        if (!img) { ensure(16); d.font('vi').fontSize(9.5).fillColor(MUTED).text(s(`[${b.title}]`), M, d.y, { width: W }).moveDown(0.4); break; }
        const f = fitImage(img.width, img.height, W, 320);
        ensure(f.height + 12);
        d.image(img.buffer, M + (W - f.width) / 2, d.y, { width: f.width, height: f.height });
        d.y += f.height + 12;
        break;
      }
      case 'issues': {
        if (b.title) { ensure(30); d.font('vi-bold').fontSize(11).fillColor(INK).text(s(b.title), M, d.y, { width: W }).moveDown(0.3); }
        if (!b.rows.length) { ensure(16); d.font('vi').fontSize(10).fillColor(MUTED).text(s(t.none), M, d.y, { width: W }).moveDown(0.5); break; }
        const fixed: Record<string, number> = { key: 62, type: 70, status: 82, assignee: 96, priority: 62, due: 62, points: 40 };
        const flex = Math.max(120, W - b.colKeys.filter((k) => k !== 'title').reduce((acc, k) => acc + (fixed[k] ?? 70), 0));
        let widths = b.colKeys.map((k) => (k === 'title' ? flex : fixed[k] ?? 70));
        const sum = widths.reduce((x, y) => x + y, 0);
        widths = widths.map((w) => (w * W) / sum);
        const pad = 4;
        const header = () => {
          const y = d.y;
          d.save().rect(M, y, W, 18).fill(tint(r.accent, 0.85)).restore();
          let x = M;
          b.columns.forEach((c, i) => { d.font('vi-bold').fontSize(8.5).fillColor(INK).text(s(c), x + pad, y + 5, { width: widths[i] - pad * 2, lineBreak: false, ellipsis: true, height: 11 }); x += widths[i]; });
          d.y = y + 18;
        };
        ensure(40);
        header();
        b.rows.forEach((row, ri) => {
          d.font('vi').fontSize(8.5);
          const h = Math.max(16, ...row.map((c, i) => d.heightOfString(s(c || ' '), { width: widths[i] - pad * 2 }) + 7));
          if (d.y + h > bottom()) { d.addPage(); header(); }
          const y = d.y;
          if (ri % 2 === 1) d.save().rect(M, y, W, h).fill('#f9fafb').restore();
          let x = M;
          row.forEach((c, i) => { d.font(b.colKeys[i] === 'key' ? 'vi-bold' : 'vi').fontSize(8.5).fillColor(INK).text(s(c), x + pad, y + 4, { width: widths[i] - pad * 2 }); x += widths[i]; });
          d.save().moveTo(M, y + h).lineTo(M + W, y + h).lineWidth(0.4).strokeColor(LINE).stroke().restore();
          d.y = y + h;
        });
        d.moveDown(0.3);
        if (b.total > b.rows.length) d.font('vi').fontSize(8).fillColor(MUTED).text(s(t.showing(b.rows.length, b.total)), M, d.y, { width: W });
        d.moveDown(0.6);
        break;
      }
      case 'risks': {
        ensure(30);
        d.font('vi-bold').fontSize(11).fillColor(INK).text(s(b.title), M, d.y, { width: W }).moveDown(0.3);
        if (b.note || !b.items.length) { d.font('vi').fontSize(10).fillColor(MUTED).text(s(b.note ?? t.noRisks), M, d.y, { width: W }).moveDown(0.5); break; }
        for (const it of b.items) {
          ensure(40);
          const y = d.y;
          const lv = it.level ?? '';
          const col = LEVEL_COLOR[lv] ?? MUTED;
          d.save().roundedRect(M, y + 1, 58, 14, 7).fill(tint(col, 0.82)).restore();
          d.font('vi-bold').fontSize(7.5).fillColor(col).text(s(lv || '—'), M, y + 4, { width: 58, align: 'center', lineBreak: false });
          d.font('vi-bold').fontSize(10).fillColor(INK).text(s(`${it.key} ${it.title}`), M + 66, y + 1, { width: W - 66 });
          const sub = [it.owner ? `${t.owner}: ${it.owner}` : null, it.mitigation].filter(Boolean).join(' · ');
          if (sub) d.font('vi').fontSize(9).fillColor(MUTED).text(s(sub), M + 66, d.y, { width: W - 66 });
          d.moveDown(0.5);
        }
        break;
      }
      case 'ai': {
        d.font('vi').fontSize(10);
        const body = s(b.text.replace(/^#+\s*/gm, '').replace(/\*\*(.+?)\*\*/g, '$1'));
        const h = d.heightOfString(body, { width: W - 28 }) + 46;
        ensure(Math.min(h, 300));
        const y = d.y;
        const fits = y + h <= bottom();
        if (fits) d.save().roundedRect(M, y, W, h, 8).fillAndStroke(tint(r.accent, 0.93), tint(r.accent, 0.7)).restore();
        d.font('vi-bold').fontSize(10.5).fillColor(r.accent).text(s(b.title), M + 14, y + 10, { width: W - 28 });
        d.font('vi').fontSize(8).fillColor(MUTED).text(s(`${b.note}${b.generatedAt ? ` (${fmtDay(b.generatedAt.slice(0, 10))})` : ''}`), M + 14, d.y + 1, { width: W - 28 });
        d.moveDown(0.3);
        d.font('vi').fontSize(10).fillColor(INK).text(body, M + 14, d.y, { width: W - 28, lineGap: 1.5 });
        d.y = Math.max(d.y, fits ? y + h : d.y) + 10;
        break;
      }
    }
  }

  // ── Mục lục (số trang thật) ──
  if (wantToc) {
    d.switchToPage(tocStart);
    d.y = d.page.margins.top;
    d.font('vi-bold').fontSize(18).fillColor(r.accent).text(s(t.contents), M, d.y).moveDown(0.8);
    let page = tocStart;
    for (const h of headings) {
      if (d.y + 18 > bottom() && page < tocStart + tocPages - 1) { page++; d.switchToPage(page); d.y = d.page.margins.top; }
      const pg = (headingPage.get(h.anchor) ?? tocStart + tocPages) + 1;
      const x = M + (h.level - 1) * 16;
      const y = d.y;
      d.font(h.level === 1 ? 'vi-bold' : 'vi').fontSize(h.level === 1 ? 11 : 10).fillColor(INK);
      d.text(s(h.text), x, y, { width: W - (x - M) - 40, goTo: h.anchor, lineBreak: false, ellipsis: true, height: 14 });
      d.text(String(pg), M, y, { width: W, align: 'right', goTo: h.anchor, lineBreak: false });
      d.save().moveTo(x, y + 15).lineTo(M + W, y + 15).dash(1, { space: 2 }).lineWidth(0.3).strokeColor(LINE).stroke().undash().restore();
      d.y = y + 19;
    }
    for (const h of headings) if (h.level === 1) d.outline.addItem(h.text);
  }

  // ── Đầu + chân trang (bỏ bìa) ──
  const range = d.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    if (coverPage && i === 0) continue;
    d.switchToPage(i);
    const mt = d.page.margins.top, mb = d.page.margins.bottom;
    d.page.margins.top = 0; d.page.margins.bottom = 0;
    d.save().moveTo(M, M - 2).lineTo(M + W, M - 2).lineWidth(1.2).strokeColor(r.accent).stroke().restore();
    d.font('vi').fontSize(8).fillColor(MUTED).text(s(`${r.project.name} · ${r.title}`), M, M - 14, { width: W * 0.65, lineBreak: false, ellipsis: true, height: 10 });
    d.text(s(periodText(r)), M + W * 0.5, M - 14, { width: W * 0.5, align: 'right', lineBreak: false });
    const fy = d.page.height - M + 14;
    d.save().moveTo(M, fy - 6).lineTo(M + W, fy - 6).lineWidth(0.4).strokeColor(LINE).stroke().restore();
    d.text('CT Work', M, fy, { width: W / 2, lineBreak: false });
    d.text(s(t.page(i + 1, range.count)), M + W / 2, fy, { width: W / 2, align: 'right', lineBreak: false });
    d.page.margins.top = mt; d.page.margins.bottom = mb;
  }
  d.end();
  return done;
}

// ═══ DOCX ════════════════════════════════════════════════════════

const FONT = 'Calibri';
const hex = (c: string) => c.replace('#', '').toUpperCase();
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' };
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
/** Bề rộng vùng chữ (twip): A4 11906 − lề 2×1300. Bảng khai cột bằng twip + layout FIXED — % đơn thuần làm Word/Pages co cột. */
const CONTENT_TW = 11906 - 2 * 1300;
const run = (text: string, o: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {}) => new TextRun({ text, font: FONT, bold: o.bold, size: o.size, color: o.color, italics: o.italics });

export async function renderReportDocx(r: ResolvedReport, a: BrandAssets): Promise<Buffer> {
  const t = T[r.lang];
  const accent = hex(r.accent);
  const headings = headingsOf(r);
  const anchorOf = new Map(headings.map((h) => [h.id, h.anchor]));
  const MAX_W = 600; // px (~16 cm ở 96 dpi)
  const out: Array<Paragraph | Table | TableOfContents> = [];

  if (r.options.cover) {
    if (a.cover) {
      const f = fitImage(a.cover.width, a.cover.height, MAX_W, 260);
      out.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: a.cover.buffer, transformation: f, altText: { name: 'Cover', description: 'Project cover image', title: 'Cover' } })] }));
    } else {
      out.push(new Paragraph({ shading: { type: ShadingType.CLEAR, fill: accent, color: 'auto' }, spacing: { after: 0 }, children: [run(' ', { size: 120 })] }));
    }
    if (a.logo) {
      const f = fitImage(a.logo.width, a.logo.height, 90, 90);
      out.push(new Paragraph({ spacing: { before: 400 }, children: [new ImageRun({ type: 'png', data: a.logo.buffer, transformation: f, altText: { name: 'Logo', description: `${r.workspace.name} logo`, title: 'Logo' } })] }));
    }
    out.push(new Paragraph({ spacing: { before: 400, after: 120 }, children: [run(`${r.workspace.name} · ${r.project.name} (${r.project.key})`, { size: 22, color: '6B7280' })] }));
    out.push(new Paragraph({ spacing: { after: 160 }, children: [run(r.title, { bold: true, size: 56 })] }));
    if (r.subtitle) out.push(new Paragraph({ spacing: { after: 400 }, children: [run(r.subtitle, { size: 28, color: '6B7280' })] }));
    out.push(new Paragraph({ spacing: { before: 300 }, children: [run(`${t.period}: `, { bold: true }), run(periodText(r))] }));
    out.push(new Paragraph({ children: [run(`${t.generated}: `, { bold: true }), run(fmtDay(r.generatedAt.slice(0, 10)))] }));
    out.push(new Paragraph({ spacing: { before: 1200 }, children: [run(t.prepared, { size: 18, color: '6B7280' })] }));
    out.push(new Paragraph({ children: [new PageBreak()] }));
  }
  if (r.options.toc && headings.length) {
    out.push(new Paragraph({ spacing: { after: 200 }, children: [run(t.contents, { bold: true, size: 36, color: accent })] }));
    out.push(new TableOfContents(t.contents, { hyperlink: true, headingStyleRange: '1-3', cachedEntries: headings.map((h) => ({ title: h.text, level: h.level, href: h.anchor })) }));
    out.push(new Paragraph({ children: [new PageBreak()] }));
  }

  let bid = 1;
  const cellPara = (text: string, o: { bold?: boolean; size?: number; color?: string } = {}) => new Paragraph({ spacing: { after: 0 }, children: [run(text, { size: o.size ?? 18, bold: o.bold, color: o.color })] });

  for (const b of r.blocks) {
    switch (b.type) {
      case 'heading': {
        const anchor = anchorOf.get(b.id);
        const level = b.level === 1 ? HeadingLevel.HEADING_1 : b.level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3;
        const id = bid++;
        const runs = [run(b.text)];
        out.push(new Paragraph({ heading: level, children: anchor ? [new BookmarkStart(anchor, id) as unknown as ParagraphChild, ...runs, new BookmarkEnd(id) as unknown as ParagraphChild] : runs }));
        break;
      }
      case 'text':
        for (const para of b.text.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
          const lines = para.split('\n');
          if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) lines.forEach((l) => out.push(new Paragraph({ bullet: { level: 0 }, children: [run(l.replace(/^\s*[-*•]\s+/, ''))] })));
          else out.push(new Paragraph({ children: lines.flatMap((l, i) => (i ? [new TextRun({ break: 1 }), run(l)] : [run(l)])) }));
        }
        break;
      case 'pageBreak': out.push(new Paragraph({ children: [new PageBreak()] })); break;
      case 'error': out.push(new Paragraph({ children: [run(`[${t.unavailable}: ${b.message}]`, { italics: true, color: '6B7280' })] })); break;
      case 'kpis': {
        if (b.title) out.push(new Paragraph({ children: [run(b.title, { bold: true })] }));
        const rows: TableRow[] = [];
        for (let i = 0; i < b.items.length; i += 3) {
          const cells = b.items.slice(i, i + 3).map((k) => new TableCell({
            width: { size: Math.floor(CONTENT_TW / 3), type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: 'F9FAFB', color: 'auto' },
            margins: { top: 100, bottom: 100, left: 140, right: 100 },
            borders: { top: BORDER, bottom: BORDER, right: BORDER, left: { style: BorderStyle.SINGLE, size: 18, color: accent } },
            children: [cellPara(k.label, { size: 16, color: '6B7280' }), cellPara(k.value, { bold: true, size: 36 }), ...(k.hint ? [cellPara(k.hint, { size: 14, color: '6B7280' })] : [])],
          }));
          while (cells.length < 3) cells.push(new TableCell({ width: { size: Math.floor(CONTENT_TW / 3), type: WidthType.DXA }, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE }, children: [cellPara('')] }));
          rows.push(new TableRow({ cantSplit: true, children: cells }));
        }
        out.push(new Table({ width: { size: CONTENT_TW, type: WidthType.DXA }, columnWidths: [CONTENT_TW / 3, CONTENT_TW / 3, CONTENT_TW / 3].map(Math.floor), layout: TableLayoutType.FIXED, borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' }, insideVertical: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' } }, rows }));
        out.push(new Paragraph({ children: [] }));
        break;
      }
      case 'chart': {
        const img = a.charts.get(b.id);
        if (!img) { out.push(new Paragraph({ children: [run(`[${b.title}]`, { italics: true, color: '6B7280' })] })); break; }
        const f = fitImage(img.width, img.height, MAX_W, 420);
        out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 }, children: [new ImageRun({ type: 'png', data: img.buffer, transformation: f, altText: { name: b.title.slice(0, 100), description: b.title, title: b.title.slice(0, 100) } })] }));
        break;
      }
      case 'issues': {
        if (b.title) out.push(new Paragraph({ children: [run(b.title, { bold: true })] }));
        if (!b.rows.length) { out.push(new Paragraph({ children: [run(t.none, { color: '6B7280' })] })); break; }
        const head = new TableRow({ tableHeader: true, children: b.columns.map((c) => new TableCell({ shading: { type: ShadingType.CLEAR, fill: hex(tint(r.accent, 0.85)), color: 'auto' }, margins: { top: 60, bottom: 60, left: 80, right: 80 }, children: [cellPara(c, { bold: true })] })) });
        const rows = b.rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((c, i) => new TableCell({ shading: ri % 2 ? { type: ShadingType.CLEAR, fill: 'F9FAFB', color: 'auto' } : undefined, margins: { top: 40, bottom: 40, left: 80, right: 80 }, children: [cellPara(c, { bold: b.colKeys[i] === 'key' })] })) }));
        const fixed: Record<string, number> = { key: 1100, type: 1200, status: 1400, assignee: 1700, priority: 1100, due: 1150, points: 750 };
        const rest = Math.max(2200, CONTENT_TW - b.colKeys.filter((k) => k !== 'title').reduce((a2, k) => a2 + (fixed[k] ?? 1200), 0));
        let cw = b.colKeys.map((k) => (k === 'title' ? rest : fixed[k] ?? 1200));
        const sum = cw.reduce((x, y) => x + y, 0);
        cw = cw.map((w) => Math.floor((w * CONTENT_TW) / sum));
        out.push(new Table({ width: { size: CONTENT_TW, type: WidthType.DXA }, columnWidths: cw, layout: TableLayoutType.FIXED, borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER, insideHorizontal: BORDER, insideVertical: BORDER }, rows: [head, ...rows] }));
        if (b.total > b.rows.length) out.push(new Paragraph({ children: [run(t.showing(b.rows.length, b.total), { size: 16, color: '6B7280' })] }));
        out.push(new Paragraph({ children: [] }));
        break;
      }
      case 'risks': {
        out.push(new Paragraph({ children: [run(b.title, { bold: true })] }));
        if (b.note || !b.items.length) { out.push(new Paragraph({ children: [run(b.note ?? t.noRisks, { color: '6B7280' })] })); break; }
        for (const it of b.items) {
          out.push(new Paragraph({ bullet: { level: 0 }, children: [run(`[${it.level ?? '—'}] `, { bold: true, color: hex(LEVEL_COLOR[it.level ?? ''] ?? '#6b7280') }), run(`${it.key} ${it.title}`, { bold: true }), ...(it.owner || it.mitigation ? [new TextRun({ break: 1 }), run([it.owner ? `${t.owner}: ${it.owner}` : null, it.mitigation].filter(Boolean).join(' · '), { color: '6B7280', size: 18 })] : [])] }));
        }
        break;
      }
      case 'ai': {
        const paras = b.text.replace(/^#+\s*/gm, '').replace(/\*\*(.+?)\*\*/g, '$1').split(/\n{2,}/).map((p) => new Paragraph({ spacing: { after: 100 }, children: p.split('\n').flatMap((l, i) => (i ? [new TextRun({ break: 1 }), run(l, { size: 20 })] : [run(l, { size: 20 })])) }));
        out.push(new Table({
          width: { size: CONTENT_TW, type: WidthType.DXA }, columnWidths: [CONTENT_TW], layout: TableLayoutType.FIXED,
          borders: { top: BORDER, bottom: BORDER, left: { style: BorderStyle.SINGLE, size: 18, color: accent }, right: BORDER, insideHorizontal: NONE, insideVertical: NONE },
          rows: [new TableRow({ children: [new TableCell({
            shading: { type: ShadingType.CLEAR, fill: hex(tint(r.accent, 0.93)), color: 'auto' }, margins: { top: 120, bottom: 120, left: 180, right: 140 },
            children: [new Paragraph({ children: [run(b.title, { bold: true, color: accent })] }), new Paragraph({ spacing: { after: 120 }, children: [run(`${b.note}${b.generatedAt ? ` (${fmtDay(b.generatedAt.slice(0, 10))})` : ''}`, { size: 16, color: '6B7280', italics: true })] }), ...paras],
          })] })],
        }));
        out.push(new Paragraph({ children: [] }));
        break;
      }
    }
  }

  const document = new Document({
    creator: 'CT Work', title: r.title, description: `${r.project.name} — ${periodText(r)}`,
    features: { updateFields: true },
    styles: {
      default: { document: { run: { font: FONT, size: 21 }, paragraph: { spacing: { after: 120, line: 276 } } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 34, bold: true, color: accent }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: hex(tint(r.accent, 0.6)), space: 4 } } } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 27, bold: true }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1, keepNext: true } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 2, keepNext: true } },
      ],
    },
    sections: [{
      properties: { titlePage: r.options.cover, page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1300, left: 1300, right: 1300 } } },
      headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: accent, space: 4 } }, children: [run(`${r.project.name} · ${r.title}`, { size: 16, color: '6B7280' }), run(`    ${periodText(r)}`, { size: 16, color: '6B7280' })] })] }) },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: r.lang === 'vi' ? ['Trang ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES] : ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 16, color: '6B7280', font: FONT })] })] }),
        first: new Footer({ children: [new Paragraph({ children: [] })] }),
      },
      children: out,
    }],
  });
  return Packer.toBuffer(document);
}
