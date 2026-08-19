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
import { ExternalLink, RotateCw, X } from 'lucide-react';

import type { BrowserTrangThai } from '../../../shared/ipc';

export function KhungWeb({ url, onDong }: { url: string; onDong: () => void }) {
  const oRef = useRef<HTMLDivElement>(null);
  const daMoRef = useRef(false);
  const [tt, datTt] = useState<BrowserTrangThai | null>(null);

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
      void cau.browser.mo(vung, url);
    } else {
      void cau.browser.datVung(vung);
    }
  }, [url]);

  useEffect(() => {
    // Đợi một khung hình để bố cục xong rồi mới đo — đo ngay trong effect thì
    // `getBoundingClientRect()` còn trả kích thước của lần vẽ trước.
    const id = requestAnimationFrame(() => doVaBao(true));
    return () => cancelAnimationFrame(id);
  }, [doVaBao]);

  // Trang đã mở rồi mà agent gọi `web_mo` với URL khác ⇒ điều hướng.
  useEffect(() => {
    if (daMoRef.current && url) void window.cuongthai?.browser.diToi(url);
  }, [url]);

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
    return cau.on('browser:trangThai', (p) => datTt(p as BrowserTrangThai));
  }, []);

  return (
    <div className="ct-khungweb">
      <div className="ct-khungweb-dau">
        <span className="ct-khungweb-url" title={tt?.url ?? url}>{tt?.url ?? url}</span>
        <button type="button" onClick={() => void window.cuongthai?.browser.napLai()} title="Nạp lại">
          <RotateCw size={12} aria-hidden />
        </button>
        <button type="button" onClick={() => void window.cuongthai?.browser.moNgoai()} title="Mở bằng trình duyệt máy">
          <ExternalLink size={12} aria-hidden />
        </button>
        <button type="button" onClick={onDong} title="Đóng khung trình duyệt" aria-label="Đóng">
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
