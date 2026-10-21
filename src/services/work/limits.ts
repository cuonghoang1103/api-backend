/**
 * CT Work — MỘT CHỖ DUY NHẤT cho trần kích thước tệp (22/10/2026).
 *
 * Sự cố: nhập mẫu FPT Report 5.2 (.xlsx ~20 MB vì có ảnh chụp màn hình) ⇒ "Tệp lớn hơn 10 MB". Mỗi tính năng tự đặt
 * một con số riêng (5/8/10/15/25 MB) và tự viết cứng nó vào câu báo lỗi + chuỗi i18n. Chủ web: "CT Work quan trọng công
 * việc, đừng giới hạn mọi thứ thế". Từ nay:
 *   - Mọi trần tệp của CT Work đọc từ đây; đổi bằng env (đơn vị MB), không cần sửa mã.
 *   - Câu báo lỗi lấy số từ đây (`mbText`), frontend đọc cùng bộ số qua `GET /api/v1/work/limits`
 *     (`frontend/src/lib/work-limits.ts` giữ bản mặc định trùng số để kiểm trước khi có mạng).
 *   - Bộ nhớ: tệp đi qua backend bị chặn bởi NGÂN SÁCH RAM chung (`uploadGate.ts`), không phải bởi trần nhỏ.
 *     Đính kèm thẻ/bình luận từ trình duyệt đi THẲNG R2 bằng URL ký sẵn (không qua RAM backend).
 *
 * ⚠️ Cloudflare (gói hiện tại) cắt thân request > 100 MB ở proxy ⇒ tệp ĐI QUA BACKEND không thể vượt ~100 MB dù env đặt
 * cao hơn (người dùng nhận 413 HTML của Cloudflare). Tệp tải THẲNG R2 (URL ký sẵn) không vướng trần đó.
 *
 * Cố ý KHÔNG gom vào đây (trần là ràng buộc bên ngoài hoặc là trần hiển thị, không phải trần "nhận tệp"):
 *   - đoạn ghi âm họp 24 MB (Groq nhận ≤ 25 MB) · voice note 8 MB / 3 phút · xem mã nguồn Git 1 MB/tệp
 *   - ảnh dựng sơ đồ (SVG 2 MB / PNG 4 MB — bộ nhớ đệm hiển thị) · mẫu tuỳ biến 20 KB
 *   - nhập/xuất cả dự án 200 MB (đã lớn, ghi đĩa tạm) · tệp base64 gửi qua MCP 6 MB (đi trong ngữ cảnh mô hình;
 *     tệp lớn dùng attach_file — URL ký sẵn).
 */

const MB = 1024 * 1024;

/** Đọc env theo MB; rác/âm/0 ⇒ mặc định; ép vào [min, max]. */
export function envMb(name: string, def: number, max = 2048, min = 1): number {
  const raw = process.env[name];
  const n = raw === undefined || raw.trim() === '' ? NaN : Number(raw);
  const mb = Number.isFinite(n) && n > 0 ? n : def;
  return Math.round(Math.min(Math.max(mb, min), max) * MB);
}

export const WORK_LIMITS = Object.freeze({
  /** Tệp đính kèm thẻ / bình luận / chat / lớp học / bài nộp / nguồn "Tạo bằng CuongMini" / bằng chứng chạy test. */
  fileBytes: envMb('WORK_MAX_FILE_MB', 100),
  /** Ảnh: ảnh dán trong Docs/mô tả, ảnh bìa dự án, ảnh nhận diện, ảnh câu hỏi quiz, ảnh kéo về khi nhập Notion. */
  imageBytes: envMb('WORK_MAX_IMAGE_MB', 50),
  /** Nhập tệp: Excel FPT 5.1–5.3, báo cáo CI (JUnit/…/coverage), phân tích tĩnh, sơ đồ, CSV Jira, danh sách lớp, sổ điểm. */
  importBytes: envMb('WORK_MAX_IMPORT_MB', 100),
  /** Form công khai: TỔNG tệp một lần gửi (đi base64 trong JSON, ai cũng gửi được ⇒ thấp hơn đính kèm). */
  formTotalBytes: envMb('WORK_FORM_MAX_TOTAL_MB', 50),
  /** Tệp gửi kèm cho trợ lý AI (Hỏi AI) — đặt ở đây để phần chat AI dùng chung; mô hình chỉ đọc chữ/ảnh rút ra. */
  aiFileBytes: envMb('WORK_MAX_AI_FILE_MB', 50),
  /** Xem trước Office (docx ⇒ HTML, xlsx ⇒ bảng) — dựng trong RAM nên thấp hơn trần tải lên. */
  officePreviewBytes: envMb('WORK_OFFICE_PREVIEW_MAX_MB', 50, 200),
  /**
   * Chống zip bomb: tổng byte GIẢI NÉN của các phần XML được đọc từ một .xlsx/.docx (sheet, sharedStrings, styles,
   * workbook…). Ảnh trong `xl/media` KHÔNG tính vì không bao giờ được giải nén khi nhập.
   */
  zipXmlBytes: envMb('WORK_ZIP_XML_MAX_MB', 200, 1024),
  /** Ngân sách RAM chung cho mọi tệp ĐANG được nhận/xử lý qua backend cùng lúc (container 2 GB, heap 1,5 GB). */
  uploadRamBytes: envMb('WORK_UPLOAD_RAM_MB', 384, 1536, 32),
});

/** "100 MB" — dùng trong MỌI câu báo lỗi kích thước (không viết cứng số). */
export function mbText(bytes: number): string {
  const mb = bytes / MB;
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

/** Câu báo lỗi chuẩn cho tệp quá lớn. */
export const tooLargeMessage = (bytes: number, what = 'Files') => `${what} must be ${mbText(bytes)} or smaller`;

/** Bộ số frontend cần (GET /api/v1/work/limits). */
export function publicLimits() {
  return {
    fileBytes: WORK_LIMITS.fileBytes,
    imageBytes: WORK_LIMITS.imageBytes,
    importBytes: WORK_LIMITS.importBytes,
    formTotalBytes: WORK_LIMITS.formTotalBytes,
    aiFileBytes: WORK_LIMITS.aiFileBytes,
    officePreviewBytes: WORK_LIMITS.officePreviewBytes,
  };
}
