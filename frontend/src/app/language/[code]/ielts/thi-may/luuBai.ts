/**
 * TỰ LƯU bài đang làm (12/11/2026) — localStorage theo id đề + lượt, try/catch mọi chỗ.
 * Tải lại trang / đóng tab / app desktop khởi động lại ⇒ trung tâm hỏi "Tiếp tục bài đang làm?".
 * Trước đây dùng sessionStorage (mất khi đóng tab) và khôi phục im lặng.
 */
import type { TrangThaiLam } from './PhongLam';
import type { TrangThaiViet } from './PhongViet';
import type { KyNang } from './de/types';

export type TienTrinhBoLuu = {
  id: string;
  bands: Partial<Record<KyNang, number | null>>;
  luotIds: Partial<Record<KyNang, number>>;
  sangLoc?: { dung: number; tong: number };
  /** Số câu đúng L/R (xếp lớp cần số thô, không phải band). */
  tho?: Partial<Record<'nghe' | 'doc', number>>;
};

export type BaiDangLam = {
  deId: string;
  kyNang: KyNang;
  cheDo: 'practice' | 'full';
  phanChon: number[];
  /** Bộ đề đang thi đủ (nếu có): band + id lượt máy chủ của các kỹ năng đã xong, điểm sàng lọc. */
  bo?: TienTrinhBoLuu;
  lam?: TrangThaiLam;
  viet?: TrangThaiViet;
  luc: number;
};

const TIEN_TO = 'ielts-thi-may:lam:';
const HAN_MS = 7 * 24 * 3600_000;
const khoa = (deId: string) => `${TIEN_TO}${deId}`;

export function ghiBai(b: BaiDangLam): void {
  try { localStorage.setItem(khoa(b.deId), JSON.stringify({ ...b, luc: Date.now() })); } catch { /* đầy / chế độ riêng tư */ }
}

export function xoaBai(deId: string): void {
  try { localStorage.removeItem(khoa(deId)); } catch { /* bỏ qua */ }
}

export function docBai(deId: string): BaiDangLam | null {
  try {
    const r = localStorage.getItem(khoa(deId));
    if (!r) return null;
    const b = JSON.parse(r) as BaiDangLam;
    if (!b?.deId || Date.now() - (b.luc ?? 0) > HAN_MS) { xoaBai(deId); return null; }
    return b;
  } catch { return null; }
}

/** Mọi bài đang dở (mới nhất trước). */
export function dsBaiDangLam(): BaiDangLam[] {
  const ra: BaiDangLam[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith(TIEN_TO)) continue;
      const b = docBai(k.slice(TIEN_TO.length));
      if (b) ra.push(b);
    }
  } catch { /* bỏ qua */ }
  return ra.sort((a, b) => b.luc - a.luc);
}

/** Dọn khoá cũ của bản trước (sessionStorage, một khoá chung). */
export function donKhoaCu(): void {
  try { sessionStorage.removeItem('ielts-thi-may:dang-lam'); } catch { /* bỏ qua */ }
}
