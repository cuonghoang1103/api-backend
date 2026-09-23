'use client';

/**
 * /work/share/<token> — xem dự án CHỈ ĐỌC qua link công khai (giảng viên,
 * khách hàng không có tài khoản). Middleware + layout /work đã mở riêng
 * đường này: không đòi đăng nhập, không sidebar / bảng lệnh / AI.
 * Chỉ hiện các phần mà link cho phép (options.board/backlog/reports/tests).
 */

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Eye, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, workErrorStatus } from '@/lib/work-api';
import { formatDate, Spinner } from '@/components/work/ui';
import {
  ShareBacklog, ShareBoard, ShareIssuePanel, ShareReportsView, ShareTestsView, useShareLookups,
} from '@/components/work/share/ShareViews';

type Section = 'board' | 'backlog' | 'reports' | 'tests';
const SECTIONS: Array<{ key: Section; label: string }> = [
  { key: 'board', label: 'Board' },
  { key: 'backlog', label: 'Backlog' },
  { key: 'reports', label: 'Reports' },
  { key: 'tests', label: 'Tests' },
];

function Unavailable({ notFound, message, retry }: { notFound: boolean; message?: string; retry?: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-[var(--w-bg)] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center text-[13px] font-semibold tracking-tight text-[var(--w-text-2)]">CT Work</div>
        <div className="flex flex-col items-center rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] px-6 py-7 text-center">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--w-sunken)] text-[var(--w-text-2)]">
            <LinkIcon size={18} />
          </span>
          <h1 className="text-[16px] font-semibold">{notFound ? 'This link is no longer available' : 'Could not load this shared view'}</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--w-text-2)]">
            {notFound
              ? 'The link may have expired or been revoked by the project owner. Ask the person who shared it with you for a new link.'
              : message || 'Please check your connection and try again.'}
          </p>
          {retry ? (
            <button type="button" className="w-btn mt-6" onClick={retry}>Try again</button>
          ) : (
            <Link href="/" className="w-btn mt-6">Go to homepage</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SharedProjectPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? '';
  const [picked, setPicked] = useState<Section | null>(null);
  const [openIssue, setOpenIssue] = useState<number | null>(null);
  const closeIssue = useCallback(() => setOpenIssue(null), []);

  const q = useQuery({
    queryKey: ['work', 'share', token, 'summary'],
    queryFn: () => workApi.share(token),
    enabled: !!token,
    retry: (count, err) => workErrorStatus(err) !== 404 && count < 2,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
  const summary = q.data;
  const lk = useShareLookups(summary);

  const enabled = useMemo(() => SECTIONS.filter((s) => summary?.options[s.key]), [summary]);
  const tab: Section | undefined = picked && enabled.some((s) => s.key === picked) ? picked : enabled[0]?.key;
  const canOpenIssues = !!summary && (summary.options.board || summary.options.backlog);

  if (q.isLoading || !token) {
    return <div className="flex min-h-full items-center justify-center bg-[var(--w-bg)]"><Spinner size={20} /></div>;
  }
  if (q.error || !summary) {
    const notFound = !token || workErrorStatus(q.error) === 404;
    return <Unavailable notFound={notFound} message={workError(q.error)} retry={notFound ? undefined : () => q.refetch()} />;
  }

  const { project } = summary;
  const onOpen = canOpenIssues ? setOpenIssue : () => undefined;

  return (
    <div className="min-h-full bg-[var(--w-bg)]">
      {/* Thanh trên */}
      <header className="border-b border-[var(--w-border)] bg-[var(--w-panel)]">
        <div className="mx-auto flex h-11 w-full max-w-[1280px] items-center gap-2 px-4 md:px-6">
          <span className="text-[13px] font-semibold tracking-tight">CT Work</span>
          <span className="text-[13px] text-[var(--w-text-3)]">·</span>
          <span className="truncate text-[13px] text-[var(--w-text-2)]">Shared view</span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--w-border-strong)] bg-[var(--w-sunken)] px-2 text-[11px] font-medium leading-[20px] text-[var(--w-text-2)]">
            <Eye size={12} /> Read-only
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 md:px-6">
        {/* Dự án */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 min-w-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--w-accent)] px-1.5 font-mono text-[12px] font-bold text-white">
            {project.key}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[18px] font-semibold leading-tight">{project.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--w-text-3)]">
              <span className="truncate">{project.workspace}</span>
              {summary.label && <><span>·</span><span className="truncate">{summary.label}</span></>}
              {project.archived && <><span>·</span><span>Archived project</span></>}
              <span>·</span>
              <span>{summary.expiresAt ? `Link expires ${formatDate(summary.expiresAt)}` : 'Link does not expire'}</span>
            </div>
          </div>
        </div>
        {project.description && (
          <p className="mt-3 line-clamp-3 max-w-[760px] whitespace-pre-line text-[13px] leading-relaxed text-[var(--w-text-2)]">{project.description}</p>
        )}

        {/* Tab — chỉ các phần được chia sẻ */}
        <div className="mt-5 overflow-x-auto border-b border-[var(--w-border)]">
          <div className="flex gap-1" role="tablist" aria-label="Shared sections">
            {enabled.map((s) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={tab === s.key}
                onClick={() => setPicked(s.key)}
                className={cn(
                  '-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                  tab === s.key ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-5">
          {tab === 'board' && <ShareBoard token={token} summary={summary} lk={lk} onOpen={onOpen} />}
          {tab === 'backlog' && <ShareBacklog token={token} summary={summary} lk={lk} onOpen={onOpen} />}
          {tab === 'reports' && <ShareReportsView token={token} />}
          {tab === 'tests' && <ShareTestsView token={token} />}
        </div>

        <footer className="border-t border-[var(--w-border)] py-5 text-center text-[12px] text-[var(--w-text-3)]">
          Shared from CT Work. Comments, attachments and people&apos;s contact details are never included in shared views.
        </footer>
      </div>

      {openIssue !== null && (
        <ShareIssuePanel key={openIssue} token={token} number={openIssue} summary={summary} lk={lk} onClose={closeIssue} onOpen={setOpenIssue} />
      )}
    </div>
  );
}
