'use client';

/**
 * Dải "Bắt đầu nhanh" ở đầu trang danh sách.
 *
 * Trang gốc dành chỗ này cho ba ô quảng cáo đối tác. Ở đây đổi thành ba bước
 * thật sự cần để một component chạy được: có Node, có Claude Code, rồi mới tới
 * lệnh cài. Thiếu bước 2 là lệnh `npx` chạy xong nhưng chẳng có gì gọi tới
 * component vừa cài — lỗi rất hay gặp mà thông báo thì không nói gì.
 *
 * Gấp lại được và nhớ trạng thái: người quay lại lần thứ mười không cần đọc
 * lại hướng dẫn, nhưng người mới thì phải thấy nó ngay lần đầu.
 */

import { useEffect, useState } from 'react';
import { ChevronDown, Terminal } from 'lucide-react';
import { CLI } from '@/lib/ai-templates/install';
import CopyButton from './CopyButton';

const KEY = 'ai-templates:quickstart-collapsed';

const STEPS = [
  {
    n: '1',
    title: 'Cần Node.js 18 trở lên',
    body: 'CLI chạy qua npx nên không phải cài gì thêm, nhưng máy phải có Node. Kiểm bằng `node -v`.',
    code: 'node -v',
  },
  {
    n: '2',
    title: 'Cần Claude Code đã cài sẵn',
    body: 'Component được chép vào thư mục `.claude/` của dự án — không có Claude Code thì không có gì đọc chúng.',
    code: 'npm i -g @anthropic-ai/claude-code',
  },
  {
    n: '3',
    title: 'Cài component, chạy tại gốc dự án',
    body: 'Mở trang chi tiết của component bất kỳ để lấy lệnh chính xác, hoặc gom nhiều món vào Stack rồi lấy một lệnh gộp.',
    code: `${CLI} --skill <danh-mục>/<tên>`,
  },
];

export default function QuickStart() {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(KEY) === '1') setOpen(false);
    } catch {
      // chế độ riêng tư — cứ để mở
    }
  }, []);

  const toggle = () => {
    setOpen((v) => {
      try {
        localStorage.setItem(KEY, v ? '1' : '0');
      } catch {
        // bỏ qua
      }
      return !v;
    });
  };

  return (
    <section className="mb-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
      >
        <Terminal size={15} className="text-[var(--accent-color)]" />
        <span className="font-heading text-[13.5px] font-semibold text-[var(--text-primary)]">
          Bắt đầu nhanh — ba bước trước khi cài bất cứ thứ gì
        </span>
        <ChevronDown
          size={15}
          className={`ml-auto text-[var(--text-muted)] transition-transform ${
            mounted && open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {mounted && open && (
        <div className="grid gap-2.5 border-t border-[var(--border-color)] p-4 md:grid-cols-3">
          {STEPS.map((s) => (
            // `min-w-0` là BẮT BUỘC: ô lưới mặc định `min-width: auto`, tức
            // nó từ chối co nhỏ hơn nội dung. Dòng lệnh `npx …` bên trong dài
            // hơn màn hình điện thoại, nên thiếu dòng này thì cả thẻ phình ra
            // 480px trong khung 375px và `truncate` không bao giờ có tác dụng.
            <div
              key={s.n}
              className="min-w-0 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3"
            >
              <p className="flex items-center gap-2 font-heading text-[13px] font-semibold text-[var(--text-primary)]">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--accent-color)] font-mono text-[11px] text-white">
                  {s.n}
                </span>
                {s.title}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                {s.body}
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <code className="min-w-0 flex-1 truncate rounded-md border border-[var(--border-color)] bg-[var(--bg-card)] px-2 py-1.5 font-mono text-[11.5px] text-[var(--text-secondary)]">
                  {s.code}
                </code>
                <CopyButton value={s.code} iconOnly title={`Chép: ${s.code}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
