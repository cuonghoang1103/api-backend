'use client';

/**
 * Sơ đồ 21 chương chia 4 chặng.
 *
 * Hiện rõ chương nào đã viết đủ nội dung và chương nào mới có khung + bài tập,
 * thay vì để người học bấm vào rồi mới thất vọng. Biết trước thì họ chọn được
 * cách học phù hợp; không biết thì mất lòng tin vào cả trang.
 */
import { CheckCircle2, Circle, Lock, FileText } from 'lucide-react';
import type { Chapter } from './data/types';
import { STAGES } from './data';

const ACCENT: Record<string, { ring: string; text: string; bg: string; dot: string }> = {
  emerald: { ring: 'border-emerald-400/40', text: 'text-emerald-300', bg: 'bg-emerald-500/[0.07]', dot: 'bg-emerald-400' },
  sky: { ring: 'border-sky-400/40', text: 'text-sky-300', bg: 'bg-sky-500/[0.07]', dot: 'bg-sky-400' },
  violet: { ring: 'border-violet-400/40', text: 'text-violet-300', bg: 'bg-violet-500/[0.07]', dot: 'bg-violet-400' },
  amber: { ring: 'border-amber-400/40', text: 'text-amber-300', bg: 'bg-amber-500/[0.07]', dot: 'bg-amber-400' },
};

export default function RoadmapView({
  chapters, active, done, hydrated, onPick,
}: {
  chapters: Chapter[];
  active: number;
  done: Record<number, boolean>;
  hydrated: boolean;
  onPick: (no: number) => void;
}) {
  return (
    <div className="space-y-5">
      {STAGES.map((stage) => {
        const a = ACCENT[stage.color];
        const list = chapters.filter((c) => c.no >= stage.from && c.no <= stage.to);
        const doneInStage = hydrated ? list.filter((c) => done[c.no]).length : 0;

        return (
          <section key={stage.id} className={`rounded-2xl border ${a.ring} ${a.bg} p-4`}>
            <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className={`text-sm font-bold ${a.text}`}>{stage.title}</h3>
              <p className="text-xs text-slate-400">{stage.subtitle}</p>
              {hydrated && (
                <span className="ml-auto font-mono text-[11px] tabular-nums text-slate-500">
                  {doneInStage}/{list.length}
                </span>
              )}
            </header>

            <div className="grid gap-2 sm:grid-cols-2">
              {list.map((c) => {
                const isDone = hydrated && done[c.no];
                const isActive = c.no === active;
                const outline = c.status === 'outline';
                return (
                  <button
                    key={c.no}
                    type="button"
                    onClick={() => onPick(c.no)}
                    className={[
                      'flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all active:scale-[0.99]',
                      isActive
                        ? 'border-white/30 bg-white/[0.09]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]',
                    ].join(' ')}
                  >
                    <span className="mt-0.5 shrink-0 text-lg leading-none">{c.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500">CH.{String(c.no).padStart(2, '0')}</span>
                        {outline ? (
                          <span className="inline-flex items-center gap-1 rounded border border-amber-400/25 bg-amber-500/10 px-1.5 py-px text-[9px] font-semibold text-amber-300/90">
                            <Lock className="h-2.5 w-2.5" /> KHUNG
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded border border-emerald-400/25 bg-emerald-500/10 px-1.5 py-px text-[9px] font-semibold text-emerald-300/90">
                            <FileText className="h-2.5 w-2.5" /> ĐỦ BÀI
                          </span>
                        )}
                      </span>
                      <span className={`mt-0.5 block text-sm font-medium leading-snug ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {c.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">
                        {c.labCount} bài tập · {c.minutes} phút
                      </span>
                    </span>
                    {isDone
                      ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
