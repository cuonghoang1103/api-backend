import type { Metadata } from 'next';
import Link from 'next/link';
import { Github, Command } from 'lucide-react';
import { SOURCE_REPO } from '@/lib/ai-templates/catalog';
import { getTotalCount } from '@/lib/ai-templates/data.server';
import StackBuilder from '@/components/ai-templates/StackBuilder';
import CommandPalette from '@/components/ai-templates/CommandPalette';

const SITE_URL = 'https://cuongthai.com';

export const metadata: Metadata = {
  title: {
    default: 'AI Templates — Kho component cho Claude Code',
    template: '%s | AI Templates',
  },
  description:
    'Duyệt và cài gần 1.900 skill, agent, slash command, MCP, hook và cấu hình dựng sẵn cho Claude Code. Tìm tiếng Việt, gom vào Stack rồi cài bằng một lệnh.',
  alternates: { canonical: `${SITE_URL}/ai-templates` },
};

/**
 * Khung chung cho cả kho AI Templates.
 *
 * Ba thứ đặt ở đây vì phải sống xuyên qua mọi trang con — nhảy từ danh sách
 * sang chi tiết mà giỏ bị dựng lại từ đầu là mất trạng thái đang mở:
 * - `StackBuilder`  — nút nổi + bảng giỏ cài đặt
 * - `CommandPalette` — bảng ⌘K
 * - Chân trang ghi công nguồn dữ liệu
 */
export default function AiTemplatesLayout({ children }: { children: React.ReactNode }) {
  const total = getTotalCount();

  return (
    <div className="min-h-screen">
      {/* `pt-20` chừa chỗ cho thanh điều hướng cố định của site — không có nó
          thì tiêu đề trang nằm LỌT dưới navbar (cùng lỗi đã sửa ở 29 trang
          khác). Xem `Navbar.tsx`. */}
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {children}

        <footer className="mt-14 border-t border-[var(--border-color)] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-2xl text-[12.5px] leading-relaxed text-[var(--text-muted)]">
              Danh mục {total.toLocaleString('vi-VN')} component lấy từ dự án mã nguồn mở{' '}
              <a
                href={SOURCE_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] underline underline-offset-2 hover:text-[var(--accent-color)]"
              >
                claude-code-templates
              </a>{' '}
              (giấy phép MIT). Bản quyền từng component thuộc về tác giả của nó; trang này chỉ làm
              phần duyệt, tìm và dựng lệnh cài bằng tiếng Việt.
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] sm:flex">
                <Command size={12} />
                <span>⌘K để tìm nhanh</span>
              </span>
              <a
                href={SOURCE_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
              >
                <Github size={13} />
                GitHub
              </a>
              <Link
                href="/ai-templates"
                className="rounded-lg border border-[var(--border-color)] px-2.5 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
              >
                Về đầu kho
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <StackBuilder />
      <CommandPalette />
    </div>
  );
}
