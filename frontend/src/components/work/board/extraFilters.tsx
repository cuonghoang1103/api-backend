'use client';

/**
 * Đợt 8D (19/10/2026): gộp MỌI bộ lọc phụ của board vào MỘT nút "Bộ lọc".
 *
 * Bộ lọc của board nằm ở hai chỗ: trang (loại thẻ, People/Agents — state ở app/…/board/page.tsx) và Board.tsx
 * (lọc nhanh, nhãn, bộ phận — truyền xuống BoardToolbar). Board.tsx đang được phiên khác sửa nên không thêm prop
 * xuyên qua nó được; trang bọc <Board> bằng context này, BoardToolbar đọc ra và vẽ chung một bong bóng.
 * Không có provider (trang khác dùng Board) ⇒ BoardToolbar vẫn chạy, chỉ thiếu phần của trang.
 */

import { createContext, useContext, type ReactNode } from 'react';

export interface BoardPageFilters {
  /** Số bộ lọc của trang đang bật (cộng vào số trên nút "Bộ lọc"). */
  count: number;
  /** Bộ lọc NẰM NGOÀI bong bóng (tìm, avatar, Chỉ của tôi) đang bật ⇒ vẫn hiện "Xoá bộ lọc". */
  rowActive?: boolean;
  /** Nội dung phần của trang trong bong bóng (đã có tiêu đề nhóm). */
  content: ReactNode;
  /** Xoá bộ lọc của trang (nút "Xoá bộ lọc" xoá cả hai phía). */
  clear: () => void;
}

export const BoardPageFiltersContext = createContext<BoardPageFilters | null>(null);
export const useBoardPageFilters = () => useContext(BoardPageFiltersContext);

/** Tiêu đề một nhóm trong bong bóng bộ lọc. */
export function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-2.5 py-2">
      <div className="w-eyebrow mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
