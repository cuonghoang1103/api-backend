/**
 * ============================================================
 * TỰ CHUYỂN GIỮA AI MÁY CHỦ VÀ AI NGOẠI TUYẾN — luật thuần, dùng hai phía
 * ============================================================
 *
 * Chủ app 03/10/2026: *"Khi không có mạng nó tự đổi sang AI ngoại tuyến và
 * giao diện của AI cũng đổi theo… Có mạng trở lại ⇒ hiện 'Đã có mạng — quay về
 * AI máy chủ?' (không tự cắt ngang việc đang chạy)."*
 *
 * Hai hàm, một cho MAIN (lượt mới đi đường nào), một cho RENDERER (vẽ dải
 * trạng thái nào). Đặt chung một tệp thuần để vitest kiểm được cả hai, và để
 * hai phía không thể hiểu luật khác nhau.
 *
 * ⛔ RANH GIỚI 1 KHÔNG NỚI: có mạng thì lượt MỚI luôn đi máy chủ — kể cả khi
 * dải "quay về?" còn đang hiện và người dùng chưa bấm. Câu hỏi "quay về?" là để
 * NGƯỜI DÙNG BIẾT chuyện đã đổi, không phải để họ chọn ở lại ngoại tuyến: câu
 * từ máy yếu hơn hẳn (đo thật: đọc "biên" thành "biến"), giữ họ ở đó khi đã có
 * mạng là để họ nhận câu kém hơn mà không cần.
 */

export type DuongLuot =
  /** Có mạng ⇒ máy chủ. */
  | 'mayChu'
  /** Mất mạng, có model, được phép ⇒ chạy trên máy. */
  | 'cucBo'
  /** Mất mạng nhưng chưa tải bản nào dùng được cho việc này. */
  | 'chuaCai'
  /** Mất mạng, có model nhưng người dùng đã tắt một trong hai công tắc. */
  | 'daTat';

export interface DieuKienLuot {
  matMang: boolean;
  /** Công tắc `aiCucBoBat` (mặc định bật). */
  choPhepChay: boolean;
  /** Công tắc `aiCucBoTuDong` (mặc định bật). */
  tuDungKhiMatMang: boolean;
  /** Đã có bản dùng được cho việc này trên đĩa. */
  coModel: boolean;
}

/** Lượt MỚI đi đường nào. Main gọi ngay trước khi chạy. */
export function duongChoLuot(d: DieuKienLuot): DuongLuot {
  if (!d.matMang) return 'mayChu';
  if (!d.choPhepChay || !d.tuDungKhiMatMang) return 'daTat';
  if (!d.coModel) return 'chuaCai';
  return 'cucBo';
}

export type NenGiaoDien =
  /** Bình thường — không dải nào. */
  | 'mayChu'
  /** Đang (hoặc sẽ) chạy trên máy: dải "🔌 Ngoại tuyến", đổi màu nhấn. */
  | 'ngoaiTuyen'
  /** Mất mạng mà chưa có model: dải đỏ + nút mở trang cài. */
  | 'matMangChuaCai'
  /** Mất mạng, có model, nhưng công tắc tắt: dải nói rõ chỗ bật. */
  | 'matMangDaTat';

export interface DieuKienGiaoDien {
  online: boolean;
  /** Có lượt đang chạy trong tab này. */
  dangChay: boolean;
  /** Lượt đang chạy (hoặc lượt vừa xong) là lượt trên máy. */
  luotLaCucBo: boolean;
  /** Người dùng đã bấm "Quay về AI máy chủ" sau lần có mạng lại gần nhất. */
  daQuayVe: boolean;
  coModel: boolean;
  choPhep: boolean;
}

export interface TrangThaiGiaoDien {
  nen: NenGiaoDien;
  /**
   * Hiện câu "Đã có mạng — quay về AI máy chủ?".
   * `sauLuot` = lượt trên máy còn đang chạy ⇒ KHÔNG cắt ngang, quay về khi xong.
   */
  hoiQuayVe: null | { sauLuot: boolean };
}

export function giaoDienAi(d: DieuKienGiaoDien): TrangThaiGiaoDien {
  if (!d.online) {
    if (!d.choPhep) return { nen: 'matMangDaTat', hoiQuayVe: null };
    if (!d.coModel) return { nen: 'matMangChuaCai', hoiQuayVe: null };
    return { nen: 'ngoaiTuyen', hoiQuayVe: null };
  }
  /* Có mạng lại giữa một lượt trên máy ⇒ giữ màu ngoại tuyến tới hết lượt
     (lượt ĐÚNG là đang chạy trên máy — đổi màu giữa chừng là nói dối). */
  if (d.dangChay && d.luotLaCucBo) return { nen: 'ngoaiTuyen', hoiQuayVe: { sauLuot: true } };
  if (d.luotLaCucBo && !d.daQuayVe) return { nen: 'ngoaiTuyen', hoiQuayVe: { sauLuot: false } };
  return { nen: 'mayChu', hoiQuayVe: null };
}
