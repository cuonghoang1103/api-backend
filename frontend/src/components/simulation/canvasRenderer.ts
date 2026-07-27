/**
 * Trình vẽ canvas 2D — trái tim của studio.
 *
 * VÌ SAO LÀ CANVAS CHỨ KHÔNG PHẢI SVG/DOM
 * ---------------------------------------
 * `HTMLMediaElement.captureStream()` chỉ tồn tại trên <canvas> (và <video>).
 * SVG hay DOM dù đẹp đến đâu cũng KHÔNG có API nào lấy ra được MediaStream —
 * muốn quay thì phải nhờ `getDisplayMedia()`, tức là bắt người dạy bấm chọn
 * cửa sổ mỗi lần, dính luôn thanh trình duyệt vào video, và không chạy được
 * headless. Vẽ mọi thứ lên canvas là điều kiện tiên quyết để nút "Quay" hoạt
 * động thật và để Playwright dựng video hàng loạt.
 *
 * TÍNH TẤT ĐỊNH
 * -------------
 * Mọi hoạt ảnh trong file này chỉ phụ thuộc hai đại lượng: `frame` (số khung
 * đã vẽ, tăng đúng 1 mỗi lần) và `stepProgress` (tiến độ trong bước hiện
 * tại). Không có `Math.random()`, không có `Date.now()`, không đọc giờ hệ
 * thống ở bất kỳ đâu. Cùng một (kịch bản, tuỳ chọn, số khung) luôn cho ra
 * đúng cùng một khung hình — điều kiện bắt buộc để render lại video 84 bài
 * học mà không bị lệch.
 *
 * Nhiễu "ngẫu nhiên" (hạt bụi nền, rung khi lỗi) được sinh bằng hàm băm số
 * nguyên `hash01()` bên dưới: trông ngẫu nhiên nhưng hoàn toàn lặp lại được.
 */

import { CANVAS_H, CANVAS_W, CAPTION_H, GRAPH_BOTTOM, GRAPH_TOP, pointOnEdge, quadPoint, tAtDistance, type EdgeGeom, type NodeBox } from './layout';
import { FLOW_STYLES, NODE_STYLES, STAGE_COLORS, statusColor } from './theme';
import type { Lang, NodeKind, NodeState, Scenario, SimStep } from './types';
import { tr } from './types';

/* ────────────────────────────────────────────────────────────
   TIỆN ÍCH TẤT ĐỊNH
   ──────────────────────────────────────────────────────────── */

/** Băm số nguyên → [0,1). Thay cho Math.random() ở mọi nơi cần "nhiễu". */
function hash01(n: number): number {
  let h = (n ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;
const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Chuyển hex → rgba với alpha cho trước (canvas không nhận hex 8 số ở mọi engine). */
function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

/** Ngắt dòng theo bề rộng thật đo bằng ctx.measureText. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && line && lines[maxLines - 1] !== line) {
    // Thêm dấu … khi phải cắt bớt.
    let last = lines[maxLines - 1];
    while (last.length > 4 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

/* ────────────────────────────────────────────────────────────
   TRẠNG THÁI MỘT KHUNG HÌNH
   ──────────────────────────────────────────────────────────── */

export interface FrameState {
  scenario: Scenario;
  steps: SimStep[];
  stepIndex: number;
  /** Tiến độ 0..1 bên trong bước hiện tại. */
  stepProgress: number;
  /** Trạng thái node cộng dồn từ bước 0 tới bước hiện tại. */
  nodeStates: Record<string, NodeState>;
  lang: Lang;
  /** Số khung đã vẽ. Nguồn thời gian DUY NHẤT của mọi hoạt ảnh nền. */
  frame: number;
  showCaption: boolean;
  showLegend: boolean;
  /** Nhãn tuỳ chọn đang chọn, hiện ở tiêu đề (ví dụ "POST · 201"). */
  variantLabel: string;
  finished: boolean;
}

/* ────────────────────────────────────────────────────────────
   NỀN
   ──────────────────────────────────────────────────────────── */

function drawBackground(ctx: CanvasRenderingContext2D, frame: number, accent: string) {
  // Nền chuyển sắc: sáng nhẹ ở giữa trên, tối dần ra rìa.
  const bg = ctx.createRadialGradient(CANVAS_W * 0.5, CANVAS_H * 0.34, 80, CANVAS_W * 0.5, CANVAS_H * 0.5, CANVAS_W * 0.78);
  bg.addColorStop(0, STAGE_COLORS.bgInner);
  bg.addColorStop(1, STAGE_COLORS.bgOuter);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Lưới kỹ thuật.
  ctx.lineWidth = 1;
  for (let x = 0; x <= CANVAS_W; x += 60) {
    ctx.strokeStyle = x % 240 === 0 ? STAGE_COLORS.gridMajor : STAGE_COLORS.grid;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, CANVAS_H);
    ctx.stroke();
  }
  for (let y = 0; y <= CANVAS_H; y += 60) {
    ctx.strokeStyle = y % 240 === 0 ? STAGE_COLORS.gridMajor : STAGE_COLORS.grid;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(CANVAS_W, y + 0.5);
    ctx.stroke();
  }

  // Bụi sao: vị trí cố định theo chỉ số (hash), chỉ độ sáng thở theo frame.
  for (let i = 0; i < 90; i++) {
    const x = hash01(i * 7 + 1) * CANVAS_W;
    const y = hash01(i * 13 + 5) * GRAPH_BOTTOM;
    const phase = hash01(i * 29 + 3) * Math.PI * 2;
    const alpha = 0.10 + 0.16 * (0.5 + 0.5 * Math.sin(frame * 0.02 + phase));
    ctx.fillStyle = rgba(accent, alpha);
    ctx.fillRect(x, y, 2, 2);
  }

  // Quầng sáng chủ đạo phía trên, rất mờ — tạo chiều sâu kiểu cyberpunk.
  const halo = ctx.createRadialGradient(CANVAS_W / 2, 40, 0, CANVAS_W / 2, 40, 780);
  halo.addColorStop(0, rgba(accent, 0.13));
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, CANVAS_W, 700);
}

/* ────────────────────────────────────────────────────────────
   BIỂU TƯỢNG NODE (vẽ tay bằng path — không nạp asset ngoài,
   đúng yêu cầu CSP default-src 'self')
   ──────────────────────────────────────────────────────────── */

function drawGlyph(ctx: CanvasRenderingContext2D, kind: NodeKind, x: number, y: number, s: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const u = s / 2; // nửa cạnh

  switch (kind) {
    case 'client': {
      // Cửa sổ trình duyệt
      ctx.strokeRect(-u, -u * 0.8, s, s * 0.8);
      ctx.beginPath();
      ctx.moveTo(-u, -u * 0.8 + 9);
      ctx.lineTo(u, -u * 0.8 + 9);
      ctx.stroke();
      for (let i = 0; i < 3; i++) ctx.fillRect(-u + 5 + i * 7, -u * 0.8 + 3.5, 3.5, 3.5);
      break;
    }
    case 'edge': {
      // Đám mây biên
      ctx.beginPath();
      ctx.arc(-u * 0.45, 2, u * 0.46, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(-u * 0.05, -u * 0.28, u * 0.5, Math.PI, Math.PI * 2);
      ctx.arc(u * 0.5, 2, u * 0.42, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'gateway': {
      // Khiên
      ctx.beginPath();
      ctx.moveTo(0, -u);
      ctx.lineTo(u * 0.85, -u * 0.55);
      ctx.lineTo(u * 0.85, u * 0.15);
      ctx.quadraticCurveTo(u * 0.85, u * 0.85, 0, u);
      ctx.quadraticCurveTo(-u * 0.85, u * 0.85, -u * 0.85, u * 0.15);
      ctx.lineTo(-u * 0.85, -u * 0.55);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'server': {
      // Rack 3 tầng
      for (let i = 0; i < 3; i++) {
        const ry = -u + i * (s / 3) + 2;
        ctx.strokeRect(-u, ry, s, s / 3 - 4);
        ctx.beginPath();
        ctx.arc(-u + 9, ry + s / 6 - 2, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'cache': {
      // Tia sét
      ctx.beginPath();
      ctx.moveTo(u * 0.28, -u);
      ctx.lineTo(-u * 0.42, u * 0.12);
      ctx.lineTo(u * 0.02, u * 0.12);
      ctx.lineTo(-u * 0.26, u);
      ctx.lineTo(u * 0.46, -u * 0.16);
      ctx.lineTo(u * 0.02, -u * 0.16);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case 'db':
    case 'index': {
      // Trụ CSDL
      ctx.beginPath();
      ctx.ellipse(0, -u * 0.62, u * 0.86, u * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-u * 0.86, -u * 0.62);
      ctx.lineTo(-u * 0.86, u * 0.6);
      ctx.ellipse(0, u * 0.6, u * 0.86, u * 0.3, 0, Math.PI, Math.PI * 2, true);
      ctx.lineTo(u * 0.86, -u * 0.62);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, u * 0.86, u * 0.3, 0, 0, Math.PI);
      ctx.stroke();
      break;
    }
    case 'queue': {
      // Ba khối xếp hàng
      for (let i = 0; i < 3; i++) {
        ctx.strokeRect(-u + i * (s / 3) + 2, -u * 0.5, s / 3 - 6, s * 0.5);
      }
      ctx.beginPath();
      ctx.moveTo(-u, u * 0.82);
      ctx.lineTo(u, u * 0.82);
      ctx.stroke();
      break;
    }
    case 'worker': {
      // Bánh răng
      ctx.beginPath();
      ctx.arc(0, 0, u * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * u * 0.58, Math.sin(a) * u * 0.58);
        ctx.lineTo(Math.cos(a) * u * 0.92, Math.sin(a) * u * 0.92);
        ctx.stroke();
      }
      break;
    }
    case 'auth': {
      // Chìa khoá
      ctx.beginPath();
      ctx.arc(-u * 0.4, -u * 0.36, u * 0.34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-u * 0.18, -u * 0.14);
      ctx.lineTo(u * 0.72, u * 0.76);
      ctx.moveTo(u * 0.42, u * 0.46);
      ctx.lineTo(u * 0.66, u * 0.22);
      ctx.moveTo(u * 0.6, u * 0.64);
      ctx.lineTo(u * 0.84, u * 0.4);
      ctx.stroke();
      break;
    }
    case 'socket': {
      // Sóng phát
      ctx.beginPath();
      ctx.arc(0, u * 0.42, u * 0.2, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 1; i <= 3; i++) {
        ctx.globalAlpha = 1 - i * 0.22;
        ctx.beginPath();
        ctx.arc(0, u * 0.42, u * 0.34 * i, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
  }
  ctx.restore();
}

/* ────────────────────────────────────────────────────────────
   NODE
   ──────────────────────────────────────────────────────────── */

function drawNode(
  ctx: CanvasRenderingContext2D,
  box: NodeBox,
  state: NodeState,
  st: FrameState
) {
  const style = NODE_STYLES[box.node.kind];
  const color = style.color;
  const isIdle = state === 'idle';

  // Rung khi lỗi: chỉ rung ở đầu bước rồi tắt dần — tất định theo stepProgress.
  let shakeX = 0;
  if (state === 'error') {
    const decay = Math.max(0, 1 - st.stepProgress * 2.6);
    shakeX = Math.sin(st.frame * 0.85) * 7 * decay;
  }

  ctx.save();
  ctx.translate(shakeX, 0);

  const stateColor =
    state === 'error' ? '#ef4444' : state === 'success' ? '#34d399' : state === 'processing' || state === 'active' ? color : state === 'waiting' ? '#fbbf24' : color;

  // Quầng sáng ngoài khi node đang hoạt động.
  if (!isIdle) {
    const pulse = 0.5 + 0.5 * Math.sin(st.frame * 0.07);
    ctx.shadowColor = rgba(stateColor, 0.55);
    ctx.shadowBlur = 26 + pulse * 22;
  }

  // Thân node.
  const grad = ctx.createLinearGradient(box.left, box.top, box.left, box.top + box.h);
  grad.addColorStop(0, isIdle ? 'rgba(20,26,44,0.86)' : rgba(stateColor, 0.14));
  grad.addColorStop(1, 'rgba(8,11,22,0.94)');
  ctx.fillStyle = grad;
  roundRect(ctx, box.left, box.top, box.w, box.h, 18);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Viền.
  ctx.strokeStyle = isIdle ? rgba(color, 0.28) : rgba(stateColor, 0.95);
  ctx.lineWidth = isIdle ? 1.6 : 2.6;
  roundRect(ctx, box.left, box.top, box.w, box.h, 18);
  ctx.stroke();

  // Vạch màu bên trái — nhận diện loại node bằng màu trước khi đọc chữ.
  ctx.fillStyle = rgba(stateColor, isIdle ? 0.45 : 1);
  roundRect(ctx, box.left, box.top + 16, 4, box.h - 32, 2);
  ctx.fill();

  // Biểu tượng.
  drawGlyph(ctx, box.node.kind, box.left + 46, box.cy - 4, 40, rgba(stateColor, isIdle ? 0.62 : 1));

  // Nhãn loại.
  ctx.font = `600 13px ${MONO}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = rgba(color, isIdle ? 0.5 : 0.85);
  ctx.fillText(style.kindLabel, box.left + 80, box.top + 40);

  // Tên node.
  ctx.font = `700 27px ${SANS}`;
  ctx.fillStyle = isIdle ? 'rgba(226,235,250,0.78)' : '#f2f6ff';
  ctx.fillText(box.node.label, box.left + 80, box.top + 72);

  // Dòng phụ.
  if (box.node.sublabel) {
    ctx.font = `500 16px ${SANS}`;
    ctx.fillStyle = isIdle ? 'rgba(147,164,196,0.62)' : 'rgba(180,197,226,0.92)';
    const sub = tr(box.node.sublabel, st.lang);
    const lines = wrapText(ctx, sub, box.w - 96, 2);
    lines.forEach((l, i) => ctx.fillText(l, box.left + 80, box.top + 100 + i * 21));
  }

  // Đèn trạng thái góc trên phải.
  const dotX = box.left + box.w - 24;
  const dotY = box.top + 24;
  if (state === 'processing') {
    // Vòng xoay xử lý.
    ctx.strokeStyle = stateColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 9, st.frame * 0.14, st.frame * 0.14 + Math.PI * 1.3);
    ctx.stroke();
  } else if (state === 'waiting') {
    // Ba chấm nhấp nháy lệch pha.
    for (let i = 0; i < 3; i++) {
      const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(st.frame * 0.11 - i * 0.9));
      ctx.fillStyle = rgba('#fbbf24', a);
      ctx.beginPath();
      ctx.arc(dotX - 14 + i * 7, dotY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (!isIdle) {
    const pulse = 0.55 + 0.45 * Math.sin(st.frame * 0.12);
    ctx.fillStyle = rgba(stateColor, 0.25 * pulse);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 13 * pulse + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = stateColor;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(120,140,175,0.4)';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vòng "đang làm việc tại chỗ" cho bước không có cạnh (xử lý nội bộ).
  const step = st.steps[st.stepIndex];
  if (step && !step.edge && step.at === box.node.id) {
    const flow = FLOW_STYLES[step.kind];
    // Vòng tiến độ ôm sát hộp node (ellipse bao ngoài) thay vì một vòng tròn
    // to bao trùm — người xem thấy ngay "việc này đang diễn ra Ở ĐÂY".
    const rx = box.w / 2 + 20;
    const ry = box.h / 2 + 20;
    const start = -Math.PI / 2;
    const sweep = easeInOutCubic(clamp01(st.stepProgress)) * Math.PI * 2;
    ctx.strokeStyle = rgba(flow.color, 0.95);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(box.cx, box.cy, rx, ry, 0, start, start + sweep);
    ctx.stroke();
    // Chấm sáng chạy ở đầu vòng.
    const hx = box.cx + Math.cos(start + sweep) * rx;
    const hy = box.cy + Math.sin(start + sweep) * ry;
    ctx.shadowColor = flow.glow;
    ctx.shadowBlur = 24;
    ctx.fillStyle = flow.glow;
    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

/* ────────────────────────────────────────────────────────────
   DÂY MẠNG
   ──────────────────────────────────────────────────────────── */

function strokeEdgePath(ctx: CanvasRenderingContext2D, g: EdgeGeom) {
  ctx.beginPath();
  ctx.moveTo(g.x1, g.y1);
  ctx.quadraticCurveTo(g.cxp, g.cyp, g.x2, g.y2);
}

function drawEdge(ctx: CanvasRenderingContext2D, g: EdgeGeom, active: boolean, st: FrameState) {
  const step = st.steps[st.stepIndex];
  const flow = active && step ? FLOW_STYLES[step.kind] : null;

  // Dây nền.
  ctx.setLineDash(g.edge.ghost ? [10, 12] : []);
  ctx.lineWidth = g.edge.ghost ? 2 : 3.5;
  ctx.strokeStyle = g.edge.ghost ? STAGE_COLORS.wireGhost : STAGE_COLORS.wire;
  strokeEdgePath(ctx, g);
  ctx.stroke();
  ctx.setLineDash([]);

  if (flow) {
    // Tia sáng nền của cạnh đang hoạt động.
    ctx.shadowColor = rgba(flow.color, 0.8);
    ctx.shadowBlur = 20;
    ctx.strokeStyle = rgba(flow.color, 0.34);
    ctx.lineWidth = 6;
    strokeEdgePath(ctx, g);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Vạch đứt chạy dọc dây — cảm giác "dữ liệu đang truyền".
    const dir = step?.reverse ? 1 : -1;
    ctx.setLineDash([16, 22]);
    ctx.lineDashOffset = dir * ((st.frame * 3.2) % 38);
    ctx.strokeStyle = rgba(flow.glow, 0.75);
    ctx.lineWidth = 2.4;
    strokeEdgePath(ctx, g);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  }

  // Nhãn cạnh đặt tại điểm giữa.
  if (g.edge.label) {
    const mid = quadPoint(g.x1, g.y1, g.cxp, g.cyp, g.x2, g.y2, tAtDistance(g, 0.5));
    const text = tr(g.edge.label, st.lang);
    ctx.font = `500 14px ${MONO}`;
    const w = ctx.measureText(text).width + 18;
    ctx.fillStyle = 'rgba(6,9,18,0.86)';
    roundRect(ctx, mid.x - w / 2, mid.y - 12, w, 24, 12);
    ctx.fill();
    ctx.fillStyle = active && flow ? rgba(flow.glow, 0.95) : 'rgba(140,158,190,0.72)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, mid.x, mid.y + 1);
    // Trả canvas về canh trái/alphabetic. Bỏ dòng này là mọi chữ vẽ SAU đó
    // (tên node, phụ đề) bị canh giữa quanh toạ độ x của nó — nửa đầu câu
    // chạy ra ngoài khung hình. Canvas 2D là máy trạng thái: ai đổi thì
    // người đó phải trả lại.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}

/* ────────────────────────────────────────────────────────────
   GÓI TIN
   ──────────────────────────────────────────────────────────── */

function drawPacket(ctx: CanvasRenderingContext2D, g: EdgeGeom, step: SimStep, st: FrameState) {
  const flow = FLOW_STYLES[step.kind];
  // Vào/ra mượt: gói tin tăng tốc rồi giảm tốc, không giật ở hai đầu dây.
  const s = easeInOutCubic(clamp01(st.stepProgress));
  const reverse = !!step.reverse;

  // Đuôi hạt: 7 chấm phía sau, mờ dần.
  for (let i = 7; i >= 1; i--) {
    const trailS = clamp01(s - i * 0.028);
    if (trailS <= 0) continue;
    const p = pointOnEdge(g, trailS, reverse);
    const alpha = (1 - i / 8) * 0.5;
    ctx.fillStyle = rgba(flow.glow, alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7 - i * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  const pos = pointOnEdge(g, s, reverse);

  // Lõi sáng.
  const halo = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 46);
  halo.addColorStop(0, rgba(flow.glow, 0.55));
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 46, 0, Math.PI * 2);
  ctx.fill();

  // Viên "khối JSON": hộp bo góc mang nhãn, luôn nằm ngang cho dễ đọc.
  const label = step.packetLabel ?? step.kind;
  ctx.font = `700 19px ${MONO}`;
  const textW = ctx.measureText(label).width;
  const boxW = textW + 34;
  const boxH = 42;

  ctx.shadowColor = rgba(flow.color, 0.9);
  ctx.shadowBlur = 28;
  const chip = ctx.createLinearGradient(pos.x - boxW / 2, pos.y, pos.x + boxW / 2, pos.y);
  chip.addColorStop(0, rgba(flow.color, 0.95));
  chip.addColorStop(1, rgba(flow.glow, 0.95));
  ctx.fillStyle = chip;
  roundRect(ctx, pos.x - boxW / 2, pos.y - boxH / 2, boxW, boxH, 12);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#05070e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, pos.x, pos.y + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Mũi nhọn chỉ hướng đi.
  const ax = pos.x + Math.cos(pos.angle) * (boxW / 2 + 12);
  const ay = pos.y + Math.sin(pos.angle) * (boxW / 2 + 12);
  ctx.save();
  ctx.translate(ax, ay);
  ctx.rotate(pos.angle);
  ctx.fillStyle = rgba(flow.glow, 0.95);
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-6, -7);
  ctx.lineTo(-6, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ────────────────────────────────────────────────────────────
   ĐẦU TRANG / CHÚ GIẢI / PHỤ ĐỀ
   ──────────────────────────────────────────────────────────── */

function drawHeader(ctx: CanvasRenderingContext2D, st: FrameState) {
  const { scenario } = st;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Vạch nhấn màu kịch bản.
  ctx.fillStyle = scenario.accent;
  roundRect(ctx, 48, 34, 5, 40, 3);
  ctx.fill();

  ctx.font = `700 32px ${SANS}`;
  ctx.fillStyle = STAGE_COLORS.textPrimary;
  ctx.fillText(tr(scenario.name, st.lang), 68, 58);

  if (st.variantLabel) {
    ctx.font = `600 17px ${MONO}`;
    const w = ctx.measureText(st.variantLabel).width + 24;
    const x = 68;
    ctx.fillStyle = rgba(scenario.accent, 0.16);
    roundRect(ctx, x, 66, w, 28, 8);
    ctx.fill();
    ctx.fillStyle = rgba(scenario.accent, 1);
    ctx.fillText(st.variantLabel, x + 12, 85);
  }

  // Thương hiệu góc phải — có mặt trong mọi video xuất ra.
  ctx.textAlign = 'right';
  ctx.font = `700 22px ${SANS}`;
  ctx.fillStyle = 'rgba(226,235,250,0.9)';
  ctx.fillText('cuongthai.com', CANVAS_W - 48, 54);
  ctx.font = `500 15px ${MONO}`;
  ctx.fillStyle = 'rgba(120,140,175,0.75)';
  ctx.fillText('Simulation Studio', CANVAS_W - 48, 78);
  ctx.textAlign = 'left';
}

function drawLegend(ctx: CanvasRenderingContext2D, st: FrameState) {
  // Chỉ hiện những loại luồng THỰC SỰ xuất hiện trong kịch bản đang chạy —
  // chú giải đầy đủ 13 màu chỉ làm rối khung hình.
  const kinds = Array.from(new Set(st.steps.map((s) => s.kind)));
  // Dải chú giải nằm sát mép trên của phụ đề. Đặt thấp hơn nữa là bị chính
  // nền phụ đề (vẽ sau) phủ mất.
  const y = GRAPH_BOTTOM + 8;
  let x = 48;
  ctx.font = `600 15px ${MONO}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const kind of kinds) {
    const flow = FLOW_STYLES[kind];
    const w = ctx.measureText(flow.legend).width;
    if (x + w + 46 > CANVAS_W - 48) break;
    ctx.shadowColor = rgba(flow.color, 0.9);
    ctx.shadowBlur = 10;
    ctx.fillStyle = flow.color;
    ctx.beginPath();
    ctx.arc(x + 6, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(147,164,196,0.9)';
    ctx.fillText(flow.legend, x + 20, y + 1);
    x += w + 46;
  }
  ctx.textBaseline = 'alphabetic';
}

function drawCaption(ctx: CanvasRenderingContext2D, st: FrameState) {
  const step = st.steps[st.stepIndex];
  if (!step) return;
  const top = CANVAS_H - CAPTION_H;
  const flow = FLOW_STYLES[step.kind];

  // Nền phụ đề: chuyển sắc lên trên để không cắt ngang khung hình quá gắt.
  const fade = ctx.createLinearGradient(0, top - 40, 0, top + 40);
  fade.addColorStop(0, 'rgba(4,6,14,0)');
  fade.addColorStop(1, STAGE_COLORS.captionBg);
  ctx.fillStyle = fade;
  ctx.fillRect(0, top - 40, CANVAS_W, 80);
  ctx.fillStyle = STAGE_COLORS.captionBg;
  ctx.fillRect(0, top, CANVAS_W, CAPTION_H);

  // Vạch màu theo loại luồng.
  ctx.fillStyle = flow.color;
  ctx.fillRect(0, top, CANVAS_W, 3);

  const padX = 48;
  let cursorX = padX;
  const chipY = top + 26;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  /** Vẽ một thẻ nhỏ và đẩy con trỏ sang phải. */
  const chip = (text: string, color: string) => {
    ctx.font = `700 16px ${MONO}`;
    const w = ctx.measureText(text).width + 26;
    ctx.fillStyle = rgba(color, 0.15);
    roundRect(ctx, cursorX, chipY, w, 32, 9);
    ctx.fill();
    ctx.strokeStyle = rgba(color, 0.5);
    ctx.lineWidth = 1.2;
    roundRect(ctx, cursorX, chipY, w, 32, 9);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillText(text, cursorX + 13, chipY + 17);
    cursorX += w + 10;
  };

  chip(`${String(st.stepIndex + 1).padStart(2, '0')} / ${String(st.steps.length).padStart(2, '0')}`, '#93a4c4');
  chip(flow.legend, flow.color);
  if (step.status) chip(`HTTP ${step.status}`, statusColor(step.status));
  if (step.latencyMs != null) chip(`${formatLatency(step.latencyMs)}`, '#38bdf8');
  if (step.teachingNote) chip(st.lang === 'vi' ? '★ ĐIỂM DỪNG' : '★ PAUSE POINT', '#fbbf24');

  // Tiêu đề bước.
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 36px ${SANS}`;
  ctx.fillStyle = STAGE_COLORS.textPrimary;
  const titleLines = wrapText(ctx, tr(step.title, st.lang), CANVAS_W - padX * 2, 1);
  ctx.fillText(titleLines[0] ?? '', padX, top + 100);

  // Lời giảng.
  ctx.font = `400 22px ${SANS}`;
  ctx.fillStyle = 'rgba(180,197,226,0.95)';
  const detailLines = wrapText(ctx, tr(step.detail, st.lang), CANVAS_W - padX * 2, 3);
  detailLines.forEach((line, i) => ctx.fillText(line, padX, top + 140 + i * 31));

  // Thanh tiến trình tổng ở đáy khung hình.
  const done = st.steps.slice(0, st.stepIndex).reduce((a, s) => a + s.duration, 0) + step.duration * clamp01(st.stepProgress);
  const total = st.steps.reduce((a, s) => a + s.duration, 0) || 1;
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fillRect(0, CANVAS_H - 6, CANVAS_W, 6);
  const barGrad = ctx.createLinearGradient(0, 0, CANVAS_W, 0);
  barGrad.addColorStop(0, st.scenario.accent);
  barGrad.addColorStop(1, flow.glow);
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, CANVAS_H - 6, CANVAS_W * (done / total), 6);

  // Vạch chia bước — người xem thấy trước còn bao nhiêu chặng.
  let acc = 0;
  ctx.fillStyle = 'rgba(4,6,14,0.85)';
  for (const s of st.steps.slice(0, -1)) {
    acc += s.duration;
    ctx.fillRect((acc / total) * CANVAS_W - 1, CANVAS_H - 6, 2, 6);
  }
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(ms >= 10000 ? 0 : 1)}s`;
  if (ms < 1) return `${ms.toFixed(1)}ms`;
  return `${Math.round(ms)}ms`;
}

/** Màn kết thúc: mờ dần rồi hiện tổng kết — điểm cắt gọn cho video. */
function drawFinishOverlay(ctx: CanvasRenderingContext2D, st: FrameState) {
  const t = easeOutCubic(clamp01(st.stepProgress));
  const a = t * 0.82;
  ctx.fillStyle = `rgba(4,6,14,${a})`;
  ctx.fillRect(0, 0, CANVAS_W, GRAPH_BOTTOM + 60);
  if (t < 0.35) return;

  const cy = GRAPH_TOP + (GRAPH_BOTTOM - GRAPH_TOP) / 2;
  ctx.textAlign = 'center';

  // Tấm nền mờ phía sau chữ: nếu không, tiêu đề kết đè lên node và cả hai
  // cùng khó đọc trên khung hình cuối của video.
  ctx.font = `500 24px ${SANS}`;
  const tagline = tr(st.scenario.tagline, st.lang);
  const tagLines = wrapText(ctx, tagline, 1120, 2);
  const panelH = 118 + tagLines.length * 34;
  ctx.fillStyle = `rgba(6,9,18,${Math.min(0.92, t)})`;
  roundRect(ctx, CANVAS_W / 2 - 620, cy - panelH / 2, 1240, panelH, 22);
  ctx.fill();
  ctx.strokeStyle = rgba(st.scenario.accent, 0.45 * t);
  ctx.lineWidth = 2;
  roundRect(ctx, CANVAS_W / 2 - 620, cy - panelH / 2, 1240, panelH, 22);
  ctx.stroke();

  ctx.font = `700 48px ${SANS}`;
  ctx.fillStyle = rgba(st.scenario.accent, Math.min(1, t * 1.4));
  ctx.fillText(st.lang === 'vi' ? 'Hoàn tất vòng đời' : 'Round trip complete', CANVAS_W / 2, cy - panelH / 2 + 76);

  ctx.font = `500 24px ${SANS}`;
  ctx.fillStyle = `rgba(180,197,226,${Math.min(0.92, t)})`;
  tagLines.forEach((line, i) => ctx.fillText(line, CANVAS_W / 2, cy - panelH / 2 + 122 + i * 34));
  ctx.textAlign = 'left';
}

/* ────────────────────────────────────────────────────────────
   HÀM VẼ CHÍNH
   ──────────────────────────────────────────────────────────── */

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  st: FrameState,
  boxes: Map<string, NodeBox>,
  geoms: Map<string, EdgeGeom>
) {
  const step = st.steps[st.stepIndex];

  drawBackground(ctx, st.frame, st.scenario.accent);
  drawHeader(ctx, st);

  // Dây trước, node sau — node luôn nằm trên dây.
  for (const g of Array.from(geoms.values())) {
    drawEdge(ctx, g, !!step?.edge && step.edge === g.edge.id, st);
  }
  for (const box of Array.from(boxes.values())) {
    drawNode(ctx, box, st.nodeStates[box.node.id] ?? 'idle', st);
  }

  // Gói tin vẽ sau cùng để luôn nổi trên node.
  if (step?.edge) {
    const g = geoms.get(step.edge);
    if (g) drawPacket(ctx, g, step, st);
  }

  if (st.showLegend) drawLegend(ctx, st);
  if (st.finished) drawFinishOverlay(ctx, st);
  if (st.showCaption) drawCaption(ctx, st);
}

/**
 * Trạng thái node cộng dồn tới bước `index`.
 *
 * Phát lại từ bước 0 mỗi lần thay vì giữ state ẩn: nhờ vậy kéo thanh tua tới
 * BẤT KỲ bước nào cũng cho ra đúng trạng thái mà chạy tuần tự sẽ đạt tới.
 * Đây là lý do `build()` bắt buộc phải là hàm thuần.
 */
export function nodeStatesAt(steps: SimStep[], index: number): Record<string, NodeState> {
  const out: Record<string, NodeState> = {};
  for (let i = 0; i <= index && i < steps.length; i++) {
    const ns = steps[i].nodeStates;
    if (ns) Object.assign(out, ns);
  }
  return out;
}
