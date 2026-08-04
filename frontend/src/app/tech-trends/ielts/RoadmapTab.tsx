'use client';

/**
 * Tab Lộ trình — 4 chặng band, tách ra khỏi IeltsClient khi trang có thêm tab.
 *
 * Chặng nào đã có nội dung học thì hiện nút dẫn thẳng sang tab tương ứng; các
 * chặng chưa soạn thì nói rõ là chưa có, đỡ để người học đi tìm.
 */
import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, Target, Flag, ArrowRight } from 'lucide-react';
import { BAND_STAGES, IELTS_STATS } from './data/roadmap';
import { KEYS, STAGE1_STATS } from './data/stage1';

export default function RoadmapTab({ onGoToLessons }: { onGoToLessons: () => void }) {
  const [open, setOpen] = useState<string>(BAND_STAGES[0].id);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(KEYS.checkpoints);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* localStorage bị chặn — vẫn xem được, chỉ không nhớ tiến độ */
    }
  }, []);

  const toggle = useCallback((key: string) => {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(KEYS.checkpoints, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, []);

  const totalDone = hydrated
    ? BAND_STAGES.flatMap((s) => s.checkpoints.map((_, i) => `${s.id}:${i}`)).filter((k) => done[k]).length
    : 0;

  return (
    <div>
      {hydrated && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Mốc đã đạt</span>
            <span>{totalDone}/{IELTS_STATS.checkpoints}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(totalDone / IELTS_STATS.checkpoints) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {BAND_STAGES.map((stage, si) => {
          const isOpen = open === stage.id;
          const stageDone = hydrated
            ? stage.checkpoints.filter((_, i) => done[`${stage.id}:${i}`]).length
            : 0;
          const allDone = stageDone === stage.checkpoints.length;
          const hasContent = si === 0; // hiện mới soạn xong chặng 1
          return (
            <div
              key={stage.id}
              className={`rounded-2xl border overflow-hidden transition-colors ${
                allDone ? 'border-emerald-400/30 bg-emerald-500/[0.05]' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? '' : stage.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="shrink-0 w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-2xl">
                  {stage.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      Band {stage.from} → {stage.to}
                    </span>
                    <span className="text-xs text-slate-500">{stage.duration}</span>
                    <span className="text-xs text-slate-500">· Chặng {si + 1}</span>
                    {hasContent ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        ĐÃ CÓ NỘI DUNG HỌC
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                        đang soạn
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-white mt-1.5">{stage.title}</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{stage.youAre}</p>
                </div>
                <span
                  className={`shrink-0 text-xs px-2 py-1 rounded-lg ${
                    allDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {stageDone}/{stage.checkpoints.length}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 space-y-5">
                  {hasContent && (
                    <button
                      type="button"
                      onClick={onGoToLessons}
                      className="w-full flex items-center justify-between gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-left hover:bg-emerald-500/15 transition-colors"
                    >
                      <div>
                        <p className="text-emerald-200 font-semibold text-sm">Nội dung học chặng này đã sẵn sàng</p>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                          {STAGE1_STATS.lessons} bài học · {STAGE1_STATS.words} từ vựng ·{' '}
                          {STAGE1_STATS.readings} bài đọc · {STAGE1_STATS.listenings} bài nghe ·{' '}
                          {STAGE1_STATS.writings} đề viết · {STAGE1_STATS.speakingQuestions} câu nói
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-300 shrink-0" />
                    </button>
                  )}

                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.08] p-4">
                    <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-1.5">
                      <Target className="w-4 h-4" />
                      Việc quan trọng nhất chặng này
                    </p>
                    <p className="text-slate-200 text-sm leading-relaxed">{stage.keyFocus}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {stage.skills.map((sk) => (
                      <div key={sk.skill} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-semibold text-white flex items-center gap-2">
                          <span>{sk.icon}</span> {sk.skill}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">Mỗi ngày</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{sk.daily}</p>
                        <p className="text-xs text-slate-500 mt-2">Đạt được</p>
                        <p className="text-emerald-300/90 text-sm leading-relaxed">{sk.target}</p>
                        <p className="mt-2 text-xs text-rose-300/90 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{sk.trap}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                      <Flag className="w-4 h-4 text-sky-400" />
                      Đủ những mốc này thì lên chặng sau
                    </p>
                    <ul className="space-y-2">
                      {stage.checkpoints.map((c, i) => {
                        const key = `${stage.id}:${i}`;
                        const ok = hydrated && done[key];
                        return (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => toggle(key)}
                              className={`w-full text-left flex items-start gap-2.5 rounded-xl border p-3 transition-all active:scale-[0.99] ${
                                ok
                                  ? 'border-emerald-400/30 bg-emerald-500/[0.08]'
                                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                              }`}
                            >
                              {ok
                                ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                                : <Circle className="w-5 h-5 shrink-0 text-slate-600" />}
                              <span className={`text-sm leading-relaxed ${ok ? 'text-emerald-100' : 'text-slate-200'}`}>
                                {c}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
