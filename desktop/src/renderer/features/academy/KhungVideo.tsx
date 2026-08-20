/**
 * Khung xem video NGAY TRONG APP cho bài học.
 *
 * ─── Vì sao KHÔNG phải một thẻ `<iframe>` ───
 * Đã thử thật, 20/08/2026, trong bản đã đóng gói:
 *   • nới `frame-src` cho youtube-nocookie.com → yêu cầu mạng trả **200**
 *   • `load` của iframe **có bắn**
 *   • bắt tay `enablejsapi` gửi ba lần trong 10 giây → **KHÔNG một tin nhắn nào**
 *   • chụp màn hình: **khung TRẮNG**
 * Vì origin của renderer là `app://cuongthai`, không phải http(s). Trình nhúng
 * của YouTube đòi trang cha có origin thật và là bên thứ ba — cùng lý do đã
 * làm app iOS hỏng, xem [[feedback_nhung_youtube_can_origin_that]].
 * Nên nới CSP KHÔNG mua được gì cả; đã trả lại `frame-src 'none'`.
 *
 * ─── Cách chạy được ───
 * Dùng đúng cơ chế mà tab "Trình duyệt" của app đang chạy: một
 * `WebContentsView` do MAIN giữ, vẽ ĐÈ lên cửa sổ theo toạ độ. Nó là Chromium
 * thật đang ở `https://www.youtube.com`, nên không có vấn đề origin nào.
 *
 * ⛔ NHƯNG PHẢI LÀ TRANG XEM, KHÔNG PHẢI `/embed/`. Lần đầu tôi trỏ lớp phủ
 * vào `/embed/<id>` và kết luận "chạy" vì trạng thái báo `loi: null` và tiêu
 * đề "YouTube". SAI: trang BÁO LỖI cũng là một trang YouTube nạp thành công.
 * Người dùng nhận về **Error 153 — Video player configuration error**.
 * Chỉ khi chụp ẢNH của chính lớp phủ (`webContents.capturePage()` ở main) mới
 * thấy sự thật. Từ nay đo trình phát bằng ẢNH, không bằng trạng thái nạp —
 * xem [[feedback_phep_kiem_dat_vi_ly_do_sai]].
 *
 * ⚠️ Ba điều phải nhớ, chép từ bài học của `BrowserMode.tsx`:
 *  1. Trang web luôn NỔI TRÊN mọi thứ React vẽ — không `z-index` nào thắng.
 *     Vì thế khung này nằm ở một ô CỐ ĐỊNH phía trên, KHÔNG cuộn theo bài:
 *     để nó trong vùng cuộn thì cuộn xuống là video đè lên chữ.
 *  2. Quên gọi `an()` lúc tháo ⇒ video ở lại lơ lửng trên màn hình kế tiếp,
 *     trông y hệt app hỏng.
 *  3. Ô giữ chỗ đổi kích thước (kéo cửa sổ, ẩn thanh bên) thì phải đo lại.
 */
import { useCallback, useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';

/** Mã video từ mọi dạng liên kết YouTube thường gặp. */
export function maYouTube(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m?.[1] ?? null;
}

export function KhungVideo({
  url, onDong,
}: { url: string; onDong: () => void }) {
  const oRef = useRef<HTMLDivElement>(null);
  const daMoRef = useRef(false);

  /** Đo ô giữ chỗ rồi báo lên main. Toạ độ theo VIEWPORT của cửa sổ. */
  const doVaBao = useCallback((moLuon: boolean) => {
    const el = oRef.current;
    const cau = window.cuongthai;
    if (!el || !cau) return;
    const r = el.getBoundingClientRect();
    /* Ô chưa có kích thước (chưa bố cục xong) ⇒ đừng báo: gửi một vùng 0×0
       làm main thu khung về không rồi phải phóng lại, và video nháy một cái. */
    if (r.width < 2 || r.height < 2) return;
    const vung = { x: r.left, y: r.top, width: r.width, height: r.height };
    if (moLuon && !daMoRef.current) {
      daMoRef.current = true;
      const ma = maYouTube(url);
      /* ⚠️ TRANG XEM, KHÔNG PHẢI `/embed/`.
         `youtube.com/embed/<id>` nạp ở cấp cao nhất trả **Error 153 — Video
         player configuration error**: khung nhúng chỉ chạy khi nằm TRONG một
         iframe của trang cha có origin thật. Đo bằng ảnh chụp chính lớp phủ,
         không bằng trạng thái nạp — trang báo lỗi cũng "nạp thành công".
         Trang xem thì kéo theo thanh đầu YouTube, nên tỉa bằng CSS ngay sau. */
      void cau.browser
        .mo(vung, ma ? `https://www.youtube.com/watch?v=${ma}` : url)
        .then(() => cau.browser.tiaYouTube());
    } else {
      void cau.browser.datVung(vung);
    }
  }, [url]);

  useEffect(() => {
    // Đợi một khung hình cho bố cục xong rồi mới đo — đo ngay trong effect thì
    // `getBoundingClientRect()` còn trả kích thước của lần vẽ trước.
    const id = requestAnimationFrame(() => doVaBao(true));
    return () => cancelAnimationFrame(id);
  }, [doVaBao]);

  /* Tỉa LẠI mỗi lần trang báo nạp xong. YouTube là ứng dụng một trang: bấm một
     video gợi ý là nó thay nội dung mà không nạp lại tài liệu, và CSS chèn lần
     đầu vẫn còn — nhưng lần điều hướng THẬT (tải lại, lùi/tới) thì mất. */
  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;
    return cau.on('browser:trangThai', (t) => {
      if ((t as { dangTai?: boolean }).dangTai === false) void cau.browser.tiaYouTube();
    });
  }, []);

  /* Gỡ hẳn khi tháo. Không có nhánh này thì video ở lại trên trang kế tiếp. */
  useEffect(() => () => { void window.cuongthai?.browser.an(); }, []);

  useEffect(() => {
    const el = oRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => doVaBao(false));
    ro.observe(el);
    const doLai = () => doVaBao(false);
    window.addEventListener('resize', doLai);
    return () => { ro.disconnect(); window.removeEventListener('resize', doLai); };
  }, [doVaBao]);

  return (
    <div className="ct-hv-video">
      <div className="ct-hv-video-thanh">
        <span className="ct-muted">Đang phát trong app</span>
        <button type="button" className="ct-linklike" onClick={() => void window.cuongthai?.app.openExternal(url)}>
          <ExternalLink size={12} aria-hidden /> Mở YouTube
        </button>
        <button type="button" className="ct-trk-action" onClick={onDong} aria-label="Đóng video">
          <X size={15} aria-hidden />
        </button>
      </div>
      {/* Ô GIỮ CHỖ — rỗng có chủ ý. Video không nằm trong DOM này; main vẽ đè
          lên đúng toạ độ của nó. */}
      <div className="ct-hv-video-o" ref={oRef} />
    </div>
  );
}
