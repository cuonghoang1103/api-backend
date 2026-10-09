#!/usr/bin/env node
/**
 * CT Work UX-D (09/10/2026) — dựng THƯ VIỆN ẢNH BÌA dự án (SVG tự vẽ, không ảnh có bản quyền).
 *
 *   node frontend/scripts/work-covers/gen-work-covers.mjs
 *
 * Ra:
 *   frontend/public/images/work-covers/<id>.svg   — 29 ảnh 1600×640 (2,5:1), mỗi ảnh vài KB
 *   frontend/src/lib/work-covers.json              — danh mục (id, nhóm, nhãn, 2 màu chủ đạo, tông sáng/tối)
 *
 * Bố cục: nền phủ kín + hoạ tiết dồn về NỬA PHẢI — chữ (tên dự án, ảnh OG) đè lên nửa trái, và mọi
 * chỗ hiển thị đều cắt kiểu `cover` (thẻ dự án ~3:1, đầu trang ~8:1, OG 1,9:1) nên giữa-phải luôn còn.
 * KHÔNG dùng <text> trừ nhóm School (mã môn là chính nội dung) — chữ trong SVG phụ thuộc phông máy xem.
 * Danh sách id phải khớp `src/services/work/covers.ts` (backend) — test covers.test.ts đối chiếu.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const fe = path.resolve(here, '../..');
const outDir = path.join(fe, 'public/images/work-covers');
mkdirSync(outDir, { recursive: true });

const W = 1600, H = 640;
const svg = (defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>\n`;
const lin = (id, a, b, x2 = 1, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const rad = (id, c, o = 1) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const bg = (fill) => `<rect width="${W}" height="${H}" fill="${fill}"/>`;
const glow = (cx, cy, r, id) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
/** Lưới chấm mảnh (hoạ tiết nền) bằng <pattern> — vài trăm byte thay vì vài nghìn <circle>; chỉ phủ vùng [x0..x1]. */
let dotSeq = 0;
function dots(x0, x1, step, r, color, op) {
  const id = `d${++dotSeq}`;
  return `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse"><circle cx="${step / 2}" cy="${step / 2}" r="${r}" fill="${color}" fill-opacity="${op}"/></pattern><rect x="${x0}" y="0" width="${x1 - x0}" height="${H}" fill="url(#${id})"/>`;
}
/** Số giả ngẫu nhiên ổn định (dựng lại ra đúng tệp cũ — không làm bẩn git). */
function rng(seed) { let t = seed >>> 0; return () => { t = (t * 1664525 + 1013904223) >>> 0; return t / 4294967296; }; }

const covers = [];
function add(id, group, label, colors, tone, content) { covers.push({ id, group, label, colors, tone }); writeFileSync(path.join(outDir, `${id}.svg`), content); }

// ─── Professional: gradient / geometric / abstract ───────────────────────────
add('gradient-indigo', 'professional', 'Indigo', ['#4f5bd5', '#22d3ee'], 'dark', svg(
  lin('a', '#2e3192', '#4f5bd5') + rad('g1', '#22d3ee', 0.55) + rad('g2', '#a78bfa', 0.5),
  bg('url(#a)') + glow(1250, 120, 520, 'g1') + glow(1450, 600, 420, 'g2') + glow(700, 700, 360, 'g2')));
add('gradient-sunset', 'professional', 'Sunset', ['#f97316', '#db2777'], 'dark', svg(
  lin('a', '#7c2d12', '#be185d') + rad('g1', '#fb923c', 0.7) + rad('g2', '#f472b6', 0.55),
  bg('url(#a)') + glow(1200, 520, 560, 'g1') + glow(1500, 80, 380, 'g2') + glow(300, 0, 300, 'g2')));
add('gradient-ocean', 'professional', 'Ocean', ['#0ea5e9', '#0d9488'], 'dark', svg(
  lin('a', '#0c4a6e', '#115e59') + rad('g1', '#38bdf8', 0.6) + rad('g2', '#2dd4bf', 0.55),
  bg('url(#a)') + glow(1300, 160, 520, 'g1') + glow(1000, 640, 420, 'g2') +
  `<path d="M0 470 C 300 410 520 540 820 480 S 1350 400 1600 450 V640 H0Z" fill="#ffffff" fill-opacity=".06"/><path d="M0 540 C 340 490 600 600 900 550 S 1380 480 1600 530 V640 H0Z" fill="#ffffff" fill-opacity=".07"/>`));
add('gradient-forest', 'professional', 'Forest', ['#16a34a', '#065f46'], 'dark', svg(
  lin('a', '#052e16', '#065f46') + rad('g1', '#4ade80', 0.45) + rad('g2', '#a3e635', 0.35),
  bg('url(#a)') + glow(1280, 200, 520, 'g1') + glow(1500, 600, 360, 'g2')));
add('gradient-mono', 'professional', 'Graphite', ['#475569', '#0f172a'], 'dark', svg(
  lin('a', '#0f172a', '#334155') + rad('g1', '#94a3b8', 0.35),
  bg('url(#a)') + glow(1300, 120, 600, 'g1') + dots(900, 1600, 40, 1.6, '#e2e8f0', 0.18)));
add('gradient-dawn', 'professional', 'Dawn', ['#fde68a', '#fbcfe8'], 'light', svg(
  lin('a', '#fff7ed', '#fce7f3') + rad('g1', '#fde68a', 0.9) + rad('g2', '#c4b5fd', 0.6),
  bg('url(#a)') + glow(1250, 180, 520, 'g1') + glow(1500, 600, 420, 'g2')));
{
  // Hình học: tam giác (lưới tam giác đổ bóng theo cột)
  const r = rng(7); let tri = '';
  const s = 160;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 5; j++) {
    const x = 640 + i * s / 1.4, y = j * s;
    const up = (i + j) % 2 === 0;
    const op = (0.05 + r() * 0.22 * (i / 12)).toFixed(2);
    tri += `<path d="${up ? `M${x} ${y + s}L${x + s / 1.4} ${y}L${x + 2 * s / 1.4} ${y + s}Z` : `M${x} ${y}L${x + s / 1.4} ${y + s}L${x + 2 * s / 1.4} ${y}Z`}" fill-opacity="${op}"/>`;
  }
  add('geo-triangles', 'professional', 'Triangles', ['#6366f1', '#0f172a'], 'dark', svg(
    lin('a', '#1e1b4b', '#312e81'), bg('url(#a)') + `<g fill="#a5b4fc">${tri}</g>`));
}
{
  // Hình học: lục giác
  const r = rng(11); let hx = '';
  const R = 70, w = Math.sqrt(3) * R;
  for (let row = -1; row < 7; row++) for (let col = 0; col < 12; col++) {
    const cx = 760 + col * w + (row % 2 ? w / 2 : 0), cy = row * R * 1.5;
    if (cx < 700) continue;
    const pts = Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k + Math.PI / 6; return `${(cx + R * 0.92 * Math.cos(a)).toFixed(1)},${(cy + R * 0.92 * Math.sin(a)).toFixed(1)}`; }).join(' ');
    const v = r(); hx += `<polygon points="${pts}" fill-opacity="${(0.04 + v * 0.18).toFixed(2)}"/>`;
  }
  add('geo-hexagons', 'professional', 'Hexagons', ['#14b8a6', '#134e4a'], 'dark', svg(
    lin('a', '#042f2e', '#0f766e'), bg('url(#a)') + `<g fill="#5eead4" stroke="#99f6e4" stroke-opacity=".18" stroke-width="2">${hx}</g>`));
}
{
  // Hình học: lưới + khối
  let grid = '';
  for (let x = 0; x <= W; x += 80) grid += `<path d="M${x} 0V${H}"/>`;
  for (let y = 0; y <= H; y += 80) grid += `<path d="M0 ${y}H${W}"/>`;
  add('geo-blocks', 'professional', 'Blocks', ['#2563eb', '#f8fafc'], 'light', svg(
    lin('a', '#f8fafc', '#e0e7ff'),
    bg('url(#a)') + `<g stroke="#6366f1" stroke-opacity=".10" stroke-width="2">${grid}</g>` +
    `<rect x="1040" y="80" width="240" height="240" rx="28" fill="#4f5bd5"/><rect x="1280" y="240" width="160" height="160" rx="24" fill="#22d3ee"/>` +
    `<rect x="960" y="400" width="160" height="160" rx="80" fill="#f472b6"/><rect x="1200" y="480" width="320" height="80" rx="40" fill="#a5b4fc"/>`));
}
add('abstract-waves', 'professional', 'Waves', ['#8b5cf6', '#06b6d4'], 'dark', svg(
  lin('a', '#1e1b4b', '#0e7490', 1, 0.4) + lin('w1', '#8b5cf6', '#06b6d4', 1, 0) + lin('w2', '#ec4899', '#8b5cf6', 1, 0),
  bg('url(#a)') +
  `<path d="M500 420 C 760 220 980 600 1240 380 S 1560 200 1700 300" fill="none" stroke="url(#w1)" stroke-width="70" stroke-linecap="round" stroke-opacity=".75"/>` +
  `<path d="M560 540 C 820 360 1040 700 1300 500 S 1600 340 1720 420" fill="none" stroke="url(#w2)" stroke-width="40" stroke-linecap="round" stroke-opacity=".55"/>` +
  `<path d="M620 250 C 860 100 1080 380 1320 220 S 1580 80 1700 140" fill="none" stroke="#e0f2fe" stroke-width="10" stroke-linecap="round" stroke-opacity=".35"/>`));
add('abstract-orbs', 'professional', 'Orbs', ['#f472b6', '#818cf8'], 'dark', svg(
  lin('a', '#111827', '#1f2937') + lin('o1', '#f472b6', '#8b5cf6') + lin('o2', '#22d3ee', '#3b82f6') + lin('o3', '#fbbf24', '#f97316'),
  bg('url(#a)') + `<circle cx="1180" cy="250" r="190" fill="url(#o1)"/><circle cx="1430" cy="470" r="130" fill="url(#o2)"/><circle cx="960" cy="520" r="80" fill="url(#o3)"/><circle cx="1500" cy="120" r="46" fill="#a5b4fc" fill-opacity=".8"/>`));

// ─── Theme: Code, Testing, Data, AI, Design, Game, Study (+ Mobile, DevOps) ───
add('theme-code', 'theme', 'Code', ['#22d3ee', '#0f172a'], 'dark', svg(
  lin('a', '#0b1020', '#111a33'),
  bg('url(#a)') + dots(0, 1600, 48, 1.4, '#38bdf8', 0.12) +
  `<g transform="translate(980 120)" font-family="ui-monospace,monospace"><rect width="520" height="400" rx="22" fill="#0f172a" stroke="#334155" stroke-width="3"/><circle cx="34" cy="32" r="9" fill="#f87171"/><circle cx="62" cy="32" r="9" fill="#fbbf24"/><circle cx="90" cy="32" r="9" fill="#4ade80"/>` +
  [[40, 100, 180, '#c084fc'], [240, 100, 120, '#e2e8f0'], [80, 150, 220, '#38bdf8'], [320, 150, 140, '#fbbf24'], [80, 200, 160, '#4ade80'], [260, 200, 200, '#e2e8f0'], [120, 250, 260, '#f472b6'], [80, 300, 120, '#38bdf8'], [220, 300, 160, '#94a3b8'], [40, 350, 90, '#c084fc']]
    .map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="${c}" fill-opacity=".9"/>`).join('') + `</g>` +
  `<path d="M860 250 L790 320 L860 390" fill="none" stroke="#22d3ee" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`));
add('theme-testing', 'theme', 'Testing', ['#16a34a', '#ecfdf5'], 'light', svg(
  lin('a', '#f0fdf4', '#dcfce7'),
  bg('url(#a)') + dots(0, 1600, 44, 1.6, '#16a34a', 0.12) +
  [0, 1, 2, 3].map((i) => {
    const y = 130 + i * 100, pass = i !== 2;
    return `<g transform="translate(980 ${y})"><rect width="460" height="72" rx="16" fill="#ffffff" stroke="#bbf7d0" stroke-width="3"/><circle cx="40" cy="36" r="20" fill="${pass ? '#16a34a' : '#ef4444'}"/>` +
      (pass ? '<path d="M30 36 l7 8 l14 -16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' : '<path d="M32 28 l16 16 M48 28 l-16 16" stroke="#fff" stroke-width="6" stroke-linecap="round"/>') +
      `<rect x="80" y="26" width="${[240, 300, 200, 270][i]}" height="12" rx="6" fill="#86efac"/><rect x="80" y="46" width="${[150, 120, 180, 100][i]}" height="8" rx="4" fill="#d1fae5"/></g>`;
  }).join('') + `<circle cx="1480" cy="540" r="70" fill="#16a34a"/><path d="M1446 540 l22 24 l40 -46" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`));
add('theme-data', 'theme', 'Data', ['#3b82f6', '#0b1530'], 'dark', svg(
  lin('a', '#0b1530', '#172554') + lin('b', '#60a5fa', '#22d3ee', 0, 1),
  bg('url(#a)') + `<g stroke="#93c5fd" stroke-opacity=".12" stroke-width="2">${[160, 280, 400, 520].map((y) => `<path d="M820 ${y}H1560"/>`).join('')}</g>` +
  [[880, 320], [970, 230], [1060, 380], [1150, 170], [1240, 260], [1330, 120], [1420, 210]].map(([x, h]) => `<rect x="${x}" y="${540 - h}" width="56" height="${h}" rx="10" fill="url(#b)" fill-opacity=".9"/>`).join('') +
  `<path d="M880 300 L998 250 L1088 330 L1178 190 L1268 240 L1358 110 L1448 160" fill="none" stroke="#fbbf24" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` +
  [[880, 300], [998, 250], [1088, 330], [1178, 190], [1268, 240], [1358, 110], [1448, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#0b1530" stroke="#fbbf24" stroke-width="6"/>`).join('')));
{
  const r = rng(23); const nodes = [];
  const layers = [[880, 4], [1080, 6], [1280, 6], [1470, 3]];
  for (const [x, n] of layers) for (let i = 0; i < n; i++) nodes.push([x, 320 + (i - (n - 1) / 2) * (440 / Math.max(n, 4)), x]);
  let edges = '';
  for (let L = 0; L < layers.length - 1; L++) {
    const A = nodes.filter((p) => p[2] === layers[L][0]), B = nodes.filter((p) => p[2] === layers[L + 1][0]);
    for (const a of A) for (const b of B) edges += `<path d="M${a[0]} ${a[1].toFixed(0)}L${b[0]} ${b[1].toFixed(0)}" stroke-opacity="${(0.12 + r() * 0.3).toFixed(2)}"/>`;
  }
  add('theme-ai', 'theme', 'AI', ['#a855f7', '#1e1b4b'], 'dark', svg(
    lin('a', '#140c2e', '#2e1065') + rad('g', '#c084fc', 0.45) + lin('n', '#e879f9', '#818cf8'),
    bg('url(#a)') + glow(1180, 320, 480, 'g') + `<g stroke="#c4b5fd" stroke-width="2.5">${edges}</g>` +
    nodes.map(([x, y]) => `<circle cx="${x}" cy="${y.toFixed(0)}" r="18" fill="url(#n)" stroke="#f5f3ff" stroke-width="4"/>`).join('')));
}
add('theme-design', 'theme', 'Design', ['#ec4899', '#fdf2f8'], 'light', svg(
  lin('a', '#fff1f2', '#fdf4ff'),
  bg('url(#a)') + `<circle cx="1180" cy="300" r="170" fill="#f9a8d4" fill-opacity=".75"/><rect x="1240" y="260" width="260" height="260" rx="34" fill="#a5b4fc" fill-opacity=".8"/><path d="M960 520 L1080 300 L1200 520Z" fill="#fde047" fill-opacity=".85"/>` +
  `<path d="M900 180 C 1040 60 1260 120 1340 200" fill="none" stroke="#db2777" stroke-width="6"/><rect x="886" y="166" width="28" height="28" rx="4" fill="#fff" stroke="#db2777" stroke-width="5"/><rect x="1326" y="186" width="28" height="28" rx="4" fill="#fff" stroke="#db2777" stroke-width="5"/><circle cx="1110" cy="96" r="12" fill="#db2777"/><path d="M1110 96 L1040 70 M1110 96 L1190 108" stroke="#db2777" stroke-width="3"/>`));
add('theme-game', 'theme', 'Game', ['#f43f5e', '#1e1b4b'], 'dark', svg(
  lin('a', '#1e1b4b', '#4c1d95') + lin('p', '#f43f5e', '#f97316'),
  bg('url(#a)') + dots(0, 1600, 56, 2.2, '#fda4af', 0.12) +
  `<path d="M1000 260 Q1000 190 1080 190 H1380 Q1460 190 1460 260 L1500 440 Q1514 520 1440 520 Q1400 520 1370 470 L1340 420 H1120 L1090 470 Q1060 520 1020 520 Q946 520 960 440Z" fill="url(#p)"/>` +
  `<rect x="1060" y="290" width="90" height="28" rx="8" fill="#fff"/><rect x="1091" y="259" width="28" height="90" rx="8" fill="#fff"/><circle cx="1330" cy="280" r="20" fill="#fde047"/><circle cx="1380" cy="330" r="20" fill="#22d3ee"/><circle cx="1280" cy="330" r="20" fill="#a3e635"/><circle cx="1330" cy="380" r="20" fill="#fff"/>` +
  `<g fill="#fde047"><rect x="880" y="120" width="22" height="22"/><rect x="1500" y="110" width="16" height="16"/><rect x="1540" y="560" width="22" height="22"/></g>`));
add('theme-study', 'theme', 'Study', ['#f59e0b', '#fffbeb'], 'light', svg(
  lin('a', '#fffbeb', '#fef3c7'),
  bg('url(#a)') + dots(0, 1600, 46, 1.6, '#d97706', 0.12) +
  `<path d="M960 470 Q1100 420 1220 470 V210 Q1100 160 960 210Z" fill="#fff" stroke="#d97706" stroke-width="6" stroke-linejoin="round"/><path d="M1220 470 Q1340 420 1480 470 V210 Q1340 160 1220 210Z" fill="#fff" stroke="#d97706" stroke-width="6" stroke-linejoin="round"/>` +
  [250, 290, 330, 370, 410].map((y) => `<path d="M1000 ${y} Q1100 ${y - 30} 1190 ${y}" fill="none" stroke="#fcd34d" stroke-width="8" stroke-linecap="round"/><path d="M1250 ${y} Q1340 ${y - 30} 1440 ${y}" fill="none" stroke="#fcd34d" stroke-width="8" stroke-linecap="round"/>`).join('') +
  `<path d="M1220 70 L1360 120 L1220 170 L1080 120Z" fill="#1f2937"/><path d="M1140 140 V176 Q1220 210 1300 176 V140" fill="#374151"/><path d="M1360 120 V190" stroke="#f59e0b" stroke-width="6"/><circle cx="1360" cy="196" r="10" fill="#f59e0b"/>`));
add('theme-mobile', 'theme', 'Mobile', ['#0ea5e9', '#e0f2fe'], 'light', svg(
  lin('a', '#f0f9ff', '#e0f2fe') + lin('s', '#38bdf8', '#6366f1', 0, 1),
  bg('url(#a)') +
  `<rect x="1060" y="70" width="250" height="500" rx="40" fill="#0f172a"/><rect x="1076" y="96" width="218" height="448" rx="28" fill="url(#s)"/>` +
  `<rect x="1100" y="130" width="170" height="70" rx="14" fill="#fff" fill-opacity=".9"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${1100 + (i % 3) * 58}" y="${230 + Math.floor(i / 3) * 70}" width="46" height="46" rx="12" fill="#fff" fill-opacity=".75"/>`).join('')}` +
  `<rect x="1360" y="200" width="170" height="320" rx="30" fill="#0f172a" fill-opacity=".85"/><rect x="1372" y="220" width="146" height="280" rx="20" fill="#bae6fd"/><rect x="900" y="260" width="120" height="240" rx="24" fill="#0f172a" fill-opacity=".6"/>`));
add('theme-devops', 'theme', 'DevOps', ['#06b6d4', '#082f49'], 'dark', svg(
  lin('a', '#082f49', '#0c4a6e') + lin('l', '#22d3ee', '#a78bfa', 1, 0),
  bg('url(#a)') +
  `<path d="M1000 320 C 1000 200 1180 200 1240 320 C 1300 440 1480 440 1480 320 C 1480 200 1300 200 1240 320 C 1180 440 1000 440 1000 320Z" fill="none" stroke="url(#l)" stroke-width="44" stroke-linejoin="round"/>` +
  [[1060, 230, '#22d3ee'], [1130, 420, '#38bdf8'], [1350, 220, '#a78bfa'], [1420, 410, '#c4b5fd']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}" stroke="#082f49" stroke-width="6"/>`).join('') +
  dots(0, 820, 44, 1.6, '#67e8f9', 0.14)));

// ─── Cute: minh hoạ nhẹ ───────────────────────────────────────────────────────
const cloud = (x, y, s, c, o = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" fill-opacity="${o}"><circle cx="60" cy="60" r="44"/><circle cx="120" cy="40" r="56"/><circle cx="180" cy="66" r="40"/><rect x="40" y="60" width="160" height="46" rx="23"/></g>`;
add('cute-clouds', 'cute', 'Clouds', ['#7dd3fc', '#f0f9ff'], 'light', svg(
  lin('a', '#bae6fd', '#e0f2fe', 0, 1),
  bg('url(#a)') + `<circle cx="1380" cy="170" r="80" fill="#fde68a"/>` + cloud(880, 300, 1.4, '#fff') + cloud(1200, 380, 1.1, '#fff', 0.9) + cloud(1340, 110, 0.8, '#fff', 0.85) + cloud(400, 460, 0.9, '#fff', 0.55)));
add('cute-cat', 'cute', 'Cat', ['#fb923c', '#fff7ed'], 'light', svg(
  lin('a', '#fff7ed', '#ffedd5'),
  bg('url(#a)') + dots(0, 1600, 60, 3, '#fdba74', 0.25) +
  `<g transform="translate(1100 140)"><path d="M40 120 L60 10 L130 80Z M300 120 L280 10 L210 80Z" fill="#fb923c"/><ellipse cx="170" cy="200" rx="160" ry="140" fill="#fb923c"/><path d="M70 30 L80 70 L105 75Z M270 30 L260 70 L235 75Z" fill="#fed7aa"/>` +
  `<ellipse cx="115" cy="190" rx="18" ry="24" fill="#1f2937"/><ellipse cx="225" cy="190" rx="18" ry="24" fill="#1f2937"/><circle cx="121" cy="182" r="6" fill="#fff"/><circle cx="231" cy="182" r="6" fill="#fff"/><path d="M160 236 l10 10 l10 -10Z" fill="#9a3412"/><path d="M150 256 Q170 272 190 256" fill="none" stroke="#9a3412" stroke-width="5" stroke-linecap="round"/>` +
  `<ellipse cx="80" cy="240" rx="26" ry="14" fill="#fda4af" fill-opacity=".7"/><ellipse cx="260" cy="240" rx="26" ry="14" fill="#fda4af" fill-opacity=".7"/><path d="M30 230 H-30 M30 250 L-24 266 M310 230 H370 M310 250 L364 266" stroke="#9a3412" stroke-width="4" stroke-linecap="round"/></g>`));
add('cute-rocket', 'cute', 'Rocket', ['#818cf8', '#1e1b4b'], 'dark', svg(
  lin('a', '#1e1b4b', '#312e81') + lin('f', '#fde047', '#f97316', 0, 1),
  bg('url(#a)') + (() => { const r = rng(5); let s = ''; for (let i = 0; i < 70; i++) s += `<circle cx="${(r() * 1600).toFixed(0)}" cy="${(r() * 640).toFixed(0)}" r="${(1 + r() * 3).toFixed(1)}" fill-opacity="${(0.3 + r() * 0.6).toFixed(2)}"/>`; return `<g fill="#e0e7ff">${s}</g>`; })() +
  `<g transform="translate(1220 300) rotate(35)"><path d="M0 -230 C 80 -150 80 40 60 110 H-60 C -80 40 -80 -150 0 -230Z" fill="#f8fafc"/><circle cx="0" cy="-90" r="38" fill="#60a5fa" stroke="#1e3a8a" stroke-width="10"/><path d="M-60 40 L-120 140 L-60 110Z M60 40 L120 140 L60 110Z" fill="#f43f5e"/><path d="M-40 110 Q0 260 40 110Z" fill="url(#f)"/></g>` +
  `<circle cx="960" cy="140" r="54" fill="#c4b5fd"/><circle cx="944" cy="130" r="10" fill="#a78bfa"/><circle cx="975" cy="158" r="7" fill="#a78bfa"/>`));
add('cute-plants', 'cute', 'Plants', ['#22c55e', '#f0fdf4'], 'light', svg(
  lin('a', '#f0fdf4', '#ecfccb'),
  bg('url(#a)') +
  `<g transform="translate(1000 220)"><path d="M60 0 C 10 60 20 140 70 180 C 110 130 110 60 60 0Z" fill="#4ade80"/><path d="M150 40 C 210 80 210 160 150 190 C 110 150 110 90 150 40Z" fill="#22c55e"/><path d="M105 190 V80" stroke="#15803d" stroke-width="6"/><path d="M40 190 H170 L150 330 H60Z" fill="#fb923c"/><rect x="30" y="180" width="150" height="26" rx="8" fill="#ea580c"/></g>` +
  `<g transform="translate(1260 260)"><circle cx="90" cy="60" r="60" fill="#86efac"/><circle cx="50" cy="100" r="44" fill="#4ade80"/><circle cx="135" cy="105" r="42" fill="#22c55e"/><path d="M30 150 H160 L145 290 H45Z" fill="#a78bfa"/><rect x="20" y="140" width="150" height="24" rx="8" fill="#7c3aed"/></g>` +
  `<path d="M0 560 H1600 V640 H0Z" fill="#bbf7d0"/>`));
add('cute-stars', 'cute', 'Stars', ['#f9a8d4', '#fdf2f8'], 'light', svg(
  lin('a', '#fdf2f8', '#ede9fe'),
  bg('url(#a)') + (() => {
    const star = (x, y, r, c) => { const p = []; for (let k = 0; k < 10; k++) { const a = Math.PI / 5 * k - Math.PI / 2, rr = k % 2 ? r * 0.45 : r; p.push(`${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`); } return `<polygon points="${p.join(' ')}" fill="${c}" stroke="${c}" stroke-width="${r / 6}" stroke-linejoin="round"/>`; };
    return star(1180, 280, 120, '#f9a8d4') + star(1420, 180, 70, '#c4b5fd') + star(1450, 470, 90, '#fde68a') + star(960, 470, 54, '#a5f3fc') + star(1000, 140, 34, '#fbcfe8') + star(700, 120, 26, '#ddd6fe');
  })() + `<circle cx="1150" cy="270" r="9" fill="#831843"/><circle cx="1210" cy="270" r="9" fill="#831843"/><path d="M1162 300 Q1180 316 1198 300" fill="none" stroke="#831843" stroke-width="6" stroke-linecap="round"/>`));

// ─── School: SWT301 / SWR302 / SWP391 / Capstone ─────────────────────────────
function school(id, label, code, sub, colors, motif) {
  add(id, 'school', label, colors, 'dark', svg(
    lin('a', colors[1], colors[0]) + rad('g', '#ffffff', 0.18),
    bg('url(#a)') + glow(1250, 300, 520, 'g') + motif +
    `<text x="1530" y="560" text-anchor="end" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-weight="800" font-size="150" fill="#ffffff" fill-opacity=".92" letter-spacing="-4">${code}</text>` +
    `<text x="1530" y="604" text-anchor="end" font-family="Inter,Segoe UI,Helvetica,Arial,sans-serif" font-weight="600" font-size="30" fill="#ffffff" fill-opacity=".7" letter-spacing="6">${sub}</text>`));
}
school('school-swt301', 'SWT301 · Testing', 'SWT301', 'SOFTWARE TESTING', ['#059669', '#022c22'],
  `<g fill="none" stroke="#a7f3d0" stroke-opacity=".5" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">${[0, 1, 2].map((i) => `<path d="M${1060 + i * 150} 150 l30 32 l60 -70"/>`).join('')}</g>`);
school('school-swr302', 'SWR302 · Requirements', 'SWR302', 'SOFTWARE REQUIREMENTS', ['#2563eb', '#0b1a4a'],
  `<g fill="#bfdbfe" fill-opacity=".35">${[0, 1, 2].map((i) => `<rect x="${1040 + i * 160}" y="${110 + (i % 2) * 30}" width="130" height="150" rx="14"/>`).join('')}</g><g stroke="#dbeafe" stroke-opacity=".6" stroke-width="5">${[0, 1, 2].map((i) => `<path d="M${1060 + i * 160} ${150 + (i % 2) * 30}h90M${1060 + i * 160} ${180 + (i % 2) * 30}h70M${1060 + i * 160} ${210 + (i % 2) * 30}h80"/>`).join('')}</g>`);
school('school-swp391', 'SWP391 · Project', 'SWP391', 'SOFTWARE PROJECT', ['#ea580c', '#431407'],
  `<g fill="#fed7aa" fill-opacity=".4">${[[1040, 90, 120], [1180, 90, 80], [1320, 90, 160]].map(([x, y, h]) => `<rect x="${x}" y="${y}" width="120" height="${h}" rx="14"/>`).join('')}</g><g fill="#fff7ed" fill-opacity=".55">${[[1056, 108], [1056, 150], [1196, 108], [1336, 108], [1336, 150], [1336, 192]].map(([x, y]) => `<rect x="${x}" y="${y}" width="88" height="30" rx="7"/>`).join('')}</g>`);
school('school-capstone', 'Capstone · SEP490', 'SEP490', 'CAPSTONE PROJECT', ['#7c3aed', '#2e1065'],
  `<g transform="translate(1180 70)"><path d="M0 60 L170 0 L340 60 L170 120Z" fill="#ede9fe" fill-opacity=".55"/><path d="M70 90 V150 Q170 200 270 150 V90" fill="#ddd6fe" fill-opacity=".45"/><path d="M340 60 V150" stroke="#fde68a" stroke-width="8"/><circle cx="340" cy="156" r="12" fill="#fde68a"/></g>`);

// ─── Danh mục ────────────────────────────────────────────────────────────────
const order = { professional: 0, theme: 1, cute: 2, school: 3 };
covers.sort((a, b) => order[a.group] - order[b.group]);
writeFileSync(path.join(fe, 'src/lib/work-covers.json'), JSON.stringify(covers, null, 2) + '\n');
console.log(`${covers.length} ảnh bìa ⇒ ${path.relative(process.cwd(), outDir)}`);
