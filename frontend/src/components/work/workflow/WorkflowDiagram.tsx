'use client';

/**
 * Sơ đồ quy trình kiểu Jira — SVG thuần + pointer events (không thư viện đồ thị).
 *  - nút = trạng thái (màu theo nhóm), mũi tên = luồng chuyển (cong, né nút),
 *  - kéo từ tay nắm của nút sang nút khác để tạo chuyển; thả ra nền là huỷ,
 *  - "từ bất kỳ" hiện thành nhãn ANY trên nút đích, bật lên mới vẽ mũi tên,
 *  - kéo nền / cuộn để di chuyển, ⌘/Ctrl + cuộn để phóng to,
 *  - sửa mũi tên gom trong bản nháp (một lượt Lưu); kéo nút thì tự lưu bố cục.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertTriangle, Download, Info, Maximize2, Minimize2, Minus, Plus, Scan, Unlock, Wand2, Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type ProjectConfig, type WorkStatus, type WorkWorkflow, type WorkflowLayout } from '@/lib/work-api';
import { CATEGORY_DOT, Popover, Spinner, isTyping, useToggle } from '../ui';
import { ConfirmDialog } from '../settings/shared';
import { wk } from '../hooks';
import {
  ANY_H, ANY_W, NODE_H, NODE_W, START_R, autoLayout, boundsOf, fitText, linearFlow, mergeLayout, pairKey, parsePair,
  routeEdge, straightFrom, validate, type EdgeGeom, type Pos, type Rect,
} from './graph';
import { AddStatusForm, CATEGORY_LABEL } from './statusParts';
import { EdgeInspector, NodeInspector } from './Inspector';
import { downloadPng, downloadSvg } from './exportDiagram';
import type { TransitionDraft } from './useTransitionDraft';

type Sel = { kind: 'node'; id: number } | { kind: 'edge'; key: string } | null;
interface View { x: number; y: number; k: number }
type Drag =
  | { type: 'pan'; sx: number; sy: number; vx: number; vy: number; moved: boolean }
  | { type: 'node'; id: number; dx: number; dy: number; sx: number; sy: number; moved: boolean }
  | { type: 'connect'; from: number | null };

const MIN_K = 0.3;
const MAX_K = 2.2;
const clampK = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k));
const NAME_FONT = '600 13px Inter, ui-sans-serif, system-ui, sans-serif';

interface Props {
  wf: WorkWorkflow;
  config: ProjectConfig;
  draft: TransitionDraft;
  /** Quyền ADMIN và màn đủ rộng; false = chỉ xem (vẫn di chuyển/phóng to được). */
  canEdit: boolean;
  invalidate: () => void;
  onDeleteStatus: (s: WorkStatus) => void;
}

export default function WorkflowDiagram({ wf, config, draft, canEdit, invalidate, onDeleteStatus }: Props) {
  const pid = config.id;
  const qc = useQueryClient();
  const uid = useId().replace(/:/g, '');
  const statuses = useMemo(() => [...wf.statuses].sort((a, b) => a.position - b.position), [wf.statuses]);
  const byId = useMemo(() => new Map(statuses.map((s) => [s.id, s])), [statuses]);
  const statusSig = statuses.map((s) => s.id).join(',');
  const savedLayout = (config.settings?.workflowLayout as Record<string, WorkflowLayout> | undefined)?.[String(wf.id)];

  const [positions, setPositions] = useState<Record<number, Pos>>(() => mergeLayout(statuses, savedLayout));
  // Thêm/xoá trạng thái: giữ toạ độ đang có, đặt nút mới vào cột của nó.
  useEffect(() => {
    setPositions((cur) => mergeLayout(statuses, savedLayout, cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusSig]);

  const [view, setView] = useState<View>({ x: 40, y: 40, k: 1 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [sel, setSel] = useState<Sel>(null);
  const [hover, setHover] = useState<{ kind: 'node'; id: number } | { kind: 'edge'; key: string } | null>(null);
  const [showAny, setShowAny] = useState(false);
  const [connect, setConnect] = useState<{ from: number | null; to: Pos; over: number | null } | null>(null);
  const [confirm, setConfirm] = useState<{ pending: { from: number | null; to: number } | null } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [exporting, setExporting] = useState(false);
  const addPop = useToggle();
  const exportPop = useToggle();
  const addRef = useRef<HTMLButtonElement>(null);
  const exportRef = useRef<HTMLButtonElement>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  // ─── Hình chữ nhật của các nút ────────────────────────────────
  const rects = useMemo(() => {
    const out: Record<number, Rect> = {};
    for (const s of statuses) {
      const p = positions[s.id];
      if (p) out[s.id] = { x: p.x, y: p.y, w: NODE_W, h: NODE_H };
    }
    return out;
  }, [statuses, positions]);
  const nodeBounds = useMemo(() => boundsOf(Object.values(rects)), [rects]);
  const initial = statuses[0];
  const startPos = useMemo<Pos | null>(
    () => (initial && rects[initial.id] ? { x: rects[initial.id].x - 50, y: rects[initial.id].y + NODE_H / 2 } : null),
    [initial, rects],
  );
  const anyRect = useMemo<Rect>(
    () => ({ x: nodeBounds.x + nodeBounds.w / 2 - ANY_W / 2, y: nodeBounds.y - ANY_H - 84, w: ANY_W, h: ANY_H }),
    [nodeBounds],
  );

  const restricted = draft.mode === 'restricted';
  const edgeKeys = useMemo(() => (restricted ? [...draft.pairs] : []), [restricted, draft.pairs]);
  const anyTargets = useMemo(() => new Set(edgeKeys.map(parsePair).filter((e) => e.from === null).map((e) => e.to)), [edgeKeys]);

  // ─── Đường mũi tên ────────────────────────────────────────────
  const edges = useMemo(() => {
    const out: Array<{ key: string; from: number | null; to: number; g: EdgeGeom }> = [];
    const all = Object.entries(rects).map(([id, r]) => ({ id: Number(id), r }));
    for (const key of edgeKeys) {
      const { from, to } = parsePair(key);
      const b = rects[to];
      if (!b) continue;
      if (from === null) {
        if (!showAny) continue;
        out.push({ key, from, to, g: routeEdge(anyRect, b, all.filter((o) => o.id !== to).map((o) => o.r), 0) });
        continue;
      }
      const a = rects[from];
      if (!a) continue;
      const bidir = draft.pairs.has(pairKey(to, from));
      const obstacles = all.filter((o) => o.id !== from && o.id !== to).map((o) => o.r);
      out.push({ key, from, to, g: routeEdge(a, b, obstacles, bidir ? 20 : 0) });
    }
    return out;
  }, [edgeKeys, rects, showAny, draft.pairs, anyRect]);

  const warnings = useMemo(() => validate(statuses, draft.pairs, draft.mode), [statuses, draft.pairs, draft.mode]);
  const warnCount = Object.keys(warnings).length;

  // ─── Khung nhìn ───────────────────────────────────────────────
  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const contentBounds = useCallback((): Rect => {
    const parts: Rect[] = [nodeBounds];
    if (startPos) parts.push({ x: startPos.x - START_R, y: startPos.y - START_R, w: START_R * 2, h: START_R * 2 });
    if (showAny && restricted) parts.push(anyRect);
    return boundsOf(parts);
  }, [nodeBounds, startPos, showAny, restricted, anyRect]);

  const fit = useCallback(() => {
    const b = contentBounds();
    if (!b.w || !size.w) return;
    const pad = 48;
    const k = clampK(Math.min((size.w - pad * 2) / b.w, (size.h - pad * 2) / b.h, 1.15));
    setView({ k, x: (size.w - b.w * k) / 2 - b.x * k, y: (size.h - b.h * k) / 2 - b.y * k });
  }, [contentBounds, size.w, size.h]);

  // Cần vừa khung: lần đầu có kích thước, sau khi đổi toàn màn hình (đợi kích
  // thước mới) và sau Auto-arrange (đợi toạ độ mới).
  const needsFit = useRef(true);
  useEffect(() => {
    if (size.w > 0 && needsFit.current) { needsFit.current = false; fit(); }
  }, [size.w, size.h, fit]);
  const toggleFullscreen = (on?: boolean) => { needsFit.current = true; setFullscreen((v) => on ?? !v); };

  const zoomAt = useCallback((px: number, py: number, factor: number) => {
    setView((v) => {
      const k = clampK(v.k * factor);
      return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) };
    });
  }, []);
  const zoomCenter = (f: number) => zoomAt(size.w / 2, size.h / 2, f);

  // Bánh xe: phải gắn tay (passive: false) mới chặn được trang cuộn theo.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022)));
      else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const toWorld = (clientX: number, clientY: number): Pos => {
    const r = svgRef.current!.getBoundingClientRect();
    const v = viewRef.current;
    return { x: (clientX - r.left - v.x) / v.k, y: (clientY - r.top - v.y) / v.k };
  };
  const nodeAt = (p: Pos, exclude: number | null): number | null => {
    for (const s of [...statuses].reverse()) {
      const r = rects[s.id];
      if (!r || s.id === exclude) continue;
      if (p.x >= r.x - 6 && p.x <= r.x + r.w + 6 && p.y >= r.y - 6 && p.y <= r.y + r.h + 6) return s.id;
    }
    return null;
  };

  // ─── Lưu bố cục (tự động, gom 700ms) ──────────────────────────
  const layoutMut = useMutation({
    mutationFn: (p: WorkflowLayout | null) => workApi.setWorkflowLayout(pid, wf.id, p),
    onSuccess: (res) => {
      // Vá thẳng cache cấu hình — khỏi tải lại cả dự án chỉ vì kéo một nút.
      qc.setQueryData<ProjectConfig>(wk.project(pid), (old) => {
        if (!old) return old;
        const layout = { ...((old.settings?.workflowLayout as Record<string, WorkflowLayout>) ?? {}) };
        if (res.positions) layout[String(wf.id)] = res.positions; else delete layout[String(wf.id)];
        return { ...old, settings: { ...old.settings, workflowLayout: layout } };
      });
    },
    onError: (err) => toast.error(workError(err, 'Could not save the diagram layout')),
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const posRef = useRef(positions);
  posRef.current = positions;
  const scheduleLayoutSave = useCallback(() => {
    if (!canEdit) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const out: WorkflowLayout = {};
      for (const [id, p] of Object.entries(posRef.current)) out[id] = { x: Math.round(p.x), y: Math.round(p.y) };
      layoutMut.mutate(out);
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit, pid, wf.id]);
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const autoArrange = () => {
    clearTimeout(saveTimer.current);
    // Đổi toạ độ ⇒ `fit` đổi ⇒ effect vừa khung chạy lại.
    needsFit.current = true;
    setPositions(autoLayout(statuses));
    if (canEdit && savedLayout) layoutMut.mutate(null);
  };

  // ─── Thêm chuyển ──────────────────────────────────────────────
  const addTransition = (from: number | null, to: number) => {
    if (from === to) return;
    if (draft.mode === 'free') { setConfirm({ pending: { from, to } }); return; }
    const k = pairKey(from, to);
    if (draft.pairs.has(k)) toast.message('That transition already exists');
    else draft.add(from, to);
    if (from === null) setShowAny(true);
    setSel({ kind: 'edge', key: k });
  };
  const applyRestrict = () => {
    const pending = confirm?.pending ?? null;
    const next = new Set(linearFlow(statuses));
    if (pending) next.add(pairKey(pending.from, pending.to));
    draft.setMode('restricted');
    draft.setPairs(next);
    if (pending) setSel({ kind: 'edge', key: pairKey(pending.from, pending.to) });
    setConfirm(null);
  };

  // ─── Pointer ──────────────────────────────────────────────────
  const capture = (e: React.PointerEvent) => { try { svgRef.current?.setPointerCapture(e.pointerId); } catch { /* không sao */ } };

  const onBgDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    capture(e);
    drag.current = { type: 'pan', sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false };
  };
  const onNodeDown = (e: React.PointerEvent, id: number) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    capture(e);
    setSel({ kind: 'node', id });
    if (!canEdit) { drag.current = { type: 'pan', sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: true }; return; }
    const w = toWorld(e.clientX, e.clientY);
    const p = positions[id];
    drag.current = { type: 'node', id, dx: w.x - p.x, dy: w.y - p.y, sx: e.clientX, sy: e.clientY, moved: false };
  };
  const onHandleDown = (e: React.PointerEvent, from: number | null) => {
    if (e.button !== 0 || !canEdit) return;
    e.stopPropagation();
    capture(e);
    drag.current = { type: 'connect', from };
    setConnect({ from, to: toWorld(e.clientX, e.clientY), over: null });
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (d.type === 'pan') {
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 3) return;
      d.moved = true;
      setView((v) => ({ ...v, x: d.vx + e.clientX - d.sx, y: d.vy + e.clientY - d.sy }));
    } else if (d.type === 'node') {
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 3) return;
      d.moved = true;
      const w = toWorld(e.clientX, e.clientY);
      setPositions((cur) => ({ ...cur, [d.id]: { x: w.x - d.dx, y: w.y - d.dy } }));
    } else {
      const w = toWorld(e.clientX, e.clientY);
      setConnect({ from: d.from, to: w, over: nodeAt(w, d.from) });
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.type === 'pan' && !d.moved) { setSel(null); setShowWarnings(false); }
    if (d.type === 'node' && d.moved) {
      // Bắt lưới 8px cho thẳng hàng.
      setPositions((cur) => ({ ...cur, [d.id]: { x: Math.round(cur[d.id].x / 8) * 8, y: Math.round(cur[d.id].y / 8) * 8 } }));
      scheduleLayoutSave();
    }
    if (d.type === 'connect') {
      const target = nodeAt(toWorld(e.clientX, e.clientY), d.from);
      setConnect(null);
      if (target !== null) addTransition(d.from, target);
    }
  };

  // ─── Bàn phím ─────────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (isTyping(e.target)) return;
    if (e.key === 'Escape') { if (sel) { setSel(null); e.stopPropagation(); } else if (fullscreen) toggleFullscreen(false); return; }
    if ((e.key === 'Delete' || e.key === 'Backspace') && sel?.kind === 'edge' && canEdit) { e.preventDefault(); draft.remove(sel.key); setSel(null); return; }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomCenter(1.2); return; }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomCenter(1 / 1.2); return; }
    if (e.key === '0') { e.preventDefault(); fit(); return; }
    if (sel?.kind === 'node' && canEdit && e.key.startsWith('Arrow')) {
      e.preventDefault();
      const step = e.shiftKey ? 40 : 8;
      const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
      const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
      setPositions((cur) => ({ ...cur, [sel.id]: { x: cur[sel.id].x + dx, y: cur[sel.id].y + dy } }));
      scheduleLayoutSave();
    }
  };

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !e.defaultPrevented && !sel && !confirm) toggleFullscreen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [fullscreen, sel, confirm]);

  // Chọn một nút từ danh sách cảnh báo ⇒ kéo nó vào giữa khung.
  const focusNode = (id: number) => {
    const r = rects[id];
    if (!r) return;
    setSel({ kind: 'node', id });
    setShowWarnings(false);
    setView((v) => ({ ...v, x: size.w / 2 - (r.x + r.w / 2) * v.k, y: size.h / 2 - (r.y + r.h / 2) * v.k }));
  };

  // ─── Xuất ảnh ─────────────────────────────────────────────────
  const doExport = async (kind: 'png' | 'svg') => {
    exportPop.close();
    const svg = svgRef.current;
    if (!svg) return;
    setExporting(true);
    const prevSel = sel;
    setSel(null);
    setHover(null);
    // Đợi hai khung hình để bỏ trạng thái chọn/rê khỏi bản xuất.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
      const title = `${config.name} — ${wf.name} workflow`;
      if (kind === 'svg') downloadSvg(svg, contentBounds(), title);
      else await downloadPng(svg, contentBounds(), title);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not export the diagram');
    } finally {
      setExporting(false);
      setSel(prevSel);
    }
  };

  // ─── Vẽ ───────────────────────────────────────────────────────
  const selNode = sel?.kind === 'node' ? byId.get(sel.id) : undefined;
  const selEdge = sel?.kind === 'edge' ? sel.key : undefined;
  const isHotEdge = (k: string) => selEdge === k || (hover?.kind === 'edge' && hover.key === k);
  const touchesSel = (e: { from: number | null; to: number }) => selNode && (e.from === selNode.id || e.to === selNode.id);
  const gridSize = 20 * view.k;
  const anyEdgeCount = anyTargets.size;

  const handlePoints = (r: Rect): Pos[] => [
    { x: r.x + r.w, y: r.y + r.h / 2 }, { x: r.x, y: r.y + r.h / 2 },
    { x: r.x + r.w / 2, y: r.y }, { x: r.x + r.w / 2, y: r.y + r.h },
  ];

  return (
    <div
      className={cn(fullscreen && 'fixed inset-0 z-[60] flex flex-col bg-[var(--w-bg)] p-3 md:p-4')}
      role={fullscreen ? 'dialog' : undefined}
      aria-label={fullscreen ? `${wf.name} workflow diagram` : undefined}
    >
      {/* Thanh công cụ */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {fullscreen && <span className="mr-2 flex items-center gap-1.5 text-[14px] font-semibold"><Workflow size={15} className="text-[var(--w-text-3)]" />{wf.name}</span>}
        {canEdit && (
          <>
            <button ref={addRef} type="button" className="w-btn w-btn-sm" onClick={addPop.toggle} aria-expanded={addPop.on}>
              <Plus size={13} /> Status
            </button>
            <Popover open={addPop.on} onClose={addPop.close} anchorRef={addRef} width={280}>
              <AddStatusForm compact autoFocus pid={pid} wfId={wf.id} onAdded={(s) => { addPop.close(); invalidate(); setSel({ kind: 'node', id: s.id }); }} />
            </Popover>
          </>
        )}
        <button
          type="button"
          className={cn('w-btn w-btn-sm', showAny && '!border-[var(--w-accent-border)] !bg-[var(--w-accent-soft)] !text-[var(--w-accent-text)]')}
          onClick={() => setShowAny((v) => !v)}
          aria-pressed={showAny}
          disabled={!anyEdgeCount && !canEdit}
          title="Transitions that can be used from any status (Jira's global transitions)"
        >
          {showAny ? 'Hide' : 'Show'} “Any status” arrows{anyEdgeCount ? ` (${anyEdgeCount})` : ''}
        </button>
        <button type="button" className="w-btn w-btn-sm" onClick={autoArrange} title="Lay statuses out left to right by category">
          <Wand2 size={13} /> Auto-arrange
        </button>
        {canEdit && restricted && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => { draft.setMode('free'); setSel(null); }} title="Let any status move to any status">
            <Unlock size={13} /> Make free again
          </button>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          {layoutMut.isPending && <span className="flex items-center gap-1.5 text-[12px] text-[var(--w-text-3)]"><Spinner size={11} /> Saving layout</span>}
          <button ref={exportRef} type="button" className="w-btn w-btn-sm" onClick={exportPop.toggle} disabled={exporting} aria-expanded={exportPop.on}>
            {exporting ? <Spinner size={12} /> : <Download size={13} />} Export
          </button>
          <Popover open={exportPop.on} onClose={exportPop.close} anchorRef={exportRef} width={200} align="end">
            <div className="p-1">
              <button type="button" className="flex w-full flex-col rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]" onClick={() => doExport('png')}>
                <span>Download PNG</span><span className="text-[11px] text-[var(--w-text-3)]">For reports and slides</span>
              </button>
              <button type="button" className="flex w-full flex-col rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]" onClick={() => doExport('svg')}>
                <span>Download SVG</span><span className="text-[11px] text-[var(--w-text-3)]">Scalable, editable</span>
              </button>
            </div>
          </Popover>
          <button type="button" className="w-btn w-btn-sm w-btn-icon" onClick={() => toggleFullscreen()} aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} title={fullscreen ? 'Exit full screen (Esc)' : 'Full screen'}>
            {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Khung vẽ */}
      <div
        ref={canvasRef}
        className={cn(
          'relative overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]',
          fullscreen ? 'min-h-0 flex-1' : 'h-[420px] md:h-[560px]',
        )}
      >
        <svg
          ref={svgRef}
          className="block h-full w-full select-none outline-none"
          style={{ touchAction: 'none', cursor: drag.current?.type === 'pan' ? 'grabbing' : 'default' }}
          tabIndex={0}
          aria-label={`${wf.name} workflow diagram — ${statuses.length} statuses, ${restricted ? `${draft.pairs.size} transitions` : 'free workflow'}`}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { drag.current = null; setConnect(null); }}
          onKeyDown={onKeyDown}
        >
          <defs>
            <pattern id={`${uid}-grid`} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse" x={view.x % gridSize} y={view.y % gridSize}>
              <circle cx={1} cy={1} r={Math.max(0.6, 0.9 * Math.min(1.2, view.k))} style={{ fill: 'var(--w-border-strong)' }} />
            </pattern>
            {([['a', 'var(--w-text-3)'], ['h', 'var(--w-accent)'], ['y', 'var(--w-accent-border)']] as const).map(([k, c]) => (
              <marker key={k} id={`${uid}-m${k}`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={10} markerHeight={10} markerUnits="userSpaceOnUse" orient="auto">
                <path d="M0,0.8 L10,5 L0,9.2 L2.2,5 z" style={{ fill: c }} />
              </marker>
            ))}
          </defs>
          <rect data-export="skip" width="100%" height="100%" style={{ fill: `url(#${uid}-grid)`, cursor: 'grab' }} onPointerDown={onBgDown} />

          <g data-viewport transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {/* Chấm "Create" → trạng thái đầu (nơi thẻ mới sinh ra) */}
            {startPos && initial && (
              <g aria-hidden="true">
                <title>New issues start in “{initial.name}”</title>
                <line x1={startPos.x + START_R} y1={startPos.y} x2={rects[initial.id].x - 3} y2={startPos.y} style={{ stroke: 'var(--w-text-3)' }} strokeWidth={1.5} markerEnd={`url(#${uid}-ma)`} />
                <circle cx={startPos.x} cy={startPos.y} r={START_R} style={{ fill: 'var(--w-text-2)' }} />
                <text x={startPos.x} y={startPos.y - 15} textAnchor="middle" fontSize={11} style={{ fill: 'var(--w-text-3)' }}>Create</text>
              </g>
            )}

            {/* Nút "Any status" */}
            {showAny && restricted && (
              <g>
                <title>Any status — transitions from here can be used from every status</title>
                <rect x={anyRect.x} y={anyRect.y} width={ANY_W} height={ANY_H} rx={ANY_H / 2} strokeWidth={1.25} strokeDasharray="4 3" style={{ fill: 'var(--w-raised)', stroke: 'var(--w-accent-border)' }} />
                <text x={anyRect.x + ANY_W / 2} y={anyRect.y + ANY_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} style={{ fill: 'var(--w-accent-text)' }}>Any status</text>
                {canEdit && (
                  <circle
                    data-export="skip"
                    cx={anyRect.x + ANY_W / 2} cy={anyRect.y + ANY_H} r={5.5} strokeWidth={1.5}
                    style={{ fill: 'var(--w-panel)', stroke: 'var(--w-accent)', cursor: 'crosshair' }}
                    onPointerDown={(e) => onHandleDown(e, null)}
                  >
                    <title>Drag to a status to add a transition from any status</title>
                  </circle>
                )}
              </g>
            )}

            {/* Mũi tên */}
            {edges.map((e) => {
              const hot = isHotEdge(e.key) || !!touchesSel(e);
              const isAny = e.from === null;
              const dim = !!selNode && !touchesSel(e);
              return (
                <g key={e.key} style={{ opacity: dim ? 0.35 : 1 }}>
                  <path
                    d={e.g.d}
                    fill="none"
                    strokeWidth={hot ? 2.25 : 1.5}
                    strokeDasharray={isAny ? '5 4' : undefined}
                    markerEnd={`url(#${uid}-m${hot ? 'h' : isAny ? 'y' : 'a'})`}
                    style={{ stroke: hot ? 'var(--w-accent)' : isAny ? 'var(--w-accent-border)' : 'var(--w-text-3)', transition: 'stroke 120ms' }}
                  />
                  <path
                    data-export="skip"
                    d={e.g.d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={14}
                    style={{ cursor: 'pointer' }}
                    onPointerDown={(ev) => { ev.stopPropagation(); setSel({ kind: 'edge', key: e.key }); }}
                    onPointerEnter={() => !drag.current && setHover({ kind: 'edge', key: e.key })}
                    onPointerLeave={() => setHover(null)}
                  >
                    <title>{`${e.from === null ? 'Any status' : byId.get(e.from)?.name} → ${byId.get(e.to)?.name}`}</title>
                  </path>
                </g>
              );
            })}

            {/* Nút trạng thái */}
            {statuses.map((s) => {
              const r = rects[s.id];
              if (!r) return null;
              const selected = selNode?.id === s.id;
              const hovered = hover?.kind === 'node' && hover.id === s.id;
              const target = connect?.over === s.id;
              const cat = CATEGORY_DOT[s.category];
              const warn = warnings[s.id];
              const nameMax = NODE_W - 36 - (warn ? 20 : 0);
              const dim = !!selNode && !selected && !edges.some((e) => touchesSel(e) && (e.from === s.id || e.to === s.id));
              return (
                <g
                  key={s.id}
                  transform={`translate(${r.x},${r.y})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.name}, ${CATEGORY_LABEL[s.category]}${s.wipLimit ? `, WIP limit ${s.wipLimit}` : ''}${warn ? `, ${warn.length} warning${warn.length > 1 ? 's' : ''}` : ''}`}
                  className="outline-none"
                  style={{ cursor: canEdit ? 'move' : 'pointer', opacity: dim && !connect ? 0.55 : 1, transition: 'opacity 120ms' }}
                  onFocus={() => { if (!drag.current) setSel({ kind: 'node', id: s.id }); }}
                  onPointerDown={(e) => onNodeDown(e, s.id)}
                  onPointerEnter={() => !drag.current && setHover({ kind: 'node', id: s.id })}
                  onPointerLeave={() => setHover(null)}
                >
                  {(selected || target) && (
                    <rect data-export="skip" x={-4} y={-4} width={NODE_W + 8} height={NODE_H + 8} rx={11} fill="none" strokeWidth={2} strokeDasharray={target ? '4 3' : undefined} style={{ stroke: 'var(--w-accent)', opacity: 0.55 }} />
                  )}
                  <rect width={NODE_W} height={NODE_H} rx={8} style={{ fill: 'var(--w-raised)' }} />
                  <rect width={NODE_W} height={NODE_H} rx={8} fillOpacity={0.1} strokeWidth={selected ? 1.75 : 1.25} style={{ fill: cat, stroke: selected ? 'var(--w-accent)' : cat, strokeOpacity: selected ? 1 : 0.6 }} />
                  <circle cx={16} cy={23} r={4.5} style={{ fill: s.color }} />
                  <text x={28} y={27.5} fontSize={13} fontWeight={600} style={{ fill: 'var(--w-text)' }}>{fitText(s.name, nameMax, NAME_FONT)}</text>
                  <text x={12} y={47} fontSize={10.5} fontWeight={600} letterSpacing={0.5} style={{ fill: 'var(--w-text-3)' }}>{CATEGORY_LABEL[s.category].toUpperCase()}</text>
                  {s.wipLimit != null && (
                    <g>
                      <title>WIP limit {s.wipLimit}</title>
                      <rect x={NODE_W - 58} y={37} width={48} height={16} rx={4} strokeWidth={1} style={{ fill: 'var(--w-sunken)', stroke: 'var(--w-border-strong)' }} />
                      <text x={NODE_W - 34} y={48.5} textAnchor="middle" fontSize={10.5} fontWeight={600} style={{ fill: 'var(--w-text-2)' }}>WIP {s.wipLimit}</text>
                    </g>
                  )}
                  {warn && (
                    <g transform={`translate(${NODE_W - 24},13)`}>
                      <title>{warn.map((w) => w.text).join('\n')}</title>
                      <rect x={-3} y={-3} width={20} height={20} fill="transparent" />
                      <path d="M7 0.8 L13.6 12.6 H0.4 Z" strokeWidth={1.2} strokeLinejoin="round" style={{ fill: 'var(--w-yellow)', stroke: 'var(--w-yellow)' }} />
                      <rect x={6.3} y={4.3} width={1.4} height={4.4} rx={0.7} style={{ fill: 'var(--w-panel)' }} />
                      <circle cx={7} cy={10.4} r={0.85} style={{ fill: 'var(--w-panel)' }} />
                    </g>
                  )}
                  {anyTargets.has(s.id) && (
                    <g transform="translate(10,-9)">
                      <title>Issues can move here from any status</title>
                      <rect width={40} height={17} rx={8.5} strokeWidth={1} style={{ fill: 'var(--w-panel)', stroke: 'var(--w-accent-border)' }} />
                      <text x={20} y={12} textAnchor="middle" fontSize={10} fontWeight={700} letterSpacing={0.6} style={{ fill: 'var(--w-accent-text)' }}>ANY</text>
                    </g>
                  )}
                  {canEdit && (selected || hovered) && !connect && handlePoints({ x: 0, y: 0, w: NODE_W, h: NODE_H }).map((p, i) => (
                    <circle
                      key={i}
                      data-export="skip"
                      cx={p.x} cy={p.y} r={5.5} strokeWidth={1.5}
                      style={{ fill: 'var(--w-panel)', stroke: 'var(--w-accent)', cursor: 'crosshair' }}
                      onPointerDown={(e) => onHandleDown(e, s.id)}
                    >
                      <title>Drag to another status to add a transition</title>
                    </circle>
                  ))}
                </g>
              );
            })}

            {/* Mũi tên tạm khi đang kéo */}
            {connect && (
              <path
                data-export="skip"
                d={connect.over !== null
                  ? routeEdge(connect.from === null ? anyRect : rects[connect.from], rects[connect.over], [], 0).d
                  : straightFrom(connect.from === null ? anyRect : rects[connect.from], connect.to)}
                fill="none"
                strokeWidth={2}
                strokeDasharray="6 4"
                markerEnd={`url(#${uid}-mh)`}
                style={{ stroke: 'var(--w-accent)', pointerEvents: 'none' }}
              />
            )}
          </g>
        </svg>

        {/* Băng thông báo quy trình tự do */}
        {!restricted && (
          <div className="pointer-events-none absolute inset-x-2 top-2 flex justify-center">
            <div className="w-card pointer-events-auto flex max-w-[560px] flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 text-[12.5px] leading-snug text-[var(--w-text-2)]" onPointerDown={(e) => e.stopPropagation()}>
              <Info size={14} className="shrink-0 text-[var(--w-accent-text)]" />
              <span className="min-w-0 flex-1">
                <b className="font-medium text-[var(--w-text)]">Any status can move to any status</b> (free workflow).
                {canEdit && ' Add a transition to switch to a restricted workflow.'}
              </span>
              {canEdit && (
                <button type="button" className="w-btn w-btn-sm shrink-0" onClick={() => setConfirm({ pending: null })}>Start from a linear flow</button>
              )}
            </div>
          </div>
        )}

        {/* Cảnh báo */}
        {warnCount > 0 && (
          <div className="absolute left-2 top-2" onPointerDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="w-btn w-btn-sm !border-[color-mix(in_srgb,var(--w-yellow)_45%,transparent)] !bg-[var(--w-raised)]"
              onClick={() => setShowWarnings((v) => !v)}
              aria-expanded={showWarnings}
            >
              <AlertTriangle size={13} className="text-[var(--w-yellow)]" />
              {warnCount} status{warnCount > 1 ? 'es' : ''} need{warnCount > 1 ? '' : 's'} attention
            </button>
            {showWarnings && (
              <div className="w-card mt-1.5 max-h-[300px] w-[300px] overflow-y-auto p-1" style={{ boxShadow: 'var(--w-shadow-pop)' }}>
                {Object.entries(warnings).map(([id, ws]) => (
                  <button key={id} type="button" className="flex w-full flex-col gap-0.5 rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]" onClick={() => focusNode(Number(id))}>
                    <span className="text-[13px] font-medium">{byId.get(Number(id))?.name}</span>
                    {ws.map((w) => <span key={w.kind} className="text-[12px] leading-snug text-[var(--w-text-2)]">{w.kind === 'unreachable' ? 'Unreachable' : 'Dead end'} — {w.text.split('—')[1]?.trim() ?? w.text}</span>)}
                  </button>
                ))}
                <p className="px-2 pb-1 pt-1.5 text-[11px] text-[var(--w-text-3)]">Warnings don’t block saving.</p>
              </div>
            )}
          </div>
        )}

        {/* Phóng to / thu nhỏ */}
        <div className="w-card absolute bottom-2 left-2 flex items-center p-0.5" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => zoomCenter(1 / 1.2)} aria-label="Zoom out" title="Zoom out (−)"><Minus size={13} /></button>
          <button type="button" className="tabular h-[26px] min-w-[46px] rounded-[5px] px-1 text-[12px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]" onClick={() => zoomAt(size.w / 2, size.h / 2, 1 / view.k)} title="Reset to 100%">
            {Math.round(view.k * 100)}%
          </button>
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => zoomCenter(1.2)} aria-label="Zoom in" title="Zoom in (+)"><Plus size={13} /></button>
          <span className="mx-0.5 h-4 w-px bg-[var(--w-border)]" />
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={fit} title="Fit to screen (0)"><Scan size={13} /> Fit</button>
        </div>

        {/* Gợi ý / chú giải */}
        {!sel && (
          <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-3 text-[11.5px] text-[var(--w-text-3)] lg:flex">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as const).map((c) => (
              <span key={c} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[3px] border" style={{ borderColor: CATEGORY_DOT[c], background: `color-mix(in srgb, ${CATEGORY_DOT[c]} 15%, transparent)` }} />{CATEGORY_LABEL[c]}</span>
            ))}
            {canEdit && <span className="border-l border-[var(--w-border)] pl-3">Drag a ○ handle to connect · ⌘/Ctrl + scroll to zoom</span>}
          </div>
        )}

        {/* Thanh chưa lưu */}
        {canEdit && draft.dirty && (
          <div className="pointer-events-none absolute inset-x-2 bottom-12 flex justify-center">
            <div className="w-card pointer-events-auto flex items-center gap-2 py-1.5 pl-3 pr-1.5 text-[13px]" style={{ boxShadow: 'var(--w-shadow-pop)' }} onPointerDown={(e) => e.stopPropagation()}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--w-orange)]" />
              <span className="font-medium">{draft.invalid ? 'No transitions — issues couldn’t move' : 'Unsaved changes'}</span>
              <span className="hidden text-[12px] text-[var(--w-text-3)] sm:inline">
                {draft.mode === 'free' ? '· free workflow' : `· ${draft.pairs.size} transition${draft.pairs.size === 1 ? '' : 's'}`}
              </span>
              <button type="button" className="w-btn w-btn-sm" onClick={() => { draft.discard(); setSel(null); }} disabled={draft.saving}>Discard</button>
              <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={draft.save} disabled={draft.saving || draft.invalid} title={draft.invalid ? 'Draw at least one transition, or make the workflow free again' : undefined}>
                {draft.saving && <Spinner size={12} />} Save
              </button>
            </div>
          </div>
        )}

        {/* Khung bên */}
        {selNode && (
          <NodeInspector
            key={selNode.id}
            status={selNode}
            statuses={statuses}
            pid={pid}
            canEdit={canEdit}
            draft={draft}
            warnings={warnings[selNode.id] ?? []}
            onClose={() => setSel(null)}
            onChanged={invalidate}
            onAdd={addTransition}
            onSelectEdge={(key) => setSel({ kind: 'edge', key })}
            onDelete={() => onDeleteStatus(selNode)}
          />
        )}
        {selEdge && (
          <EdgeInspector
            key={selEdge}
            edgeKey={selEdge}
            statuses={statuses}
            canEdit={canEdit}
            draft={draft}
            onClose={() => setSel(null)}
            onSelectEdge={(key) => setSel({ kind: 'edge', key })}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={applyRestrict}
        danger={false}
        title="Switch to a restricted workflow?"
        confirmLabel="Switch to restricted"
        body={
          <>
            <p>Today any status can move to any status. After this, <b className="font-medium text-[var(--w-text)]">issues will only move along the arrows you draw</b>.</p>
            <p className="mt-2">
              To keep work moving, the diagram starts from a linear flow — each status to the next one in board order, and any status back to
              {' '}“{statuses[0]?.name}”{confirm?.pending ? ', plus the transition you just drew' : ''}. Edit it freely; nothing is saved until you click <b className="font-medium text-[var(--w-text)]">Save</b>.
            </p>
          </>
        }
      />
    </div>
  );
}
