/**
 * Trình vẽ PANEL — nửa thứ hai của sân khấu.
 *
 * `canvasRenderer.ts` vẽ sơ đồ mạng: hộp, dây, gói tin chạy. File này vẽ mọi
 * thứ KHÔNG phải sơ đồ mạng: ngăn xếp lời gọi, hàng đợi microtask, khung mã
 * có con trỏ dòng, đồng hồ đo mức đệm, biểu đồ cột/đường, cây phụ thuộc,
 * bảng và cửa sổ log.
 *
 * Hai trình vẽ dùng CHUNG `drawKit.ts` (góc bo, ngắt dòng, bảng font) nên
 * hai nửa của studio trông như một, và dùng chung quy ước tất định: mọi hoạt
 * ảnh chỉ phụ thuộc `frame`, `stepIndex` và `stepProgress`.
 *
 * HOẠT ẢNH SUY RA, KHÔNG KHAI BÁO
 * -------------------------------
 * Kịch bản không bao giờ viết "trượt vào từ bên phải trong 300ms". Nó chỉ
 * nói `{ op: 'push', item }`. Trình vẽ so `item.bornStep` với bước đang chạy:
 * bằng nhau thì phần tử đang SINH RA, vẽ nó trượt + hiện dần theo
 * `stepProgress`. Tương tự, `diedStep` khiến phần tử mờ đi rồi biến mất.
 * Nhờ vậy một kịch bản 40 bước chỉ là 40 dòng mô tả trạng thái, không phải
 * 40 đoạn mô tả chuyển động — và tua ngược vẫn đúng.
 */

import {
  MONO,
  SANS,
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  ellipsize,
  formatNumber,
  rgba,
  roundRect,
} from './drawKit';
import { CANVAS_W, GRAPH_BOTTOM, GRAPH_TOP } from './layout';
import { MAIN_LANE, type ItemTone, type PanelRuntime, type PanelSpec, type PanelState, type RuntimeItem } from './panels';
import { STAGE_COLORS } from './theme';
import type { Lang } from './types';
import { tr } from './types';

/* ────────────────────────────────────────────────────────────
   BẢNG MÀU & HÌNH HỌC
   ──────────────────────────────────────────────────────────── */

const TONE_COLORS: Record<ItemTone, string> = {
  idle: '#7f92b4',
  active: '#38bdf8',
  ok: '#34d399',
  warn: '#f59e0b',
  err: '#f43f5e',
  info: '#818cf8',
  muted: '#4a5a78',
};

/** Lề trái/phải của vùng panel trong khung 1920px. */
const MARGIN_X = 46;
/** Đệm trong panel, tính từ viền. */
const PAD = 18;
/** Chiều cao thanh tiêu đề của panel (0 khi panel không có tiêu đề). */
const HEAD_H = 46;

export interface PanelRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Hệ soạn thảo 1000 × 560 → pixel. Giống hệt quy ước của node trong
 * `layout.ts`, nhưng KHÔNG tự co giãn theo hộp bao: panel được đặt tay, và
 * việc chúng nằm đúng chỗ đã đặt là điều kiện để hai panel cạnh nhau thẳng hàng.
 */
export function panelRect(spec: PanelSpec): PanelRect {
  const availW = CANVAS_W - MARGIN_X * 2;
  const availH = GRAPH_BOTTOM - GRAPH_TOP;
  return {
    x: MARGIN_X + (spec.x / 1000) * availW,
    y: GRAPH_TOP + (spec.y / 560) * availH,
    w: (spec.w / 1000) * availW,
    h: (spec.h / 560) * availH,
  };
}

export interface PanelFrame {
  panels: PanelSpec[];
  state: PanelState;
  stepIndex: number;
  stepProgress: number;
  frame: number;
  lang: Lang;
  /** Màu chủ đạo của kịch bản — panel không khai accent riêng thì lấy màu này. */
  accent: string;
}

/** Tiến độ xuất hiện của phần tử sinh ra ở bước hiện tại (nhanh hơn bước một chút). */
function bornProgress(item: RuntimeItem, f: PanelFrame): number {
  if (item.bornStep !== f.stepIndex) return 1;
  return easeOutCubic(clamp01(f.stepProgress * 1.7));
}

/** Độ mờ của phần tử đang rời đi. */
function dyingAlpha(item: RuntimeItem, f: PanelFrame): number {
  if (item.diedStep !== f.stepIndex) return 0;
  return 1 - easeOutCubic(clamp01(f.stepProgress * 1.5));
}

function toneOf(item: { tone?: ItemTone }, accent: string): string {
  if (!item.tone) return accent;
  return item.tone === 'active' ? accent : TONE_COLORS[item.tone];
}

/* ────────────────────────────────────────────────────────────
   VỎ PANEL
   ──────────────────────────────────────────────────────────── */

/** Vẽ khung + tiêu đề, trả về vùng LÒNG panel để phần thân vẽ vào. */
function drawShell(ctx: CanvasRenderingContext2D, spec: PanelSpec, f: PanelFrame): PanelRect {
  const r = panelRect(spec);
  const accent = spec.accent ?? f.accent;

  ctx.fillStyle = 'rgba(9, 14, 27, 0.82)';
  roundRect(ctx, r.x, r.y, r.w, r.h, 18);
  ctx.fill();

  ctx.strokeStyle = rgba(accent, 0.26);
  ctx.lineWidth = 2;
  roundRect(ctx, r.x, r.y, r.w, r.h, 18);
  ctx.stroke();

  let top = r.y + PAD;
  if (spec.title) {
    // Vạch màu dựng đứng bên trái tiêu đề: rẻ hơn một icon, và trên video nén
    // nó vẫn nhận ra được trong khi icon 18px thì nhoè.
    ctx.fillStyle = accent;
    roundRect(ctx, r.x + PAD, r.y + 17, 4, 20, 2);
    ctx.fill();

    ctx.font = `700 21px ${SANS}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = STAGE_COLORS.textPrimary;
    ctx.fillText(ellipsize(ctx, tr(spec.title, f.lang), r.w - PAD * 2 - 20), r.x + PAD + 16, r.y + 28);

    if (spec.hint) {
      ctx.font = `500 15px ${SANS}`;
      ctx.fillStyle = STAGE_COLORS.textMuted;
      ctx.textAlign = 'right';
      ctx.fillText(ellipsize(ctx, tr(spec.hint, f.lang), r.w * 0.5), r.x + r.w - PAD, r.y + 28);
      ctx.textAlign = 'left';
    }
    top = r.y + HEAD_H;
  }

  return { x: r.x + PAD, y: top, w: r.w - PAD * 2, h: r.y + r.h - PAD - top };
}

/* ────────────────────────────────────────────────────────────
   KHUNG MÃ NGUỒN
   ──────────────────────────────────────────────────────────── */

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'await', 'async',
  'new', 'class', 'import', 'export', 'from', 'default', 'try', 'catch', 'finally', 'throw',
  'typeof', 'instanceof', 'this', 'null', 'undefined', 'true', 'false', 'process', 'require',
  'setTimeout', 'setInterval', 'setImmediate', 'Promise', 'then',
]);

const CODE_COLORS = {
  plain: '#c9d6ef',
  keyword: '#c084fc',
  string: '#86efac',
  number: '#fbbf24',
  comment: '#5d6d8c',
  punct: '#7f92b4',
};

/**
 * Tô màu cú pháp ở mức "đủ để mắt bám được", không phải một trình phân tích
 * thật. Nó chỉ cần phân biệt từ khoá / chuỗi / số / chú thích: đó là bốn thứ
 * người xem dùng để định vị khi đang nhìn một khung mã 12 dòng trên video.
 */
function drawCodeLine(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, dim: number) {
  let i = 0;
  let cursor = x;
  const put = (chunk: string, color: string) => {
    ctx.fillStyle = rgba(color, dim);
    ctx.fillText(chunk, cursor, y);
    cursor += ctx.measureText(chunk).width;
  };

  while (i < text.length) {
    const rest = text.slice(i);

    const comment = rest.match(/^\/\/.*/);
    if (comment) {
      put(comment[0], CODE_COLORS.comment);
      break;
    }

    const str = rest.match(/^(['"`])(?:\\.|(?!\1)[^\\])*\1?/);
    if (str) {
      put(str[0], CODE_COLORS.string);
      i += str[0].length;
      continue;
    }

    const word = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
    if (word) {
      put(word[0], JS_KEYWORDS.has(word[0]) ? CODE_COLORS.keyword : CODE_COLORS.plain);
      i += word[0].length;
      continue;
    }

    const num = rest.match(/^\d[\d_.]*/);
    if (num) {
      put(num[0], CODE_COLORS.number);
      i += num[0].length;
      continue;
    }

    const punct = rest.match(/^[^A-Za-z0-9_$'"`]+/);
    if (punct) {
      put(punct[0], CODE_COLORS.punct);
      i += punct[0].length;
      continue;
    }

    put(rest[0], CODE_COLORS.plain);
    i += 1;
  }
}

function drawCodePanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'code' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const n = Math.max(1, spec.lines.length);
  const start = spec.startLine ?? 1;
  const gutterW = 44;

  // Cỡ chữ tự co theo CẢ HAI CHIỀU.
  //
  // Co theo chiều cao là hiển nhiên. Co theo chiều NGANG mới là chỗ dễ quên:
  // `setTimeout(() => console.log('[5] timeout 0'), 0);` dài 50 ký tự, ở cỡ
  // chữ vừa khít chiều cao thì nó chạy quá mép panel và bị vùng cắt xén mất
  // đuôi — người xem thấy một dòng mã cụt, tệ hơn hẳn một dòng mã nhỏ.
  // measureText tỉ lệ tuyến tính với cỡ chữ ở cùng một font, nên đo một lần
  // rồi nhân tỉ lệ là ra cỡ đúng, không cần dò dần.
  const lineH = Math.min(34, body.h / n);
  let fs = Math.max(12, Math.min(23, lineH * 0.66));
  ctx.font = `500 ${Math.round(fs)}px ${MONO}`;
  let widest = 0;
  for (const l of spec.lines) widest = Math.max(widest, ctx.measureText(l).width);
  const avail = body.w - gutterW - 14;
  if (widest > avail) fs = Math.max(10, (fs * avail) / widest);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  for (let i = 0; i < spec.lines.length; i++) {
    const y = body.y + lineH * i + lineH / 2;
    const on = rt.lines.includes(start + i);

    if (on) {
      // Nền dòng đang chạy: nhịp thở nhẹ để mắt bắt được ngay cả khi ảnh tĩnh
      // bị nén thành khung khoá.
      const pulse = 0.13 + 0.05 * Math.sin(f.frame * 0.11);
      ctx.fillStyle = rgba(accent, pulse);
      roundRect(ctx, body.x - 6, y - lineH / 2 + 1, body.w + 12, lineH - 2, 7);
      ctx.fill();
      ctx.fillStyle = accent;
      roundRect(ctx, body.x - 6, y - lineH / 2 + 1, 3, lineH - 2, 2);
      ctx.fill();
    }

    ctx.font = `500 ${Math.round(fs * 0.82)}px ${MONO}`;
    ctx.fillStyle = on ? rgba(accent, 0.9) : 'rgba(93, 109, 140, 0.75)';
    ctx.textAlign = 'right';
    ctx.fillText(String(start + i), body.x + gutterW - 14, y);
    ctx.textAlign = 'left';

    ctx.font = `500 ${Math.round(fs)}px ${MONO}`;
    drawCodeLine(ctx, spec.lines[i], body.x + gutterW, y, on ? 1 : 0.62);
  }
}

/* ────────────────────────────────────────────────────────────
   NGĂN XẾP
   ──────────────────────────────────────────────────────────── */

function drawStackPanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'stack' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const items = rt.items[MAIN_LANE] ?? [];
  const dying = rt.leaving.filter((it) => it.diedStep === f.stepIndex);
  const floorH = 34;
  // Bốn ô trống là đủ để ngăn xếp không nhảy cỡ liên tục, mà khung vẫn đủ
  // cao (>40px) để dòng phụ — 'process.nextTick', 'check phase' — hiện ra.
  const slots = Math.max(4, items.length + dying.length);
  const frameH = Math.min(74, (body.h - floorH - 10) / slots);
  const baseY = body.y + body.h - floorH - 8;

  // Đáy ngăn xếp.
  ctx.font = `600 15px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(93, 109, 140, 0.9)';
  ctx.fillText(
    spec.floor ? tr(spec.floor, f.lang) : f.lang === 'vi' ? '— đáy ngăn xếp —' : '— stack floor —',
    body.x + body.w / 2,
    body.y + body.h - floorH / 2
  );
  ctx.strokeStyle = 'rgba(93, 109, 140, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(body.x, baseY + 4);
  ctx.lineTo(body.x + body.w, baseY + 4);
  ctx.stroke();

  const drawFrameBox = (item: RuntimeItem, index: number, alpha: number, slide: number) => {
    const color = toneOf(item, accent);
    const h = frameH - 8;
    const y = baseY - (index + 1) * frameH + 4 + slide;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = rgba(color, 0.14);
    roundRect(ctx, body.x, y, body.w, h, 10);
    ctx.fill();
    ctx.strokeStyle = rgba(color, 0.62);
    ctx.lineWidth = 2;
    roundRect(ctx, body.x, y, body.w, h, 10);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const hasSub = !!item.sub && h > 40;
    ctx.font = `700 ${Math.round(Math.min(21, h * 0.42))}px ${MONO}`;
    ctx.fillStyle = color;
    ctx.fillText(ellipsize(ctx, item.label, body.w - 28), body.x + 14, hasSub ? y + h * 0.36 : y + h / 2);
    if (hasSub) {
      ctx.font = `500 ${Math.round(Math.min(15, h * 0.28))}px ${SANS}`;
      ctx.fillStyle = STAGE_COLORS.textMuted;
      ctx.fillText(ellipsize(ctx, item.sub as string, body.w - 28), body.x + 14, y + h * 0.72);
    }
    ctx.globalAlpha = 1;
  };

  items.forEach((item, i) => {
    const p = bornProgress(item, f);
    // Khung mới rơi từ trên xuống chỗ của nó — đúng chiều của một lời gọi
    // được đẩy lên đỉnh ngăn xếp.
    drawFrameBox(item, i, p, (1 - p) * -38);
  });

  // Khung vừa bị lấy ra: bay lên và mờ đi, ngay phía trên đỉnh hiện tại.
  dying.forEach((item, i) => {
    const a = dyingAlpha(item, f);
    if (a <= 0.01) return;
    drawFrameBox(item, items.length + i, a * 0.85, (1 - a) * -30);
  });
}

/* ────────────────────────────────────────────────────────────
   LÀN / HÀNG ĐỢI
   ──────────────────────────────────────────────────────────── */

function drawChip(
  ctx: CanvasRenderingContext2D,
  item: RuntimeItem,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  alpha: number
) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = rgba(color, 0.16);
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = rgba(color, 0.7);
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 8);
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const hasSub = !!item.sub && h > 44;
  ctx.font = `700 ${Math.round(Math.min(19, h * 0.4))}px ${MONO}`;
  ctx.fillStyle = color;
  ctx.fillText(ellipsize(ctx, item.label, w - 14), x + w / 2, hasSub ? y + h * 0.37 : y + h / 2);
  if (hasSub) {
    ctx.font = `500 ${Math.round(Math.min(14, h * 0.26))}px ${SANS}`;
    ctx.fillStyle = STAGE_COLORS.textSecondary;
    ctx.fillText(ellipsize(ctx, item.sub as string, w - 12), x + w / 2, y + h * 0.72);
  }
  if (item.badge) {
    ctx.font = `700 12px ${SANS}`;
    ctx.fillStyle = rgba(color, 0.95);
    ctx.textAlign = 'right';
    ctx.fillText(item.badge, x + w - 6, y + 11);
  }
  ctx.globalAlpha = 1;
}

function drawLanesPanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'lanes' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const cols = spec.layout === 'cols';
  const n = spec.lanes.length || 1;

  spec.lanes.forEach((lane, li) => {
    const laneAccent = lane.accent ?? accent;
    const on = rt.active === lane.id;
    const items = rt.items[lane.id] ?? [];
    const dying = rt.leaving.filter((it) => it.diedStep === f.stepIndex && it.lane === lane.id);

    const box: PanelRect = cols
      ? { x: body.x + (body.w / n) * li + 5, y: body.y, w: body.w / n - 10, h: body.h }
      : { x: body.x, y: body.y + (body.h / n) * li + 4, w: body.w, h: body.h / n - 8 };

    // Nền làn — làn đang hoạt động sáng lên và có quầng.
    ctx.fillStyle = on ? rgba(laneAccent, 0.1) : 'rgba(255,255,255,0.022)';
    roundRect(ctx, box.x, box.y, box.w, box.h, 10);
    ctx.fill();
    if (on) {
      ctx.strokeStyle = rgba(laneAccent, 0.55 + 0.14 * Math.sin(f.frame * 0.1));
      ctx.lineWidth = 2;
      roundRect(ctx, box.x, box.y, box.w, box.h, 10);
      ctx.stroke();
    }

    // Nhãn làn: hàng ngang thì nằm cột trái, cột dọc thì nằm trên đỉnh.
    ctx.textBaseline = 'middle';
    ctx.fillStyle = on ? laneAccent : STAGE_COLORS.textSecondary;
    let track: PanelRect;

    if (cols) {
      ctx.textAlign = 'center';
      ctx.font = `700 ${Math.round(Math.min(17, box.w * 0.13))}px ${SANS}`;
      ctx.fillText(ellipsize(ctx, lane.label, box.w - 10), box.x + box.w / 2, box.y + 17);
      if (lane.sub) {
        ctx.font = `500 13px ${SANS}`;
        ctx.fillStyle = STAGE_COLORS.textMuted;
        ctx.fillText(ellipsize(ctx, tr(lane.sub, f.lang), box.w - 10), box.x + box.w / 2, box.y + 36);
      }
      track = { x: box.x + 6, y: box.y + (lane.sub ? 48 : 30), w: box.w - 12, h: box.h - (lane.sub ? 54 : 36) };
    } else {
      const labelW = Math.min(210, box.w * 0.24);
      ctx.textAlign = 'left';
      ctx.font = `700 ${Math.round(Math.min(18, box.h * 0.3))}px ${SANS}`;
      ctx.fillText(ellipsize(ctx, lane.label, labelW - 12), box.x + 12, lane.sub ? box.y + box.h * 0.37 : box.y + box.h / 2);
      if (lane.sub) {
        ctx.font = `500 13px ${SANS}`;
        ctx.fillStyle = STAGE_COLORS.textMuted;
        ctx.fillText(ellipsize(ctx, tr(lane.sub, f.lang), labelW - 12), box.x + 12, box.y + box.h * 0.72);
      }
      track = { x: box.x + labelW, y: box.y + 6, w: box.w - labelW - 10, h: box.h - 12 };
    }

    // Chip trong làn.
    if (cols) {
      // Cột: xếp chồng từ ĐÁY lên — giống một chồng việc đang chờ.
      const slotH = Math.min(56, track.h / Math.max(4, items.length));
      items.forEach((item, i) => {
        const p = bornProgress(item, f);
        const y = track.y + track.h - (i + 1) * slotH + 4;
        drawChip(ctx, item, track.x, y + (1 - p) * -26, track.w, slotH - 8, toneOf(item, laneAccent), p);
      });
      dying.forEach((item) => {
        const a = dyingAlpha(item, f);
        if (a <= 0.01) return;
        const y = track.y + track.h - (items.length + 1) * slotH + 4;
        drawChip(ctx, item, track.x, y - (1 - a) * 24, track.w, slotH - 8, toneOf(item, laneAccent), a * 0.8);
      });
    } else {
      // Hàng: FIFO chạy từ TRÁI (đầu hàng, sắp được phục vụ) sang phải.
      const slotW = Math.min(190, Math.max(96, track.w / Math.max(4, items.length + dying.length)));
      const chipH = Math.min(56, track.h);
      const cy = track.y + (track.h - chipH) / 2;
      // Phần tử đang rời đi chiếm chỗ đầu hàng, phần tử còn lại dồn lên sau nó.
      const shift = dying.length > 0 ? (1 - dyingAlpha(dying[0], f)) : 0;
      dying.forEach((item, i) => {
        const a = dyingAlpha(item, f);
        if (a <= 0.01) return;
        drawChip(ctx, item, track.x + i * slotW - (1 - a) * 46, cy, slotW - 10, chipH, toneOf(item, laneAccent), a * 0.8);
      });
      items.forEach((item, i) => {
        const p = bornProgress(item, f);
        const slotIndex = i + dying.length * (1 - shift);
        const x = track.x + slotIndex * slotW + (1 - p) * 54;
        if (x > track.x + track.w) return; // tràn làn thì thôi, không vẽ đè ra ngoài
        drawChip(ctx, item, x, cy, slotW - 10, chipH, toneOf(item, laneAccent), p);
      });
    }
  });
}

/* ────────────────────────────────────────────────────────────
   ĐỒNG HỒ ĐO
   ──────────────────────────────────────────────────────────── */

/** Giá trị đang hiển thị: nội suy prev → value trong đúng bước gây ra thay đổi. */
function meterNow(v: { value: number; prev: number; bornStep: number } | undefined, f: PanelFrame): number {
  if (!v) return 0;
  if (v.bornStep !== f.stepIndex) return v.value;
  return v.prev + (v.value - v.prev) * easeInOutCubic(clamp01(f.stepProgress));
}

function drawMeterPanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'meter' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const n = spec.meters.length || 1;
  const rowH = body.h / n;

  spec.meters.forEach((m, i) => {
    const stored = rt.values[m.id];
    const value = meterNow(stored, f);
    const ratio = clamp01(m.max > 0 ? value / m.max : 0);
    const color = stored?.tone ? toneOf({ tone: stored.tone }, m.accent ?? accent) : m.accent ?? accent;
    const y = body.y + rowH * i;
    const barY = y + rowH * 0.52;
    const barH = Math.min(26, rowH * 0.3);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = `600 ${Math.round(Math.min(18, rowH * 0.24))}px ${SANS}`;
    ctx.fillStyle = STAGE_COLORS.textSecondary;
    ctx.fillText(ellipsize(ctx, m.label, body.w * 0.6), body.x, y + rowH * 0.26);

    ctx.textAlign = 'right';
    ctx.font = `700 ${Math.round(Math.min(24, rowH * 0.3))}px ${MONO}`;
    ctx.fillStyle = color;
    const readout = stored?.label ?? `${formatNumber(value)}${m.unit ? ` ${m.unit}` : ''}`;
    ctx.fillText(readout, body.x + body.w, y + rowH * 0.26);

    // Máng.
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRect(ctx, body.x, barY, body.w, barH, barH / 2);
    ctx.fill();

    // Mức.
    if (ratio > 0.002) {
      ctx.fillStyle = rgba(color, 0.85);
      roundRect(ctx, body.x, barY, Math.max(barH, body.w * ratio), barH, barH / 2);
      ctx.fill();
    }

    // Vạch ngưỡng — highWaterMark, trần heap, giới hạn pool.
    if (m.threshold !== undefined && m.max > 0) {
      const tx = body.x + body.w * clamp01(m.threshold / m.max);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(tx, barY - 7);
      ctx.lineTo(tx, barY + barH + 7);
      ctx.stroke();
      ctx.setLineDash([]);
      if (m.thresholdLabel) {
        ctx.font = `600 12px ${SANS}`;
        ctx.fillStyle = 'rgba(244, 63, 94, 0.95)';
        ctx.textAlign = tx > body.x + body.w * 0.75 ? 'right' : 'left';
        ctx.fillText(m.thresholdLabel, tx + (tx > body.x + body.w * 0.75 ? -6 : 6), barY + barH + 16);
      }
    }
  });
}

/* ────────────────────────────────────────────────────────────
   BIỂU ĐỒ
   ──────────────────────────────────────────────────────────── */

function drawChartPanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'chart' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const axisColor = 'rgba(120, 150, 205, 0.3)';
  const plot: PanelRect = {
    x: body.x + 62,
    y: body.y + 8,
    w: body.w - 74,
    h: body.h - 40,
  };

  // Trục.
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(plot.x, plot.y);
  ctx.lineTo(plot.x, plot.y + plot.h);
  ctx.lineTo(plot.x + plot.w, plot.y + plot.h);
  ctx.stroke();

  if (spec.mode === 'bar') {
    const entries = Object.entries(rt.values);
    if (entries.length === 0) return;
    const shown = entries.map(([k, v]) => ({ key: k, v, now: meterNow(v, f) }));
    const max = spec.max ?? (Math.max(...shown.map((s) => Math.max(s.v.value, s.now))) * 1.15 || 1);
    const slot = plot.w / shown.length;
    const barW = Math.min(96, slot * 0.6);

    // Lưới ngang + nhãn trục Y.
    ctx.font = `500 13px ${MONO}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    for (let g = 0; g <= 2; g++) {
      const gy = plot.y + plot.h - (plot.h * g) / 2;
      ctx.strokeStyle = 'rgba(120, 150, 205, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plot.x, gy);
      ctx.lineTo(plot.x + plot.w, gy);
      ctx.stroke();
      ctx.fillStyle = STAGE_COLORS.textMuted;
      ctx.fillText(formatNumber((max * g) / 2), plot.x - 8, gy);
    }

    shown.forEach((s, i) => {
      const color = s.v.tone ? toneOf({ tone: s.v.tone }, accent) : accent;
      const h = Math.max(0, (s.now / max) * plot.h);
      const x = plot.x + slot * i + (slot - barW) / 2;
      const y = plot.y + plot.h - h;

      ctx.fillStyle = rgba(color, 0.75);
      roundRect(ctx, x, y, barW, h, 6);
      ctx.fill();
      ctx.strokeStyle = rgba(color, 0.95);
      ctx.lineWidth = 2;
      roundRect(ctx, x, y, barW, h, 6);
      ctx.stroke();

      // Số đo ngay trên đỉnh cột: bài học của chương 16 NẰM ở con số, không
      // phải ở chiều cao cột.
      ctx.textAlign = 'center';
      ctx.font = `700 16px ${MONO}`;
      ctx.fillStyle = color;
      ctx.fillText(s.v.label ?? formatNumber(s.now), x + barW / 2, y - 13);

      ctx.font = `600 14px ${SANS}`;
      ctx.fillStyle = STAGE_COLORS.textSecondary;
      ctx.fillText(ellipsize(ctx, s.key, slot - 6), x + barW / 2, plot.y + plot.h + 18);
    });
    return;
  }

  // ── Biểu đồ đường ──────────────────────────────────────────
  const series = spec.series ?? [];
  const all = series.flatMap((s) => rt.points[s.id] ?? []);
  if (all.length === 0) return;
  const maxY = spec.max ?? (Math.max(...all.map((p) => p.y)) * 1.15 || 1);
  const maxX = spec.xMax ?? (Math.max(...all.map((p) => p.x)) || 1);

  ctx.font = `500 13px ${MONO}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'right';
  for (let g = 0; g <= 2; g++) {
    const gy = plot.y + plot.h - (plot.h * g) / 2;
    ctx.strokeStyle = 'rgba(120, 150, 205, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plot.x, gy);
    ctx.lineTo(plot.x + plot.w, gy);
    ctx.stroke();
    ctx.fillStyle = STAGE_COLORS.textMuted;
    ctx.fillText(formatNumber((maxY * g) / 2), plot.x - 8, gy);
  }

  const px = (x: number) => plot.x + (clamp01(x / maxX)) * plot.w;
  const py = (y: number) => plot.y + plot.h - clamp01(y / maxY) * plot.h;

  series.forEach((s) => {
    const pts = rt.points[s.id] ?? [];
    if (pts.length === 0) return;
    const color = s.accent ?? accent;

    // Đoạn cuối cùng mọc dần trong bước đang chạy, nên đường vẽ ra như đang
    // được đo thời gian thực chứ không nhảy cóc.
    const grow = easeOutCubic(clamp01(f.stepProgress));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(px(pts[0].x), py(pts[0].y));
    for (let i = 1; i < pts.length; i++) {
      const last = i === pts.length - 1;
      const a = pts[i - 1];
      const b = pts[i];
      const tx = last ? a.x + (b.x - a.x) * grow : b.x;
      const ty = last ? a.y + (b.y - a.y) * grow : b.y;
      ctx.lineTo(px(tx), py(ty));
    }
    ctx.stroke();

    // Chấm đầu đường + nhãn tên chuỗi.
    const tail = pts[pts.length - 1];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px(tail.x), py(tail.y), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `700 14px ${SANS}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.label, Math.min(px(tail.x) + 10, plot.x + plot.w - 90), py(tail.y) - 12);
  });

  if (spec.xLabel) {
    ctx.font = `500 13px ${SANS}`;
    ctx.fillStyle = STAGE_COLORS.textMuted;
    ctx.textAlign = 'right';
    ctx.fillText(tr(spec.xLabel, f.lang), plot.x + plot.w, plot.y + plot.h + 18);
  }
}

/* ────────────────────────────────────────────────────────────
   CÂY
   ──────────────────────────────────────────────────────────── */

function drawTreePanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'tree' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const items = rt.items[MAIN_LANE] ?? [];
  if (items.length === 0) return;
  const rowH = Math.min(40, body.h / Math.max(1, items.length));
  const indent = 30;

  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const p = bornProgress(item, f);
    const depth = item.depth ?? 0;
    const y = body.y + rowH * i + rowH / 2;
    const x = body.x + depth * indent;
    const color = toneOf(item, accent);

    ctx.globalAlpha = p;

    // Đường nối chữ L tới nhánh cha.
    if (depth > 0) {
      ctx.strokeStyle = 'rgba(120, 150, 205, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - indent + 9, y - rowH);
      ctx.lineTo(x - indent + 9, y);
      ctx.lineTo(x - 4, y);
      ctx.stroke();
    }

    ctx.font = `600 ${Math.round(Math.min(18, rowH * 0.48))}px ${MONO}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    const label = ellipsize(ctx, item.label, body.w - (x - body.x) - 130);
    ctx.fillText(label, x + 4, y);

    if (item.sub) {
      const w = ctx.measureText(label).width;
      ctx.font = `500 ${Math.round(Math.min(15, rowH * 0.38))}px ${SANS}`;
      ctx.fillStyle = STAGE_COLORS.textMuted;
      ctx.fillText(ellipsize(ctx, item.sub, 220), x + 14 + w, y);
    }

    if (item.badge) {
      ctx.font = `700 13px ${MONO}`;
      ctx.fillStyle = rgba(color, 0.95);
      ctx.textAlign = 'right';
      ctx.fillText(item.badge, body.x + body.w, y);
    }

    ctx.globalAlpha = 1;
  });
}

/* ────────────────────────────────────────────────────────────
   BẢNG
   ──────────────────────────────────────────────────────────── */

function drawTablePanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'table' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const rows = rt.items[MAIN_LANE] ?? [];
  const headH = 32;
  const rowH = Math.min(44, (body.h - headH) / Math.max(1, rows.length || 1));

  const totalFlex = spec.columns.reduce((s, c) => s + (c.flex ?? 1), 0);
  let cx = body.x;
  const colX: number[] = [];
  const colW: number[] = [];
  for (const c of spec.columns) {
    const w = (body.w * (c.flex ?? 1)) / totalFlex;
    colX.push(cx);
    colW.push(w);
    cx += w;
  }

  // Đầu bảng.
  ctx.textBaseline = 'middle';
  ctx.font = `700 14px ${SANS}`;
  spec.columns.forEach((c, i) => {
    ctx.textAlign = c.align === 'right' ? 'right' : 'left';
    ctx.fillStyle = STAGE_COLORS.textMuted;
    ctx.fillText(
      ellipsize(ctx, c.label.toUpperCase(), colW[i] - 12),
      c.align === 'right' ? colX[i] + colW[i] - 8 : colX[i] + 4,
      body.y + headH / 2
    );
  });
  ctx.strokeStyle = 'rgba(120, 150, 205, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(body.x, body.y + headH - 4);
  ctx.lineTo(body.x + body.w, body.y + headH - 4);
  ctx.stroke();

  rows.forEach((row, ri) => {
    const p = bornProgress(row, f);
    const y = body.y + headH + rowH * ri;
    const color = toneOf(row, accent);
    const on = rt.active === row.key;

    ctx.globalAlpha = p;
    if (on || row.tone) {
      ctx.fillStyle = rgba(color, on ? 0.16 : 0.07);
      roundRect(ctx, body.x - 6, y + 2, body.w + 12, rowH - 4, 7);
      ctx.fill();
    }

    const cells = row.cells ?? [row.label];
    spec.columns.forEach((c, ci) => {
      ctx.textAlign = c.align === 'right' ? 'right' : 'left';
      ctx.font = `${ci === 0 ? 600 : 500} ${Math.round(Math.min(17, rowH * 0.42))}px ${ci === 0 ? SANS : MONO}`;
      ctx.fillStyle = ci === 0 ? (row.tone ? color : STAGE_COLORS.textPrimary) : rgba(color, 0.95);
      const text = cells[ci] ?? '';
      ctx.fillText(
        ellipsize(ctx, text, colW[ci] - 12),
        c.align === 'right' ? colX[ci] + colW[ci] - 8 : colX[ci] + 4,
        y + rowH / 2
      );
    });
    ctx.globalAlpha = 1;
  });
}

/* ────────────────────────────────────────────────────────────
   CỬA SỔ LOG
   ──────────────────────────────────────────────────────────── */

function drawLogPanel(
  ctx: CanvasRenderingContext2D,
  spec: Extract<PanelSpec, { kind: 'log' }>,
  rt: PanelRuntime,
  body: PanelRect,
  f: PanelFrame
) {
  const accent = spec.accent ?? f.accent;
  const lineH = 27;
  const cap = spec.maxLines ?? Math.max(1, Math.floor(body.h / lineH));
  const all = rt.items[MAIN_LANE] ?? [];
  const lines = all.slice(Math.max(0, all.length - cap));

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = `500 17px ${MONO}`;

  lines.forEach((item, i) => {
    const p = bornProgress(item, f);
    const y = body.y + lineH * i + lineH / 2;
    const color = toneOf(item, accent);
    ctx.globalAlpha = p;
    ctx.fillStyle = rgba(color, 0.55);
    ctx.fillText('›', body.x, y);
    ctx.fillStyle = item.tone ? color : 'rgba(201, 214, 239, 0.92)';
    ctx.fillText(ellipsize(ctx, item.label, body.w - 24), body.x + 18, y);
    ctx.globalAlpha = 1;
  });

  // Con trỏ nhấp nháy dưới dòng cuối — dấu hiệu "tiến trình còn sống".
  const cy = body.y + lineH * lines.length + lineH / 2;
  if (cy < body.y + body.h && Math.floor(f.frame / 24) % 2 === 0) {
    ctx.fillStyle = rgba(accent, 0.8);
    ctx.fillRect(body.x + 18, cy - 8, 10, 17);
  }
}

/* ────────────────────────────────────────────────────────────
   HÀM VẼ CHÍNH
   ──────────────────────────────────────────────────────────── */

export function drawPanels(ctx: CanvasRenderingContext2D, f: PanelFrame) {
  for (const spec of f.panels) {
    const rt = f.state[spec.id];
    if (!rt) continue;
    const body = drawShell(ctx, spec, f);

    // Cắt theo lòng panel: một hàng đợi dài hay một khung mã cao hơn chỗ được
    // cấp sẽ bị xén gọn thay vì tràn đè lên panel bên cạnh.
    ctx.save();
    roundRect(ctx, body.x - PAD + 4, body.y - 4, body.w + PAD * 2 - 8, body.h + 8, 12);
    ctx.clip();

    switch (spec.kind) {
      case 'code':
        drawCodePanel(ctx, spec, rt, body, f);
        break;
      case 'stack':
        drawStackPanel(ctx, spec, rt, body, f);
        break;
      case 'lanes':
        drawLanesPanel(ctx, spec, rt, body, f);
        break;
      case 'meter':
        drawMeterPanel(ctx, spec, rt, body, f);
        break;
      case 'chart':
        drawChartPanel(ctx, spec, rt, body, f);
        break;
      case 'tree':
        drawTreePanel(ctx, spec, rt, body, f);
        break;
      case 'table':
        drawTablePanel(ctx, spec, rt, body, f);
        break;
      case 'log':
        drawLogPanel(ctx, spec, rt, body, f);
        break;
    }

    ctx.restore();
    // Canvas 2D là máy trạng thái: trả textAlign/baseline về mặc định sau MỖI
    // panel. Quên một lần thì mọi chữ vẽ sau đó bị canh sai — đã trả giá đúng
    // lỗi này ở `drawEdge`.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = 1;
  }
}
