'use client';

/**
 * Sidebar CT Work: đổi không gian + chuông thông báo, "My work" luôn ở trên
 * cùng, danh sách dự án, điều hướng trong dự án chia nhóm (Planning · Work ·
 * Insights). Đọc slug/key từ đường dẫn — sidebar sống ở layout nên không nhận params.
 */

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, CalendarRange, CircleHelp, KeyRound, FlaskConical, Rocket, BarChart3, ChevronDown, Columns3, Inbox, LayoutDashboard,
  List, ListOrdered, Plus, Settings, Users, LayoutGrid, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi } from '@/lib/work-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from './hooks';
import { avatarColor, Popover, UserAvatar, useToggle } from './ui';
import { WorkspaceMark } from './settings/shared';
import { openHelp } from './help/store';
import WorkInbox from './shell/WorkInbox';

const NOT_SLUG = new Set(['invite', 'share', 'developer']);

export function useWorkPath() {
  const pathname = usePathname() ?? '';
  const parts = pathname.split('/').filter(Boolean); // ['work', slug, key, view, ...]
  // Các trang tĩnh dưới /work không phải slug không gian.
  const slug = parts[1] && !NOT_SLUG.has(parts[1]) ? decodeURIComponent(parts[1]) : undefined;
  const key = parts[2] && parts[2] !== 'settings' ? decodeURIComponent(parts[2]).toUpperCase() : undefined;
  const view = parts[3];
  return { pathname, slug, key, view };
}

const ROW = 'w-nav-row relative flex h-8 items-center gap-2.5 rounded-[6px] px-2 text-[13.5px] transition-colors';
const ROW_IDLE = 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]';
const ROW_ON = 'bg-[var(--w-active)] font-medium text-[var(--w-text)]';

function NavItem({ href, icon: Icon, label, active, indent, badge }: { href: string; icon: typeof List; label: string; active: boolean; indent?: boolean; badge?: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={cn(ROW, indent && 'pl-3', active ? ROW_ON : ROW_IDLE)}>
      {active && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--w-accent)]" />}
      <Icon size={15} className={cn('shrink-0', active ? 'text-[var(--w-accent-text)]' : 'opacity-80')} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge}
    </Link>
  );
}

function GroupLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-1 mt-4 flex h-6 items-center justify-between px-2 first:mt-1">
      <span className="w-eyebrow">{children}</span>
      {action}
    </div>
  );
}

/** Ô chữ tắt màu cố định cho dự án (khoá dự án). */
function ProjectMark({ k }: { k: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ background: avatarColor(k) }}
      className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[5px] text-[11px] font-bold leading-none text-white"
    >
      {k.slice(0, 1)}
    </span>
  );
}

export default function WorkSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname, slug, key, view } = useWorkPath();
  const search = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const switcher = useToggle();
  const switcherRef = useRef<HTMLButtonElement>(null);

  const workspaces = useQuery({ queryKey: wk.workspaces, queryFn: workApi.workspaces, staleTime: 60_000 });
  const ws = useQuery({ queryKey: wk.workspace(slug ?? ''), queryFn: () => workApi.workspaceBySlug(slug!), enabled: !!slug, staleTime: 30_000 });
  const current = workspaces.data?.find((w) => w.slug === slug);
  const currentName = current?.name ?? ws.data?.name;
  const projects = (ws.data?.projects ?? []).filter((p) => !p.archivedAt);
  const homeTab = search?.get('tab');
  const onMyWork = pathname === '/work' && homeTab !== 'workspaces';
  const onWorkspaces = pathname === '/work' && homeTab === 'workspaces';

  return (
    <nav aria-label="CT Work" className="flex h-full flex-col text-[13.5px]" onClick={(e) => (e.target as HTMLElement).closest('a') && onNavigate?.()}>
      {/* Đầu: đổi không gian + chuông. */}
      <div className="flex items-center gap-1 px-2 pb-1 pt-2.5">
        <button
          ref={switcherRef}
          type="button"
          onClick={switcher.toggle}
          aria-haspopup="menu"
          aria-expanded={switcher.on}
          className="w-nav-row flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-[8px] px-2 text-left transition-colors hover:bg-[var(--w-hover)]"
        >
          {currentName ? (
            <WorkspaceMark name={currentName} size={26} />
          ) : (
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-accent)] text-[11px] font-bold text-white">CT</span>
          )}
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[14px] font-semibold">{currentName ?? 'CT Work'}</span>
            <span className="block truncate text-[12px] text-[var(--w-text-3)]">{currentName ? 'Workspace' : 'Choose a workspace'}</span>
          </span>
          <ChevronDown size={14} className="shrink-0 text-[var(--w-text-3)]" />
        </button>
        <WorkInbox onNavigate={onNavigate} />
        <Popover open={switcher.on} onClose={switcher.close} anchorRef={switcherRef} width={260}>
          <div className="p-1" role="menu">
            <div className="w-eyebrow px-2 pb-1 pt-1.5">Workspaces</div>
            {workspaces.data?.map((w) => (
              <Link
                key={w.id}
                href={`/work/${w.slug}`}
                role="menuitem"
                onClick={() => { switcher.close(); onNavigate?.(); }}
                className="flex h-9 items-center gap-2.5 rounded-[6px] px-2 hover:bg-[var(--w-hover)]"
              >
                <WorkspaceMark name={w.name} size={22} />
                <span className="min-w-0 flex-1 truncate">{w.name}</span>
                {w.slug === slug && <Check size={14} className="text-[var(--w-accent-text)]" />}
              </Link>
            ))}
            {workspaces.data && !workspaces.data.length && <p className="px-2 py-1.5 text-[13px] text-[var(--w-text-3)]">No workspaces yet.</p>}
            <div className="my-1 border-t border-[var(--w-border)]" />
            <Link href="/work?new=1" role="menuitem" onClick={() => { switcher.close(); onNavigate?.(); }} className="flex h-9 items-center gap-2.5 rounded-[6px] px-2 text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]">
              <Plus size={15} /> Create workspace
            </Link>
            <Link href="/work?tab=workspaces" role="menuitem" onClick={() => { switcher.close(); onNavigate?.(); }} className="flex h-9 items-center gap-2.5 rounded-[6px] px-2 text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]">
              <LayoutGrid size={15} /> All workspaces
            </Link>
          </div>
        </Popover>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {/* "My work" luôn tới được, kể cả khi đang trong một dự án. */}
        <div className="mt-1 space-y-0.5">
          <NavItem href="/work?tab=my-work" icon={Inbox} label="My work" active={onMyWork} />
          {!slug && <NavItem href="/work?tab=workspaces" icon={LayoutGrid} label="Workspaces" active={onWorkspaces} />}
        </div>

        {slug ? (
          <>
            <GroupLabel>Workspace</GroupLabel>
            <div className="space-y-0.5">
              <NavItem href={`/work/${slug}`} icon={LayoutGrid} label="Projects" active={pathname === `/work/${slug}`} />
              <NavItem href={`/work/${slug}/settings`} icon={Users} label="Members & settings" active={pathname.startsWith(`/work/${slug}/settings`)} />
            </div>

            <GroupLabel
              action={ws.data && ws.data.role !== 'GUEST' ? (
                <Link href={`/work/${slug}?newProject=1`} className="flex h-6 w-6 items-center justify-center rounded-[5px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]" title="Create project" aria-label="Create project">
                  <Plus size={14} />
                </Link>
              ) : undefined}
            >
              Projects
            </GroupLabel>
            <div className="space-y-0.5">
              {projects.map((p) => {
                const open = key === p.key;
                const base = `/work/${slug}/${p.key}`;
                return (
                  <div key={p.id}>
                    <Link
                      href={`${base}/board`}
                      title={p.name}
                      className={cn(ROW, open ? 'font-semibold text-[var(--w-text)]' : ROW_IDLE)}
                    >
                      <ProjectMark k={p.key} />
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{p.key}</span>
                    </Link>
                    {open && (
                      <div className="mb-2 ml-[18px] mt-0.5 border-l border-[var(--w-border)] pl-1.5">
                        <div className="w-eyebrow px-2 pb-0.5 pt-2">Planning</div>
                        <NavItem href={`${base}/board`} icon={Columns3} label="Board" active={view === 'board' || view === undefined} indent />
                        <NavItem href={`${base}/backlog`} icon={ListOrdered} label="Backlog" active={view === 'backlog'} indent />
                        <NavItem href={`${base}/timeline`} icon={CalendarRange} label="Timeline" active={view === 'timeline'} indent />
                        <NavItem href={`${base}/releases`} icon={Rocket} label="Releases" active={view === 'releases'} indent />
                        <div className="w-eyebrow px-2 pb-0.5 pt-2">Work</div>
                        <NavItem href={`${base}/list`} icon={List} label="Issues" active={view === 'list' || view === 'issue'} indent />
                        <NavItem href={`${base}/tests`} icon={FlaskConical} label="Tests" active={view === 'tests'} indent />
                        <div className="w-eyebrow px-2 pb-0.5 pt-2">Insights</div>
                        <NavItem href={`${base}/reports`} icon={BarChart3} label="Reports" active={view === 'reports'} indent />
                        <NavItem href={`${base}/dashboards`} icon={LayoutDashboard} label="Dashboards" active={view === 'dashboards'} indent />
                        <div className="my-1.5 border-t border-[var(--w-border)]" />
                        <NavItem href={`${base}/settings`} icon={Settings} label="Project settings" active={view === 'settings'} indent />
                      </div>
                    )}
                  </div>
                );
              })}
              {ws.data && !projects.length && (
                <p className="px-2 py-1 text-[13px] text-[var(--w-text-3)]">No projects yet.</p>
              )}
            </div>
          </>
        ) : workspaces.data?.length ? (
          <>
            <GroupLabel>Your workspaces</GroupLabel>
            <div className="space-y-0.5">
              {workspaces.data.map((w) => (
                <Link key={w.id} href={`/work/${w.slug}`} className={cn(ROW, ROW_IDLE)}>
                  <WorkspaceMark name={w.name} size={20} />
                  <span className="min-w-0 flex-1 truncate">{w.name}</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="space-y-0.5 border-t border-[var(--w-border)] p-2">
        <button
          type="button"
          onClick={() => { onNavigate?.(); openHelp(); }}
          className={cn(ROW, ROW_IDLE, 'w-full text-left')}
        >
          <CircleHelp size={15} className="shrink-0 opacity-80" />
          <span className="min-w-0 flex-1 truncate">Help &amp; guide</span>
          <kbd className="w-kbd max-md:!hidden">?</kbd>
        </button>
        <NavItem href="/work/developer" icon={KeyRound} label="API tokens" active={pathname.startsWith('/work/developer')} />
        <Link href="/" className={cn(ROW, ROW_IDLE)}>
          <ArrowLeft size={15} className="shrink-0 opacity-80" /> Back to CuongThai
        </Link>
        {user && (
          <div className="mt-1 flex items-center gap-2.5 rounded-[6px] px-2 py-1.5">
            <UserAvatar user={{ username: user.username, fullName: user.fullName ?? null, displayName: user.displayName ?? null, avatarUrl: user.avatarUrl ?? null }} size={24} />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13px] font-medium">{user.displayName || user.fullName || user.username}</span>
              <span className="block truncate text-[12px] text-[var(--w-text-3)]">@{user.username}</span>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
