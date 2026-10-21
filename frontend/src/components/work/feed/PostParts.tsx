'use client';

/**
 * Các phần của thẻ bài: lưới ảnh/video kiểu Facebook (1 · 2 · 3 · 4+ ô, ô thứ 4 ghi "+N"), danh sách tệp (mở trình xem
 * tệp `xemTep`), thẻ link OpenGraph, thẻ thẻ/Docs nội bộ, bình chọn.
 */

import Link from 'next/link';
import { useState } from 'react';
import { CalendarClock, Check, FileText, FlaskConical, Play, SquareCheckBig } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeedAttachment, FeedLinkPreview, FeedPoll, FeedRef } from '@/lib/work-feed-api';
import { formatBytes, StatusBadge } from '@/components/work/ui';
import type { StatusCategory } from '@/lib/work-api';
import { wfmt, wt } from '@/components/work/i18n';

const dur = (ms: number | null) => {
  if (!ms) return null;
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function Tile({ a, onOpen, className, index, total, more, cover = true }: {
  a: FeedAttachment; onOpen: () => void; className?: string; index: number; total: number; more?: number; cover?: boolean;
}) {
  const src = a.kind === 'VIDEO' ? a.posterUrl : (a.thumbUrl ?? a.url);
  const name = a.alt || a.fileName;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn('group relative block h-full w-full overflow-hidden bg-[var(--w-sunken)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--w-accent)]', className)}
      aria-label={a.kind === 'VIDEO' ? wt('feed.playVideo', { name }) : wt('feed.openImage', { n: index + 1, total })}
    >
      {src
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={src} alt={a.alt ?? ''} loading="lazy" decoding="async" className={cn('h-full w-full transition-transform duration-300 group-hover:scale-[1.015]', cover ? 'object-cover' : 'object-contain')} />
        : <span className="flex h-full w-full items-center justify-center bg-[#111] text-white/70"><Play size={28} /></span>}
      {a.kind === 'VIDEO' && (
        <>
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform group-hover:scale-110"><Play size={24} className="ml-1" fill="currentColor" /></span>
          </span>
          {dur(a.durationMs) && <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/65 px-1.5 py-0.5 text-[11.5px] font-medium tabular-nums text-white">{dur(a.durationMs)}</span>}
        </>
      )}
      {a.alt && a.kind === 'IMAGE' && <span className="absolute bottom-2 left-2 rounded-[4px] bg-black/60 px-1.5 py-0.5 text-[10.5px] font-semibold tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">ALT</span>}
      {more ? <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[26px] font-semibold text-white" aria-hidden="true">{wt('feed.moreMediaN', { n: more })}</span> : null}
    </button>
  );
}

/** Lưới ảnh/video. `onOpen(i)` = chỉ số trong `media`. */
export function MediaGrid({ media, onOpen }: { media: FeedAttachment[]; onOpen: (i: number) => void }) {
  const n = media.length;
  if (!n) return null;
  if (n === 1) {
    const a = media[0];
    const ratio = a.width && a.height ? Math.min(Math.max(a.width / a.height, 0.8), 2.2) : a.kind === 'VIDEO' ? 16 / 9 : 4 / 3;
    return (
      <div className="overflow-hidden border-y border-[var(--w-border)] bg-[var(--w-sunken)] sm:mx-0" style={{ aspectRatio: String(ratio), maxHeight: 560 }}>
        <Tile a={a} index={0} total={1} onOpen={() => onOpen(0)} />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="grid aspect-[2/1] grid-cols-2 gap-0.5 overflow-hidden border-y border-[var(--w-border)]">
        {media.map((a, i) => <Tile key={a.id} a={a} index={i} total={n} onOpen={() => onOpen(i)} />)}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="grid aspect-[3/2] grid-cols-[2fr_1fr] grid-rows-2 gap-0.5 overflow-hidden border-y border-[var(--w-border)]">
        <div className="row-span-2"><Tile a={media[0]} index={0} total={n} onOpen={() => onOpen(0)} /></div>
        <Tile a={media[1]} index={1} total={n} onOpen={() => onOpen(1)} />
        <Tile a={media[2]} index={2} total={n} onOpen={() => onOpen(2)} />
      </div>
    );
  }
  const shown = media.slice(0, 4);
  return (
    <div className="grid aspect-square max-h-[620px] w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden border-y border-[var(--w-border)] sm:aspect-[4/3]">
      {shown.map((a, i) => <Tile key={a.id} a={a} index={i} total={n} onOpen={() => onOpen(i)} more={i === 3 && n > 4 ? n - 4 : undefined} />)}
    </div>
  );
}

const EXT_TONE: Record<string, string> = {
  pdf: 'bg-[color-mix(in_srgb,var(--w-red)_16%,transparent)] text-[var(--w-red-text)]',
  doc: 'bg-[color-mix(in_srgb,var(--w-blue)_16%,transparent)] text-[var(--w-blue-text)]', docx: 'bg-[color-mix(in_srgb,var(--w-blue)_16%,transparent)] text-[var(--w-blue-text)]',
  xls: 'bg-[color-mix(in_srgb,var(--w-green)_16%,transparent)] text-[var(--w-green-text)]', xlsx: 'bg-[color-mix(in_srgb,var(--w-green)_16%,transparent)] text-[var(--w-green-text)]', csv: 'bg-[color-mix(in_srgb,var(--w-green)_16%,transparent)] text-[var(--w-green-text)]',
  ppt: 'bg-[color-mix(in_srgb,var(--w-orange)_16%,transparent)] text-[var(--w-orange-text)]', pptx: 'bg-[color-mix(in_srgb,var(--w-orange)_16%,transparent)] text-[var(--w-orange-text)]',
  zip: 'bg-[color-mix(in_srgb,var(--w-yellow)_18%,transparent)] text-[var(--w-yellow-text)]',
};

export function FileList({ files, onOpen }: { files: FeedAttachment[]; onOpen: (i: number) => void }) {
  if (!files.length) return null;
  return (
    <ul className="grid gap-1.5 px-4 sm:grid-cols-2">
      {files.map((f, i) => {
        const ext = (f.fileName.split('.').pop() ?? '').toLowerCase().slice(0, 5);
        return (
          <li key={f.id} className="min-w-0">
            <button type="button" onClick={() => onOpen(i)} aria-label={wt('feed.openFile', { name: f.fileName })}
              className="flex w-full min-w-0 items-center gap-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-left transition-colors hover:border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]">
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] text-[10.5px] font-bold uppercase', EXT_TONE[ext] ?? 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')}>
                {ext && ext.length <= 4 ? ext : <FileText size={16} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium">{f.fileName}</span>
                <span className="block text-[12px] text-[var(--w-text-3)]">{formatBytes(f.size)}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function LinkCard({ p }: { p: FeedLinkPreview }) {
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer nofollow"
      className="mx-4 flex overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-sunken)] transition-colors hover:border-[var(--w-border-strong)] max-sm:flex-col">
      {p.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.imageUrl} alt="" loading="lazy" className="h-[132px] w-full shrink-0 object-cover sm:h-auto sm:w-[200px]" />
      )}
      <span className="flex min-w-0 flex-col justify-center gap-0.5 px-3.5 py-3">
        <span className="truncate text-[11.5px] uppercase tracking-wide text-[var(--w-text-3)]">{p.siteName || p.domain}</span>
        <span className="line-clamp-2 text-[14px] font-semibold leading-snug text-[var(--w-text)]">{p.title}</span>
        {p.description && <span className="line-clamp-2 text-[13px] text-[var(--w-text-2)]">{p.description}</span>}
      </span>
    </a>
  );
}

const REF_ICON = { issue: SquareCheckBig, test: FlaskConical, doc: FileText, meeting: CalendarClock } as const;

export function RefCards({ refs }: { refs: FeedRef[] }) {
  if (!refs.length) return null;
  return (
    <ul className="grid gap-1.5 px-4">
      {refs.map((r) => {
        const Icon = REF_ICON[r.t];
        return (
          <li key={`${r.t}${r.key}`}>
            <Link href={r.url} className="flex min-w-0 items-center gap-3 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 transition-colors hover:border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-white" style={{ background: r.type?.color ?? 'var(--w-accent)' }}><Icon size={15} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[12px] text-[var(--w-text-3)]"><span className="font-mono font-medium">{r.key}</span>{r.project && <span className="truncate">· {r.project}</span>}{r.when && <span>· {wfmt.dateTime(r.when)}</span>}</span>
                <span className="block truncate text-[13.5px] font-medium">{r.title}</span>
              </span>
              {r.status && <StatusBadge status={{ name: r.status.name, category: r.status.category as StatusCategory }} className="shrink-0 max-sm:hidden" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function PollView({ poll, onVote, busy }: { poll: FeedPoll; onVote: (ids: string[]) => void; busy?: boolean }) {
  const [sel, setSel] = useState<string[]>(poll.myVotes);
  const voted = poll.myVotes.length > 0;
  const showResults = voted || poll.closed;
  const total = poll.totalVotes || 0;
  const toggle = (id: string) => {
    if (poll.closed || busy) return;
    if (!poll.multi) { onVote(poll.myVotes[0] === id ? [] : [id]); return; }
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
    setSel(next);
    onVote(next);
  };
  return (
    <div className="mx-4 rounded-[10px] border border-[var(--w-border)] p-3" role="group" aria-label={wt('feed.addPoll')}>
      <ul className="grid gap-1.5">
        {poll.options.map((o) => {
          const pct = total ? Math.round((o.votes / total) * 100) : 0;
          const mine = poll.myVotes.includes(o.id);
          return (
            <li key={o.id}>
              <button type="button" disabled={poll.closed || busy} onClick={() => toggle(o.id)} aria-pressed={mine}
                className={cn('relative flex h-10 w-full items-center overflow-hidden rounded-[8px] border text-left text-[13.5px] transition-colors disabled:cursor-default',
                  mine ? 'border-[var(--w-accent-border)]' : 'border-[var(--w-border)] hover:border-[var(--w-border-strong)]')}>
                {showResults && <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 transition-[width] duration-500', mine ? 'bg-[var(--w-accent-soft)]' : 'bg-[var(--w-sunken)]')} style={{ width: `${pct}%` }} />}
                <span className="relative flex min-w-0 flex-1 items-center gap-2 px-3">
                  <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center border', poll.multi ? 'rounded-[4px]' : 'rounded-full', mine ? 'border-[var(--w-accent)] bg-[var(--w-accent)] text-white' : 'border-[var(--w-border-strong)]')}>
                    {mine && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{o.text}</span>
                  {showResults && <span className="shrink-0 tabular-nums text-[12.5px] text-[var(--w-text-2)]">{pct}%</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-3)]">
        <span>{wt('feed.nVotes', { count: total })}</span>
        {poll.multi && !poll.closed && <span>· {wt('feed.pollMultiHint')}</span>}
        {poll.closed ? <span>· {wt('feed.pollClosed')}</span> : poll.closesAt ? <span>· {wt('feed.pollClosesWhen', { when: wfmt.dateTime(poll.closesAt) })}</span> : null}
        {voted && !poll.closed && <button type="button" className="ml-auto font-medium text-[var(--w-text-2)] hover:underline" onClick={() => { setSel([]); onVote([]); }}>{wt('feed.retractVote')}</button>}
      </div>
    </div>
  );
}
