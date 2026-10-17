/**
 * NGÔN NGỮ GIAO DIỆN — Tiếng Việt ↔ English, đổi NGAY (không khởi động lại).
 *
 * Mỗi chuỗi giao diện viết `L('tiếng Việt', 'English')` ngay tại chỗ dùng —
 * không bảng khoá riêng: hai bản đứng cạnh nhau thì không thể quên dịch một
 * bản, và `test/i18n.test.ts` quét cả mã nguồn (AST TypeScript) để chặn mọi
 * chuỗi tiếng Việt lọt ra ngoài `L(…)`.
 *
 * `L` được gọi LÚC VẼ, nên đổi ngôn ngữ rồi vẽ lại là toàn bộ màn hình đổi
 * theo. Hằng số cấp module có chữ (bảng chế độ, nhãn tool…) dùng getter hoặc
 * hàm để cũng được tính lúc vẽ.
 *
 * Chữ đến từ LÕI/MÁY CHỦ (tóm tắt tool, lỗi, chẩn đoán) không dịch được ở đây.
 */
export type NgonNgu = 'vi' | 'en';

let nn: NgonNgu = doNgonNgu(process.env);

export const ngonNgu = (): NgonNgu => nn;
export function datNgonNgu(x: NgonNgu): void { nn = x; }

/** `LC_ALL` > `LC_MESSAGES` > `LANG` bắt đầu bằng `vi` ⇒ Tiếng Việt; còn lại English. */
export function doNgonNgu(env: NodeJS.ProcessEnv): NgonNgu {
  const v = env.LC_ALL || env.LC_MESSAGES || env.LANG || '';
  return /^vi([_.-]|$)/i.test(v) ? 'vi' : 'en';
}

/** Chuỗi giao diện theo ngôn ngữ hiện tại. */
export function L(vi: string, en: string): string {
  return nn === 'vi' ? vi : en;
}

/** Số nhiều tiếng Anh đơn giản: `nhieu(2, 'file')` ⇒ "2 files". */
export function nhieu(n: number, tu: string, tuNhieu = `${tu}s`): string {
  return `${n} ${n === 1 ? tu : tuNhieu}`;
}

/** Dòng nhắc model trả lời bằng ngôn ngữ giao diện (bật trong /language). Gửi model — cố ý theo ngôn ngữ đang chọn. */
export function nhacNgonNguTraLoi(x: NgonNgu = nn): string {
  return x === 'vi'
    ? '\n\n(Hãy trả lời bằng tiếng Việt.)' // i18n-bo-qua: câu gửi model, bản tiếng Việt là chủ đích
    : '\n\n(Please reply in English.)';
}
