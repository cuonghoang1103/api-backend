'use client';

/**
 * Sidebar CT Work: đổi không gian, "My work" luôn ở trên cùng, danh sách dự án,
 * điều hướng trong dự án chia nhóm (Planning · Work · Insights). Đọc slug/key
 * từ đường dẫn — sidebar sống ở layout nên không nhận params.
 *
 * Bản 2 (04/10/2026):
 * · Thu gọn thành thanh icon 60px (nút ở chân sidebar, nhớ lựa chọn) — class
 *   `w-rail` trên <nav>; work.css giấu mọi chữ trong hàng `.w-nav-row`, chỉ để
 *   lại icon + những gì gắn `w-keep`. Mục mới thêm sau tự thu gọn theo, không
 *   cần viết nhánh riêng.
 * · Chuông + người dùng chuyển lên thanh trên (shell/HeaderTools) ở ≥md; trong
 *   ngăn kéo điện thoại (có `onNavigate`) vẫn hiện ở đây.
 * · Điều hướng dự án là DỮ LIỆU (PROJECT_NAV, WORKSPACE_NAV): thêm Stages /
 *   Approvals / Teams sau này = thêm một dòng vào mảng, không sửa JSX.
 */

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, CalendarRange, CircleHelp, KeyRound, FlaskConical, Rocket, BarChart3, ChevronDown, Columns3, Inbox, LayoutDashboard,
  List, ListOrdered, Plus, Search, Settings, Users, LayoutGrid, Check, Sparkles, PanelLeftClose, PanelLeftOpen, Milestone, BadgeCheck, Network, FileText,
  BriefcaseBusiness, Gauge,
  Handshake, PackageCheck, Activity,
  CalendarClock, GitPullRequestArrow, ShieldAlert,
  Wallet, Receipt, FileBarChart,
  Headset, Library, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, type StudioModule } from '@/lib/work-api';
import { resApi, resKeys } from '@/lib/work-resources-api';
import { useAuthStore } from '@/store/authStore';
import { wk } from './hooks';
import { Popover, ProjectMark, UserAvatar, useToggle } from './ui';
import { WorkspaceMark } from './settings/shared';
import { openHelp } from './help/store';
import { lastAiPid, openAiPanel, useAiPanel } from './ai/store';
import WorkInbox from './shell/WorkInbox';
import { useSidebarRail } from './shell/mobileNav';

const NOT_SLUG = new Set(['invite', 'share', 'developer', 'search']);
const WS_PAGES = new Set(['settings', 'teams', 'portfolio', 'workload']);

export function useWorkPath() {
  const pathname = usePathname() ?? '';
  const parts = pathname.split('/').filter(Boolean); // ['work', slug, key, view, ...]
  // Các trang tĩnh dưới /work không phải slug không gian.
  const slug = parts[1] && !NOT_SLUG.has(parts[1]) ? decodeURIComponent(parts[1]) : undefined;
  // Trang cấp không gian (/settings, /teams) không phải mã dự án — mã dự án luôn VIẾT HOA trên URL.
  const key = parts[2] && !WS_PAGES.has(parts[2]) ? decodeURIComponent(parts[2]).toUpperCase() : undefined;
  const view = parts[3];
  return { pathname, slug, key, view };
}

const ROW = 'w-nav-row relative flex h-8 items-center gap-2.5 rounded-[6px] px-2 text-[13.5px] transition-colors';
const ROW_IDLE = 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]';
const ROW_ON = 'bg-[var(--w-active)] font-medium text-[var(--w-text)]';

function NavItem({ href, icon: Icon, label, active, indent, badge }: { href: string; icon: LucideIcon; label: string; active: boolean; indent?: boolean; badge?: React.ReactNode }) {
  return (
    <Link href={href} title={label} aria-label={label} aria-current={active ? 'page' : undefined} className={cn(ROW, indent && 'pl-3', active ? ROW_ON : ROW_IDLE)}>
      {active && <span aria-hidden="true" className="w-keep absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[var(--w-accent)]" />}
      <Icon size={15} className={cn('shrink-0', active ? 'text-[var(--w-accent-text)]' : 'opacity-80')} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge}
    </Link>
  );
}

function GroupLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="w-rail-hide mb-1 mt-4 flex h-6 items-center justify-between px-2 first:mt-1">
      <span className="w-eyebrow">{children}</span>
      {action}
    </div>
  );
}

// ─── Điều hướng dạng dữ liệu ─────────────────────────────────────

interface NavDef {
  /** Đoạn đường dẫn sau /work/<slug>/<KEY>/ */
  path: string;
  label: string;
  icon: LucideIcon;
  /** Đang ở trang này? (view = đoạn thứ 4 của đường dẫn) */
  match: (view: string | undefined) => boolean;
  /** Lớp studio: chỉ hiện khi dự án BẬT mô-đun này (dự án cũ/School không thấy). */
  module?: StudioModule;
  /** Đợt S4: chỉ hiện với các vai này trong dự án (Finance: ADMIN thấy tiền, MEMBER ghi giờ). Server vẫn kiểm. */
  roles?: string[];
}

/**
 * Điều hướng trong một dự án, chia nhóm. Chỗ dành sẵn cho mục sau này:
 *   Work     → Stages (quy trình theo giai đoạn), Approvals (duyệt)
 * Thêm = một phần tử { path, label, icon, match } vào đúng nhóm.
 */
const PROJECT_NAV: { group: string; items: NavDef[] }[] = [
  {
    group: 'Planning',
    items: [
      { path: 'board', label: 'Board', icon: Columns3, match: (v) => v === 'board' || v === undefined },
      { path: 'backlog', label: 'Backlog', icon: ListOrdered, match: (v) => v === 'backlog' },
      { path: 'timeline', label: 'Timeline', icon: CalendarRange, match: (v) => v === 'timeline' },
      { path: 'releases', label: 'Releases', icon: Rocket, match: (v) => v === 'releases' },
    ],
  },
  {
    group: 'Work',
    items: [
      { path: 'list', label: 'Issues', icon: List, match: (v) => v === 'list' || v === 'issue' },
      { path: 'stages', label: 'Stages', icon: Milestone, match: (v) => v === 'stages', module: 'stages' },
      { path: 'approvals', label: 'Approvals', icon: BadgeCheck, match: (v) => v === 'approvals', module: 'approvals' },
      { path: 'docs', label: 'Docs', icon: FileText, match: (v) => v === 'docs', module: 'docs' },
      // Resources (06/10/2026): thư viện link của dự án — bật mặc định cho mọi loại dự án mới.
      { path: 'resources', label: 'Resources', icon: Library, match: (v) => v === 'resources', module: 'resources' },
      { path: 'portal', label: 'Client portal', icon: Handshake, match: (v) => v === 'portal', module: 'clientPortal' },
      // Đợt S3b: họp · yêu cầu thay đổi · sổ RAID (mỗi mục chỉ khi mô-đun của nó bật).
      { path: 'meetings', label: 'Meetings', icon: CalendarClock, match: (v) => v === 'meetings', module: 'meetings' },
      { path: 'changes', label: 'Changes', icon: GitPullRequestArrow, match: (v) => v === 'changes', module: 'changeRequests' },
      { path: 'raid', label: 'RAID', icon: ShieldAlert, match: (v) => v === 'raid', module: 'raid' },
      // Đợt S4: tài chính (đơn giá/chi phí chỉ ADMIN; MEMBER chỉ timesheet của mình — server quyết).
      { path: 'finance', label: 'Finance', icon: Wallet, match: (v) => v === 'finance', module: 'finance', roles: ['ADMIN', 'MEMBER'] },
      // Đợt S5a: service desk & SLA (hàng đợi, Problem, báo cáo SLA) — chỉ khi mô-đun serviceDesk bật.
      { path: 'desk', label: 'Service desk', icon: Headset, match: (v) => v === 'desk', module: 'serviceDesk' },
      { path: 'tests', label: 'Tests', icon: FlaskConical, match: (v) => v === 'tests' },
      // Đợt S6: Spec quality (Spec Fidelity) — đội dự án + giảng viên; khách không thấy.
      { path: 'spec', label: 'Spec quality', icon: Gauge, match: (v) => v === 'spec', roles: ['ADMIN', 'MEMBER', 'TEACHER', 'VIEWER'] },
    ],
  },
  {
    group: 'Insights',
    items: [
      { path: 'reports', label: 'Reports', icon: BarChart3, match: (v) => v === 'reports' },
      { path: 'dashboards', label: 'Dashboards', icon: LayoutDashboard, match: (v) => v === 'dashboards' },
    ],
  },
];

/**
 * Mục cấp không gian. `module` = chỉ hiện khi ÍT NHẤT một dự án của không gian
 * bật mô-đun đó, và người xem không phải khách (Teams — lớp studio S1).
 */
/**
 * Cổng khách (S2b): khách bị cách ly KHÔNG thấy điều hướng nội bộ — chỉ các thẻ
 * của cổng (đường dẫn /portal?tab=…). Dữ liệu, như PROJECT_NAV.
 */
const PORTAL_NAV: { tab: string; label: string; icon: LucideIcon; module?: StudioModule }[] = [
  { tab: 'overview', label: 'Overview', icon: LayoutDashboard },
  { tab: 'requests', label: 'Requests', icon: Inbox },
  { tab: 'approvals', label: 'Approvals', icon: BadgeCheck },
  { tab: 'documents', label: 'Documents', icon: FileText },
  { tab: 'deliverables', label: 'Deliverables', icon: PackageCheck },
  { tab: 'meetings', label: 'Meetings', icon: CalendarClock, module: 'meetings' },
  // Đợt S4: mốc thanh toán đã chia sẻ + lịch sử báo cáo tuần.
  { tab: 'payments', label: 'Payments', icon: Receipt, module: 'finance' },
  { tab: 'reports', label: 'Reports', icon: FileBarChart, module: 'reports' },
  // Resources (06/10/2026): link dự án đã chia sẻ với khách.
  { tab: 'resources', label: 'Resources', icon: Library, module: 'resources' },
  { tab: 'activity', label: 'Activity', icon: Activity },
];

const WORKSPACE_NAV: { path: string; label: string; icon: LucideIcon; module?: StudioModule; staffOnly?: boolean }[] = [
  { path: '', label: 'Projects', icon: LayoutGrid },
  { path: '/teams', label: 'Teams', icon: Network, module: 'teams' },
  // Đợt S3a — chỉ người trong đội (không phải khách GUEST); phạm vi dữ liệu do server quyết.
  { path: '/portfolio', label: 'Portfolio', icon: BriefcaseBusiness, staffOnly: true },
  { path: '/workload', label: 'Workload', icon: Gauge, staffOnly: true },
  { path: '/settings', label: 'Members & settings', icon: Users },
];

/**
 * Resources (06/10/2026): link ghim lên sidebar của dự án đang mở — một cú bấm mở tab mới (đếm lượt mở ở nền).
 * Không có link ghim / mô-đun tắt ⇒ không vẽ gì.
 */
function SidebarPinnedLinks({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: resKeys.sidebar(pid), queryFn: () => resApi.sidebar(pid), staleTime: 60_000 });
  const items = q.data?.enabled ? q.data.items : [];
  if (!items.length) return null;
  return (
    <div data-testid="sidebar-pinned-links">
      <div className="w-eyebrow w-rail-hide px-2 pb-0.5 pt-2">Pinned links</div>
      {items.map((r) => (
        <a
          key={r.id}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${r.title} — ${r.url}`}
          aria-label={`${r.title} (opens in a new tab)`}
          onClick={() => { void resApi.open(pid, r.id).catch(() => undefined); }}
          className={cn(ROW, 'pl-3', ROW_IDLE, 'group')}
        >
          {r.faviconUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={r.faviconUrl} alt="" width={15} height={15} loading="lazy" referrerPolicy="no-referrer" className="h-[15px] w-[15px] shrink-0 rounded-[3px]" />
            : <ExternalLink size={15} className="shrink-0 opacity-80" />}
          <span className="min-w-0 flex-1 truncate">{r.title}</span>
          <ExternalLink size={11} className="w-rail-hide shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
        </a>
      ))}
    </div>
  );
}

export default function WorkSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname, slug, key, view } = useWorkPath();
  // Ngăn kéo điện thoại (có onNavigate) không bao giờ thu gọn.
  const inDrawer = !!onNavigate;
  const railOn = useSidebarRail((st) => st.collapsed);
  const toggleRail = useSidebarRail((st) => st.toggle);
  const rail = !inDrawer && railOn;
  const search = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const switcher = useToggle();
  const switcherRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const workspaces = useQuery({ queryKey: wk.workspaces, queryFn: workApi.workspaces, staleTime: 60_000 });
  const ws = useQuery({ queryKey: wk.workspace(slug ?? ''), queryFn: () => workApi.workspaceBySlug(slug!), enabled: !!slug, staleTime: 30_000 });
  const current = workspaces.data?.find((w) => w.slug === slug);
  const currentName = current?.name ?? ws.data?.name;
  const projects = (ws.data?.projects ?? []).filter((p) => !p.archivedAt);
  const homeTab = search?.get('tab');
  const onMyWork = pathname === '/work' && homeTab !== 'workspaces';
  const onWorkspaces = pathname === '/work' && homeTab === 'workspaces';

  // Mở dự án ⇒ cuộn khối của nó (tên + điều hướng con) vào vùng nhìn thấy của sidebar.
  const projectCount = projects.length;
  useEffect(() => {
    if (!key) return;
    const t = setTimeout(() => {
      const box = scrollRef.current?.querySelector<HTMLElement>('[data-open-project]');
      const sc = scrollRef.current;
      if (!box || !sc) return;
      const b = box.getBoundingClientRect();
      const c = sc.getBoundingClientRect();
      if (b.bottom > c.bottom - 8) sc.scrollTop += Math.min(b.bottom - c.bottom + 16, b.top - c.top - 8);
      else if (b.top < c.top) sc.scrollTop -= c.top - b.top + 8;
    }, 60);
    return () => clearTimeout(t);
  }, [key, projectCount]);

  /* AI — lối vào luôn thấy được (04/10/2026). Trước đây chỉ có nút nhỏ ở header
     của một dự án, nên người dùng kết luận "CT Work chưa có AI". Trong dự án: mở
     cho dự án đó; ngoài dự án: mở dự án dùng AI gần nhất. ⌘J bật/tắt. */
  const duAnMo = projects.find((p) => p.key === key);
  // Cổng khách (S2b): khách bị cách ly ở dự án này / ở mọi dự án của không gian.
  const isPortalClient = (p: { role?: string; modules?: { clientPortal?: boolean } }) => p.role === 'CLIENT' && !!p.modules?.clientPortal;
  const portalOnly = !!ws.data && ws.data.role === 'GUEST' && projects.length > 0 && projects.every(isPortalClient);
  const aiPid = portalOnly || (duAnMo && isPortalClient(duAnMo)) ? null : duAnMo?.id ?? lastAiPid();
  const aiOpen = useAiPanel((st) => st.open);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'j' || e.altKey || e.shiftKey) return;
      if (aiPid == null) return;
      e.preventDefault();
      if (useAiPanel.getState().open) useAiPanel.getState().closeAiPanel();
      else openAiPanel({ pid: aiPid });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aiPid]);

  return (
    <nav aria-label="CT Work" data-rail={rail || undefined} className={cn('flex h-full flex-col text-[13.5px]', rail && 'w-rail')} onClick={(e) => (e.target as HTMLElement).closest('a') && onNavigate?.()}>
      {/* Đầu: đổi không gian + chuông. */}
      <div className="flex items-center gap-1 px-2 pb-1 pt-2.5">
        <button
          ref={switcherRef}
          type="button"
          onClick={switcher.toggle}
          aria-haspopup="menu"
          aria-expanded={switcher.on}
          title={currentName ?? 'CT Work'}
          className="w-nav-row flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-[8px] px-2 text-left transition-colors hover:bg-[var(--w-hover)]"
        >
          {currentName ? (
            <span className="w-keep flex"><WorkspaceMark name={currentName} size={26} /></span>
          ) : (
            <span className="w-keep flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-[var(--w-accent)] text-[11px] font-bold text-white">CT</span>
          )}
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[14px] font-semibold">{currentName ?? 'CT Work'}</span>
            <span className="block truncate text-[12px] text-[var(--w-text-3)]">{currentName ? 'Workspace' : 'Choose a workspace'}</span>
          </span>
          <ChevronDown size={14} className="w-rail-hide shrink-0 text-[var(--w-text-3)]" />
        </button>
        {/* ≥md chuông nằm ở thanh trên (HeaderTools); ngăn kéo điện thoại giữ ở đây. */}
        {inDrawer && <WorkInbox onNavigate={onNavigate} />}
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

      {/* Vùng cuộn RIÊNG giữa đầu và chân sidebar: min-h-0 để nó co lại thay vì đẩy chân
          xuống dưới mép; dải mờ ở đáy báo "còn nữa"; dự án đang mở tự cuộn vào tầm nhìn
          (dự án cuối danh sách từng mở ra ngay dưới chân sidebar, trông như bị che). */}
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
        {/* "My work" luôn tới được, kể cả khi đang trong một dự án. */}
        <div className="mt-1 space-y-0.5">
          {!portalOnly && <NavItem href="/work?tab=my-work" icon={Inbox} label="My work" active={onMyWork} />}
          {/* Tìm thẻ mọi dự án. Không gán phím "/" toàn cục: list/board đã dùng nó — ⌘K là đủ. */}
          {!portalOnly && <NavItem href="/work/search" icon={Search} label="Search" active={pathname.startsWith('/work/search')} />}
          {!slug && <NavItem href="/work?tab=workspaces" icon={LayoutGrid} label="Workspaces" active={onWorkspaces} />}
          {aiPid != null && (
            <button
              type="button"
              onClick={() => (aiOpen ? useAiPanel.getState().closeAiPanel() : openAiPanel({ pid: aiPid }))}
              aria-pressed={aiOpen}
              className={cn(ROW, 'w-full text-left', aiOpen ? ROW_ON : ROW_IDLE)}
              title={duAnMo ? `Ask AI about ${duAnMo.name}` : 'Ask AI (last project)'}
            >
              <Sparkles size={15} className="shrink-0 text-[var(--w-accent-text)]" />
              <span className="min-w-0 flex-1 truncate">Ask AI{duAnMo ? '' : ' · last project'}</span>
              <kbd className="w-kbd max-md:!hidden">⌘J</kbd>
            </button>
          )}
        </div>

        {slug ? (
          <>
            <GroupLabel>Workspace</GroupLabel>
            <div className="space-y-0.5">
              {WORKSPACE_NAV.filter((n) => (!portalOnly || !n.path) && (!n.staffOnly || (!!ws.data && ws.data.role !== 'GUEST')) && (!n.module || (ws.data?.role !== 'GUEST' && projects.some((p) => p.modules?.[n.module!])))).map((n) => (
                <NavItem
                  key={n.label}
                  href={`/work/${slug}${n.path}`}
                  icon={n.icon}
                  label={n.label}
                  active={n.path ? pathname.startsWith(`/work/${slug}${n.path}`) : pathname === `/work/${slug}`}
                />
              ))}
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
                  <div key={p.id} data-open-project={open || undefined}>
                    <Link
                      href={isPortalClient(p) ? `${base}/portal` : `${base}/board`}
                      title={p.name}
                      aria-label={p.name}
                      className={cn(ROW, open ? 'font-semibold text-[var(--w-text)]' : ROW_IDLE)}
                    >
                      <span className="w-keep flex"><ProjectMark k={p.key} size={20} brand={p} /></span>
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className="shrink-0 font-mono text-[11px] text-[var(--w-text-3)]">{p.key}</span>
                    </Link>
                    {open && isPortalClient(p) && (
                      <div className="w-subnav mb-2 ml-[18px] mt-0.5 border-l border-[var(--w-border)] pl-1.5">
                        <div className="w-eyebrow w-rail-hide px-2 pb-0.5 pt-2">Client portal</div>
                        {PORTAL_NAV.filter((n) => !n.module || p.modules?.[n.module]).map((n) => {
                          const cur = view === 'portal' && (search?.get('tab') ?? 'overview') === n.tab;
                          return <NavItem key={n.tab} href={`${base}/portal${n.tab === 'overview' ? '' : `?tab=${n.tab}`}`} icon={n.icon} label={n.label} active={cur} indent />;
                        })}
                      </div>
                    )}
                    {open && !isPortalClient(p) && (
                      <div className="w-subnav mb-2 ml-[18px] mt-0.5 border-l border-[var(--w-border)] pl-1.5">
                        {PROJECT_NAV.map((g) => (
                          <div key={g.group}>
                            <div className="w-eyebrow w-rail-hide px-2 pb-0.5 pt-2">{g.group}</div>
                            {g.items.filter((n) => (!n.module || p.modules?.[n.module]) && (!n.roles || n.roles.includes(String(p.role)))).map((n) => (
                              <NavItem key={n.path} href={`${base}/${n.path}`} icon={n.icon} label={n.label} active={n.match(view)} indent />
                            ))}
                          </div>
                        ))}
                        {p.modules?.resources && <SidebarPinnedLinks pid={p.id} />}
                        <div className="my-1.5 border-t border-[var(--w-border)]" />
                        <NavItem href={`${base}/settings`} icon={Settings} label="Project settings" active={view === 'settings'} indent />
                      </div>
                    )}
                  </div>
                );
              })}
              {ws.data && !projects.length && (
                <p className="w-rail-hide px-2 py-1 text-[13px] text-[var(--w-text-3)]">No projects yet.</p>
              )}
            </div>
          </>
        ) : workspaces.data?.length ? (
          <>
            <GroupLabel>Your workspaces</GroupLabel>
            <div className="space-y-0.5">
              {workspaces.data.map((w) => (
                <Link key={w.id} href={`/work/${w.slug}`} title={w.name} className={cn(ROW, ROW_IDLE)}>
                  <span className="w-keep flex"><WorkspaceMark name={w.name} size={20} /></span>
                  <span className="min-w-0 flex-1 truncate">{w.name}</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
        <div aria-hidden="true" className="pointer-events-none sticky bottom-[-12px] -mb-3 mt-1 h-5 bg-gradient-to-t from-[var(--w-bg)] to-transparent" />
      </div>

      <div className="space-y-0.5 border-t border-[var(--w-border)] p-2">
        <button
          type="button"
          onClick={() => { onNavigate?.(); openHelp(); }}
          title="Help & guide"
          className={cn(ROW, ROW_IDLE, 'w-full text-left')}
        >
          <CircleHelp size={15} className="shrink-0 opacity-80" />
          <span className="min-w-0 flex-1 truncate">Help &amp; guide</span>
          <kbd className="w-kbd max-md:!hidden">?</kbd>
        </button>
        <NavItem href="/work/developer" icon={KeyRound} label="API tokens" active={pathname.startsWith('/work/developer')} />
        <Link href="/" title="Back to CuongThai" className={cn(ROW, ROW_IDLE)}>
          <ArrowLeft size={15} className="shrink-0 opacity-80" /> <span className="min-w-0 flex-1 truncate">Back to CuongThai</span>
        </Link>
        {!inDrawer && (
          <button
            type="button"
            onClick={toggleRail}
            title={rail ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!rail}
            className={cn(ROW, ROW_IDLE, 'w-full text-left')}
          >
            {rail ? <PanelLeftOpen size={15} className="shrink-0 opacity-80" /> : <PanelLeftClose size={15} className="shrink-0 opacity-80" />}
            <span className="min-w-0 flex-1 truncate">Collapse sidebar</span>
          </button>
        )}
        {/* ≥md người dùng nằm ở thanh trên (HeaderTools); ngăn kéo điện thoại giữ ở đây. */}
        {user && inDrawer && (
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
