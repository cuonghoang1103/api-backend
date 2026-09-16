/**
 * ============================================================
 * ĐẾM CÚ BẤM LIÊN TIẾP — BỀN VỚI VIỆC CỬA SỔ TRƯỢT
 * ============================================================
 *
 * Con robot nổi có bốn cử chỉ chồng lên nhau trên cùng một chỗ bấm:
 * 1 lần mở khung chat · 2 lần mở AI Chat · 3 lần bật chế độ kéo · 4 lần ẩn.
 * Phân biệt chúng chỉ bằng SỐ CÚ BẤM, nên con số ấy phải luôn đúng.
 *
 * ─── VÌ SAO KHÔNG DÙNG MỖI `e.detail` ───
 *
 * Người dùng Windows báo 16/09/2026: *"ấn 3 cái vào robot để mở chỉnh sửa thì
 * được, ấn 3 cái nữa để tắt thì không tắt được"*.
 *
 * Một khi chế độ kéo đã bật, mỗi `pointerdown` bắt đầu kéo và CỬA SỔ chạy theo
 * chuột (`setBounds` ở main). Con trỏ đứng yên trên màn hình, nhưng cửa sổ
 * trượt dưới nó — nên toạ độ TRONG CỬA SỔ của cú bấm kế khác cú trước.
 * Chromium đếm nhấp liên tiếp theo cả khoảng cách lẫn thời gian, nên lệch quá
 * ngưỡng là `e.detail` tụt về 1 và không bao giờ bò lên 3 nữa.
 *
 * Nó giải thích đúng cái bất đối xứng trong báo cáo: chiều BẬT chưa kéo được
 * nên cửa sổ đứng yên và `e.detail` đếm đúng; chiều TẮT thì đang kéo được.
 *
 * ─── VÌ SAO KHÔNG BỎ HẲN `e.detail` MÀ TỰ ĐẾM ───
 *
 * Ngưỡng nhấp đúp là thứ NGƯỜI DÙNG CHỈNH ĐƯỢC trong cài đặt hệ điều hành, và
 * có người để rất chậm. Tự đếm bằng một hằng số chép tay thì với máy đó, ba cú
 * bấm thật sẽ bị cắt thành ba cú rời. `e.detail` biết con số thật ấy.
 *
 * Nên: đếm CẢ HAI cách, lấy số lớn hơn. Mỗi cách đỡ đúng cái chỗ cách kia hụt.
 */

/** Chỉ cần đúng ba trường này — nhận cả `MouseEvent` thật lẫn vật thể trong kiểm thử. */
export interface CuBam {
  detail: number;
  screenX: number;
  screenY: number;
}

export interface BoDem {
  /** Số cú bấm liên tiếp tính tới cú này (>= 1). */
  dem(e: CuBam, nay?: number): number;
  /**
   * KHÉP chuỗi lại — gọi ngay khi một cử chỉ đã nổ.
   *
   * ⚠️ Thiếu bước này thì cửa sổ thời gian rộng (600ms > ngưỡng nhấp đúp) sẽ
   * gộp nhầm HAI cử chỉ rời nhau: người dùng bấm một cái (khung chat mở ra sau
   * 260ms), bấm thêm một cái nữa 200ms sau để đóng lại — và bộ đếm nói "2", tức
   * là nhảy sang cửa sổ chính. Khép lại xong thì cú sau luôn mở đầu chuỗi mới.
   */
  khepLai(): void;
}

export function taoBoDem(cuaSoMs: number, lechPx: number): BoDem {
  let n = 0;
  let luc = 0;
  let x = 0;
  let y = 0;

  return {
    dem(e, nay = Date.now()) {
      const lienTiep = n > 0
        && nay - luc <= cuaSoMs
        /* Toạ độ MÀN HÌNH, không phải toạ độ trong cửa sổ: đây chính là thứ
           duy nhất không đổi khi cửa sổ trượt dưới con trỏ đứng yên. */
        && Math.abs(e.screenX - x) <= lechPx
        && Math.abs(e.screenY - y) <= lechPx;
      n = lienTiep ? n + 1 : 1;
      luc = nay;
      x = e.screenX;
      y = e.screenY;
      /* `|| 1` vì `detail` là 0 trên cú bấm sinh ra từ bàn phím (Enter/Space). */
      return Math.max(e.detail || 1, n);
    },
    khepLai() { n = 0; },
  };
}
