/**
 * ============================================================
 * HÀNH VI CHUNG CỦA CON ROBOT — một bản, hai chỗ đứng
 * ============================================================
 *
 * Người dùng 04/10/2026: *"robot icon trong app CuongThai và robot icon khi ẩn
 * app ra ngoài là MỘT con robot (đừng tách), phải chạy mượt như nhau"*.
 *
 * Trước bản này con robot trong app (`OdinDock`) tự đếm cú bấm bằng một bộ
 * đếm riêng, và bộ đếm ấy có hai lỗi mà con nổi không có:
 *   • cú bấm THỨ NHẤT đã hẹn nhảy sang /chat sau 260ms — nên ba cú bấm luôn
 *     kéo người dùng ra khỏi trang trước khi kịp vào chế độ chỉnh;
 *   • chế độ chỉnh gọi `setPointerCapture` lên CẢ dock ⇒ mọi `click` sau đó
 *     rơi vào dock chứ không vào nút −/+ hay vào con robot ⇒ không đổi được
 *     cỡ, và ba cú bấm để THOÁT cũng không bao giờ tới.
 * Nay cả hai con dùng ĐÚNG các hook dưới đây.
 */
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { taoBoDem, type CuBam } from '../features/odin/demCuBam';
import { BUOC_CO, chuanPhanTram } from '../../shared/coRobot';

/** Hoãn mọi cử chỉ (trừ cú thứ tư) chừng này để biết người dùng còn bấm tiếp không. */
export const TRE_NHAP_DUP_MS = 260;
/** Gộp các cú bấm liên tiếp khi TỰ ĐẾM (e.detail một mình không đủ — xem `demCuBam`). */
export const CUA_SO_DEM_MS = 600;
export const LECH_CHO_PHEP_PX = 12;
/** Bấm xuống rồi đi quá ngần này mới tính là KÉO (tay ai cũng rung 1–2px). */
export const NGUONG_KEO_PX = 4;
/** Không ai đụng tới bao lâu thì robot ngủ gật — cùng một số cho cả hai con. */
export const NGU_SAU_MS = 3 * 60_000;

/** Bốn cử chỉ: 1 khung chat · 2 AI Chat · 3 chế độ chỉnh · 4 ẩn. */
export interface CuChiRobot {
  mot: () => void;
  hai: () => void;
  ba: () => void;
  bon: () => void;
}

/**
 * Đếm cú bấm và bắn ĐÚNG MỘT cử chỉ.
 *
 * `vuaKeoRef`: cú `click` đi kèm cú thả tay sau khi kéo KHÔNG phải một cú bấm.
 * `khiBam`: chạy ở MỌI cú bấm (đánh thức robot…).
 */
export function useCuChi(
  cuChi: CuChiRobot,
  opts: { vuaKeoRef: RefObject<boolean>; khiBam?: () => void },
): { bam: (e: CuBam) => void; huyHen: () => void } {
  const cuChiRef = useRef(cuChi);
  cuChiRef.current = cuChi;
  const khiBamRef = useRef(opts.khiBam);
  khiBamRef.current = opts.khiBam;
  const { vuaKeoRef } = opts;
  const demRef = useRef(taoBoDem(CUA_SO_DEM_MS, LECH_CHO_PHEP_PX));
  const henRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const huyHen = useCallback(() => {
    if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
  }, []);
  useEffect(() => huyHen, [huyHen]);

  const bam = useCallback((e: CuBam) => {
    if (vuaKeoRef.current) return;
    const n = demRef.current.dem(e);
    huyHen();
    khiBamRef.current?.();
    if (n >= 4) {
      demRef.current.khepLai();
      cuChiRef.current.bon();
      return;
    }
    henRef.current = setTimeout(() => {
      henRef.current = null;
      demRef.current.khepLai();
      if (n === 3) cuChiRef.current.ba();
      else if (n === 2) cuChiRef.current.hai();
      else cuChiRef.current.mot();
    }, TRE_NHAP_DUP_MS);
  }, [huyHen, vuaKeoRef]);

  return { bam, huyHen };
}

/** Phím mũi tên ⇒ cỡ mới (đã kẹp 20–100, bước 5). Phím khác ⇒ `null`. */
export function phimDoiCo(phim: string, phanTram: number): number | null {
  if (phim === 'ArrowUp') return chuanPhanTram(phanTram + BUOC_CO);
  if (phim === 'ArrowDown') return chuanPhanTram(phanTram - BUOC_CO);
  return null;
}

/** Số % hiện thoáng trên robot bao lâu sau mỗi lần đổi cỡ bằng phím. */
export const HIEN_SO_MS = 1400;

/**
 * Chế độ CHỈNH: ↑ = +5%, ↓ = −5% (kẹp 20–100), Esc = xong.
 *
 * Chỉ nhận phím khi tiêu điểm đang ở TRONG con robot (`gocRef`) hoặc không ở
 * đâu cả (`body`) — đang gõ trong ô soạn tin của app mà mũi tên lại đổi cỡ
 * robot là cướp phím. Nghe ở pha BẮT để thanh trượt trong bảng chỉnh không
 * tự nhích thêm một bước nữa (nó cũng hiểu mũi tên).
 *
 * Trả `true` trong `HIEN_SO_MS` sau mỗi lần đổi — để robot hiện số % thoáng qua.
 */
export function usePhimChinh(o: {
  bat: boolean;
  phanTram: number;
  doiCo: (pt: number) => void;
  thoat: () => void;
  gocRef: RefObject<HTMLElement | null>;
}): boolean {
  const { bat, gocRef } = o;
  const ptRef = useRef(o.phanTram);
  ptRef.current = o.phanTram;
  const doiCoRef = useRef(o.doiCo);
  doiCoRef.current = o.doiCo;
  const thoatRef = useRef(o.thoat);
  thoatRef.current = o.thoat;
  const [hienSo, datHienSo] = useState(false);
  const henRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!bat) { datHienSo(false); return; }
    const nghe = (e: KeyboardEvent): void => {
      const dangO = document.activeElement;
      const goc = gocRef.current;
      if (dangO && dangO !== document.body && !(goc && goc.contains(dangO))) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        thoatRef.current();
        return;
      }
      const moi = phimDoiCo(e.key, ptRef.current);
      if (moi === null) return;
      e.preventDefault();
      e.stopPropagation();
      if (moi !== ptRef.current) {
        /* Ghi NGAY vào ref: giữ phím thì `keydown` lặp nhanh hơn React dựng
           lại, đọc số cũ là hai lần nhấn chỉ được một bước. */
        ptRef.current = moi;
        doiCoRef.current(moi);
      }
      datHienSo(true);
      if (henRef.current) clearTimeout(henRef.current);
      henRef.current = setTimeout(() => datHienSo(false), HIEN_SO_MS);
    };
    window.addEventListener('keydown', nghe, true);
    return () => {
      window.removeEventListener('keydown', nghe, true);
      if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
    };
  }, [bat, gocRef]);

  return hienSo;
}
