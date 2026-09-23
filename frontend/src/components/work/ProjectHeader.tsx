'use client';

/** Thanh tiêu đề dùng chung cho các trang trong một dự án. */

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ProjectConfig } from '@/lib/work-api';

export default function ProjectHeader({ config, title, children }: { config: ProjectConfig; title: string; children?: ReactNode }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--w-border)] px-4">
      <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
        <Link href={`/work/${config.workspace.slug}`} className="hidden truncate text-[var(--w-text-3)] hover:text-[var(--w-text)] sm:inline">{config.workspace.name}</Link>
        <span className="hidden text-[var(--w-text-3)] sm:inline">/</span>
        <Link href={`/work/${config.workspace.slug}/${config.key}/board`} className="truncate text-[var(--w-text-2)] hover:text-[var(--w-text)]">{config.name}</Link>
        <span className="text-[var(--w-text-3)]">/</span>
        <span className="truncate font-semibold">{title}</span>
        {config.archivedAt && <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] text-[var(--w-text-3)]">Archived</span>}
      </div>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
