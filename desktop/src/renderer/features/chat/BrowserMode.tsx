/**
 * Chế độ Trình duyệt.
 *
 * ⚠️ TRANG WEB KHÔNG NẰM TRONG DOM CỦA REACT.
 *
 * Nó là một `WebContentsView` do MAIN giữ (xem `main/browser.ts`), vẽ ĐÈ lên
 * cửa sổ theo toạ độ tuyệt đối. Component này chỉ vẽ phần khung — ô địa chỉ,
 * nút lui/tới — cộng một Ô GIỮ CHỖ rỗng, rồi đo ô đó và báo toạ độ cho main.
 *
 * Hệ quả phải nhớ, vì quên là hỏng rất khó hiểu:
 *
 *  1. Trang web luôn NỔI TRÊN mọi thứ React vẽ. Không có `z-index` nào của CSS
 *     thắng được nó. Nên hộp thoại, menu thả xuống… nếu rơi vào vùng đó thì bị
 *     che hoàn toàn.
 *  2. Rời chế độ này (hoặc rời trang) mà quên gọi `an()` thì trang web ở lại
 *     lơ lửng trên màn hình mới, và trông y hệt app hỏng.
 *  3. Ô giữ chỗ đổi kích thước (kéo cửa sổ, ẩn sidebar) thì phải đo lại. Không
 *     có `ResizeObserver` thì khung web đứng yên trong khi giao diện đã chạy.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ExternalLink, Globe, Loader2, RotateCw, X,
} from 'lucide-react';
import type { BrowserTrangThai } from '../../../shared/ipc';

/** Địa chỉ mở sẵn. localhost:3000 là dev server hay dùng nhất của chính dự án này. */
const MAC_DINH = 'http://localhost:3000';

export function BrowserMode({ hien }: { hien: boolean }) {
  const oRef = useRef<HTMLDivElement>(null);
  const [oNhap, datONhap] = useState(MAC_DINH);
  const [tt, datTt] = useState<BrowserTrangThai | null>(null);
  const daMoRef = useRef(false);

  /** Đo ô giữ chỗ rồi báo lên main. Toạ độ theo VIEWPORT của cửa sổ. */
  const doVaBao = useCallback((moLuon: boolean) => {
    const el = oRef.current;
    const cau = window.cuongthai;
    if (!el || !cau) return;
    const r = el.getBoundingClientRect();
    // Ô chưa có kích thước (đang ẩn, hoặc chưa bố cục xong) ⇒ đừng báo: gửi
    // một vùng 0×0 làm main thu khung về không rồi phải phóng lại, và người
    // dùng thấy trang nháy một cái.
    if (r.width < 2 || r.height < 2) return;
    const vung = { x: r.left, y: r.top, width: r.width, height: r.height };
    if (moLuon && !daMoRef.current) {
      daMoRef.current = true;
      // `ep: false` — MAC_DINH chỉ dùng khi chưa có trang nào. Ép nạp ở đây là
      // cuốn phăng trang người dùng vừa đăng nhập mỗi lần họ đổi tab.
      void cau.browser.mo(vung, MAC_DINH, false);
    } else {
      void cau.browser.datVung(vung);
    }
  }, []);

  // Bật/tắt theo chế độ đang hiện. `an()` khi rời — xem điểm 2 ở đầu file.
  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;
    if (!hien) { void cau.browser.an(); return; }
    // Đợi một khung hình để bố cục xong rồi mới đo — đo ngay trong effect thì
    // `getBoundingClientRect()` còn trả kích thước của lần vẽ trước.
    const id = requestAnimationFrame(() => doVaBao(true));
    return () => cancelAnimationFrame(id);
  }, [hien, doVaBao]);

  // Gỡ hẳn khi component bị tháo (đổi route). Không có nhánh này thì trang web
  // ở lại trên màn hình Ghi chú.
  useEffect(() => () => { void window.cuongthai?.browser.an(); }, []);

  // Theo dõi ô giữ chỗ đổi kích thước: kéo cửa sổ, ẩn/hiện sidebar, đổi zoom.
  useEffect(() => {
    const el = oRef.current;
    if (!el || !hien) return;
    const ro = new ResizeObserver(() => doVaBao(false));
    ro.observe(el);
    const onScroll = () => doVaBao(false);
    window.addEventListener('resize', onScroll);
    return () => { ro.disconnect(); window.removeEventListener('resize', onScroll); };
  }, [hien, doVaBao]);

  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;
    return cau.on('browser:trangThai', (payload) => {
      const t = payload as BrowserTrangThai;
      datTt(t);
      // Chỉ đồng bộ ô địa chỉ khi người dùng KHÔNG đang gõ dở — đè lên chữ họ
      // đang nhập là kiểu khó chịu điển hình của thanh địa chỉ làm ẩu.
      if (document.activeElement !== document.getElementById('ct-td-o')) {
        if (t.url) datONhap(t.url);
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
    <div className="ct-td">
      <div className="ct-td-thanh">
        <button
          type="button" className="ct-agent-icon" data-nut="tdLui"
          onClick={() => void window.cuongthai?.browser.lui()}
          disabled={!tt?.luiDuoc} title="Lùi"
        >
          <ArrowLeft size={14} aria-hidden />
        </button>
        <button
          type="button" className="ct-agent-icon" data-nut="tdToi"
          onClick={() => void window.cuongthai?.browser.toi()}
          disabled={!tt?.toiDuoc} title="Tới"
        >
          <ArrowRight size={14} aria-hidden />
        </button>
        <button
          type="button" className="ct-agent-icon" data-nut="tdNap"
          onClick={() => void window.cuongthai?.browser.napLai()}
          title="Nạp lại"
        >
          {tt?.dangTai ? <Loader2 size={14} aria-hidden className="ct-spin" /> : <RotateCw size={14} aria-hidden />}
        </button>

        <div className="ct-td-o-boc">
          <Globe size={13} aria-hidden />
          <input
            id="ct-td-o"
            className="ct-td-o"
            value={oNhap}
            spellCheck={false}
            placeholder="localhost:3000 hoặc https://…"
            onChange={(e) => datONhap(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === 'Enter') { e.preventDefault(); di(); }
            }}
          />
          {oNhap && (
            <button type="button" className="ct-td-xoa" onClick={() => datONhap('')} aria-label="Xoá địa chỉ">
              <X size={11} aria-hidden />
            </button>
          )}
        </div>

        <button
          type="button" className="ct-agent-icon" data-nut="tdNgoai"
          onClick={() => void window.cuongthai?.browser.moNgoai()}
          title="Mở bằng trình duyệt hệ thống"
        >
          <ExternalLink size={14} aria-hidden />
        </button>
      </div>

      {tt?.loi && (
        <div className="ct-notice" data-tone="err" style={{ margin: '0 0 8px' }}>
          <span>{tt.loi}</span>
        </div>
      )}

      {/* Ô GIỮ CHỖ. Cố ý rỗng: trang web được main vẽ đè lên đúng hình chữ nhật
          này. Đặt nội dung vào đây là đặt thứ sẽ bị che hoàn toàn. */}
      <div className="ct-td-khung" ref={oRef} />
    </div>
  );
}

function khung0(): BrowserTrangThai {
  return { url: '', tieuDe: '', dangTai: false, luiDuoc: false, toiDuoc: false, loi: null };
}
