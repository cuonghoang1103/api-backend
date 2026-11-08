'use client';

/**
 * Tab Lộ trình — 6 chặng, tick được, lưu localStorage.
 *
 * Chặng mở đầu (số 0) cố ý là "nộp trước đã" chứ không phải học: tin ở Sài Gòn
 * đang mở thật, mà cơ hội thì có hạn sử dụng còn kỹ năng thì không.
 */
import { useState } from 'react';
import {
  CheckCircle2, ChevronDown, Circle, Flag, Package, RotateCcw, Sparkles,
} from 'lucide-react';
import { PHASES, SKILL_BY_ID, TOTAL_TASKS } from './data';

export default function RoadmapPanel({
  done, ready, onToggle, onReset,
}: {
  done: Set<string>;
  ready: boolean;
  onToggle: (id: string) => void;
  onReset: () => void;
}) {
  /** Mặc định mở chặng đầu — chặng đang gấp nhất. */
  const [open, setOpen] = useState<Record<string, boolean>>({ p0: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-text-primary">Lộ trình 20 tuần</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Xếp theo thứ tự <strong className="text-text-secondary">có lý do</strong>, không theo độ khó:
            việc đang mở thì nộp trước; lấp khoảng trống rẻ nhất trước (Python đứng trước Kubernetes
            vì 48 tin đòi Python còn 6 tin đòi K8s); và tiếng Anh chạy song song cả 20 tuần thay vì
            thành một chặng riêng — gộp thành chặng riêng thì nó luôn bị đẩy xuống cuối rồi bỏ dở.
          </p>
        </div>
        {ready && done.size > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border-light-hover)] px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-rose-500/40 hover:text-tone-rose"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Xoá tiến độ
          </button>
        )}
      </div>

      <div className="space-y-4">
        {PHASES.map((p) => {
          const doneCount = p.tasks.filter((t) => done.has(t.id)).length;
          const all = doneCount === p.tasks.length && p.tasks.length > 0;
          const isOpen = open[p.id] ?? false;

          return (
            <div
              key={p.id}
              className={[
                'overflow-hidden rounded-2xl border bg-[var(--bg-surface-hover)] transition-colors',
                all ? 'border-emerald-500/40' : 'border-[var(--border-light)]',
              ].join(' ')}
            >
              {/* Đầu chặng — bấm để mở/đóng */}
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [p.id]: !isOpen }))}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-[var(--bg-surface-hover)] sm:p-5"
              >
                <span
                  className={[
                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums',
                    all ? 'bg-emerald-500/20 text-tone-emerald' : 'bg-[var(--bg-surface-hover)] text-text-secondary',
                  ].join(' ')}
                >
                  {p.no}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-text-primary sm:text-lg">{p.title}</h3>
                    <span className="rounded-md bg-[var(--bg-surface-hover)] px-2 py-0.5 text-[11px] text-text-secondary">
                      {p.span}
                    </span>
                    {ready && (
                      <span
                        className={[
                          'rounded-md px-2 py-0.5 text-[11px] tabular-nums',
                          all ? 'bg-emerald-500/20 text-tone-emerald' : 'bg-[var(--bg-surface-hover)] text-text-muted',
                        ].join(' ')}
                      >
                        {doneCount}/{p.tasks.length}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{p.goal}</p>
                </div>

                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-text-muted transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-[var(--border-light)] p-4 sm:p-5">
                  {/* Vì sao chặng này ở đây */}
                  <div className="mb-4 rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-3.5">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-tone-sky">
                      <Sparkles className="h-3.5 w-3.5" />
                      Vì sao chặng này đứng ở đây
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-secondary">{p.why}</p>
                  </div>

                  {/* Kỹ năng chặng này lấp */}
                  {p.skills.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {p.skills.map((sid) => {
                        const s = SKILL_BY_ID[sid];
                        if (!s) return null;
                        return (
                          <span
                            key={sid}
                            className={[
                              'rounded-md px-2 py-0.5 text-[11px]',
                              s.have
                                ? 'bg-[var(--bg-surface-hover)] text-text-secondary'
                                : 'bg-violet-500/15 text-tone-violet',
                            ].join(' ')}
                          >
                            {s.name}
                            <span className="ml-1 tabular-nums opacity-60">{s.jobs} tin</span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Việc cần làm */}
                  <ul className="space-y-2">
                    {p.tasks.map((t) => {
                      const isDone = done.has(t.id);
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => onToggle(t.id)}
                            aria-pressed={isDone}
                            className="flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                          >
                            {isDone ? (
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-tone-emerald" />
                            ) : (
                              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
                            )}
                            <span className="min-w-0">
                              <span
                                className={[
                                  'block text-sm font-medium',
                                  isDone ? 'text-text-muted line-through' : 'text-text-primary',
                                ].join(' ')}
                              >
                                {t.text}
                              </span>
                              {t.detail && (
                                <span className="mt-1 block text-[13px] leading-relaxed text-text-secondary">
                                  {t.detail}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Mốc & sản phẩm để lại */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3.5">
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-tone-amber">
                        <Flag className="h-3.5 w-3.5" />
                        Mốc phải đạt
                      </div>
                      <p className="text-[13px] leading-relaxed text-text-secondary">{p.milestone}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5">
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-tone-emerald">
                        <Package className="h-3.5 w-3.5" />
                        Để lại được gì
                      </div>
                      <p className="text-[13px] leading-relaxed text-text-secondary">{p.output}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-text-muted">
        Tổng {TOTAL_TASKS} việc. Tiến độ lưu ngay trên máy bạn, không gửi đi đâu.
      </p>
    </div>
  );
}
