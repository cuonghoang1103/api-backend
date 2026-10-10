'use client';

/**
 * DataTable — bảng số liệu DÙNG CHUNG của CT Work (UX-C, 11/10/2026).
 *
 * Rút từ hai bảng đã ổn (Issues list, Contributions) thành một thành phần:
 *   · tiêu đề dính khi cuộn; ghim cột đầu (dính trái khi cuộn ngang);
 *   · sắp xếp (`aria-sort`; tự sắp trên máy, hoặc `onSortChange` để máy chủ sắp — Issues/JQL);
 *   · chọn/ẩn cột, đổi độ rộng (kéo mép hoặc ←/→ trên tay nắm), mật độ gọn/thường — NHỚ THEO NGƯỜI (localStorage
 *     khoá theo user id, bọc try/catch);
 *   · lọc nhanh (bỏ dấu tiếng Việt); phân trang hoặc cuộn ảo cho bảng lớn (≥ 2.000 dòng vẫn mượt — chỉ vẽ ~40 dòng);
 *   · chọn nhiều dòng (Shift = cả dải, Ctrl/⌘+A = tất cả) + thanh thao tác hàng loạt;
 *   · xuất CSV (UTF-8 BOM) / Excel .xlsx (tự ghi, không thư viện) — xuất dòng đang chọn, không thì mọi dòng đang lọc;
 *   · ARIA grid đúng chuẩn: role grid/rowgroup/row/columnheader/gridcell, aria-rowcount/rowindex (đúng cả khi cuộn ảo),
 *     aria-colindex, aria-selected, aria-multiselectable; bàn phím kiểu "roving tabindex": ←↑→↓, Home/End,
 *     Ctrl+Home/End, PageUp/PageDown, Enter mở dòng, Space chọn dòng, Esc bỏ chọn; Enter trên tiêu đề = sắp xếp.
 *
 * Màu theo token `theme-dark`; không dùng `dark:`. Mọi hook gọi trước mọi return sớm.
 */

import {
  useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Columns3, Download, Rows3, Rows4, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Popover, useToggle } from '../ui';
import { wt, wfmt } from '@/components/work/i18n';
import { downloadCsv, fileSlug } from '../charts/exportChart';
import {
  cellText, clampWidth, DEFAULT_PREFS, filterRows, normalizePrefs, pageCount, rangeKeys, sortRows, toggleColumn,
  virtualWindow, visibleColumnIds, type CellValue, type SortState, type TablePrefs,
} from './tableLogic';
import { buildXlsx, type XlsxCell } from './xlsx';

export type RowKey = string | number;

export interface DataColumn<T> {
  id: string;
  header: string;
  /** Nội dung ô. Không có ⇒ in `value`. */
  cell?: (row: T, index: number) => ReactNode;
  /** Giá trị để sắp xếp, lọc nhanh và xuất. */
  value?: (row: T) => CellValue;
  /** Chữ cho lọc nhanh (mặc định = value). */
  text?: (row: T) => string;
  /** Giá trị khi xuất (mặc định = value). `export: false` ⇒ bỏ cột khỏi tệp. */
  exportValue?: (row: T) => XlsxCell;
  export?: boolean;
  sortable?: boolean;
  /** px; mặc định 140. */
  width?: number;
  minWidth?: number;
  /** Chiếm phần còn lại (minmax(width, 1fr)) — thường là cột tiêu đề. */
  grow?: boolean;
  align?: 'left' | 'right' | 'center';
  /** Không cho ẩn. */
  required?: boolean;
  defaultHidden?: boolean;
  /** Ẩn trên màn hẹp (dưới breakpoint). */
  hideBelow?: 'sm' | 'md' | 'lg';
  /** Độ rộng trên màn hẹp (< 640px) — vd cột người chỉ còn avatar. */
  narrowWidth?: number;
  /** Tooltip của tiêu đề (vd cách tính). */
  headerTitle?: string;
  className?: string;
}

export interface DataTableProps<T> {
  /** Khoá lưu lựa chọn (cột/độ rộng/mật độ) — duy nhất mỗi bảng, vd 'raid' hoặc `desk:${pid}`. */
  id: string;
  label: string;
  rows: readonly T[];
  columns: DataColumn<T>[];
  rowKey: (row: T) => RowKey;
  loading?: boolean;
  /** Nội dung khi không có dòng nào (trước lọc). */
  empty?: ReactNode;
  /** Sắp xếp do bên ngoài điều khiển (máy chủ sắp) — có thì bảng KHÔNG tự sắp. */
  sort?: SortState | null;
  onSortChange?: (s: SortState | null) => void;
  defaultSort?: SortState | null;
  quickFilter?: boolean;
  filterPlaceholder?: string;
  selectable?: boolean;
  selected?: ReadonlySet<RowKey>;
  onSelectedChange?: (keys: Set<RowKey>) => void;
  /** Thanh thao tác hàng loạt (hiện khi có dòng được chọn). */
  bulkActions?: (rows: T[], clear: () => void) => ReactNode;
  onRowOpen?: (row: T, index: number) => void;
  rowActive?: (row: T) => boolean;
  rowClassName?: (row: T) => string | undefined;
  rowTitle?: (row: T) => string | undefined;
  paging?: 'auto' | 'virtual' | 'pages' | 'none';
  pageSize?: number;
  /** 'fill' = chiếm phần còn lại của khung flex (cuộn trong bảng); số = trần chiều cao px; 'auto' = cao theo nội dung. */
  height?: 'fill' | 'auto' | number;
  pinFirst?: boolean;
  exportName?: string;
  exportable?: boolean;
  columnsMenu?: boolean;
  densityToggle?: boolean;
  toolbar?: boolean;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
  /** Đưa cụm điều khiển (đếm/mật độ/cột/xuất) vào một chỗ khác của trang (vd thanh lọc của Issues). */
  controlsTarget?: HTMLElement | null;
  footer?: ReactNode;
  onEndReached?: () => void;
  /** Cột hiện do bên ngoài giữ (Issues giữ theo dự án) — có thì menu cột gọi `onChange`. */
  columnVisibility?: { visible: string[]; onChange: (visible: string[]) => void };
  /** Mô tả ẩn cho trình đọc màn hình (vd "Press Enter to open"). */
  description?: string;
  /** Cho phép đặt mật độ từ bên ngoài lúc đầu (vd bảng nhỏ trong dialog). */
  defaultDensity?: 'compact' | 'normal';
  /** Nhóm luôn đứng trước khi sắp (số nhỏ trước) — vd agent AI luôn ở cuối bảng Đóng góp. */
  sortGroup?: (row: T) => number;
  /** Số cột đầu được ghim (mặc định 1) — Issues ghim cả loại + mã. */
  pinColumns?: number;
  /** Ẩn số dòng ở cụm điều khiển (trang đã tự hiện tổng, vd Issues/JQL). */
  showCount?: boolean;
  /** Cuộn tới dòng này (vd phím j/k của trang Issues khi bảng đang cuộn ảo). */
  scrollToIndex?: number | null;
  className?: string;
  testId?: string;
}

const ROW_H = { compact: 32, normal: 40 } as const;
const HEAD_H = 36;
const CHECK_W = 36;
const BP = { sm: 640, md: 768, lg: 1024 } as const;

// ─── Lựa chọn theo người ─────────────────────────────────────────

function useTablePrefs(id: string, columnIds: string[], defaults: Partial<TablePrefs>) {
  const uid = useAuthStore((s) => s.user?.id);
  const key = `ctwork:dt:${id}:u${uid ?? 'anon'}`;
  const idsSig = columnIds.join('|');
  const [prefs, setPrefs] = useState<TablePrefs>({ ...DEFAULT_PREFS, ...defaults });
  const loaded = useRef<string>('');
  useEffect(() => {
    if (loaded.current === key) return;
    loaded.current = key;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setPrefs(normalizePrefs(JSON.parse(raw), idsSig.split('|')));
    } catch { /* riêng tư / hỏng — dùng mặc định */ }
  }, [key, idsSig]);
  const update = useCallback((fn: (p: TablePrefs) => TablePrefs) => {
    setPrefs((p) => {
      const next = fn(p);
      try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* bỏ qua */ }
      return next;
    });
  }, [key]);
  return [prefs, update] as const;
}

function useWidth(ref: React.RefObject<HTMLElement>): number {
  const [w, setW] = useState(1200);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

// ─── Bảng ────────────────────────────────────────────────────────

export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    id, label, rows, columns, rowKey, loading, empty, quickFilter = true, filterPlaceholder, selectable = false, bulkActions,
    onRowOpen, rowActive, rowClassName, rowTitle, paging = 'auto', pageSize: pageSizeProp = 50, height = 'fill', pinFirst = true,
    exportName, exportable = true, columnsMenu = true, densityToggle = true, toolbar = true, toolbarLeft, toolbarRight,
    controlsTarget, footer, onEndReached, columnVisibility, description, defaultDensity, sortGroup, pinColumns = 1, showCount = true,
    scrollToIndex, className, testId,
  } = props;
  const controlledSort = props.onSortChange !== undefined;
  const gridId = useId();
  const descId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const boxW = useWidth(boxRef);

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const [prefs, setPrefs] = useTablePrefs(id, columnIds, { sort: props.defaultSort ?? null, ...(defaultDensity ? { density: defaultDensity } : {}) });
  const density = prefs.density;
  const rowH = ROW_H[density];

  // ── Cột hiện ──
  const visibleIds = useMemo(() => {
    const base = columnVisibility ? columnVisibility.visible.filter((x) => columnIds.includes(x)) : visibleColumnIds(columns, prefs);
    return base.filter((cid) => {
      const c = columns.find((x) => x.id === cid)!;
      return !c.hideBelow || boxW >= BP[c.hideBelow];
    });
  }, [columnVisibility, columnIds, columns, prefs, boxW]);
  const cols = useMemo(() => visibleIds.map((cid) => columns.find((c) => c.id === cid)!).filter(Boolean), [visibleIds, columns]);

  // ── Độ rộng (đang kéo thì giữ tạm, thả mới lưu) ──
  const [dragW, setDragW] = useState<{ id: string; w: number } | null>(null);
  const narrow = boxW < BP.sm;
  const widthOf = useCallback((c: DataColumn<T>) => (dragW?.id === c.id ? dragW.w : narrow && c.narrowWidth ? c.narrowWidth : prefs.widths[c.id] ?? c.width ?? 140), [dragW, prefs.widths, narrow]);
  const template = useMemo(() => {
    const tracks = cols.map((c) => (c.grow && prefs.widths[c.id] === undefined && dragW?.id !== c.id ? `minmax(${widthOf(c)}px, 1fr)` : `${widthOf(c)}px`));
    return [...(selectable ? [`${CHECK_W}px`] : []), ...tracks].join(' ');
  }, [cols, selectable, widthOf, prefs.widths, dragW]);
  const minWidth = (selectable ? CHECK_W : 0) + cols.reduce((s, c) => s + widthOf(c), 0);

  // ── Lọc + sắp ──
  const [query, setQuery] = useState('');
  const sort = controlledSort ? props.sort ?? null : prefs.sort;
  const valueOf = useCallback((r: T, col: string) => columns.find((c) => c.id === col)?.value?.(r), [columns]);
  const filtered = useMemo(() => {
    if (!quickFilter || !query.trim()) return rows as T[];
    return filterRows(rows, query, (r) => cols.map((c) => (c.text ? c.text(r) : cellText(c.value?.(r)))));
  }, [rows, query, quickFilter, cols]);
  const sorted = useMemo(() => {
    const out = controlledSort ? filtered : sortRows(filtered, sort, valueOf);
    if (!sortGroup) return out;
    // Sắp ổn định theo nhóm, giữ thứ tự trong nhóm.
    return out.map((r, i) => ({ r, i, g: sortGroup(r) })).sort((a, b) => a.g - b.g || a.i - b.i).map((x) => x.r);
  }, [controlledSort, filtered, sort, valueOf, sortGroup]);
  const onSort = useCallback((c: DataColumn<T>) => {
    if (c.sortable === false || (!c.value && c.sortable !== true)) return;
    const next: SortState | null = sort?.col !== c.id ? { col: c.id, dir: 'asc' } : sort.dir === 'asc' ? { col: c.id, dir: 'desc' } : null;
    if (controlledSort) props.onSortChange!(next);
    else setPrefs((p) => ({ ...p, sort: next }));
  }, [sort, controlledSort, props.onSortChange, setPrefs]);

  // ── Phân trang / cuộn ảo ──
  const mode = paging === 'auto'
    ? (height === 'auto' ? (sorted.length > pageSizeProp ? 'pages' : 'none') : sorted.length > 100 ? 'virtual' : 'none')
    : paging;
  const pageSize = prefs.pageSize ?? pageSizeProp;
  const [page, setPage] = useState(0);
  const pages = pageCount(sorted.length, pageSize);
  useEffect(() => { if (page > pages - 1) setPage(Math.max(0, pages - 1)); }, [page, pages]);
  useEffect(() => { setPage(0); }, [query, sort?.col, sort?.dir]);
  const pageRows = useMemo(() => (mode === 'pages' ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted), [mode, sorted, page, pageSize]);
  const rowOffset = mode === 'pages' ? page * pageSize : 0;

  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(600);
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setViewport(el.clientHeight));
    ro.observe(el);
    setViewport(el.clientHeight);
    return () => ro.disconnect();
  }, []);
  const win = useMemo(() => (mode === 'virtual'
    ? virtualWindow({ scrollTop: Math.max(0, scrollTop - HEAD_H), viewport, rowHeight: rowH, count: pageRows.length, overscan: 10 })
    : { start: 0, end: pageRows.length, padTop: 0, padBottom: 0 }), [mode, scrollTop, viewport, rowH, pageRows.length]);
  const endFired = useRef(-1);
  useEffect(() => {
    if (!onEndReached || !pageRows.length) return;
    if (win.end >= pageRows.length - 20 && endFired.current !== pageRows.length) {
      endFired.current = pageRows.length;
      onEndReached();
    }
  }, [win.end, pageRows.length, onEndReached]);

  // ── Chọn dòng ──
  const [innerSel, setInnerSel] = useState<Set<RowKey>>(new Set());
  const selected = props.selected ?? innerSel;
  const setSelected = useCallback((s: Set<RowKey>) => {
    if (props.onSelectedChange) props.onSelectedChange(s);
    if (!props.selected) setInnerSel(s);
  }, [props]);
  const anchor = useRef<RowKey | null>(null);
  const order = useMemo(() => sorted.map(rowKey), [sorted, rowKey]);
  const toggleRow = useCallback((k: RowKey, shift: boolean) => {
    const next = new Set(selected);
    if (shift && anchor.current !== null) {
      rangeKeys(order, anchor.current, k).forEach((x) => next.add(x));
    } else if (next.has(k)) next.delete(k);
    else next.add(k);
    anchor.current = k;
    setSelected(next);
  }, [selected, order, setSelected]);
  const allOn = sorted.length > 0 && sorted.every((r) => selected.has(rowKey(r)));
  const someOn = !allOn && sorted.some((r) => selected.has(rowKey(r)));
  const selectedRows = useMemo(() => sorted.filter((r) => selected.has(rowKey(r))), [sorted, selected, rowKey]);
  const clearSel = useCallback(() => setSelected(new Set()), [setSelected]);

  // ── Ô đang focus (roving tabindex): r = -1 là hàng tiêu đề ──
  const ncol = cols.length + (selectable ? 1 : 0);
  const [active, setActive] = useState<{ r: number; c: number }>({ r: -1, c: 0 });
  const wantFocus = useRef(false);
  const total = pageRows.length;
  useEffect(() => {
    setActive((a) => ({ r: Math.min(a.r, total - 1), c: Math.min(a.c, Math.max(0, ncol - 1)) }));
  }, [total, ncol]);
  const moveTo = useCallback((r: number, c: number) => {
    const rr = Math.max(-1, Math.min(total - 1, r));
    const cc = Math.max(0, Math.min(ncol - 1, c));
    wantFocus.current = true;
    setActive({ r: rr, c: cc });
    // Cuộn tới hàng (cuộn ảo: hàng có thể chưa được vẽ).
    const el = scroller.current;
    if (el && rr >= 0 && mode !== 'none') {
      const top = HEAD_H + rr * rowH;
      if (top < el.scrollTop + HEAD_H) el.scrollTop = top - HEAD_H;
      else if (top + rowH > el.scrollTop + el.clientHeight) el.scrollTop = top + rowH - el.clientHeight;
      setScrollTop(el.scrollTop);
    }
  }, [total, ncol, mode, rowH]);
  useEffect(() => {
    if (!wantFocus.current) return;
    const cell = boxRef.current?.querySelector<HTMLElement>(`[data-cell="${active.r}:${active.c}"]`);
    if (cell) {
      wantFocus.current = false;
      cell.focus({ preventScroll: mode !== 'none' });
    }
  });

  useEffect(() => {
    if (scrollToIndex == null || scrollToIndex < 0) return;
    const el = scroller.current;
    if (!el) return;
    const top = HEAD_H + scrollToIndex * rowH;
    if (el.scrollHeight <= el.clientHeight + 1) {
      // Bảng không tự cuộn (height="auto") ⇒ nhờ trình duyệt cuộn khung ngoài.
      boxRef.current?.querySelector(`[data-row-index="${scrollToIndex}"]`)?.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (top < el.scrollTop + HEAD_H) el.scrollTop = top - HEAD_H;
    else if (top + rowH > el.scrollTop + el.clientHeight) el.scrollTop = top + rowH - el.clientHeight;
    setScrollTop(el.scrollTop);
  }, [scrollToIndex, rowH]);

  const onGridKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    // Đang gõ trong ô nhập bên trong ô bảng ⇒ để yên.
    if (t.closest('input, textarea, select, [contenteditable="true"]') && !t.hasAttribute('data-cell')) return;
    if (!t.hasAttribute('data-cell') && !t.closest('[data-cell]')) return;
    const { r, c } = active;
    const pageStep = Math.max(1, Math.floor(viewport / rowH) - 1);
    const mod = e.ctrlKey || e.metaKey;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); moveTo(r + 1, c); break;
      case 'ArrowUp': e.preventDefault(); moveTo(r - 1, c); break;
      case 'ArrowRight': e.preventDefault(); moveTo(r, c + 1); break;
      case 'ArrowLeft': e.preventDefault(); moveTo(r, c - 1); break;
      case 'Home': e.preventDefault(); moveTo(mod ? 0 : r, 0); break;
      case 'End': e.preventDefault(); moveTo(mod ? total - 1 : r, ncol - 1); break;
      case 'PageDown': e.preventDefault(); moveTo(r + pageStep, c); break;
      case 'PageUp': e.preventDefault(); moveTo(Math.max(0, r - pageStep), c); break;
      case 'Enter': {
        if (r === -1) {
          const col = cols[c - (selectable ? 1 : 0)];
          if (col) { e.preventDefault(); onSort(col); }
        } else if (onRowOpen && pageRows[r] && !t.closest('button, a') ) {
          e.preventDefault();
          onRowOpen(pageRows[r], r + rowOffset);
        }
        break;
      }
      case ' ': {
        if (selectable && r >= 0 && pageRows[r] && !t.closest('button, a')) { e.preventDefault(); toggleRow(rowKey(pageRows[r]), e.shiftKey); }
        break;
      }
      case 'a': case 'A': {
        if (mod && selectable) { e.preventDefault(); setSelected(new Set(order)); }
        break;
      }
      case 'Escape': if (selected.size) { e.preventDefault(); clearSel(); } break;
      default:
    }
  };

  // ── Kéo mép cột ──
  const resizing = useRef<{ id: string; x0: number; w0: number; min: number } | null>(null);
  const startResize = (e: ReactPointerEvent, c: DataColumn<T>) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const cell = (e.currentTarget as HTMLElement).closest('[role="columnheader"]') as HTMLElement | null;
    resizing.current = { id: c.id, x0: e.clientX, w0: cell?.offsetWidth ?? widthOf(c), min: c.minWidth ?? 60 };
  };
  const moveResize = (e: ReactPointerEvent) => {
    const r = resizing.current;
    if (!r) return;
    setDragW({ id: r.id, w: clampWidth(r.w0 + e.clientX - r.x0, r.min) });
  };
  const endResize = () => {
    const r = resizing.current;
    resizing.current = null;
    if (r && dragW) setPrefs((p) => ({ ...p, widths: { ...p.widths, [r.id]: dragW.w } }));
    setDragW(null);
  };
  const keyResize = (e: ReactKeyboardEvent, c: DataColumn<T>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    e.stopPropagation();
    const w = clampWidth(widthOf(c) + (e.key === 'ArrowRight' ? 16 : -16), c.minWidth ?? 60);
    setPrefs((p) => ({ ...p, widths: { ...p.widths, [c.id]: w } }));
  };

  // ── Xuất ──
  const exportCols = cols.filter((c) => c.export !== false && (c.exportValue || c.value));
  const exportRows = selectedRows.length ? selectedRows : sorted;
  const base = exportName ?? fileSlug(label);
  const doCsv = () => {
    downloadCsv(exportRows, exportCols.map((c) => ({ key: c.id, label: c.header, value: (r: T) => (c.exportValue ? c.exportValue(r) : cellText(c.value!(r))) })), base);
  };
  const doXlsx = () => {
    try {
      const bytes = buildXlsx({
        sheet: label, header: exportCols.map((c) => c.header),
        rows: exportRows.map((r) => exportCols.map((c) => {
          if (c.exportValue) return c.exportValue(r);
          const v = c.value!(r);
          return typeof v === 'number' || typeof v === 'boolean' ? v : cellText(v);
        })),
      });
      const blob = new Blob([bytes as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${base}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      toast.error(wt('table.exportFailed'), { description: (err as Error).message });
    }
  };

  // ── Điều khiển ──
  const colBtn = useRef<HTMLButtonElement>(null);
  const colMenu = useToggle();
  const expBtn = useRef<HTMLButtonElement>(null);
  const expMenu = useToggle();
  const countText = query && quickFilter
    ? wt('table.countOf', { n: wfmt.number(sorted.length), total: wfmt.number(rows.length) })
    : wt('table.count', { count: rows.length });
  const visibleSet = new Set(columnVisibility ? columnVisibility.visible : visibleColumnIds(columns, prefs));
  const toggleCol = (c: DataColumn<T>) => {
    if (columnVisibility) {
      const cur = columnVisibility.visible;
      const next = cur.includes(c.id) ? cur.filter((x) => x !== c.id) : [...cur, c.id];
      columnVisibility.onChange(columnIds.filter((x) => next.includes(x)));
    } else setPrefs((p) => toggleColumn(p, c));
  };
  const controls = (
    <div className="flex shrink-0 items-center gap-1" data-testid={testId ? `${testId}-controls` : undefined}>
      {showCount && <span className="mr-1 whitespace-nowrap text-[12px] tabular-nums text-[var(--w-text-3)]" aria-live="polite">{loading ? '' : countText}</span>}
      {densityToggle && (
        <button
          type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-pressed={density === 'compact'}
          title={density === 'compact' ? wt('table.densityNormal') : wt('table.densityCompact')}
          aria-label={wt('table.compact')}
          onClick={() => setPrefs((p) => ({ ...p, density: p.density === 'compact' ? 'normal' : 'compact' }))}
        >
          {density === 'compact' ? <Rows4 size={14} /> : <Rows3 size={14} />}
        </button>
      )}
      {columnsMenu && (
        <>
          <button ref={colBtn} type="button" className="w-btn w-btn-ghost w-btn-sm" aria-haspopup="menu" aria-expanded={colMenu.on} onClick={colMenu.toggle} title={wt('table.columnsTitle')}>
            <Columns3 size={13} /> <span className="max-sm:!hidden">{wt('table.columns')}</span>
          </button>
          <Popover open={colMenu.on} onClose={colMenu.close} anchorRef={colBtn} width={230} align="end">
            <div className="max-h-[360px] overflow-y-auto p-1" role="menu" aria-label={wt('table.columns')}>
              {columns.map((c) => {
                const on = c.required || visibleSet.has(c.id);
                return (
                  <button
                    key={c.id} type="button" role="menuitemcheckbox" aria-checked={on} disabled={c.required}
                    onClick={() => toggleCol(c)}
                    className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:opacity-60"
                  >
                    <span aria-hidden="true" className={cn('flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border text-[10px]', on ? 'border-[var(--w-accent)] bg-[var(--w-accent)] text-white' : 'border-[var(--w-border-strong)]')}>{on ? '✓' : ''}</span>
                    <span className="truncate">{c.header}</span>
                  </button>
                );
              })}
              <div className="my-1 border-t border-[var(--w-border)]" />
              <button
                type="button" role="menuitem"
                className="flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]"
                onClick={() => { setPrefs((p) => ({ ...DEFAULT_PREFS, density: p.density })); if (columnVisibility) columnVisibility.onChange(columns.filter((c) => !c.defaultHidden).map((c) => c.id)); colMenu.close(); }}
              >
                {wt('table.resetLayout')}
              </button>
            </div>
          </Popover>
        </>
      )}
      {exportable && exportCols.length > 0 && (
        <>
          <button ref={expBtn} type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-haspopup="menu" aria-expanded={expMenu.on} onClick={expMenu.toggle} title={wt('table.export')} aria-label={wt('table.export')} disabled={!rows.length}>
            <Download size={13} />
          </button>
          <Popover open={expMenu.on} onClose={expMenu.close} anchorRef={expBtn} width={230} align="end">
            <div className="p-1" role="menu">
              <div className="px-2 py-1 text-[11.5px] text-[var(--w-text-3)]">
                {selectedRows.length ? wt('table.exportSelected', { count: selectedRows.length }) : wt('table.exportAll', { count: sorted.length })}
              </div>
              <button type="button" role="menuitem" className="flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={() => { expMenu.close(); doCsv(); }} data-testid="dt-export-csv">{wt('table.exportCsv')}</button>
              <button type="button" role="menuitem" className="flex w-full items-center rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={() => { expMenu.close(); doXlsx(); }} data-testid="dt-export-xlsx">{wt('table.exportXlsx')}</button>
            </div>
          </Popover>
        </>
      )}
    </div>
  );

  const showToolbar = toolbar && (quickFilter || toolbarLeft || toolbarRight || !controlsTarget);
  const pinned = pinFirst && boxW >= BP.sm;
  // Cột ghim: N cột đầu, mỗi cột dính trái tại tổng độ rộng các cột ghim đứng trước (+ cột chọn).
  const pinLeft = useMemo(() => {
    const m = new Map<string, number>();
    let x = selectable ? CHECK_W : 0;
    for (const c of cols.slice(0, Math.max(0, pinColumns))) { m.set(c.id, x); x += widthOf(c); }
    return m;
  }, [cols, pinColumns, selectable, widthOf]);
  const lastPinned = cols[Math.min(cols.length, Math.max(0, pinColumns)) - 1]?.id;
  const isPinned = (c: DataColumn<T>) => pinned && pinLeft.has(c.id) && !(c.grow && prefs.widths[c.id] === undefined);
  const rendered = pageRows.slice(win.start, win.end);

  const cellStyle = (c: DataColumn<T>): CSSProperties | undefined => (isPinned(c) ? { position: 'sticky', left: pinLeft.get(c.id), zIndex: 1 } : undefined);
  const stickyBg = 'linear-gradient(var(--dt-row-bg, transparent), var(--dt-row-bg, transparent)), var(--w-panel)';

  return (
    <div
      ref={boxRef}
      className={cn('flex min-w-0 flex-col', height === 'fill' && 'min-h-0 flex-1', className)}
      data-testid={testId}
    >
      {showToolbar && (
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--w-border)] px-3 py-1.5 md:px-4">
          {quickFilter && (
            <div className="relative w-full sm:w-[220px]">
              <Search size={13} aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape' && query) { e.stopPropagation(); setQuery(''); } }}
                placeholder={filterPlaceholder ?? wt('table.filter')}
                aria-label={wt('table.filterAria', { t: label })}
                aria-controls={gridId}
                className="w-input !h-[28px] !pl-7 !pr-7 !text-[12.5px]"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--w-text-3)] hover:text-[var(--w-text)]" aria-label={wt('table.clearFilter')}>
                  <X size={12} />
                </button>
              )}
            </div>
          )}
          {toolbarLeft}
          <div className="ml-auto flex items-center gap-1.5">
            {toolbarRight}
            {!controlsTarget && controls}
          </div>
        </div>
      )}
      {controlsTarget && createPortal(controls, controlsTarget)}

      {selectable && selected.size > 0 && bulkActions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] px-3 py-1.5 text-[12.5px] md:px-4" role="region" aria-label={wt('table.bulkRegion')}>
          <span className="font-medium text-[var(--w-accent-text)]">{wt('table.selected', { count: selected.size })}</span>
          {bulkActions(selectedRows, clearSel)}
          <button type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={clearSel}><X size={12} /> {wt('table.clearSelection')}</button>
        </div>
      )}

      <div
        ref={scroller}
        className={cn('relative min-w-0 overflow-auto', height === 'fill' && 'min-h-0 flex-1', height === 'auto' && 'overflow-y-visible')}
        style={typeof height === 'number' ? { maxHeight: height } : undefined}
        onScroll={mode === 'virtual' ? (e) => setScrollTop((e.target as HTMLDivElement).scrollTop) : undefined}
      >
        {description && <p id={descId} className="sr-only">{description}</p>}
        <div
          id={gridId}
          role="grid"
          aria-label={label}
          aria-describedby={description ? descId : undefined}
          aria-rowcount={sorted.length + 1}
          aria-colcount={ncol}
          aria-multiselectable={selectable || undefined}
          aria-busy={loading || undefined}
          onKeyDown={onGridKey}
          style={{ ['--dt-cols' as string]: template, minWidth } as CSSProperties}
          className="text-[13px]"
        >
          {/* Tiêu đề */}
          <div role="rowgroup" className="sticky top-0 z-[2]">
            <div
              role="row" aria-rowindex={1}
              className="grid h-9 items-stretch border-b border-[var(--w-border)] bg-[var(--w-panel)] text-[12px] font-medium text-[var(--w-text-3)] shadow-[0_1px_0_var(--w-border)]"
              style={{ gridTemplateColumns: 'var(--dt-cols)' }}
            >
              {selectable && (
                <div
                  role="columnheader" aria-colindex={1} data-cell="-1:0" tabIndex={active.r === -1 && active.c === 0 ? 0 : -1}
                  onFocus={() => setActive({ r: -1, c: 0 })}
                  className="flex items-center justify-center bg-[var(--w-panel)] outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--w-accent-border)]"
                  style={pinned ? { position: 'sticky', left: 0, zIndex: 2 } : undefined}
                >
                  <input
                    type="checkbox" tabIndex={-1}
                    aria-label={allOn ? wt('table.clearSelection') : wt('table.selectAll')}
                    checked={allOn}
                    ref={(el) => { if (el) el.indeterminate = someOn; }}
                    onChange={() => setSelected(allOn ? new Set() : new Set(order))}
                    className="h-3.5 w-3.5 accent-[var(--w-accent)]"
                  />
                </div>
              )}
              {cols.map((c, i) => {
                const ci = i + (selectable ? 1 : 0);
                const can = c.sortable !== false && (!!c.value || c.sortable === true);
                const on = sort?.col === c.id;
                return (
                  <div
                    key={c.id}
                    role="columnheader"
                    aria-colindex={ci + 1}
                    aria-sort={can ? (on ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                    data-cell={`-1:${ci}`}
                    tabIndex={active.r === -1 && active.c === ci ? 0 : -1}
                    onFocus={() => setActive({ r: -1, c: ci })}
                    onClick={() => can && onSort(c)}
                    title={c.headerTitle ?? (can ? wt('table.sortBy', { c: c.header }) : undefined)}
                    className={cn(
                      'group/h relative flex min-w-0 select-none items-center gap-1 bg-[var(--w-panel)] px-2.5 outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--w-accent-border)]',
                      can && 'cursor-pointer hover:text-[var(--w-text)]',
                      on && 'text-[var(--w-text)]',
                      c.align === 'right' && 'justify-end text-right',
                      c.align === 'center' && 'justify-center',
                      isPinned(c) && c.id === lastPinned && 'border-r border-[var(--w-border)]',
                    )}
                    style={isPinned(c) ? { position: 'sticky', left: pinLeft.get(c.id), zIndex: 2 } : undefined}
                  >
                    <span className="truncate">{c.header}</span>
                    {on && (sort!.dir === 'asc' ? <ArrowUp size={11} aria-hidden="true" /> : <ArrowDown size={11} aria-hidden="true" />)}
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={wt('table.resize', { c: c.header })}
                      aria-valuenow={widthOf(c)}
                      aria-valuemin={c.minWidth ?? 60}
                      aria-valuemax={1200}
                      tabIndex={0}
                      onKeyDown={(e) => keyResize(e, c)}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => startResize(e, c)}
                      onPointerMove={moveResize}
                      onPointerUp={endResize}
                      onPointerCancel={endResize}
                      className="absolute -right-[3px] top-1 bottom-1 z-[3] w-[7px] cursor-col-resize touch-none rounded-[3px] outline-none hover:bg-[var(--w-accent-border)] focus-visible:bg-[var(--w-accent-border)] group-hover/h:bg-[var(--w-border-strong)]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Thân */}
          {loading ? (
            <div role="rowgroup">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} role="row" aria-rowindex={i + 2} className="grid items-center border-b border-[var(--w-border)]" style={{ gridTemplateColumns: 'var(--dt-cols)', height: rowH }}>
                  {Array.from({ length: ncol }).map((__, j) => (
                    <div key={j} role="gridcell" aria-colindex={j + 1} className="px-2.5"><span className="w-skel block h-3" style={{ width: `${40 + ((i * 7 + j * 13) % 50)}%` }} /></div>
                  ))}
                </div>
              ))}
            </div>
          ) : !rows.length ? (
            <div role="rowgroup">
              <div role="row" aria-rowindex={2}>
                <div role="gridcell" aria-colindex={1} aria-colspan={ncol} className="sticky left-0" style={{ width: boxW ? Math.max(0, boxW - 2) : undefined }}>
                  {empty ?? <div className="px-4 py-10 text-center text-[13px] text-[var(--w-text-3)]">{wt('table.empty')}</div>}
                </div>
              </div>
            </div>
          ) : !sorted.length ? (
            <div role="rowgroup">
              <div role="row" aria-rowindex={2}>
                <div role="gridcell" aria-colindex={1} aria-colspan={ncol} className="sticky left-0 px-4 py-10 text-center text-[13px] text-[var(--w-text-3)]" style={{ width: boxW ? Math.max(0, boxW - 2) : undefined }}>
                  {wt('table.noMatch')}{' '}
                  <button type="button" className="text-[var(--w-accent-text)] hover:underline" onClick={() => setQuery('')}>{wt('table.clearFilter')}</button>
                </div>
              </div>
            </div>
          ) : (
            <div role="rowgroup" style={{ paddingTop: win.padTop, paddingBottom: win.padBottom }}>
              {rendered.map((row, k) => {
                const r = win.start + k;
                const key = rowKey(row);
                const isSel = selected.has(key);
                const isActive = rowActive?.(row) ?? false;
                return (
                  <div
                    key={key}
                    role="row"
                    aria-rowindex={rowOffset + r + 2}
                    aria-selected={selectable ? isSel : undefined}
                    data-row-key={String(key)}
                    data-row-index={rowOffset + r}
                    title={rowTitle?.(row)}
                    onClick={(e) => {
                      const tgt = e.target as HTMLElement;
                      if (tgt.closest('button, a, input, select, textarea, [role="button"], label')) return;
                      if (selectable && (e.metaKey || e.ctrlKey || e.shiftKey)) { toggleRow(key, e.shiftKey); return; }
                      onRowOpen?.(row, rowOffset + r);
                    }}
                    className={cn(
                      'group/r grid items-stretch border-b border-[var(--w-border)]',
                      onRowOpen && 'cursor-pointer',
                      isSel ? '[--dt-row-bg:var(--w-accent-soft)] shadow-[inset_2px_0_0_var(--w-accent)]'
                        : isActive ? '[--dt-row-bg:var(--w-active)] shadow-[inset_2px_0_0_var(--w-accent-border)]'
                          : 'hover:[--dt-row-bg:var(--w-hover)]',
                      rowClassName?.(row),
                    )}
                    style={{ gridTemplateColumns: 'var(--dt-cols)', height: rowH, background: 'var(--dt-row-bg, transparent)' }}
                  >
                    {selectable && (
                      <div
                        role="gridcell" aria-colindex={1} data-cell={`${r}:0`} tabIndex={active.r === r && active.c === 0 ? 0 : -1}
                        onFocus={() => setActive({ r, c: 0 })}
                        className="flex items-center justify-center outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--w-accent-border)]"
                        style={pinned ? { position: 'sticky', left: 0, zIndex: 1, background: stickyBg } : undefined}
                      >
                        <input
                          type="checkbox" tabIndex={-1} checked={isSel}
                          aria-label={wt('table.selectRow', { n: rowOffset + r + 1 })}
                          onClick={(e) => { e.stopPropagation(); toggleRow(key, e.shiftKey); }}
                          onChange={() => {}}
                          className={cn('h-3.5 w-3.5 accent-[var(--w-accent)]', !isSel && 'md:opacity-40 md:group-hover/r:opacity-100 md:focus:opacity-100')}
                        />
                      </div>
                    )}
                    {cols.map((c, i) => {
                      const ci = i + (selectable ? 1 : 0);
                      const st = cellStyle(c);
                      return (
                        <div
                          key={c.id}
                          role="gridcell"
                          aria-colindex={ci + 1}
                          data-cell={`${r}:${ci}`}
                          tabIndex={active.r === r && active.c === ci ? 0 : -1}
                          onFocus={() => setActive({ r, c: ci })}
                          className={cn(
                            'flex min-w-0 items-center overflow-hidden px-2.5 outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--w-accent-border)]',
                            c.align === 'right' && 'justify-end text-right tabular-nums',
                            c.align === 'center' && 'justify-center',
                            isPinned(c) && c.id === lastPinned && 'border-r border-[var(--w-border)]',
                            c.className,
                          )}
                          style={st ? { ...st, background: stickyBg } : undefined}
                        >
                          {c.cell ? c.cell(row, rowOffset + r) : <span className="truncate">{cellText(c.value?.(row))}</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {footer}
      </div>

      {mode === 'pages' && sorted.length > pageSize && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-[var(--w-border)] px-3 py-1.5 text-[12px] text-[var(--w-text-2)] md:px-4" role="navigation" aria-label={wt('table.pagination')}>
          <span className="tabular-nums">{wt('table.range', { a: wfmt.number(page * pageSize + 1), b: wfmt.number(Math.min(sorted.length, (page + 1) * pageSize)), n: wfmt.number(sorted.length) })}</span>
          <label className="ml-2 flex items-center gap-1">
            <span>{wt('table.perPage')}</span>
            <select className="w-input !h-[26px] !w-auto !py-0 !text-[12px]" value={pageSize} onChange={(e) => { const n = Number(e.target.value); setPrefs((p) => ({ ...p, pageSize: n })); setPage(0); }}>
              {[25, 50, 100, 200].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <div className="ml-auto flex items-center gap-1">
            <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" disabled={page === 0} onClick={() => setPage((p) => p - 1)} aria-label={wt('table.prevPage')}><ChevronLeft size={14} /></button>
            <span className="tabular-nums">{wt('table.pageOf', { p: page + 1, n: pages })}</span>
            <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} aria-label={wt('table.nextPage')}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Ô chữ chuẩn (cắt bớt + tooltip đầy đủ). */
export function TextCell({ children, title, muted, mono }: { children: ReactNode; title?: string; muted?: boolean; mono?: boolean }) {
  return <span className={cn('truncate', muted && 'text-[var(--w-text-2)]', mono && 'font-mono text-[11.5px] text-[var(--w-text-3)]')} title={title ?? (typeof children === 'string' ? children : undefined)}>{children}</span>;
}
