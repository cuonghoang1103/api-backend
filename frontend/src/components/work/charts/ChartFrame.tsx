'use client';

/**
 * ChartFrame — khung DÙNG CHUNG cho mọi biểu đồ CT Work (UX-B, 10/10/2026).
 *
 *   · Tiêu đề + nút (i) "Cách tính" (tooltip, mở được bằng bàn phím).
 *   · Trạng thái đang tải (khung chờ) / trống / lỗi + Thử lại — biểu đồ con không tự làm nữa.
 *   · Chú giải BẤM ĐƯỢC để ẩn/hiện chuỗi (`aria-pressed`); biểu đồ con nhận `hidden` để bỏ chuỗi đó.
 *   · Xuất PNG (SVG → canvas, chữ có dấu tiếng Việt) và CSV (UTF-8 có BOM).
 *   · Trình đọc màn hình: vùng biểu đồ là `role="img"` có `aria-label` tóm tắt, kèm BẢNG DỮ LIỆU ẩn (sr-only).
 *   · `bare`: không vẽ tiêu đề (widget dashboard đã có thanh tiêu đề riêng) nhưng vẫn có chú giải + xuất.
 *
 * Màu chuỗi lấy từ token (chartColors.ts) — không mã màu cứng.
 */

import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Popover, useToggle } from '../ui';
import { wt } from '@/components/work/i18n';
import { downloadCsv, downloadPng, fileSlug, type CsvColumn } from './exportChart';

export interface SeriesItem { key: string; label: string; color: string; dashed?: boolean; /** Không cho tắt (vd đường tham chiếu). */ fixed?: boolean }

export type ChartStatus = 'loading' | 'error' | 'empty' | 'ready';

export interface ChartFrameProps<Row> {
  title: string;
  /** "Cách tính" — một đoạn ngắn, hiện trong tooltip của nút (i). */
  description?: string;
  /** Dòng phụ dưới tiêu đề (vd "Last 30 days · 42 issues"). */
  subtitle?: ReactNode;
  status?: ChartStatus;
  error?: string;
  onRetry?: () => void;
  emptyText?: string;
  /** Chú giải (bấm để ẩn/hiện). Không có ⇒ không vẽ chú giải. */
  series?: SeriesItem[];
  /** Chuỗi tắt sẵn lúc đầu (vd lead time trên biểu đồ cycle time). */
  defaultHidden?: string[];
  /** Dữ liệu cho CSV + bảng ẩn cho trình đọc màn hình. */
  rows?: Row[];
  columns?: CsvColumn<Row>[];
  /** Câu tóm tắt cho `aria-label` của vùng biểu đồ. */
  summary?: string;
  /** Tên tệp xuất (không đuôi); mặc định theo tiêu đề. */
  fileName?: string;
  /** Vẽ PNG cho biểu đồ không phải SVG (ma trận HTML). */
  drawPng?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  drawPngSize?: { width: number; height: number };
  /** Điều khiển thêm ở góc phải (chọn sprint, khoảng ngày…). */
  toolbar?: ReactNode;
  /** Chiều cao vùng biểu đồ (px) — dùng cho khung chờ. */
  height?: number;
  bare?: boolean;
  /** Nội dung có nút bấm (ma trận rủi ro) ⇒ KHÔNG đặt role="img" (con của img bị coi là trang trí). */
  interactive?: boolean;
  className?: string;
  testId?: string;
  children: (hidden: ReadonlySet<string>) => ReactNode;
}

export default function ChartFrame<Row>({
  title, description, subtitle, status = 'ready', error, onRetry, emptyText, series, defaultHidden, rows, columns, summary, fileName,
  drawPng, drawPngSize, toolbar, height = 240, bare, interactive, className, testId, children,
}: ChartFrameProps<Row>) {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set(defaultHidden ?? []));
  const chartRef = useRef<HTMLDivElement>(null);
  const exportBtn = useRef<HTMLButtonElement>(null);
  const menu = useToggle(false);
  const tipId = useId();
  const titleId = useId();
  const [busy, setBusy] = useState(false);

  const toggle = useCallback((key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const visibleSeries = useMemo(() => (series ?? []).filter((s) => !hidden.has(s.key)), [series, hidden]);
  const allHidden = !!series?.length && series.every((s) => s.fixed || hidden.has(s.key)) && !series.some((s) => s.fixed);
  const ready = status === 'ready';
  const canCsv = ready && !!rows?.length && !!columns?.length;
  const canPng = ready;
  const base = fileName ?? fileSlug(title);

  const doPng = async () => {
    menu.close();
    if (!chartRef.current) return;
    setBusy(true);
    try {
      await downloadPng({
        root: chartRef.current, title, subtitle: typeof subtitle === 'string' ? subtitle : undefined,
        legend: visibleSeries.map((s) => ({ label: s.label, color: s.color, dashed: s.dashed })),
        draw: drawPng, drawSize: drawPngSize, fileName: base,
      });
    } catch (e) {
      toast.error(wt('charts.exportFailed'), { description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };
  const doCsv = () => {
    menu.close();
    if (rows && columns) downloadCsv(rows, columns, base);
  };

  const exportMenu = (canPng || canCsv) && (
    <>
      <button
        ref={exportBtn} type="button" onClick={menu.toggle} disabled={busy}
        className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('charts.exportOf', { t: title })} title={wt('charts.export')}
        aria-haspopup="menu" aria-expanded={menu.on} data-testid="chart-export"
      >
        <Download size={13} />
      </button>
      <Popover open={menu.on} onClose={menu.close} anchorRef={exportBtn} width={190} align="end">
        <div className="p-1" role="menu">
          {canPng && <button type="button" role="menuitem" className="flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={doPng} data-testid="chart-export-png">{wt('charts.exportPng')}</button>}
          {canCsv && <button type="button" role="menuitem" className="flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={doCsv} data-testid="chart-export-csv">{wt('charts.exportCsv')}</button>}
        </div>
      </Popover>
    </>
  );

  const info = description && (
    <span className="group relative inline-flex">
      <button type="button" className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] text-[var(--w-text-3)] hover:text-[var(--w-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]" aria-label={wt('charts.howCalc')} aria-describedby={tipId}>
        <Info size={13} />
      </button>
      <span
        id={tipId} role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-6 z-30 w-[300px] max-w-[80vw] rounded-[var(--w-radius)] border border-[var(--w-border-strong)] bg-[var(--w-raised)] px-3 py-2 text-[12px] font-normal leading-relaxed text-[var(--w-text-2)] opacity-0 shadow-[var(--w-shadow-pop)] transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        <span className="mb-0.5 block font-medium text-[var(--w-text)]">{wt('charts.howCalc')}</span>
        {description}
      </span>
    </span>
  );

  return (
    <section
      className={cn(!bare && 'rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)] p-4', 'min-w-0', className)}
      aria-labelledby={bare ? undefined : titleId}
      aria-label={bare ? title : undefined}
      data-testid={testId}
    >
      {(!bare || toolbar || exportMenu || info) && (
        <div className={cn('flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1', bare ? 'mb-2' : 'mb-3')}>
          {!bare && (
            <div className="min-w-0">
              <h2 id={titleId} className="flex items-center gap-1 text-[13px] font-semibold">{title}{info}</h2>
              {subtitle && <div className="mt-0.5 text-[12px] text-[var(--w-text-3)]">{subtitle}</div>}
            </div>
          )}
          {bare && (info || subtitle) && <div className="flex min-w-0 items-center gap-1 text-[12px] text-[var(--w-text-3)]">{info}{subtitle}</div>}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {toolbar}
            {exportMenu}
          </div>
        </div>
      )}

      {ready && !!series?.length && (
        <div className="mb-2 flex flex-wrap items-center gap-x-1 gap-y-1" role="group" aria-label={wt('charts.legend')}>
          {series.map((s) => {
            const off = hidden.has(s.key);
            return (
              <button
                key={s.key} type="button" disabled={s.fixed} aria-pressed={!off}
                onClick={() => toggle(s.key)}
                title={s.fixed ? undefined : off ? wt('charts.showSeries', { s: s.label }) : wt('charts.hideSeries', { s: s.label })}
                className={cn(
                  'inline-flex h-[22px] items-center gap-1.5 rounded-[5px] px-1.5 text-[12px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)] disabled:cursor-default disabled:hover:bg-transparent',
                  off && 'text-[var(--w-text-3)] line-through',
                )}
              >
                {s.dashed
                  ? <span aria-hidden="true" className="inline-block w-4" style={{ borderTop: `2px dashed ${s.color}`, opacity: off ? 0.35 : 1 }} />
                  : <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color, opacity: off ? 0.35 : 1 }} />}
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {status === 'loading' ? (
        <div role="status" aria-live="polite" className="flex flex-col justify-end gap-2" style={{ height }}>
          <span className="sr-only">{wt('charts.loading')}</span>
          <div className="flex flex-1 items-end gap-2" aria-hidden="true">
            {[45, 70, 55, 85, 60, 75, 50, 65].map((h, i) => <span key={i} className="w-skel flex-1 !rounded-[3px]" style={{ height: `${h}%` }} />)}
          </div>
          <span className="w-skel h-2.5 w-full" aria-hidden="true" />
        </div>
      ) : status === 'error' ? (
        <div className="flex flex-col items-center justify-center gap-2 px-2 text-center" style={{ minHeight: Math.min(height, 160) }} role="alert">
          <div className="text-[13px] font-medium">{wt('charts.error')}</div>
          {error && <p className="max-w-[380px] text-[12px] text-[var(--w-text-2)]">{error}</p>}
          {onRetry && <button type="button" className="w-btn w-btn-sm" onClick={onRetry}>{wt('common.tryAgain')}</button>}
        </div>
      ) : status === 'empty' ? (
        <div className="flex items-center justify-center px-2 text-center text-[12.5px] text-[var(--w-text-3)]" style={{ minHeight: Math.min(height, 140) }}>
          {emptyText ?? wt('charts.empty')}
        </div>
      ) : (
        <>
          <div ref={chartRef} role={interactive ? 'group' : 'img'} aria-label={summary ?? title} className="relative w-full min-w-0">
            {allHidden ? (
              <div className="flex items-center justify-center text-center text-[12.5px] text-[var(--w-text-3)]" style={{ height }}>{wt('charts.allHidden')}</div>
            ) : interactive ? children(hidden) : (
              // Hình vẽ là trang trí cho trình đọc màn hình (đã có aria-label tóm tắt + bảng số liệu ẩn) — ẩn để
              // các chấm `role="img"` không tên của Recharts (Scatter) không bị đọc/báo lỗi svg-img-alt.
              <div aria-hidden="true">{children(hidden)}</div>
            )}
          </div>
          {rows && columns && rows.length > 0 && (
            <table className="sr-only">
              <caption>{wt('charts.dataTable', { t: title })}</caption>
              <thead><tr>{columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr></thead>
              <tbody>
                {rows.slice(0, 200).map((r, i) => (
                  <tr key={i}>{columns.map((c) => <td key={c.key}>{String((c.value ? c.value(r) : (r as Record<string, unknown>)[c.key]) ?? '')}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
}
