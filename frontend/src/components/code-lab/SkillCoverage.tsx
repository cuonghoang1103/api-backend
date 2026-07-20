'use client';

// "What am I still bad at" for one track.
//
// The exercise list already shows how far through you are. It does not show
// which skills are still untouched, which is the question that decides whether
// you pass — so the weakest skill is listed FIRST, not the alphabetically first.

import { useEffect, useState } from 'react';
import { Target, ChevronDown, Loader2 } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { SkillCoverageResponse } from '@/types/code-lab';

const LABEL_VI: Record<string, string> = {
  sorting: 'Sắp xếp', searching: 'Tìm kiếm', arrays: 'Mảng', collections: 'Collections',
  oop: 'Hướng đối tượng', validation: 'Kiểm tra dữ liệu', 'console-app': 'Ứng dụng console',
  'file-io': 'Đọc/ghi tệp', strings: 'Xử lý chuỗi', exceptions: 'Ngoại lệ', dates: 'Ngày tháng',
  recursion: 'Đệ quy', 'data-structures': 'Cấu trúc dữ liệu', graphs: 'Đồ thị',
  security: 'Bảo mật', math: 'Toán', 'number-systems': 'Hệ cơ số',
};

function bar(pct: number) {
  if (pct >= 80) return '#22c55e';
  if (pct >= 40) return '#f59e0b';
  if (pct > 0) return '#f97316';
  return '#6b7280';
}

export function SkillCoverage({ trackSlug, lang = 'vi' }: { trackSlug: string; lang?: 'en' | 'vi' }) {
  const [data, setData] = useState<SkillCoverageResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || data || loading) return;
    setLoading(true);
    codeLabApi.getSkillCoverage(trackSlug)
      .then((r) => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [open, data, loading, trackSlug]);

  const t = lang === 'vi'
    ? { title: 'Kỹ năng của bạn', sub: 'yếu nhất xếp trước', of: 'trên', done: 'bài đã xong', none: 'Chưa có dữ liệu.' }
    : { title: 'Your skills', sub: 'weakest first', of: 'of', done: 'exercises solved', none: 'Nothing to show yet.' };

  return (
    <div className="mb-5 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-2 px-4 py-3 text-left">
        <Target size={16} style={{ color: 'var(--accent-color, #8b5cf6)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— {t.sub}</span>
        {data && (
          <span className="ml-auto mr-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {data.solvedExercises}/{data.totalExercises} {t.done}
          </span>
        )}
        <ChevronDown size={16} className={`transition-transform ${open ? '' : '-rotate-90'} ${data ? '' : 'ml-auto'}`}
          style={{ color: 'var(--text-muted)' }} />
      </button>

      {open && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Loader2 size={15} className="animate-spin" /> …
            </div>
          ) : !data?.skills.length ? (
            <p className="py-2 text-sm" style={{ color: 'var(--text-muted)' }}>{t.none}</p>
          ) : (
            <div className="space-y-2">
              {data.skills.map((s) => {
                const pct = Math.round((s.solved / s.total) * 100);
                return (
                  <div key={s.skill}>
                    <div className="mb-0.5 flex items-baseline justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate font-medium" style={{ color: 'var(--text-primary)' }}>
                        {(lang === 'vi' && LABEL_VI[s.skill]) || s.skill}
                      </span>
                      <span className="shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {s.solved} {t.of} {s.total}
                        {s.inProgress > 0 && <span style={{ color: '#f59e0b' }}> · {s.inProgress} ⏳</span>}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: bar(pct) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
