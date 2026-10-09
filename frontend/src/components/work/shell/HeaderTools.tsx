'use client';

/**
 * Cụm công cụ bên phải thanh trên (≥md): ô tìm ⌘K · chuông · người dùng.
 * Trên điện thoại chúng nằm trong ngăn điều hướng (☰) — thanh trên ở 390px
 * chỉ đủ chỗ cho tiêu đề + các nút của trang.
 */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CircleHelp, Inbox, KeyRound, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Popover, UserAvatar, useToggle } from '../ui';
import { openHelp } from '../help/store';
import WorkInbox from './WorkInbox';

/** Sự kiện mở bảng lệnh ⌘K từ một nút (CommandPalette lắng nghe). */
export const OPEN_PALETTE_EVENT = 'work:open-palette';
export const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

function useIsMac() {
  const [mac, setMac] = useState(true);
  useEffect(() => { setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)); }, []);
  return mac;
}

export function SearchTrigger() {
  const mac = useIsMac();
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search and jump (Command K)"
      title="Search issues, projects and commands"
      className="group flex h-[30px] min-w-0 items-center gap-2 rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-2.5 text-[13px] text-[var(--w-text-3)] transition-colors hover:border-[var(--w-border-strong)] hover:text-[var(--w-text-2)] xl:w-[180px] 2xl:w-[240px]"
    >
      <Search size={14} className="shrink-0" />
      {/* UX-A: dưới 1280px (khổ app desktop) chỉ còn icon — nhường chỗ cho tên dự án. */}
      <span className="truncate max-xl:hidden">Search or jump to…</span>
      <kbd className="w-kbd ml-auto shrink-0 whitespace-nowrap max-xl:!hidden">{mac ? '⌘' : 'Ctrl'}K</kbd>
    </button>
  );
}

function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  if (!user) return null;
  const u = { username: user.username, fullName: user.fullName ?? null, displayName: user.displayName ?? null, avatarUrl: user.avatarUrl ?? null };
  const item = 'flex h-8 w-full items-center gap-2.5 rounded-[6px] px-2 text-left text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]';
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={pop.toggle}
        aria-haspopup="menu"
        aria-expanded={pop.on}
        aria-label="Account"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-shadow hover:shadow-[0_0_0_3px_var(--w-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]"
      >
        <UserAvatar user={u} size={26} />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={240} align="end">
        <div role="menu" className="p-1">
          <div className="flex items-center gap-2.5 px-2 pb-2 pt-1.5">
            <UserAvatar user={u} size={30} />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-semibold">{user.displayName || user.fullName || user.username}</span>
              <span className="block truncate text-[12px] text-[var(--w-text-3)]">@{user.username}</span>
            </span>
          </div>
          <div className="my-1 border-t border-[var(--w-border)]" />
          <Link role="menuitem" href="/work?tab=my-work" onClick={pop.close} className={item}><Inbox size={14} /> My work</Link>
          <Link role="menuitem" href="/work/developer" onClick={pop.close} className={item}><KeyRound size={14} /> API tokens</Link>
          <button role="menuitem" type="button" onClick={() => { pop.close(); openHelp(); }} className={item}><CircleHelp size={14} /> Help &amp; guide</button>
          <div className="my-1 border-t border-[var(--w-border)]" />
          <Link role="menuitem" href="/" onClick={pop.close} className={item}><ArrowLeft size={14} /> Back to CuongThai</Link>
        </div>
      </Popover>
    </>
  );
}

/** Ô tìm + chuông + người dùng; ẩn dưới md. Cụm nút của trang đứng ngay trước phải mang class `w-header-actions`. */
export default function HeaderTools() {
  return (
    <div className="w-tools flex shrink-0 items-center gap-1.5 max-md:!hidden">
      {/* Vạch ngăn chỉ hiện khi ngay trước nó là cụm nút KHÔNG rỗng của trang (.w-header-actions) — work.css. */}
      <span aria-hidden="true" className="w-tools-sep mx-1 h-5 w-px bg-[var(--w-border)]" />
      <SearchTrigger />
      <WorkInbox align="end" />
      <UserMenu />
    </div>
  );
}
