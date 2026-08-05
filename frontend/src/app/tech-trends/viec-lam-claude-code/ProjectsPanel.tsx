'use client';

/**
 * Tab Dự án thật — 8 dự án, mở rộng từng cái để xem đủ các bước.
 *
 * Điểm mấu chốt của tab này: 7/8 dự án nâng cấp chính hệ thống cuongthai.com
 * đang chạy production, chứ không phải bài tập tutorial. Đó là lợi thế lớn
 * nhất so với ứng viên junior khác, nên giao diện phải làm bật được điều đó —
 * mỗi dự án hiện rõ "mở khoá tin nào" bằng tên công ty có thật.
 */
import { useState } from 'react';
import {
  Briefcase, ChevronDown, CircleCheck, Layers, ListChecks, Rocket, TriangleAlert,
} from 'lucide-react';
import { PROJECTS, PROJECT_STATS, SKILL_BY_ID } from './data';

const LEVEL: Record<string, string> = {
  'nền': 'bg-emerald-500/15 text-emerald-300',
  'giữa': 'bg-sky-500/15 text-sky-300',
  'khó': 'bg-violet-500/15 text-violet-300',
};

export default function ProjectsPanel() {
  const [open, setOpen] = useState<Record<string, boolean>>({ 'agent-evals': true });

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-bold text-white">{PROJECT_STATS.count} dự án thật</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Bảy trong tám dự án nâng cấp chính hệ thống cuongthai.com đang chạy production, chứ không
          phải bài tập tutorial. Đó là lợi thế lớn nhất bạn có: ứng viên junior khác mang bài tập,
          bạn mang một hệ thống thật đã từng hỏng và đã được sửa. Nhà tuyển dụng phân biệt được hai
          thứ đó ngay lập tức.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Tổng {PROJECT_STATS.steps} bước có tiêu chí kiểm được · {PROJECT_STATS.acceptance} tiêu chí
          nghiệm thu · {PROJECT_STATS.pitfalls} bẫy đã biết trước.
        </p>
      </div>

      <div className="space-y-4">
        {PROJECTS.map((p) => {
          const isOpen = open[p.id] ?? false;
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [p.id]: !isOpen }))}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.02] sm:p-5"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-bold tabular-nums text-slate-300">
                  {p.no}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white sm:text-lg">{p.title}</h3>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${LEVEL[p.level]}`}>
                      {p.level}
                    </span>
                    <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400">
                      {p.weeks}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{p.tagline}</p>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-5 border-t border-white/10 p-4 sm:p-5">
                  {/* Vì sao đáng làm */}
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-3.5">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                      <Rocket className="h-3.5 w-3.5" />
                      Vì sao đáng làm
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-300">{p.why}</p>
                  </div>

                  {/* Mở khoá tin nào */}
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <Briefcase className="h-3.5 w-3.5" />
                      Mở khoá được
                    </div>
                    <ul className="space-y-1">
                      {p.unlocks.map((u) => (
                        <li key={u} className="flex items-start gap-2 text-[13px] text-slate-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Công nghệ + kỹ năng */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400"
                      >
                        {s}
                      </span>
                    ))}
                    {p.skills.map((sid) => {
                      const s = SKILL_BY_ID[sid];
                      if (!s || s.have) return null;
                      return (
                        <span
                          key={sid}
                          className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] text-violet-300"
                        >
                          rèn: {s.name}
                        </span>
                      );
                    })}
                  </div>

                  {/* Các bước */}
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <Layers className="h-3.5 w-3.5" />
                      Các bước ({p.steps.length})
                    </div>
                    <ol className="space-y-3">
                      {p.steps.map((st, i) => (
                        <li key={st.title} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-bold tabular-nums text-slate-400">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-slate-100">{st.title}</div>
                            <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                              {st.detail}
                            </p>
                            <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-relaxed text-emerald-300/90">
                              <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span>
                                <span className="font-medium">Xong khi:</span> {st.check}
                              </span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Nghiệm thu */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                      <ListChecks className="h-3.5 w-3.5" />
                      Nghiệm thu — đủ hết mới tính là xong
                    </div>
                    <ul className="space-y-1.5">
                      {p.acceptance.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-[13px] text-slate-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bẫy */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3.5">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      <TriangleAlert className="h-3.5 w-3.5" />
                      Bẫy đã biết trước
                    </div>
                    <ul className="space-y-1.5">
                      {p.pitfalls.map((x) => (
                        <li key={x} className="flex items-start gap-2 text-[13px] text-slate-300">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Làm thêm */}
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Làm thêm nếu còn sức
                    </div>
                    <ul className="space-y-1">
                      {p.stretch.map((x) => (
                        <li key={x} className="flex items-start gap-2 text-[13px] text-slate-400">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                          {x}
                        </li>
                      ))}
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
