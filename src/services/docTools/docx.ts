/**
 * Bản chép (chữ + LaTeX) → file Word.
 * ─────────────────────────────────────────────────────────────────────────
 * Công thức đi vào docx dưới dạng OMML — công thức Word thật, sửa được. Chữ
 * dùng Times New Roman: Word tự có font đó và tự vẽ dấu tiếng Việt, nên KHÔNG
 * phải nhúng font như bên PDF.
 *
 * Cú pháp nhận vào (chính là thứ model được dặn trả về, xem `prompt.ts`):
 *     # tiêu đề lớn      ## tiêu đề nhỏ       - gạch đầu dòng
 *     **đậm**            $công thức$          $$công thức đứng riêng$$
 *     [HÌNH] mô tả hình vẽ
 *
 * Một công thức hỏng KHÔNG được làm hỏng cả file: chỗ nào không dựng nổi OMML
 * thì rơi về in nguyên mã LaTeX ra chữ, kèm đếm số chỗ rơi để báo lên giao
 * diện. Người dùng cần biết trang nào phải xem lại, chứ không cần một file
 * trắng kèm câu "đã xảy ra lỗi".
 */
import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  ImportedXmlComponent,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import sharp from 'sharp';
import { MathConvertError, gopKhoiToan, tachCongThuc, texToOmml } from './omml.js';
import { logger } from '../../utils/logger.js';

const CO_CHU = 26; // half-point → 13pt
const FONT = 'Times New Roman';

export interface HinhKemTheo {
  /** PNG/JPEG đã sẵn sàng nhúng. */
  buffer: Buffer;
  loai: 'png' | 'jpg';
  chuThich?: string;
  /** Rộng × cao tính bằng point khi chèn vào trang (A4 trừ lề ≈ 450pt). */
  rong?: number;
  cao?: number;
}

export interface KetQuaDocx {
  buffer: Buffer;
  /** Số biểu thức phải rơi về chữ thường vì không dựng được OMML. */
  congThucHong: number;
  soCongThuc: number;
}

/** Kiểu chữ mặc định của một dòng (tiêu đề thì đậm và to hơn một chút). */
interface KieuChu { bold?: boolean; size?: number }

/** `**đậm**` → các mẩu chữ, giữ nguyên phần còn lại. */
function chiaDam(chu: string, kieu: KieuChu = {}): TextRun[] {
  const co = kieu.size ?? CO_CHU;
  const ra: TextRun[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let cuoi = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(chu))) {
    if (m.index > cuoi) ra.push(new TextRun({ text: chu.slice(cuoi, m.index), bold: kieu.bold, size: co, font: FONT }));
    ra.push(new TextRun({ text: m[1], bold: true, size: co, font: FONT }));
    cuoi = re.lastIndex;
  }
  if (cuoi < chu.length) ra.push(new TextRun({ text: chu.slice(cuoi), bold: kieu.bold, size: co, font: FONT }));
  return ra;
}

interface DemHong { hong: number; tong: number }

/** Một dòng → các con của một Paragraph (chữ + OMML xen kẽ). */
function noiDungDong(dong: string, dem: DemHong, kieu: KieuChu = {}): (TextRun | ImportedXmlComponent)[] {
  const con: (TextRun | ImportedXmlComponent)[] = [];
  for (const manh of tachCongThuc(dong)) {
    if (manh.loai === 'chu') {
      if (manh.noiDung) con.push(...chiaDam(manh.noiDung, kieu));
      continue;
    }
    dem.tong++;
    try {
      con.push(ImportedXmlComponent.fromXmlString(texToOmml(manh.noiDung, manh.display)));
    } catch (e) {
      dem.hong++;
      if (!(e instanceof MathConvertError)) {
        logger.warn('docTools: lỗi lạ khi dựng OMML', { error: (e as Error).message });
      }
      // Rơi về chữ: giữ nguyên mã LaTeX để người dùng còn sửa tay được.
      con.push(new TextRun({ text: ` ${manh.noiDung} `, size: CO_CHU, font: FONT, italics: true }));
    }
  }
  return con;
}

export async function renderDocx(opts: {
  tieuDe?: string;
  vanBan: string;
  hinh?: HinhKemTheo[];
}): Promise<KetQuaDocx> {
  const dem: DemHong = { hong: 0, tong: 0 };
  const than: Paragraph[] = [];
  /** Hình được phát theo THỨ TỰ các dấu [HÌNH] gặp trong bài. */
  let iHinh = 0;

  if (opts.tieuDe?.trim()) {
    than.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: opts.tieuDe.trim(), bold: true, size: CO_CHU + 4, font: FONT })],
      }),
    );
  }

  for (const goc of gopKhoiToan(opts.vanBan).split('\n')) {
    const dong = goc.trimEnd();
    if (!dong.trim()) {
      than.push(new Paragraph({ children: [], spacing: { after: 60 } }));
      continue;
    }

    // ─── Chỗ có hình ───────────────────────────────────────────────────
    // Hình phải nằm ĐÚNG CHỖ nó xuất hiện trong trang, không phải dồn hết
    // xuống cuối file. Dồn xuống cuối thì đề bài mất hình, người đọc phải
    // cuộn đi cuộn lại để ghép — đúng lỗi bản đầu mắc phải.
    //
    // Có ảnh cho vị trí này → chèn ảnh, KHÔNG kèm chú thích và KHÔNG kèm
    // đoạn mô tả (mô tả chỉ để đọc khi không có hình; có hình rồi thì nó
    // thành chữ thừa chen giữa đề).
    const hinh = dong.match(/^\s*\[HÌNH\]\s*(.*)$/i);
    if (hinh) {
      const anh = opts.hinh?.[iHinh];
      if (anh) {
        iHinh++;
        than.push(await doanAnh(anh));
        continue;
      }
      const moTa = hinh[1].replace(/^\(giữ hình gốc\)\s*/i, '').trim();
      if (!moTa) {
        // Chế độ "không xử lý hình": để lại một dấu mờ cho người dùng biết
        // chỗ này cần dán ảnh gốc vào.
        than.push(
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: '[Hình vẽ — dán ảnh gốc vào đây]', italics: true, size: CO_CHU - 4, font: FONT, color: '888888' })],
          }),
        );
        continue;
      }
      than.push(
        new Paragraph({
          spacing: { before: 60, after: 80 },
          indent: { left: 360 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'BBBBBB', space: 8 } },
          children: [
            new TextRun({ text: 'Hình vẽ: ', bold: true, italics: true, size: CO_CHU - 2, font: FONT, color: '555555' }),
            ...noiDungDong(moTa, dem),
          ],
        }),
      );
      continue;
    }

    // Tiêu đề: giữ CỠ CHỮ gần với trang gốc. Bản đầu dùng HeadingLevel của
    // Word (16pt xanh, cách dòng rộng) nên file ra trông như bài blog chứ
    // không như tờ đề — đậm + căn giữa là đủ.
    const h1 = dong.match(/^#\s+(.*)$/);
    const h2 = dong.match(/^##\s+(.*)$/);
    if (h1 || h2) {
      than.push(
        new Paragraph({
          alignment: h1 ? AlignmentType.CENTER : AlignmentType.LEFT,
          spacing: { before: 120, after: 80 },
          children: noiDungDong((h1 ?? h2)![1], dem, { bold: true, size: h1 ? CO_CHU + 2 : CO_CHU }),
        }),
      );
      continue;
    }

    const gach = dong.match(/^\s*[-*]\s+(.*)$/);
    if (gach) {
      than.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: noiDungDong(gach[1], dem) }));
      continue;
    }

    // Công thức đứng riêng một mình trên dòng → căn giữa như trong sách.
    const rieng = dong.trim().match(/^\$\$([\s\S]+)\$\$$/);
    if (rieng) {
      than.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
          children: noiDungDong(dong.trim(), dem),
        }),
      );
      continue;
    }

    than.push(new Paragraph({ spacing: { after: 60 }, children: noiDungDong(dong, dem) }));
  }

  // Hình còn thừa (nhiều hình hơn số dấu [HÌNH]) mới xếp xuống cuối — chứ
  // KHÔNG phải mặc định dồn hết xuống dưới như bản đầu.
  for (const h of (opts.hinh ?? []).slice(iHinh)) {
    than.push(await doanAnh(h));
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: CO_CHU } } } },
    sections: [
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
        children: than,
      },
    ],
  });

  const buffer = (await Packer.toBuffer(doc)) as unknown as Buffer;
  return { buffer, congThucHong: dem.hong, soCongThuc: dem.tong };
}

/** Một đoạn chỉ chứa ảnh, căn giữa. Chú thích CHỈ hiện khi người gọi đưa vào —
 *  mặc định không có, vì hình nằm đúng chỗ rồi thì thêm dòng chữ dưới hình chỉ
 *  làm trang khác đi so với bản gốc. */
async function doanAnh(h: HinhKemTheo): Promise<Paragraph> {
  const kt = await kichThuoc(h);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 80 },
    children: [
      new ImageRun({ type: h.loai, data: h.buffer, transformation: { width: kt.rong, height: kt.cao } }),
      ...(h.chuThich
        ? [new TextRun({ break: 1, text: h.chuThich, italics: true, size: CO_CHU - 4, font: FONT, color: '777777' })]
        : []),
    ],
  });
}

/** Co ảnh cho vừa bề ngang trang in (A4 trừ lề ≈ 450pt), giữ tỉ lệ. */
async function kichThuoc(h: HinhKemTheo): Promise<{ rong: number; cao: number }> {
  const TOI_DA = 450;
  if (h.rong && h.cao) {
    const ti = Math.min(1, TOI_DA / h.rong);
    return { rong: Math.round(h.rong * ti), cao: Math.round(h.cao * ti) };
  }
  try {
    const meta = await sharp(h.buffer).metadata();
    const w = meta.width ?? TOI_DA;
    const hh = meta.height ?? Math.round(TOI_DA * 0.7);
    const ti = Math.min(1, TOI_DA / w);
    return { rong: Math.round(w * ti), cao: Math.round(hh * ti) };
  } catch {
    return { rong: TOI_DA, cao: Math.round(TOI_DA * 0.7) };
  }
}
