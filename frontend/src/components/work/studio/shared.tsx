'use client';

/**
 * CT Work — mảnh dùng chung của LỚP STUDIO (đợt S1, 04/10/2026): bộ phận,
 * giai đoạn, phê duyệt, bàn giao. Backend: services/work/{studio,teams,stages,
 * approvals,handoffs}.ts — client: workStudioApi trong lib/work-api.ts.
 *
 * Luật hiển thị: MỌI thứ studio chỉ hiện khi mô-đun tương ứng BẬT ở dự án
 * (`config.modules.x`). Dự án cũ / dự án School mặc định tắt hết ⇒ không thấy
 * gì mới — hàm `studioOn` là cổng duy nhất, đừng đọc `config.modules` rải rác.
 */

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { AlertTriangle, ExternalLink, PowerOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  workStudioApi, workStudioKeys, type ApprovalStatus, type HandoffStatus, type ProjectConfig, type ProjectKind,
  type StageStatus, type StudioModule, type WorkTeam,
} from '@/lib/work-api';
import { wt, wfmt } from '@/components/work/i18n';

/** Mô-đun có bật ở dự án này không (thiếu `modules` = dự án cũ = tắt). */
export function studioOn(config: Pick<ProjectConfig, 'modules'> | undefined | null, m: StudioModule): boolean {
  return config?.modules?.[m] === true;
}

/** Mô-đun có tính năng thật: bốn mô-đun đợt S1 + Docs (S2a) + cổng khách (S2b) + CR/RAID/họp (S3b) + tài chính/báo cáo (S4) — thứ tự hiển thị. */
export const S1_MODULES: Array<{ key: StudioModule; label: string; body: string }> = [
  { key: 'teams', get label() { return wt('studio.mod_teams'); }, get body() { return wt('studio.modBody_teams'); } },
  { key: 'stages', get label() { return wt('studio.mod_stages'); }, get body() { return wt('studio.modBody_stages'); } },
  { key: 'approvals', get label() { return wt('studio.mod_approvals'); }, get body() { return wt('studio.modBody_approvals'); } },
  { key: 'handoffs', get label() { return wt('studio.mod_handoffs'); }, get body() { return wt('studio.modBody_handoffs'); } },
  { key: 'docs', get label() { return wt('studio.mod_docs'); }, get body() { return wt('studio.modBody_docs'); } },
  { key: 'clientPortal', get label() { return wt('studio.mod_clientPortal'); }, get body() { return wt('studio.modBody_clientPortal'); } },
  // Đợt S3b.
  { key: 'changeRequests', get label() { return wt('studio.mod_changeRequests'); }, get body() { return wt('studio.modBody_changeRequests'); } },
  { key: 'raid', get label() { return wt('studio.mod_raid'); }, get body() { return wt('studio.modBody_raid'); } },
  { key: 'meetings', get label() { return wt('studio.mod_meetings'); }, get body() { return wt('studio.modBody_meetings'); } },
  // Đợt S4.
  { key: 'finance', get label() { return wt('studio.mod_finance'); }, get body() { return wt('studio.modBody_finance'); } },
  { key: 'reports', get label() { return wt('studio.mod_reports'); }, get body() { return wt('studio.modBody_reports'); } },
  // Đợt S5a.
  { key: 'serviceDesk', get label() { return wt('studio.mod_serviceDesk'); }, get body() { return wt('studio.modBody_serviceDesk'); } },
  // Resources (06/10/2026) — bật mặc định cho mọi loại dự án mới.
  { key: 'resources', get label() { return wt('studio.mod_resources'); }, get body() { return wt('studio.modBody_resources'); } },
];

/** Khoá chừa cho đợt sau — hiện mờ "Coming later" để người dùng biết hướng đi. */
export const LATER_MODULES: Array<{ key: StudioModule; label: string }> = [];

export const KIND_INFO: Record<ProjectKind, { label: string; short: string; body: string; modules: StudioModule[] }> = {
  PERSONAL: { get label() { return wt('studio.kind_PERSONAL'); }, get short() { return wt('studio.kindShort_PERSONAL'); }, get body() { return wt('studio.kindBody_PERSONAL'); }, modules: ['resources'] },
  SCHOOL: { get label() { return wt('studio.kind_SCHOOL'); }, get short() { return wt('studio.kindShort_SCHOOL'); }, get body() { return wt('studio.kindBody_SCHOOL'); }, modules: ['resources'] },
  SOFTWARE: { get label() { return wt('studio.kind_SOFTWARE'); }, get short() { return wt('studio.kindShort_SOFTWARE'); }, get body() { return wt('studio.kindBody_SOFTWARE'); }, modules: ['resources'] },
  CLIENT: { get label() { return wt('studio.kind_CLIENT'); }, get short() { return wt('studio.kindShort_CLIENT'); }, get body() { return wt('studio.kindBody_CLIENT'); }, modules: ['teams', 'stages', 'approvals', 'handoffs', 'docs', 'clientPortal', 'changeRequests', 'raid', 'meetings', 'finance', 'reports', 'serviceDesk', 'resources'] },
};
export const KINDS: ProjectKind[] = ['PERSONAL', 'SCHOOL', 'SOFTWARE', 'CLIENT'];

/**
 * Sau một thao tác studio (duyệt, bàn giao, giao việc, kích hoạt giai đoạn…):
 * làm tươi mọi danh sách studio + thẻ/board. Rộng tay hơn cần thiết một chút,
 * đổi lại không bao giờ có ô nào kẹt dữ liệu cũ.
 */
export function useStudioInvalidate() {
  const qc = useQueryClient();
  return useCallback(() => {
    for (const k of ['approvals', 'my-approvals', 'handoffs', 'my-handoffs', 'stages', 'team-queue', 'teams', 'issue', 'board', 'issues', 'backlog', 'history', 'my-work']) {
      qc.invalidateQueries({ queryKey: ['work', k] });
    }
  }, [qc]);
}

// ─── Bộ phận của không gian ──────────────────────────────────────

/** Bộ phận của không gian — chỉ tải khi `enabled` (dự án bật teams / trang Teams). */
export function useWorkspaceTeams(wsId: number | undefined, enabled = true, includeArchived = false) {
  return useQuery({
    queryKey: [...workStudioKeys.teams(wsId ?? 0), includeArchived ? 'all' : 'active'],
    queryFn: () => workStudioApi.teams(wsId!, includeArchived),
    enabled: !!wsId && enabled,
    staleTime: 60_000,
  });
}

/** Tra bộ phận theo id cho thẻ board (một lần cho cả board, qua context). */
export const TeamsCtx = createContext<Map<number, WorkTeam> | null>(null);
export const useTeamLookup = () => useContext(TeamsCtx);

/** Chip bộ phận: chấm màu + mã (BA, DEV…). */
export function TeamChip({ team, className, full }: { team: Pick<WorkTeam, 'key' | 'name' | 'color'>; className?: string; full?: boolean }) {
  return (
    <span
      title={`Team: ${team.name}`}
      className={cn('inline-flex h-[18px] max-w-[140px] shrink-0 items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] font-semibold text-[var(--w-text-2)] shadow-[inset_0_0_0_1px_var(--w-border)]', className)}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: team.color }} aria-hidden="true" />
      <span className="truncate font-mono">{team.key}</span>
      {full && <span className="truncate font-normal">· {team.name}</span>}
    </span>
  );
}

// ─── Nhãn trạng thái ─────────────────────────────────────────────

type Tone = 'neutral' | 'blue' | 'green' | 'red' | 'orange' | 'accent';
const TONE: Record<Tone, string> = {
  neutral: 'bg-[var(--w-sunken)] text-[var(--w-text-2)] border-[var(--w-border)]',
  blue: 'bg-[color-mix(in_srgb,var(--w-blue)_11%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-blue)_30%,transparent)]',
  green: 'bg-[color-mix(in_srgb,var(--w-green)_11%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-green)_30%,transparent)]',
  red: 'bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-red)_30%,transparent)]',
  orange: 'bg-[color-mix(in_srgb,var(--w-orange)_11%,transparent)] text-[var(--w-text)] border-[color-mix(in_srgb,var(--w-orange)_32%,transparent)]',
  accent: 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)] border-[var(--w-accent-border)]',
};
const DOT: Record<Tone, string> = {
  neutral: 'var(--w-status-todo)', blue: 'var(--w-blue)', green: 'var(--w-green)', red: 'var(--w-red)', orange: 'var(--w-orange)', accent: 'var(--w-accent)',
};

export function Pill({ tone, children, className, title }: { tone: Tone; children: ReactNode; className?: string; title?: string }) {
  return (
    <span title={title} className={cn('inline-flex h-[22px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border px-2 text-[12px] font-medium leading-none', TONE[tone], className)}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DOT[tone] }} aria-hidden="true" />
      {children}
    </span>
  );
}

export const STAGE_STATUS: Record<StageStatus, { label: string; tone: Tone }> = {
  NOT_STARTED: { label: 'Not started', tone: 'neutral' },
  ACTIVE: { label: 'Active', tone: 'blue' },
  GATE_REVIEW: { label: 'Gate review', tone: 'orange' },
  DONE: { label: 'Done', tone: 'green' },
};
export const APPROVAL_STATUS: Record<ApprovalStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'Pending', tone: 'orange' },
  APPROVED: { label: 'Approved', tone: 'green' },
  REJECTED: { label: 'Rejected', tone: 'red' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
};
export const HANDOFF_STATUS: Record<HandoffStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'Waiting', tone: 'orange' },
  ACCEPTED: { label: 'Accepted', tone: 'green' },
  RETURNED: { label: 'Returned', tone: 'red' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
};

export const StagePill = ({ status }: { status: StageStatus }) => <Pill tone={STAGE_STATUS[status].tone}>{STAGE_STATUS[status].label}</Pill>;
export const ApprovalPill = ({ status }: { status: ApprovalStatus }) => <Pill tone={APPROVAL_STATUS[status].tone}>{APPROVAL_STATUS[status].label}</Pill>;
export const HandoffPill = ({ status }: { status: HandoffStatus }) => <Pill tone={HANDOFF_STATUS[status].tone}>{HANDOFF_STATUS[status].label}</Pill>;

// ─── Hướng dẫn quy trình (/about/quy-trinh/<slug>) ───────────────

/** 21 slug của trang quy trình (frontend/src/app/about/quy-trinh/data.ts) — chép tay để không kéo cả data.ts vào /work. */
const PROCESS_SLUGS = new Set([
  'tiep-nhan', 'tien-ban-hang', 'khao-sat', 'de-xuat', 'phap-ly-tai-chinh', 'dac-ta-yeu-cau', 'thiet-ke-ux-ui', 'kien-truc',
  'lap-ke-hoach', 'phat-trien', 'chuyen-du-lieu', 'kiem-thu', 'bao-mat', 'ha-tang-devops', 'uat-nghiem-thu', 'quan-ly-phat-hanh',
  'trien-khai-ban-giao', 'dong-du-an', 'bao-hanh-bao-tri', 'cai-tien', 'ngung-he-thong',
]);

export function ProcessGuideLink({ slug, className }: { slug: string; className?: string }) {
  if (!PROCESS_SLUGS.has(slug)) return null;
  return (
    <a
      href={`/about/quy-trinh/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-center gap-1 text-[12px] font-medium text-[var(--w-accent-text)] hover:underline', className)}
      title="Open the process guide for this stage in a new tab"
    >
      Process guide <ExternalLink size={11} aria-hidden="true" />
    </a>
  );
}

// ─── Khung nhỏ ───────────────────────────────────────────────────

/** Dải cảnh báo mảnh trên đầu vùng nội dung (board cắt bớt, nội dung đổi sau khi ký…). */
export function WarnStrip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="status" className={cn('flex items-start gap-2 border-b border-[color-mix(in_srgb,var(--w-orange)_35%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_9%,transparent)] px-4 py-2 text-[13px] text-[var(--w-text)]', className)}>
      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--w-orange)]" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString(wfmt.intl(), { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

/** "Showing 2,000 of 2,413 issues — use filters or the list view" (board cắt ở 2000, backlog 3000). */
export function TruncatedStrip({ data, what = 'issues' }: { data: { truncated?: boolean; total?: number; limit?: number }; what?: string }) {
  if (!data.truncated) return null;
  const n = (x: number | undefined) => (x ?? 0).toLocaleString(wfmt.intl());
  return (
    <WarnStrip>
      Showing <b className="font-semibold">{n(data.limit)}</b> of <b className="font-semibold">{n(data.total)}</b> {what} — use filters or the list view to see the rest.
    </WarnStrip>
  );
}

/** Trang của một mô-đun đang TẮT (gõ thẳng URL): nói rõ và chỉ chỗ bật, không phải lỗi đỏ. */
export function ModuleOff({ config, label }: { config: ProjectConfig; label: string }) {
  const href = `/work/${config.workspace.slug}/${config.key}/settings?tab=studio`;
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center md:py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--w-border)] bg-[var(--w-sunken)] text-[var(--w-text-3)]"><PowerOff size={20} /></div>
      <div className="text-[16px] font-semibold tracking-[-0.01em]">{label} is turned off for this project</div>
      <p className="mt-1.5 max-w-[440px] text-[14px] leading-relaxed text-[var(--w-text-2)]">
        {config.permissions.configureStudio ? 'Turn it on in Project settings → Project type & modules.' : 'A project admin can turn it on in Project settings → Project type & modules.'}
      </p>
      {config.permissions.configureStudio && <Link href={href} className="w-btn w-btn-primary mt-5">Open project type &amp; modules</Link>}
    </div>
  );
}
