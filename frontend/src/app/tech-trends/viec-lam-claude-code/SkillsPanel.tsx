'use client';

/**
 * Tab Kỹ năng — 48 kỹ năng đo từ toàn văn 107/108 mô tả công việc.
 *
 * Cột `jobs` là số tin THỰC SỰ nhắc tới kỹ năng đó khi quét JD gốc, không
 * phải đọc nhãn của aitmpl — đã kiểm 20 nhãn thì 14 nhãn không hề xuất hiện
 * trong JD. Vì vậy biểu đồ này mới là căn cứ để quyết định học gì trước.
 */
import { useMemo, useState } from 'react';
import { Check, Info } from 'lucide-react';
import { GROUP_LABEL, SKILLS, STATS } from './data';
import type { Skill } from './data';

type Filter = 'all' | 'gap' | 'have';

export default function SkillsPanel() {
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>('python');

  const max = useMemo(() => Math.max(...SKILLS.map((s) => s.jobs)), []);

  const list = useMemo(() => {
    const base = SKILLS.filter((s) =>
      filter === 'all' ? true : filter === 'gap' ? !s.have : s.have,
    );
    return [...base].sort((a, b) => b.jobs - a.jobs);
  }, [filter]);

  const byGroup = useMemo(() => {
    const m = new Map<Skill['group'], Skill[]>();
    for (const s of list) {
      const arr = m.get(s.group) ?? [];
      arr.push(s);
      m.set(s.group, arr);
    }
    return m;
  }, [list]);

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-bold text-white">{STATS.skills} kỹ năng, đo từ mô tả công việc</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Số bên phải là số tin thực sự nhắc tới kỹ năng đó khi quét toàn văn JD gốc — không phải
          đọc nhãn của aitmpl, vì nhãn ở đó sai 14/20 khi đối chiếu. Đây mới là căn cứ để quyết định
          học gì trước.
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          ['all', `Tất cả ${STATS.skills}`],
          ['gap', `Cần học ${STATS.skillsGap}`],
          ['have', `Đã có ${STATS.skillsHave}`],
        ] as [Filter, string][]).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={[
              'rounded-xl px-3 py-1.5 text-sm transition-colors',
              filter === id
                ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chú giải */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-6 rounded-sm bg-violet-500" />
          cần học thêm
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-6 rounded-sm bg-slate-600" />
          đã có qua dự án cuongthai.com
        </span>
      </div>

      {/* Biểu đồ theo nhóm */}
      <div className="space-y-6">
        {[...byGroup.entries()].map(([group, items]) => (
          <section key={group}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {GROUP_LABEL[group]}
              <span className="ml-2 tabular-nums text-slate-600">{items.length}</span>
            </h3>
            <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/10 bg-white/[0.02]">
              {items.map((s) => {
                const isOpen = openId === s.id;
                const hasMore = Boolean(s.why || s.learn?.length);
                return (
                  <div key={s.id}>
                    <button
                      type="button"
                      onClick={() => hasMore && setOpenId(isOpen ? null : s.id)}
                      aria-expanded={hasMore ? isOpen : undefined}
                      className={[
                        'flex w-full items-center gap-3 px-3 py-2.5 text-left sm:px-4',
                        hasMore ? 'transition-colors hover:bg-white/[0.04]' : 'cursor-default',
                      ].join(' ')}
                    >
                      <span className="w-36 shrink-0 truncate text-[13px] text-slate-200 sm:w-52">
                        {s.have && (
                          <Check className="mr-1 inline h-3 w-3 shrink-0 text-slate-500" />
                        )}
                        {s.name}
                      </span>
                      <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-white/[0.07]">
                        <span
                          className={`block h-full rounded-sm ${s.have ? 'bg-slate-600' : 'bg-violet-500'}`}
                          style={{ width: `${(s.jobs / max) * 100}%` }}
                        />
                      </span>
                      <span className="w-14 shrink-0 text-right text-xs tabular-nums text-slate-500">
                        {s.jobs} tin
                      </span>
                    </button>

                    {isOpen && hasMore && (
                      <div className="space-y-3 border-t border-white/[0.06] bg-white/[0.02] px-3 py-3.5 sm:px-4">
                        {s.why && (
                          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-300">
                            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" />
                            <span>{s.why}</span>
                          </p>
                        )}
                        {s.learn && s.learn.length > 0 && (
                          <div>
                            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              {s.have ? 'Nâng lên mức nói được' : 'Học thế nào'}
                            </div>
                            <ul className="space-y-1.5">
                              {s.learn.map((l) => (
                                <li
                                  key={l}
                                  className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-400"
                                >
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                                  {l}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-slate-600">
        Phần &quot;đã có&quot; suy ra từ chính kho api-backend: Next.js, Express, TypeScript, Prisma,
        PostgreSQL, Docker, GitHub Actions, VPS, Cloudflare R2, và việc dùng Claude Code hằng ngày.
        Nếu đánh giá này sai chỗ nào, sửa cờ <code className="rounded bg-white/[0.07] px-1 py-0.5">have</code>{' '}
        trong <code className="rounded bg-white/[0.07] px-1 py-0.5">data/skills.ts</code> là cả trang tự cập nhật.
      </p>
    </div>
  );
}
