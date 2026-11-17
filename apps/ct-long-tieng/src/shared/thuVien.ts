/**
 * Nhận ra vai trò từng tệp trong một thư mục kết quả — hàm thuần, có test.
 *
 * Nguồn đúng nhất là `.ctlt.json` app tự ghi lúc tải về (giữ tên THẬT sau khi chống trùng " (2)"). Thư mục chép từ
 * nơi khác / tải bằng trang web thì không có tệp đó ⇒ đoán theo quy ước đặt tên của trạm (hợp đồng mục 3):
 *   `<Tên> [VI].mp4` · `<Tên> [VI + giọng gốc 15%].mp4` · `<Tên>.vi.srt` · `<Tên>.<zh|en>.srt` · `thong-tin.json`
 */
import type { LoaiKetQua } from './hopDong';

export function doanVaiTro(ten: string): LoaiKetQua | null {
  const t = ten.normalize('NFC').toLowerCase();
  if (t === 'thong-tin.json') return 'thong-tin';
  if (/\.vi(?: \(\d+\))?\.srt$/.test(t) || /\.vi\.srt$/.test(t)) return 'srt-vi';
  if (/\.srt$/.test(t)) return 'srt-goc';
  if (!/\.(mp4|mkv|webm|mov|m4v)$/.test(t)) return null;
  if (/\[vi\s*\+[^\]]*\]/.test(t) || /giọng gốc|giong goc/.test(t)) return 'vi-goc';
  if (/\[vi\]/.test(t)) return 'vi';
  return null;
}

export type BanDoTep = Partial<Record<LoaiKetQua, string>>;

/** Ghép bản đồ vai trò → tên tệp: ưu tiên `.ctlt.json`, đoán phần còn thiếu, và chỉ giữ tệp có thật. */
export function banDoTep(dsTep: string[], ghiChu: BanDoTep | null): BanDoTep {
  const co = new Set(dsTep);
  const ra: BanDoTep = {};
  if (ghiChu) {
    for (const [k, v] of Object.entries(ghiChu)) if (typeof v === 'string' && co.has(v)) ra[k as LoaiKetQua] = v;
  }
  for (const ten of [...dsTep].sort()) {
    const vai = doanVaiTro(ten);
    if (vai && !ra[vai]) ra[vai] = ten;
  }
  return ra;
}

/** Khớp tìm kiếm không dấu: "long tieng" tìm ra "Lồng Tiếng". */
export function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

export function khopTimKiem(truong: Array<string | null | undefined>, tuKhoa: string): boolean {
  const k = boDau(tuKhoa.trim());
  if (!k) return true;
  const kho = boDau(truong.filter(Boolean).join(' \u0001 '));
  return k.split(/\s+/).every((tu) => kho.includes(tu));
}
