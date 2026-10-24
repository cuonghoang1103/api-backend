/**
 * CT Work — ghi/đọc .xlsx CÓ ĐỊNH DẠNG, không thêm thư viện (đợt 1b, 08/10/2026).
 *
 * `xlsxWorkbook` ở exchange.service chỉ có chữ đậm + bộ lọc. Mẫu tài liệu kiểm thử của FPT
 * (Report 5.1/5.2) cần nhiều hơn: gộp ô, nền màu, viền, chữ xoay (cột UTCID), định dạng
 * ngày, công thức (COUNTIF/SUM… kèm giá trị tính sẵn), liên kết nội bộ sang sheet khác và
 * danh sách thả xuống (N/A/B, P/F, Passed/Failed/Pending/N/A). Viết thẳng OOXML bằng adm-zip
 * (đã có trong repo) — repo chưa có exceljs và CLAUDE.md dặn không tự thêm dependency.
 *
 * Đọc: `readXlsx` rút giá trị ô (chuỗi dùng chung, inlineStr, số, bool, công thức ⇒ giá trị
 * tính sẵn nếu có, không thì chuỗi công thức `=…`), ô gộp và liên kết nội bộ — đủ để nhập
 * lại đúng mẫu trường, kể cả tệp tạo bằng Excel/Google Sheets.
 */

import AdmZip from 'adm-zip';
import zlib from 'node:zlib';
import { WORK_LIMITS } from './limits.js';

// ─── Kiểu ────────────────────────────────────────────────────────

export interface XFont { name?: string; sz?: number; b?: boolean; i?: boolean; u?: boolean; color?: string }
export type XBorderStyle = 'thin' | 'medium' | 'hair' | 'dotted' | 'double' | 'dashed';
export interface XStyle {
  font?: XFont;
  /** Nền đặc, ARGB hoặc RGB (vd '000080'). */
  fill?: string;
  border?: XBorderStyle | { l?: XBorderStyle; r?: XBorderStyle; t?: XBorderStyle; b?: XBorderStyle };
  align?: { h?: 'left' | 'center' | 'right'; v?: 'top' | 'center' | 'bottom'; wrap?: boolean; rot?: number };
  /** Mã định dạng số, vd 'dd/mm/yyyy', '@', '0.00'. */
  numFmt?: string;
}
export type XFormula = { f: string; v?: string | number | boolean | null };
export type ImageExt = 'png' | 'jpeg' | 'gif';
/** Ảnh nhúng sheet: neo ô (1-based) + lệch trong ô (EMU) + kích thước (EMU; 1 px = 9525 EMU). */
export interface XImage { row: number; col: number; data: Buffer; ext: ImageExt; cx: number; cy: number; offX?: number; offY?: number }
export const EMU_PER_PX = 9525;
export type XValue = string | number | boolean | Date | XFormula | null | undefined;
interface XCell { v: XValue; s?: XStyle }

export class XSheet {
  readonly cells = new Map<string, XCell>();
  readonly merges: string[] = [];
  readonly colWidths = new Map<number, number>();
  readonly rowHeights = new Map<number, number>();
  readonly links: Array<{ ref: string; location: string; display?: string }> = [];
  readonly validations: Array<{ sqref: string; list: string[] }> = [];
  /** Ảnh nhúng (24/10/2026 — ảnh Evidence của 5.2/5.3): neo góc trên-trái vào ô (row, col), kích thước EMU. */
  readonly images: XImage[] = [];
  freeze?: { col: number; row: number };
  showGrid = true;
  tabColor?: string;

  constructor(public name: string) {}

  /** Ghi ô theo chỉ số 1-based (hàng, cột). */
  set(row: number, col: number, v: XValue, s?: XStyle): this {
    this.cells.set(cellRef(row, col), { v, s });
    return this;
  }
  /** Chỉ đặt kiểu (ô trống có viền/nền — vùng gộp cần viền ở mọi ô). */
  style(row: number, col: number, s: XStyle): this {
    const ref = cellRef(row, col);
    const c = this.cells.get(ref);
    this.cells.set(ref, { v: c?.v ?? null, s });
    return this;
  }
  /** Gộp vùng; kiểu `s` (nếu có) phủ mọi ô trong vùng để viền liền mạch. */
  merge(r1: number, c1: number, r2: number, c2: number, s?: XStyle): this {
    if (r1 === r2 && c1 === c2) return this;
    this.merges.push(`${cellRef(r1, c1)}:${cellRef(r2, c2)}`);
    if (s) for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (r !== r1 || c !== c1) this.style(r, c, s);
    return this;
  }
  width(col: number, w: number): this { this.colWidths.set(col, w); return this; }
  height(row: number, h: number): this { this.rowHeights.set(row, h); return this; }
  link(row: number, col: number, sheet: string, display?: string): this {
    this.links.push({ ref: cellRef(row, col), location: `${quoteSheet(sheet)}!A1`, display });
    return this;
  }
  image(img: XImage): this { this.images.push(img); return this; }
  listValidation(sqref: string, list: string[]): this {
    if (sqref) this.validations.push({ sqref, list });
    return this;
  }
}

// ─── Tiện ích ô ──────────────────────────────────────────────────

export function colName(col: number): string {
  let s = '';
  let n = col;
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
export const cellRef = (row: number, col: number) => `${colName(col)}${row}`;
export function parseRef(ref: string): { row: number; col: number } {
  const m = /^\$?([A-Z]+)\$?(\d+)$/.exec(ref.toUpperCase());
  if (!m) throw new Error(`Bad cell ref ${ref}`);
  let col = 0;
  for (const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64);
  return { row: Number(m[2]), col };
}
/** Tên sheet trong công thức/liên kết: luôn bọc nháy đơn (an toàn với dấu cách, gạch ngang…). */
export const quoteSheet = (name: string) => `'${name.replace(/'/g, "''")}'`;

const xmlEsc = (s: string) => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // Ký tự điều khiển (trừ tab/xuống dòng) làm Excel báo tệp hỏng.
  // eslint-disable-next-line no-control-regex
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

const EPOCH = Date.UTC(1899, 11, 30);
/** Date (lấy phần ngày UTC) ⇒ số sê-ri ngày của Excel. */
export function excelSerial(d: Date): number {
  return Math.round((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - EPOCH) / 86_400_000);
}
export function fromExcelSerial(n: number): Date {
  return new Date(EPOCH + Math.round(n) * 86_400_000);
}

/** Tên sheet hợp lệ (≤31, không \ / ? * [ ] :) và DUY NHẤT trong `taken` (không phân biệt hoa thường). */
export function safeSheetName(raw: string, taken: Set<string>, fallback = 'Sheet'): string {
  let base = raw.replace(/[\\/?*[\]:]/g, ' ').replace(/^'+|'+$/g, '').replace(/\s+/g, ' ').trim() || fallback;
  base = base.slice(0, 31);
  let name = base;
  for (let i = 2; taken.has(name.toLowerCase()); i++) {
    const suf = `_${i}`;
    name = base.slice(0, 31 - suf.length) + suf;
  }
  taken.add(name.toLowerCase());
  return name;
}

// ─── Ghi ─────────────────────────────────────────────────────────

const argb = (c: string) => (c.length === 6 ? `FF${c}` : c).toUpperCase();

class StyleTable {
  fonts: string[] = ['<font><sz val="10"/><name val="Tahoma"/></font>'];
  fills: string[] = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
  borders: string[] = ['<border><left/><right/><top/><bottom/><diagonal/></border>'];
  numFmts: string[] = [];
  xfs: string[] = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
  private xfIndex = new Map<string, number>();

  private idx(list: string[], xml: string): number {
    const i = list.indexOf(xml);
    if (i >= 0) return i;
    list.push(xml);
    return list.length - 1;
  }

  id(s?: XStyle): number {
    if (!s) return 0;
    const key = JSON.stringify(s);
    const hit = this.xfIndex.get(key);
    if (hit !== undefined) return hit;

    const f = s.font ?? {};
    const fontXml = `<font>${f.b ? '<b/>' : ''}${f.i ? '<i/>' : ''}${f.u ? '<u/>' : ''}<sz val="${f.sz ?? 10}"/>${f.color ? `<color rgb="${argb(f.color)}"/>` : ''}<name val="${xmlEsc(f.name ?? 'Tahoma')}"/></font>`;
    const fontId = this.idx(this.fonts, fontXml);
    const fillId = s.fill ? this.idx(this.fills, `<fill><patternFill patternType="solid"><fgColor rgb="${argb(s.fill)}"/><bgColor indexed="64"/></patternFill></fill>`) : 0;
    let borderId = 0;
    if (s.border) {
      const b = typeof s.border === 'string' ? { l: s.border, r: s.border, t: s.border, b: s.border } : s.border;
      const side = (tag: string, st?: XBorderStyle) => (st ? `<${tag} style="${st}"><color indexed="64"/></${tag}>` : `<${tag}/>`);
      borderId = this.idx(this.borders, `<border>${side('left', b.l)}${side('right', b.r)}${side('top', b.t)}${side('bottom', b.b)}<diagonal/></border>`);
    }
    let numFmtId = 0;
    if (s.numFmt) {
      if (s.numFmt === '@') numFmtId = 49;
      else {
        const i = this.numFmts.indexOf(s.numFmt);
        numFmtId = 164 + (i >= 0 ? i : this.numFmts.push(s.numFmt) - 1);
      }
    }
    const a = s.align;
    const alignXml = a ? `<alignment${a.h ? ` horizontal="${a.h}"` : ''}${a.v ? ` vertical="${a.v}"` : ''}${a.wrap ? ' wrapText="1"' : ''}${a.rot ? ` textRotation="${a.rot}"` : ''}/>` : '';
    const xml = `<xf numFmtId="${numFmtId}" fontId="${fontId}" fillId="${fillId}" borderId="${borderId}" xfId="0" applyFont="1"${fillId ? ' applyFill="1"' : ''}${borderId ? ' applyBorder="1"' : ''}${numFmtId ? ' applyNumberFormat="1"' : ''}${alignXml ? ' applyAlignment="1"' : ''}>${alignXml}</xf>`;
    this.xfs.push(xml);
    const id = this.xfs.length - 1;
    this.xfIndex.set(key, id);
    return id;
  }

  xml(): string {
    const nf = this.numFmts.length
      ? `<numFmts count="${this.numFmts.length}">${this.numFmts.map((f, i) => `<numFmt numFmtId="${164 + i}" formatCode="${xmlEsc(f)}"/>`).join('')}</numFmts>`
      : '';
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${nf}<fonts count="${this.fonts.length}">${this.fonts.join('')}</fonts><fills count="${this.fills.length}">${this.fills.join('')}</fills><borders count="${this.borders.length}">${this.borders.join('')}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${this.xfs.length}">${this.xfs.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  }
}

function cellXml(ref: string, cell: XCell, styles: StyleTable): string {
  const sAttr = (() => { const id = styles.id(cell.s); return id ? ` s="${id}"` : ''; })();
  const v = cell.v;
  if (v === null || v === undefined || v === '') return sAttr ? `<c r="${ref}"${sAttr}/>` : '';
  if (typeof v === 'number') return Number.isFinite(v) ? `<c r="${ref}"${sAttr}><v>${v}</v></c>` : `<c r="${ref}"${sAttr}/>`;
  if (typeof v === 'boolean') return `<c r="${ref}"${sAttr} t="b"><v>${v ? 1 : 0}</v></c>`;
  if (v instanceof Date) return `<c r="${ref}"${sAttr}><v>${excelSerial(v)}</v></c>`;
  if (typeof v === 'object') {
    const f = `<f>${xmlEsc(v.f.replace(/^=/, ''))}</f>`;
    if (v.v === null || v.v === undefined) return `<c r="${ref}"${sAttr}>${f}</c>`;
    if (typeof v.v === 'number') return `<c r="${ref}"${sAttr}>${f}<v>${Number.isFinite(v.v) ? v.v : 0}</v></c>`;
    if (typeof v.v === 'boolean') return `<c r="${ref}"${sAttr} t="b">${f}<v>${v.v ? 1 : 0}</v></c>`;
    return `<c r="${ref}"${sAttr} t="str">${f}<v>${xmlEsc(String(v.v))}</v></c>`;
  }
  return `<c r="${ref}"${sAttr} t="inlineStr"><is><t xml:space="preserve">${xmlEsc(String(v))}</t></is></c>`;
}

function sheetXml(sh: XSheet, styles: StyleTable): string {
  const byRow = new Map<number, Array<{ col: number; ref: string; cell: XCell }>>();
  for (const [ref, cell] of sh.cells) {
    const { row, col } = parseRef(ref);
    if (!byRow.has(row)) byRow.set(row, []);
    byRow.get(row)!.push({ col, ref, cell });
  }
  for (const r of sh.rowHeights.keys()) if (!byRow.has(r)) byRow.set(r, []);
  const rows = [...byRow.keys()].sort((a, b) => a - b).map((r) => {
    const cells = byRow.get(r)!.sort((a, b) => a.col - b.col).map((c) => cellXml(c.ref, c.cell, styles)).join('');
    const h = sh.rowHeights.get(r);
    return `<row r="${r}"${h ? ` ht="${h}" customHeight="1"` : ''}>${cells}</row>`;
  }).join('');

  let maxCol = 1, maxRow = 1;
  for (const ref of sh.cells.keys()) { const p = parseRef(ref); maxCol = Math.max(maxCol, p.col); maxRow = Math.max(maxRow, p.row); }
  const cols = [...sh.colWidths.entries()].sort((a, b) => a[0] - b[0])
    .map(([c, w]) => `<col min="${c}" max="${c}" width="${w}" customWidth="1"/>`).join('');
  const pane = sh.freeze && (sh.freeze.col > 1 || sh.freeze.row > 1)
    ? (() => {
        const xs = sh.freeze!.col - 1, ys = sh.freeze!.row - 1;
        const active = xs && ys ? 'bottomRight' : ys ? 'bottomLeft' : 'topRight';
        return `<pane${xs ? ` xSplit="${xs}"` : ''}${ys ? ` ySplit="${ys}"` : ''} topLeftCell="${cellRef(sh.freeze!.row, sh.freeze!.col)}" activePane="${active}" state="frozen"/>`;
      })()
    : '';
  const merges = sh.merges.length ? `<mergeCells count="${sh.merges.length}">${sh.merges.map((m) => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : '';
  const dv = sh.validations.length
    ? `<dataValidations count="${sh.validations.length}">${sh.validations.map((d) => `<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${d.sqref}"><formula1>"${xmlEsc(d.list.join(','))}"</formula1></dataValidation>`).join('')}</dataValidations>`
    : '';
  const links = sh.links.length
    ? `<hyperlinks>${sh.links.map((l) => `<hyperlink ref="${l.ref}" location="${xmlEsc(l.location)}"${l.display ? ` display="${xmlEsc(l.display)}"` : ''}/>`).join('')}</hyperlinks>`
    : '';
  const pr = sh.tabColor ? `<sheetPr><tabColor rgb="${argb(sh.tabColor)}"/></sheetPr>` : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${pr}<dimension ref="A1:${cellRef(maxRow, maxCol)}"/><sheetViews><sheetView workbookViewId="0"${sh.showGrid ? '' : ' showGridLines="0"'}>${pane}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="13.2"/>${cols ? `<cols>${cols}</cols>` : ''}<sheetData>${rows}</sheetData>${merges}${dv}${links}<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>${sh.images.length ? '<drawing r:id="rIdDr1"/>' : ''}</worksheet>`;
}

const IMG_MIME: Record<ImageExt, string> = { png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif' };

/** Phần drawing của một sheet có ảnh: mỗi ảnh một oneCellAnchor (ảnh không co giãn theo ô — như mẫu trường). */
function drawingXml(images: XImage[]): string {
  const anchors = images.map((im, i) => `<xdr:oneCellAnchor><xdr:from><xdr:col>${im.col - 1}</xdr:col><xdr:colOff>${Math.round(im.offX ?? 0)}</xdr:colOff><xdr:row>${im.row - 1}</xdr:row><xdr:rowOff>${Math.round(im.offY ?? 0)}</xdr:rowOff></xdr:from><xdr:ext cx="${Math.round(im.cx)}" cy="${Math.round(im.cy)}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${i + 2}" name="Evidence ${i + 1}"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="rIdImg${i + 1}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`).join('');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${anchors}</xdr:wsDr>`;
}

/** Kích thước điểm ảnh PNG / JPEG / GIF (đọc đầu tệp); không nhận ra ⇒ null. */
export function imageSize(b: Buffer): { w: number; h: number; ext: ImageExt } | null {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), ext: 'png' };
  if (b.length > 10 && b.toString('latin1', 0, 3) === 'GIF') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8), ext: 'gif' };
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if ((m >= 0xc0 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), ext: 'jpeg' };
      i += 2 + len;
    }
  }
  return null;
}

export function writeXlsx(sheets: XSheet[], meta: { title?: string; creator?: string } = {}): Buffer {
  const styles = new StyleTable();
  const built = sheets.map((s) => sheetXml(s, styles));
  const zip = new AdmZip();
  // Ảnh: drawingN.xml cho sheet thứ N có ảnh, media đánh số chung toàn tệp.
  const drawingOverrides: string[] = [];
  const usedExt = new Set<ImageExt>();
  let mediaNo = 0, drawingNo = 0;
  sheets.forEach((sh, i) => {
    if (!sh.images.length) return;
    drawingNo++;
    zip.addFile(`xl/worksheets/_rels/sheet${i + 1}.xml.rels`, Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdDr1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${drawingNo}.xml"/></Relationships>`));
    const rels = sh.images.map((im, k) => {
      mediaNo++;
      usedExt.add(im.ext);
      zip.addFile(`xl/media/image${mediaNo}.${im.ext}`, im.data);
      return `<Relationship Id="rIdImg${k + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${mediaNo}.${im.ext}"/>`;
    }).join('');
    zip.addFile(`xl/drawings/_rels/drawing${drawingNo}.xml.rels`, Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>`));
    zip.addFile(`xl/drawings/drawing${drawingNo}.xml`, Buffer.from(drawingXml(sh.images)));
    drawingOverrides.push(`<Override PartName="/xl/drawings/drawing${drawingNo}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`);
  });
  const mediaDefaults = [...usedExt].map((e) => `<Default Extension="${e}" ContentType="${IMG_MIME[e]}"/>`).join('');
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  zip.addFile('[Content_Types].xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${mediaDefaults}<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${built.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}${drawingOverrides.join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`));
  zip.addFile('_rels/.rels', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`));
  zip.addFile('docProps/core.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xmlEsc(meta.title ?? '')}</dc:title><dc:creator>${xmlEsc(meta.creator ?? 'CT Work')}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`));
  zip.addFile('xl/workbook.xml', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheets.map((s, i) => `<sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`));
  zip.addFile('xl/_rels/workbook.xml.rels', Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`));
  zip.addFile('xl/styles.xml', Buffer.from(styles.xml()));
  built.forEach((xml, i) => zip.addFile(`xl/worksheets/sheet${i + 1}.xml`, Buffer.from(xml)));
  return zip.toBuffer();
}

// ─── Đọc ─────────────────────────────────────────────────────────

export type RCell = string | number | boolean | null;
export interface RSheet {
  name: string;
  /** Giá trị theo ref 'A1'. Công thức không có giá trị tính sẵn ⇒ chuỗi bắt đầu bằng '='. */
  cells: Map<string, RCell>;
  /** Định dạng số của ô (để nhận ra ngày). */
  dateCells: Set<string>;
  merges: string[];
  /** ref ⇒ tên sheet đích của liên kết nội bộ. */
  links: Map<string, string>;
  maxRow: number;
  maxCol: number;
  get(row: number, col: number): RCell;
  text(row: number, col: number): string;
}

const unXml = (s: string) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&amp;/g, '&');
const attr = (tag: string, name: string) => {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? unXml(m[1]) : undefined;
};
/** Ghép mọi <t> trong một khối (rich text có nhiều run). */
const allText = (xml: string) => [...xml.matchAll(/<(?:\w+:)?t(?:\s[^>]*)?>([\s\S]*?)<\/(?:\w+:)?t>/g)].map((m) => unXml(m[1])).join('');

const BUILTIN_DATE_FMTS = new Set([14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57]);

/**
 * Đọc từng phần XML của zip với TRẦN TỔNG GIẢI NÉN (chống zip bomb) — 22/10/2026.
 * Chỉ giải nén đúng phần được hỏi (workbook, rels, sharedStrings, styles, các sheet): ảnh `xl/media/*`, bản vẽ, máy in…
 * KHÔNG BAO GIỜ được giải nén, nên một mẫu FPT 20–30 MB đầy ảnh chụp màn hình chỉ tốn RAM cho phần chữ. Kích thước khai
 * trong mục lục zip có thể nói dối ⇒ còn chặn lần nữa lúc inflate bằng `maxOutputLength`.
 */
export function zipXmlReader(zip: AdmZip, maxTotal = WORK_LIMITS.zipXmlBytes): (p: string) => string | undefined {
  let used = 0;
  return (p) => {
    const e = zip.getEntry(p);
    if (!e || e.isDirectory) return undefined;
    const left = maxTotal - used;
    if (e.header.size > left) throw new Error('XLSX_TOO_BIG');
    let out: Buffer;
    if (e.header.method === 0) out = e.getCompressedData();
    else if (e.header.method === 8) {
      try { out = zlib.inflateRawSync(e.getCompressedData(), { maxOutputLength: Math.max(1, left) }); } catch (err) {
        if ((err as { code?: string })?.code === 'ERR_BUFFER_TOO_LARGE') throw new Error('XLSX_TOO_BIG');
        throw err;
      }
    } else out = e.getData();
    used += out.length;
    if (used > maxTotal) throw new Error('XLSX_TOO_BIG');
    return out.toString('utf8');
  };
}

export function readXlsx(buf: Buffer): RSheet[] {
  let zip: AdmZip;
  try { zip = new AdmZip(buf); } catch { throw new Error('NOT_XLSX'); }
  const read = zipXmlReader(zip);
  const wb = read('xl/workbook.xml');
  if (!wb) throw new Error('NOT_XLSX');
  const rels = read('xl/_rels/workbook.xml.rels') ?? '';
  const relTarget = new Map<string, string>();
  for (const m of rels.matchAll(/<Relationship\b[^>]*>/g)) {
    const id = attr(m[0], 'Id'), t = attr(m[0], 'Target');
    if (id && t) relTarget.set(id, t.startsWith('/') ? t.slice(1) : `xl/${t.replace(/^\.\//, '')}`);
  }
  const shared: string[] = [];
  const sst = read('xl/sharedStrings.xml');
  if (sst) for (const m of sst.matchAll(/<si>([\s\S]*?)<\/si>/g)) shared.push(allText(m[1]));

  // Ô nào là ngày: theo numFmt của style.
  const dateXf = new Set<number>();
  const stylesXml = read('xl/styles.xml');
  if (stylesXml) {
    const custom = new Map<number, string>();
    for (const m of stylesXml.matchAll(/<numFmt\b[^>]*>/g)) custom.set(Number(attr(m[0], 'numFmtId')), attr(m[0], 'formatCode') ?? '');
    const xfsBlock = /<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/.exec(stylesXml)?.[1] ?? '';
    [...xfsBlock.matchAll(/<xf\b[^>]*\/?>/g)].forEach((m, i) => {
      const id = Number(attr(m[0], 'numFmtId') ?? 0);
      const code = (custom.get(id) ?? '').replace(/"[^"]*"|\[[^\]]*\]/g, '').toLowerCase();
      if (BUILTIN_DATE_FMTS.has(id) || (custom.has(id) && /[dy]/.test(code) && !/^[#0.,%\s]*$/.test(code))) dateXf.add(i);
    });
  }

  const out: RSheet[] = [];
  for (const m of wb.matchAll(/<sheet\b[^>]*\/?>/g)) {
    const name = attr(m[0], 'name') ?? '';
    const rid = attr(m[0], 'r:id');
    const path = rid ? relTarget.get(rid) : undefined;
    const xml = path ? read(path) : undefined;
    if (!xml) continue;
    const cells = new Map<string, RCell>();
    const dateCells = new Set<string>();
    let maxRow = 0, maxCol = 0;
    for (const c of xml.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const head = c[1], body = c[2] ?? '';
      const ref = attr(head, 'r');
      if (!ref) continue;
      const t = attr(head, 't');
      const sIdx = Number(attr(head, 's') ?? 0);
      const vRaw = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
      const fRaw = /<f(?:\s[^>]*)?>([\s\S]*?)<\/f>/.exec(body)?.[1];
      let val: RCell = null;
      if (t === 's') val = vRaw !== undefined ? shared[Number(vRaw)] ?? '' : null;
      else if (t === 'inlineStr') val = allText(body);
      else if (t === 'b') val = vRaw === '1';
      else if (t === 'str' || t === 'e') val = vRaw !== undefined ? unXml(vRaw) : null;
      else if (vRaw !== undefined) val = Number(vRaw);
      if ((val === null || val === '') && fRaw) val = `=${unXml(fRaw)}`;
      if (typeof val === 'string') val = val.replace(/\r\n?/g, '\n');
      if (val === null || val === '') continue;
      cells.set(ref, val);
      if (typeof val === 'number' && dateXf.has(sIdx)) dateCells.add(ref);
      const p = parseRef(ref);
      maxRow = Math.max(maxRow, p.row);
      maxCol = Math.max(maxCol, p.col);
    }
    const merges = [...xml.matchAll(/<mergeCell\b[^>]*ref="([^"]+)"/g)].map((x) => x[1]);
    const links = new Map<string, string>();
    for (const h of xml.matchAll(/<hyperlink\b[^>]*\/?>/g)) {
      const ref = attr(h[0], 'ref'), loc = attr(h[0], 'location');
      if (ref && loc) links.set(ref.split(':')[0], loc.replace(/!.*$/, '').replace(/^'|'$/g, '').replace(/''/g, "'"));
    }
    out.push({
      name, cells, dateCells, merges, links, maxRow, maxCol,
      get(row, col) { return cells.get(cellRef(row, col)) ?? null; },
      text(row, col) {
        const v = cells.get(cellRef(row, col));
        if (v === undefined || v === null) return '';
        if (typeof v === 'number' && dateCells.has(cellRef(row, col))) return fromExcelSerial(v).toISOString().slice(0, 10);
        return String(v).trim();
      },
    });
  }
  return out;
}

// ─── Đọc ảnh nhúng (Evidence 5.2/5.3) ────────────────────────────

export interface RImage { sheet: string; row: number; col: number; data: Buffer; ext: ImageExt }

/**
 * Ảnh chụp nhúng trong từng sheet (24/10/2026): mẫu 5.2/5.3 của nhóm dán ảnh Evidence thẳng vào cột Evidence —
 * bộ đọc chữ bỏ qua `xl/media/*` nên trước đây nhập xong là MẤT hết ảnh. Trả ô neo (1-based) của góc trên-trái ảnh.
 * Chỉ PNG/JPEG/GIF; trần từng ảnh `maxEach`, trần tổng `maxTotal` (giải nén có chặn — zip bomb), quá trần ⇒ bỏ ảnh đó.
 */
export function readXlsxImages(buf: Buffer, opts: { maxEach?: number; maxTotal?: number; maxCount?: number } = {}): { images: RImage[]; skipped: number } {
  const maxEach = opts.maxEach ?? 8 * 1024 * 1024, maxTotal = opts.maxTotal ?? 80 * 1024 * 1024, maxCount = opts.maxCount ?? 600;
  let zip: AdmZip;
  try { zip = new AdmZip(buf); } catch { return { images: [], skipped: 0 }; }
  const read = zipXmlReader(zip);
  const resolve = (base: string, target: string) => {
    if (target.startsWith('/')) return target.slice(1);
    const parts = base.split('/').slice(0, -1);
    for (const seg of target.split('/')) { if (seg === '..') parts.pop(); else if (seg && seg !== '.') parts.push(seg); }
    return parts.join('/');
  };
  const relsOf = (part: string) => {
    const dir = part.split('/').slice(0, -1).join('/');
    const file = part.split('/').pop();
    const xml = read(`${dir}/_rels/${file}.rels`) ?? '';
    const m = new Map<string, { type: string; target: string }>();
    for (const r of xml.matchAll(/<Relationship\b[^>]*>/g)) {
      const id = attr(r[0], 'Id'), t = attr(r[0], 'Target'), ty = attr(r[0], 'Type') ?? '';
      if (id && t && attr(r[0], 'TargetMode') !== 'External') m.set(id, { type: ty, target: resolve(part, t) });
    }
    return m;
  };
  const wb = read('xl/workbook.xml');
  if (!wb) return { images: [], skipped: 0 };
  const wbRels = relsOf('xl/workbook.xml');
  const images: RImage[] = [];
  let total = 0, skipped = 0;
  const cache = new Map<string, Buffer | null>();
  const media = (path: string): Buffer | null => {
    if (cache.has(path)) return cache.get(path)!;
    const e = zip.getEntry(path);
    let out: Buffer | null = null;
    if (e && !e.isDirectory && e.header.size <= maxEach && total + e.header.size <= maxTotal) {
      try {
        out = e.header.method === 0 ? e.getCompressedData() : e.header.method === 8 ? zlib.inflateRawSync(e.getCompressedData(), { maxOutputLength: maxEach }) : null;
      } catch { out = null; }
      if (out) total += out.length;
    }
    cache.set(path, out);
    return out;
  };
  for (const m of wb.matchAll(/<sheet\b[^>]*\/?>/g)) {
    const name = attr(m[0], 'name') ?? '';
    const rid = attr(m[0], 'r:id');
    const sheetPart = rid ? wbRels.get(rid)?.target : undefined;
    if (!sheetPart) continue;
    for (const [, rel] of relsOf(sheetPart)) {
      if (!/\/drawing$/.test(rel.type)) continue;
      const dxml = read(rel.target);
      if (!dxml) continue;
      const drels = relsOf(rel.target);
      for (const a of dxml.matchAll(/<xdr:(?:oneCellAnchor|twoCellAnchor|absoluteAnchor)\b[\s\S]*?<\/xdr:(?:oneCellAnchor|twoCellAnchor|absoluteAnchor)>/g)) {
        const from = /<xdr:from>([\s\S]*?)<\/xdr:from>/.exec(a[0])?.[1];
        const embed = /<a:blip\b[^>]*r:embed="([^"]+)"/.exec(a[0])?.[1];
        if (!from || !embed) continue;
        const col = Number(/<xdr:col>(\d+)<\/xdr:col>/.exec(from)?.[1] ?? NaN);
        const row = Number(/<xdr:row>(\d+)<\/xdr:row>/.exec(from)?.[1] ?? NaN);
        const target = drels.get(embed)?.target;
        if (!Number.isFinite(col) || !Number.isFinite(row) || !target) continue;
        if (images.length >= maxCount) { skipped++; continue; }
        const data = media(target);
        const kind = data ? imageSize(data) : null;
        if (!data || !kind) { skipped++; continue; }
        images.push({ sheet: name, row: row + 1, col: col + 1, data, ext: kind.ext });
      }
    }
  }
  return { images, skipped };
}
