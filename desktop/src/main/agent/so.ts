/**
 * SỔ CỦA MỘT CUỘC HỘI THOẠI.
 *
 * Từ khi app mở được nhiều cuộc cùng lúc, mọi trạng thái "đang làm dở" phải
 * thuộc về MỘT cuộc chứ không thuộc về app. Trước đó chúng là biến module —
 * đúng khi chỉ có một cuộc, và sai câm lặng ngay khi có hai:
 *
 *   • `nhatKyHoanTac` chung ⇒ bấm Hoàn tác ở tab A lùi luôn file tab B vừa sửa.
 *   • `quyenDaCap` chung ⇒ duyệt `npm test` ở tab A thì tab B cũng tự chạy, mà
 *     người dùng chưa từng nhìn thấy nó.
 *
 * Cả hai đều không báo lỗi. Chúng chỉ làm sai thứ người dùng tin là đúng.
 */
export interface SoCuoc {
  /** Nội dung file TRƯỚC lần cuộc này chạm vào đầu tiên. `null` = file chưa từng tồn tại. */
  nhatKyHoanTac: Map<string, string | null>;
  /** Khoá đã được "cho phép cả …" trong cuộc này. Không bao giờ ghi xuống đĩa. */
  quyenDaCap: Set<string>;
}

export function taoSoCuoc(): SoCuoc {
  return { nhatKyHoanTac: new Map(), quyenDaCap: new Set() };
}
