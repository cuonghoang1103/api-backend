'use client';

/**
 * ============================================================
 * HỎI MỘT DÒNG — thay `window.prompt`, chạy được ở CẢ desktop
 * ============================================================
 *
 * ⚠️⚠️ VÌ SAO TỆP NÀY TỒN TẠI: `window.prompt` KHÔNG CHẠY TRONG ELECTRON.
 *
 * Đo thật trong bản app đã build (09/09/2026):
 *
 *     typeof window.prompt : function
 *     gọi thử trả về       : null
 *     có ném không         : Error: prompt() is not supported.
 *
 * Nó NÉM, chứ không phải trả `null` — nên mọi câu lệnh sau nó trong cùng hàm
 * cũng không chạy. Trên web thì hộp thoại hiện ra bình thường; trên desktop
 * người dùng bấm nút và KHÔNG CÓ GÌ XẢY RA, không lỗi nào trên màn hình.
 * Trang Notes của desktop dùng lại nguyên mã web (xem `NotesPage.tsx` bên
 * desktop), nên mọi `window.prompt` trong cây Notes đều là một nút chết ở đó.
 *
 * ⛔ ĐỪNG THÊM `window.prompt`/`window.alert` MỚI vào cây Notes. `confirm` thì
 * Electron CÓ hỗ trợ (đã đo) nên các chỗ xác nhận xoá vẫn để nguyên.
 *
 * Đổi lại còn được hai thứ mà prompt của trình duyệt không cho: hộp thoại nằm
 * trong chủ đề của Notes (sáng/tối/nâu), và nhãn nói rõ đang hỏi cái gì thay
 * vì một khung xám của hệ điều hành.
 */
import { useEffect, useRef, useState } from 'react';

export interface HoiMotDongProps {
  /** Tiêu đề — nói rõ đang hỏi cái gì. */
  tieuDe: string;
  /** Giá trị điền sẵn. */
  banDau?: string;
  /** Gợi ý trong ô khi trống. */
  goiY?: string;
  /** Chữ trên nút đồng ý. Mặc định "Xong". */
  nhanXong?: string;
  /** `null` = người dùng huỷ. Chuỗi = giá trị đã nhập (CHƯA cắt khoảng trắng). */
  onXong: (gt: string | null) => void;
}

export function HoiMotDong({ tieuDe, banDau = '', goiY, nhanXong = 'Xong', onXong }: HoiMotDongProps) {
  const [gt, datGt] = useState(banDau);
  const oRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* Focus ở khung hình SAU: hộp thoại vừa gắn vào cây, và nhiều chỗ mở nó
       từ trong một menu đang tự đóng — menu đó cướp lại focus nếu ta lấy ngay
       trong lượt này. */
    const id = requestAnimationFrame(() => {
      oRef.current?.focus();
      oRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const phim = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') { e.preventDefault(); onXong(null); }
    };
    window.addEventListener('keydown', phim);
    return () => window.removeEventListener('keydown', phim);
  }, [onXong]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
      onClick={() => onXong(null)}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={tieuDe}
      >
        <p className="mb-2 text-[13px] font-medium text-slate-800 dark:text-slate-100">{tieuDe}</p>
        <input
          ref={oRef}
          value={gt}
          onChange={(e) => datGt(e.target.value)}
          placeholder={goiY}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-teal-500 dark:border-white/15 dark:bg-slate-800 dark:text-slate-100"
          onKeyDown={(e) => {
            /* Bộ gõ tiếng Việt/Nhật dùng Enter để CHỐT chữ đang dựng — cướp
               mất là gõ được nửa chữ thì hộp thoại tự đóng. Xem
               [[feedback_ime_composing_guard]]. */
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') { e.preventDefault(); onXong(gt); }
          }}
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onXong(null)}
            className="rounded-lg px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={() => onXong(gt)}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-teal-500"
          >
            {nhanXong}
          </button>
        </div>
      </div>
    </div>
  );
}
