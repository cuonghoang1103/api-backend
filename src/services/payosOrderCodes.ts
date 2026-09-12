/**
 * Dải mã đơn gửi sang PayOS.
 * ─────────────────────────────────────────────────────────────────────────
 * PayOS bắt `orderCode` là MỘT số nguyên dương, duy nhất trên toàn merchant.
 * Bốn loại đơn của web đều có `id` tự tăng từ 1 nên chúng sẽ đụng nhau nếu
 * gửi thẳng. Cách giải: mỗi loại chiếm một dải riêng, rời nhau.
 *
 *   khoá học : 1           … 999.999.999   (id trần, dải có sẵn từ trước)
 *   shop     : 2.000.000.000 …             (đã chạy production từ 07/2026)
 *   nạp ví   : 3.000.000.000 …             (thêm 13/09/2026)
 *   gói Pro  : 4.000.000.000 …             (thêm 13/09/2026)
 *
 * ⚠️ KHÔNG đổi các hằng số này. Chúng đã nằm trong dữ liệu PayOS của những
 * đơn cũ; đổi dải là webhook tra về sai loại đơn và giao nhầm hàng.
 *
 * ⚠️ Mỗi dải rộng 1 tỉ. Web sẽ không chạm tới trần đó, nhưng `phanLoai()`
 * vẫn chặn bằng cách so từ dải CAO xuống THẤP — thêm dải mới thì phải thêm
 * nhánh vào đầu, không phải cuối.
 */

export const PAYOS_SHOP_OFFSET = 2_000_000_000;
export const PAYOS_TOPUP_OFFSET = 3_000_000_000;
export const PAYOS_PRO_OFFSET = 4_000_000_000;

export type LoaiDon = 'COURSE' | 'SHOP' | 'TOPUP' | 'PRO';

/** Tách một mã PayOS ngược lại thành (loại đơn, id trong bảng của nó). */
export function phanLoai(payosCode: number): { loai: LoaiDon; id: number } {
  if (payosCode >= PAYOS_PRO_OFFSET) return { loai: 'PRO', id: payosCode - PAYOS_PRO_OFFSET };
  if (payosCode >= PAYOS_TOPUP_OFFSET) return { loai: 'TOPUP', id: payosCode - PAYOS_TOPUP_OFFSET };
  if (payosCode >= PAYOS_SHOP_OFFSET) return { loai: 'SHOP', id: payosCode - PAYOS_SHOP_OFFSET };
  return { loai: 'COURSE', id: payosCode };
}

/** Chiều ngược lại: id trong bảng → mã gửi cho PayOS. */
export function maPayos(loai: LoaiDon, id: number): number {
  switch (loai) {
    case 'PRO': return PAYOS_PRO_OFFSET + id;
    case 'TOPUP': return PAYOS_TOPUP_OFFSET + id;
    case 'SHOP': return PAYOS_SHOP_OFFSET + id;
    case 'COURSE': return id;
  }
}
