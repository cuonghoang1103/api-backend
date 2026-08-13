/**
 * Ảnh chụp → PDF "y hệt bản gốc" (mỗi ảnh một trang).
 * ─────────────────────────────────────────────────────────────────────────
 * Đây là câu trả lời cho "sao không chuyển thẳng ảnh sang PDF cho giống 100%".
 * Có, và nó dễ — nhưng phải nói rõ ĐÁNH ĐỔI:
 *
 *   • PDF ẢNH (file này): giống bản gốc từng nét, kể cả chữ viết tay ở lề.
 *     Nhưng KHÔNG sửa được chữ, KHÔNG bôi đen copy được, và nặng hơn.
 *   • PDF CHỮ (in từ bản chép): sửa được, tìm kiếm được, nhẹ — nhưng là gõ
 *     lại nên bố cục theo Times chuẩn chứ không phải nét mực photo.
 *
 * Hai thứ phục vụ hai việc khác nhau, nên giao diện cho tải cả hai.
 *
 * Ảnh được NẮN THẲNG và ĐƯA NỀN VỀ TRẮNG trước khi đóng vào PDF: ảnh chụp
 * thô dán nguyên vào thì ra một tờ xám nghiêng, in lên giấy trông rất bẩn —
 * đúng lời người dùng "trông xấu quá".
 */
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { lamSachAnh } from './lamSachAnh.js';

/** A4 dọc, đơn vị point (72 pt = 1 inch). */
const A4 = { rong: 595.28, cao: 841.89 };
const LE = 28;

export interface AnhChoPdf {
  buffer: Buffer;
  ten?: string;
}

export interface TuyChonPdfAnh {
  /** Nắn thẳng + đưa nền về trắng. Mặc định BẬT. Tắt khi muốn giữ y nguyên
   *  ảnh gốc, kể cả nền xám (ví dụ trang có hình tô bóng). */
  lamSach?: boolean;
}

/**
 * Đóng các ảnh thành một PDF, mỗi ảnh một trang A4, canh giữa và co cho vừa
 * lề. Không phóng to ảnh nhỏ quá khổ — phóng lên chỉ ra ảnh vỡ.
 */
export async function anhSangPdf(anhs: AnhChoPdf[], tuyChon: TuyChonPdfAnh = {}): Promise<Buffer> {
  if (!anhs.length) throw new Error('không có ảnh nào');
  const { lamSach = true } = tuyChon;

  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const manh: Uint8Array[] = [];
  doc.on('data', (d: Uint8Array) => manh.push(d));
  const xong = new Promise<Buffer>((giai) => doc.on('end', () => giai(Buffer.concat(manh))));

  for (const a of anhs) {
    // Luôn qua sharp một lần: vừa áp cờ xoay EXIF, vừa đổi HEIC → PNG (pdfkit
    // chỉ nhận JPEG/PNG), vừa là chỗ làm sạch.
    let anh: Buffer = Buffer.from(await sharp(a.buffer, { failOn: 'none' }).rotate().png().toBuffer());
    if (lamSach) anh = Buffer.from(await lamSachAnh(anh, { nanThang: true, langNen: true }));

    const meta = await sharp(anh).metadata();
    const w = meta.width ?? 1;
    const h = meta.height ?? 1;
    const ngang = w > h;

    // Ảnh ngang thì xoay trang thay vì thu nhỏ ảnh — chữ trên tờ đề chụp
    // ngang mà ép vào khổ dọc thì bé đến mức không đọc nổi.
    const trang = ngang ? { rong: A4.cao, cao: A4.rong } : A4;
    doc.addPage({ size: [trang.rong, trang.cao], margin: 0 });

    const vuaRong = trang.rong - LE * 2;
    const vuaCao = trang.cao - LE * 2;
    const ti = Math.min(vuaRong / w, vuaCao / h, 1);
    const veRong = w * ti;
    const veCao = h * ti;
    doc.image(anh, (trang.rong - veRong) / 2, (trang.cao - veCao) / 2, { width: veRong, height: veCao });
  }

  doc.end();
  return xong;
}
