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
 *
 *     ⚠️ ĐO LẠI KHI CUỘN, KHÔNG CHỈ KHI ĐỔI CỠ. Ô giữ chỗ nằm trong
 *     `.ct-content`, vốn là `overflow-y: auto`. `ResizeObserver` KHÔNG bắn khi
 *     cuộn (cỡ phần tử có đổi đâu), `window.resize` cũng không — nên cuộn bài
 *     là ô giữ chỗ trôi đi còn lớp phủ đứng nguyên tại chỗ cũ, đè lên chữ.
 *     Người dùng gửi ảnh khung hình lệch kèm một dải đen, 20/08/2026.
 *
 *     Hai việc, cần cả hai: `position: sticky` để khung ghim ở đầu vùng cuộn
 *     (xem `.ct-hv-video` trong styles.css), và một bộ nghe `scroll` cho quãng
 *     TRƯỚC khi nó ghim — lúc đó nó vẫn trôi thật.
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

  /**
 * Gốc site để dựng đường tới `/nhung-video`.
 *
 * `__CT_GOC_SITE__` do `configureWebApi()` đặt lúc app khởi động. Không có nó
 * (chưa qua cầu nối web) thì trả rỗng và nơi gọi lùi về đường cũ, thay vì dựng
 * ra một URL cụt.
 */
function gocSite(): string {
  return ((globalThis as { __CT_GOC_SITE__?: string }).__CT_GOC_SITE__ ?? '').trim();
}

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
      /* ⚠️ KHÔNG nạp `/embed/` trực tiếp, và cũng KHÔNG còn nạp trang xem
         YouTube nữa.
         • `/embed/<id>` ở cấp cao nhất trả Error 153: khung nhúng chỉ chạy khi
           nằm TRONG một trang cha có ORIGIN THẬT, và phải là bên thứ ba.
         • Trang xem `youtube.com/watch` thì chạy được, nhưng kéo theo quảng
           cáo, cột gợi ý và bố cục riêng của YouTube — nặng, và trình phát
           không lấp đầy khung. Cắt bằng CSS chỉ GIẤU chứ không ngăn tải.
         Nay nạp `/nhung-video` của CHÍNH cuongthai.com: origin thật (y như
         lúc nhúng trên web, vốn đã chạy), trang chỉ có đúng một iframe lấp
         100% khung, không còn gì khác để tải. */
      const goc = gocSite();
      const dich = ma && goc
        ? `${goc}/nhung-video?v=${encodeURIComponent(ma)}`
        : url;
      void cau.browser.mo(vung, dich);
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

  /* KHÔNG còn tỉa CSS ở đây. Lớp phủ nay nạp `/nhung-video` của chính mình —
     một trang chỉ có đúng một iframe lấp 100% khung, nên không có gì để tỉa.
     `tiaYouTube()` vẫn còn trong main cho đường LÙI (khi chưa có gốc site thì
     `doVaBao` vẫn mở thẳng URL gốc). */

  /* Gỡ hẳn khi tháo — và DỪNG PHÁT, không chỉ gỡ.
     `an()` một mình chỉ tháo khung khỏi cửa sổ; trang YouTube vẫn chạy nền và
     tiếng vẫn ra loa. Người dùng báo 20/08/2026: thoát bài hoặc chuyển bài
     khác mà vẫn nghe tiếng video bài cũ. */
  useEffect(() => () => {
    void window.cuongthai?.browser.an();
    void window.cuongthai?.browser.dungVideo();
  }, []);

  useEffect(() => {
    const el = oRef.current;
    if (!el) return;
    const doLai = () => doVaBao(false);

    const ro = new ResizeObserver(doLai);
    ro.observe(el);
    window.addEventListener('resize', doLai);

    /* Mọi tổ tiên CUỘN ĐƯỢC, không riêng `.ct-content`: thanh bên có thể mở
       thêm một lớp cuộn nữa ngày nào đó, và bỏ sót một lớp là lỗi quay lại y
       hệt. Gắn thẳng vào từng lớp cuộn thay vì nghe ở `document`: sự kiện
       `scroll` của một phần tử KHÔNG nổi bọt lên document. */
    const cuon: (Element | Window)[] = [window];
    for (let n = el.parentElement; n; n = n.parentElement) {
      const kieu = getComputedStyle(n).overflowY;
      if (kieu === 'auto' || kieu === 'scroll') cuon.push(n);
    }
    for (const n of cuon) n.addEventListener('scroll', doLai, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', doLai);
      for (const n of cuon) n.removeEventListener('scroll', doLai);
    };
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
