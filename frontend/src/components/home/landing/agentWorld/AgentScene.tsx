'use client';

/**
 * Cảnh làng agent — phần nặng, chỉ tải khi người xem cuộn gần tới (xem AgentWorldLazy).
 *
 * ─── HIỆU NĂNG ──────────────────────────────────────────────────────────────
 * · MỘT vòng requestAnimationFrame duy nhất: đặt `transform` cho nhân vật + khinh khí cầu (chỉ GHI, không đọc
 *   layout) và vẽ dây nối + gói dữ liệu lên MỘT canvas. Không setState trong vòng lặp.
 * · Mọi chuyển động còn lại là CSS transform/opacity (chạy trên compositor). Sao và bóng đèn gom thành vài
 *   NHÓM nhấp nháy lệch pha, thay vì hàng chục phần tử animate riêng.
 * · Cảnh tĩnh (đồi, mặt đất, dây cờ) vẽ một lần theo kích thước, chỉ vẽ lại khi đổi cỡ.
 * · Ra khỏi màn hình ⇒ dừng vòng lặp + `data-paused` (CSS dừng mọi animation). Tab ẩn ⇒ rAF tự dừng.
 * · `prefers-reduced-motion` (hoặc công tắc giảm chuyển động của web) ⇒ không chạy vòng lặp, nhân vật đứng
 *   yên ở chỗ của mình; bấm vào vẫn mở bong bóng như thường.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AGENTS, WORLD_COPY, type AgentDef, type AgentKind } from './agents';
import { AgentSprite, WorldDefs } from './sprites';
import CodeBubble, { SNIPPETS_NARROW, SNIPPETS_WIDE, type CodeBubbleHandle } from './CodeBubble';
import { BALLOON, BUSH, CABIN, FIRE_BASE, FLAME_A, FLAME_B, LAMP, MOON, PINE, Pix, SHED, SIGN, type PixelArt } from './pixel';

/* ─── Số ngẫu nhiên có hạt giống: cảnh giống hệt nhau mỗi lần tải ─── */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Size {
  w: number;
  h: number;
}

interface Layout {
  px: number;
  ground: number;
  hub: { x: number; y: number };
  sprite: number;
  panda: number;
  narrow: boolean;
}

function layoutFor({ w, h }: Size): Layout {
  const narrow = w < 640;
  return {
    px: narrow ? 3 : 4,
    ground: narrow ? 46 : 56,
    hub: narrow ? { x: w * 0.8, y: h * 0.47 } : { x: w * 0.82, y: h * 0.2 },
    sprite: narrow ? 52 : 80,
    panda: narrow ? 64 : 96,
    narrow,
  };
}

function sizeOf(def: AgentDef, L: Layout) {
  if (def.id === 'panda') return L.panda;
  if (def.id === 'buddy') return Math.round(L.panda * 1.2);
  return Math.round(L.sprite * (def.lane === 1 ? 0.88 : 1));
}

/* ─── Đạo cụ trên mặt đất (vị trí theo phần bề rộng) ─── */
interface Prop {
  art: PixelArt;
  x: number;
  scale: number;
  back?: boolean;
  minWidth?: number;
  extra?: 'cabin' | 'lamp' | 'fire' | 'shed';
}
const PROPS: Prop[] = [
  { art: PINE, x: 0.012, scale: 1.7, back: true },
  { art: PINE, x: 0.07, scale: 1.15 },
  { art: BUSH, x: 0.125, scale: 1.2, minWidth: 560 },
  { art: PINE, x: 0.2, scale: 1.35, back: true, minWidth: 560 },
  { art: LAMP, x: 0.265, scale: 1, extra: 'lamp' },
  { art: SIGN, x: 0.345, scale: 1, minWidth: 900 },
  { art: CABIN, x: 0.445, scale: 1.2, back: true, extra: 'cabin' },
  { art: FIRE_BASE, x: 0.535, scale: 1, extra: 'fire' },
  { art: PINE, x: 0.655, scale: 1.5, back: true },
  { art: PINE, x: 0.715, scale: 1.05, minWidth: 720 },
  { art: SHED, x: 0.8, scale: 1.15, back: true, extra: 'shed', minWidth: 640 },
  { art: BUSH, x: 0.865, scale: 1.1, minWidth: 900 },
  { art: PINE, x: 0.915, scale: 1.25 },
  { art: PINE, x: 0.985, scale: 1.75, back: true },
];

/* ─── Cảnh tĩnh: đồi bậc thang + mặt đất cỏ, vẽ theo đúng bề rộng (bậc = bội số của --aw-px) ─── */
function landPaths({ w, h }: Size, L: Layout) {
  const r = rng(11);
  const gTop = h - L.ground;
  const step = L.px * 2;
  const hill = (base: number, amp: number, f1: number, f2: number, ph: number) => {
    let d = `M0 ${gTop + 2}`;
    for (let x = 0; x <= w + step; x += step) {
      const y = base - amp * (0.55 * Math.sin(x * f1 + ph) + 0.45 * Math.sin(x * f2 + ph * 2.3));
      const q = Math.round(y / L.px) * L.px;
      d += `V${q}H${x + step}`;
    }
    return d + `V${gTop + 2}Z`;
  };
  const far = hill(gTop - (L.narrow ? 70 : 105), L.narrow ? 26 : 40, 0.0042, 0.011, 1.3);
  const mid = hill(gTop - (L.narrow ? 30 : 46), L.narrow ? 14 : 20, 0.0065, 0.017, 4.1);
  // Mặt đất: dải cỏ trên + đất dưới, chấm đất sẫm và ngọn cỏ lởm chởm ngẫu nhiên (có hạt giống).
  let tufts = '';
  let specks = '';
  for (let x = 0; x < w; x += L.px) {
    const v = r();
    if (v < 0.22) tufts += `M${x} ${gTop - L.px}h${L.px}v${L.px}h-${L.px}z`;
    if (v > 0.93) tufts += `M${x} ${gTop - 2 * L.px}h${L.px}v${2 * L.px}h-${L.px}z`;
    const s = r();
    if (s < 0.09) {
      const y = gTop + L.px * (3 + Math.floor(r() * Math.max(1, L.ground / L.px - 4)));
      specks += `M${x} ${y}h${L.px}v${L.px}h-${L.px}z`;
    }
  }
  // Đèn làng xa trên đồi: vài chấm ấm.
  const lights: { x: number; y: number }[] = [];
  for (let i = 0; i < (L.narrow ? 4 : 8); i++) {
    const x = Math.round((0.05 + r() * 0.9) * w / L.px) * L.px;
    lights.push({ x, y: gTop - (L.narrow ? 46 : 70) + Math.round(r() * 3) * L.px });
  }
  return { far, mid, tufts, specks, gTop, lights };
}

function starsFor({ w, h }: Size, L: Layout) {
  const r = rng(7);
  const n = L.narrow ? 34 : 64;
  const groups: { x: number; y: number; s: number }[][] = [[], [], [], []];
  const skyBottom = h - L.ground - (L.narrow ? 120 : 170);
  for (let i = 0; i < n; i++) {
    const s = r() < 0.18 ? 2 : 1;
    groups[i % 4].push({ x: Math.round(r() * w), y: Math.round(r() * skyBottom), s: s * (L.narrow ? 1.5 : 2) });
  }
  return groups;
}

/* Dây cờ + dây đèn: parabol võng giữa, hai đầu ra ngoài mép. */
function strands({ w, h }: Size, L: Layout) {
  const gTop = h - L.ground;
  const mk = (yEnd: number, sag: number) => {
    const y = (x: number) => {
      const u = (x - w / 2) / (w / 2 + 30);
      return yEnd + sag * (1 - u * u);
    };
    let d = `M-30 ${y(-30)}`;
    for (let x = -30; x <= w + 30; x += 12) d += `L${x} ${y(x).toFixed(1)}`;
    return { d, y };
  };
  const flags = mk(gTop - (L.narrow ? 150 : 214), L.narrow ? 26 : 48);
  const bulbs = mk(gTop - (L.narrow ? 128 : 180), L.narrow ? 30 : 56);
  const pennants: { x: number; y: number; c: number }[] = [];
  const sp = L.narrow ? 26 : 34;
  for (let x = 10, i = 0; x < w; x += sp, i++) pennants.push({ x, y: flags.y(x), c: i % 6 });
  const bulbGroups: { x: number; y: number }[][] = [[], [], []];
  const bs = L.narrow ? 22 : 26;
  for (let x = 6, i = 0; x < w; x += bs, i++) bulbGroups[i % 3].push({ x, y: bulbs.y(x) + 3 });
  return { flagRope: flags.d, bulbRope: bulbs.d, pennants, bulbGroups };
}

/* ─── Bộ máy chuyển động (dữ liệu sống ngoài React) ─── */
interface Live {
  def: AgentDef;
  el: HTMLElement | null;
  flip: HTMLElement | null;
  emote: HTMLElement | null;
  x: number;
  tx: number;
  min: number;
  max: number;
  dir: 1 | -1;
  walking: boolean;
  until: number;
  emoteUntil: number;
  emoteCool: number;
  headY: number;
  ping: number;
  up: { t0: number; dur: number } | null;
  nextUp: number;
  /** Đoạn đường đang đi: chạy bằng Web Animations (compositor); JS chỉ nội suy x để vẽ dây. */
  seg: { x0: number; x1: number; t0: number; dur: number } | null;
  anim: Animation | null;
}

const EMOTES = ['♪', '✦', '♥', 'hi!', '…', '?!', '☆'];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(mql.matches || document.documentElement.classList.contains('reduce-motion'));
    read();
    mql.addEventListener?.('change', read);
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      mql.removeEventListener?.('change', read);
      mo.disconnect();
    };
  }, []);
  return reduced;
}

export default function AgentScene({ vi }: { vi: boolean }) {
  const copy = vi ? WORLD_COPY.vi : WORLD_COPY.en;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balloonRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<CodeBubbleHandle>(null);
  const [size, setSize] = useState<Size | null>(null);
  const reduced = useReducedMotion();

  // Lựa chọn của NGƯỜI DÙNG — sự kiện gần nhất thắng (rê chuột, Tab bàn phím, hay bấm để ghim).
  const [sel, setSel] = useState<{ id: AgentKind; pinned: boolean } | null>(null);
  const [autoId, setAutoId] = useState<AgentKind | null>(null);
  const openId = sel?.id ?? autoId;
  const pinnedId = sel?.pinned ? sel.id : null;
  const openRef = useRef<AgentKind | null>(null);
  openRef.current = openId;
  const lastUser = useRef(-1e9);
  const lives = useRef<Map<AgentKind, Live>>(new Map());
  const refs = useRef<Map<AgentKind, { el: HTMLElement | null; flip: HTMLElement | null; emote: HTMLElement | null }>>(new Map());

  /* Đo sân khấu. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setSize((prev) => (prev && Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1 ? prev : { w: Math.round(r.width), h: Math.round(r.height) }));
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const L = useMemo(() => (size ? layoutFor(size) : null), [size]);
  const land = useMemo(() => (size && L ? landPaths(size, L) : null), [size, L]);
  const stars = useMemo(() => (size && L ? starsFor(size, L) : null), [size, L]);
  const lines = useMemo(() => (size && L ? strands(size, L) : null), [size, L]);
  const visibleAgents = useMemo(() => (size ? AGENTS.filter((a) => !a.minWidth || size.w >= a.minWidth) : []), [size]);

  const markUser = useCallback(() => {
    lastUser.current = performance.now();
    setAutoId(null);
  }, []);

  /* Bấm ra ngoài / Esc ⇒ đóng bong bóng. */
  useEffect(() => {
    if (!sel) return;
    const down = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest?.('.aw-agent')) setSel(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSel(null);
    };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('keydown', key);
    };
  }, [sel, pinnedId]);

  /* Bộ máy: khởi tạo vị trí + vòng lặp. */
  useEffect(() => {
    if (!size || !L) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const { w, h } = size;
    const gTop = h - L.ground;
    const now0 = performance.now();
    const R = rng(3);

    // Khởi tạo (giữ vị trí cũ nếu đổi cỡ).
    const map = lives.current;
    for (const def of visibleAgents) {
      const rf = refs.current.get(def.id);
      // Chừa mép: nhãn tên rộng hơn nhân vật, đứng sát mép là bị cắt.
      const edge = (L.narrow ? 34 : 44) + L.sprite / 2;
      const rg = (L.narrow && def.narrowRange) || def.range;
      const min = Math.max(edge, rg[0] * w);
      const max = Math.max(min, Math.min(w - edge, rg[1] * w));
      const prev = map.get(def.id);
      const sz = sizeOf(def, L);
      const lift = def.id === 'researcher' ? (L.narrow ? 16 : 22) : 0;
      const laneOff = def.lane === 1 ? (L.narrow ? 8 : 12) : -2;
      const x = prev ? Math.min(max, Math.max(min, prev.x)) : min + (max - min) * (0.3 + 0.4 * R());
      map.set(def.id, {
        def,
        el: rf?.el ?? null,
        flip: rf?.flip ?? null,
        emote: rf?.emote ?? null,
        x,
        tx: x,
        min,
        max,
        dir: prev?.dir ?? (R() < 0.5 ? 1 : -1),
        walking: false,
        until: now0 + 600 + R() * 2400,
        emoteUntil: 0,
        emoteCool: 0,
        headY: gTop - laneOff - sz * (def.id === 'buddy' ? 0.62 : 0.92) - lift,
        ping: 0,
        up: null,
        nextUp: now0 + 2000 + R() * 6000,
        seg: null,
        anim: prev?.anim ?? null,
      });
      prev?.anim?.cancel();
    }
    for (const id of Array.from(map.keys())) if (!visibleAgents.some((a) => a.id === id)) map.delete(id);

    // Code Buddy không vào vòng điều phối tự động: bong bóng code đã là "lời nói" thường trực của nó.
    const order = visibleAgents.filter((a) => !a.seated).map((a) => a.id);
    // CHỈ ghi DOM khi giá trị thật sự đổi. Ghi lại một thuộc tính/inline style dù cùng giá trị vẫn làm trình
    // duyệt tính lại style cả cây SVG bên dưới — đo 10/11: đó là phần lớn chi phí của vòng lặp.
    const written = new Map<Live, { tx: string; flip: string; walk: string }>();
    const apply = (a: Live) => {
      const w0 = written.get(a) ?? { tx: '', flip: '-', walk: '' };
      const tx = `translate3d(${a.x.toFixed(1)}px,0,0)`;
      const flip = a.dir < 0 && !a.def.seated ? 'scaleX(-1)' : '';
      const walk = a.walking ? '1' : '0';
      if (a.el && tx !== w0.tx) a.el.style.transform = tx;
      if (a.flip && flip !== w0.flip) a.flip.style.transform = flip;
      if (a.el && walk !== w0.walk) a.el.dataset.walk = walk;
      written.set(a, { tx, flip, walk });
    };
    map.forEach(apply);

    // Bắt đầu / kết thúc một đoạn đi. Trong lúc đi KHÔNG ghi DOM mỗi khung: animation chạy trên compositor.
    // (Đo 10/11: ghi transform bằng JS mỗi khung làm Chrome xếp lại ~60 lớp compositor mỗi khung — "Layerize"
    // chiếm 1,3 s / 4 s ở CPU chậm 4×.)
    const startWalk = (a: Live, tx: number, now: number) => {
      const dur = (Math.abs(tx - a.x) / a.def.speed) * 1000;
      a.seg = { x0: a.x, x1: tx, t0: now, dur };
      a.tx = tx;
      a.walking = true;
      a.dir = tx > a.x ? 1 : -1;
      apply(a);
      a.anim?.cancel();
      a.anim =
        a.el?.animate([{ transform: `translate3d(${a.x.toFixed(1)}px,0,0)` }, { transform: `translate3d(${tx.toFixed(1)}px,0,0)` }], {
          duration: dur,
          easing: 'linear',
          fill: 'forwards',
        }) ?? null;
    };
    const endWalk = (a: Live) => {
      a.seg = null;
      a.walking = false;
      written.delete(a); // buộc ghi lại vị trí cuối vào inline style TRƯỚC khi bỏ animation (không giật)
      apply(a);
      a.anim?.cancel();
      a.anim = null;
    };
    const segX = (a: Live, now: number) => {
      const g = a.seg!;
      const p = Math.min(1, (now - g.t0) / g.dur);
      return g.x0 + (g.x1 - g.x0) * p;
    };

    // Canvas theo DPR.
    // Dây nối chỉ là nét mảnh: DPR 1,5 trên màn hẹp là đủ nét mà đỡ 44% số điểm ảnh phải xoá/vẽ mỗi lần.
    const dpr = Math.min(L.narrow ? 1.5 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let rgb = '139, 108, 255';
    let base = 0.2;
    let starRgb = '255, 247, 220';
    let starOp = 1;
    let halo = 0.3;
    const readTheme = () => {
      const cs = getComputedStyle(root);
      rgb = cs.getPropertyValue('--aw-link-rgb').trim() || rgb;
      base = parseFloat(cs.getPropertyValue('--aw-link-base')) || base;
      starRgb = cs.getPropertyValue('--aw-star-rgb').trim() || starRgb;
      starOp = parseFloat(cs.getPropertyValue('--aw-star-op')) || starOp;
      halo = parseFloat(cs.getPropertyValue('--aw-bulb-halo')) || halo;
    };
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const hub = L.hub;
    const ctrl = (a: Live) => ({ x: hub.x + (a.x - hub.x) * 0.62, y: hub.y + (a.headY - hub.y) * 0.18 });
    const at = (a: Live, t: number) => {
      const c = ctrl(a);
      const u = 1 - t;
      return { x: u * u * hub.x + 2 * u * t * c.x + t * t * a.x, y: u * u * hub.y + 2 * u * t * c.y + t * t * a.headY };
    };
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    // Lượt "điều phối": lõi CuongMini gửi một gói xuống một agent, gói tới nơi thì agent nói.
    let dispatch: { id: AgentKind; t0: number } | null = null;
    let nextSpot = now0 + 1400;
    let autoUntil = 0;
    let spotIdx = 0;
    let autoCur: AgentKind | null = null;
    const setAuto = (id: AgentKind | null) => {
      autoCur = id;
      setAutoId(id);
    };

    /* ── Hiệu ứng nhỏ vẽ chung lên canvas (thay cho ~25 phần tử HTML animate riêng — mỗi cái là một lớp
       compositor). Sao nhấp nháy theo 4 nhóm lệch pha, bóng đèn chạy đuổi 3 nhóm, đom đóm, tia lửa, khói. ── */
    const moonBox = L.narrow
      ? { x: w * 0.07 - 20, y: h * 0.43 - 20, r: w * 0.07 + 13 * 1.6 * L.px + 20, b: h * 0.43 + 13 * 1.6 * L.px + 20 }
      : { x: w * 0.55 - 30, y: h * 0.09 - 30, r: w * 0.55 + 13 * 1.9 * L.px + 30, b: h * 0.09 + 13 * 1.9 * L.px + 30 };
    const starGroups = (stars ?? []).map((g) => g.filter((st) => st.x < moonBox.x || st.x > moonBox.r || st.y < moonBox.y || st.y > moonBox.b));
    const STAR_PERIOD = [4.8, 5.6, 4.2, 6.4];
    const BULB_RGB = ['255, 236, 170', '255, 176, 176', '170, 232, 242', '214, 196, 255'];
    const bulbGroups = lines?.bulbGroups ?? [];
    const fr = rng(5);
    const flies = Array.from({ length: L.narrow ? 5 : 9 }, (_, i) => ({
      x: w * (0.08 + ((i * 37) % 86) / 100),
      y: gTop - 14 - ((i * 23) % 70),
      per: 9 + (i % 3) * 2,
      ph: fr() * 10,
    }));
    const fireX = w * 0.535;
    const sparkY = gTop + L.px - 9 * L.px;
    const chimX = w * 0.445 + (17 - 10.5) * 1.2 * L.px;
    const chimY = gTop + L.px - 17 * 1.2 * L.px;
    const drawFx = (t: number, still: boolean) => {
      for (let g = 0; g < starGroups.length; g++) {
        const k = still ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t * 2 * Math.PI) / STAR_PERIOD[g] + g * 1.7));
        ctx.fillStyle = `rgba(${starRgb}, ${(starOp * k).toFixed(3)})`;
        for (const st of starGroups[g]) ctx.fillRect(st.x, st.y, st.s, st.s);
      }
      for (let g = 0; g < bulbGroups.length; g++) {
        const k = still ? 0.8 : 0.45 + 0.55 * Math.max(0, Math.sin((t * 2 * Math.PI) / 2.4 - (g * 2 * Math.PI) / 3));
        for (let i = 0; i < bulbGroups[g].length; i++) {
          const b = bulbGroups[g][i];
          const c = BULB_RGB[(i + g) % 4];
          ctx.fillStyle = `rgba(255, 228, 160, ${(halo * k).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${c}, ${(0.35 + 0.65 * k).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (still) return;
      for (const f of flies) {
        const u = ((t + f.ph) % f.per) / f.per;
        const a = u < 0.2 ? u / 0.2 : u > 0.9 ? (1 - u) / 0.1 : 0.55 + 0.45 * Math.sin(u * 14);
        const x = f.x + 26 * Math.sin(u * Math.PI * 2);
        const y = f.y - 34 * Math.sin(u * Math.PI);
        ctx.fillStyle = `rgba(214, 245, 120, ${(0.22 * a).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(236, 252, 160, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 3; i++) {
        const u = ((t + i * 0.6) % 1.8) / 1.8;
        const a = u < 0.15 ? u / 0.15 : 1 - u;
        ctx.fillStyle = `rgba(255, 240, 170, ${a.toFixed(3)})`;
        ctx.fillRect(fireX + (i - 1) * 6 + 6 * u, sparkY - 46 * u, L.px, L.px);
      }
      for (let i = 0; i < 3; i++) {
        const u = ((t + i * 1.5) % 4.5) / 4.5;
        const a = 0.55 * (u < 0.2 ? u / 0.2 : 1 - u);
        const sz = 2 * L.px * (0.7 + 1.1 * u);
        ctx.fillStyle = `rgba(205, 200, 222, ${a.toFixed(3)})`;
        ctx.fillRect(chimX + 14 * u - sz / 2, chimY - 58 * u - sz, sz, sz);
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const open = openRef.current;
      const t = now / 1000;
      drawFx(t, reduced);
      map.forEach((a) => {
        const c = ctrl(a);
        const hot = open === a.def.id || dispatch?.id === a.def.id;
        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.quadraticCurveTo(c.x, c.y, a.x, a.headY);
        if (hot) {
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(${rgb}, ${Math.min(0.9, base * 3.2)})`;
          ctx.lineWidth = 1.6;
        } else {
          ctx.setLineDash([2, 6]);
          ctx.lineDashOffset = reduced ? 0 : -t * 14;
          ctx.strokeStyle = `rgba(${rgb}, ${base})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
        // Gói báo cáo nhỏ chạy NGƯỢC lên lõi.
        if (a.up) {
          const p = (now - a.up.t0) / a.up.dur;
          if (p >= 1) a.up = null;
          else {
            const q = at(a, 1 - p);
            ctx.fillStyle = `rgba(${rgb}, 0.75)`;
            ctx.beginPath();
            ctx.arc(q.x, q.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        if (a.ping && now - a.ping < 700) {
          const k = (now - a.ping) / 700;
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(${rgb}, ${0.6 * (1 - k)})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(a.x, a.headY, 4 + k * 18, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      if (dispatch) {
        const a = map.get(dispatch.id);
        const p = Math.min(1, (now - dispatch.t0) / 1000);
        if (a) {
          const q = at(a, ease(p));
          ctx.fillStyle = `rgba(${rgb}, 0.22)`;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 246, 220, 0.95)';
          ctx.beginPath();
          ctx.arc(q.x, q.y, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const showEmote = (a: Live, text: string, now: number) => {
      if (!a.emote) return;
      a.emote.textContent = text;
      a.emote.dataset.on = '1';
      a.emoteUntil = now + 1700;
      a.emoteCool = now + 7000;
    };

    const tick = (now: number) => {
      const open = openRef.current;
      map.forEach((a) => {
        if (a.emoteUntil && now > a.emoteUntil) {
          a.emoteUntil = 0;
          if (a.emote) a.emote.dataset.on = '0';
        }
        if (open === a.def.id) {
          if (a.walking) {
            a.x = segX(a, now);
            endWalk(a);
          }
          a.until = now + 1200;
          return;
        }
        if (a.def.seated) {
          // Code Buddy ngồi gõ phím — phần "gõ" nằm ở CodeBubble (gọi ngay dưới vòng tick).
        } else if (!a.walking && now > a.until) {
          // Chọn đích mới, tránh đứng chồng lên bạn cùng hàng.
          let tx = a.x;
          for (let k = 0; k < 5; k++) {
            tx = a.min + Math.random() * (a.max - a.min);
            const clash = Array.from(map.values()).some((o) => o !== a && o.def.lane === a.def.lane && Math.abs(o.x - tx) < 46);
            if (Math.abs(tx - a.x) > 30 && !clash) break;
          }
          startWalk(a, tx, now);
        }
        if (a.walking && a.seg) {
          a.x = segX(a, now);
          if (now - a.seg.t0 >= a.seg.dur) {
            a.x = a.seg.x1;
            endWalk(a);
            a.until = now + 1600 + Math.random() * 4200;
            // Gặp bạn ở gần ⇒ quay mặt vào nhau, chào một câu.
            if (now > a.emoteCool) {
              let near: Live | null = null;
              map.forEach((o) => {
                if (o !== a && !o.walking && o.def.id !== open && Math.abs(o.x - a.x) < 90 && now > o.emoteCool) near = o;
              });
              const b = near as Live | null;
              if (b && Math.random() < 0.7) {
                a.dir = b.x > a.x ? 1 : -1;
                b.dir = a.x > b.x ? 1 : -1;
                apply(b);
                showEmote(a, EMOTES[Math.floor(Math.random() * EMOTES.length)], now);
                window.setTimeout(() => showEmote(b, EMOTES[Math.floor(Math.random() * EMOTES.length)], performance.now()), 520);
                b.until = Math.max(b.until, now + 2200);
              }
            }
          }
        }
        if (!a.up && now > a.nextUp) {
          a.up = { t0: now, dur: 2200 + Math.random() * 1200 };
          a.nextUp = now + 5000 + Math.random() * 7000;
        }
      });

      // Điều phối tự động: tạm dừng khi người dùng đang tương tác.
      const userBusy = now - lastUser.current < 8000 || (open !== null && open !== autoCur);
      if (dispatch) {
        if (now - dispatch.t0 >= 1000) {
          const a = map.get(dispatch.id);
          if (a) a.ping = now;
          if (!userBusy) {
            setAuto(dispatch.id);
            autoUntil = now + 4600;
          }
          dispatch = null;
        }
      } else if (autoUntil && now > autoUntil) {
        autoUntil = 0;
        setAuto(null);
        nextSpot = now + 2600;
      } else if (!autoUntil && !userBusy && now > nextSpot && order.length) {
        const id = order[spotIdx++ % order.length];
        dispatch = { id, t0: now };
      }
    };

    let raf = 0;
    let running = false;
    let frame = 0;
    const loop = (now: number) => {
      tick(now);
      codeRef.current?.tick(now);
      // Canvas dây nối vẽ 30 khung/giây (nét đứt trôi chậm + gói dữ liệu — mắt không phân biệt được với 60),
      // còn nhân vật vẫn di chuyển mượt 60 khung/giây.
      if ((frame++ & 1) === 0) draw(now);
      raf = requestAnimationFrame(loop);
    };
    // Khinh khí cầu: một animation compositor. Màn rộng chỉ lượn qua lại ở nửa phải (nửa trái là chữ);
    // màn hẹp bay ngang hẳn qua phía dưới chữ rồi vòng lại.
    let balloonAnim: Animation | null = null;
    const bEl = balloonRef.current;
    if (bEl && !reduced) {
      balloonAnim = L.narrow
        ? bEl.animate([{ transform: 'translate3d(-80px,0,0)' }, { transform: `translate3d(${w + 80}px,0,0)` }], {
            duration: ((w + 160) / 9) * 1000,
            iterations: Infinity,
            easing: 'linear',
          })
        : bEl.animate([{ transform: `translate3d(${(w * 0.52).toFixed(0)}px,0,0)` }, { transform: `translate3d(${(w * 0.95).toFixed(0)}px,0,0)` }], {
            duration: 66000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out',
          });
      balloonAnim.currentTime = 20000;
    }

    const start = () => {
      if (running || reduced) return;
      running = true;
      root.removeAttribute('data-paused');
      balloonAnim?.play();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      root.setAttribute('data-paused', '');
      balloonAnim?.pause();
    };

    if (reduced) {
      // Một khung tĩnh: nhân vật ở giữa khoảng của mình, khinh khí cầu đứng yên.
      map.forEach((a) => {
        a.x = (a.min + a.max) / 2;
        a.walking = false;
        apply(a);
      });
      if (balloonRef.current) balloonRef.current.style.transform = `translate3d(${(w * 0.62).toFixed(0)}px,0,0)`;
      draw(now0);
      const redraw = () => draw(performance.now());
      const id = window.setInterval(redraw, 250); // chỉ để dây sáng theo bong bóng đang mở, không chuyển động
      return () => {
        window.clearInterval(id);
        mo.disconnect();
      };
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '80px' });
    io.observe(root);
    return () => {
      io.disconnect();
      mo.disconnect();
      stop();
      balloonAnim?.cancel();
      map.forEach((a) => a.anim?.cancel());
    };
    // visibleAgents phụ thuộc size ⇒ đủ để khởi tạo lại khi đổi cỡ.
  }, [size, L, visibleAgents, reduced, stars, lines]);

  const wave = (id: AgentKind) => {
    const el = refs.current.get(id)?.el;
    if (!el) return;
    el.classList.remove('aw-waving');
    void el.offsetWidth; // chạy lại animation vẫy tay
    el.classList.add('aw-waving');
    window.setTimeout(() => el.classList.remove('aw-waving'), 1400);
  };

  const bubbleShift = (id: AgentKind) => {
    const a = lives.current.get(id);
    if (!a || !size) return 0;
    const bw = size.w < 640 ? 210 : 240;
    const left = a.x - bw / 2;
    const right = a.x + bw / 2;
    if (left < 10) return 10 - left;
    if (right > size.w - 10) return size.w - 10 - right;
    return 0;
  };

  // Bong bóng code của Code Buddy nhường chỗ khi có bong bóng gợi ý mở ở gần (hoặc của chính nó).
  const codeHidden = (() => {
    if (!openId || !size || !L) return false;
    if (openId === 'buddy' || L.narrow) return true;
    const o = lives.current.get(openId);
    const b = lives.current.get('buddy');
    return !!o && !!b && o.x > b.x - 150;
  })();
  // Neo mép trái bong bóng code lệch sang phải đầu Buddy (né bong bóng của CuongMini bên trái), kẹp trong sân khấu.
  const codeShift = () => {
    const b = lives.current.get('buddy');
    if (!b || !size || !L) return 0;
    const bw = L.narrow ? Math.min(300, size.w - 20) : 340;
    const want = L.narrow ? -bw / 2 : -36;
    const left = b.x + want;
    const clamped = Math.min(Math.max(left, 10), size.w - 10 - bw);
    return clamped - b.x;
  };

  return (
    <div ref={rootRef} className="aw-scene" data-narrow={L?.narrow ? '' : undefined} aria-label={copy.scene} role="group">
      <WorldDefs />
      {size && L && land && stars && lines && (
        <>
          {/* Bầu trời */}
          <div className="aw-sky-layer" aria-hidden>
            <div className="aw-shoot" />
            <div
              className="aw-moon"
              style={L.narrow ? { left: '7%', top: `${(size.h * 0.43).toFixed(0)}px` } : { left: '55%', top: `${(size.h * 0.09).toFixed(0)}px` }}
            >
              <span className="aw-moon-glow" />
              <Pix art={MOON} scale={L.narrow ? 1.6 : 1.9} />
            </div>
            <div ref={balloonRef} className="aw-balloon" style={{ top: `${(size.h * (L.narrow ? 0.52 : 0.34)).toFixed(0)}px` }}>
              <div className="aw-balloon-sway">
                <Pix art={BALLOON} scale={L.narrow ? 0.9 : 1.15} />
              </div>
            </div>
          </div>

          {/* Đồi xa + đồi gần + mặt đất (tĩnh) */}
          <svg className="aw-land" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} shapeRendering="crispEdges" aria-hidden>
            <path d={land.far} className="aw-c-hill-far" />
            {land.lights.map((p, i) => (
              <rect key={i} x={p.x} y={p.y} width={L.px} height={L.px} className="aw-c-win aw-far-light" style={{ animationDelay: `${(i * 0.7).toFixed(1)}s` }} />
            ))}
            <path d={land.mid} className="aw-c-hill-mid" />
            <rect x="0" y={land.gTop} width={size.w} height={L.ground} className="aw-c-dirt" />
            <rect x="0" y={land.gTop} width={size.w} height={L.px * 2} className="aw-c-grass" />
            <path d={land.tufts} className="aw-c-grass" />
            <path d={land.specks} className="aw-c-dirt-d" />
            <rect x="0" y={land.gTop} width={size.w} height={L.px} className="aw-c-snow" />
          </svg>

          {/* Dây cờ + dây đèn */}
          <svg className="aw-bunting" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden>
            <path d={lines.flagRope} className="aw-rope" />
            <path d={lines.bulbRope} className="aw-rope" />
            {lines.pennants.map((p, i) => (
              <path key={i} d={`M${p.x - 6} ${p.y}L${p.x + 6} ${p.y}L${p.x} ${p.y + 13}Z`} className={`aw-flag aw-flag-${p.c}`} shapeRendering="crispEdges" />
            ))}
          </svg>

          {/* Lõi CuongMini trên trời + dây nối (canvas) */}
          <canvas ref={canvasRef} className="aw-links" style={{ width: size.w, height: size.h }} aria-hidden />
          <div className="aw-hub" style={{ left: L.hub.x, top: L.hub.y }} aria-hidden>
            <span className="aw-hub-halo" />
            <span className="aw-hub-ring" />
            <span className="aw-hub-orbit">
              <span />
            </span>
            <svg className="aw-hub-core" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="aw-hub-g" cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#d9ccff" />
                  <stop offset="100%" stopColor="#7c5cff" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="15" fill="url(#aw-hub-g)" />
              <path d="M20 12 C22 7 27 4.5 32 4.5 C30.5 9.5 26 12.5 20 12 Z" fill="#5a3ee6" opacity="0.9" />
              <circle cx="15" cy="21" r="2.1" fill="#2a2640" />
              <circle cx="25" cy="21" r="2.1" fill="#2a2640" />
              <path d="M17.6 26 Q20 28 22.4 26" stroke="#2a2640" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Đạo cụ */}
          {PROPS.filter((p) => !p.minWidth || size.w >= p.minWidth).map((p, i) => (
            <div
              key={i}
              className={`aw-prop${p.back ? ' aw-prop-back' : ''}${p.extra ? ` aw-prop-${p.extra}` : ''}`}
              style={{ left: `${p.x * 100}%`, bottom: L.ground - L.px }}
              aria-hidden
            >
              {p.extra === 'lamp' && <span className="aw-lamp-glow" />}
              {p.extra === 'fire' && (
                <>
                  <span className="aw-fire-glow" />
                  <span className="aw-flames">
                    <Pix art={FLAME_A} className="aw-flame aw-flame-a" />
                    <Pix art={FLAME_B} className="aw-flame aw-flame-b" />
                  </span>
                </>
              )}
              <Pix art={p.art} scale={p.scale} />
            </div>
          ))}

          {/* Cư dân */}
          {visibleAgents.map((a) => {
            const open = openId === a.id;
            const sz = sizeOf(a, L);
            const shift = open ? bubbleShift(a.id) : 0;
            return (
              <div
                key={a.id}
                ref={(el) => {
                  const r = refs.current.get(a.id) ?? { el: null, flip: null, emote: null };
                  r.el = el;
                  refs.current.set(a.id, r);
                  const live = lives.current.get(a.id);
                  if (live) live.el = el;
                }}
                className={`aw-agent aw-agent-${a.id}`}
                data-lane={a.lane}
                data-open={open ? '' : undefined}
                style={{ '--sz': `${sz}px`, '--accent': a.accent, bottom: a.lane === 1 ? L.ground + (L.narrow ? 8 : 12) : L.ground - 2 } as React.CSSProperties}
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  markUser();
                  setSel((cur) => (cur?.pinned ? cur : { id: a.id, pinned: false }));
                  wave(a.id);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  setSel((cur) => (cur && !cur.pinned && cur.id === a.id ? null : cur));
                }}
                onFocus={(e) => {
                  // Chỉ focus BÀN PHÍM mới mở (focus do bấm chuột đã có onClick lo).
                  if (!(e.target as Element).matches?.(':focus-visible')) return;
                  markUser();
                  setSel((cur) => (cur?.pinned && cur.id !== a.id ? cur : { id: a.id, pinned: cur?.pinned ?? false }));
                }}
                onBlur={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                  setSel((cur) => (cur && !cur.pinned && cur.id === a.id ? null : cur));
                }}
              >
                {open && (
                  <div className="aw-bubble" style={{ '--shift': `${shift}px` } as React.CSSProperties} role="note">
                    <p className="aw-bubble-place">
                      <span className="aw-bubble-dot" aria-hidden />
                      {a.place[vi ? 'vi' : 'en']}
                    </p>
                    <p className="aw-bubble-tip">{a.tip[vi ? 'vi' : 'en']}</p>
                    <Link href={a.href} className="aw-bubble-link">
                      {copy.open(a.place[vi ? 'vi' : 'en'])} <span aria-hidden>→</span>
                    </Link>
                  </div>
                )}
                {a.id === 'buddy' && (
                  <CodeBubble
                    ref={codeRef}
                    snippets={L.narrow ? SNIPPETS_NARROW : SNIPPETS_WIDE}
                    still={reduced}
                    hidden={codeHidden}
                    shift={codeShift()}
                  />
                )}
                <span
                  className="aw-emote"
                  aria-hidden
                  ref={(el) => {
                    const r = refs.current.get(a.id) ?? { el: null, flip: null, emote: null };
                    r.emote = el;
                    refs.current.set(a.id, r);
                    const live = lives.current.get(a.id);
                    if (live) live.emote = el;
                  }}
                />
                <button
                  type="button"
                  className="aw-hit"
                  aria-expanded={open}
                  aria-label={copy.talk(a.name, a.place[vi ? 'vi' : 'en'])}
                  onClick={() => {
                    markUser();
                    wave(a.id);
                    setSel((cur) => (cur?.id === a.id && cur.pinned ? null : { id: a.id, pinned: true }));
                  }}
                >
                  <span className="aw-shadow" aria-hidden />
                  <span
                    className="aw-flip"
                    ref={(el) => {
                      const r = refs.current.get(a.id) ?? { el: null, flip: null, emote: null };
                      r.flip = el;
                      refs.current.set(a.id, r);
                      const live = lives.current.get(a.id);
                      if (live) live.flip = el;
                    }}
                  >
                    <span className="aw-body">
                      <AgentSprite kind={a.id} accent={a.accent} />
                    </span>
                  </span>
                  {a.id === 'translator' && (
                    <span className="aw-chip" aria-hidden>
                      <i>A</i>
                      <i>あ</i>
                      <i>文</i>
                    </span>
                  )}
                  <span className="aw-name">{a.name}</span>
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
