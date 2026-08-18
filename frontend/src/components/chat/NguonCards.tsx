'use client';

/**
 * ============================================================
 * THẺ NGUỒN — trang web AI đã dùng để trả lời
 * ============================================================
 *
 * Số trên thẻ KHỚP với `[1]`, `[2]` trong câu trả lời. Model được dặn ghi số
 * ngay sau câu nó dùng nguồn đó (xem `goiChoModel` ở backend); không đánh số
 * ở đây thì người đọc thấy `[2]` mà không biết `[2]` là trang nào — tệ hơn là
 * không có gì.
 *
 * ⚠️ Favicon lấy TỪ CHÍNH TRANG ĐÓ, không qua dịch vụ favicon của Google.
 * Dùng Google thì mỗi lần hiện thẻ là một lần báo cho họ biết người dùng đang
 * đọc gì — đi ngược đúng lý do web này tự dựng máy tìm kiếm thay vì mua API.
 * Đổi lại nhiều trang không có `/favicon.ico`; hỏng thì ẨN ảnh chứ không hiện
 * ô vỡ, thẻ vẫn đọc được bằng số + tiêu đề + tên miền.
 */
import type { NguonWeb } from '@/types';

export function NguonCards({ nguon }: { nguon: NguonWeb[] }) {
  if (!nguon.length) return null;
  return (
    <div className="mt-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
      <p
        className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Nguồn
      </p>
      <ul className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
        {nguon.map((n, i) => (
          <li key={`${n.url}-${i}`}>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              title={n.url}
              className="flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors hover:opacity-90"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            >
              <span
                className="grid h-[18px] w-[18px] flex-none place-items-center rounded text-[10px] font-semibold"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
              >
                {i + 1}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://${n.mien}/favicon.ico`}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 flex-none rounded-sm"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="min-w-0">
                <span
                  className="block truncate text-[12px] font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {n.tieuDe}
                </span>
                <span className="block text-[10.5px]" style={{ color: 'var(--text-tertiary)' }}>
                  {n.mien}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
