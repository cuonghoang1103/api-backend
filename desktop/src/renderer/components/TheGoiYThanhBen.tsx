/**
 * Thẻ gợi ý tên trang khi thanh bên THU GỌN (08/11/2026).
 *
 * Trước đây là `title` gốc của hệ điều hành: hiện sau ~1 giây, nằm LỆCH XUỐNG DƯỚI con trỏ
 * (đè lên mục kế tiếp), chữ nhỏ theo kiểu của HĐH và khác nhau giữa macOS / Windows / Linux.
 * Người dùng rê dọc thanh bên để tìm trang thì gần như không kịp đọc.
 *
 * Thẻ này:
 * - hiện sau 70 ms (đủ để lướt qua không nhấp nháy), và khi đã có một thẻ đang hiện thì chuyển
 *   sang mục khác NGAY, không chờ lại — đúng kiểu thanh công cụ của VS Code / Figma;
 * - nằm bên PHẢI biểu tượng, giữa theo chiều dọc, có mũi nhọn chỉ vào mục;
 * - chữ to, đậm, kèm một dòng mô tả trang để làm gì (`thanhBenGoiY.ts`) và tên nhóm;
 * - màu theo token `--ct-*` nên đúng ở cả chủ đề sáng lẫn tối;
 * - bàn phím: mục đang được focus (mũi tên lên/xuống) cũng hiện thẻ.
 *
 * Gắn MỘT thẻ cho cả thanh bên bằng uỷ quyền sự kiện (`data-goi-y` trên từng nút), không phải
 * mỗi mục một tooltip: 30 mục × một portal là thừa, và một thẻ duy nhất thì chuyển mục mượt.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './theGoiYThanhBen.css';

type GoiY = { ten: string; moTa: string; nhom: string; giua: number; trai: number };

const TRE_HIEN_MS = 70;
/** Vừa tắt chưa tới mốc này mà rê sang mục khác ⇒ hiện ngay, không chờ. */
const CON_AM_MS = 350;

function docGoiY(el: Element | null): GoiY | null {
  const nut = el?.closest<HTMLElement>('[data-goi-y]');
  if (!nut) return null;
  const r = nut.getBoundingClientRect();
  return {
    ten: nut.dataset.goiY ?? '',
    moTa: nut.dataset.goiYMoTa ?? '',
    nhom: nut.dataset.goiYNhom ?? '',
    giua: r.top + r.height / 2,
    trai: r.right + 10,
  };
}

/**
 * Trả về các hàm sự kiện để gắn lên phần tử BAO thanh bên. `bat = false` (thanh bên đang mở
 * rộng, đã thấy chữ) thì không làm gì.
 */
export function useGoiYThanhBen(bat: boolean) {
  const [goiY, setGoiY] = useState<GoiY | null>(null);
  const hen = useRef<number | null>(null);
  const tatLuc = useRef(0);
  const dangHien = useRef(false);

  const huyHen = () => {
    if (hen.current != null) window.clearTimeout(hen.current);
    hen.current = null;
  };

  const an = useCallback(() => {
    huyHen();
    if (dangHien.current) tatLuc.current = Date.now();
    dangHien.current = false;
    setGoiY(null);
  }, []);

  const hienCho = useCallback((el: Element | null) => {
    if (!bat) return;
    const g = docGoiY(el);
    if (!g) { an(); return; }
    huyHen();
    const ngay = dangHien.current || Date.now() - tatLuc.current < CON_AM_MS;
    const dat = () => { dangHien.current = true; setGoiY(g); };
    if (ngay) dat();
    else hen.current = window.setTimeout(dat, TRE_HIEN_MS);
  }, [bat, an]);

  // Thanh bên mở rộng / cuộn / cửa sổ đổi cỡ ⇒ toạ độ cũ sai, tắt đi.
  useEffect(() => {
    if (!bat) an();
    const tat = () => an();
    window.addEventListener('resize', tat);
    window.addEventListener('blur', tat);
    return () => {
      window.removeEventListener('resize', tat);
      window.removeEventListener('blur', tat);
      huyHen();
    };
  }, [bat, an]);

  return {
    goiY,
    suKien: {
      onPointerOver: (e: React.PointerEvent) => hienCho(e.target as Element),
      onPointerLeave: an,
      onFocus: (e: React.FocusEvent) => {
        // Chỉ khi focus bằng BÀN PHÍM — bấm chuột cũng focus nút, mà lúc đó đã có thẻ theo chuột.
        if ((e.target as HTMLElement).matches(':focus-visible')) hienCho(e.target as Element);
      },
      onBlur: an,
      onScroll: an,
      onClick: an,
    },
  };
}

export function TheGoiYThanhBen({ goiY }: { goiY: GoiY | null }) {
  if (!goiY) return null;
  // Giữ trong khung cửa sổ: mục sát đáy không để thẻ bị cắt.
  const giua = Math.min(Math.max(goiY.giua, 36), window.innerHeight - 36);
  return createPortal(
    <div
      className="ct-tbgy"
      role="tooltip"
      style={{ top: giua, left: goiY.trai }}
      // key theo tên: đổi mục là chạy lại hiệu ứng trượt nhẹ, thấy rõ thẻ đã đổi.
      key={goiY.ten}
    >
      <span className="ct-tbgy-mui" aria-hidden />
      <div className="ct-tbgy-dau">
        <span className="ct-tbgy-ten">{goiY.ten}</span>
        {goiY.nhom && <span className="ct-tbgy-nhom">{goiY.nhom}</span>}
      </div>
      {goiY.moTa && <div className="ct-tbgy-mota">{goiY.moTa}</div>}
    </div>,
    document.body,
  );
}
