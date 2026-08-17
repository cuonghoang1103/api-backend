'use client';

/**
 * Đường dẫn trang cha, hiện ngay trên tiêu đề ghi chú.
 *
 * ─── Vì sao cần ───
 * Trang lồng nhau đã có từ lâu, nhưng khi đang ở một trang con cấp ba thì
 * không có gì trên màn hình nói cho biết nó nằm dưới trang nào. Người dùng
 * phải mở sidebar và dò ngược lên — hoặc tệ hơn, không nhận ra mình đang ở
 * trang con và tưởng nội dung cha đã mất.
 *
 * ─── Dữ liệu đã có sẵn ───
 * `GET /notes/notes/:id/backlinks` VỐN ĐÃ trả về `breadcrumb` (xem
 * `ancestorsOf` ở backend). Trước nay frontend nhận nó về rồi chỉ lấy đúng
 * phần tử cuối để biết id cha, còn cả chuỗi thì bỏ đi. Ở đây chỉ vẽ ra.
 */
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbEntry { id: number; title: string }

export default function NoteBreadcrumb({
  trail, subjectName, onOpen,
}: {
  trail: BreadcrumbEntry[];
  subjectName?: string | null;
  onOpen: (noteId: number) => void;
}) {
  // Trang gốc không có tổ tiên. Vẫn hiện tên môn nếu có — nó cho biết trang
  // này thuộc sổ tay nào, thứ vẫn hữu ích khi mở từ tìm kiếm.
  if (trail.length === 0 && !subjectName) return null;

  /* Chuỗi quá dài thì rút gọn ở GIỮA, giữ lại gốc và cha trực tiếp.
   * Cắt ở cuối sẽ mất đúng phần tử quan trọng nhất (cha trực tiếp), còn cắt ở
   * đầu thì mất bối cảnh gốc. Notion cũng rút ở giữa vì lý do này. */
  const shown: (BreadcrumbEntry | 'gap')[] =
    trail.length > 4 ? [trail[0]!, 'gap', trail[trail.length - 2]!, trail[trail.length - 1]!] : trail;

  return (
    <nav aria-label="Đường dẫn trang" className="mb-1 flex flex-wrap items-center gap-0.5 text-[11.5px] text-slate-500 dark:text-slate-400">
      {subjectName && (
        <>
          <span className="max-w-[10rem] truncate">{subjectName}</span>
          {shown.length > 0 && <ChevronRight size={11} className="shrink-0 opacity-50" aria-hidden />}
        </>
      )}
      {shown.map((entry, index) => (
        <span key={entry === 'gap' ? `gap-${index}` : entry.id} className="flex items-center gap-0.5">
          {entry === 'gap' ? (
            <span className="px-0.5" aria-label="còn nữa">…</span>
          ) : (
            <button
              type="button"
              onClick={() => onOpen(entry.id)}
              className="max-w-[12rem] truncate rounded px-1 py-0.5 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-slate-100"
            >
              {entry.title || 'Không có tiêu đề'}
            </button>
          )}
          {index < shown.length - 1 && <ChevronRight size={11} className="shrink-0 opacity-50" aria-hidden />}
        </span>
      ))}
    </nav>
  );
}
