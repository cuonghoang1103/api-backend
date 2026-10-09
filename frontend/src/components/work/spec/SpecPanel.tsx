'use client';

/**
 * Đợt S6 — Spec Fidelity: khung kết quả dùng chung cho trang Docs (ngăn bên phải) và trang Spec quality (tập thẻ).
 *
 *   · 4 vạch điểm (completeness · consistency · unambiguity · verifiability) + tổng, biểu đồ nhỏ lịch sử điểm.
 *   · Danh sách phát hiện lọc theo chiều; bấm ⇒ nhảy tới đoạn (trang) / mở thẻ. Gợi ý viết lại sửa được rồi mới
 *     "Apply" (ĐỀ XUẤT → Áp dụng — server tạo phiên bản trang mới / sửa thẻ dưới quyền người bấm). Điểm chỉ đổi khi
 *     chấm lại — nút "Check again" ngay đó.
 *   · Yêu cầu chưa truy được tới test (traceability thật).
 * Chữ giao diện tiếng Anh; chú thích tiếng Việt.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, Bot, Check, ChevronDown, ChevronRight, CircleSlash, ExternalLink, FlaskConical, Gauge, RefreshCw, Sparkles, Undo2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { workCtw4Api } from '@/lib/work-ctw4-api'; // CTW đợt 4: phát hiện ⇒ Bug một chạm
import {
  DIMENSION_INFO, SPEC_DIMENSIONS, workS6Api, workS6Keys,
  type SpecDimension, type SpecFinding, type SpecGateStatus, type SpecReview, type SpecReviewSummary, type SpecScores,
} from '@/lib/work-s6-api';
import { Spinner, relativeTime, signalText } from '../ui';

const SEV_LABEL: Record<SpecFinding['severity'], string> = { high: 'High', medium: 'Medium', low: 'Low' };
const SEV_COLOR: Record<SpecFinding['severity'], string> = { high: 'var(--w-red)', medium: 'var(--w-orange)', low: 'var(--w-text-3)' };

/** Màu theo điểm: ≥ 80 xanh lá, ≥ 50 cam, dưới đỏ (cùng ngưỡng mặc định của cổng: mỗi chiều ≥ 50). */
export function scoreColor(n: number): string {
  return n >= 80 ? 'var(--w-green)' : n >= 50 ? 'var(--w-orange)' : 'var(--w-red)';
}

export function ScoreBars({ s, compact, threshold }: { s: SpecScores; compact?: boolean; threshold?: number }) {
  return (
    <div className={cn('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')} data-testid="spec-scores">
      {SPEC_DIMENSIONS.map((d) => (
        <div key={d} className="min-w-0" title={DIMENSION_INFO[d].body}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-[12px]">
            <span className="truncate text-[var(--w-text-2)]">{DIMENSION_INFO[d].label}</span>
            <span className="tabular font-semibold" style={{ color: signalText(scoreColor(s[d])) }}>{s[d]}</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--w-sunken)]" role="meter" aria-label={DIMENSION_INFO[d].label} aria-valuenow={s[d]} aria-valuemin={0} aria-valuemax={100}>
            <span className="block h-full rounded-full" style={{ width: `${s[d]}%`, background: scoreColor(s[d]) }} />
            {threshold !== undefined && <span className="absolute top-0 h-full w-px bg-[var(--w-text-3)]" style={{ left: `${threshold}%` }} aria-hidden="true" />}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OverallBadge({ n, size = 44 }: { n: number; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 flex-col items-center justify-center rounded-full border-[3px] font-semibold tabular leading-none"
      style={{ width: size, height: size, borderColor: scoreColor(n), color: signalText(scoreColor(n)), fontSize: size * 0.34 }}
      aria-label={`Overall ${n} out of 100`}
    >
      {n}
    </span>
  );
}

/** Biểu đồ nhỏ: điểm tổng các lần chấm (cũ → mới), SVG thuần — không kéo thư viện biểu đồ vào ngăn bên. */
export function SpecSparkline({ items, height = 44 }: { items: SpecReviewSummary[]; height?: number }) {
  const pts = [...items].reverse().slice(-20);
  if (pts.length < 2) return null;
  const w = 220;
  const step = w / (pts.length - 1);
  const y = (v: number) => height - 4 - (v / 100) * (height - 8);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${y(p.overall).toFixed(1)}`).join(' ');
  const first = pts[0].overall;
  const last = pts[pts.length - 1].overall;
  return (
    <figure className="min-w-0" data-testid="spec-history">
      <svg viewBox={`-4 0 ${w + 8} ${height}`} className="h-[44px] w-full max-w-[260px]" role="img" aria-label={`Overall score over ${pts.length} checks: from ${first} to ${last}`}>
        <line x1={0} x2={w} y1={y(70)} y2={y(70)} stroke="var(--w-border-strong)" strokeDasharray="3 3" />
        <path d={path} fill="none" stroke="var(--w-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={p.id} cx={i * step} cy={y(p.overall)} r={2.6} fill={scoreColor(p.overall)}><title>{`${p.overall} · ${new Date(p.createdAt).toLocaleString()}`}</title></circle>)}
      </svg>
      <figcaption className="mt-0.5 text-[11.5px] text-[var(--w-text-3)]">
        {pts.length} checks · {first} → <b className="font-semibold" style={{ color: signalText(scoreColor(last)) }}>{last}</b>{last > first ? ` (+${last - first})` : last < first ? ` (${last - first})` : ''}
      </figcaption>
    </figure>
  );
}

// ─── Một phát hiện ───────────────────────────────────────────────

function FindingRow({ f, config, review, onJump, onChanged, canAct }: {
  f: SpecFinding; config: ProjectConfig; review: SpecReview; canAct: boolean;
  onJump?: (f: SpecFinding) => void; onChanged: (r: SpecReview) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(f.rewrite ?? '');
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const apply = useMutation({
    mutationFn: () => workS6Api.apply(config.id, review.id, f.id, text.trim() || null),
    onSuccess: (r) => { toast.success(f.target?.kind === 'PAGE' ? 'Applied — saved as a new version of the page. Check again to update the score.' : 'Applied to the issue. Check again to update the score.'); onChanged(r); },
    onError: (err) => toast.error(workError(err, 'Could not apply the suggestion')),
  });
  const dismiss = useMutation({
    mutationFn: (v: boolean) => workS6Api.dismiss(config.id, review.id, f.id, v),
    onSuccess: onChanged,
    onError: (err) => toast.error(workError(err, 'Could not update the finding')),
  });
  // CTW đợt 4 (A16): phát hiện ⇒ Bug trong defect log (Activity Review), bấm lại trả Bug cũ.
  const bug = useMutation({
    mutationFn: async () => { const b = await workCtw4Api.bugFromFinding(config.id, review.id, f.id); return { b, r: await workS6Api.review(config.id, review.id) }; },
    onSuccess: ({ b, r }) => { toast.success(b.created ? `Logged as ${b.key}` : `Already logged as ${b.key}`); onChanged(r); },
    onError: (err) => toast.error(workError(err, 'Could not log the bug')),
  });
  // Phát hiện cấp tài liệu (thiếu mục, không failure mode…) không có đoạn văn để nhảy tới.
  const jumpable = f.target && (f.target.kind === 'ISSUE' || (f.target.kind === 'PAGE' && f.target.blockIndex !== undefined));
  const done = f.status !== 'open';
  return (
    <li className={cn('rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]', done && 'opacity-70')} data-testid="spec-finding" data-rule={f.rule}>
      <div className="flex items-start gap-2 px-2.5 py-2">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-label={open ? 'Collapse' : 'Expand'}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px]">
            <span className="inline-flex items-center gap-1 font-medium" style={{ color: signalText(SEV_COLOR[f.severity]) }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEV_COLOR[f.severity] }} aria-hidden="true" />{SEV_LABEL[f.severity]}
            </span>
            <span className="text-[var(--w-text-3)]">{DIMENSION_INFO[f.dimension].label}</span>
            {jumpable ? (
              f.target!.kind === 'ISSUE' && !onJump
                ? <Link href={`${base}/issue/${f.target!.issueNumber}`} className="font-mono text-[var(--w-accent-text)] hover:underline">{f.ref}</Link>
                : <button type="button" onClick={() => onJump?.(f)} className="font-mono text-[var(--w-accent-text)] hover:underline" data-testid="spec-jump">{f.ref}</button>
            ) : <span className="font-mono text-[var(--w-text-2)]">{f.ref}</span>}
            {f.source === 'ai' && <span className="inline-flex items-center gap-0.5 rounded-[4px] bg-[var(--w-accent-soft)] px-1 text-[10.5px] font-medium text-[var(--w-accent-text)]" title="Semantic finding from the AI review"><Sparkles size={9} /> AI</span>}
            {f.status === 'applied' && <span className="inline-flex items-center gap-0.5 text-[var(--w-green)]"><Check size={11} /> Applied{f.appliedBy ? ` by ${f.appliedBy.name}` : ''}</span>}
            {f.status === 'dismissed' && <span className="text-[var(--w-text-3)]">Dismissed</span>}
          </div>
          <p className="mt-0.5 text-[13px] leading-snug text-[var(--w-text)] [overflow-wrap:anywhere]">{f.why}</p>
          {f.excerpt && !open && <p className="mt-0.5 truncate text-[12px] italic text-[var(--w-text-3)]">“{f.excerpt}”</p>}
        </div>
      </div>
      {open && (
        <div className="space-y-2 border-t border-[var(--w-border)] px-3 py-2.5 text-[12.5px]">
          {f.excerpt && <blockquote className="border-l-2 border-[var(--w-border-strong)] pl-2 text-[var(--w-text-2)] [overflow-wrap:anywhere]">{f.excerpt}</blockquote>}
          <p className="text-[var(--w-text-2)]"><b className="font-medium text-[var(--w-text)]">Suggestion:</b> {f.suggestion}</p>
          {f.rewrite !== null && f.status === 'open' && canAct && (
            <div>
              <label className="mb-1 block text-[11.5px] font-medium text-[var(--w-text-3)]" htmlFor={`rw-${review.id}-${f.id}`}>
                {f.rule === 'missing_ac' ? 'Acceptance criteria to add (one per line) — edit before applying' : 'Rewrite — edit before applying'}
              </label>
              <textarea id={`rw-${review.id}-${f.id}`} className="w-input !min-h-[64px] text-[12.5px]" rows={f.rule === 'missing_ac' ? 3 : 2} maxLength={4000} value={text} onChange={(e) => setText(e.target.value)} data-testid="spec-rewrite" />
            </div>
          )}
          {f.status === 'applied' && f.rewrite && <p className="text-[var(--w-text-3)]">Applied text: <span className="text-[var(--w-text-2)]">{f.rewrite}</span></p>}
          {canAct && (
            <div className="flex flex-wrap items-center gap-2">
              {f.status === 'open' && f.rewrite !== null && f.target && (
                <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={apply.isPending || !text.trim()} onClick={() => apply.mutate()} data-testid="spec-apply">
                  {apply.isPending ? <Spinner size={11} /> : <Check size={12} />} Apply
                </button>
              )}
              {f.status === 'open' && (
                <button type="button" className="w-btn w-btn-sm" disabled={dismiss.isPending} onClick={() => dismiss.mutate(true)}><CircleSlash size={12} /> Dismiss</button>
              )}
              {f.bugNumber ? (
                <Link href={`${base}/issue/${f.bugNumber}`} className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 font-mono text-[11.5px] text-[var(--w-accent-text)] hover:underline">Bug {config.key}-{f.bugNumber}</Link>
              ) : (
                <button type="button" className="w-btn w-btn-sm" disabled={bug.isPending} onClick={() => bug.mutate()} data-testid="spec-log-bug">{bug.isPending ? <Spinner size={11} /> : null} Log as bug</button>
              )}
              {f.status === 'dismissed' && (
                <button type="button" className="w-btn w-btn-sm" disabled={dismiss.isPending} onClick={() => dismiss.mutate(false)}><Undo2 size={12} /> Restore</button>
              )}
              {f.source === 'ai' && f.status === 'open' && f.rewrite !== null && <span className="text-[11.5px] text-[var(--w-text-3)]">Applying marks the {f.target?.kind === 'ISSUE' ? 'issue' : 'page'} as AI-assisted.</span>}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// ─── Khung kết quả ───────────────────────────────────────────────

export function SpecPanel({ config, review, history, running, onRun, onJump, onChanged, canRun, gateThreshold }: {
  config: ProjectConfig;
  review: SpecReview | null | undefined;
  history?: SpecReviewSummary[];
  running: boolean;
  onRun: (semantic: boolean) => void;
  onJump?: (f: SpecFinding) => void;
  onChanged: (r: SpecReview) => void;
  canRun: boolean;
  gateThreshold?: number;
}) {
  const [dim, setDim] = useState<SpecDimension | 'all'>('all');
  const [showClosed, setShowClosed] = useState(false);
  const [semantic, setSemantic] = useState(!!config.permissions.useAi);
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const findings = review?.findings ?? [];
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    for (const f of findings) if (f.status === 'open') { c.all = (c.all ?? 0) + 1; c[f.dimension] = (c[f.dimension] ?? 0) + 1; }
    return c;
  }, [findings]);
  const shown = findings.filter((f) => (dim === 'all' || f.dimension === dim) && (showClosed || f.status === 'open'));
  const sevRank = { high: 0, medium: 1, low: 2 } as const;
  shown.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

  return (
    <div className="space-y-4" data-testid="spec-panel">
      <div className="flex flex-wrap items-center gap-2">
        {canRun && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={running} onClick={() => onRun(semantic)} data-testid="spec-run">
            {running ? <Spinner size={11} /> : review ? <RefreshCw size={12} /> : <Gauge size={12} />} {review ? 'Check again' : 'Check spec quality'}
          </button>
        )}
        {canRun && config.permissions.useAi && (
          <label className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]" title="Code checks always run. The AI adds semantic findings (contradictions, missing edge cases).">
            <input type="checkbox" checked={semantic} onChange={(e) => setSemantic(e.target.checked)} /> Include AI semantic review
          </label>
        )}
      </div>

      {!review ? (
        <p className="text-[13px] leading-relaxed text-[var(--w-text-2)]">
          {running ? 'Checking…' : 'Not checked yet. The check scores four dimensions of ISO/IEC/IEEE 29148 — completeness, consistency, unambiguity and verifiability — and lists what to fix.'}
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <OverallBadge n={review.overall} />
            <div className="min-w-0 flex-1 text-[12px] text-[var(--w-text-3)]">
              <div className="truncate text-[13px] font-medium text-[var(--w-text)]">{review.scopeLabel}</div>
              <div>
                {review.itemCount} requirement{review.itemCount === 1 ? '' : 's'} · {relativeTime(review.createdAt)}{review.createdBy ? ` by ${review.createdBy.name}` : ''}
                {review.pageVersion ? ` · v${review.pageVersion}` : ''}
              </div>
            </div>
            {history && <SpecSparkline items={history} />}
          </div>
          {review.stale && (
            <p className="flex items-center gap-1.5 rounded-[6px] bg-[color-mix(in_srgb,var(--w-orange)_9%,transparent)] px-2 py-1.5 text-[12px]"><AlertTriangle size={12} className="text-[var(--w-orange)]" /> The page changed after this check (now v{review.currentPageVersion}). Check again for a current score.</p>
          )}
          {review.stats.docKind && (
            <p className="text-[12px] text-[var(--w-text-2)]" data-testid="spec-doc-kind">
              Checked as <b className="font-medium text-[var(--w-text)]">{({ SRS: 'an SRS (ISO/IEC/IEEE 29148)', SDD: 'a design description (IEEE 1016)', GDD: 'a game design document', OTHER: 'a general document (no section checks)' } as const)[review.stats.docKind]}</b>{review.stats.docKindAuto ? ' — auto-detected' : ''}.
            </p>
          )}
          <ScoreBars s={review} threshold={gateThreshold} />
          <p className="text-[11.5px] text-[var(--w-text-3)]">
            Verifiability = 40% acceptance criteria ({review.stats.acPct}%) + 30% linked tests ({review.stats.testPct}%) + 30% measurable wording ({review.stats.verifiabilityRules}).
            {' '}{review.semantic === 'OK' ? <span className="inline-flex items-center gap-0.5"><Bot size={11} /> AI semantic review included{review.model ? ` (${review.model})` : ''}.</span>
              : review.semantic === 'UNAVAILABLE' ? <b className="font-medium text-[var(--w-orange)]">Semantic review unavailable — {review.stats.semanticReason ?? 'the AI call failed'}; code checks are complete.</b>
                : 'Code checks only.'}
          </p>

          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Filter findings by dimension">
            {(['all', ...SPEC_DIMENSIONS] as const).map((k) => (
              <button
                key={k} type="button" role="tab" aria-selected={dim === k} onClick={() => setDim(k)}
                className={cn('h-7 rounded-[6px] border px-2 text-[12px]', dim === k ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
                data-testid={`spec-filter-${k}`}
              >
                {k === 'all' ? 'All' : DIMENSION_INFO[k].short} <span className="tabular opacity-70">{counts[k] ?? 0}</span>
              </button>
            ))}
            <label className="ml-auto flex items-center gap-1 text-[11.5px] text-[var(--w-text-3)]"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Show applied/dismissed</label>
          </div>
          {shown.length ? (
            <ul className="space-y-1.5">
              {shown.map((f) => <FindingRow key={`${review.id}-${f.id}`} f={f} config={config} review={review} onJump={onJump} onChanged={onChanged} canAct={canRun} />)}
            </ul>
          ) : <p className="flex items-center gap-1.5 text-[13px] text-[var(--w-green)]"><Check size={13} /> Nothing open{dim !== 'all' ? ` for ${DIMENSION_INFO[dim].label.toLowerCase()}` : ''}.</p>}

          <section aria-label="Requirements without tests">
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold"><FlaskConical size={13} /> Not traced to a test <span className="tabular font-normal text-[var(--w-text-3)]">· {review.untraced.length}</span></h3>
            {review.untraced.length ? (
              <ul className="max-h-[220px] space-y-0.5 overflow-y-auto text-[12.5px]">
                {review.untraced.map((u) => (
                  <li key={u.ref} className="flex min-w-0 items-center gap-2">
                    {u.target?.kind === 'ISSUE'
                      ? <Link href={`${base}/issue/${u.target.issueNumber}`} className="shrink-0 font-mono text-[var(--w-accent-text)] hover:underline">{u.ref}</Link>
                      : <button type="button" className="shrink-0 font-mono text-[var(--w-accent-text)] hover:underline" onClick={() => onJump?.({ target: u.target, excerpt: u.title } as SpecFinding)}>{u.ref}</button>}
                    <span className="min-w-0 truncate text-[var(--w-text-2)]">{u.title}</span>
                    {!u.hasAcceptanceCriteria && <span className="ml-auto shrink-0 text-[11px] text-[var(--w-orange)]">no criteria</span>}
                  </li>
                ))}
              </ul>
            ) : <p className="text-[12.5px] text-[var(--w-green)]">Every requirement has a linked test.</p>}
            {!review.stats.testingEnabled && <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">Test management is off in this project — turn it on under Tests to link test cases.</p>}
            {review.scope === 'PAGE' && <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">A sentence is traced when it names a requirement issue (e.g. {config.key}-12) that has a linked test.</p>}
          </section>
        </>
      )}
    </div>
  );
}

// ─── Ngăn bên phải trên trang Docs ───────────────────────────────

/** Tìm khối chữ trong trình soạn thảo (theo trích đoạn) rồi cuộn tới + nháy sáng. */
export function jumpToText(root: ParentNode | null, f: Pick<SpecFinding, 'excerpt' | 'target'>): boolean {
  if (!root) return false;
  const blocks = Array.from(root.querySelectorAll<HTMLElement>('.ProseMirror p, .ProseMirror li, .ProseMirror td, .ProseMirror th'));
  const want = (f.excerpt ?? '').replace(/…$/, '').trim().slice(0, 60).toLowerCase();
  let el = want ? blocks.find((b) => (b.textContent ?? '').toLowerCase().includes(want)) : undefined;
  if (!el && f.target?.blockIndex !== undefined) el = blocks.filter((b) => b.tagName === 'P')[f.target.blockIndex];
  if (!el) return false;
  // ProseMirror tự hoàn tác thay đổi class trên nút nó quản lý ⇒ KHÔNG gắn class vào đoạn; vẽ một lớp phủ cố định đè lên.
  el.scrollIntoView({ behavior: 'auto', block: 'center' });
  const r = el.getBoundingClientRect();
  const box = document.createElement('div');
  box.className = 'w-spec-flash';
  box.setAttribute('aria-hidden', 'true');
  Object.assign(box.style, { position: 'fixed', left: `${r.left - 4}px`, top: `${r.top - 3}px`, width: `${r.width + 8}px`, height: `${r.height + 6}px`, pointerEvents: 'none', zIndex: '55' });
  document.body.appendChild(box);
  const off = () => { box.remove(); window.removeEventListener('scroll', off, true); };
  // Sự kiện cuộn của chính scrollIntoView tới ở khung hình sau ⇒ chỉ nghe cuộn của NGƯỜI DÙNG sau đó.
  window.setTimeout(() => window.addEventListener('scroll', off, true), 200);
  window.setTimeout(off, 2200);
  return true;
}

export function DocSpecDrawer({ open, onClose, config, pageNumber, beforeRun, onApplied, rootSelector = '.w-doc' }: {
  open: boolean; onClose: () => void; config: ProjectConfig; pageNumber: number;
  /** Lưu chữ đang gõ trước khi chấm (tự lưu của trang). */
  beforeRun?: () => Promise<void>;
  /** Đã áp dụng gợi ý ⇒ trang có phiên bản mới — tải lại trang. */
  onApplied?: () => void;
  rootSelector?: string;
}) {
  const pid = config.id;
  const qc = useQueryClient();
  const hist = useQuery({ queryKey: workS6Keys.reviews(pid, { page: pageNumber }), queryFn: () => workS6Api.reviews(pid, { page: pageNumber, limit: 30 }), enabled: open });
  const latestId = hist.data?.items[0]?.id;
  const [current, setCurrent] = useState<SpecReview | null>(null);
  // CTW-12: khung chấm theo loại trang (Auto = nhận từ mẫu/tiêu đề/đề mục).
  const [docType, setDocType] = useState<'AUTO' | 'SRS' | 'SDD' | 'GDD' | 'OTHER'>('AUTO');
  const latest = useQuery({ queryKey: workS6Keys.review(pid, latestId ?? 0), queryFn: () => workS6Api.review(pid, latestId!), enabled: open && !!latestId && !current });
  const review = current ?? latest.data ?? null;
  const run = useMutation({
    mutationFn: async (semantic: boolean) => { await beforeRun?.(); return workS6Api.reviewPage(pid, pageNumber, { semantic, docType }); },
    onSuccess: (r) => {
      setCurrent(r);
      qc.invalidateQueries({ queryKey: workS6Keys.allReviews(pid) });
      toast.success(`Spec Fidelity ${r.overall}/100`);
    },
    onError: (err) => toast.error(workError(err, 'Could not check the page')),
  });
  const canRun = ['ADMIN', 'MEMBER', 'TEACHER'].includes(config.role);
  if (!open) return null;
  return (
    <aside
      className="fixed bottom-0 right-0 top-0 z-[60] flex w-full max-w-[460px] flex-col border-l border-[var(--w-border)] bg-[var(--w-panel)] shadow-[var(--w-shadow-pop,0_10px_40px_rgba(0,0,0,.18))]"
      aria-label="Spec quality" data-testid="spec-drawer"
    >
      <div className="flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-4">
        <Gauge size={15} className="text-[var(--w-accent-text)]" />
        <h2 className="min-w-0 flex-1 truncate text-[14px] font-semibold">Spec quality</h2>
        <Link href={`/work/${config.workspace.slug}/${config.key}/spec`} className="w-btn w-btn-ghost w-btn-sm" title="All checks in this project"><ExternalLink size={12} /> <span className="max-sm:hidden">All checks</span></Link>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Close" onClick={onClose}><X size={15} /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {canRun && (
          <div className="mb-3 flex items-center gap-2">
            <label htmlFor={`w-spec-doctype-${pageNumber}`} className="text-[12px] text-[var(--w-text-2)]">Document type</label>
            <select id={`w-spec-doctype-${pageNumber}`} className="w-input !h-7 !w-auto !py-0 text-[12.5px]" value={docType} onChange={(e) => setDocType(e.target.value as typeof docType)} data-testid="spec-doc-type">
              <option value="AUTO">Auto-detect</option><option value="SRS">SRS (requirements)</option><option value="SDD">SDD / SDS (design)</option><option value="GDD">GDD (game design)</option><option value="OTHER">Other document</option>
            </select>
          </div>
        )}
        <SpecPanel
          config={config}
          review={review}
          history={hist.data?.items}
          running={run.isPending}
          onRun={(s) => run.mutate(s)}
          canRun={canRun}
          onJump={(f) => {
            if (f.target?.kind === 'ISSUE') { window.location.href = `/work/${config.workspace.slug}/${config.key}/issue/${f.target.issueNumber}`; return; }
            const ok = jumpToText(document.querySelector(rootSelector), f);
            if (!ok) toast.info('That text is no longer in the page — check again.');
            else if (window.innerWidth < 900) onClose();
          }}
          onChanged={(r) => { setCurrent(r); if (r.findings.some((x) => x.status === 'applied')) onApplied?.(); }}
        />
      </div>
    </aside>
  );
}

// ─── Nhãn AI-assisted ────────────────────────────────────────────

export function AiAssistedBadge({ model, at, className }: { model?: string | null; at?: string | null; className?: string }) {
  return (
    <span
      className={cn('inline-flex h-[20px] shrink-0 items-center gap-1 rounded-[5px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-1.5 text-[11.5px] font-medium text-[var(--w-accent-text)]', className)}
      title={`AI-assisted${model ? ` · ${model}` : ''}${at ? ` · ${new Date(at).toLocaleString()}` : ''} — needs a human reviewer before release`}
      data-testid="ai-assisted"
    >
      <Sparkles size={10} /> AI-assisted
    </span>
  );
}

/** Ô "AI-assisted" trong thuộc tính thẻ: nhãn + gắn/gỡ tay (người sửa được thẻ). */
export function AiAssistedControl({ on, model, at, editable, onToggle }: { on: boolean; model?: string | null; at?: string | null; editable: boolean; onToggle: (v: boolean) => void }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5 px-2 text-[12.5px]">
      {on ? <AiAssistedBadge model={model} at={at} /> : <span className="text-[var(--w-text-3)]">No</span>}
      {on && model && <span className="min-w-0 truncate text-[11.5px] text-[var(--w-text-3)]" title={model}>{model}</span>}
      {editable && (
        <button type="button" className="text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => onToggle(!on)} data-testid="ai-assisted-toggle">
          {on ? 'Remove' : 'Mark'}
        </button>
      )}
    </div>
  );
}

// ─── Cổng Spec Fidelity trong hộp "Request gate review" ──────────

export function SpecGateBox({ config, stageId, gate, isAdmin, reason, onReason }: {
  config: ProjectConfig; stageId: number; gate: SpecGateStatus | undefined; isAdmin: boolean; reason: string; onReason: (v: string) => void;
}) {
  if (!gate?.applies) return null;
  const base = `/work/${config.workspace.slug}/${config.key}`;
  return (
    <div className={cn('mb-4 rounded-[8px] border p-3 text-[13px]', gate.pass ? 'border-[color-mix(in_srgb,var(--w-green)_35%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_7%,transparent)]' : 'border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_8%,transparent)]')} data-testid="spec-gate-box">
      <div className="flex items-start gap-2.5">
        {gate.review ? <OverallBadge n={gate.review.scores.overall} size={36} /> : <Gauge size={18} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />}
        <div className="min-w-0 flex-1">
          <div className="font-semibold">Spec Fidelity gate {gate.pass ? '— passed' : '— not met'}</div>
          <p className="mt-0.5 text-[12px] text-[var(--w-text-2)]">
            Needs overall ≥ {gate.config.minOverall} and every dimension ≥ {gate.config.minDimension}.
            {gate.review ? ` Latest check: ${gate.review.scopeLabel}, ${relativeTime(gate.review.createdAt)}${gate.review.stale ? ' (document changed since)' : ''}. It is attached to the approval.` : ''}
          </p>
          {!gate.pass && <ul className="mt-1 list-disc pl-4 text-[12px]">{gate.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
          {gate.review && <div className="mt-2"><ScoreBars s={gate.review.scores} compact threshold={gate.config.minDimension} /></div>}
          {!gate.pass && (
            <Link href={`${base}/spec?stage=${stageId}`} className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--w-accent-text)] hover:underline"><Gauge size={12} /> Check spec quality for this stage</Link>
          )}
        </div>
      </div>
      {!gate.pass && isAdmin && (
        <label className="mt-2.5 block">
          <span className="mb-1 block text-[12px] text-[var(--w-text-2)]">Admin override — reason (recorded in the audit log)</span>
          <input className="w-input !h-8" value={reason} maxLength={1000} onChange={(e) => onReason(e.target.value)} placeholder="e.g. Client accepted the open questions in the kickoff meeting" data-testid="spec-gate-reason" />
        </label>
      )}
    </div>
  );
}
