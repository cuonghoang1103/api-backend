/**
 * ============================================================
 * NỘI DUNG MỘT BÀI VIẾT
 * ============================================================
 *
 * Sinh ra từ ảnh người dùng gửi 19/08/2026: bài "100 NGÀY TIẾNG ANH" hiện
 * nguyên `**ghép lại thành một cuộc trò chuyện thật**` — cả dấu sao. Bài trên
 * cuongthai.com viết bằng markdown, web dựng nó, app thì đổ ra `{content}`
 * thuần. Đó là lý do lớn nhất khiến bảng tin trong app trông sơ sài, chứ
 * không phải màu hay khoảng cách.
 *
 * ─── VÌ SAO DÙNG LẠI `doanChu` CỦA CHAT ───
 * Nó thoát HTML TRƯỚC rồi mới áp luật định dạng, nên không có thẻ nào sinh ra
 * từ đầu vào. Ở chat, đầu vào là câu trả lời của model. Ở đây, đầu vào là bài
 * do NGƯỜI KHÁC viết — nên tính chất đó còn cần hơn, không phải kém đi. Viết
 * bộ dựng thứ hai nghĩa là có hai chỗ để sai, và chỗ thứ hai không có bộ kiểm.
 *
 * ⚠️ KHÔNG dùng `tachKhoi`/`ChuAgent`: chúng kéo theo highlight.js, KaTeX,
 * mermaid và cả hộp cát Python. Một bảng tin 12 bài sẽ nạp cả bộ đó cho thứ
 * gần như không bài nào dùng.
 */
import { useLayoutEffect, useRef, useState } from 'react';

import { doanChu } from '../chat/markdown';

/** Quá ngưỡng này thì thu gọn, giống "Xem thêm" của Facebook. */
const CAO_TOI_DA = 420;

/**
 * Gắn hashtag, @nhắc tên và liên kết trần vào HTML ĐÃ THOÁT.
 *
 * ⚠️ CHẠY SAU `doanChu`, và chỉ chạm vào phần NGOÀI thẻ. Chạy trước thì thẻ
 * `<a>` ta vừa chèn sẽ bị `doanChu` thoát thành `&lt;a&gt;`; chạy đè lên cả
 * chuỗi thì một URL nằm trong `href` của liên kết markdown sẽ bị bọc liên kết
 * lần hai và sinh ra HTML hỏng.
 */
export function trangTri(html: string): string {
  return html.replace(/>([^<]+)</g, (_, chu: string) => {
    const ra = chu
      // Liên kết trần. `doanChu` đã thoát `&`, nên `&amp;` trong URL vẫn
      // đúng khi trình duyệt đọc lại.
      .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_m, dau: string, url: string) =>
        `${dau}<a href="${url}" target="_blank" rel="noreferrer noopener">${url}</a>`)
      // #hashtag — chữ Việt có dấu nằm ngoài \w nên phải kê thêm dải Unicode,
      // xem [[feedback_regex_word_boundary_breaks_vietnamese]].
      .replace(/(^|\s)#([\p{L}\p{N}_]{2,50})/gu, (_m, dau: string, the: string) =>
        `${dau}<span class="ct-bt-the">#${the}</span>`)
      // @nhắc tên
      .replace(/(^|\s)@([a-zA-Z0-9_.]{2,32})/g, (_m, dau: string, ten: string) =>
        `${dau}<span class="ct-bt-nhac">@${ten}</span>`);
    return `>${ra}<`;
  });
}

export function NoiDungBai({ chu }: { chu: string }) {
  const [moRong, datMoRong] = useState(false);
  const [dai, datDai] = useState(false);
  const oRef = useRef<HTMLDivElement | null>(null);

  /* Đo CHIỀU CAO THẬT sau khi dựng, không đếm ký tự: một bài 300 ký tự toàn
     danh sách cao hơn hẳn 300 ký tự một đoạn liền. `useLayoutEffect` để đo
     xong trước khi trình duyệt vẽ — dùng `useEffect` thì người dùng thấy bài
     bung hết rồi mới co lại, một cú giật ở mỗi bài dài. */
  useLayoutEffect(() => {
    const o = oRef.current;
    if (o) datDai(o.scrollHeight > CAO_TOI_DA + 40);
  }, [chu]);

  const html = trangTri(doanChu(chu));

  return (
    <div className="ct-bt-noidung" data-mo={moRong} data-dai={dai}>
      <div
        ref={oRef}
        className="ct-md ct-bt-chu"
        style={dai && !moRong ? { maxHeight: CAO_TOI_DA } : undefined}
        // An toàn: `doanChu` thoát toàn bộ HTML trước khi định dạng, và
        // `trangTri` chỉ chèn thẻ vào phần đã thoát. Không có đường nào để
        // thẻ của người viết bài sống sót.
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {dai && (
        <button type="button" className="ct-bt-xemthem" onClick={() => datMoRong((v) => !v)}>
          {moRong ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
}

/** Mã video YouTube từ mọi dạng liên kết YouTube thường gặp. */
export function maYouTube(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m?.[1] ?? null;
}
