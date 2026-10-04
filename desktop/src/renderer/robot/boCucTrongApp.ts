/**
 * ============================================================
 * BỐ CỤC CON ROBOT TRONG APP — khung chat / bong bóng đặt quanh robot
 * ============================================================
 *
 * Con nổi có main tính cửa sổ quanh robot (`tinhBoCuc`). Con trong app nằm
 * trong một lớp phủ trọn cửa sổ app, nên phần "cửa sổ" ở đây chỉ là chọn:
 *   • nội dung mở về phía TRÊN hay DƯỚI robot — phía nào đủ chỗ (ưu tiên trên);
 *   • canh mép PHẢI hay TRÁI của robot — theo nửa màn hình robot đang đứng.
 * Rồi trả vùng `top/bottom/left/right` cho `.rb-nd` — CÙNG lớp và cùng luật
 * flex với con nổi (`data-phia`, `data-ngang`), nên bong bóng/khung trông y hệt.
 *
 * ⚠️ Nội dung KHÔNG co theo cỡ robot. Cỡ robot chỉ dời chỗ nội dung bắt đầu.
 */

/** Hộp robot: cách mép phải / mép dưới vùng chứa, và cỡ px hiện tại. */
export interface HopApp { phai: number; duoi: number; rong: number; cao: number }
/** Vùng chứa (cửa sổ app trừ thanh trạng thái). */
export interface VungApp { rong: number; cao: number }

export interface BoCucApp {
  phia: 'tren' | 'duoi';
  ngang: 'phai' | 'trai';
  kieu: { top: number; bottom: number; left: number; right: number; '--rb-duoi': string };
}

/** Khe giữa robot và nội dung; lề tối thiểu tới mép cửa sổ. */
export const KHE_APP = 8;
export const LE_APP = 8;
/** `.rb-nd` có đệm ngang 8px (CSS) — trừ ra để mép nội dung khớp mép robot. */
const DEM_ND = 8;

/** Chiều cao nội dung muốn có — để chọn phía. Khớp CSS của từng loại. */
export const CAO_CAN = { chat: 520, bang: 220, giaSu: 560, bong: 140, hoi: 130 } as const;

export function boCucNoiDungApp(h: HopApp, v: VungApp, caoCan: number): BoCucApp {
  const choTren = v.cao - h.duoi - h.cao - KHE_APP - LE_APP;
  const choDuoi = h.duoi - KHE_APP - LE_APP;
  const phia: BoCucApp['phia'] = choTren >= caoCan || choTren >= choDuoi ? 'tren' : 'duoi';

  const trai = v.rong - h.phai - h.rong;
  const ngang: BoCucApp['ngang'] = trai + h.rong / 2 >= v.rong / 2 ? 'phai' : 'trai';

  const doc = phia === 'tren'
    ? { top: LE_APP, bottom: h.duoi + h.cao + KHE_APP }
    : { top: v.cao - h.duoi + KHE_APP, bottom: LE_APP };
  const ngangKieu = ngang === 'phai'
    ? { right: Math.max(0, h.phai - DEM_ND), left: 0 }
    : { left: Math.max(0, trai - DEM_ND), right: 0 };

  return {
    phia,
    ngang,
    kieu: {
      ...doc,
      ...ngangKieu,
      /* Đuôi bong bóng chỉ đúng vào ĐẦU robot ở mọi cỡ. */
      '--rb-duoi': `${Math.max(10, Math.round(h.rong / 2 - 5))}px`,
    },
  };
}
