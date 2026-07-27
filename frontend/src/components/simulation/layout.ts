/**
 * Ánh xạ toạ độ soạn thảo → pixel canvas, và hình học đường dây.
 *
 * Canvas cố định 1920 × 1080: đây là kích thước ĐỆM (backing store), không
 * phải kích thước hiển thị. CSS co giãn phần tử theo bề rộng màn hình, còn
 * `captureStream()` luôn quay đúng 1920 × 1080 — nhờ vậy video xuất ra giống
 * hệt nhau dù người dạy đang mở trên laptop 13" hay màn 4K, và Playwright
 * chạy headless cũng cho ra đúng khung hình ấy.
 *
 * Mọi hàm trong file này đều TẤT ĐỊNH: không Math.random(), không Date.now().
 */

import type { SimEdge, SimNode } from './types';

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;

/** Dải phía dưới dành cho phụ đề bài giảng (được "nung" thẳng vào video). */
export const CAPTION_H = 234;
/** Vùng vẽ sơ đồ: từ đỉnh canvas tới mép trên dải phụ đề. */
export const GRAPH_TOP = 92;
export const GRAPH_BOTTOM = CANVAS_H - CAPTION_H - 16;

export const NODE_PX_W = 288;
export const NODE_PX_H = 148;

/** Trục thoáng hơn được giãn thêm tối đa bấy nhiêu lần — xem `layoutNodes`. */
const STRETCH_LIMIT = 1.6;

export interface NodeBox {
  node: SimNode;
  cx: number;
  cy: number;
  left: number;
  top: number;
  w: number;
  h: number;
}

/**
 * Đặt node vào khung, TỰ CĂN theo phạm vi thật của sơ đồ.
 *
 * Nếu ánh xạ cứng toàn bộ hệ 1000×560 vào khung thì kịch bản nào dùng ít
 * chiều dọc (REST API chỉ trải từ y=116 tới y=320) sẽ để trống gần nửa
 * khung hình — rất phí với một video 1080p. Ở đây ta lấy hộp bao của các
 * node, rồi phóng và căn giữa nó trong vùng vẽ.
 *
 * Hệ số phóng dùng CHUNG cho hai trục (min của hai hệ số) để tỉ lệ hình học
 * của sơ đồ được giữ nguyên — cạnh chéo vẫn chéo đúng góc, không bị bóp méo
 * khi kịch bản có bố cục vuông. Hộp node vẫn vẽ bằng kích thước pixel cố
 * định nên chữ không bao giờ bị kéo giãn.
 */
export interface Layout {
  boxes: Map<string, NodeBox>;
  geoms: Map<string, EdgeGeom>;
  /** Hệ số phóng đã dùng — độ cong cạnh phải nhân theo để giữ đúng tỉ lệ. */
  scale: number;
}

/** Dựng toàn bộ hình học của một kịch bản: hộp node + đường dây. */
export function computeLayout(nodes: SimNode[], edges: SimEdge[]): Layout {
  const { boxes, scale } = layoutNodes(nodes);
  return { boxes, geoms: layoutEdges(edges, boxes, scale), scale };
}

function layoutNodes(nodes: SimNode[]): { boxes: Map<string, NodeBox>; scale: number } {
  const map = new Map<string, NodeBox>();
  if (nodes.length === 0) return { boxes: map, scale: 1 };

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX;
  const spanY = maxY - minY;

  // Lề = nửa hộp node + khoảng thở, để node ngoài cùng không chạm mép khung.
  const padX = NODE_PX_W / 2 + 34;
  const padY = NODE_PX_H / 2 + 22;
  const availW = CANVAS_W - padX * 2;
  const availH = GRAPH_BOTTOM - GRAPH_TOP - padY * 2;

  const fitX = spanX > 0 ? availW / spanX : Number.POSITIVE_INFINITY;
  const fitY = spanY > 0 ? availH / spanY : Number.POSITIVE_INFINITY;
  const uniform = Math.min(fitX, fitY);
  // Sơ đồ một hàng hoặc một cột: không có gì để phóng, giữ nguyên tỉ lệ 1:1.
  const base = Number.isFinite(uniform) ? uniform : 1;

  // Cho phép trục "rộng rãi hơn" giãn thêm, nhưng KHÔNG quá STRETCH_LIMIT lần
  // so với hệ số đồng nhất. Phóng hoàn toàn đồng nhất thì kịch bản bẹt (REST
  // API trải ngang) bỏ trống nửa khung; phóng tự do hai trục thì cạnh chéo
  // méo góc và sơ đồ mất cân. Giới hạn 1,6 lần là điểm cân bằng: khung được
  // lấp đầy mà mắt không nhận ra méo.
  const sx = Number.isFinite(fitX) ? Math.min(fitX, base * STRETCH_LIMIT) : base;
  const sy = Number.isFinite(fitY) ? Math.min(fitY, base * STRETCH_LIMIT) : base;

  // Căn giữa phần còn dư sau khi phóng.
  const offsetX = padX + (availW - spanX * sx) / 2;
  const offsetY = GRAPH_TOP + padY + (availH - spanY * sy) / 2;
  const s = base;

  for (const node of nodes) {
    const cx = offsetX + (node.x - minX) * sx;
    const cy = offsetY + (node.y - minY) * sy;
    map.set(node.id, {
      node,
      cx,
      cy,
      left: cx - NODE_PX_W / 2,
      top: cy - NODE_PX_H / 2,
      w: NODE_PX_W,
      h: NODE_PX_H,
    });
  }
  return { boxes: map, scale: s };
}

/* ── Hình học cạnh ───────────────────────────────────────────── */

export interface EdgeGeom {
  edge: SimEdge;
  /** Điểm đầu (trên biên node nguồn). */
  x1: number;
  y1: number;
  /** Điểm điều khiển Bézier bậc hai. */
  cxp: number;
  cyp: number;
  /** Điểm cuối (trên biên node đích). */
  x2: number;
  y2: number;
  /** Bảng tra độ dài cung để gói tin chạy với TỐC ĐỘ ĐỀU. */
  lut: number[];
  length: number;
}

/**
 * Giao điểm giữa biên node và tia (dx, dy) phát từ tâm.
 * Node được xấp xỉ bằng ellipse bao ngoài, rộng hơn hộp một chút để đầu dây
 * không dính sát viền và không cắt qua góc bo.
 */
function boundary(cx: number, cy: number, dx: number, dy: number) {
  const rx = NODE_PX_W / 2 + 16;
  const ry = NODE_PX_H / 2 + 16;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const t = 1 / Math.sqrt((ux / rx) ** 2 + (uy / ry) ** 2);
  return { x: cx + ux * t, y: cy + uy * t };
}

const LUT_SAMPLES = 48;

function layoutEdges(edges: SimEdge[], boxes: Map<string, NodeBox>, scale: number): Map<string, EdgeGeom> {
  const map = new Map<string, EdgeGeom>();
  for (const edge of edges) {
    const a = boxes.get(edge.from);
    const b = boxes.get(edge.to);
    if (!a || !b) continue;

    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const len = Math.hypot(dx, dy) || 1;
    // Pháp tuyến đơn vị — độ cong đẩy điểm điều khiển theo hướng này.
    const nx = -dy / len;
    const ny = dx / len;
    // Độ cong ghi trong kịch bản là đơn vị soạn thảo — phóng theo đúng hệ số
    // của bố cục, nếu không cạnh cong sẽ lệch hẳn khỏi node ở sơ đồ bị thu nhỏ.
    const curve = (edge.curve ?? 0) * scale;
    const cxp = (a.cx + b.cx) / 2 + nx * curve;
    const cyp = (a.cy + b.cy) / 2 + ny * curve;

    // Đầu dây hướng về ĐIỂM ĐIỀU KHIỂN, không phải về tâm node kia — nhờ vậy
    // dây cong vẫn mọc ra đúng hướng thay vì cắt chéo qua góc hộp.
    const p1 = boundary(a.cx, a.cy, cxp - a.cx, cyp - a.cy);
    const p2 = boundary(b.cx, b.cy, cxp - b.cx, cyp - b.cy);

    // Bảng độ dài cung tích luỹ. Bézier có tham số t KHÔNG tỉ lệ thuận với
    // quãng đường, nên nếu chạy gói tin theo t thẳng thì nó sẽ nhanh chậm
    // thất thường ở đoạn cong. LUT khắc phục đúng chỗ đó.
    const lut: number[] = [0];
    let prevX = p1.x;
    let prevY = p1.y;
    let acc = 0;
    for (let i = 1; i <= LUT_SAMPLES; i++) {
      const t = i / LUT_SAMPLES;
      const pt = quadPoint(p1.x, p1.y, cxp, cyp, p2.x, p2.y, t);
      acc += Math.hypot(pt.x - prevX, pt.y - prevY);
      lut.push(acc);
      prevX = pt.x;
      prevY = pt.y;
    }

    map.set(edge.id, { edge, x1: p1.x, y1: p1.y, cxp, cyp, x2: p2.x, y2: p2.y, lut, length: acc });
  }
  return map;
}

/** Điểm trên Bézier bậc hai tại tham số t. */
export function quadPoint(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number) {
  const mt = 1 - t;
  const a = mt * mt;
  const b = 2 * mt * t;
  const c = t * t;
  return { x: a * x1 + b * cx + c * x2, y: a * y1 + b * cy + c * y2 };
}

/** Tiếp tuyến (chưa chuẩn hoá) trên Bézier bậc hai tại t — dùng để xoay gói tin. */
export function quadTangent(x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number) {
  const mt = 1 - t;
  return { x: 2 * (mt * (cx - x1) + t * (x2 - cx)), y: 2 * (mt * (cy - y1) + t * (y2 - cy)) };
}

/**
 * Đổi tỉ lệ quãng đường s ∈ [0,1] sang tham số t của Bézier, dùng LUT.
 * Kết quả: gói tin chạy với tốc độ ĐỀU trên mọi đoạn cong.
 */
export function tAtDistance(geom: EdgeGeom, s: number): number {
  const target = Math.max(0, Math.min(1, s)) * geom.length;
  const { lut } = geom;
  let lo = 0;
  let hi = lut.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lut[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (lo === 0) return 0;
  const prev = lut[lo - 1];
  const span = lut[lo] - prev || 1;
  const frac = (target - prev) / span;
  return (lo - 1 + frac) / LUT_SAMPLES;
}

/** Vị trí + hướng của gói tin tại tỉ lệ quãng đường s, có tính chiều đi. */
export function pointOnEdge(geom: EdgeGeom, s: number, reverse: boolean) {
  const dist = reverse ? 1 - s : s;
  const t = tAtDistance(geom, dist);
  const p = quadPoint(geom.x1, geom.y1, geom.cxp, geom.cyp, geom.x2, geom.y2, t);
  const tan = quadTangent(geom.x1, geom.y1, geom.cxp, geom.cyp, geom.x2, geom.y2, t);
  const sign = reverse ? -1 : 1;
  return { x: p.x, y: p.y, angle: Math.atan2(tan.y * sign, tan.x * sign) };
}
