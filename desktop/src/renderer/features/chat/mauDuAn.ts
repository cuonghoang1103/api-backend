/**
 * MÀU CỦA MỘT DỰ ÁN — suy từ TÊN, không lưu ở đâu cả.
 *
 * Thanh bên nhóm các việc theo dự án, và trước bản này mọi tiêu đề nhóm đều
 * cùng một màu xám nhạt. Với chục dự án thì mắt phải ĐỌC từng chữ mới biết
 * mình đang ở đâu — trong khi thứ người ta thật sự làm là liếc.
 *
 * ─── Vì sao suy từ tên, không lưu ───
 * Lưu màu thì phải có chỗ lưu, phải đồng bộ giữa hai thanh bên, phải dọn khi
 * dự án biến mất, và phải quyết xem đổi tên thư mục có giữ màu không. Suy từ
 * tên thì màu ổn định qua mọi phiên, mọi máy, không có trạng thái nào để trôi.
 * Cái giá: đổi tên dự án là đổi màu — chấp nhận được, vì đổi tên vốn đã là
 * "cái này giờ là thứ khác".
 *
 * ⚠️ Băm phải ổn định GIỮA CÁC PHIÊN. `String.prototype.hashCode` không có
 * trong JS, và mọi cách "nhanh" kiểu cộng mã ký tự đều đụng độ nặng với tên
 * gần giống nhau (`api-backend` / `api-frontend`). Dùng FNV-1a: ngắn, không
 * phụ thuộc thư viện, và tán đều với chuỗi ngắn.
 */

/** Số màu trong bảng. Khớp `--ct-duan-N` ở `styles.css`. */
export const SO_MAU = 8;

export function mauDuAn(ten: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < ten.length; i += 1) {
    h ^= ten.charCodeAt(i);
    // FNV-1a: nhân với 16777619, viết bằng phép dịch để không tràn 32 bit.
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h % SO_MAU;
}
