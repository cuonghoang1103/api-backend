'use client';

/**
 * Emoji picker popover for the chat composer. Wraps @emoji-mart via
 * a dynamic (ssr:false) import — emoji-mart touches `document` at
 * load time so it must never run on the server. Renders nothing
 * until `open`.
 *
 * ─── VÌ SAO BỘ DỮ LIỆU EMOJI ĐƯỢC NẠP MUỘN (23/08/2026) ──────────────────────
 * Trước đây file này mở đầu bằng `import data from '@emoji-mart/data'` — một
 * import TĨNH. Hệ quả không nhìn ra từ chỗ này, phải đọc ngược chuỗi phụ thuộc
 * mới thấy:
 *
 *   RootLayout → PostCommentModal (mounted SẴN, mọi trang)
 *              → CommentComposer / PostCard
 *              → EmojiPickerPopover
 *              → @emoji-mart/data        ← 466KB JSON
 *
 * `PostCommentModal` nằm trong cây của layout gốc và luôn được render (nó tự
 * quyết định hiện gì dựa trên store), nên webpack xếp 466KB ấy vào NHÓM CHUNK
 * CỦA LAYOUT. Đo trên bản dựng thật: `app-build-manifest.json` liệt kê
 * `76567b6f-….js` (466KB) trong `/layout` — tức MỌI trang của web đều tải,
 * kể cả trang chủ vốn không có ô nhập bình luận nào.
 *
 * `import()` động ở dưới cắt sợi dây đó: bộ dữ liệu thành chunk riêng, và chỉ
 * đi xuống dây khi người dùng THẬT SỰ bấm mở bảng emoji.
 *
 * ⚠️ ĐỪNG đưa `import data from '@emoji-mart/data'` trở lại đầu file. Nó vẫn
 * chạy đúng, vẫn build xanh, và lặng lẽ trả 466KB về cho mọi trang.
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useAnchoredFixedStyle } from './useAnchoredPopover';
import { useThemeClass } from '@/context/ThemeContext';

// emoji-mart's React wrapper. Loaded only on the client.
const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });

// Nhớ ở mức MODULE, không phải mức component: trang có nhiều ô bình luận, mỗi
// ô một EmojiPickerPopover. Giữ trong state của component thì mở ô thứ hai là
// tải lại. Ở đây tải đúng MỘT lần cho cả phiên, và `pending` gộp các lời gọi
// chồng nhau lại làm một.
let emojiData: object | null = null;
let pending: Promise<object> | null = null;

function loadEmojiData(): Promise<object> {
  if (emojiData) return Promise.resolve(emojiData);
  if (!pending) {
    pending = import('@emoji-mart/data')
      .then((m) => {
        emojiData = ((m as { default?: object }).default ?? m) as object;
        return emojiData;
      })
      .catch((err) => {
        // Cho phép thử lại ở lần mở sau — mạng chập một nhịp không nên khoá
        // bảng emoji vĩnh viễn cho tới khi tải lại trang.
        pending = null;
        throw err;
      });
  }
  return pending;
}

export default function EmojiPickerPopover({
  open,
  onClose,
  onPick,
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
  anchorRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fixedStyle = useAnchoredFixedStyle(anchorRef, open, 352);
  // Follow the app theme instead of hardcoding dark — otherwise the
  // picker renders a dark panel with dark labels in light mode.
  const themeClass = useThemeClass();
  // Khởi tạo từ biến module: ô thứ hai trở đi mở ra là có dữ liệu ngay, không
  // chớp khung chờ.
  const [data, setData] = useState<object | null>(emojiData);

  useEffect(() => {
    if (!open || data) return;
    let alive = true;
    loadEmojiData()
      .then((d) => {
        if (alive) setData(d);
      })
      .catch(() => {
        // Im lặng: bảng emoji là tiện nghi, hỏng nó không được chặn việc gõ.
      });
    return () => {
      alive = false;
    };
  }, [open, data]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // Defer so the click that opened the popover doesn't immediately close it.
    const t = setTimeout(() => document.addEventListener('mousedown', onDoc), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const body = (
    <div
      ref={ref}
      className={anchorRef ? 'z-[220]' : 'absolute bottom-full left-0 z-50 mb-2'}
      style={anchorRef ? fixedStyle : undefined}
    >
      {data ? (
        <Picker
          data={data}
          onEmojiSelect={(e: { native?: string }) => {
            if (e.native) onPick(e.native);
          }}
          theme={themeClass}
          previewPosition="none"
          skinTonePosition="search"
          navPosition="top"
          perLine={8}
          emojiSize={20}
        />
      ) : (
        /* Khung chờ ĐÚNG KÍCH THƯỚC bảng emoji thật (352×435, khớp tham số
           truyền cho useAnchoredFixedStyle ở trên). Nếu để nhỏ hơn rồi phình
           ra, popover đã được định vị theo mép trên sẽ nhảy chỗ ngay dưới con
           trỏ người dùng. */
        <div
          role="status"
          aria-label="Đang tải bảng emoji"
          className="flex h-[435px] w-[352px] items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl"
        >
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[var(--text-secondary)]" />
        </div>
      )}
    </div>
  );

  return anchorRef ? createPortal(body, document.body) : body;
}
