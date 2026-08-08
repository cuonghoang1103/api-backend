'use client';

// SeriesDayNav — thanh nhảy-theo-ngày cho một loạt bài nhiều kỳ trên feed
// (hiện dùng cho "100 Ngày Java với CuongThai" dưới mục Java).
//
// VẤN ĐỀ: feed cuộn vô hạn theo thứ tự thời gian. Khi loạt bài đã tới Ngày
// 100 mà người học muốn đọc lại Ngày 1 thì phải kéo qua 99 bài — mỗi bài
// dài vài nghìn ký tự kèm ảnh. Không ai làm thế lần thứ hai.
//
// CÁCH LÀM: hỏi server một MỤC LỤC nhẹ (ngày → id bài → tên bài) rồi mở
// thẳng bài được chọn bằng modal chi tiết có sẵn của feed. Không đụng tới
// con trỏ phân trang, nên đóng bài ra là feed vẫn ở đúng chỗ cũ.
//
// Ba lối vào cho ba kiểu người dùng:
//   • gõ số        → "11" + Enter mở thẳng Ngày 11
//   • gõ từ khoá   → "mang" tìm ra "MẢNG & THAM CHIẾU" (bỏ dấu khi so)
//   • bấm số ngày  → lưới ngày, ngày chưa đăng thì mờ đi

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Search, X } from 'lucide-react';
import { socialApi } from '@/lib/api';
import { useSocialStore } from '@/store/socialStore';

interface SeriesItem {
  day: number;
  postId: number;
  title: string;
}

interface Props {
  /** Slug đã khoá cứng ở backend, vd. `100-ngay-java`. */
  slug: string;
  /** Emoji đứng đầu tiêu đề thanh. */
  icon?: string;
}

/** Bỏ dấu tiếng Việt để "mang" tìm được "MẢNG". */
function deaccent(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function SeriesDayNav({ slug, icon = '☕' }: Props) {
  const [data, setData] = useState<{ label: string; total: number; items: SeriesItem[] } | null>(null);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    socialApi
      .getSeriesIndex(slug)
      .then((res: any) => {
        if (cancelled) return;
        const d = res.data?.data;
        if (d && Array.isArray(d.items)) setData({ label: d.label, total: d.total, items: d.items });
      })
      .catch(() => { /* không có mục lục thì thanh này chỉ đơn giản không hiện */ });
    return () => { cancelled = true; };
  }, [slug]);

  const byDay = useMemo(() => {
    const m = new Map<number, SeriesItem>();
    for (const it of data?.items ?? []) m.set(it.day, it);
    return m;
  }, [data]);

  const open = useCallback((postId: number) => {
    // Dùng lại modal chi tiết của feed: nó tự tải bài nếu bài không nằm
    // trong trang hiện tại, nên nhảy tới Ngày 1 từ Ngày 100 vẫn mở được.
    useSocialStore.getState().openCommentModal(postId);
  }, []);

  // Gõ số = số ngày. Gõ chữ = tìm trong tên bài (đã bỏ dấu hai bên).
  const trimmed = query.trim();
  const asDay = /^\d{1,3}$/.test(trimmed) ? parseInt(trimmed, 10) : null;
  const matches = useMemo(() => {
    if (!data) return [];
    if (asDay !== null) {
      const hit = byDay.get(asDay);
      return hit ? [hit] : [];
    }
    if (trimmed.length < 2) return [];
    const q = deaccent(trimmed);
    return data.items.filter((it) => deaccent(it.title).includes(q)).slice(0, 6);
  }, [data, asDay, trimmed, byDay]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Bộ gõ tiếng Việt: Enter khi đang ghép chữ là Enter CHỌN CHỮ, không
    // phải Enter gửi — nuốt nó sẽ làm mất chữ đang gõ.
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matches[0]) {
        open(matches[0].postId);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setQuery('');
    }
  };

  if (!data || data.items.length === 0) return null;

  const published = data.items.length;
  const latest = data.items[data.items.length - 1];
  const percent = Math.min(100, Math.round((published / data.total) * 100));
  // Mặc định chỉ hiện những ngày ĐÃ có bài; mở rộng mới thấy cả lộ trình
  // (một lưới 100 ô luôn hiện sẽ nuốt hết màn hình đầu tiên của feed).
  const days = showAll
    ? Array.from({ length: data.total }, (_, i) => i + 1)
    : data.items.map((it) => it.day);

  return (
    <div
      className="mt-3 rounded-2xl border p-3"
      style={{ borderColor: 'var(--border-light)', background: 'var(--bg-surface)' }}
    >
      {/* ── Nhãn loạt + tiến độ ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span aria-hidden className="text-[15px]">{icon}</span>
        <span className="text-[13.5px] font-bold" style={{ color: 'var(--text-primary)' }}>
          {data.label}
        </span>
        <span className="ml-auto text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
          Đã đăng {published}/{data.total}
        </span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--bg-surface-active)' }}
        role="progressbar"
        aria-valuenow={published}
        aria-valuemin={0}
        aria-valuemax={data.total}
        aria-label={`Đã đăng ${published} trên ${data.total} ngày`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}
        />
      </div>

      {/* ── Ô nhảy nhanh ────────────────────────────────────────── */}
      <div className="relative mt-2.5">
        <div
          className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5"
          style={{ borderColor: 'var(--border-light)', background: 'var(--bg-primary)' }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            inputMode="text"
            placeholder="Nhảy tới ngày… (vd. 7) hoặc tìm tên bài (vd. mảng)"
            aria-label="Nhảy tới một ngày trong loạt bài"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Xoá ô tìm"
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-surface-active)' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Gợi ý — chỉ hiện khi đang gõ, bấm là mở bài. */}
        {trimmed.length > 0 && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-xl border shadow-lg"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            {matches.length === 0 ? (
              <p className="px-3 py-2.5 text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                {asDay !== null
                  ? `Ngày ${asDay} chưa đăng — mới tới Ngày ${latest.day}.`
                  : 'Không có bài nào khớp.'}
              </p>
            ) : (
              matches.map((it) => (
                <button
                  key={it.day}
                  type="button"
                  onClick={() => { open(it.postId); setQuery(''); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                >
                  <span
                    className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold"
                    style={{ background: 'rgba(139,92,246,0.16)', color: '#7c3aed' }}
                  >
                    Ngày {it.day}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px]" style={{ color: 'var(--text-primary)' }}>
                    {it.title}
                  </span>
                  <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} aria-hidden />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Lưới ngày ───────────────────────────────────────────── */}
      <div className="mt-2.5 flex flex-wrap gap-1">
        {days.map((d) => {
          const item = byDay.get(d);
          return (
            <button
              key={d}
              type="button"
              disabled={!item}
              onClick={() => item && open(item.postId)}
              title={item ? `Ngày ${d} — ${item.title}` : `Ngày ${d} — chưa đăng`}
              aria-label={item ? `Mở Ngày ${d}: ${item.title}` : `Ngày ${d} chưa đăng`}
              className={`h-7 min-w-[28px] rounded-lg px-1.5 text-[12px] font-semibold transition-colors ${
                item
                  ? 'text-violet-theme hover:brightness-110'
                  : 'cursor-not-allowed opacity-40'
              }`}
              style={{
                background: item ? 'rgba(139,92,246,0.14)' : 'var(--bg-surface-active)',
                color: item ? undefined : 'var(--text-muted)',
              }}
            >
              {d}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="h-7 rounded-lg px-2 text-[12px] font-medium transition-colors hover:bg-[var(--bg-surface-hover)]"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface-active)' }}
        >
          {showAll ? 'Thu gọn' : `Cả ${data.total} ngày`}
        </button>
      </div>
    </div>
  );
}
