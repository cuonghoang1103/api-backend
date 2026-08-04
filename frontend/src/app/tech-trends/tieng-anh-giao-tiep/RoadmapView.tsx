'use client';

/**
 * Sơ đồ lộ trình — thay cho lưới nút phẳng.
 *
 * Ý đồ: người học nhìn một cái là thấy mình đang ở đâu trên cả chặng đường,
 * còn bao nhiêu, và tuần nào đã xong. Mỗi tuần là một hàng có đường nối các
 * mốc ngày; mốc đã học xong hiện dấu tích và đường nối đổi màu.
 *
 * Dùng SVG cho đường nối thay vì border CSS để đường chạy được qua khoảng
 * cách không đều và bo góc mượt trên mọi bề rộng màn hình.
 */
import { CheckCircle2, Lock } from 'lucide-react';
import type { WeekBlock } from './data';

export default function RoadmapView({
  weeks, activeDay, done, hydrated, onPick,
}: {
  weeks: WeekBlock[];
  activeDay: number;
  done: Record<number, boolean>;
  hydrated: boolean;
  onPick: (day: number) => void;
}) {
  const totalDays = weeks.reduce((s, w) => s + w.days.length, 0);
  const doneCount = hydrated
    ? weeks.flatMap((w) => w.days).filter((d) => done[d.day]).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Tổng quan */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] to-transparent p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Chặng đường của bạn</p>
            <p className="text-3xl font-bold text-white mt-1">
              {doneCount}
              <span className="text-lg text-slate-500 font-normal"> / {totalDays} ngày</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-violet-300">
              {Math.round((doneCount / totalDays) * 100)}%
            </p>
            <p className="text-xs text-slate-500">hoàn thành</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-sky-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${(doneCount / totalDays) * 100}%` }}
          />
        </div>
      </div>

      {/* Từng tuần */}
      {weeks.map((w) => {
        const weekDone = hydrated ? w.days.filter((d) => done[d.day]).length : 0;
        const allDone = weekDone === w.days.length;
        return (
          <div
            key={w.week}
            className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
              allDone
                ? 'border-emerald-400/30 bg-emerald-500/[0.06]'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            {/* Đầu tuần */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                      allDone ? 'bg-emerald-500 text-white' : 'bg-violet-500/20 text-violet-300'
                    }`}
                  >
                    {allDone ? '✓' : w.week}
                  </span>
                  <p className="font-bold text-white">Tuần {w.week} — {w.title}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{w.subtitle}</p>
              </div>
              <span
                className={`shrink-0 text-xs px-2 py-1 rounded-lg ${
                  allDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'
                }`}
              >
                {weekDone}/{w.days.length}
              </span>
            </div>

            {/* Dải mốc ngày, có đường nối chạy phía sau */}
            <div className="relative">
              {/* Đường nền chạy ngang giữa các mốc (ẩn trên mobile vì xếp dọc) */}
              <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-white/10" />
              <div
                className="hidden sm:block absolute top-6 left-[10%] h-0.5 bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${(weekDone / w.days.length) * 80}%` }}
              />

              <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-3">
                {w.days.map((d) => {
                  const on = d.day === activeDay;
                  const ok = hydrated && done[d.day];
                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => onPick(d.day)}
                      className="group flex flex-col items-center text-center"
                    >
                      {/* Mốc tròn */}
                      <span
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all group-active:scale-90 ${
                          ok
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-100'
                            : on
                              ? 'bg-violet-500/30 border-violet-400 scale-110'
                              : 'bg-[#12121a] border-white/15 group-hover:border-violet-400/50'
                        }`}
                      >
                        {ok ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : d.icon}
                        {on && !ok && (
                          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-violet-400" />
                        )}
                      </span>
                      <span
                        className={`mt-2 text-[11px] font-medium ${
                          on ? 'text-violet-300' : ok ? 'text-emerald-300/80' : 'text-slate-500'
                        }`}
                      >
                        Ngày {d.day}
                      </span>
                      <span
                        className={`text-[11px] leading-tight mt-0.5 ${
                          on ? 'text-slate-200' : 'text-slate-500'
                        }`}
                      >
                        {d.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Đích */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border-2 border-white/15 text-2xl mb-2">
          {doneCount === totalDays ? '🏆' : <Lock className="w-5 h-5 text-slate-600" />}
        </span>
        <p className={`font-bold ${doneCount === totalDays ? 'text-amber-300' : 'text-slate-400'}`}>
          {doneCount === totalDays
            ? 'Xong toàn bộ lộ trình! Chuyển sang tab “Cho Dev”.'
            : `Còn ${totalDays - doneCount} ngày nữa tới đích`}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Đích: nói liên tục 3 phút về bản thân, công việc và một câu chuyện theo cấu trúc STAR.
        </p>
      </div>
    </div>
  );
}
