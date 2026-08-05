'use client';

/**
 * Tab Việc làm — đủ 108 tin, lọc theo nhóm và tìm bỏ dấu.
 *
 * Ô tìm kiếm dùng `fold()` để bỏ dấu, và mỗi tin có sẵn trường `kw` tiếng
 * Việt. Lý do: địa điểm trong tin toàn tiếng Anh ("Ho Chi Minh City") nhưng
 * người đọc sẽ gõ "sài gòn" hoặc "sai gon" — không có lớp này thì tìm không ra
 * đúng tin quan trọng nhất.
 *
 * Mọi link đều trỏ về tin GỐC (HackerNews/Greenhouse/RemoteOK/WWR), không
 * qua aitmpl.
 */
import { useMemo, useState } from 'react';
import { ExternalLink, Search, X } from 'lucide-react';
import { JOBS, STATS, TIERS, fold } from './data';
import type { Tier } from './data';

type Filter = 'all' | Tier | 'fresh' | 'pay';

const TIER_STYLE: Record<Tier, string> = {
  A: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  B: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  C: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  D: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
};

/** "hôm qua" / "12 ngày" / "3 tháng" — gọn hơn ngày tháng đầy đủ. */
function ageLabel(d: number) {
  if (d <= 1) return 'hôm qua';
  if (d < 30) return `${d} ngày`;
  return `${Math.round(d / 30)} tháng`;
}

export default function JobsPanel() {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const needle = fold(q.trim());
    return JOBS.filter((j) => {
      if (filter === 'fresh') {
        if (j.ageDays > 45) return false;
      } else if (filter === 'pay') {
        if (!j.salary) return false;
      } else if (filter !== 'all') {
        if (j.tier !== filter) return false;
      }
      if (!needle) return true;
      return fold(
        `${j.company} ${j.position} ${j.location} ${j.tags.join(' ')} ${j.kw}`,
      ).includes(needle);
    });
  }, [filter, q]);

  const chips: [Filter, string][] = [
    ['all', `Tất cả ${STATS.jobs}`],
    ...TIERS.map((t) => [t.id, `${t.short} · ${STATS.byTier[t.id]}`] as [Filter, string]),
    ['fresh', `Còn tươi ${STATS.fresh45}`],
    ['pay', `Có lương ${STATS.withSalary}`],
  ];

  const activeTier = TIERS.find((t) => t.id === filter);

  return (
    <div className="space-y-5">
      <div className="max-w-2xl">
        <h2 className="text-lg font-bold text-white">Đủ {STATS.jobs} việc</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Bấm tên công ty để mở tin gốc — link trỏ thẳng về HackerNews, Greenhouse, RemoteOK hoặc
          WeWorkRemotely, không qua aitmpl. Tìm được cả khi bỏ dấu và bằng tiếng Việt: thử{' '}
          <span className="text-slate-300">sài gòn</span>,{' '}
          <span className="text-slate-300">sai gon</span>,{' '}
          <span className="text-slate-300">toàn cầu</span>,{' '}
          <span className="text-slate-300">từ xa</span>.
        </p>
      </div>

      {/* Tìm kiếm + lọc */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="tìm công ty, vị trí, nơi làm…"
            aria-label="Tìm trong danh sách việc"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-9 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500/40"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="Xoá ô tìm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition-colors hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {chips.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={[
                'rounded-xl px-3 py-1.5 text-[13px] transition-colors',
                filter === id
                  ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nhắc nghĩa của nhóm đang lọc */}
      {activeTier && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
          <div className="text-sm font-semibold text-white">
            {activeTier.short} — {activeTier.label}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{activeTier.desc}</p>
        </div>
      )}

      <div className="text-xs tabular-nums text-slate-500">
        {list.length} / {STATS.jobs} tin
      </div>

      {/* Danh sách */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-slate-500">
          Không có tin nào khớp.
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((j) => (
            <a
              key={j.id}
              href={j.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${TIER_STYLE[j.tier]}`}
                >
                  {j.tier}
                </span>

                <div className="min-w-0 flex-1">
                  {/* `overflow-wrap:anywhere` chứ KHÔNG phải `break-words`: vài tên
                      công ty là nguyên một tên miền không có khoảng trắng
                      ("AES (associatedenvironmentalsystems.com)"). `break-words`
                      không hạ được chiều rộng tối thiểu của flex item nên trên màn
                      375px nó vẫn đẩy trang tràn ngang; `anywhere` thì có. */}
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="min-w-0 font-semibold text-white transition-colors [overflow-wrap:anywhere] group-hover:text-emerald-300">
                      {j.company}
                    </span>
                    <span className="min-w-0 text-sm text-slate-400 [overflow-wrap:anywhere]">
                      {j.position}
                    </span>
                    {j.salary && (
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-px text-[11px] tabular-nums text-emerald-300">
                        {j.salary}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-500">
                    <span>{j.location}</span>
                    <span className="text-slate-700">·</span>
                    <span className={j.ageDays > 90 ? 'text-rose-400/80' : ''}>
                      {ageLabel(j.ageDays)}
                    </span>
                    <span className="text-slate-700">·</span>
                    <span>{j.source}</span>
                    {j.remote && (
                      <>
                        <span className="text-slate-700">·</span>
                        <span className="text-sky-400/80">từ xa</span>
                      </>
                    )}
                  </div>

                  {/* `break-words` là bắt buộc: nhiều mô tả gốc nhét nguyên URL
                      (vidalytics.com, associatedenvironmentalsystems.com) — chuỗi
                      không có khoảng trắng thì `line-clamp` không cứu được, và
                      trên màn 375px nó đẩy cả trang tràn ngang. */}
                  {j.excerpt && (
                    <p className="mt-2 line-clamp-2 break-words text-[13px] leading-relaxed text-slate-500">
                      {j.excerpt}…
                    </p>
                  )}

                  {j.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {j.tags.slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="rounded bg-white/[0.06] px-1.5 py-px text-[10px] text-slate-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-slate-300" />
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-600">
        Nhãn công nghệ ở cuối mỗi tin là nhãn GỐC của aitmpl và{' '}
        <span className="text-slate-500">không đáng tin</span> — đối chiếu 20 nhãn với JD thật thì 14
        nhãn không hề xuất hiện. Giữ lại để bạn đối chiếu, đừng dùng để lọc. Tin tuyển dụng thay đổi
        liên tục: luôn bấm vào link gốc trước khi nộp.
      </p>
    </div>
  );
}
