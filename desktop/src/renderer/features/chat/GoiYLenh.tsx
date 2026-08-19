/**
 * ============================================================
 * GỢI Ý LỆNH GẠCH CHÉO
 * ============================================================
 *
 * Người dùng: "khi tôi ấn dấu / thì nó sẽ show gợi ý các lệnh ra để chọn thay
 * vì nhập hết chứ."
 *
 * Trước bản này lệnh gạch chéo là kiến thức ngầm — `/clear` có chạy nhưng
 * không chỗ nào nói ra, nên chỉ người đã quen Claude Code mới gõ nó theo phản
 * xạ. Một tính năng không ai biết là một tính năng không tồn tại.
 */
import { useEffect, useMemo, useState } from 'react';

export interface LenhGach {
  ten: string;
  mo: string;
  /** Tên khác cùng nghĩa — gõ cái nào cũng ra. */
  khac?: string[];
}

export const LENH_AGENT: LenhGach[] = [
  { ten: '/clear', mo: 'Xoá hội thoại, bắt đầu việc mới', khac: ['/new', '/moi'] },
];

/**
 * Lọc theo phần người dùng đã gõ.
 *
 * Khớp cả tên chính lẫn tên khác, nhưng LUÔN hiện tên chính — hiện `/moi` khi
 * họ gõ `/mo` rồi lần sau họ gõ `/moi` mãi, trong khi tài liệu và mọi chỗ
 * khác gọi nó là `/clear`.
 */
export function locLenh(chu: string, ds: LenhGach[] = LENH_AGENT): LenhGach[] {
  if (!chu.startsWith('/')) return [];
  // Có khoảng trắng ⇒ họ đã gõ xong tên lệnh và đang gõ tham số, đừng chen vào.
  if (/\s/.test(chu)) return [];
  const q = chu.slice(1).toLowerCase();
  return ds.filter((l) => {
    if (!q) return true;
    return l.ten.slice(1).startsWith(q) || (l.khac ?? []).some((k) => k.slice(1).startsWith(q));
  });
}

export function GoiYLenh({
  chu, onChon, onDong,
}: {
  chu: string;
  onChon: (ten: string) => void;
  onDong: () => void;
}) {
  const ds = useMemo(() => locLenh(chu), [chu]);
  const [chon, datChon] = useState(0);

  // Gõ thêm ⇒ danh sách đổi ⇒ con trỏ phải về đầu, nếu không nó trỏ vào một
  // dòng không còn ở đó.
  useEffect(() => { datChon(0); }, [chu]);

  useEffect(() => {
    if (ds.length === 0) return;
    const phim = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowDown') { e.preventDefault(); datChon((c) => (c + 1) % ds.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); datChon((c) => (c - 1 + ds.length) % ds.length); }
      else if (e.key === 'Enter' || e.key === 'Tab') {
        // ⚠️ CHẶN Enter khi bảng đang mở. Không chặn thì gõ `/cl` rồi Enter sẽ
        // GỬI chuỗi đó cho model như một câu hỏi — tốn một lượt để model trả
        // lời rằng nó không hiểu.
        e.preventDefault();
        onChon(ds[chon]?.ten ?? '');
      } else if (e.key === 'Escape') { e.preventDefault(); onDong(); }
    };
    // `capture` để chạy TRƯỚC handler của ô nhập, nếu không ô nhập gửi mất rồi.
    window.addEventListener('keydown', phim, true);
    return () => window.removeEventListener('keydown', phim, true);
  }, [ds, chon, onChon, onDong]);

  if (ds.length === 0) return null;

  return (
    <div className="ct-goiy" role="listbox" aria-label="Lệnh">
      {ds.map((l, i) => (
        <button
          key={l.ten}
          type="button"
          role="option"
          aria-selected={i === chon}
          data-chon={i === chon}
          onMouseEnter={() => datChon(i)}
          onClick={() => onChon(l.ten)}
        >
          <code>{l.ten}</code>
          <span>{l.mo}</span>
          {l.khac?.length ? <em>{l.khac.join(' ')}</em> : null}
        </button>
      ))}
      <p className="ct-goiy-chan">↑↓ chọn · Enter hoặc Tab để dùng · Esc để bỏ</p>
    </div>
  );
}
