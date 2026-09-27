'use client';

/**
 * Ô viết tay dùng chung — Apple Pencil trên iPad, chuột/trackpad trên Mac,
 * ngón tay trên điện thoại.
 *
 * ── Vì sao lưu NÉT (vector) chứ không lưu điểm ảnh ──
 * Khung đổi cỡ (xoay iPad, kéo cửa sổ) và đổi giao diện sáng/tối thì chỉ việc
 * vẽ lại từ dữ liệu nét; ảnh bitmap thì hoặc vỡ hoặc mang màu mực sai. Toạ độ
 * lưu CHUẨN HOÁ theo chiều rộng khung (x/W, y/W) nên cùng một bài viết hiện
 * đúng ở mọi cỡ, và độ dày nét cũng tỉ lệ theo.
 *
 * ── Chống tì tay (palm rejection) ──
 * Ngay khi thấy MỘT sự kiện `pointerType === 'pen'` (ở bất kỳ ô nào trên
 * trang), mọi con trỏ `touch` thôi vẽ: lòng bàn tay tì lên màn hình không để
 * lại vết. Ngón tay lúc đó được dùng để CUỘN trang (khung đặt
 * `touch-action: none` để bút không kéo trang đi, nên phải tự cuộn bằng tay).
 * Người không có bút (điện thoại) thì ngón tay vẫn vẽ như thường.
 *
 * ── Lực nhấn ──
 * Bút: độ dày = nét gốc × (0.45 + 0.9 × pressure), pressure được làm mượt
 * theo hàm mũ để nét không lởm chởm. Chuột/ngón tay không có lực thật →
 * cố định 0.5 (đúng giá trị trình duyệt báo cho chuột đang bấm).
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Eraser, PenLine, Trash2, Undo2 } from 'lucide-react';
import s from './course.module.css';

export type InkColor = 'k' | 'b' | 'r';
/** Một nét. `p` = [x, y, lực, x, y, lực…] chuẩn hoá theo chiều rộng; `w` = độ dày gốc / chiều rộng. */
export type Stroke = { c: InkColor; w: number; p: number[] };
export type Tool = 'pen' | 'eraser';
/** Vẽ nền (ô 田, giấy kẻ dòng…) — `exporting` = đang xuất ảnh gửi AI (không vẽ chữ mờ). */
export type Painter = (ctx: CanvasRenderingContext2D, w: number, h: number, o: { dark: boolean; exporting: boolean }) => void;

export type HandCanvasHandle = {
  undo: () => void;
  clear: () => void;
  isEmpty: () => boolean;
  strokes: () => Stroke[];
  /** Ảnh nền trắng, mực đậm — để gửi AI. Trả data URL. */
  toImage: (o?: { width?: number; type?: 'image/png' | 'image/jpeg'; quality?: number }) => string;
};

const INK: Record<'light' | 'dark', Record<InkColor, string>> = {
  light: { k: '#1f2328', b: '#1d4ed8', r: '#dc2626' },
  dark: { k: '#eef0f3', b: '#93c5fd', r: '#fca5a5' },
};
export const INK_SWATCH = INK.light;

/* ── Trạng thái bút DÙNG CHUNG cả trang ─────────────────────────────────
 * Lòng bàn tay có thể chạm vào một ô KHÁC ô đang viết, nên cờ phải ở mức
 * module chứ không ở từng ô. */
let penSeen = false;
let penDown = 0;
/** Lúc bút vừa nhấc — lòng bàn tay vẫn tì giữa hai nét, đừng coi đó là cuộn. */
let penUpAt = 0;

/* ── Vẽ ─────────────────────────────────────────────────────────────── */

const pf = (pr: number) => 0.45 + 0.9 * pr;

/**
 * Vẽ nét từ đoạn `from` (các điểm P0..Pm). Đoạn i (1 ≤ i ≤ m−1) là đường cong
 * bậc hai từ trung điểm (P[i−1],P[i]) — riêng i = 1 bắt đầu từ P0 — điều khiển
 * bởi P[i], tới trung điểm (P[i],P[i+1]). `tail` vẽ nốt đoạn thẳng cuối.
 * Vẽ tăng dần lúc đang viết và vẽ lại toàn bộ dùng CHUNG hàm này nên hai cách
 * cho ra đúng một hình.
 */
function drawStroke(ctx: CanvasRenderingContext2D, st: Stroke, W: number, color: string, from = 1, tail = true) {
  const p = st.p;
  const n = p.length / 3;
  const base = st.w * W;
  const X = (i: number) => p[i * 3] * W;
  const Y = (i: number) => p[i * 3 + 1] * W;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (n === 1) {
    ctx.beginPath();
    ctx.arc(X(0), Y(0), (base * pf(p[2])) / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (n === 2) {
    if (!tail) return;
    ctx.beginPath();
    ctx.lineWidth = base * pf(p[5]);
    ctx.moveTo(X(0), Y(0));
    ctx.lineTo(X(1), Y(1));
    ctx.stroke();
    return;
  }
  for (let i = Math.max(1, from); i <= n - 2; i++) {
    ctx.beginPath();
    ctx.lineWidth = base * pf(p[i * 3 + 2]);
    if (i === 1) ctx.moveTo(X(0), Y(0));
    else ctx.moveTo((X(i - 1) + X(i)) / 2, (Y(i - 1) + Y(i)) / 2);
    ctx.quadraticCurveTo(X(i), Y(i), (X(i) + X(i + 1)) / 2, (Y(i) + Y(i + 1)) / 2);
    ctx.stroke();
  }
  if (tail) {
    ctx.beginPath();
    ctx.lineWidth = base * pf(p[(n - 1) * 3 + 2]);
    ctx.moveTo((X(n - 2) + X(n - 1)) / 2, (Y(n - 2) + Y(n - 1)) / 2);
    ctx.lineTo(X(n - 1), Y(n - 1));
    ctx.stroke();
  }
}

/** Vẽ nền + mọi nét lên một canvas bất kỳ (dùng cả cho xuất ảnh ngoài màn hình). */
export function paintAll(
  ctx: CanvasRenderingContext2D, W: number, H: number, strokes: Stroke[],
  o: { dark: boolean; exporting: boolean; background?: Painter },
) {
  ctx.fillStyle = o.exporting ? '#ffffff' : o.dark ? '#1a1c20' : '#fffefb';
  ctx.fillRect(0, 0, W, H);
  o.background?.(ctx, W, H, o);
  const pal = INK[o.dark && !o.exporting ? 'dark' : 'light'];
  for (const st of strokes) drawStroke(ctx, st, W, pal[st.c]);
}

/** Xuất một bộ nét thành canvas nền trắng (không cần ô đang hiện trên trang). */
export function renderInk(strokes: Stroke[], width: number, aspect: number, background?: Painter): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.round(width);
  c.height = Math.round(width * aspect);
  const ctx = c.getContext('2d');
  if (ctx) paintAll(ctx, c.width, c.height, strokes, { dark: false, exporting: true, background });
  return c;
}

/** Theo dõi giao diện tối của cả web (`html.theme-dark`, KHÔNG phải `.dark`). */
export function useDarkTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.classList.contains('theme-dark'));
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

/* ── Thành phần ─────────────────────────────────────────────────────── */

type Props = {
  /** Cao / rộng. */
  aspect: number;
  /** Nét ban đầu / nét do cha giữ. Cha đưa lại đúng mảng vừa nhận từ onChange thì không vẽ lại. */
  strokes?: Stroke[];
  onChange?: (s: Stroke[]) => void;
  tool?: Tool;
  color?: InkColor;
  /** Độ dày nét (px) khi khung rộng `designWidth` px — khung to/nhỏ hơn thì nét to/nhỏ theo. */
  penWidth?: number;
  designWidth?: number;
  background?: Painter;
  className?: string;
  ariaLabel?: string;
  /** Gọi khi bắt đầu một nét — để thanh công cụ chung biết ô nào vừa viết (nút Hoàn tác). */
  onActive?: () => void;
};

const MAX_HISTORY = 60;

const HandCanvas = forwardRef<HandCanvasHandle, Props>(function HandCanvas(
  { aspect, strokes: strokesProp, onChange, tool = 'pen', color = 'k', penWidth = 4, designWidth = 600, background, className, ariaLabel, onActive },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [W, setW] = useState(0);
  const dark = useDarkTheme();
  const strokesRef = useRef<Stroke[]>(strokesProp ?? []);
  const emitted = useRef<Stroke[] | undefined>(strokesProp);
  const hist = useRef<Stroke[][]>([]);
  const cur = useRef<{ id: number; st: Stroke; erase: boolean; pr: number } | null>(null);
  const scroll = useRef<{ id: number; y: number; moved: boolean } | null>(null);
  // Giá trị mới nhất cho các trình nghe sự kiện gắn một lần.
  const live = useRef({ tool, color, penWidth, designWidth, W, dark, background, onChange, onActive });
  live.current = { tool, color, penWidth, designWidth, W, dark, background, onChange, onActive };

  const redraw = useCallback(() => {
    const c = cv.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx || !live.current.W) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = live.current.W;
    paintAll(ctx, w, w * aspect, strokesRef.current, { dark: live.current.dark, exporting: false, background: live.current.background });
  }, [aspect]);

  // Cỡ khung theo chỗ chứa; canvas nhân devicePixelRatio để nét sắc trên Retina.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.floor(el.clientWidth)));
    ro.observe(el);
    setW(Math.floor(el.clientWidth));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = cv.current;
    if (!c || !W) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(W * dpr);
    c.height = Math.round(W * aspect * dpr);
    redraw();
  }, [W, aspect, redraw]);

  useEffect(() => { redraw(); }, [dark, background, redraw]);

  // Cha đổi nét (nạp từ localStorage, chuyển trang, xoá từ ngoài).
  useEffect(() => {
    if (strokesProp === emitted.current) return;
    strokesRef.current = strokesProp ?? [];
    emitted.current = strokesProp;
    hist.current = [];
    redraw();
  }, [strokesProp, redraw]);

  const commit = (next: Stroke[], snapshot = true) => {
    if (snapshot) {
      hist.current.push(strokesRef.current);
      if (hist.current.length > MAX_HISTORY) hist.current.shift();
    }
    strokesRef.current = next;
    emitted.current = next;
    live.current.onChange?.(next);
  };

  useImperativeHandle(ref, () => ({
    undo: () => {
      const prev = hist.current.pop();
      if (!prev) return;
      strokesRef.current = prev;
      emitted.current = prev;
      live.current.onChange?.(prev);
      redraw();
    },
    clear: () => {
      if (!strokesRef.current.length) return;
      commit([]);
      redraw();
    },
    isEmpty: () => strokesRef.current.length === 0,
    strokes: () => strokesRef.current,
    toImage: (o) => {
      const w = o?.width ?? 1200;
      return renderInk(strokesRef.current, w, aspect, live.current.background).toDataURL(o?.type ?? 'image/png', o?.quality ?? 0.9);
    },
  }), [aspect, redraw]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trình nghe gắn tay (không qua React) để chặn được `touchstart` không-thụ-động:
  // thiếu nó, giữ bút/ngón lâu trên iPad bật kính lúp và bôi chọn chữ.
  useEffect(() => {
    const c = cv.current;
    if (!c) return;

    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const w = r.width || 1;
      return [(e.clientX - r.left) / w, (e.clientY - r.top) / w] as const;
    };
    const pressureOf = (e: PointerEvent) => (e.pointerType === 'pen' ? Math.max(0.05, e.pressure || 0.5) : 0.5);

    const eraseAt = (x: number, y: number) => {
      const W0 = live.current.W || 1;
      const r = 14 / W0;
      const keep = strokesRef.current.filter((st) => {
        const rr = r + st.w;
        for (let i = 0; i < st.p.length; i += 3) {
          const dx = st.p[i] - x, dy = st.p[i + 1] - y;
          if (dx * dx + dy * dy <= rr * rr) return false;
        }
        return true;
      });
      if (keep.length !== strokesRef.current.length) {
        strokesRef.current = keep; // ảnh chụp lịch sử đã lấy ở pointerdown
        emitted.current = keep;
        live.current.onChange?.(keep);
        redraw();
      }
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'pen') penSeen = true;
      if (e.pointerType === 'touch' && (penSeen || penDown > 0)) {
        // Lòng bàn tay / ngón tay khi đã có bút: không vẽ, dùng để cuộn trang.
        scroll.current = { id: e.pointerId, y: e.clientY, moved: false };
        return;
      }
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (cur.current) return; // đang có một nét — bỏ qua con trỏ thứ hai
      e.preventDefault();
      c.setPointerCapture?.(e.pointerId);
      if (e.pointerType === 'pen') penDown++;
      live.current.onActive?.();
      const erase = live.current.tool === 'eraser' || e.button === 5 || (e.buttons & 32) === 32;
      const [x, y] = pos(e);
      if (erase) {
        hist.current.push(strokesRef.current);
        if (hist.current.length > MAX_HISTORY) hist.current.shift();
        cur.current = { id: e.pointerId, st: { c: 'k', w: 0, p: [] }, erase: true, pr: 0 };
        eraseAt(x, y);
        return;
      }
      const pr = pressureOf(e);
      const st: Stroke = { c: live.current.color, w: live.current.penWidth / live.current.designWidth, p: [x, y, pr] };
      cur.current = { id: e.pointerId, st, erase: false, pr };
      const ctx = c.getContext('2d');
      if (ctx) drawStroke(ctx, st, live.current.W, INK[live.current.dark ? 'dark' : 'light'][st.c]);
    };

    const move = (e: PointerEvent) => {
      const sc = scroll.current;
      if (sc && e.pointerId === sc.id) {
        // Tay tì khi đang viết (hoặc vừa nhấc bút) xê dịch vài px là chuyện
        // thường — chỉ cuộn khi bút đã rời hẳn và ngón đã kéo rõ ràng (>10px).
        const dy = sc.y - e.clientY;
        if (penDown > 0 || Date.now() - penUpAt < 600) { sc.y = e.clientY; return; }
        if (!sc.moved && Math.abs(dy) < 10) return;
        sc.moved = true;
        window.scrollBy(0, dy);
        sc.y = e.clientY;
        return;
      }
      const k = cur.current;
      if (!k || e.pointerId !== k.id) return;
      e.preventDefault();
      const evs = (typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : []) as PointerEvent[];
      const list = evs.length ? evs : [e];
      if (k.erase) {
        for (const ev of list) { const [x, y] = pos(ev); eraseAt(x, y); }
        return;
      }
      const W0 = live.current.W || 1;
      const minD = 0.9 / W0; // bỏ điểm sát nhau dưới ~1px: nhẹ localStorage, nét không đổi
      const p = k.st.p;
      const before = p.length / 3;
      for (const ev of list) {
        const [x, y] = pos(ev);
        const lx = p[p.length - 3], ly = p[p.length - 2];
        if ((x - lx) ** 2 + (y - ly) ** 2 < minD * minD) continue;
        k.pr = k.pr * 0.6 + pressureOf(ev) * 0.4;
        p.push(+x.toFixed(4), +y.toFixed(4), +k.pr.toFixed(2));
      }
      const after = p.length / 3;
      if (after === before) return;
      const ctx = c.getContext('2d');
      // Vẽ tăng dần: chỉ những đoạn cong vừa "khép" (đoạn i cần có P[i+1]).
      if (ctx && after >= 3) drawStroke(ctx, k.st, W0, INK[live.current.dark ? 'dark' : 'light'][k.st.c], Math.max(1, before - 1), false);
    };

    const up = (e: PointerEvent) => {
      if (scroll.current && e.pointerId === scroll.current.id) { scroll.current = null; return; }
      const k = cur.current;
      if (!k || e.pointerId !== k.id) return;
      if (e.pointerType === 'pen') { penDown = Math.max(0, penDown - 1); penUpAt = Date.now(); }
      cur.current = null;
      if (k.erase) return;
      commit([...strokesRef.current, k.st]);
      redraw(); // vẽ lại sạch (đoạn đuôi + mép chồng của các đoạn cong)
    };

    const noTouch = (e: TouchEvent) => { if (e.cancelable) e.preventDefault(); };

    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('touchstart', noTouch, { passive: false });
    return () => {
      c.removeEventListener('pointerdown', down);
      c.removeEventListener('pointermove', move);
      c.removeEventListener('pointerup', up);
      c.removeEventListener('pointercancel', up);
      c.removeEventListener('touchstart', noTouch);
    };
  }, [redraw]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={wrap} className={`${s.inkWrap} ${className ?? ''}`} style={{ aspectRatio: `${1 / aspect}` }}>
      <canvas
        ref={cv}
        className={`${s.inkCanvas} ${tool === 'eraser' ? s.inkErase : ''}`}
        style={{ width: W || '100%', height: W ? W * aspect : '100%' }}
        role="img"
        aria-label={ariaLabel ?? 'Ô viết tay'}
      />
    </div>
  );
});

export default HandCanvas;

/* ── Thanh công cụ ──────────────────────────────────────────────────── */

export function InkTools({
  tool, setTool, color, setColor, onUndo, onClear, clearLabel = 'Xoá', children,
}: {
  tool: Tool; setTool: (t: Tool) => void;
  color: InkColor; setColor: (c: InkColor) => void;
  onUndo?: () => void; onClear?: () => void; clearLabel?: string;
  children?: React.ReactNode;
}) {
  const names: Record<InkColor, string> = { k: 'Mực đen', b: 'Mực xanh', r: 'Mực đỏ' };
  return (
    <div className={s.inkTools} role="toolbar" aria-label="Công cụ viết">
      <button type="button" className={`${s.inkTool} ${tool === 'pen' ? s.inkToolOn : ''}`} onClick={() => setTool('pen')} aria-pressed={tool === 'pen'} title="Bút">
        <PenLine size={16} /> <span>Bút</span>
      </button>
      <button type="button" className={`${s.inkTool} ${tool === 'eraser' ? s.inkToolOn : ''}`} onClick={() => setTool('eraser')} aria-pressed={tool === 'eraser'} title="Tẩy (xoá cả nét)">
        <Eraser size={16} /> <span>Tẩy</span>
      </button>
      <span className={s.inkSep} aria-hidden />
      {(['k', 'b', 'r'] as InkColor[]).map((c) => (
        <button
          key={c}
          type="button"
          className={`${s.inkSwatch} ${color === c && tool === 'pen' ? s.inkSwatchOn : ''}`}
          style={{ ['--sw' as string]: INK_SWATCH[c] }}
          onClick={() => { setColor(c); setTool('pen'); }}
          aria-label={names[c]}
          aria-pressed={color === c}
          title={names[c]}
        />
      ))}
      <span className={s.inkSep} aria-hidden />
      {onUndo && (
        <button type="button" className={s.inkTool} onClick={onUndo} title="Hoàn tác nét vừa viết">
          <Undo2 size={16} /> <span>Hoàn tác</span>
        </button>
      )}
      {onClear && (
        <button type="button" className={s.inkTool} onClick={onClear} title={clearLabel}>
          <Trash2 size={16} /> <span>{clearLabel}</span>
        </button>
      )}
      {children}
    </div>
  );
}

/* ── Lưu / nạp ──────────────────────────────────────────────────────── */

export function loadInk<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Ghi trễ — một bài luận là hàng nghìn nét, không ghi lại cả khối sau từng nét. */
export function useInkSaver(key: string) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<unknown>(undefined);
  const flush = useCallback(() => {
    if (t.current) clearTimeout(t.current);
    t.current = null;
    if (pending.current === undefined) return;
    try {
      if (pending.current === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(pending.current));
    } catch { /* đầy bộ nhớ / chế độ riêng tư — nét vẫn còn trên màn hình */ }
    pending.current = undefined;
  }, [key]);
  useEffect(() => () => flush(), [flush]);
  useEffect(() => {
    const h = () => flush();
    window.addEventListener('pagehide', h);
    return () => window.removeEventListener('pagehide', h);
  }, [flush]);
  return useCallback((v: unknown) => {
    pending.current = v;
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(flush, 500);
  }, [flush]);
}

/** Đổi data URL thành base64 thuần (backend nhận không kèm tiền tố). */
export const b64 = (dataUrl: string) => dataUrl.slice(dataUrl.indexOf(',') + 1);
