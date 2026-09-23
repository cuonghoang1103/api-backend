'use client';

/**
 * Sidebar CT Work: đổi không gian, danh sách dự án, điều hướng trong dự án.
 * Đọc slug/key từ đường dẫn — sidebar sống ở layout nên không nhận params.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, FlaskConical, BarChart3, ChevronDown, Columns3, LayoutDashboard, List, ListOrdered, Plus, Settings, Users, LayoutGrid, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from './hooks';
import { Popover, UserAvatar, useToggle } from './ui';

export function useWorkPath() {
  const pathname = usePathname() ?? '';
  const parts = pathname.split('/').filter(Boolean); // ['work', slug, key, view, ...]
  const slug = parts[1] && parts[1] !== 'invite' ? decodeURIComponent(parts[1]) : undefined;
  const key = parts[2] && parts[2] !== 'settings' ? decodeURIComponent(parts[2]).toUpperCase() : undefined;
  const view = parts[3];
  return { pathname, slug, key, view };
}

function NavItem({ href, icon: Icon, label, active, indent }: { href: string; icon: typeof List; label: string; active: boolean; indent?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex h-[28px] items-center gap-2 rounded-[5px] px-2 text-[13px] transition-colors',
        indent && 'pl-7',
        active ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
      )}
    >
      <Icon size={14} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function WorkSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname, slug, key, view } = useWorkPath();
  const user = useAuthStore((s) => s.user);
  const switcher = useToggle();
  const switcherRef = useRef<HTMLButtonElement>(null);

  const workspaces = useQuery({ queryKey: wk.workspaces, queryFn: workApi.workspaces, staleTime: 60_000 });
  const ws = useQuery({ queryKey: wk.workspace(slug ?? ''), queryFn: () => workApi.workspaceBySlug(slug!), enabled: !!slug, staleTime: 30_000 });
  const current = workspaces.data?.find((w) => w.slug === slug);
  const projects = (ws.data?.projects ?? []).filter((p) => !p.archivedAt);

  return (
    <nav className="flex h-full flex-col text-[13px]" onClick={(e) => (e.target as HTMLElement).closest('a') && onNavigate?.()}>
      <div className="px-2 pb-2 pt-3">
        <button
          ref={switcherRef}
          type="button"
          onClick={switcher.toggle}
          className="flex h-[34px] w-full items-center gap-2 rounded-[6px] px-2 text-left hover:bg-[var(--w-hover)]"
        >
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] bg-[var(--w-accent)] text-[11px] font-bold text-white">
            {(current?.name ?? 'CT').slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{current?.name ?? 'CT Work'}</span>
          </span>
          <ChevronDown size={14} className="shrink-0 text-[var(--w-text-3)]" />
        </button>
        <Popover open={switcher.on} onClose={switcher.close} anchorRef={switcherRef} width={248}>
          <div className="p-1">
            <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Workspaces</div>
            {workspaces.data?.map((w) => (
              <Link
                key={w.id}
                href={`/work/${w.slug}`}
                onClick={switcher.close}
                className="flex items-center gap-2 rounded-[5px] px-2 py-1.5 hover:bg-[var(--w-hover)]"
              >
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--w-sunken)] text-[9px] font-bold text-[var(--w-text-2)]">
                  {w.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate">{w.name}</span>
                {w.slug === slug && <Check size={13} className="text-[var(--w-accent-text)]" />}
              </Link>
            ))}
            <div className="my-1 border-t border-[var(--w-border)]" />
            <Link href="/work?new=1" onClick={switcher.close} className="flex items-center gap-2 rounded-[5px] px-2 py-1.5 text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
              <Plus size={14} /> Create workspace
            </Link>
            <Link href="/work" onClick={switcher.close} className="flex items-center gap-2 rounded-[5px] px-2 py-1.5 text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
              <LayoutGrid size={14} /> All workspaces
            </Link>
          </div>
        </Popover>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {slug && (
          <>
            <NavItem href={`/work/${slug}`} icon={LayoutGrid} label="Projects" active={pathname === `/work/${slug}`} />
            <NavItem href={`/work/${slug}/settings`} icon={Users} label="Members & settings" active={pathname.startsWith(`/work/${slug}/settings`)} />

            <div className="mb-1 mt-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Projects</span>
              <Link href={`/work/${slug}?newProject=1`} className="rounded p-0.5 text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]" title="Create project">
                <Plus size={13} />
              </Link>
            </div>
            {projects.map((p) => {
              const open = key === p.key;
              const base = `/work/${slug}/${p.key}`;
              return (
                <div key={p.id} className="mb-0.5">
                  <Link
                    href={`${base}/board`}
                    className={cn(
                      'flex h-[28px] items-center gap-2 rounded-[5px] px-2 transition-colors',
                      open ? 'text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]',
                    )}
                  >
                    <span className="w-[34px] shrink-0 truncate font-mono text-[10.5px] font-semibold text-[var(--w-text-3)]">{p.key}</span>
                    <span className="truncate">{p.name}</span>
                  </Link>
                  {open && (
                    <div className="mt-0.5 space-y-0.5">
                      <NavItem href={`${base}/board`} icon={Columns3} label="Board" active={view === 'board' || view === undefined} indent />
                      <NavItem href={`${base}/backlog`} icon={ListOrdered} label="Backlog" active={view === 'backlog'} indent />
                      <NavItem href={`${base}/list`} icon={List} label="Issues" active={view === 'list' || view === 'issue'} indent />
                      <NavItem href={`${base}/tests`} icon={FlaskConical} label="Tests" active={view === 'tests'} indent />
                      <NavItem href={`${base}/reports`} icon={BarChart3} label="Reports" active={view === 'reports'} indent />
                      <NavItem href={`${base}/dashboards`} icon={LayoutDashboard} label="Dashboards" active={view === 'dashboards'} indent />
                      <NavItem href={`${base}/settings`} icon={Settings} label="Project settings" active={view === 'settings'} indent />
                    </div>
                  )}
                </div>
              );
            })}
            {ws.data && !projects.length && (
              <p className="px-2 py-1 text-[12px] text-[var(--w-text-3)]">No projects yet.</p>
            )}
          </>
        )}
      </div>

      <div className="border-t border-[var(--w-border)] p-2">
        <Link href="/" className="flex h-[28px] items-center gap-2 rounded-[5px] px-2 text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]">
          <ArrowLeft size={14} /> Back to CuongThai
        </Link>
        {user && (
          <div className="mt-1 flex items-center gap-2 px-2 py-1">
            <UserAvatar user={{ username: user.username, fullName: user.fullName ?? null, displayName: user.displayName ?? null, avatarUrl: user.avatarUrl ?? null }} size={20} />
            <span className="truncate text-[12px] text-[var(--w-text-2)]">{user.displayName || user.fullName || user.username}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
