/**
 * ============================================================
 * MENU ⋮ — hiện khi rê chuột vào một hàng
 * ============================================================
 *
 * Dùng chung cho thanh bên AI Code và thanh bên AI Chat: hai danh sách khác
 * nguồn dữ liệu nhưng cùng đúng một bộ thao tác (ghim · đổi tên · tách nhánh ·
 * lưu trữ · xoá), và hai bản sao của cùng một menu thì sẽ có ngày lệch nhau.
 *
 * ⚠️ VẼ BẰNG PORTAL RA `document.body`, KHÔNG lồng trong hàng.
 *
 * Danh sách nằm trong `.ct-tb-ds` (`overflow-y: auto`) và cả cột nằm trong
 * `.ct-ai-than` (`overflow: hidden`). Một menu con nằm trong hàng sẽ bị CẮT ở
 * mép khung cuộn — hàng cuối danh sách thì mất gần hết menu, mà không có lỗi
 * nào để thấy: DOM có đủ, chỉ là không nhìn thấy. Vẽ ra `body` với toạ độ
 * `fixed` thì không khung cuộn nào cắt được nó.
 *
 * Đóng menu khi: bấm ra ngoài · Escape · CUỘN (menu neo theo toạ độ tuyệt
 * đối, cuộn một cái là nó lơ lửng sai chỗ) · đổi cỡ cửa sổ.
 */
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useMoRieng } from './../../components/moRieng';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

export interface MucMenu {
  nhan: string;
  icon?: ReactNode;
  onChon: () => void;
  /** Xoá — vẽ đỏ và tách xuống dưới một vạch. */
  nguyHiem?: boolean;
}

/** Bề cao ước lượng mỗi mục, dùng để quyết định lật lên hay xuống. */
const CAO_MUC = 30;
const RONG = 176;

export function MenuChamDoc({ muc, nhan }: { muc: MucMenu[]; nhan?: string }) {
  /* `useId()` vì component này dựng LẠI trên từng dòng danh sách. Dùng một
     chuỗi cố định thì mọi menu ⋮ chung một định danh và bấm một cái là bung
     hết. `tuDong: false` vì menu vẽ bằng portal — xem ghi chú ở ChonCheDo. */
  const { mo, bat, dong: dongTam } = useMoRieng(`menucham:${useId()}`, false);
  const [oViTri, datViTri] = useState<{ trai: number; tren: number } | null>(null);
  const nutRef = useRef<HTMLButtonElement>(null);

  /**
   * Đo NGAY TRƯỚC khi vẽ (`useLayoutEffect`), không phải trong `useEffect`.
   * Đo sau khi vẽ thì có đúng một khung hình menu nằm ở toạ độ (0,0) — nháy
   * một cái ở góc trên trái màn hình rồi mới nhảy về chỗ đúng.
   */
  useLayoutEffect(() => {
    if (!mo) { datViTri(null); return; }
    const r = nutRef.current?.getBoundingClientRect();
    if (!r) return;
    const cao = muc.length * CAO_MUC + 12;
    // Không đủ chỗ bên dưới ⇒ lật lên trên. Không đủ bên phải ⇒ kéo vào trong.
    const tren = r.bottom + cao > window.innerHeight - 8 ? Math.max(8, r.top - cao) : r.bottom + 4;
    const trai = Math.min(Math.max(8, r.right - RONG), window.innerWidth - RONG - 8);
    datViTri({ trai, tren });
  }, [mo, muc.length]);

  useEffect(() => {
    if (!mo) return;
    const dong = (): void => dongTam();
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') dongTam(); };
    // `capture: true` cho cuộn — sự kiện cuộn KHÔNG nổi bọt lên window từ một
    // khung cuộn con, nên nghe kiểu thường thì cuộn trong danh sách không đóng
    // menu và nó đứng ì một chỗ trong lúc hàng của nó trôi đi.
    window.addEventListener('pointerdown', dong);
    window.addEventListener('scroll', dong, true);
    window.addEventListener('resize', dong);
    window.addEventListener('keydown', phim);
    return () => {
      window.removeEventListener('pointerdown', dong);
      window.removeEventListener('scroll', dong, true);
      window.removeEventListener('resize', dong);
      window.removeEventListener('keydown', phim);
    };
  }, [mo, dongTam]);

  return (
    <>
      <button
        ref={nutRef}
        type="button"
        className="ct-cham-nut"
        data-mo={mo}
        title={nhan ?? 'Thao tác khác'}
        aria-label={nhan ?? 'Thao tác khác'}
        aria-haspopup="menu"
        aria-expanded={mo}
        onClick={(e) => {
          // Chặn nổi bọt: hàng bên dưới có `onClick` mở việc, và bấm ⋮ mà mở
          // luôn cả việc thì menu vừa hiện đã bị màn hình khác che.
          e.stopPropagation();
          bat();
        }}
        /* Cùng lý do: `pointerdown` của window là cái đóng menu, nên cú bấm mở
           menu phải không được chạm tới nó. */
        onPointerDown={(e) => e.stopPropagation()}
      >
        <MoreVertical size={13} aria-hidden />
      </button>

      {mo && oViTri && createPortal(
        <div
          className="ct-cham-menu"
          role="menu"
          style={{ left: oViTri.trai, top: oViTri.tren, width: RONG }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {muc.map((m, i) => (
            <button
              key={m.nhan}
              type="button"
              role="menuitem"
              className="ct-cham-muc"
              data-nguyhiem={m.nguyHiem === true}
              /* Vạch ngăn trước mục nguy hiểm ĐẦU TIÊN: Xoá phải nằm tách hẳn
                 khỏi những mục lành, không thì tay quen bấm nhanh trượt vào nó. */
              data-vach={m.nguyHiem === true && muc[i - 1]?.nguyHiem !== true}
              onClick={() => { dongTam(); m.onChon(); }}
            >
              {m.icon}
              <span>{m.nhan}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}
