/**
 * ============================================================
 * BỘ CHỌN CHẾ ĐỘ QUYỀN — thay hai công tắc rời
 * ============================================================
 *
 * Trước bản này có hai nút độc lập: *Cho sửa* và *Chạy lệnh*. Chúng nói được
 * agent ĐƯỢC LÀM GÌ, nhưng không nói được nó có phải HỎI không — mà đó mới là
 * thứ người dùng thật sự muốn chỉnh sau vài chục lượt bấm "Đồng ý" liên tiếp.
 *
 * Bốn chế độ, gộp cả hai câu hỏi vào một lựa chọn. Tách ra thì có những tổ hợp
 * vô nghĩa ("không được sửa file, nhưng sửa khỏi hỏi") mà giao diện vẫn cho
 * bấm, và người dùng phải tự suy ra cái nào thắng.
 *
 * ⛔ KHÔNG có "bỏ qua tất cả" như Claude Code. Shell đọc được `.env` — chính
 * chân màn hình của app đang nói câu đó — nên một chế độ tắt sạch chốt chặn là
 * giao khoá của người dùng cho model quyết định. Chế độ mạnh nhất ở đây vẫn
 * dừng lại ở lệnh bị xếp `cankiem`/`nguyhiem`.
 *
 * Menu vẽ bằng portal, cùng lý do đã ghi ở `MenuChamDoc`: thanh công cụ nằm
 * trong khung có `overflow: hidden`.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMoRieng } from '../../components/moRieng';
import { createPortal } from 'react-dom';
import { ChevronDown, FilePen, ListChecks, ShieldCheck, Terminal } from 'lucide-react';

import type { CheDoQuyen } from '../../../shared/ipc';

interface MoTaCheDo {
  ma: CheDoQuyen;
  nhan: string;
  mo: string;
  icon: React.ReactNode;
  /** Mức "mở" để tô màu — càng cao càng ít chốt chặn. */
  bac: 0 | 1 | 2 | 3;
}

export const CAC_CHE_DO: readonly MoTaCheDo[] = [
  {
    ma: 'keHoach',
    nhan: 'Kế hoạch',
    mo: 'Chỉ đọc. Agent trình bày cách làm, không đụng file, không chạy lệnh.',
    icon: <ListChecks size={13} aria-hidden />,
    bac: 0,
  },
  {
    ma: 'hoi',
    nhan: 'Hỏi từng việc',
    mo: 'Sửa file và chạy lệnh được, nhưng mỗi việc đều hiện ra để bạn duyệt.',
    icon: <ShieldCheck size={13} aria-hidden />,
    bac: 1,
  },
  {
    ma: 'tuSua',
    nhan: 'Tự nhận sửa file',
    mo: 'Sửa file khỏi hỏi. Lệnh thì vẫn hỏi từng cái.',
    icon: <FilePen size={13} aria-hidden />,
    bac: 2,
  },
  {
    ma: 'tuSuaVaLenh',
    nhan: 'Tự nhận cả lệnh an toàn',
    mo: 'Sửa file và lệnh thường khỏi hỏi. Lệnh nguy hiểm VẪN hỏi.',
    icon: <Terminal size={13} aria-hidden />,
    bac: 3,
  },
];

const CAO_MUC = 54;
const RONG = 268;

export function ChonCheDo({
  cheDo, khoa, onChon,
}: {
  cheDo: CheDoQuyen;
  khoa: boolean;
  onChon: (c: CheDoQuyen) => void;
}) {
  /* `tuDong: false` — menu này vẽ bằng portal ở toạ độ cố định, tức là nằm
     NGOÀI phần tử bọc. Để hook tự kiểm `contains` thì bấm vào chính menu cũng
     bị tính là "bấm ra ngoài". Nó giữ cách đóng riêng (pointerdown/scroll/
     resize) và chỉ mượn sổ chung để không chồng lên tấm khác. */
  const { mo, bat, dong: dongTam } = useMoRieng('agent:quyen', false);
  const [viTri, datViTri] = useState<{ trai: number; tren: number } | null>(null);
  const nutRef = useRef<HTMLButtonElement>(null);
  const hienTai = CAC_CHE_DO.find((c) => c.ma === cheDo) ?? CAC_CHE_DO[0]!;

  useLayoutEffect(() => {
    if (!mo) { datViTri(null); return; }
    const r = nutRef.current?.getBoundingClientRect();
    if (!r) return;
    const cao = CAC_CHE_DO.length * CAO_MUC + 14;
    // Thanh công cụ nằm ở ĐẦU trang nên menu thường thả xuống; chỉ lật lên khi
    // thật sự không đủ chỗ.
    const tren = r.bottom + cao > window.innerHeight - 8 ? Math.max(8, r.top - cao) : r.bottom + 4;
    datViTri({ trai: Math.min(Math.max(8, r.left), window.innerWidth - RONG - 8), tren });
  }, [mo]);

  useEffect(() => {
    if (!mo) return;
    const dong = (): void => dongTam();
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') dongTam(); };
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
        className="ct-chedo-nut"
        data-bac={hienTai.bac}
        data-nut="chedoquyen"
        disabled={khoa}
        aria-haspopup="menu"
        aria-expanded={mo}
        title={`${hienTai.nhan} — ${hienTai.mo}${khoa ? '\n(đang chạy dở, dừng lại mới đổi được)' : ''}`}
        onClick={(e) => { e.stopPropagation(); bat(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {hienTai.icon}
        {hienTai.nhan}
        <ChevronDown size={12} aria-hidden />
      </button>

      {mo && viTri && createPortal(
        <div
          className="ct-chedo-menu"
          role="menu"
          style={{ left: viTri.trai, top: viTri.tren, width: RONG }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {CAC_CHE_DO.map((c) => (
            <button
              key={c.ma}
              type="button"
              role="menuitemradio"
              aria-checked={c.ma === cheDo}
              className="ct-chedo-muc"
              data-chon={c.ma === cheDo}
              data-bac={c.bac}
              onClick={() => { dongTam(); if (c.ma !== cheDo) onChon(c.ma); }}
            >
              <span className="ct-chedo-muc-dau">
                {c.icon}
                <strong>{c.nhan}</strong>
              </span>
              <span className="ct-chedo-muc-mo">{c.mo}</span>
            </button>
          ))}
          {/* Nói thẳng cái ranh giới không chế độ nào vượt được. Người dùng
              chọn chế độ mạnh nhất cần biết nó DỪNG ở đâu, chứ không phải tự
              đoán rồi ngạc nhiên khi thấy một thẻ duyệt hiện ra. */}
          <p className="ct-chedo-chan">
            Lệnh bị xếp <strong>nguy hiểm</strong> luôn hỏi, ở mọi chế độ.
          </p>
        </div>,
        document.body,
      )}
    </>
  );
}
