/**
 * 🗂️ taoFile.ts — sinh FILE THẬT từ một "spec" JSON mà AI xuất ra (10/11/2026).
 *
 * Mục tiêu: cho AI web (gia sư/chat) "tạo được mọi file như Claude" — Excel, Slide, Word, PDF.
 * AI xuất một khối `<tao-file>…JSON…</tao-file>` trong câu trả lời; tầng hậu xử lý của stream
 * gọi `taoFile(spec)` → { buffer, tenFile, contentType } → tải lên R2 → trả link cho người dùng.
 *
 * TỰ CHỨA: chỉ nhận spec, trả Buffer — KHÔNG đụng R2/stream/DB (để test được tách biệt).
 * Font tiếng Việt cho PDF tái dùng `cv/export/font.ts` (Noto Sans).
 */
import { Buffer } from 'node:buffer';
import ExcelJS from 'exceljs';
import PptxGenJSImport from 'pptxgenjs';
// pptxgenjs xuất CJS: dưới ESM, default có thể bọc một lớp `.default`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PptxGenJS: any = (PptxGenJSImport as any).default ?? PptxGenJSImport;
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import PDFDocument from 'pdfkit';

// ─── Spec (AI xuất ra) ────────────────────────────────────────────────────
export type KhoiVanBan =
  | { loai: 'h1' | 'h2' | 'h3' | 'p'; chu: string }
  | { loai: 'ul' | 'ol'; muc: string[] }
  | { loai: 'bang'; cot?: string[]; hang: (string | number)[][] };

export type SpecXlsx = { loai: 'xlsx'; ten: string; sheets: { ten: string; cot?: string[]; hang: (string | number)[][] }[] };
export type SpecPptx = { loai: 'pptx'; ten: string; slides: { tieuDe: string; y?: string[]; ghiChu?: string }[] };
export type SpecVanBan = { loai: 'docx' | 'pdf'; ten: string; tieuDe?: string; khoi: KhoiVanBan[] };
export type SpecFile = SpecXlsx | SpecPptx | SpecVanBan;

export interface KetQuaFile { buffer: Buffer; tenFile: string; contentType: string }

const CT: Record<string, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
};

/** Tên file an toàn + đúng đuôi. */
function tenAnToan(ten: string, duoi: string): string {
  const goc = (ten || 'file').replace(/\.[a-z0-9]+$/i, '').replace(/[^\p{L}\p{N}\-_ ]/gu, '').trim().slice(0, 80) || 'file';
  return `${goc}.${duoi}`;
}

// ─── Excel ────────────────────────────────────────────────────────────────
async function raXlsx(spec: SpecXlsx): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'CuongThai AI';
  const sheets = spec.sheets?.length ? spec.sheets : [{ ten: 'Sheet1', hang: [] as (string | number)[][] }];
  for (const s of sheets) {
    const ws = wb.addWorksheet((s.ten || 'Sheet').slice(0, 31) || 'Sheet');
    if (s.cot?.length) {
      const hdr = ws.addRow(s.cot);
      hdr.font = { bold: true };
      hdr.eachCell((c) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } }; });
    }
    for (const h of s.hang ?? []) ws.addRow(h);
    // Tự giãn cột theo nội dung (trần 60).
    ws.columns.forEach((col) => {
      let max = 10;
      col.eachCell?.({ includeEmpty: false }, (c) => { max = Math.min(60, Math.max(max, String(c.value ?? '').length + 2)); });
      col.width = max;
    });
  }
  return Buffer.from(await wb.xlsx.writeBuffer());
}

// ─── PowerPoint ─────────────────────────────────────────────────────────────
async function raPptx(spec: SpecPptx): Promise<Buffer> {
  const p = new PptxGenJS();
  p.defineLayout({ name: 'W', width: 13.33, height: 7.5 });
  p.layout = 'W';
  const slides = spec.slides?.length ? spec.slides : [{ tieuDe: spec.ten || 'Slide' }];
  for (const s of slides) {
    const sl = p.addSlide();
    sl.addText(s.tieuDe || '', { x: 0.5, y: 0.3, w: 12.3, h: 1, fontSize: 28, bold: true, color: '1F2937' });
    if (s.y?.length) {
      sl.addText(s.y.map((t) => ({ text: t, options: { bullet: true, fontSize: 18, color: '374151', breakLine: true } })),
        { x: 0.7, y: 1.5, w: 12, h: 5.3, valign: 'top' });
    }
    if (s.ghiChu) sl.addNotes(s.ghiChu);
  }
  // pptxgenjs trả ArrayBuffer/Uint8Array khi outputType nodebuffer.
  const out = (await p.write({ outputType: 'nodebuffer' })) as unknown as Buffer;
  return Buffer.isBuffer(out) ? out : Buffer.from(out as ArrayBuffer);
}

// ─── Word ─────────────────────────────────────────────────────────────────
function khoiRaDocx(k: KhoiVanBan): (Paragraph | Table)[] {
  if (k.loai === 'h1' || k.loai === 'h2' || k.loai === 'h3')
    return [new Paragraph({ text: k.chu, heading: k.loai === 'h1' ? HeadingLevel.HEADING_1 : k.loai === 'h2' ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3 })];
  if (k.loai === 'p') return [new Paragraph({ children: [new TextRun(k.chu)] })];
  if (k.loai === 'ul' || k.loai === 'ol')
    return k.muc.map((m) => new Paragraph({ text: m, bullet: { level: 0 } }));
  if (k.loai === 'bang') {
    const hang = [...(k.cot ? [k.cot] : []), ...k.hang];
    return [new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: hang.map((r, i) => new TableRow({
        children: r.map((c) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(c), bold: i === 0 && !!k.cot })] })] })),
      })),
    })];
  }
  return [];
}

async function raDocx(spec: SpecVanBan): Promise<Buffer> {
  const con: (Paragraph | Table)[] = [];
  if (spec.tieuDe) con.push(new Paragraph({ text: spec.tieuDe, heading: HeadingLevel.TITLE }));
  for (const k of spec.khoi ?? []) con.push(...khoiRaDocx(k));
  const doc = new Document({ sections: [{ children: con.length ? con : [new Paragraph('')] }] });
  return Packer.toBuffer(doc);
}

// ─── PDF (pdfkit + font tiếng Việt) ─────────────────────────────────────────
async function raPdf(spec: SpecVanBan): Promise<Buffer> {
  const { notoSansViBuffer, notoSansViBoldBuffer } = await import('../cv/export/font.js');
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.registerFont('vi', notoSansViBuffer());
  doc.registerFont('vi-dam', notoSansViBoldBuffer());
  const manh: Buffer[] = [];
  doc.on('data', (c: Buffer) => manh.push(c));
  const xong = new Promise<Buffer>((giai) => doc.on('end', () => giai(Buffer.concat(manh))));

  if (spec.tieuDe) doc.font('vi-dam').fontSize(20).text(spec.tieuDe).moveDown(0.6);
  for (const k of spec.khoi ?? []) {
    if (k.loai === 'h1') doc.font('vi-dam').fontSize(16).text(k.chu).moveDown(0.3);
    else if (k.loai === 'h2') doc.font('vi-dam').fontSize(14).text(k.chu).moveDown(0.3);
    else if (k.loai === 'h3') doc.font('vi-dam').fontSize(12).text(k.chu).moveDown(0.2);
    else if (k.loai === 'p') doc.font('vi').fontSize(11).text(k.chu).moveDown(0.4);
    else if (k.loai === 'ul' || k.loai === 'ol') { k.muc.forEach((m, i) => doc.font('vi').fontSize(11).text(`${k.loai === 'ol' ? `${i + 1}.` : '•'} ${m}`)); doc.moveDown(0.4); }
    else if (k.loai === 'bang') { const h = [...(k.cot ? [k.cot] : []), ...k.hang]; h.forEach((r, i) => doc.font(i === 0 && k.cot ? 'vi-dam' : 'vi').fontSize(10).text(r.map(String).join('   |   '))); doc.moveDown(0.4); }
  }
  doc.end();
  return xong;
}

// ─── Điều phối ──────────────────────────────────────────────────────────────
export async function taoFile(spec: SpecFile): Promise<KetQuaFile> {
  if (!spec || typeof spec !== 'object' || !('loai' in spec)) throw new Error('spec tạo file không hợp lệ');
  let buffer: Buffer;
  switch (spec.loai) {
    case 'xlsx': buffer = await raXlsx(spec); break;
    case 'pptx': buffer = await raPptx(spec); break;
    case 'docx': buffer = await raDocx(spec); break;
    case 'pdf': buffer = await raPdf(spec); break;
    default: throw new Error(`loại file không hỗ trợ: ${(spec as { loai: string }).loai}`);
  }
  return { buffer, tenFile: tenAnToan((spec as { ten?: string }).ten ?? 'file', spec.loai), contentType: CT[spec.loai] };
}
