/**
 * ============================================================
 * PDF GỐC cho cổng Claude chính hãng (17/10/2026)
 * ============================================================
 *
 * Bình thường app đặt PDF vào `.cuongthai/dinh-kem/` rồi chèn ĐƯỜNG DẪN vào câu
 * hỏi; agent `read_file` ⇒ `docPdf.ts` rút chữ. Mất bố cục, bảng, hình.
 *
 * Cổng Claude chính hãng (model `cl-*`) đọc được PDF NGUYÊN BẢN (khối `document`
 * phía máy chủ). Hợp đồng (`docs/cong-anthropic-chinh-hang.md`, mục 3b): app gửi
 * khối `{type:'file', file:{filename, file_data:'data:application/pdf;base64,…'}}`
 * trong tin `user`, tối đa 4 tệp/tin, mỗi tệp ~6MB. Rambo/modelapi chỉ nhận một
 * dòng "không đọc được PDF gốc" ⇒ ở cổng khác KHÔNG gửi, giữ đường rút chữ cũ.
 *
 * Tìm PDF bằng chính đường dẫn trong câu hỏi (dòng "File tôi vừa đính kèm…" của
 * app, `@duong.pdf` của VS Code/CLI) — nên một chỗ này dùng được cho cả ba vỏ,
 * không thêm trường nào vào kênh `agent:send`.
 *
 * ⛔ Chỉ đọc file NẰM TRONG thư mục dự án (cùng ranh giới với `jail.ts`): câu
 * hỏi có thể được dán từ nơi khác, và một đường dẫn tuyệt đối tới PDF ngoài dự
 * án không được tự lên máy chủ chỉ vì nó xuất hiện trong chữ.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

/** Tối đa mỗi tin — khớp `MAX_PDF` phía máy chủ (`turn.ts`). */
export const MAX_PDF_GOC = 4;

/**
 * Trần một tệp. Máy chủ bỏ data URI dài hơn 8.000.000 ký tự; base64 phình 4/3
 * và có 28 ký tự tiền tố ⇒ ~5,99MB. Lấy 5,9MB cho chắc.
 */
export const TRAN_PDF_GOC_BYTE = 5_900_000;

export interface KhoiFile { type: 'file'; file: { filename: string; file_data: string } }

/** Model này có đi cổng Claude chính hãng không (mã `cl-*`). */
export function laCongChinhHang(model: string | undefined | null): boolean {
  return typeof model === 'string' && /^cl-/.test(model);
}

/** Mọi đường dẫn `.pdf` nhắc tới trong câu hỏi, giữ thứ tự, bỏ trùng. */
export function timPdfTrongCau(cau: string): string[] {
  const ra: string[] = [];
  for (const m of cau.matchAll(/(?:^|[\s`'"(@])([^\s`'"()<>@]+\.pdf)(?=$|[\s`'"(),:;!?]|\.(?:\s|$))/gim)) {
    const d = m[1]!.replace(/^[-*]\s*/, '');
    if (!ra.includes(d)) ra.push(d);
  }
  return ra;
}

/**
 * Đọc các PDF nhắc tới ⇒ khối `file`. Tệp ngoài dự án, quá trần, không phải
 * PDF thật (thiếu `%PDF`) ⇒ bỏ qua, kèm lý do (đi lại vào câu cho model biết).
 */
export async function docKhoiPdf(
  goc: string, duongDan: readonly string[],
): Promise<{ khoi: KhoiFile[]; boQua: string[] }> {
  const khoi: KhoiFile[] = [];
  const boQua: string[] = [];
  const gocThat = path.resolve(goc);
  for (const d of duongDan) {
    if (khoi.length >= MAX_PDF_GOC) { boQua.push(`${d} (quá ${MAX_PDF_GOC} tệp/tin)`); continue; }
    const that = path.resolve(gocThat, d);
    const rel = path.relative(gocThat, that);
    if (rel.startsWith('..') || path.isAbsolute(rel)) { boQua.push(`${d} (ngoài thư mục dự án)`); continue; }
    try {
      const st = await fs.stat(that);
      if (!st.isFile()) continue;
      if (st.size > TRAN_PDF_GOC_BYTE) {
        boQua.push(`${d} (${(st.size / 1048576).toFixed(1)}MB — quá trần gửi gốc, dùng read_file)`);
        continue;
      }
      const byte = await fs.readFile(that);
      if (byte.subarray(0, 5).toString('latin1') !== '%PDF-') { boQua.push(`${d} (không phải PDF)`); continue; }
      khoi.push({
        type: 'file',
        file: { filename: path.basename(that).slice(0, 200), file_data: `data:application/pdf;base64,${byte.toString('base64')}` },
      });
    } catch {
      /* không có file ⇒ có thể chỉ là chữ trông giống đường dẫn — im lặng */
    }
  }
  return { khoi, boQua };
}
