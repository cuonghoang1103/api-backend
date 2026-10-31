/**
 * _nfd-chung.mjs — khuôn slide khoá /courses/networking-for-developers (deck nfd-NN-X, 31/10/2026).
 *
 * = KHUÔN CHUẨN PostgreSQL (`_pg-chung.mjs`, chủ kênh chốt 25/10: slide TIẾNG ANH, dáng slide trường FU, logo CuongThai.com,
 * dải chân cam–nâu, lấp đều khung) — tệp này KHÔNG chép lại CSS/khung mà import thẳng (sửa khuôn một chỗ, mọi khoá theo),
 * rồi thêm những hình riêng của mạng:
 *   lamDeck(meta, items)      — lamDeck của PG với khoa/duong/bieuTuong/khau của khoá này
 *   envelope(parts)           — các lớp header lồng nhau như phong bì (Ethernet ⊃ IP ⊃ TCP ⊃ dữ liệu)
 *   bytebar(parts)            — thước byte: mỗi lớp rộng theo số byte thật
 *   hexdump(lines, ranges)    — hex dump (dạng tshark -x) tô màu từng byte theo lớp
 *   seq(a, b, rows)           — sơ đồ trình tự hai máy (mũi tên qua lại theo thời gian)
 *   topo()                    — sơ đồ phòng lab LabFlow (client — router — web — api)
 *   stack4()                  — 4 tầng TCP/IP đặt cạnh 7 tầng OSI, kèm "nằm ở đâu trong máy"
 * Màu tầng dùng thống nhất cả khoá: LINK tím · IP lam · TCP/UDP lục · ỨNG DỤNG cam.
 * Chữ SVG: rộng ≈ 0,602 × font-size mỗi ký tự đơn cách; Arial ≈ 0,55 — đặt nhãn bằng công thức, MỞ ẢNH RA NHÌN.
 */
export * from './_pg-chung.mjs';
import { lamDeck as lamDeckPg, esc } from './_pg-chung.mjs';

export const C = { link: '#7c3aed', ip: '#336791', tcp: '#2f7d4f', app: '#e06d10', phy: '#8a8a8a', br: '#b85a2b', or: '#e08a1e', red: '#c0392b', gy: '#8a8a8a' };
export const LAYER = { link: 'Link (Ethernet)', ip: 'Internet (IP)', tcp: 'Transport (TCP)', app: 'Application (HTTP)' };

/**
 * TỰ LẤP KHUNG (31/10/2026, sau duyệt đợt mẫu: "không để 1/4 dưới trống", "không tràn mép phải"). Mỗi slide nội dung mang một
 * đoạn script nhỏ chạy lúc render: gói nội dung .nd vào một khối rồi tìm hệ số phóng (CSS zoom) LỚN NHẤT trong [0,8; 1,5] sao cho
 *   • không khối mã nào bị cắt ngang (pre.scrollWidth ≤ clientWidth) và .nd không tràn ngang;
 *   • nội dung cao ≤ 96 % vùng .nd.
 * ⇒ slide ít chữ tự to lên lấp khung, slide nhiều chữ tự co vừa. Hình SVG co giãn theo bề ngang (max-width:100%).
 * Kiểm bằng scripts/_kiem-lap-day-slide.mjs (tràn ngang + vùng nội dung < 70 %). Tắt cho một slide: { tuLap: false }.
 */
const TU_LAP = `<style>.pg .nd svg{max-width:100%;height:auto}.pg .nd .hai>*,.pg .nd .ba>*,.pg .nd .vsd>*{min-width:0}</style><script>(function(){var nd=document.querySelector('.pg .nd');if(!nd||nd.dataset.lap)return;nd.dataset.lap='1';
var cs=getComputedStyle(nd),w=document.createElement('div');w.className='nfd-lap';w.style.cssText='display:flex;flex-direction:column;min-width:0;gap:'+cs.rowGap;
while(nd.firstChild)w.appendChild(nd.firstChild);nd.appendChild(w);var avail=nd.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
function ok(z){w.style.zoom=z;if(nd.scrollWidth>nd.clientWidth+1)return false;var R=nd.getBoundingClientRect().right-parseFloat(cs.paddingRight)+2,E=w.querySelectorAll('pre,.term,table,svg,.o,.card,img');for(var j=0;j<E.length;j++)if(E[j].getBoundingClientRect().right>R)return false;var p=w.querySelectorAll('pre');for(var i=0;i<p.length;i++)if(p[i].scrollWidth>p[i].clientWidth+2)return false;return w.getBoundingClientRect().height<=avail*0.96;}
var lo=0.8,hi=1.5;if(ok(1))lo=1;else hi=1;for(var k=0;k<12;k++){var m=(lo+hi)/2;if(ok(m))lo=m;else hi=m;}w.style.zoom=lo;nd.dataset.zoom=lo.toFixed(2);})();</script>`;

export function lamDeck(meta, items) {
  const out = lamDeckPg({ khoa: 'Networking for Developers', duong: 'courses/networking-for-developers', bieuTuong: '🌐', khau: 'from zero to production networks', ...meta }, items);
  return out.map((s, i) => (items[i].cover || items[i].tuLap === false ? s : { ...s, body: s.body + TU_LAP }));
}

/* ── nguyên tố SVG ── */
export const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}${o.i ? ' font-style="italic"' : ''}>${s}</text>`;
export const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
export const MK = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
export const A = (x1, y1, x2, y2, id, c, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 3}"${o.dash ? ' stroke-dasharray="7 5"' : ''} marker-end="url(#${id})"/>`;
export const tw = (s, fs, mono = true) => Math.ceil(String(s).length * (mono ? 0.602 : 0.55) * fs);
export const svg = (w, h, body, defs = '') => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>`;

/**
 * Phong bì lồng nhau. parts từ NGOÀI vào TRONG: [{ k:'link', t:'Ethernet header', b:14, s:'dst MAC · src MAC · type' }, …, { k:'app', t:'HTTP request', b:83, s:'GET /api/hello …' }]
 */
export function envelope(parts, opts = {}) {
  const { w = 1110, h = 300, pad = 16, strip = 196, fs = 19 } = opts;
  let s = '';
  parts.forEach((p, i) => {
    const x = i * pad, y = i * (pad + 26), ww = w - 2 * i * pad, hh = h - i * (pad + 26) - i * pad;
    const c = C[p.k] || C.gy;
    s += R(x + 2, y + 2, ww - 4, hh - 4, c + '12', c, { rx: 12 });
    s += T(x + 18, y + 30, `${p.t}${p.b !== undefined ? ` — ${p.b} B` : ''}`, fs, { w: 800, f: c });
    if (p.s) s += T(x + ww - 18, y + 30, esc(p.s), fs - 4, { a: 'end', f: '#555', m: 1 });
  });
  void strip;
  return svg(w, h, s);
}

/** Thước byte. parts: [{ k:'link', t:'Ethernet', b:14 }, …] — rộng theo số byte, nhãn trong hoặc dưới nếu hẹp. */
export function bytebar(parts, opts = {}) {
  const { w = 1110, h = 118, fs = 18, tong = true, minW = 92 } = opts;
  const total = parts.reduce((a, p) => a + p.b, 0);
  // mỗi phần ít nhất minW px để còn chữ; phần còn lại chia theo byte
  const base = parts.length * minW, rest = w - base;
  let x = 0, s = '';
  parts.forEach((p) => {
    const ww = minW + rest * (p.b / total);
    const c = C[p.k] || C.gy;
    s += R(x + 1, 6, ww - 2, 58, c + '22', c, { rx: 6, sw: 2 });
    s += T(x + ww / 2, 32, p.t, fs, { a: 'middle', w: 800, f: c });
    s += T(x + ww / 2, 55, `${p.b} B`, fs - 2, { a: 'middle', f: '#333', m: 1 });
    x += ww;
  });
  if (tong) s += T(w / 2, 98, `${parts.map((p) => p.b).join(' + ')} = ${total} bytes on the wire`, fs + 2, { a: 'middle', w: 700, f: C.br, m: 1 });
  return svg(w, h, s);
}

/**
 * Hex dump kiểu `tshark -x`: lines = ['0000  02 00 0a …', …] (chép NGUYÊN output thật). ranges = [[from, to, k]] (byte
 * offset bao gồm cả hai đầu) ⇒ tô màu nền theo lớp. Không vẽ cột ASCII nếu opts.ascii === false.
 */
export function hexdump(lines, ranges, opts = {}) {
  const { fs = 17, ascii = true, legend = true } = opts;
  const colorOf = (i) => { const r = ranges.find(([a, b]) => i >= a && i <= b); return r ? C[r[2]] : null; };
  const rows = lines.map((l) => {
    const m = l.match(/^([0-9a-f]{4})\s{2}((?:[0-9a-f]{2} ?){1,16})\s*(.*)$/);
    if (!m) return `<div>${esc(l)}</div>`;
    const off = parseInt(m[1], 16);
    const bytes = m[2].trim().split(' ');
    const cells = bytes.map((b, j) => { const c = colorOf(off + j); return `<span style="${c ? `background:${c}26;color:${c};` : ''}padding:0 2px;border-radius:3px;font-weight:${c ? 700 : 400}">${b}</span>`; }).join(' ');
    return `<div><span style="color:#888">${m[1]}</span>&nbsp;&nbsp;${cells}${ascii ? `&nbsp;&nbsp;<span style="color:#999">${esc(m[3])}</span>` : ''}</div>`;
  });
  const lg = legend ? `<div style="display:flex;gap:18px;margin-top:6px;font-family:Arial;font-size:16px">${[...new Set(ranges.map((r) => r[2]))].map((k) => `<span><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${C[k]};vertical-align:-2px"></span> ${LAYER[k] || k}</span>`).join('')}</div>` : '';
  return `<div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:${fs}px;line-height:1.5;background:#fbfaf7;border:1.5px solid #e3dccf;border-radius:9px;padding:10px 14px;white-space:nowrap">${rows.join('')}${lg}</div>`;
}

/**
 * Sơ đồ trình tự hai máy. rows: [{ d:'r'|'l', t:'SYN', s?:'seq=0', c?:màu, ms?:'0.000' }]
 */
export function seq(a, b, rows, opts = {}) {
  const { w = 1110, rowH = 40, top = 52, fs = 18 } = opts;
  const h = top + rows.length * rowH + 14;
  const xa = 150, xb = w - 150;
  let s = '';
  s += R(xa - 120, 4, 240, 38, '#eef4fa', C.ip, { rx: 8 }) + T(xa, 30, a, fs, { a: 'middle', w: 800, f: C.ip });
  s += R(xb - 120, 4, 240, 38, '#eef4fa', C.ip, { rx: 8 }) + T(xb, 30, b, fs, { a: 'middle', w: 800, f: C.ip });
  s += `<line x1="${xa}" y1="42" x2="${xa}" y2="${h}" stroke="#bbb" stroke-width="2" stroke-dasharray="4 4"/><line x1="${xb}" y1="42" x2="${xb}" y2="${h}" stroke="#bbb" stroke-width="2" stroke-dasharray="4 4"/>`;
  let defs = '';
  const used = new Set();
  rows.forEach((r, i) => {
    const c = r.c || C.tcp, id = 'sq' + c.slice(1);
    if (!used.has(id)) { used.add(id); defs += MK(id, c); }
    const y = top + i * rowH + 16;
    const [x1, x2] = r.d === 'r' ? [xa + 4, xb - 6] : [xb - 4, xa + 6];
    s += A(x1, y, x2, y + 12, id, c, { sw: 2.6, dash: r.dash });
    s += T((xa + xb) / 2, y - 3, r.t, fs, { a: 'middle', w: 800, f: c, m: 1 });
    if (r.s) s += T(r.d === 'r' ? xb + 10 : xa - 10, y + 12, esc(r.s), fs - 4, { a: r.d === 'r' ? 'start' : 'end', f: '#555', m: 1 });
    if (r.ms) s += T(r.d === 'r' ? xa - 10 : xb + 10, y + 12, r.ms, fs - 5, { a: r.d === 'r' ? 'end' : 'start', f: '#999', m: 1 });
  });
  return svg(w, h, s, defs);
}

/** Phòng lab LabFlow: client/client2 — switch nfd-lan — router — switch nfd-dmz — web (nginx) → api (Node). */
export function topo(opts = {}) {
  const { w = 1110, h = 300, hl = [] } = opts;
  const on = (k) => hl.includes(k);
  const box = (x, y, ww, hh, t1, t2, t3, k, c) => R(x, y, ww, hh, on(k) ? '#fff3c4' : c + '12', c, { rx: 10, sw: on(k) ? 3.5 : 2.5 }) +
    T(x + ww / 2, y + 28, t1, 19, { a: 'middle', w: 800, f: c }) + T(x + ww / 2, y + 52, t2, 15, { a: 'middle', m: 1 }) + (t3 ? T(x + ww / 2, y + 72, t3, 13, { a: 'middle', m: 1, f: '#777' }) : '');
  let s = '';
  // hai "switch" (bridge Docker)
  s += R(222, 128, 150, 44, '#f3eefe', C.link, { rx: 8 }) + T(297, 156, 'switch nfd-lan', 15, { a: 'middle', w: 700, f: C.link });
  s += R(740, 128, 150, 44, '#f3eefe', C.link, { rx: 8 }) + T(815, 156, 'switch nfd-dmz', 15, { a: 'middle', w: 700, f: C.link });
  s += box(10, 20, 190, 80, 'client', '10.10.1.10', '02:00:0a:0a:01:0a', 'client', C.ip);
  s += box(10, 200, 190, 80, 'client2', '10.10.1.11', '02:00:0a:0a:01:0b', 'client2', C.ip);
  s += box(450, 100, 210, 100, 'router', '.1.254 | .2.254', 'forwards between nets', 'router', C.br);
  s += box(910, 20, 190, 80, 'web (nginx :80)', '10.10.2.10', '02:00:0a:0a:02:0a', 'web', C.app);
  s += box(910, 200, 190, 80, 'api (Node :3000)', '10.10.2.20', '02:00:0a:0a:02:14', 'api', C.tcp);
  const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#999" stroke-width="3"/>`;
  s += ln(200, 60, 240, 128) + ln(200, 240, 240, 172) + ln(372, 150, 450, 150) + ln(660, 150, 740, 150) + ln(890, 128, 920, 100) + ln(890, 172, 920, 200);
  s += T(297, 116, 'LAN 10.10.1.0/24', 15, { a: 'middle', f: C.link, w: 700 }) + T(815, 116, 'DMZ 10.10.2.0/24', 15, { a: 'middle', f: C.link, w: 700 });
  return svg(w, h, s);
}

/** 4 tầng TCP/IP (giữa) ↔ 7 tầng OSI (trái) ↔ "nằm ở đâu" (phải). */
export function stack4(opts = {}) {
  const { w = 1110, h = 400, hl } = opts;
  const rows = [
    ['app', 'Application', ['7 Application', '6 Presentation', '5 Session'], 'your program: browser, curl, nginx, Node', 'HTTP, DNS, TLS*'],
    ['tcp', 'Transport', ['4 Transport'], 'kernel: socket buffers, ports', 'TCP, UDP, QUIC*'],
    ['ip', 'Internet', ['3 Network'], 'kernel: routing table, IP header', 'IPv4, IPv6, ICMP'],
    ['link', 'Link', ['2 Data link', '1 Physical'], 'driver + network chip + cable/Wi-Fi', 'Ethernet, Wi-Fi, ARP'],
  ];
  const unit = (h - 10) / 7;
  let y = 4, s = '';
  rows.forEach(([k, name, osi, where, ex]) => {
    const hh = unit * osi.length - 6, c = C[k], dim = hl && !hl.includes(k);
    s += `<g opacity="${dim ? 0.3 : 1}">`;
    osi.forEach((o, j) => { s += R(4, y + j * unit, 220, unit - 6, '#f7f7f7', '#bbb', { rx: 6, sw: 1.5 }) + T(18, y + j * unit + unit / 2 + 3, o, 16, { f: '#666' }); });
    s += R(244, y, 300, hh, c + '1c', c, { rx: 10 }) + T(394, y + hh / 2 - 4, name, 24, { a: 'middle', w: 800, f: c }) + T(394, y + hh / 2 + 22, ex, 15, { a: 'middle', f: '#555' });
    s += T(566, y + hh / 2 + 6, '← ' + where, 18, { f: '#333' });
    s += '</g>';
    y += unit * osi.length;
  });
  s += T(4, h - 0, '', 1);
  return svg(w, h, s);
}

/** Bảng VĂN XUÔI chữ to (Arial, đầu cam, sọc) — dùng thay tbl() (bảng dữ liệu mono) khi ô là câu chữ. */
export function bang(cols, rows, opts = {}) {
  const { fs = 21, w } = opts;
  return `<table class="t" style="font-size:${fs}px;line-height:1.32${w ? `;width:${w}px` : ''}"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
}

/**
 * Ngắt một dòng lệnh dài thành nhiều dòng nối bằng " \\" (như người gõ trong terminal). Chỉ ngắt ở khoảng trắng NGOÀI dấu
 * nháy đơn (trong nháy đơn, "\\ + xuống dòng" bị giữ nguyên chữ nên lệnh sẽ khác); trong nháy kép bash bỏ "\\ + xuống dòng" nên
 * vẫn đúng lệnh cũ. Dòng tiếp theo thụt 4 dấu cách.
 */
export function gayLenh(line, max = 104) {
  if (line.length <= max) return [line];
  const out = []; let cur = '', q = '', lastBreak = -1;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === q) q = ''; } else if (ch === "'" || ch === '"') q = ch;
    cur += ch;
    if (ch === ' ' && q !== "'") lastBreak = cur.length;
    if (cur.length >= max && lastBreak > 8) {
      out.push(cur.slice(0, lastBreak - 1) + ' \\');
      cur = '    ' + cur.slice(lastBreak); lastBreak = -1;
    }
  }
  out.push(cur);
  return out;
}

/* ── output THẬT đọc thẳng từ content/courses/networking-for-developers/lab/out (cùng nguồn với bài đọc) ── */
import fs from 'node:fs';
const OUT = new URL('../../content/courses/networking-for-developers/lab/out/', import.meta.url);
const outCache = new Map();
/**
 * ra('c11-tang', 'ip route get', 1, { drop: /regex/, max: 8, cut: 110 }) — NGUYÊN VĂN n lệnh (kèm output) bắt đầu từ lệnh có
 * tiền tố đó; lệnh không còn ⇒ ném lỗi. opts.drop bỏ dòng khớp; opts.max cắt bớt dòng (thêm "…"); opts.cut cắt dòng quá dài.
 */
export function ra(name, prefix, n = 1, opts = {}) {
  if (!outCache.has(name)) outCache.set(name, fs.readFileSync(new URL(`${name}.out.txt`, OUT), 'utf8').replace(/\r$/gm, '').split('\n'));
  const L = outCache.get(name);
  const all = L.map((l, k) => (l.startsWith(`$ ${prefix}`) ? k : -1)).filter((k) => k >= 0);
  const i = all[(opts.lan ?? 1) - 1] ?? -1;   // opts.lan = lần xuất hiện thứ mấy của lệnh (mặc định lần đầu)
  if (i < 0) throw new Error(`out/${name}.out.txt: không có lệnh "$ ${prefix}" (lần ${opts.lan ?? 1})`);
  let j = i + 1, seen = 1;
  for (; j < L.length; j++) if (L[j].startsWith('$ ')) { if (seen >= n) break; seen++; }
  let seg = L.slice(i, j);
  while (seg.length && seg[seg.length - 1] === '') seg.pop();
  if (opts.drop) seg = seg.filter((l, k) => k === 0 || !opts.drop.test(l));
  if (opts.boLenh) seg = seg.filter((l) => !l.startsWith('$ '));   // chỉ lấy OUTPUT (để tách số liệu theo dòng)
  seg = seg.flatMap((l) => (l.startsWith('$ ') ? gayLenh(l, opts.gay ?? 104) : [l]));
  if (opts.cut) seg = seg.map((l) => (l.length > opts.cut ? l.slice(0, opts.cut - 1) + '…' : l));
  if (opts.max && seg.length > opts.max) seg = [...seg.slice(0, opts.max), '…'];
  return seg.join('\n');
}
