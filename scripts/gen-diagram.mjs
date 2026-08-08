/**
 * gen-diagram.mjs — dựng sơ đồ kiến trúc kiểu sách giáo khoa (hộp + mũi tên
 * đánh số + khung nét đứt + chú giải) bằng SVG rồi chụp thành PNG.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/gen-diagram.mjs --file ./content/diagrams/<slug>.mjs
 *   node scripts/gen-diagram.mjs --file ... --out ./cho-khac/so-do.png
 *
 * VÌ SAO TỒN TẠI SONG SONG VỚI MERMAID
 * Site đã có 310 sơ đồ mermaid và chúng vẫn là lựa chọn mặc định: viết nhanh,
 * sửa được, diff được, hiện thẳng trong bài. Nhưng mermaid **không cho chọn
 * chỗ đặt hộp** — thuật toán dàn trang tự quyết. Thử dựng lại Figure 13.6 của
 * sách System Design bằng mermaid thì Broker bị đẩy sang tận phải, mũi tên
 * quay lại vòng xuống dưới, và cả hình thành dải ngang 4,5:1 không dùng được
 * cho thẻ blog.
 *
 * Nên: **mermaid cho sơ đồ TRONG bài, file này cho hình CHỦ ĐẠO của bài** —
 * thứ cần ra đúng như trong đầu để đăng blog / feed / mạng xã hội.
 *
 * Cạnh nối bằng NEO theo id hộp (`'om:left'`, `'cg:right:+44'`) chứ không phải
 * toạ độ trần, nên xê dịch một hộp thì mọi mũi tên cắm vào nó tự đi theo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
if (!FILE) { console.error('cần --file ./content/diagrams/<slug>.mjs'); process.exit(1); }
const d = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const slug = path.basename(FILE, '.mjs');
const OUT = val('--out') || path.join(ROOT, '.diagrams', `${slug}.png`);

const INK = d.ink || '#2b2b33';
const LINE = d.line || '#3d3d48';
const PAPER = d.paper || '#fffdf7';
const MUTED = '#6b6b78';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const byId = Object.fromEntries((d.boxes || []).map((b) => [b.id, b]));

/**
 * Neo: 'id' | 'id:side' | 'id:side:±n'  (side = left|right|top|bottom|center)
 * `±n` dịch dọc theo cạnh — thứ cho phép xếp hai mũi tên ngược chiều song song
 * giữa cùng một cặp hộp mà không đè lên nhau.
 */
function anchor(spec) {
  if (Array.isArray(spec)) return spec;                      // toạ độ trần vẫn dùng được
  const [id, side = 'center', off = '0'] = String(spec).split(':');
  const b = byId[id];
  if (!b) throw new Error(`sơ đồ trỏ tới hộp không tồn tại: "${id}"`);
  const o = parseInt(off, 10) || 0;
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  switch (side) {
    case 'left':   return [b.x, cy + o];
    case 'right':  return [b.x + b.w, cy + o];
    case 'top':    return [cx + o, b.y];
    case 'bottom': return [cx + o, b.y + b.h];
    default:       return [cx + o, cy];
  }
}

/* ── Hình khối ────────────────────────────────────────────────────────────
   `subOutside` cho chú thích dài hơn bề rộng hộp: đặt bên trong thì nó tràn
   ra ngoài viền và bị cắt cụt — đã gặp thật khi dựng bản đầu tiên. */
function shape(b) {
  const cx = b.x + b.w / 2;
  if (b.shape === 'cylinder') {
    const ry = 12;
    return `<path d="M${b.x},${b.y + ry} a${b.w / 2},${ry} 0 0,1 ${b.w},0 v${b.h - ry * 2} a${b.w / 2},${ry} 0 0,1 ${-b.w},0 z"
        fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
      <path d="M${b.x},${b.y + ry} a${b.w / 2},${ry} 0 0,0 ${b.w},0" fill="none" stroke="${INK}" stroke-width="2"/>
      <text x="${cx}" y="${b.y + b.h / 2 + 8}" text-anchor="middle" class="lbl">${esc(b.label)}</text>`;
  }
  if (b.shape === 'monitor') {
    return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="5" fill="${INK}"/>
      <rect x="${b.x + 8}" y="${b.y + 7}" width="${b.w - 16}" height="${b.h - 18}" rx="2" fill="#4a4a58"/>
      <rect x="${cx - 14}" y="${b.y + b.h}" width="28" height="10" fill="${INK}"/>
      <rect x="${cx - 28}" y="${b.y + b.h + 10}" width="56" height="6" rx="3" fill="${INK}"/>`;
  }
  const hasInner = Boolean(b.inner);
  const labelY = hasInner ? b.y + 26 : (b.sub ? b.y + b.h / 2 - 6 : b.y + b.h / 2 + 6);
  return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${b.r ?? 4}"
        fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
    <text x="${cx}" y="${labelY}" text-anchor="middle" class="lbl">${esc(b.label)}</text>
    ${b.sub ? `<text x="${cx}" y="${b.y + b.h / 2 + 15}" text-anchor="middle" class="sub">${esc(b.sub)}</text>` : ''}
    ${hasInner ? `<rect x="${b.x + 14}" y="${b.y + 40}" width="${b.w - 28}" height="${b.h - 54}" rx="3"
        fill="none" stroke="${INK}" stroke-width="1.6"/>
      <text x="${cx}" y="${b.y + 40 + (b.h - 54) / 2 + 6}" text-anchor="middle" class="lbl">${esc(b.inner)}</text>` : ''}`;
}

/** Chú thích đặt NGOÀI hộp, nhiều dòng — cho chuỗi dài hơn bề rộng hộp. */
function outsideLabel(b) {
  if (!b.subOutside) return '';
  const cx = b.x + b.w / 2;
  return [].concat(b.subOutside).map((line, i) =>
    `<text x="${cx}" y="${b.y + b.h + 20 + i * 17}" text-anchor="middle" class="sub">${esc(line)}</text>`).join('');
}

/* ── Mũi tên ──────────────────────────────────────────────────────────────
   ⚠ Huy hiệu số và nhãn chữ phải TÁCH chỗ nhau: đặt cả hai quanh điểm giữa
   đường thì chúng chồng lên nhau và cả hai đều không đọc được. */
function edge(e) {
  const pts = [anchor(e.from), ...(e.via || []).map(anchor), anchor(e.to)];
  const dash = e.kind === 'dash' ? '8 6' : e.kind === 'dot' ? '2 5' : '';
  const head = e.kind === 'dot' ? 'url(#headOpen)' : 'url(#head)';
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ');
  const i = Math.floor((pts.length - 1) / 2);
  const bx = e.bx ?? (pts[i][0] + pts[i + 1][0]) / 2;
  const by = e.by ?? (pts[i][1] + pts[i + 1][1]) / 2;
  return `<path d="${path}" fill="none" stroke="${LINE}" stroke-width="1.9"
      ${dash ? `stroke-dasharray="${dash}"` : ''} marker-end="${head}"/>
    ${e.badge ? `<circle cx="${bx}" cy="${by}" r="13" fill="${PAPER}" stroke="${INK}" stroke-width="1.7"/>
      <text x="${bx}" y="${by + 5}" text-anchor="middle" class="badge">${esc(e.badge)}</text>` : ''}
    ${e.label ? `<text x="${e.lx ?? bx}" y="${e.ly ?? by - 20}" text-anchor="middle" class="sub">${esc(e.label)}</text>` : ''}`;
}

const W = d.canvas?.w ?? 1560, H = d.canvas?.h ?? 900;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <marker id="head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 z" fill="${LINE}"/></marker>
  <marker id="headOpen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10" fill="none" stroke="${LINE}" stroke-width="1.6"/></marker>
</defs>
<style>
  .lbl{font-family:"Quicksand",system-ui,sans-serif;font-size:16px;font-weight:700;fill:${INK}}
  .sub{font-family:"Quicksand",system-ui,sans-serif;font-size:12.5px;font-weight:600;fill:${MUTED}}
  .badge{font-family:"Quicksand",system-ui,sans-serif;font-size:13px;font-weight:800;fill:${INK}}
  .cap{font-family:"Quicksand",system-ui,sans-serif;font-size:14px;font-weight:700;fill:${MUTED}}
</style>
<rect width="${W}" height="${H}" fill="${PAPER}"/>
${(d.boundaries || []).map((b) => `
  <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="6" fill="none"
        stroke="#8b8b96" stroke-width="1.8" stroke-dasharray="9 7"/>
  ${b.label ? `<text x="${b.x + b.w - 30}" y="${b.y + b.h - 22}" text-anchor="end" class="cap">${esc(b.label)}</text>` : ''}`).join('')}
${(d.boxes || []).map(shape).join('')}
${(d.boxes || []).map(outsideLabel).join('')}
${(d.edges || []).map(edge).join('')}
${d.legend ? `
  <rect x="${d.legend.x}" y="${d.legend.y}" width="270" height="${28 + d.legend.items.length * 45}" rx="6"
        fill="${PAPER}" stroke="${INK}" stroke-width="1.8"/>
  ${d.legend.items.map((it, i) => {
    const y = d.legend.y + 38 + i * 45;
    return edge({ from: [d.legend.x + 22, y], to: [d.legend.x + 88, y], badge: it.badge, kind: it.kind })
      + `<text x="${d.legend.x + 106}" y="${y + 6}" class="lbl">${esc(it.label)}</text>`;
  }).join('')}` : ''}
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700;800&display=swap&subset=vietnamese,latin" rel="stylesheet">
<style>body{margin:0;background:${PAPER}}</style></head><body>${svg}</body></html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);

/* Kiểm BỘ KIỂM trước khi tin kết quả — font chưa về thì hình vẫn chụp được
   nhưng sai hoàn toàn diện mạo và dấu tiếng Việt có thể rớt. */
const fontOk = await pg.evaluate(() => document.fonts.check('700 16px "Quicksand"'));
if (!fontOk) { console.error('✗ font Quicksand chưa tải được — dừng lại.'); await browser.close(); process.exit(1); }

/* Hộp tràn ra ngoài khung vẽ là lỗi hay gặp nhất khi đặt toạ độ tay. */
const overflow = (d.boxes || []).filter((b) => b.x < 0 || b.y < 0 || b.x + b.w > W || b.y + b.h > H);
if (overflow.length) {
  console.error('✗ hộp tràn ra ngoài khung vẽ:', overflow.map((b) => b.id).join(', '));
  await browser.close(); process.exit(1);
}

await pg.screenshot({ path: OUT });
await browser.close();
console.log(`✓ ${d.boxes?.length ?? 0} hộp · ${d.edges?.length ?? 0} mũi tên · font OK · không hộp nào tràn khung`);
console.log(`✓ ${path.relative(ROOT, OUT)} — ${W}×${H} @2x · ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
