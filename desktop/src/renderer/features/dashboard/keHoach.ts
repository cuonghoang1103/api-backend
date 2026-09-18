/**
 * Kiểu dữ liệu + bảng màu cho BẢNG KẾ HOẠCH CHI TIẾT.
 *
 * Tách khỏi `.tsx` để kiểm được không cần dựng React.
 */

export interface ViecKeHoach {
  id: number;
  title: string;
  date: string;
  done: boolean;
  note: string | null;
  priority: number;
  doKho: number;
  batDauAt: string | null;
  phutLam: number | null;
  truotLuc: string | null;
  lyDoTruot: string | null;
  daTruUyTin: number | null;
  soLanHoan: number;
  truNeuTruot: number;
}

export type TrangThai = 'xong' | 'truot' | 'dangLam';

/**
 * Trạng thái SUY RA từ `done` + `truotLuc`.
 *
 * Không có cột `trangThai` trong DB — có hai nguồn sự thật là chúng sẽ
 * lệch nhau. Xem chú thích trong `schema.prisma`.
 */
export function trangThai(v: { done: boolean; truotLuc: string | null }): TrangThai {
  if (v.done) return 'xong';
  if (v.truotLuc) return 'truot';
  return 'dangLam';
}

export interface Mau { nen: string; vien: string; chu: string; }

/**
 * Màu theo MỨC KHÓ. Xanh lá → hổ phách → đỏ.
 *
 * ⚠️ Màu KHÔNG BAO GIỜ là kênh thông tin duy nhất — mỗi thẻ việc luôn
 * kèm chữ ("Dễ"/"Vừa"/"Khó"). Khoảng 8% nam giới mù màu đỏ-lục, và
 * với họ một bảng kế hoạch phân biệt bằng riêng màu là một bảng trắng.
 */
export const MAU_KHO: Record<number, Mau> = {
  0: { nen: 'rgba(148,163,184,.14)', vien: 'rgba(148,163,184,.45)', chu: '#94a3b8' },
  1: { nen: 'rgba(34,197,94,.14)', vien: 'rgba(34,197,94,.5)', chu: '#4ade80' },
  2: { nen: 'rgba(245,158,11,.14)', vien: 'rgba(245,158,11,.5)', chu: '#fbbf24' },
  3: { nen: 'rgba(239,68,68,.14)', vien: 'rgba(239,68,68,.5)', chu: '#f87171' },
};

export const TEN_KHO: Record<number, string> = { 0: 'Chưa chọn', 1: 'Dễ', 2: 'Vừa', 3: 'Khó' };
export const TEN_QUAN_TRONG: Record<number, string> = { 0: 'Chưa chọn', 1: 'Bình thường', 2: 'Quan trọng', 3: 'Rất quan trọng' };

/**
 * Sắp việc trong ngày: theo GIỜ trước, việc chưa hẹn giờ xuống cuối.
 *
 * Việc chưa hẹn giờ xuống cuối chứ không lên đầu: phần trên của danh
 * sách là thời khoá biểu, và chen một việc không có giờ vào giữa hai
 * việc có giờ làm hỏng cách đọc theo dòng thời gian.
 */
export function xepTheoGio<T extends { batDauAt: string | null; id: number }>(ds: T[]): T[] {
  return [...ds].sort((a, b) => {
    if (a.batDauAt && b.batDauAt) return a.batDauAt.localeCompare(b.batDauAt) || a.id - b.id;
    if (a.batDauAt) return -1;
    if (b.batDauAt) return 1;
    return a.id - b.id;
  });
}

/**
 * Câu tóm tắt một ngày, dùng cho cả tiêu đề lẫn câu robot nói.
 *
 * Trả `null` khi ngày trống — để chỗ gọi tự quyết định nói gì, thay vì
 * nhận về "0/0 việc" và phải đi kiểm lại chuỗi.
 */
export function tomTatNgay(ds: Array<{ done: boolean; truotLuc: string | null }>): {
  tong: number; xong: number; truot: number; con: number;
} | null {
  if (ds.length === 0) return null;
  let xong = 0; let truot = 0;
  for (const v of ds) {
    const t = trangThai(v);
    if (t === 'xong') xong += 1;
    else if (t === 'truot') truot += 1;
  }
  return { tong: ds.length, xong, truot, con: ds.length - xong - truot };
}
