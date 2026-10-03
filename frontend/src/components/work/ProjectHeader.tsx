'use client';

/**
 * Thanh tiêu đề dùng chung cho các trang trong một dự án — cao 52px.
 * ≥md: breadcrumb một dòng  Workspace › [mark] Project › Trang  + nút của trang
 *      + cụm công cụ chung (⌘K · chuông · người dùng, xem shell/HeaderTools).
 * <md: nút ☰ + hai dòng xếp chồng (tên dự án nhỏ ở trên, tên trang ở dưới) để
 *      tên trang không bị cắt còn "Bo…" khi bốn nút hành động chiếm chỗ.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import AiButton from './ai/AiButton';
import { EditLockBanner, EditLockButton } from './editLock';
import HelpButton from './help/HelpButton';
import { MobileNavButton } from './shell/mobileNav';
import HeaderTools from './shell/HeaderTools';
import { cn } from '@/lib/utils';
import { ProjectMark } from './ui';

export function Crumb({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`flex min-w-0 items-center gap-1.5 truncate rounded-[4px] text-[var(--w-text-2)] transition-colors hover:text-[var(--w-text)] ${className ?? ''}`}>
      {children}
    </Link>
  );
}

export const CrumbSep = ({ className }: { className?: string }) => (
  <ChevronRight size={14} aria-hidden="true" className={`shrink-0 text-[var(--w-text-3)] opacity-70 ${className ?? ''}`} />
);

/** Phần breadcrumb (dùng chung cho header dự án và trang chi tiết thẻ). */
export function ProjectCrumbs({ config, title, extra, dense }: { config: ProjectConfig; title: ReactNode; extra?: ReactNode; dense?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center overflow-hidden">
      {/* ≥md: một dòng */}
      <div className="flex min-w-0 items-center gap-1.5 text-[13px] max-md:!hidden">
        <Crumb href={`/work/${config.workspace.slug}`} className={`max-w-[160px] ${dense ? 'max-2xl:!hidden' : 'max-lg:!hidden'}`}>{config.workspace.name}</Crumb>
        <CrumbSep className={dense ? 'max-2xl:!hidden' : 'max-lg:!hidden'} />
        <Crumb href={`/work/${config.workspace.slug}/${config.key}/board`} className="min-w-[24px] max-w-[220px] shrink">
          <ProjectMark k={config.key} size={18} />
          <span className="truncate">{config.name}</span>
        </Crumb>
        <CrumbSep />
        <h1 className="max-w-[60%] flex-none truncate text-[15px] font-semibold tracking-[-0.01em] text-[var(--w-text)]">{title}</h1>
        {extra}
        {config.archivedAt && (
          <span className="shrink-0 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] leading-[20px] text-[var(--w-text-2)]">Archived</span>
        )}
      </div>
      {/* <md: hai dòng */}
      <div className="flex min-w-0 flex-col leading-tight md:!hidden">
        <Link href={`/work/${config.workspace.slug}/${config.key}/board`} className="flex min-w-0 items-center gap-1 text-[11px] text-[var(--w-text-3)]">
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

export default function ProjectHeader({ config, title, children, extra, tools = true, wrap = false }: {
  config: ProjectConfig;
  title: string;
  children?: ReactNode;
  /** Mảnh nhỏ ngay sau tên trang (vd số thẻ). */
  extra?: ReactNode;
  /** false = bỏ cụm Help · Lock · Ask AI (trang tự có thanh nút dày). */
  tools?: boolean;
  /** true = trang có nhiều nút: điện thoại xuống dòng thứ hai cho nút, ẩn tên không gian tới 2xl. */
  wrap?: boolean;
}) {
  return (
    <>
      <header className={cn('w-header flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 md:gap-2.5 md:px-5', wrap && 'max-lg:h-auto max-lg:min-h-[52px] max-lg:flex-wrap max-lg:gap-y-1.5 max-lg:py-1.5')}>
        <MobileNavButton />
        <ProjectCrumbs config={config} title={title} extra={extra} dense={wrap} />
        <div className={cn('w-header-actions flex shrink-0 items-center gap-1.5', wrap && 'max-lg:order-last max-lg:w-full max-lg:flex-wrap max-lg:justify-end')}>
          {tools && (
            <>
              <HelpButton />
              <EditLockButton config={config} />
              <AiButton config={config} />
            </>
          )}
          {children}
        </div>
        <HeaderTools />
      </header>
      <EditLockBanner config={config} />
    </>
  );
}
