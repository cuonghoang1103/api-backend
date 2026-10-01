'use client';

import { SearchX, WifiOff, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

/** Skeleton đúng khuôn CourseCard mới (ảnh 16:9) — chuyển sang thẻ thật không nhảy bố cục. */
export function LuoiKhung({ soThe = 6 }: { soThe?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-busy="true"
      aria-label="Đang tải khoá học"
    >
      {Array.from({ length: soThe }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--border-color)_60%,transparent)] bg-[var(--bg-card)]">
          <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] aspect-video w-full" style={{ animationDelay: `${i * 60}ms` }} />
          <div className="space-y-3 p-5">
            <div className="flex gap-2">
              <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-5 w-20 rounded-full" />
              <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-5 w-16 rounded-full" />
            </div>
            <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-5 w-4/5 rounded" />
            <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-3.5 w-full rounded" />
            <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-3.5 w-2/3 rounded" />
            <div className="flex gap-4 pt-2">
              <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-3 w-14 rounded" />
              <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-3 w-14 rounded" />
              <div className="shimmer-track !bg-black/[0.05] [.theme-dark_&]:!bg-white/[0.025] h-3 w-14 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Khung({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex max-w-lg flex-col items-center overflow-hidden rounded-3xl border border-dashed border-[var(--border-color)] bg-[color-mix(in_srgb,var(--bg-card)_60%,transparent)] px-6 py-14 text-center">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-neon-violet/15 blur-3xl" />
      {children}
    </div>
  );
}

export function KhongCoKetQua({
  coBoLoc, onXoaBoLoc,
}: { coBoLoc: boolean; onXoaBoLoc: () => void }) {
  return (
    <Khung>
      <span className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-violet-700 [.theme-dark_&]:text-neon-violet">
        <SearchX className="h-7 w-7" />
      </span>
      <h3 className="relative text-lg font-semibold text-text-primary">Không tìm thấy khoá học nào</h3>
      <p className="relative mt-2 text-sm text-text-muted">
        {coBoLoc
          ? 'Thử từ khoá khác, hoặc bỏ bớt bộ lọc danh mục / cấp độ.'
          : 'Mục này chưa có khoá học nào được xuất bản.'}
      </p>
      {coBoLoc && (
        <button
          onClick={onXoaBoLoc}
          className="relative mt-6 inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-text-primary hover:bg-neon-violet/20"
        >
          <RotateCcw className="h-4 w-4" /> Xoá bộ lọc
        </button>
      )}
    </Khung>
  );
}

export function LoiTai({ onThuLai }: { onThuLai: () => void }) {
  return (
    <Khung>
      <span className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-700 [.theme-dark_&]:text-rose-300">
        <WifiOff className="h-7 w-7" />
      </span>
      <h3 className="relative text-lg font-semibold text-text-primary">Không tải được danh sách khoá học</h3>
      <p className="relative mt-2 text-sm text-text-muted">Mạng chập chờn hoặc máy chủ đang bận. Thử lại sau giây lát.</p>
      <button
        onClick={onThuLai}
        className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        <RotateCcw className="h-4 w-4" /> Thử lại
      </button>
    </Khung>
  );
}

/** Dãy số trang gọn: 1 … 4 5 6 … 20 (page tính từ 0). */
function daySo(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const set = new Set([0, total - 1, page - 1, page, page + 1].filter((p) => p >= 0 && p < total));
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export function PhanTrang({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const nut =
    'inline-flex h-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-30';
  return (
    <nav aria-label="Phân trang" className="mt-12 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className={`${nut} gap-1 border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-text-secondary hover:border-neon-violet/40 hover:text-text-primary`}
        >
          <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Trước</span>
        </button>
        {daySo(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`g${i}`} className="w-6 text-center text-text-muted">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`${nut} w-10 ${
                p === page
                  ? 'border-transparent bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.7)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] text-text-muted hover:border-neon-violet/40 hover:text-text-primary'
              }`}
            >
              {p + 1}
            </button>
          ),
        )}
        <button
          onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className={`${nut} gap-1 border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-text-secondary hover:border-neon-violet/40 hover:text-text-primary`}
        >
          <span className="hidden sm:inline">Sau</span> <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-text-muted">
        Trang {page + 1} / {totalPages}
      </p>
    </nav>
  );
}
