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
 * ⚠️⚠️ "Bỏ qua tất cả" CÓ, nhưng sau MỘT CỬA XÁC NHẬN (09/09/2026, người dùng
 * yêu cầu và tự nêu điều kiện phải có cảnh báo đọc trước khi đồng ý).
 *
 * Lý do từng từ chối nó vẫn đúng nguyên vẹn: shell đọc được `.env` — chính
 * chân màn hình của app đang nói câu đó — nên chế độ này giao khoá của người
 * dùng cho model quyết định. Cái đổi không phải là rủi ro, mà là AI biết
 * người chịu rủi ro đã đọc đúng những gì mình mất.
 *
 * Vì thế cửa xác nhận là BẮT BUỘC và phải nói bằng việc CỤ THỂ (`rm -rf`,
 * `.env`, `npm publish`), không phải bằng chữ "nguy hiểm" chung chung — thứ
 * ai cũng bấm qua. Bốn chế độ kia đổi thẳng, không hỏi.
 *
 * Menu vẽ bằng portal, cùng lý do đã ghi ở `MenuChamDoc`: thanh công cụ nằm
 * trong khung có `overflow: hidden`.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMoRieng } from '../../components/moRieng';
import { createPortal } from 'react-dom';
import { ChevronDown, FilePen, ListChecks, ShieldAlert, ShieldCheck, Terminal } from 'lucide-react';

import type { CheDoQuyen } from '../../../shared/ipc';

interface MoTaCheDo {
  ma: CheDoQuyen;
  nhan: string;
  mo: string;
  icon: React.ReactNode;
  /** Mức "mở" để tô màu — càng cao càng ít chốt chặn. */
  bac: 0 | 1 | 2 | 3 | 4;
  /** Bật lên phải qua cửa xác nhận. */
  canXacNhan?: true;
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
  {
    ma: 'boQuaHet',
    nhan: 'Bỏ qua tất cả',
    mo: 'KHÔNG hỏi gì hết, kể cả lệnh nguy hiểm. Đọc cảnh báo trước khi bật.',
    icon: <ShieldAlert size={13} aria-hidden />,
    bac: 4,
    canXacNhan: true,
  },
];

const CAO_MUC = 54;
const RONG = 268;

export function ChonCheDo({
  cuocId, cheDo, khoa, onChon,
}: {
  /** Tab nào — xem `useMoRieng` bên dưới, khoá PHẢI riêng cho từng tab. */
  cuocId: string;
  cheDo: CheDoQuyen;
  khoa: boolean;
  onChon: (c: CheDoQuyen) => void;
}) {
  /* `tuDong: false` — menu này vẽ bằng portal ở toạ độ cố định, tức là nằm
     NGOÀI phần tử bọc. Để hook tự kiểm `contains` thì bấm vào chính menu cũng
     bị tính là "bấm ra ngoài". Nó giữ cách đóng riêng (pointerdown/scroll/
     resize) và chỉ mượn sổ chung để không chồng lên tấm khác. */
  /*
   * ⚠️⚠️ KHOÁ PHẢI KÈM `cuocId`. `useMoRieng` giữ MỘT id đang mở cho cả app và
   * mỗi hook tự so `dangMoId === id` — nên khoá chung `'agent:quyen'` nghĩa là
   * mở ở một tab thì MỌI tab đang gắn cùng mở. Đo thật 09/09/2026 với 6 tab:
   * 6 menu bung ra cùng lúc, chồng lên nhau ở 6 độ cao khác nhau.
   *
   * Ẩn tab KHÔNG giấu được chúng: menu vẽ bằng portal ra `document.body`, nên
   * nó nằm ngoài khung đã bị ẩn. Người dùng thấy "một" menu, bấm, và cú bấm
   * rơi vào menu của TAB KHÁC — tab đó đổi quyền, tab đang xem thì không.
   * Trên một nút điều khiển QUYỀN thì đó là hỏng đúng chỗ không được hỏng.
   *
   * Vẫn dùng sổ chung để không chồng lên tấm khác — chỉ khoá là riêng.
   */
  const { mo, bat, dong: dongTam } = useMoRieng(`agent:quyen:${cuocId}`, false);
  const [viTri, datViTri] = useState<{ trai: number; tren: number } | null>(null);
  /* Chế độ đang chờ người dùng đọc cảnh báo. `null` = không có cửa nào mở. */
  const [choXacNhan, datChoXacNhan] = useState<CheDoQuyen | null>(null);
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
              onClick={() => {
                dongTam();
                if (c.ma === cheDo) return;
                /* Cần xác nhận thì CHƯA đổi gì cả — chỉ mở cửa cảnh báo.
                   Đổi trước rồi hỏi sau nghĩa là có một khoảnh khắc agent đã
                   toàn quyền trong khi người dùng còn đang đọc. */
                if (c.canXacNhan) datChoXacNhan(c.ma);
                else onChon(c.ma);
              }}
            >
              <span className="ct-chedo-muc-dau">
                {c.icon}
                <strong>{c.nhan}</strong>
              </span>
              <span className="ct-chedo-muc-mo">{c.mo}</span>
            </button>
          ))}
          {/* Nói thẳng ranh giới. Câu cũ ("nguy hiểm luôn hỏi ở MỌI chế độ")
              đã sai từ khi có `boQuaHet` — một dòng chân trang nói sai về
              chính chốt an toàn thì tệ hơn là không có dòng nào. */}
          <p className="ct-chedo-chan">
            Lệnh bị xếp <strong>nguy hiểm</strong> vẫn hỏi ở mọi chế độ —
            trừ <strong>Bỏ qua tất cả</strong>.
          </p>
        </div>,
        document.body,
      )}

      {choXacNhan && createPortal(
        <CanhBaoBoQuaHet
          onHuy={() => datChoXacNhan(null)}
          onDongY={() => { const c = choXacNhan; datChoXacNhan(null); onChon(c); }}
        />,
        document.body,
      )}
    </>
  );
}

/**
 * Cửa cảnh báo trước khi bật "Bỏ qua tất cả".
 *
 * Ba điều làm nó không phải một hộp thoại lấy lệ:
 *  1. Nói bằng VIỆC CỤ THỂ — `rm -rf`, `.env`, `npm publish`. "Có thể nguy
 *     hiểm" là câu ai cũng bấm qua mà không đọc.
 *  2. Nút đồng ý KHÔNG được focus sẵn, và Enter/Escape đều là HUỶ. Gõ Enter
 *     theo quán tính không được phép bật một chế độ như thế này.
 *  3. Nói luôn cách tắt, và cái tự tắt (đổi dự án) — người dùng cần biết
 *     đường ra trước khi bước vào.
 */
function CanhBaoBoQuaHet({ onHuy, onDongY }: { onHuy: () => void; onDongY: () => void }) {
  const huyRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    huyRef.current?.focus();
    const phim = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') { e.preventDefault(); onHuy(); }
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  }, [onHuy]);

  return (
    <div className="ct-chedo-nen" onPointerDown={onHuy}>
      <div
        className="ct-chedo-canhbao"
        role="alertdialog"
        aria-modal="true"
        aria-label="Bỏ qua tất cả — cảnh báo"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <h3><ShieldAlert size={16} aria-hidden /> Bỏ qua tất cả — đọc trước khi bật</h3>
        <p>Agent sẽ tự làm mọi việc, <strong>không hiện thẻ duyệt nào nữa</strong>:</p>
        <ul>
          <li>Chạy <strong>mọi lệnh</strong>, kể cả loại bị xếp nguy hiểm —
            <code>rm -rf</code>, <code>git push --force</code>, <code>npm publish</code>,
            cài gói, đổi cấu hình máy.</li>
          <li>Đọc được <code>.env</code> của bạn — khoá API, mật khẩu cơ sở dữ liệu —
            và có thể gửi chúng ra ngoài bằng một lệnh mạng.</li>
          <li>Sửa, xoá, đổi tên file khỏi hỏi. <strong>Hoàn tác chỉ lùi được file,
            không lùi được lệnh đã chạy.</strong></li>
          <li>Tải file từ web về máy, kể cả file chạy được.</li>
        </ul>
        <p className="ct-chedo-canhbao-nhe">
          Chỉ bật khi bạn đang ngồi xem màn hình. Đổi dự án hoặc mở việc khác là
          nó <strong>tự tắt</strong>; muốn tắt ngay thì chọn lại một chế độ khác.
        </p>
        <div className="ct-chedo-canhbao-nut">
          <button ref={huyRef} type="button" className="ct-btn" onClick={onHuy}>Huỷ</button>
          <button type="button" className="ct-btn ct-btn-nguy" onClick={onDongY}>
            Tôi đã đọc — bật bỏ qua tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
