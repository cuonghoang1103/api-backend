/**
 * 🐼 Bíp nói gì, mặt thế nào — theo TRẠNG THÁI HỌC của người dùng (09/11/2026).
 *
 * Đầu vào: số ngày vắng (từ mốc mở trang gần nhất lưu localStorage `langLastSeen`), thẻ đến hạn `due`, chuỗi ngày
 * `streak`. Thuần hàm + dữ liệu, không React. Thứ tự ưu tiên: vắng lâu (≥7) › vắng 3–6 › vắng 1–2 / quay lại ›
 * có thẻ đến hạn › chuỗi ngày › mặc định. Mỗi nhóm nhiều câu, chọn ngẫu nhiên (hoặc theo `seed`).
 *
 * Các cảm xúc chấm bài (inspect / grade / correct / wrong) đã có sẵn trong GauBip để bước chấm quiz dùng sau.
 */
import type { CamXucGau } from './GauBip';

export type TinhHinh = {
  /** Số ngày kể từ lần mở gần nhất; `null` = lần đầu / không có dữ liệu. */
  vangNgay: number | null;
  /** Thẻ đến hạn ôn. */
  due?: number;
  /** Chuỗi ngày học liên tiếp. */
  streak?: number;
  /** Đã đăng nhập (chưa đăng nhập thì không có due/streak thật). */
  dangNhap?: boolean;
  /** Tên khoá đang học dở, nếu có. */
  tenKhoa?: string;
};

export type LoiBip = { emotion: CamXucGau; text: string };

const KHO: Record<string, string[]> = {
  vang7: [
    'Bạn bỏ mình rồi sao? 😢',
    'Một tuần rồi bạn chưa quay lại… mình ngồi đợi mãi.',
    'Mình nhớ bạn lắm đó! Học lại với mình nha?',
    'Hu hu, bảy ngày không thấy bạn. Về rồi thì ôn một bài nhỏ thôi cũng được.',
  ],
  vang3: [
    'Mấy hôm nay bạn đi đâu vậy?',
    'Học tiếp với mình nha? Mình chờ nãy giờ.',
    'Ba ngày rồi đó… mình hơi buồn. Vào học chút không?',
  ],
  vang1: [
    'A, bạn quay lại rồi!',
    'Hôm nay học gì nào?',
    'Chào mừng trở lại! Mình sẵn sàng rồi nè.',
  ],
  due: [
    'Có {due} thẻ chờ ôn đó!',
    'Ôn nhanh {due} thẻ này nha, rồi học bài mới.',
    'Mình soi thấy {due} thẻ đến hạn rồi nè 🔍',
  ],
  streak: [
    'Chuỗi {streak} ngày rồi, giỏi quá!',
    '{streak} ngày liên tiếp — giữ lửa nha! 🔥',
    'Ngọn lửa {streak} ngày đang cháy, đừng để tắt nhé!',
  ],
  moi: [
    'Bắt đầu thôi!',
    'Chào bạn, mình là Bíp! Hôm nay học gì đây?',
    'Mỗi ngày một chút là đủ. Vào học nào!',
  ],
  tiep: [
    'Hôm nay học tiếp {khoa} nhé 🐼',
    'Quay lại {khoa} nào, mình đi cùng bạn!',
  ],
};

function chon(bank: string[], seed?: number | string): string {
  if (!bank.length) return '';
  let i: number;
  if (seed === undefined) i = Math.floor(Math.random() * bank.length);
  else if (typeof seed === 'number') i = Math.abs(Math.floor(seed)) % bank.length;
  else { let h = 0; for (let k = 0; k < seed.length; k++) h = (h * 31 + seed.charCodeAt(k)) | 0; i = Math.abs(h) % bank.length; }
  return bank[i];
}

export function loiTheoTinhHinh(t: TinhHinh, seed?: number | string): LoiBip {
  const v = t.vangNgay;
  if (v !== null && v >= 7) return { emotion: 'miss', text: chon(KHO.vang7, seed) };
  if (v !== null && v >= 3) return { emotion: v >= 5 ? 'lonely' : 'sad', text: chon(KHO.vang3, seed) };
  if (t.due && t.due > 0) return { emotion: t.due >= 20 ? 'think' : 'inspect', text: chon(KHO.due, seed).replace('{due}', String(t.due)) };
  if (t.streak && t.streak >= 3) return { emotion: 'streak', text: chon(KHO.streak, seed).replace('{streak}', String(t.streak)) };
  if (v !== null && v >= 1) return { emotion: 'comeback', text: chon(KHO.vang1, seed) };
  if (t.tenKhoa) return { emotion: 'happy', text: chon(KHO.tiep, seed).replace('{khoa}', t.tenKhoa) };
  return { emotion: 'happy', text: chon(KHO.moi, seed) };
}

/* ── Mốc mở trang gần nhất ── */
const KHOA_LAN_CUOI = 'langLastSeen';

/** Đọc số ngày vắng (null nếu chưa có mốc) rồi ghi mốc mới = bây giờ. Gọi MỘT lần khi trang My Language mở. */
export function docVaGhiLanCuoi(now: number = Date.now()): number | null {
  let vang: number | null = null;
  try {
    const cu = Number(window.localStorage.getItem(KHOA_LAN_CUOI));
    if (cu > 0) vang = Math.floor((now - cu) / 86_400_000);
    window.localStorage.setItem(KHOA_LAN_CUOI, String(now));
  } catch { /* riêng tư — coi như lần đầu */ }
  return vang;
}
