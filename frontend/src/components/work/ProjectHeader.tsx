'use client';

/**
 * Thanh tiêu đề dùng chung cho các trang trong một dự án — cao 52px.
 * ≥md: breadcrumb một dòng  Workspace › [mark] Project › Trang  + nút của trang
 *      + "More" (Help, khoá sửa) + cụm công cụ chung (⌘K · chuông · người dùng).
 * <md: nút ☰ + hai dòng xếp chồng (tên dự án nhỏ ở trên, tên trang ở dưới).
 *
 * UX-A P0-1 (09/10/2026): ở khổ app desktop (1180px) sáu nút của Board nuốt hết
 * breadcrumb — chỉ còn "‹ › C › Sprint 1". Giờ header ĐO chỗ thật (ResizeObserver),
 * không đoán theo breakpoint:
 *   · Help + Lock luôn nằm trong menu "More" (…) — chúng ít dùng, chiếm ~140px.
 *   · Tên dự án + tên trang được giữ tối thiểu ~320px (dài hơn thì cắt, có tooltip).
 *     Không đủ chỗ ⇒ nút của trang XUỐNG HÀNG 2 thay vì nén breadcrumb.
 *   · Tên workspace chỉ hiện khi còn dư chỗ; luôn có trong tooltip của tên dự án.
 */

import Link from 'next/link';
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronRight, CircleHelp, Lock, LockOpen, MoreHorizontal } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import AiButton from './ai/AiButton';
import { EditLockBanner, useEditLock } from './editLock';
import { openContextualHelp } from './help/store';
import { MobileNavButton } from './shell/mobileNav';
import HeaderTools from './shell/HeaderTools';
import { cn } from '@/lib/utils';
import { Popover, ProjectMark, useToggle } from './ui';
import ProjectCover from './cover/ProjectCover'; // UX-D

export function Crumb({ href, children, className, title }: { href: string; children: ReactNode; className?: string; title?: string }) {
  return (
    <Link href={href} title={title} className={`flex min-w-0 items-center gap-1.5 truncate rounded-[4px] text-[var(--w-text-2)] transition-colors hover:text-[var(--w-text)] ${className ?? ''}`}>
      {children}
    </Link>
  );
}

export const CrumbSep = ({ className }: { className?: string }) => (
  <ChevronRight size={14} aria-hidden="true" className={`shrink-0 text-[var(--w-text-3)] opacity-70 ${className ?? ''}`} />
);

/** Phần breadcrumb. `showWs` do ProjectHeader quyết theo chỗ đo được. */
export function ProjectCrumbs({ config, title, extra, showWs = true }: { config: ProjectConfig; title: ReactNode; extra?: ReactNode; showWs?: boolean }) {
  const projectTip = `${config.workspace.name} › ${config.name}`;
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center overflow-hidden">
      {/* ≥md: một dòng */}
      <div className="flex min-w-0 items-center gap-1.5 text-[13px] max-md:!hidden">
        {showWs && (
          <>
            <Crumb href={`/work/${config.workspace.slug}`} className="max-w-[160px] shrink-[2]" title={config.workspace.name}>{config.workspace.name}</Crumb>
            <CrumbSep />
          </>
        )}
        <Crumb href={`/work/${config.workspace.slug}/${config.key}/board`} className="min-w-[48px] max-w-[240px] shrink" title={projectTip}>
          <ProjectMark k={config.key} size={18} brand={config} />
          <span className="truncate">{config.name}</span>
        </Crumb>
        <CrumbSep />
        <h1 className="max-w-[60%] flex-none truncate text-[15px] font-semibold tracking-[-0.01em] text-[var(--w-text)]" title={typeof title === 'string' ? title : undefined}>{title}</h1>
        {extra && <span data-crumb-extra className="flex shrink-0 items-center">{extra}</span>}
        {config.archivedAt && (
          <span className="shrink-0 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] leading-[20px] text-[var(--w-text-2)]">Archived</span>
        )}
      </div>
      {/* <md: hai dòng */}
      <div className="flex min-w-0 flex-col leading-tight md:!hidden">
        <Link href={`/work/${config.workspace.slug}/${config.key}/board`} title={projectTip} className="flex min-w-0 items-center gap-1 text-[11px] text-[var(--w-text-3)]">
          <span className="font-mono">{config.key}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{config.name}</span>
        </Link>
        <span className="flex min-w-0 items-center gap-1.5">
          <span role="heading" aria-level={1} className="min-w-[3ch] truncate text-[15px] font-semibold text-[var(--w-text)]">{title}</span>
          {extra}
        </span>
      </div>
    </nav>
  );
}

const MENU_ITEM = 'flex h-8 w-full items-center gap-2.5 rounded-[6px] px-2 text-left text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)] disabled:opacity-50';

/** Menu "More" (…): các nút phụ của header dự án. */
function MoreMenu({ config, items }: { config: ProjectConfig; items?: ReactNode }) {
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const lock = useEditLock(config);
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={pop.toggle}
        aria-haspopup="menu"
        aria-expanded={pop.on}
        aria-label={lock.locked ? 'More actions (editing is locked)' : 'More actions'}
        title={lock.locked ? 'More — editing is locked' : 'More: help, edit lock'}
        className={cn('w-btn w-btn-icon shrink-0', lock.locked && 'w-btn-warn')}
        data-testid="project-header-more"
      >
        {lock.locked ? <Lock size={14} /> : <MoreHorizontal size={16} className="text-[var(--w-text-2)]" />}
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={232} align="end">
        <div role="menu" aria-label="More actions" className="p-1">
          {items}
          <button role="menuitem" type="button" className={MENU_ITEM} onClick={() => { pop.close(); openContextualHelp(); }}>
            <CircleHelp size={14} /> Help for this page <kbd className="w-kbd ml-auto">?</kbd>
          </button>
          {lock.ready && (
            <button role="menuitem" type="button" className={MENU_ITEM} disabled={lock.pending} onClick={() => { pop.close(); lock.toggle(); }}>
              {lock.locked ? <LockOpen size={14} /> : <Lock size={14} />}
              {lock.locked ? 'Unlock editing' : 'Lock editing'}
            </button>
          )}
        </div>
      </Popover>
    </>
  );
}

/** Đo bề ngang tự nhiên của mấy con (không phụ thuộc chúng đang co hay xuống hàng). */
function childrenWidth(el: HTMLElement | null, gap = 6): number {
  if (!el) return 0;
  const kids = Array.from(el.children) as HTMLElement[];
  const shown = kids.filter((k) => k.getBoundingClientRect().width > 0);
  return shown.reduce((w, k) => w + k.getBoundingClientRect().width, 0) + gap * Math.max(0, shown.length - 1);
}

export default function ProjectHeader({ config, title, children, extra, tools = true, more }: {
  config: ProjectConfig;
  title: string;
  children?: ReactNode;
  /** Mảnh nhỏ ngay sau tên trang (vd số thẻ). */
  extra?: ReactNode;
  /** false = bỏ cụm More · Ask AI (trang tự có thanh nút dày / trang khách). */
  tools?: boolean;
  /** Mục thêm vào đầu menu "More" (role="menuitem"). */
  more?: ReactNode;
  /** @deprecated — header tự đo chỗ và cho nút xuống hàng 2 khi cần. */
  wrap?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const actRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const wsMeasureRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState<{ stack: boolean; showWs: boolean }>({ stack: false, showWs: true });
  // UX-E: chống dao động. Mở sidebar từ thanh icon (60 → 248px, có chuyển động) trên Board/Docs từng làm
  // header đổi stack ↔ không stack liên tục trong cùng một lần vẽ ⇒ React #185 (Maximum update depth),
  // cả trang trắng (có từ trước UX-E; ⌘\ làm nó dễ gặp hơn). Hai chốt: (1) đã xuống hàng thì phải dư
  // ≥16px mới lên lại; (2) đổi quá 6 lần trong cùng một lượt vẽ ⇒ dừng, khung hình sau đo lại từ đầu.
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const flips = useRef({ n: 0 });
  const remeasure = useRef<() => void>(() => {});

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const cs = getComputedStyle(row);
    const avail = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const narrow = window.innerWidth < 768;
    const gap = 10;
    const acts = childrenWidth(actRef.current);
    const toolsW = toolsRef.current?.getBoundingClientRect().width ?? 0;
    const menuBtn = narrow ? 36 : 0;
    // Tên dự án + trang: dài tự nhiên (đo bằng bản sao ẩn), giữ tối thiểu ~320px (điện thoại 150px).
    const extraW = (row.querySelector('[data-crumb-extra]') as HTMLElement | null)?.getBoundingClientRect().width ?? 0;
    const crumbNat = (measureRef.current?.getBoundingClientRect().width ?? 200) + 52 + (extraW ? extraW + 6 : 0);
    const crumbMin = Math.min(crumbNat, narrow ? 150 : 360);
    const wsW = Math.min(wsMeasureRef.current?.getBoundingClientRect().width ?? 0, 160) + 20;
    const fixed = toolsW + menuBtn + gap * 2;
    const stack = acts > 0 && crumbMin + acts + fixed > avail - (layoutRef.current.stack ? 16 : 0);
    const rest = avail - fixed - (stack ? 0 : acts);
    const showWs = !narrow && crumbNat + wsW <= rest;
    const l = layoutRef.current;
    if (l.stack === stack && l.showWs === showWs) return;
    const f = flips.current;
    // Đếm số lần đổi trong CÙNG một lượt chạy đồng bộ; khung hình kế tiếp đếm lại từ 0 và đo lại.
    if (f.n === 0) requestAnimationFrame(() => { const again = flips.current.n > 6; flips.current.n = 0; if (again) remeasure.current(); });
    f.n += 1;
    if (f.n > 6) return;
    layoutRef.current = { stack, showWs };
    setLayout(layoutRef.current);
  }, []);

  remeasure.current = measure;
  useLayoutEffect(() => {
    measure();
  });
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(row);
    if (actRef.current) ro.observe(actRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const actions = (
    <div ref={actRef} className={cn('w-header-actions flex shrink-0 items-center gap-1.5', layout.stack && 'flex-wrap justify-end')}>
      {tools && <AiButton config={config} />}
      {children}
      {tools && <MoreMenu config={config} items={more} />}
    </div>
  );

  return (
    <>
      <header className="w-header relative flex shrink-0 flex-col border-b border-[var(--w-border)]" data-stacked={layout.stack || undefined}>
        {/* UX-D: ruy-băng ảnh bìa 3px ở mép trên — nhận ra dự án, không chiếm chỗ (absolute, header vẫn cao 52px). */}
        {config.coverUrl && <ProjectCover brand={config} className="pointer-events-none !absolute inset-x-0 top-0 h-[3px]" />}
        {/* Bản sao ẩn để đo bề ngang tự nhiên của breadcrumb (không cắt chữ). */}
        <span aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap text-[13px]">
          <span ref={measureRef} className="flex items-center gap-1.5">
            <span>{config.name}</span>
            <span className="text-[15px] font-semibold">{title}</span>
          </span>
          <span ref={wsMeasureRef}>{config.workspace.name}</span>
        </span>
        <div ref={rowRef} className="flex h-[52px] min-w-0 items-center gap-2 px-3 md:gap-2.5 md:px-5">
          <MobileNavButton />
          <ProjectCrumbs config={config} title={title} extra={extra} showWs={layout.showWs} />
          {!layout.stack && actions}
          <div ref={toolsRef} className="flex shrink-0 items-center"><HeaderTools /></div>
        </div>
        {layout.stack && (
          <div className="flex min-w-0 items-center justify-end border-t border-[var(--w-border)] px-3 py-1.5 md:px-5">
            {actions}
          </div>
        )}
      </header>
      <EditLockBanner config={config} />
    </>
  );
}
