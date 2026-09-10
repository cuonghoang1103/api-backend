/**
 * ============================================================
 * KHUNG TRÌNH DUYỆT CẠNH BẢNG GHI (chia đôi trong AI Code)
 * ============================================================
 *
 * Người dùng hỏi 19/08/2026: "khi nó mở trình duyệt thì có tự hiện trong tab
 * AI Code không, hay tôi phải tự chuyển sang tab Trình duyệt rồi mất phần AI
 * Code?" — bản trước đúng là thế, và đó là một bước thủ công vô nghĩa giữa
 * lúc agent đang chạy.
 *
 * ─── VÌ SAO PHẢI ĐO Ở RENDERER ───
 * `WebContentsView` là lớp phủ do MAIN vẽ theo TOẠ ĐỘ tuyệt đối trong cửa sổ.
 * Main không biết thanh bên đang gập hay mở, cửa sổ rộng bao nhiêu, người
 * dùng phóng to bao nhiêu — chỉ renderer đo được. Nên luồng là: agent gọi
 * `web_mo` → main bắn `agent:moWeb` → component này mở ra, ĐO ô giữ chỗ, rồi
 * gọi `browser.mo(vùng, url)` → `web_mo` thấy trình duyệt đã mở và đi tiếp.
 *
 * ⚠️ PHẢI `an()` KHI THÁO. Trang web không nằm trong luồng bố cục của React;
 * đóng khung mà quên gọi `an()` thì nó ở lại lơ lửng trên mọi màn hình khác.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Globe, Loader2, RotateCw, X } from 'lucide-react';

import type { BrowserTrangThai } from '../../../shared/ipc';
import { useDich } from '../../i18n';

export function KhungWeb({
  url,
  onDong,
  ep = true,
}: {
  url: string;
  onDong: () => void;
  /**
   * `url` là MỆNH LỆNH hay chỉ là MẶC ĐỊNH.
   *
   * Agent gọi `web_mo` ⇒ `true`: nó vừa nói rõ muốn mở trang nào.
   * Người dùng bấm nút mở khung ⇒ `false`: họ chỉ muốn THẤY trình duyệt, và
   * ép nạp lúc đó là cuốn phăng trang họ đang đăng nhập dở ở tab Trình duyệt
   * — cùng một `WebContentsView` dùng chung cho cả hai chỗ.
   */
  ep?: boolean;
}) {
  const { dich } = useDich();
  const oRef = useRef<HTMLDivElement>(null);
  const daMoRef = useRef(false);
  const [tt, datTt] = useState<BrowserTrangThai | null>(null);
  const [oNhap, datONhap] = useState(url);

  const doVaBao = useCallback((moLuon: boolean) => {
    const el = oRef.current;
    const cau = window.cuongthai;
    if (!el || !cau) return;
    const r = el.getBoundingClientRect();
    // Ô chưa có kích thước (chưa bố cục xong) ⇒ đừng báo: gửi một vùng 0×0
    // làm main thu khung về không rồi phải phóng lại, và trang nháy một cái.
    if (r.width < 2 || r.height < 2) return;
    const vung = { x: r.left, y: r.top, width: r.width, height: r.height };
    if (moLuon && !daMoRef.current) {
      daMoRef.current = true;
      void cau.browser.mo(vung, url, ep);
    } else {
      void cau.browser.datVung(vung);
    }
  }, [url, ep]);

  useEffect(() => {
    // Đợi một khung hình để bố cục xong rồi mới đo — đo ngay trong effect thì
    // `getBoundingClientRect()` còn trả kích thước của lần vẽ trước.
    const id = requestAnimationFrame(() => doVaBao(true));
    return () => cancelAnimationFrame(id);
  }, [doVaBao]);

  // Trang đã mở rồi mà agent gọi `web_mo` với URL khác ⇒ điều hướng.
  // `ep: false` (người dùng tự mở khung) thì KHÔNG — xem chú thích của `ep`.
  useEffect(() => {
    if (ep && daMoRef.current && url) void window.cuongthai?.browser.diToi(url);
  }, [url, ep]);

  useEffect(() => () => { void window.cuongthai?.browser.an(); }, []);

  useEffect(() => {
    const el = oRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => doVaBao(false));
    ro.observe(el);
    const doiCo = (): void => doVaBao(false);
    window.addEventListener('resize', doiCo);
    return () => { ro.disconnect(); window.removeEventListener('resize', doiCo); };
  }, [doVaBao]);

  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;
    return cau.on('browser:trangThai', (p) => {
      const t = p as BrowserTrangThai;
      datTt(t);
      // Chỉ đồng bộ ô địa chỉ khi người dùng KHÔNG đang gõ dở — đè lên chữ họ
      // đang nhập là kiểu khó chịu điển hình của thanh địa chỉ làm ẩu.
      if (t.url && document.activeElement !== document.getElementById('ct-khungweb-o-dc')) {
        datONhap(t.url);
      }
    });
  }, []);

  const di = (): void => {
    const u = oNhap.trim();
    if (!u) return;
    void window.cuongthai?.browser.diToi(u).then((r) => {
      if (!r.ok && r.loi) datTt((cu) => ({ ...(cu ?? khung0()), loi: r.loi! }));
    });
  };

  return (
    <div className="ct-khungweb">
      {/* Thanh điều hướng THẬT, không phải một dòng chữ chết.
          Trước bản này đầu khung chỉ in ra URL: mở được trang agent chọn, rồi
          hết — muốn gõ địa chỉ khác phải sang tab Trình duyệt và mất luôn cột
          AI Code, đúng cái bước thủ công mà khung này sinh ra để bỏ đi. */}
      <div className="ct-khungweb-dau">
        <button
          type="button" onClick={() => void window.cuongthai?.browser.lui()}
          disabled={!tt?.luiDuoc} title={dich('Lùi')} aria-label={dich('Lùi')}
        >
          <ArrowLeft size={12} aria-hidden />
        </button>
        <button
          type="button" onClick={() => void window.cuongthai?.browser.toi()}
          disabled={!tt?.toiDuoc} title={dich('Tới')} aria-label={dich('Tới')}
        >
          <ArrowRight size={12} aria-hidden />
        </button>
        <div className="ct-khungweb-dc">
          {tt?.dangTai
            ? <Loader2 size={11} aria-hidden className="ct-spin" />
            : <Globe size={11} aria-hidden />}
          <input
            id="ct-khungweb-o-dc"
            value={oNhap}
            spellCheck={false}
            placeholder={dich('localhost:3000 hoặc https://…')}
            title={tt?.url ?? url}
            onChange={(e) => datONhap(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') { e.preventDefault(); di(); }
            }}
          />
        </div>
        <button type="button" onClick={() => void window.cuongthai?.browser.napLai()} title={dich('Nạp lại')} aria-label={dich('Nạp lại')}>
          <RotateCw size={12} aria-hidden />
        </button>
        <button type="button" onClick={() => void window.cuongthai?.browser.moNgoai()} title={dich('Mở bằng trình duyệt máy')}>
          <ExternalLink size={12} aria-hidden />
        </button>
        <button type="button" onClick={onDong} title={dich('Đóng khung trình duyệt')} aria-label={dich('Đóng')}>
          <X size={13} aria-hidden />
        </button>
      </div>
      {/* Ô GIỮ CHỖ. Trang web không nằm ở đây — main vẽ đè lên đúng vùng này.
          Nền tối để lúc trang chưa tải xong không thấy một mảng trắng chói. */}
      <div ref={oRef} className="ct-khungweb-o" />
      {tt?.loi && <p className="ct-khungweb-loi">{tt.loi}</p>}
    </div>
  );
}

function khung0(): BrowserTrangThai {
  return { url: '', tieuDe: '', dangTai: false, luiDuoc: false, toiDuoc: false, loi: null };
}
