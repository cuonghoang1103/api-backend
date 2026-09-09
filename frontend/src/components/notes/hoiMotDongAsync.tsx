'use client';

/**
 * `hoiMotDong()` — bản Promise của `HoiMotDong`, thay thẳng `window.prompt`.
 *
 * Vì sao cần bản này bên cạnh component: ba chỗ gọi (`SlashMenu` chèn
 * bookmark/nhúng, thanh bong bóng của `NoteEditor` chèn liên kết) đều nằm
 * trong hàm ĐỒNG BỘ được gọi từ một menu đang tự đóng. Luồn state hộp thoại
 * qua ba component đó là ba lần sửa cấu trúc; một hàm trả Promise thì mỗi chỗ
 * chỉ đổi đúng một dòng.
 *
 * ⚠️ GẮN VÀO TRONG `.notes-theme-root`, KHÔNG phải `document.body`.
 *
 * Notes có bộ chủ đề riêng và nó đặt lớp `.dark` lên đúng phần tử đó; mọi biến
 * thể `dark:` của Tailwind trong cây Notes treo vào lớp ấy. Gắn ra ngoài body
 * thì hộp thoại ra CHỮ ĐEN TRÊN NỀN TRẮNG ngay giữa một app đang ở chủ đề tối
 * — đúng lỗi đã xảy ra thật ngày 02/07/2026 với lớp `dark` đặt nhầm chỗ.
 */
import { createRoot } from 'react-dom/client';

import { HoiMotDong } from './HoiMotDong';

export function hoiMotDong(opts: {
  tieuDe: string;
  banDau?: string;
  goiY?: string;
  nhanXong?: string;
}): Promise<string | null> {
  return new Promise((giai) => {
    // Không có `document` (dựng phía máy chủ) ⇒ coi như người dùng huỷ, đừng ném.
    if (typeof document === 'undefined') { giai(null); return; }

    const cha = document.querySelector('.notes-theme-root') ?? document.body;
    const hop = document.createElement('div');
    cha.appendChild(hop);
    const goc = createRoot(hop);

    let daXong = false;
    const dong = (gt: string | null): void => {
      if (daXong) return;          // bấm Huỷ hai lần rất dễ xảy ra
      daXong = true;
      /* Tháo ở lượt SAU: gọi `unmount()` ngay trong lúc React đang xử lý sự
         kiện của chính cây đó sẽ ném "Attempted to synchronously unmount a
         root while React was already rendering". */
      setTimeout(() => { goc.unmount(); hop.remove(); }, 0);
      giai(gt);
    };

    goc.render(<HoiMotDong {...opts} onXong={dong} />);
  });
}
