'use client';

/**
 * Thẻ "Getting started" — CHỈ trên Board (UX-A: trước đây lặp ở cả Backlog), cho tới
 * khi bị ẩn hoặc làm xong. Mặc định là MỘT DÒNG (tiến độ + bước kế tiếp + nút làm
 * ngay); bấm wt('onboard.showSteps') mới mở lưới 6 bước (~300px — ở khổ app desktop 1180×800
 * nó từng đẩy board xuống chỉ còn một hàng thẻ). Mở/gập nhớ theo dự án; tắt (×) và
 * làm xong cũng được nhớ ⇒ không gọi API nữa.
 * Mỗi bước đọc từ DỮ LIỆU THẬT (GET /projects/:pid/onboarding), nên làm theo
 * đường khác (kéo thẻ trên board, mời ở trang thành viên…) vẫn được tích.
 * Trạng thái "đã ẩn" lưu theo dự án trong localStorage (bọc try/catch).
 */

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BookOpen, Check, ChevronDown, ChevronUp, Sparkles, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig } from '@/lib/work-api';
import { wk } from '../hooks';
import { openHelp } from '../help/store';
import { Spinner } from '../ui';
import { wt } from '@/components/work/i18n';

const DISMISS_KEY = (pid: number) => `work.gettingStarted.dismissed.${pid}`;
const COLLAPSE_KEY = (pid: number) => `work.gettingStarted.expanded.${pid}`;

export const onboardingKey = (pid: number) => [...wk.reports(pid), 'onboarding'] as const;

function readFlag(key: string): boolean {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function writeFlag(key: string, on: boolean) {
  try { if (on) localStorage.setItem(key, '1'); else localStorage.removeItem(key); } catch { /* localStorage bị chặn */ }
}

interface Step {
  id: string;
  title: string;
  body: string;
  done: boolean;
  action?: ReactNode;
  guide: string;
}

export default function GettingStartedCard({
  config, slug, onCreateIssue, className,
}: {
  config: ProjectConfig;
  slug: string;
  /** Mở hộp tạo thẻ của trang đang đứng (Board/Backlog tự có). */
  onCreateIssue?: () => void;
  className?: string;
}) {
  const pid = config.id;
  const qc = useQueryClient();
  const [dismissed, setDismissed] = useState(true); // true tới khi đọc xong localStorage ⇒ không nháy
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setDismissed(readFlag(DISMISS_KEY(pid)));
    // Mặc định GẬP thành một dòng; chỉ mở khi người dùng đã chọn mở cho dự án này.
    setCollapsed(!readFlag(COLLAPSE_KEY(pid)));
  }, [pid]);

  const q = useQuery({
    queryKey: onboardingKey(pid),
    queryFn: () => workApi.onboarding(pid),
    enabled: !dismissed,
    staleTime: 10_000,
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: wk.project(pid) });
    qc.invalidateQueries({ queryKey: wk.board(pid) });
    qc.invalidateQueries({ queryKey: wk.backlog(pid) });
    qc.invalidateQueries({ queryKey: wk.issues(pid) });
    qc.invalidateQueries({ queryKey: wk.reports(pid) });
    qc.invalidateQueries({ queryKey: wk.tests(pid) });
  };
  const addSample = useMutation({
    mutationFn: () => workApi.addSampleData(pid),
    onSuccess: (r) => { toast.success(wt('onboard.sampleAdded', { count: r.issues })); refresh(); },
    onError: (err) => toast.error(workError(err, wt('onboard.sampleAddFailed'))),
  });
  const removeSample = useMutation({
    mutationFn: () => workApi.removeSampleData(pid),
    onSuccess: (r) => { toast.success(wt('onboard.sampleRemoved', { count: r.issues })); refresh(); },
    onError: (err) => toast.error(workError(err, wt('onboard.sampleRemoveFailed'))),
  });

  // Làm xong ⇒ nhớ luôn (lần sau không hiện, không gọi API).
  useEffect(() => {
    if (q.data?.completed) writeFlag(DISMISS_KEY(pid), true);
  }, [q.data?.completed, pid]);

  if (dismissed || !q.data || q.data.completed) return null;
  const d = q.data;
  const base = `/work/${slug}/${config.key}`;
  const admin = config.permissions.settings;

  const btn = (label: string, onClick?: () => void, href?: string) => (href
    ? <Link href={href} className="w-btn w-btn-sm">{label}</Link>
    : <button type="button" className="w-btn w-btn-sm" onClick={onClick}>{label}</button>);

  const steps: Step[] = [
    {
      id: 'issues', title: wt('onboard.s1'), done: d.steps.createIssues, guide: 'issues',
      body: wt('onboard.s1b'),
      action: config.permissions.createIssues ? btn(wt('onboard.createIssue'), onCreateIssue, onCreateIssue ? undefined : `${base}/backlog`) : undefined,
    },
    {
      id: 'invite', title: wt('onboard.s2'), done: d.steps.inviteTeam, guide: 'workspaces',
      body: wt('onboard.s2b'),
      action: config.permissions.manageMembers ? btn(wt('onboard.invite'), undefined, `${base}/settings?tab=members`) : undefined,
    },
    ...(d.scrum ? [
      {
        id: 'plan', title: wt('onboard.s3'), done: d.steps.planSprint, guide: 'backlog-sprints',
        body: wt('onboard.s3b'),
        action: btn(wt('onboard.openBacklog'), undefined, `${base}/backlog`),
      },
      {
        id: 'start', title: wt('onboard.s4'), done: d.steps.startSprint, guide: 'backlog-sprints',
        body: wt('onboard.s4b'),
        action: config.permissions.manageSprints ? btn(wt('onboard.openBacklog'), undefined, `${base}/backlog`) : undefined,
      },
    ] : []),
    {
      id: 'done', title: wt('onboard.s5'), done: d.steps.moveToDone, guide: 'board',
      body: wt('onboard.s5b'),
      action: btn(wt('onboard.openBoard'), undefined, `${base}/board`),
    },
    {
      id: 'share', title: wt('onboard.s6'), done: d.steps.shareLink, guide: 'public-links',
      body: wt('onboard.s6b'),
      action: admin ? btn(wt('onboard.createLink'), undefined, `${base}/settings?tab=share`) : undefined,
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  const dismiss = () => { writeFlag(DISMISS_KEY(pid), true); setDismissed(true); };
  const toggle = () => setCollapsed((v) => {
    writeFlag(COLLAPSE_KEY(pid), v); // v = đang gập ⇒ giờ mở
    return !v;
  });
  const next = steps.find((s) => !s.done);

  return (
    <section
      aria-label={wt('onboard.gettingStarted')}
      className={cn('overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)] shadow-[var(--w-shadow-card)]', className)}
    >
      <div className="flex min-h-[40px] flex-wrap items-center gap-x-2.5 gap-y-1.5 px-3 py-1.5">
        <h2 className="text-[13px] font-semibold">{wt('onboard.gettingStarted')}</h2>
        <span className="text-[12px] tabular-nums text-[var(--w-text-3)]">{wt('onboard.doneOf', { done: doneCount, total: steps.length })}</span>
        <div className="h-1 w-[72px] shrink-0 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-label={wt('onboard.progress')} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-[var(--w-green)] transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        {collapsed && next && (
          <span className="flex min-w-0 flex-1 items-center gap-2 text-[12.5px] text-[var(--w-text-2)] max-sm:basis-full">
            <span className="min-w-0 truncate"><span className="text-[var(--w-text-3)]">{wt('onboard.next')}</span> {next.title}</span>
            {next.action && <span className="shrink-0">{next.action}</span>}
          </span>
        )}
        {!collapsed && <span className="flex-1" />}
        {!collapsed && admin && d.canAddSample && (
          <button type="button" className="w-btn w-btn-sm" disabled={addSample.isPending} onClick={() => addSample.mutate()} title={wt('onboard.sampleTitle')}>
            {addSample.isPending ? <Spinner size={12} /> : <Sparkles size={13} />} {wt('onboard.addSample')}
          </button>
        )}
        {!collapsed && admin && d.sampleData && (
          <button type="button" className="w-btn w-btn-sm" disabled={removeSample.isPending} onClick={() => removeSample.mutate()} title={wt('onboard.removeSampleTitle')}>
            {removeSample.isPending ? <Spinner size={12} /> : <Trash2 size={13} />} {wt('onboard.removeSample')}
          </button>
        )}
        {!collapsed && (
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => openHelp('getting-started')}>
            <BookOpen size={13} /> {wt('onboard.guide')}
          </button>
        )}
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={toggle} aria-expanded={!collapsed}>
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />} {collapsed ? wt('onboard.showSteps') : wt('onboard.hideSteps')}
        </button>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={dismiss} aria-label={wt('onboard.dismiss')} title={wt('onboard.dismissTitle')}>
          <X size={14} />
        </button>
      </div>
      {!collapsed && (
        <ol className="grid grid-cols-1 gap-px border-t border-[var(--w-border)] bg-[var(--w-border)] sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.id} className="flex min-w-0 items-start gap-2.5 bg-[var(--w-raised)] px-4 py-3">
              <span
                className={cn(
                  'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular',
                  s.done ? 'border-[var(--w-green)] bg-[var(--w-green)] text-white' : 'border-[var(--w-border-strong)] text-[var(--w-text-3)]',
                )}
                aria-hidden
              >
                {s.done ? <Check size={11} strokeWidth={3} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn('text-[13px] font-medium', s.done && 'text-[var(--w-text-3)] line-through')}>
                  {s.title}<span className="sr-only">{s.done ? wt('onboard.doneSr') : ''}</span>
                </div>
                {!s.done && <p className="mt-0.5 text-[12px] leading-snug text-[var(--w-text-2)]">{s.body}</p>}
                {!s.done && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {s.action}
                    <button type="button" className="text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => openHelp(s.guide)}>
                      {wt('onboard.openGuide')}
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
