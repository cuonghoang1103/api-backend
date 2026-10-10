/**
 * Ghi .xlsx tối giản NGAY TRÊN TRÌNH DUYỆT (UX-C, 11/10/2026) — một sheet, hàng tiêu đề đậm + cố định, cột rộng theo
 * nội dung, số là số thật (Excel cộng được), chữ có dấu đúng (UTF-8). Không thêm thư viện: ZIP kiểu "stored"
 * (không nén) + CRC-32 tự tính. Tệp vài nghìn dòng chỉ vài trăm KB — đủ cho "xuất bảng đang xem".
 * Thuần (không DOM) ⇒ test bằng tsx: tableLogic.test.ts đọc lại cấu trúc ZIP.
 */

export type XlsxCell = string | number | boolean | null | undefined;

// ─── CRC-32 ──────────────────────────────────────────────────────

let TABLE: Uint32Array | null = null;
export function crc32(data: Uint8Array): number {
  if (!TABLE) {
    TABLE = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      TABLE[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ─── ZIP (stored) ────────────────────────────────────────────────

export function zipStored(files: Array<{ name: string; data: Uint8Array }>): Uint8Array {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const local = new Uint8Array(30 + name.length);
    const v = new DataView(local.buffer);
    v.setUint32(0, 0x04034b50, true);
    v.setUint16(4, 20, true); // version needed
    v.setUint16(6, 0x0800, true); // UTF-8 names
    v.setUint16(8, 0, true); // stored
    v.setUint16(10, 0, true); v.setUint16(12, 0x21, true); // giờ/ngày DOS (1980-01-01)
    v.setUint32(14, crc, true);
    v.setUint32(18, f.data.length, true);
    v.setUint32(22, f.data.length, true);
    v.setUint16(26, name.length, true);
    v.setUint16(28, 0, true);
    local.set(name, 30);
    parts.push(local, f.data);
    const cen = new Uint8Array(46 + name.length);
    const w = new DataView(cen.buffer);
    w.setUint32(0, 0x02014b50, true);
    w.setUint16(4, 20, true); w.setUint16(6, 20, true);
    w.setUint16(8, 0x0800, true); w.setUint16(10, 0, true);
    w.setUint16(12, 0, true); w.setUint16(14, 0x21, true);
    w.setUint32(16, crc, true);
    w.setUint32(20, f.data.length, true);
    w.setUint32(24, f.data.length, true);
    w.setUint16(28, name.length, true);
    w.setUint32(42, offset, true);
    cen.set(name, 46);
    central.push(cen);
    offset += local.length + f.data.length;
  }
  const cenSize = central.reduce((s, c) => s + c.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, cenSize, true);
  e.setUint32(16, offset, true);
  const total = offset + cenSize + end.length;
  const out = new Uint8Array(total);
  let p = 0;
  for (const x of [...parts, ...central, end]) { out.set(x, p); p += x.length; }
  return out;
}

// ─── XLSX ────────────────────────────────────────────────────────

const esc = (s: string) => s
  // Ký tự điều khiển (trừ tab/xuống dòng) làm hỏng XML ⇒ bỏ.
  // eslint-disable-next-line no-control-regex
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function colName(i: number): string {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

/** Sheet XML: hàng 1 = tiêu đề (kiểu 1 = đậm), cố định hàng đầu, bộ lọc tự động. */
export function sheetXml(header: string[], rows: XlsxCell[][]): string {
  const widths = header.map((h, c) => {
    let w = h.length;
    for (const r of rows.slice(0, 500)) w = Math.max(w, String(r[c] ?? '').length);
    return Math.min(60, Math.max(8, w + 2));
  });
  const cell = (v: XlsxCell, ref: string, bold = false) => {
    if (v === null || v === undefined || v === '') return '';
    if (typeof v === 'number' && Number.isFinite(v)) return `<c r="${ref}"${bold ? ' s="1"' : ''}><v>${v}</v></c>`;
    if (typeof v === 'boolean') return `<c r="${ref}" t="b"${bold ? ' s="1"' : ''}><v>${v ? 1 : 0}</v></c>`;
    return `<c r="${ref}" t="inlineStr"${bold ? ' s="1"' : ''}><is><t xml:space="preserve">${esc(String(v))}</t></is></c>`;
  };
  const lastCol = colName(Math.max(0, header.length - 1));
  const body = [
    `<row r="1">${header.map((h, c) => cell(h, `${colName(c)}1`, true)).join('')}</row>`,
    ...rows.map((r, i) => `<row r="${i + 2}">${header.map((_, c) => cell(r[c], `${colName(c)}${i + 2}`)).join('')}</row>`),
  ].join('');
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
    + '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    + `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`
    + `<sheetData>${body}</sheetData>`
    + (rows.length ? `<autoFilter ref="A1:${lastCol}${rows.length + 1}"/>` : '')
    + '</worksheet>';
}

/** Tên sheet hợp lệ của Excel: ≤ 31 ký tự, không có : \ / ? * [ ]. */
export function sheetName(s: string): string {
  return (s.replace(/[:\\/?*[\]]/g, ' ').trim() || 'Sheet1').slice(0, 31);
}

export function buildXlsx(opts: { sheet: string; header: string[]; rows: XlsxCell[][] }): Uint8Array {
  const enc = new TextEncoder();
  const f = (name: string, s: string) => ({ name, data: enc.encode(s) });
  const x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return zipStored([
    f('[Content_Types].xml', `${x}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`),
    f('_rels/.rels', `${x}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    f('xl/workbook.xml', `${x}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${esc(sheetName(opts.sheet))}" sheetId="1" r:id="rId1"/></sheets>${opts.rows.length ? `<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'${esc(sheetName(opts.sheet)).replace(/'/g, "''")}'!$A$1:$${colName(Math.max(0, opts.header.length - 1))}$${opts.rows.length + 1}</definedName></definedNames>` : ''}</workbook>`),
    f('xl/_rels/workbook.xml.rels', `${x}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    f('xl/styles.xml', `${x}<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`),
    f('xl/worksheets/sheet1.xml', sheetXml(opts.header, opts.rows)),
  ]);
}
