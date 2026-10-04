'use client';

/**
 * CHẾ ĐỘ THUYẾT TRÌNH — /work/<ws>/<KEY>/present (đợt S4, mô-đun reports).
 *
 * Hai bước: (1) chuẩn bị — chọn chế độ (Internal / Client-safe) và thẻ để demo; (2) trình chiếu toàn màn
 * hình: ← / → (hoặc PageUp/PageDown/Space) đổi slide, F bật/tắt toàn màn hình, Esc thoát. Slide dựng từ
 * dữ liệu xác định (clientReports.service presentData). "Client-safe" = đúng dữ liệu báo cáo khách: chỉ
 * thứ đã chia sẻ, không tiền nội bộ. Tài chính chỉ có ở Internal và chỉ với người thấy tiền.
 * Xuất .pptx: repo chưa có thư viện (không có pptxgenjs) ⇒ cố ý không làm; dùng Print / PDF ở Reports.
 */

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Play, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { fmtMoney, s4Api, s4Keys, type PresentPayload } from '@/lib/work-s4-api';
import { EmptyState, PageLoading } from '../ui';

type Slide = { id: string; title: string; body: ReactNode };

const STAGE_LABEL: Record<string, string> = { NOT_STARTED: 'Not started', ACTIVE: 'In progress', GATE_REVIEW: 'Gate review', DONE: 'Done' };

function Big({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 rounded-[14px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-[clamp(12px,2vw,24px)] py-[clamp(10px,1.6vw,20px)]">
      <div className="text-[clamp(11px,1.1vw,15px)] font-medium text-[var(--w-text-3)]">{label}</div>
      <div className="mt-1 truncate text-[clamp(22px,3.6vw,48px)] font-semibold tabular-nums tracking-[-0.02em]">{value}</div>
    </div>
  );
}

function Lines({ items, empty }: { items: Array<{ key?: string; title: string; note?: string }>; empty: string }) {
  if (!items.length) return <p className="text-[clamp(14px,1.6vw,22px)] text-[var(--w-text-3)]">{empty}</p>;
  return (
    <ul className="space-y-[clamp(6px,1vw,14px)]">
      {items.map((i, n) => (
        <li key={`${i.key ?? n}-${i.title}`} className="flex min-w-0 items-baseline gap-3 text-[clamp(15px,1.8vw,26px)] leading-snug">
          <span className="mt-[0.5em] h-[0.4em] w-[0.4em] shrink-0 rounded-full bg-[var(--w-accent)]" aria-hidden="true" />
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {i.key && <span className="mr-2 font-mono text-[0.72em] text-[var(--w-text-3)]">{i.key}</span>}
            {i.title}
            {i.note && <span className="text-[0.75em] text-[var(--w-text-3)]"> · {i.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function buildSlides(p: PresentPayload, demo: number[], projectName: string): Slide[] {
  const d = p.data;
  const slides: Slide[] = [];
  slides.push({
    id: 'title', title: projectName,
    body: (
      <div className="flex h-full flex-col justify-center">
        <div className="text-[clamp(12px,1.3vw,18px)] font-semibold uppercase tracking-[0.16em] text-[var(--w-accent-text)]">{p.mode === 'client' ? 'Project update' : 'Steering review'}</div>
        <h1 className="mt-3 text-[clamp(30px,6vw,84px)] font-semibold leading-[1.02] tracking-[-0.03em] [overflow-wrap:anywhere]">{projectName}</h1>
        <p className="mt-4 text-[clamp(14px,1.8vw,24px)] text-[var(--w-text-2)]">{d.period.from} → {d.period.to}</p>
        {p.description && p.mode === 'internal' && <p className="mt-6 max-w-[60ch] text-[clamp(13px,1.4vw,19px)] leading-relaxed text-[var(--w-text-2)] [overflow-wrap:anywhere]">{p.description}</p>}
      </div>
    ),
  });
  slides.push({
    id: 'overview', title: 'Where we are',
    body: (
      <div className="grid grid-cols-2 gap-[clamp(8px,1.5vw,20px)] lg:grid-cols-4">
        <Big label="Completed" value={d.counts.completed} />
        <Big label="In progress" value={d.counts.inProgress} />
        <Big label="Overall progress" value={d.overallPercent === null ? '—' : `${d.overallPercent}%`} />
        <Big label={p.mode === 'client' ? 'Waiting on you' : 'Waiting on client'} value={d.waitingOnClient.length} />
        {d.currentStage && <div className="col-span-2 text-[clamp(15px,1.8vw,26px)] lg:col-span-4">Current stage: <b>{d.currentStage.n}. {d.currentStage.name}</b> <span className="text-[var(--w-text-3)]">({d.currentStage.percent}%)</span></div>}
      </div>
    ),
  });
  if (d.stages?.length) {
    slides.push({
      id: 'stages', title: 'Stages',
      body: (
        <ol className="grid gap-x-10 gap-y-[clamp(6px,0.9vw,12px)] md:grid-cols-2">
          {d.stages.map((s) => (
            <li key={s.n} className="min-w-0">
              <div className="flex items-baseline justify-between gap-3 text-[clamp(13px,1.4vw,20px)]">
                <span className="min-w-0 truncate"><span className="tabular-nums text-[var(--w-text-3)]">{s.n}.</span> {s.name}</span>
                <span className="shrink-0 text-[0.8em] text-[var(--w-text-3)]">{STAGE_LABEL[s.status] ?? s.status} · {s.percent}%</span>
              </div>
              <div className="mt-1 h-[clamp(4px,0.5vw,8px)] overflow-hidden rounded-full bg-[var(--w-sunken)]"><div className="h-full rounded-full" style={{ width: `${s.percent}%`, background: s.status === 'DONE' ? 'var(--w-green)' : 'var(--w-accent)' }} /></div>
            </li>
          ))}
        </ol>
      ),
    });
  }
  const ms = [
    ...d.upcoming.versions.map((v) => ({ title: v.name, note: `${v.releaseDate ?? 'no date'} · ${v.done}/${v.items} done` })),
    ...(d.upcoming.payments ?? []).map((m) => ({ title: `Payment: ${m.name}`, note: `${fmtMoney(m.amount, d.currency)}${m.dueDate ? ` · due ${m.dueDate}` : ''} · ${m.status.toLowerCase()}` })),
  ];
  slides.push({ id: 'milestones', title: 'Milestones', body: <Lines items={ms} empty="No upcoming milestones." /> });
  const chosen = p.demoCandidates.filter((c) => demo.includes(c.number));
  for (let i = 0; i < chosen.length; i += 4) {
    const page = chosen.slice(i, i + 4);
    slides.push({
      id: `demo-${i}`, title: chosen.length > 4 ? `Demo (${i / 4 + 1}/${Math.ceil(chosen.length / 4)})` : 'Demo',
      body: (
        <div className="grid gap-[clamp(8px,1.4vw,18px)] md:grid-cols-2">
          {page.map((c) => (
            <div key={c.number} className="min-w-0 rounded-[14px] border border-[var(--w-border)] p-[clamp(12px,1.6vw,22px)]">
              <div className="font-mono text-[clamp(11px,1vw,14px)] text-[var(--w-text-3)]">{c.key} · {c.type}</div>
              <div className="mt-1 text-[clamp(16px,2vw,28px)] font-semibold leading-snug [overflow-wrap:anywhere]">{c.title}</div>
              {c.summary && <p className="mt-2 text-[clamp(12px,1.2vw,17px)] leading-relaxed text-[var(--w-text-2)] [overflow-wrap:anywhere]">{c.summary}</p>}
            </div>
          ))}
        </div>
      ),
    });
  }
  const risks = p.mode === 'internal' && d.internal?.raid
    ? d.internal.raid.top.map((r) => ({ key: r.key, title: r.title, note: [r.score ? `score ${r.score}` : null, r.owner].filter(Boolean).join(' · ') }))
    : (d.risks ?? []).map((r) => ({ key: r.key, title: r.title, note: [r.level?.toLowerCase(), r.mitigation].filter(Boolean).join(' — ') }));
  if (risks.length || p.mode === 'internal') slides.push({ id: 'risks', title: 'Risks', body: <Lines items={risks} empty="No open risks to report." /> });
  if (d.changes?.length) slides.push({ id: 'changes', title: 'Approved changes', body: <Lines items={d.changes.map((c) => ({ key: `CR-${c.number}`, title: c.title, note: [c.scheduleDays ? `${c.scheduleDays > 0 ? '+' : ''}${c.scheduleDays} days` : null, c.costAmount ? fmtMoney(c.costAmount, c.costCurrency) : null].filter(Boolean).join(' · ') }))} empty="" /> });
  const f = d.internal?.finance;
  if (p.mode === 'internal' && p.financeIncluded && f) {
    slides.push({
      id: 'finance', title: 'Finance',
      body: (
        <div className="grid grid-cols-2 gap-[clamp(8px,1.5vw,20px)] lg:grid-cols-4">
          <Big label="Budget" value={fmtMoney(f.bac, f.currency)} />
          <Big label="Actual" value={fmtMoney(f.actual, f.currency)} />
          <Big label="Burn / week" value={fmtMoney(f.burnRatePerWeek, f.currency)} />
          <Big label="Forecast (EAC)" value={fmtMoney(f.eac, f.currency)} />
          <p className="col-span-2 text-[clamp(13px,1.4vw,20px)] text-[var(--w-text-2)] lg:col-span-4">{f.percentUsed !== null ? `${f.percentUsed}% of the budget used. ` : ''}Payments due {fmtMoney(f.payments.due, f.currency)}, paid {fmtMoney(f.payments.paid, f.currency)}.{f.alerts.length ? ` Alerts: ${f.alerts.join(', ')}.` : ''}</p>
        </div>
      ),
    });
  }
  slides.push({
    id: 'next', title: 'Next steps',
    body: <Lines items={[...d.waitingOnClient.map((w) => ({ title: `${w.kind === 'UAT' ? 'UAT sign-off' : 'Approval'}: ${w.title}`, note: p.mode === 'client' ? 'waiting on you' : 'waiting on the client' })), ...d.nextSteps]} empty="To be agreed together." />,
  });
  return slides;
}

export default function PresentView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const mode: 'client' | 'internal' = search?.get('mode') === 'client' ? 'client' : 'internal';
  const q = useQuery({ queryKey: s4Keys.present(pid, mode), queryFn: () => s4Api.present(pid, mode) });
  const [demo, setDemo] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [i, setI] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const slides = useMemo(() => (q.data ? buildSlides(q.data, demo, config.name) : []), [q.data, demo, config.name]);
  const setMode = (m: 'client' | 'internal') => {
    const p = new URLSearchParams(search?.toString());
    if (m === 'client') p.set('mode', 'client'); else p.delete('mode');
    setDemo([]);
    router.replace(p.toString() ? `${pathname}?${p}` : pathname!, { scroll: false });
  };
  const go = useCallback((n: number) => setI((cur) => Math.max(0, Math.min(slides.length - 1, cur + n))), [slides.length]);
  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void stage.current?.requestFullscreen?.().catch(() => {});
  }, []);
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
      else if (e.key === 'Home') setI(0);
      else if (e.key === 'End') setI(slides.length - 1);
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFull(); }
      else if (e.key === 'Escape' && !document.fullscreenElement) { e.preventDefault(); setPlaying(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [playing, go, slides.length, toggleFull]);

  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title="Could not prepare the presentation" body={workError(q.error)} />;
  const p = q.data;

  if (!playing) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[860px] space-y-4 px-4 py-6">
          <div>
            <div className="w-eyebrow">Present mode</div>
            <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">{config.name}</h1>
            <p className="mt-1 text-[13px] text-[var(--w-text-2)]">Full-screen slides from live project data: overview, stages, milestones, demo items, risks, changes{p.financeIncluded ? ', finance' : ''} and next steps. Keys: ← → to move, F for full screen, Esc to leave.</p>
          </div>
          <div className="w-card p-4">
            <h2 className="w-section-title mb-2">Audience</h2>
            <div className="w-seg" role="group" aria-label="Audience">
              <button type="button" aria-pressed={mode === 'internal'} onClick={() => setMode('internal')} data-testid="present-internal">Internal</button>
              <button type="button" aria-pressed={mode === 'client'} onClick={() => setMode('client')} data-testid="present-client">Client-safe</button>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--w-green)]" />
              {mode === 'client' ? 'Only shared data: shared issues, stages, shared milestones and payments, approved shared changes and risks marked for client reports. No internal names, hours or costs.' : `Everything the team sees.${config.modules?.finance ? (p.financeIncluded ? ' Finance is included (you can see costs).' : ' Finance is hidden — only project admins see it.') : ''}`}
            </p>
          </div>
          <div className="w-card p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h2 className="w-section-title">Demo items</h2>
              <span className="text-[12px] text-[var(--w-text-3)]">Finished in the last two weeks{mode === 'client' ? ' and shared with the client' : ''}. Pick what you will show.</span>
              {p.demoCandidates.length > 0 && <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setDemo(demo.length ? [] : p.demoCandidates.slice(0, 8).map((c) => c.number))}>{demo.length ? 'Clear' : 'Pick first 8'}</button>}
            </div>
            {!p.demoCandidates.length ? <p className="text-[13px] text-[var(--w-text-3)]">Nothing finished in this period.</p> : (
              <ul className="max-h-[320px] space-y-0.5 overflow-y-auto" data-testid="demo-list">
                {p.demoCandidates.map((c) => (
                  <li key={c.number}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-[13px] hover:bg-[var(--w-hover)]">
                      <input type="checkbox" checked={demo.includes(c.number)} onChange={(e) => setDemo(e.target.checked ? [...demo, c.number] : demo.filter((x) => x !== c.number))} />
                      <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-3)]">{c.key}</span>
                      <span className="min-w-0 truncate">{c.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="w-btn w-btn-primary" onClick={() => { setI(0); setPlaying(true); }} data-testid="present-start"><Play size={14} />Start presenting ({slides.length} slides)</button>
            <Link href={`/work/${config.workspace.slug}/${config.key}/reports?tab=steering`} className="w-btn"><ArrowLeft size={14} />Back to reports</Link>
          </div>
          <p className="text-[12px] text-[var(--w-text-3)]">PowerPoint export is not available — use Reports → Print / PDF for a document.</p>
        </div>
      </div>
    );
  }

  const s = slides[i];
  return (
    <div ref={stage} className="fixed inset-0 z-[80] flex flex-col bg-[var(--w-panel)] text-[var(--w-text)]" role="region" aria-roledescription="presentation" aria-label={`${config.name} presentation`} data-testid="present-stage">
      <div className="flex shrink-0 items-center gap-2 px-[clamp(12px,3vw,40px)] pt-[clamp(10px,2vw,24px)]">
        <span className="min-w-0 truncate text-[clamp(11px,1vw,14px)] font-medium text-[var(--w-text-3)]">{config.name} · {p.mode === 'client' ? 'Client-safe' : 'Internal'}</span>
        <span className="ml-auto text-[12px] tabular-nums text-[var(--w-text-3)]" data-testid="slide-counter">{i + 1} / {slides.length}</span>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label="Full screen (F)" onClick={toggleFull}><Maximize2 size={14} /></button>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label="Leave (Esc)" onClick={() => { if (document.fullscreenElement) void document.exitFullscreen().catch(() => {}); setPlaying(false); }}><X size={15} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-[clamp(16px,6vw,96px)] py-[clamp(12px,3vw,40px)]" key={s.id}>
        {s.id !== 'title' && <h2 className="mb-[clamp(14px,2.4vw,36px)] text-[clamp(22px,3.4vw,52px)] font-semibold tracking-[-0.025em]" data-testid="slide-title">{s.title}</h2>}
        {s.id === 'title' && <span className="sr-only" data-testid="slide-title">{s.title}</span>}
        <div className="h-[calc(100%-1px)]">{s.body}</div>
      </div>
      <div className="flex shrink-0 items-center gap-3 px-[clamp(12px,3vw,40px)] pb-[clamp(10px,2vw,24px)]">
        <button type="button" className="w-btn w-btn-sm" aria-label="Previous slide" disabled={i === 0} onClick={() => go(-1)}><ChevronLeft size={15} /></button>
        <div className="flex min-w-0 flex-1 justify-center gap-1.5" aria-hidden="true">
          {slides.map((x, n) => <span key={x.id} className={cn('h-1.5 rounded-full transition-all', n === i ? 'w-5 bg-[var(--w-accent)]' : 'w-1.5 bg-[var(--w-border-strong)]')} />)}
        </div>
        <button type="button" className="w-btn w-btn-sm" aria-label="Next slide" disabled={i === slides.length - 1} onClick={() => go(1)} data-testid="slide-next"><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}
