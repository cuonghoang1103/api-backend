/**
 * ⚠️ BẢN SAO CÓ CHỦ Ý của `desktop/src/main/agent/docOffice.ts` — máy chủ và
 * app desktop là hai gói riêng, không import chéo được. Sửa một bên thì sửa
 * cả bên kia (cùng phép kiểm: file Office do LibreOffice thật xuất ra).
 * Ở máy chủ nó phục vụ `doc_web` khi một ĐỊA CHỈ trỏ tới .pptx/.docx/.xlsx.
 */
/**
 * ============================================================
 * ĐỌC FILE OFFICE — .pptx · .docx · .xlsx → CHỮ
 * ============================================================
 *
 * Người dùng 01/10/2026 kéo một thư mục slide + tài liệu môn học vào AI Code.
 * `read_file` đọc được PDF từ lâu, nhưng `.pptx` rơi xuống nhánh "file nhị
 * phân, không đọc thành chữ được" — nên agent kết luận nó không đọc được
 * slide, trong khi slide chỉ là một file zip chứa XML.
 *
 * ─── VÌ SAO TỰ ĐỌC ZIP ───
 * `adm-zip`/`yauzl` có trong node_modules nhưng chỉ là phụ thuộc GIÁN TIẾP của
 * gói khác — dựa vào chúng là chờ một lần nâng cấp gói kia làm vỡ bản cài. Phần
 * cần dùng của định dạng zip rất nhỏ: đọc thư mục trung tâm, giải nén DEFLATE
 * bằng `zlib` có sẵn của Node.
 *
 * ─── CHỐNG BOM ZIP ───
 * Một file 50KB có thể nở thành vài GB. Trần cho TỪNG mục và TỔNG dung lượng
 * đã giải nén; vượt trần thì dừng và nói rõ, không đọc tiếp.
 */
import zlib from 'node:zlib';

/** Trần chữ trả về — cùng trần với PDF (`docPdf.ts`). */
export const MAX_CHU_OFFICE = 120_000;
/** Trần một mục XML sau giải nén. */
const TRAN_MUC = 30 * 1024 * 1024;
/** Trần tổng đã giải nén cho cả file. */
const TRAN_TONG = 120 * 1024 * 1024;

// ─── Zip tối giản ──────────────────────────────────────────────────

interface MucZip { ten: string; phuongPhap: number; nen: number; goc: number; viTri: number }

export class Zip {
  private muc = new Map<string, MucZip>();
  private daGiai = 0;

  constructor(private readonly b: Buffer) {
    // Tìm "End of central directory" từ cuối file (có thể có chú thích ≤64KB).
    const tu = Math.max(0, b.length - 22 - 65_535);
    let eocd = -1;
    for (let i = b.length - 22; i >= tu; i--) {
      if (b.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('không phải file zip (thiếu thư mục trung tâm)');
    const soMuc = b.readUInt16LE(eocd + 10);
    let p = b.readUInt32LE(eocd + 16);
    if (p === 0xffffffff || soMuc === 0xffff) throw new Error('zip64 chưa hỗ trợ');
    for (let i = 0; i < soMuc; i++) {
      if (p + 46 > b.length || b.readUInt32LE(p) !== 0x02014b50) throw new Error('thư mục trung tâm hỏng');
      const phuongPhap = b.readUInt16LE(p + 10);
      const nen = b.readUInt32LE(p + 20);
      const goc = b.readUInt32LE(p + 24);
      const dTen = b.readUInt16LE(p + 28);
      const dPhu = b.readUInt16LE(p + 30);
      const dChu = b.readUInt16LE(p + 32);
      const viTri = b.readUInt32LE(p + 42);
      const ten = b.toString('utf8', p + 46, p + 46 + dTen);
      this.muc.set(ten, { ten, phuongPhap, nen, goc, viTri });
      p += 46 + dTen + dPhu + dChu;
    }
  }

  co(ten: string): boolean { return this.muc.has(ten); }
  ten(): string[] { return [...this.muc.keys()]; }
  /** Danh sách mục kèm kích thước gốc — để liệt kê file .zip. */
  dsMuc(): Array<{ ten: string; byte: number }> { return [...this.muc.values()].map((m) => ({ ten: m.ten, byte: m.goc })); }

  doc(ten: string): string | null {
    const m = this.muc.get(ten);
    if (!m) return null;
    if (m.goc > TRAN_MUC) throw new Error(`mục "${ten}" quá lớn sau giải nén`);
    if (this.daGiai + m.goc > TRAN_TONG) throw new Error('file nở quá lớn khi giải nén — nghi bom zip, dừng');
    const b = this.b;
    if (m.viTri + 30 > b.length || b.readUInt32LE(m.viTri) !== 0x04034b50) throw new Error(`mục "${ten}" hỏng`);
    const batDau = m.viTri + 30 + b.readUInt16LE(m.viTri + 26) + b.readUInt16LE(m.viTri + 28);
    const tho = b.subarray(batDau, batDau + m.nen);
    let ra: Buffer;
    if (m.phuongPhap === 0) ra = Buffer.from(tho);
    // `maxOutputLength`: lớp chống bom thứ hai — kích thước khai trong thư mục
    // trung tâm là do file TỰ KHAI, có thể nói dối.
    else if (m.phuongPhap === 8) ra = zlib.inflateRawSync(tho, { maxOutputLength: TRAN_MUC });
    else throw new Error(`kiểu nén ${m.phuongPhap} chưa hỗ trợ`);
    this.daGiai += ra.length;
    return ra.toString('utf8');
  }
}

// ─── XML → chữ ─────────────────────────────────────────────────────

export function giaiThucThe(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, e: string) => {
    const k = e.toLowerCase();
    if (k === 'amp') return '&';
    if (k === 'lt') return '<';
    if (k === 'gt') return '>';
    if (k === 'quot') return '"';
    if (k === 'apos') return '\'';
    const n = k.startsWith('#x') ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
    try { return String.fromCodePoint(n); } catch { return ''; }
  });
}

/** Chữ của một đoạn (`<a:p>` / `<w:p>`): nối mọi `<x:t>`, giữ tab và ngắt dòng. */
function chuDoan(xml: string, ns: 'a' | 'w'): string {
  const re = new RegExp(`<${ns}:t(?:\\s[^>]*)?>([\\s\\S]*?)</${ns}:t>|<${ns}:tab\\s*/>|<${ns}:br\\s*/>`, 'g');
  let s = '';
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    if (m[1] !== undefined) s += giaiThucThe(m[1]);
    else if (m[0].includes(':tab')) s += '\t';
    else s += '\n';
  }
  return s;
}

function cacDoan(xml: string, ns: 'a' | 'w'): string[] {
  const ra: string[] = [];
  const re = new RegExp(`<${ns}:p[\\s>][\\s\\S]*?</${ns}:p>`, 'g');
  for (const m of xml.match(re) ?? []) {
    const t = chuDoan(m, ns).replace(/[ \u00a0]+$/g, '');
    if (t.trim()) ra.push(t);
  }
  return ra;
}

/** Đọc file `.rels` thành bảng Id → Target. */
function docRels(xml: string | null): Map<string, string> {
  const bang = new Map<string, string>();
  for (const m of (xml ?? '').matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const id = /\bId="([^"]+)"/.exec(m[1]!)?.[1];
    const dich = /\bTarget="([^"]+)"/.exec(m[1]!)?.[1];
    if (id && dich) bang.set(id, dich);
  }
  return bang;
}

function noiDuong(thuMuc: string, dich: string): string {
  if (dich.startsWith('/')) return dich.slice(1);
  const doan = thuMuc.split('/').filter(Boolean);
  for (const d of dich.split('/')) {
    if (d === '..') doan.pop();
    else if (d && d !== '.') doan.push(d);
  }
  return doan.join('/');
}

const soTrongTen = (s: string): number => Number(/(\d+)\.xml$/.exec(s)?.[1] ?? 0);

// ─── Từng định dạng ────────────────────────────────────────────────

export interface KetQuaOffice { loai: 'pptx' | 'docx' | 'xlsx'; soPhan: number; chu: string; catBot: boolean }

function docPptx(z: Zip): KetQuaOffice {
  /* Thứ tự THẬT của slide nằm ở `presentation.xml` (sldIdLst) — tên file
     slideN.xml KHÔNG phải thứ tự trình chiếu: kéo slide 7 lên đầu thì nó vẫn
     tên slide7.xml. Không đọc được thì mới lùi về thứ tự số trong tên. */
  let dsSlide: string[] = [];
  const pres = z.doc('ppt/presentation.xml');
  const rels = docRels(z.doc('ppt/_rels/presentation.xml.rels'));
  if (pres) {
    for (const m of pres.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)) {
      const dich = rels.get(m[1]!);
      if (dich) dsSlide.push(noiDuong('ppt', dich));
    }
  }
  dsSlide = dsSlide.filter((s) => z.co(s));
  if (dsSlide.length === 0) {
    dsSlide = z.ten().filter((t) => /^ppt\/slides\/slide\d+\.xml$/.test(t)).sort((a, b) => soTrongTen(a) - soTrongTen(b));
  }

  const phan: string[] = [];
  dsSlide.forEach((s, i) => {
    const xml = z.doc(s) ?? '';
    const doan = cacDoan(xml, 'a');
    // Ghi chú người thuyết trình: thường là nơi giảng viên viết phần giải thích.
    const tenRels = s.replace(/slides\/(slide\d+\.xml)$/, 'slides/_rels/$1.rels');
    let ghiChu: string[] = [];
    for (const [, dich] of docRels(z.doc(tenRels))) {
      if (/notesSlide/.test(dich)) {
        const n = z.doc(noiDuong('ppt/slides', dich));
        if (n) ghiChu = cacDoan(n, 'a').filter((d) => !/^\d+$/.test(d.trim()));
      }
    }
    phan.push(`── Slide ${i + 1} ──\n${doan.join('\n') || '(không có chữ — có thể chỉ có hình)'}`
      + (ghiChu.length ? `\n[Ghi chú người thuyết trình]\n${ghiChu.join('\n')}` : ''));
  });
  return ketThuc('pptx', phan.length, phan.join('\n\n'));
}

function docDocx(z: Zip): KetQuaOffice {
  const xml = z.doc('word/document.xml');
  if (xml === null) throw new Error('thiếu word/document.xml');
  const than = /<w:body>([\s\S]*)<\/w:body>/.exec(xml)?.[1] ?? xml;
  const dong: string[] = [];
  // Duyệt khối cấp cao theo thứ tự: đoạn văn và BẢNG (bảng giữ dạng hàng | ô).
  for (const m of than.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>|<w:p[\s>][\s\S]*?<\/w:p>/g)) {
    const k = m[0];
    if (k.startsWith('<w:tbl>')) {
      for (const hang of k.match(/<w:tr[\s>][\s\S]*?<\/w:tr>/g) ?? []) {
        const o = (hang.match(/<w:tc[\s>][\s\S]*?<\/w:tc>/g) ?? []).map((c) => cacDoan(c, 'w').join(' ').trim());
        if (o.some(Boolean)) dong.push(`| ${o.join(' | ')} |`);
      }
      dong.push('');
    } else {
      const t = chuDoan(k, 'w');
      // Tiêu đề (Heading1…) → đánh dấu để model thấy cấu trúc tài liệu.
      const cap = /<w:pStyle w:val="(?:Heading|Tieude|Title)(\d?)"/i.exec(k)?.[1];
      if (t.trim()) dong.push(cap !== undefined ? `${'#'.repeat(Math.min(Number(cap) || 1, 6))} ${t.trim()}` : t);
    }
  }
  const chu = dong.join('\n').replace(/\n{3,}/g, '\n\n');
  return ketThuc('docx', dong.length, chu);
}

function docXlsx(z: Zip): KetQuaOffice {
  const chung: string[] = [];
  const ss = z.doc('xl/sharedStrings.xml');
  if (ss) {
    for (const m of ss.match(/<si>[\s\S]*?<\/si>/g) ?? []) {
      chung.push([...m.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((x) => giaiThucThe(x[1]!)).join(''));
    }
  }
  const wb = z.doc('xl/workbook.xml') ?? '';
  const rels = docRels(z.doc('xl/_rels/workbook.xml.rels'));
  const sheet: Array<{ ten: string; duong: string }> = [];
  for (const m of wb.matchAll(/<sheet\b([^>]*)\/?>/g)) {
    const ten = giaiThucThe(/\bname="([^"]*)"/.exec(m[1]!)?.[1] ?? '');
    const rid = /\br:id="([^"]+)"/.exec(m[1]!)?.[1];
    const dich = rid ? rels.get(rid) : undefined;
    if (dich) sheet.push({ ten, duong: noiDuong('xl', dich) });
  }
  const phan: string[] = [];
  for (const s of sheet) {
    const xml = z.doc(s.duong);
    if (!xml) continue;
    const dong: string[] = [];
    for (const hang of xml.match(/<row\b[\s\S]*?<\/row>/g) ?? []) {
      const o: string[] = [];
      for (const c of hang.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        /* Đặt ô theo ĐỊA CHỈ (`r="C5"`), không theo thứ tự xuất hiện: file chỉ
           ghi ô CÓ dữ liệu, nên bỏ qua địa chỉ là ô ở cột C trượt sang cột A
           mỗi khi A, B trống — và bảng điểm đọc ra sai hàng sai cột. */
        const cot = /\br="([A-Z]+)\d+"/.exec(c[1]!)?.[1];
        if (cot) {
          let viTri = 0;
          for (const ch of cot) viTri = viTri * 26 + (ch.charCodeAt(0) - 64);
          while (o.length < Math.min(viTri - 1, 200)) o.push('');
        }
        const kieu = /\bt="([^"]+)"/.exec(c[1]!)?.[1];
        const trong = c[2] ?? '';
        const v = /<v>([\s\S]*?)<\/v>/.exec(trong)?.[1];
        let gt = '';
        if (kieu === 's' && v !== undefined) gt = chung[Number(v)] ?? '';
        else if (kieu === 'inlineStr') gt = [...trong.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((x) => giaiThucThe(x[1]!)).join('');
        else if (v !== undefined) gt = giaiThucThe(v);
        o.push(gt.replace(/\t|\n/g, ' '));
      }
      while (o.length && !o[o.length - 1]) o.pop();
      if (o.some(Boolean)) dong.push(o.join('\t'));
    }
    phan.push(`── Sheet "${s.ten}" (${dong.length} hàng, cột cách nhau bằng tab) ──\n${dong.join('\n')}`);
  }
  return ketThuc('xlsx', phan.length, phan.join('\n\n'));
}

function ketThuc(loai: KetQuaOffice['loai'], soPhan: number, chu: string): KetQuaOffice {
  const catBot = chu.length > MAX_CHU_OFFICE;
  return { loai, soPhan, chu: catBot ? chu.slice(0, MAX_CHU_OFFICE) : chu, catBot };
}

export function laFileOffice(duoi: string): duoi is '.pptx' | '.docx' | '.xlsx' {
  return duoi === '.pptx' || duoi === '.docx' || duoi === '.xlsx';
}

/** Rút chữ một file Office. Ném lỗi có lý do khi file hỏng / không đúng định dạng. */
export function docOffice(byte: Buffer, duoi: '.pptx' | '.docx' | '.xlsx'): KetQuaOffice {
  const z = new Zip(byte);
  if (duoi === '.pptx') return docPptx(z);
  if (duoi === '.docx') return docDocx(z);
  return docXlsx(z);
}
