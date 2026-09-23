'use client';

/**
 * Thanh tiêu đề dùng chung cho các trang trong một dự án — cao 52px,
 * breadcrumb Workspace / Project / Trang (điện thoại bỏ Workspace), nút ☰
 * trên điện thoại (thay thanh riêng của layout, xem shell/mobileNav).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';
import AiButton from './ai/AiButton';
import HelpButton from './help/HelpButton';
import { MobileNavButton } from './shell/mobileNav';

export function Crumb({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`min-w-0 truncate rounded-[4px] text-[var(--w-text-2)] transition-colors hover:text-[var(--w-text)] ${className ?? ''}`}>
      {children}
    </Link>
  );
}

export const CrumbSep = ({ className }: { className?: string }) => (
  <ChevronRight size={14} aria-hidden="true" className={`shrink-0 text-[var(--w-text-3)] ${className ?? ''}`} />
);

export default function ProjectHeader({ config, title, children }: { config: ProjectConfig; title: string; children?: ReactNode }) {
  return (
    <header className="w-header flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 md:gap-3 md:px-5">
      <MobileNavButton />
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-[14px]">
        <Crumb href={`/work/${config.workspace.slug}`} className="max-w-[180px] max-sm:hidden">{config.workspace.name}</Crumb>
        <CrumbSep className="max-sm:hidden" />
        <Crumb href={`/work/${config.workspace.slug}/${config.key}/board`} className="max-w-[220px] max-sm:max-w-[40vw]">
          <span className="mr-1.5 font-mono text-[12px] text-[var(--w-text-3)] max-md:hidden">{config.key}</span>
          {config.name}
        </Crumb>
        <CrumbSep />
        <h1 className="min-w-0 truncate text-[15px] font-semibold text-[var(--w-text)]">{title}</h1>
        {config.archivedAt && (
          <span className="shrink-0 rounded-full border border-[var(--w-border-strong)] px-2 text-[12px] leading-[20px] text-[var(--w-text-2)]">Archived</span>
        )}
      </nav>
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        <HelpButton />
        <AiButton config={config} />
        {children}
      </div>
    </header>
  );
}
