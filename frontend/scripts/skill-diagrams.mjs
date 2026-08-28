/**
 * Sơ đồ SVG tự sinh bằng code (không để AI "vẽ" SVG tay mỗi chương — rủi ro
 * sai cú pháp/không nhất quán qua 237 chương). 3 hàm thuần JS tính toạ độ từ
 * dữ liệu đã có sẵn trong guide() — không cần field dữ liệu riêng cho sơ đồ.
 *
 * Dùng currentColor / var(--accent) / var(--ink) / var(--rule) / var(--leaf)
 * / var(--go) / var(--stop) — vì SVG nhúng inline ngay trong <body>, nó thừa
 * hưởng CSS custom properties của trang (đã đổi theo màu bìa quyển và theo
 * dark mode). Không cần field màu riêng cho từng sơ đồ.
 */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Word-wrap đơn giản theo số ký tự, tối đa maxLines dòng. */
function wrapLines(text, maxChars = 16, maxLines = 3) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/.{1,3}$/, '…');
  }
  return lines;
}

function tspanBlock(lines, x, y, lineH = 13) {
  const startY = y - ((lines.length - 1) * lineH) / 2;
  return lines.map((l, i) => `<tspan x="${x}" y="${(startY + i * lineH).toFixed(1)}">${esc(l)}</tspan>`).join('');
}

/** Mũi tên tam giác tự vẽ bằng <polygon> — không dùng <marker> (không nhất
 * quán giữa trình duyệt khi HTML mở offline, đặc biệt Safari). */
function arrowHead(x, y, angleRad, size = 7) {
  const spread = 2.6; // ~150° hai bên, tạo tam giác nhọn vừa phải
  const a1 = angleRad + spread;
  const a2 = angleRad - spread;
  const p1 = [x + size * Math.cos(a1), y + size * Math.sin(a1)];
  const p2 = [x + size * Math.cos(a2), y + size * Math.sin(a2)];
  return `<polygon points="${x.toFixed(1)},${y.toFixed(1)} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="currentColor"/>`;
}

function straightArrow(x1, y1, x2, y2, pad = 8) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - pad * Math.cos(ang);
  const ey = y2 - pad * Math.sin(ang);
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="currentColor" stroke-width="2" opacity=".55"/>${arrowHead(ex, ey, ang)}`;
}

/** Quy trình N bước nối tiếp (3-6), box + mũi tên ngang. */
export function svgFlow(steps, { viewW = 900, viewH = 190 } = {}) {
  const N = steps.length;
  if (N < 3 || N > 6) throw new Error(`svgFlow cần 3-6 bước, nhận ${N}`);
  const margin = 50;
  const usable = viewW - margin * 2;
  const boxW = Math.min(150, usable / N - 28);
  const boxH = 100; // đủ chỗ cho tên bước dài tới 3 dòng (đã kiểm bằng render thử)
  const gap = (usable - boxW * N) / (N - 1);
  const cy = viewH / 2 + 6;

  const centers = Array.from({ length: N }, (_, i) => margin + boxW / 2 + i * (boxW + gap));

  const boxes = steps
    .map((s, i) => {
      const cx = centers[i];
      const lines = wrapLines(s.name, 15, 3);
      const badgeX = cx - boxW / 2 + 16;
      const badgeY = cy - boxH / 2 + 16;
      return `<g>
      <rect x="${(cx - boxW / 2).toFixed(1)}" y="${(cy - boxH / 2).toFixed(1)}" width="${boxW.toFixed(1)}" height="${boxH}" rx="10" fill="var(--leaf,#fff)" stroke="currentColor" stroke-width="1.6" opacity=".9"/>
      <circle cx="${badgeX.toFixed(1)}" cy="${badgeY.toFixed(1)}" r="11" fill="currentColor" opacity=".14"/>
      <text x="${badgeX.toFixed(1)}" y="${(badgeY + 4).toFixed(1)}" text-anchor="middle" font="700 11px 'JetBrains Mono',monospace" fill="currentColor">${i + 1}</text>
      <text x="${cx.toFixed(1)}" y="${(cy + 6).toFixed(1)}" text-anchor="middle" font="600 12.5px 'Source Sans 3',sans-serif" fill="var(--ink,#151a21)">${tspanBlock(lines, cx, cy + 6)}</text>
    </g>`;
    })
    .join('');

  const arrows = centers
    .slice(0, -1)
    .map((cx, i) => straightArrow(cx + boxW / 2, cy, centers[i + 1] - boxW / 2, cy))
    .join('');

  return `<svg viewBox="0 0 ${viewW} ${viewH}" role="img" aria-label="Sơ đồ ${N} bước">${arrows}${boxes}</svg>`;
}

/** Vòng lặp tròn N bước (3-6) — dùng khi framework có tính lặp lại. Cạnh
 * cuối (bước N -> bước 1) vẽ nét đứt để phân biệt trực quan "đây là vòng
 * lặp, không phải bước tiếp theo". */
export function svgCycle(steps, { size = 300 } = {}) {
  const N = steps.length;
  if (N < 3 || N > 6) throw new Error(`svgCycle cần 3-6 bước, nhận ${N}`);
  const radius = 105;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const nodeR = 38;
  const angleOf = (i) => -Math.PI / 2 + i * ((2 * Math.PI) / N); // bắt đầu từ đỉnh 12h, chiều kim đồng hồ
  const pt = (a) => [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];

  const nodes = steps
    .map((s, i) => {
      const [x, y] = pt(angleOf(i));
      const lines = wrapLines(s.name, 12, 2);
      return `<g>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${nodeR}" fill="var(--leaf,#fff)" stroke="currentColor" stroke-width="1.8"/>
      <text x="${x.toFixed(1)}" y="${(y - 2).toFixed(1)}" text-anchor="middle" font="600 11px 'Source Sans 3',sans-serif" fill="var(--ink,#151a21)">${tspanBlock(lines, x, y - 2, 12)}</text>
      <text x="${x.toFixed(1)}" y="${(y + nodeR + 14).toFixed(1)}" text-anchor="middle" font="700 10px 'JetBrains Mono',monospace" fill="currentColor" opacity=".7">${i + 1}</text>
    </g>`;
    })
    .join('');

  const pad = 0.34; // radian (~19.5°) chừa 2 đầu cung để không đè lên node
  const arcs = Array.from({ length: N }, (_, i) => {
    const startAngle = angleOf(i);
    let endAngle = angleOf((i + 1) % N);
    if (i === N - 1) endAngle += 2 * Math.PI; // cạnh cuối vòng lại điểm đầu
    const a0 = startAngle + pad;
    const a1 = endAngle - pad;
    const [x1, y1] = pt(a0);
    const [x2, y2] = pt(a1);
    const tangent = a1 + Math.PI / 2; // hướng tiếp tuyến tại điểm cuối (chiều thuận kim đồng hồ)
    const isLast = i === N - 1;
    return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="2" opacity=".5" ${isLast ? 'stroke-dasharray="1 6"' : ''}/>${arrowHead(x2, y2, tangent)}`;
  }).join('');

  return `<svg viewBox="0 0 ${size} ${size - 10}" role="img" aria-label="Sơ đồ vòng lặp ${N} bước">${arcs}${nodes}</svg>`;
}

/** So sánh "Cách yếu / Cách trưởng thành" — 2 cột, icon ✕/✓ vẽ bằng path. */
export function svgCompare(pairs, { viewW = 640 } = {}) {
  const N = pairs.length;
  if (N < 2 || N > 4) throw new Error(`svgCompare cần 2-4 cặp, nhận ${N}`);
  const rowH = 58;
  const top = 46;
  const viewH = top + N * rowH + 10;
  const iconL = 40;
  const textL = 60;
  const iconR = 360;
  const textR = 380;

  const icon = (x, y, ok) =>
    ok
      ? `<path d="M ${x - 6} ${y} L ${x - 1} ${y + 5} L ${x + 7} ${y - 6}" fill="none" stroke="var(--go,#1b6446)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M ${x - 5} ${y - 5} L ${x + 5} ${y + 5} M ${x - 5} ${y + 5} L ${x + 5} ${y - 5}" stroke="var(--stop,#9e2a20)" stroke-width="2.4" stroke-linecap="round"/>`;

  const header = `<text x="${textL - 20}" y="26" font="700 11px 'Source Sans 3',sans-serif" fill="var(--stop,#9e2a20)" letter-spacing="1">CÁCH YẾU</text>
    <text x="${textR - 20}" y="26" font="700 11px 'Source Sans 3',sans-serif" fill="var(--go,#1b6446)" letter-spacing="1">CÁCH TRƯỞNG THÀNH</text>`;

  const rows = pairs
    .map((p, i) => {
      const y = top + i * rowH + rowH / 2;
      const wl = wrapLines(p.weak, 30, 2);
      const wr = wrapLines(p.mature, 30, 2);
      const sepY = (y + rowH / 2 - 4).toFixed(1);
      return `${icon(iconL, y, false)}<text x="${textL}" y="${y}" font="12.5px 'Source Serif 4',serif" fill="var(--ink,#151a21)">${tspanBlock(wl, textL, y, 15)}</text>
      ${icon(iconR, y, true)}<text x="${textR}" y="${y}" font="12.5px 'Source Serif 4',serif" fill="var(--ink,#151a21)">${tspanBlock(wr, textR, y, 15)}</text>
      ${i < N - 1 ? `<line x1="20" y1="${sepY}" x2="${viewW - 20}" y2="${sepY}" stroke="var(--rule,#d3d9e2)"/>` : ''}`;
    })
    .join('');

  return `<svg viewBox="0 0 ${viewW} ${viewH}" role="img" aria-label="So sánh cách yếu và cách trưởng thành">${header}${rows}</svg>`;
}

/** Sơ đồ quy trình N bước — chọn flow (mặc định) hoặc cycle theo guide. */
export function renderFrameworkDiagram(g) {
  return g.diagram === 'cycle' ? svgCycle(g.framework) : svgFlow(g.framework);
}
