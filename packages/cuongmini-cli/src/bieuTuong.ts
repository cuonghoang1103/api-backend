/**
 * BIỂU TƯỢNG CuongMini cho thông báo hệ điều hành (đợt 8C). Ảnh NHÚNG trong bundle
 * (`bieuTuongNhung.ts`, sinh bởi `tai-nguyen/dung-bieu-tuong.mjs`) và được ghi ra
 * `~/.cuongmini/bieu-tuong/` khi cần — công cụ thông báo (terminal-notifier, toast
 * Windows, notify-send) chỉ nhận ĐƯỜNG FILE, và cách này chạy với mọi kiểu cài.
 */
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ICO, PNG_128 } from './bieuTuongNhung';
import { thuMucGoc } from './phien';

export interface DuongBieuTuong { png: string; ico: string }

let daGhi: DuongBieuTuong | null = null;

/** Đường PNG + ICO (ghi ra đĩa lần đầu / khi file hỏng). Lỗi ghi ⇒ `null` (thông báo vẫn gửi, chỉ thiếu logo). */
export function duongBieuTuong(goc: string = thuMucGoc()): DuongBieuTuong | null {
  if (daGhi && existsSync(daGhi.png)) return daGhi;
  try {
    const dir = path.join(goc, 'bieu-tuong');
    mkdirSync(dir, { recursive: true });
    const ra: DuongBieuTuong = { png: path.join(dir, 'cuongmini.png'), ico: path.join(dir, 'cuongmini.ico') };
    for (const [duong, b64] of [[ra.png, PNG_128], [ra.ico, ICO]] as const) {
      const buf = Buffer.from(b64, 'base64');
      if (!existsSync(duong) || statSync(duong).size !== buf.length) writeFileSync(duong, buf);
    }
    daGhi = ra;
    return ra;
  } catch {
    return null;
  }
}
