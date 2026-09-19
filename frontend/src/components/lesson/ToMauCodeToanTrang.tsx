'use client';

import { useEffect } from 'react';
import { toMauTrong } from '@/lib/toMauCode';

/**
 * Tô màu code + gắn nút Sao chép cho MỌI khối `.rich-content` trên trang.
 *
 * Dùng cho trang là Server Component (không cầm được ref từng khối), ví dụ
 * `exp-hub/[slug]`. Chỉ cần thả `<ToMauCodeToanTrang />` vào cuối trang.
 *
 * Có `MutationObserver` vì vài trang chèn thêm nội dung sau khi mount
 * (mở/đóng mục, tải thêm) — không có nó thì phần chèn sau vẫn trắng trơn.
 */
export default function ToMauCodeToanTrang() {
  useEffect(() => {
    const chay = () => {
      for (const el of document.querySelectorAll<HTMLElement>('.rich-content')) void toMauTrong(el);
    };
    chay();

    const theoDoi = new MutationObserver(() => {
      // Gom nhiều thay đổi liên tiếp thành một lượt.
      clearTimeout((theoDoi as unknown as { _t?: number })._t);
      (theoDoi as unknown as { _t?: number })._t = window.setTimeout(chay, 120);
    });
    theoDoi.observe(document.body, { childList: true, subtree: true });
    return () => theoDoi.disconnect();
  }, []);

  return null;
}
