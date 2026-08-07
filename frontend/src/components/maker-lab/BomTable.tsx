'use client';

/**
 * Maker Lab — bill of materials.
 *
 * Built as a shopping tool, not a spec sheet. The three things that
 * actually matter while sourcing parts:
 *   • what does this cost in total, and how much have I spent so far
 *   • which ones have I already bought (ticking survives reload)
 *   • WHY this part and not the cheaper one two rows down — the
 *     `whyThisPart` copy is the whole value of the page
 */

import { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronDown, ExternalLink, Info, ShoppingCart, X } from 'lucide-react';
import { toast } from 'sonner';
import { PartIcon } from './PartIcon';
import { PartDatasheet } from './PartDatasheet';
import { setComponentAcquired } from '@/lib/maker-lab-api';
import type { MakerComponent, MakerComponentCategory } from '@/types/maker-lab';

const CATEGORY_LABEL: Record<MakerComponentCategory, string> = {
  MCU: 'Não',
  AUDIO_IN: 'Nghe',
  AUDIO_OUT: 'Nói',
  DISPLAY: 'Hiển thị',
  MOTION: 'Chuyển động',
  DRIVER: 'Mạch lái',
  SENSOR: 'Cảm biến',
  POWER: 'Nguồn',
  MECHANICAL: 'Cơ khí',
  CONNECTIVITY: 'Kết nối',
  TOOL: 'Dụng cụ',
  MISC: 'Khác',
};

const CATEGORY_COLOR: Record<MakerComponentCategory, string> = {
  MCU: '#22d3ee',
  AUDIO_IN: '#a78bfa',
  AUDIO_OUT: '#f472b6',
  DISPLAY: '#38bdf8',
  MOTION: '#fb923c',
  DRIVER: '#fbbf24',
  SENSOR: '#34d399',
  POWER: '#ef4444',
  MECHANICAL: '#94a3b8',
  CONNECTIVITY: '#818cf8',
  TOOL: '#64748b',
  MISC: '#a3a3a3',
};

function vnd(n: number | null | undefined): string {
  if (!n) return '—';
  return `${n.toLocaleString('vi-VN')} đ`;
}

export function BomTable({
  components,
  canEdit,
}: {
  components: MakerComponent[];
  canEdit: boolean;
}) {
  const [rows, setRows] = useState(components);
  const [open, setOpen] = useState<number | null>(null);
  const [hideTools, setHideTools] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);
  /** Linh kiện đang mở tài liệu chi tiết. */
  const [sheet, setSheet] = useState<MakerComponent | null>(null);

  const visible = useMemo(
    () => (hideTools ? rows.filter((r) => r.category !== 'TOOL') : rows),
    [rows, hideTools],
  );

  const stats = useMemo(() => {
    const build = rows.filter((r) => r.category !== 'TOOL' && r.required);
    const total = build.reduce((s, r) => s + (r.unitPriceVnd ?? 0) * r.qty, 0);
    const spent = rows
      .filter((r) => r.acquired)
      .reduce((s, r) => s + (r.unitPriceVnd ?? 0) * r.qty, 0);
    const tools = rows
      .filter((r) => r.category === 'TOOL')
      .reduce((s, r) => s + (r.unitPriceVnd ?? 0) * r.qty, 0);
    const optional = rows
      .filter((r) => !r.required && r.category !== 'TOOL')
      .reduce((s, r) => s + (r.unitPriceVnd ?? 0) * r.qty, 0);
    return {
      total,
      spent,
      tools,
      optional,
      done: rows.filter((r) => r.acquired).length,
      count: rows.length,
      pieces: rows.reduce((s, r) => s + r.qty, 0),
    };
  }, [rows]);

  async function toggle(row: MakerComponent) {
    if (!canEdit) {
      toast.info('Đăng nhập để đánh dấu linh kiện đã mua');
      return;
    }
    const next = !row.acquired;
    setSaving(row.id);
    // Optimistic: ticking a checkbox should never feel like a network call.
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, acquired: next } : r)));
    try {
      await setComponentAcquired(row.id, next);
    } catch {
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, acquired: !next } : r)));
      toast.error('Không lưu được, thử lại nhé');
    } finally {
      setSaving(null);
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<MakerComponentCategory, MakerComponent[]>();
    for (const r of visible) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    return [...map.entries()];
  }, [visible]);

  return (
    <div className="space-y-5">
      {/*
        Datasheet mở dạng lớp phủ chứ không phải mở rộng tại chỗ: nội
        dung dài (bảng chân + mô phỏng + code) sẽ đẩy toàn bộ danh sách
        xuống và làm mất chỗ đang đọc.
      */}
      {sheet && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSheet(null)}
        >
          <div
            className="my-auto w-full max-w-3xl rounded-2xl border p-5 shadow-2xl"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => setSheet(null)}
                className="rounded-lg p-1.5"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                aria-label="Đóng"
              >
                <X size={16} />
              </button>
            </div>
            <PartDatasheet component={sheet} />
          </div>
        </div>
      )}

      {/* ── Cost summary ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Chi phí bắt buộc" value={vnd(stats.total)} accent="#22d3ee" />
        <StatCard label="Tuỳ chọn thêm" value={vnd(stats.optional)} accent="#a78bfa" />
        <StatCard label="Dụng cụ (mua 1 lần)" value={vnd(stats.tools)} accent="#64748b" />
        <StatCard
          label={`Đã mua ${stats.done}/${stats.count} dòng`}
          value={vnd(stats.spent)}
          accent="#34d399"
          progress={stats.count ? stats.done / stats.count : 0}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {stats.count} dòng · {stats.pieces} món vật lý · giá tham khảo thị trường VN 08/2026, đổi
          theo thời điểm
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={hideTools}
            onChange={(e) => setHideTools(e.target.checked)}
            className="h-3.5 w-3.5 accent-cyan-500"
          />
          Ẩn dụng cụ (tôi có rồi)
        </label>
      </div>

      {/* ── Grouped parts ── */}
      {grouped.map(([cat, items]) => (
        <section key={cat}>
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: CATEGORY_COLOR[cat] }}
            />
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {CATEGORY_LABEL[cat]}
            </h4>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {items.length}
            </span>
          </div>

          <div className="space-y-2">
            {items.map((row) => {
              const isOpen = open === row.id;
              const line = (row.unitPriceVnd ?? 0) * row.qty;
              return (
                <div
                  key={row.id}
                  className="rounded-xl border transition-colors"
                  style={{
                    borderColor: row.acquired ? '#34d39955' : 'var(--border-color)',
                    background: row.acquired ? 'rgba(52,211,153,0.06)' : 'var(--bg-card)',
                  }}
                >
                  <div className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => toggle(row)}
                      disabled={saving === row.id}
                      title={row.acquired ? 'Đã mua — bấm để bỏ đánh dấu' : 'Đánh dấu đã mua'}
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors"
                      style={{
                        borderColor: row.acquired ? '#34d399' : 'var(--border-color)',
                        background: row.acquired ? '#34d399' : 'transparent',
                      }}
                    >
                      {row.acquired && <Check size={13} strokeWidth={3} color="#052e1a" />}
                    </button>

                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: 'var(--bg-surface)' }}
                    >
                      <PartIcon
                        svgKey={row.svgKey}
                        category={row.category}
                        imageUrl={row.imageUrl}
                        alt={row.name}
                        size={48}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span
                          className="font-semibold leading-tight"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {row.name}
                        </span>
                        {row.qty > 1 && (
                          <span
                            className="rounded px-1.5 py-0.5 text-[11px] font-bold"
                            style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                          >
                            ×{row.qty}
                          </span>
                        )}
                        {!row.required && (
                          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            tuỳ chọn
                          </span>
                        )}
                      </div>
                      {row.partNumber && (
                        <p className="mt-0.5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {row.partNumber}
                        </p>
                      )}

                      {row.specs && (
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                          {Object.entries(row.specs).slice(0, 4).map(([k, v]) => (
                            <span key={k} className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{k}:</span> {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {vnd(line)}
                      </p>
                      {row.qty > 1 && (
                        <p className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {vnd(row.unitPriceVnd)}/cái
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-col items-end gap-1">
                        {row.docs ? (
                          <button
                            onClick={() => setSheet(row)}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
                            style={{ background: 'rgba(34,211,238,0.14)', color: '#0891b2' }}
                          >
                            <BookOpen size={11} />
                            Tài liệu
                          </button>
                        ) : null}
                        {(row.whyThisPart || row.alternatives?.length) && (
                          <button
                            onClick={() => setOpen(isOpen ? null : row.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium"
                            style={{ color: 'var(--accent-color)' }}
                          >
                            <Info size={11} />
                            Vì sao chọn
                            <ChevronDown
                              size={11}
                              className="transition-transform"
                              style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      className="border-t px-3 pb-3 pt-3"
                      style={{ borderColor: 'var(--border-light)' }}
                    >
                      {row.whyThisPart && (
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {row.whyThisPart}
                        </p>
                      )}

                      {row.alternatives?.length ? (
                        <div className="mt-3">
                          <p
                            className="mb-1.5 text-xs font-semibold uppercase tracking-wide"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Thay thế được
                          </p>
                          <ul className="space-y-1.5">
                            {row.alternatives.map((alt, i) => (
                              <li key={i} className="flex flex-wrap items-baseline gap-2 text-xs">
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {alt.name}
                                </span>
                                {alt.priceVnd ? (
                                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                                    {vnd(alt.priceVnd)}
                                  </span>
                                ) : null}
                                <span style={{ color: 'var(--text-secondary)' }}>— {alt.note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {row.vendorUrl && (
                        <a
                          href={row.vendorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium"
                          style={{ color: 'var(--accent-color)' }}
                        >
                          <ShoppingCart size={12} />
                          {row.vendorName ?? 'Nơi bán'}
                          <ExternalLink size={11} />
                        </a>
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
  );
}

function StatCard({
  label,
  value,
  accent,
  progress,
}: {
  label: string;
  value: string;
  accent: string;
  progress?: number;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="mt-0.5 font-mono text-lg font-bold" style={{ color: accent }}>
        {value}
      </p>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.round(progress * 100)}%`, background: accent }}
          />
        </div>
      )}
    </div>
  );
}
