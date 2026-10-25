/**
 * pg-04-hinh — hình SVG dùng chung cho 4 deck chương 4 (pg-04-1 … pg-04-4). Chữ SVG đơn cách: rộng ≈ 0,602 × cỡ chữ mỗi ký tự.
 * Mọi hàm trả chuỗi SVG/HTML nội tuyến, rộng 1110.
 */
import { esc } from './_pg-chung.mjs';

const CW = 0.602;
export const PGB = '#336791', ORG = '#e08a1e', BRN = '#b85a2b', GRN = '#2f7d4f', RED = '#c0392b';

/** Mũi tên thẳng. */
export const mui = (x1, y1, x2, y2, mau = BRN, w = 3) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 12;
  const p = (da) => `${x2 - L * Math.cos(a + da)},${y2 - L * Math.sin(a + da)}`;
  return `<line x1="${x1}" y1="${y1}" x2="${x2 - 4 * Math.cos(a)}" y2="${y2 - 4 * Math.sin(a)}" stroke="${mau}" stroke-width="${w}"/>` +
    `<path d="M${x2},${y2} L${p(0.45)} L${p(-0.45)} z" fill="${mau}"/>`;
};

/** Một câu lệnh chia đoạn, mỗi đoạn có nhãn bên dưới: segs = [[mã, nhãn, màu?]]. */
export function anatomy(segs, { fs = 22, y = 44, w = 1110, gap = 1 } = {}) {
  const cw = CW * fs;
  const total = segs.reduce((n, s) => n + s[0].length, 0) + gap * (segs.length - 1);
  let x = Math.max(8, (w - total * cw) / 2);
  const cols = [PGB, ORG, GRN, BRN, '#7a5a9a'];
  let svg = `<svg viewBox="0 0 ${w} 170" width="${w}" height="170" font-family="Arial">`;
  segs.forEach((s, i) => {
    const mau = s[2] || cols[i % cols.length], wid = s[0].length * cw;
    svg += `<text x="${x}" y="${y}" font-family="Menlo,Consolas,monospace" font-size="${fs}" font-weight="700" fill="#262626" xml:space="preserve" data-k="seg">${esc(s[0])}</text>`;
    svg += `<path d="M${x},${y + 12} v8 h${wid} v-8" fill="none" stroke="${mau}" stroke-width="3.5"/>`;
    const dy = i % 2 ? 80 : 58;
    svg += `<line x1="${x + wid / 2}" y1="${y + 20}" x2="${x + wid / 2}" y2="${y + dy - 18}" stroke="${mau}" stroke-width="2"/>`;
    svg += `<text x="${x + wid / 2}" y="${y + dy + 8}" text-anchor="middle" font-size="19" font-weight="800" fill="${mau}">${s[1]}</text>`;
    x += (s[0].length + gap) * cw;
  });
  return svg + '</svg>';
}

/** Hai kiểu đi giao hàng: nhiều chuyến một thùng vs một chuyến nhiều thùng. */
export function chuyen() {
  const box = (x, y, s = 1) => `<rect x="${x}" y="${y}" width="${30 * s}" height="${26 * s}" rx="4" fill="#f6d9a8" stroke="#b85a2b" stroke-width="2"/><line x1="${x}" y1="${y + 9 * s}" x2="${x + 30 * s}" y2="${y + 9 * s}" stroke="#b85a2b" stroke-width="1.5"/>`;
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  // trái
  s += `<rect x="10" y="10" width="520" height="280" rx="14" fill="#fdf0ee" stroke="${RED}" stroke-width="2.5" data-k="trip-bad"/>`;
  s += `<text x="270" y="46" text-anchor="middle" font-size="24" font-weight="800" fill="#a52a1d">5 statements = 5 round trips</text>`;
  s += `<rect x="30" y="70" width="110" height="184" rx="10" fill="#fff" stroke="#999" stroke-width="2"/><text x="85" y="176" text-anchor="middle" font-size="22" font-weight="700" fill="#333">app</text>`;
  s += `<rect x="400" y="70" width="110" height="184" rx="10" fill="#eef4fa" stroke="${PGB}" stroke-width="2"/><text x="455" y="165" text-anchor="middle" font-size="42">🐘</text><text x="455" y="205" text-anchor="middle" font-size="20" font-weight="700" fill="${PGB}">server</text>`;
  for (let i = 0; i < 5; i++) {
    const y = 98 + i * 36;
    s += mui(150, y, 392, y, RED, 2.5) + box(300, y - 22, 0.7) + `<text x="160" y="${y - 6}" font-size="16" fill="#a52a1d" font-weight="700">INSERT #${i + 1}</text>`;
  }
  s += `<text x="270" y="278" text-anchor="middle" font-size="18" fill="#a52a1d" font-weight="700">each trip: network wait + its own commit</text>`;
  // phải
  s += `<rect x="580" y="10" width="520" height="280" rx="14" fill="#f1f9f4" stroke="${GRN}" stroke-width="2.5" data-k="trip-good"/>`;
  s += `<text x="840" y="46" text-anchor="middle" font-size="24" font-weight="800" fill="#1f6b40">1 statement, 5 rows = 1 trip</text>`;
  s += `<rect x="600" y="70" width="110" height="184" rx="10" fill="#fff" stroke="#999" stroke-width="2"/><text x="655" y="176" text-anchor="middle" font-size="22" font-weight="700" fill="#333">app</text>`;
  s += `<rect x="970" y="70" width="110" height="184" rx="10" fill="#eef4fa" stroke="${PGB}" stroke-width="2"/><text x="1025" y="165" text-anchor="middle" font-size="42">🐘</text><text x="1025" y="205" text-anchor="middle" font-size="20" font-weight="700" fill="${PGB}">server</text>`;
  s += mui(720, 160, 962, 160, GRN, 4);
  for (let i = 0; i < 5; i++) s += box(752 + i * 38, 124 + (i % 2) * 6, 1);
  s += `<text x="840" y="225" text-anchor="middle" font-size="16" fill="#1f6b40" font-weight="700" xml:space="preserve">VALUES (…), (…), (…), (…), (…)</text>`;
  s += `<text x="840" y="278" text-anchor="middle" font-size="18" fill="#1f6b40" font-weight="700">one wait, one commit</text>`;
  return s + '</svg>';
}

/** Cột đo thời gian (thang log). rows: [[nhãn, giây, màu, chữ]] */
export function cotDo(rows, { w = 1110, fs = 22 } = {}) {
  const lo = Math.log10(0.05), hi = Math.log10(30);
  const x0 = 360, wmax = w - x0 - 200;
  let s = `<svg viewBox="0 0 ${w} ${rows.length * 74 + 50}" width="${w}" height="${rows.length * 74 + 50}" font-family="Arial">`;
  rows.forEach(([nhan, sec, mau, chu], i) => {
    const y = 14 + i * 74, ww = Math.max(24, wmax * (Math.log10(sec) - lo) / (hi - lo));
    s += `<text x="${x0 - 16}" y="${y + 38}" text-anchor="end" font-size="${fs}" font-weight="700" fill="#333">${nhan}</text>`;
    s += `<rect x="${x0}" y="${y}" width="${ww}" height="56" rx="8" fill="${mau}" data-k="cot"/>`;
    s += `<text x="${x0 + ww + 14}" y="${y + 38}" font-size="${fs + 2}" font-weight="800" fill="${mau}">${chu}</text>`;
  });
  s += `<text x="${x0}" y="${rows.length * 74 + 34}" font-size="16" fill="#777">bar length is on a log scale (each step right ≈ ×4)</text>`;
  return s + '</svg>';
}

/** Sơ đồ rẽ nhánh UPSERT. */
export function rePhim() {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  s += `<rect x="10" y="125" width="210" height="80" rx="12" fill="#fff7ef" stroke="${ORG}" stroke-width="3" data-k="up-in"/><text x="115" y="160" text-anchor="middle" font-size="22" font-weight="800" fill="${BRN}">new row</text><text x="115" y="188" text-anchor="middle" font-size="18" fill="#555">('sql', 1)</text>`;
  s += mui(222, 165, 330, 165, BRN);
  s += `<path d="M450,95 L570,165 L450,235 L330,165 z" fill="#eef4fa" stroke="${PGB}" stroke-width="3" data-k="up-q"/><text x="450" y="158" text-anchor="middle" font-size="19" font-weight="800" fill="${PGB}">key already</text><text x="450" y="182" text-anchor="middle" font-size="19" font-weight="800" fill="${PGB}">in the table?</text>`;
  s += mui(450, 95, 450, 52, GRN) + `<text x="468" y="76" font-size="19" font-weight="800" fill="${GRN}">NO</text>`;
  s += `<rect x="330" y="8" width="240" height="44" rx="10" fill="#f1f9f4" stroke="${GRN}" stroke-width="3" data-k="up-ins"/><text x="450" y="37" text-anchor="middle" font-size="21" font-weight="800" fill="#1f6b40">plain INSERT</text>`;
  s += mui(570, 165, 690, 110, RED) + `<text x="600" y="120" font-size="19" font-weight="800" fill="${RED}">YES</text>`;
  s += mui(570, 165, 690, 230, RED);
  s += `<rect x="690" y="76" width="410" height="70" rx="12" fill="#fff7ef" stroke="${ORG}" stroke-width="3" data-k="up-upd"/><text x="895" y="108" text-anchor="middle" font-size="22" font-weight="800" fill="${BRN}">DO UPDATE SET …</text><text x="895" y="134" text-anchor="middle" font-size="18" fill="#555">change the existing row (hits + 1)</text>`;
  s += `<rect x="690" y="196" width="410" height="70" rx="12" fill="#f3f3f3" stroke="#888" stroke-width="3" data-k="up-non"/><text x="895" y="228" text-anchor="middle" font-size="22" font-weight="800" fill="#444">DO NOTHING</text><text x="895" y="254" text-anchor="middle" font-size="18" fill="#555">skip the new row, leave the old one</text>`;
  s += `<text x="555" y="312" text-anchor="middle" font-size="19" fill="#555">all in ONE atomic statement — no gap between “check” and “write”</text>`;
  return s + '</svg>';
}

/** Băng chuyền thứ tự thực thi (tĩnh): các trạm + số + từ khoá. on = chỉ số trạm tô. */
export function bangChuyen(st, { w = 1110, hi = -1 } = {}) {
  const n = st.length, gap = 26, bw = (w - gap * (n - 1)) / n;
  let s = `<svg viewBox="0 0 ${w} 190" width="${w}" height="190" font-family="Arial">`;
  s += `<rect x="0" y="118" width="${w}" height="14" rx="7" fill="#cbd5e1"/>`;
  for (let x = 6; x < w - 12; x += 28) s += `<rect x="${x}" y="122" width="14" height="6" rx="3" fill="#94a3b8"/>`;
  st.forEach(([kw, sub], i) => {
    const x = i * (bw + gap), on = i === hi, m = on ? ORG : PGB;
    s += `<g data-k="st"><rect x="${x}" y="14" width="${bw}" height="84" rx="12" fill="${on ? '#fff3c4' : '#eef4fa'}" stroke="${m}" stroke-width="3"/>`;
    s += `<circle cx="${x + 24}" cy="38" r="15" fill="${m}"/><text x="${x + 24}" y="45" text-anchor="middle" font-size="19" font-weight="800" fill="#fff">${i + 1}</text>`;
    s += `<text x="${x + bw / 2 + 12}" y="48" text-anchor="middle" font-family="Menlo,monospace" font-size="${bw < 160 ? 19 : 21}" font-weight="800" fill="#262626">${kw}</text>`;
    s += `<text x="${x + bw / 2}" y="82" text-anchor="middle" font-size="16" fill="#555">${sub}</text></g>`;
    if (i < n - 1) s += mui(x + bw + 2, 56, x + bw + gap - 2, 56, BRN, 2.5);
    s += `<text x="${x + bw / 2}" y="170" text-anchor="middle" font-size="26">📦</text>`;
  });
  return s + '</svg>';
}

/** Dải dòng: OFFSET phải đọc rồi bỏ vs keyset nhảy thẳng. */
export function offsetKeyset() {
  const cell = (x, y, mau, t) => `<rect x="${x}" y="${y}" width="40" height="34" rx="5" fill="${mau}" stroke="#fff" stroke-width="2"/>` + (t ? `<text x="${x + 20}" y="${y + 23}" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">${t}</text>` : '');
  const N = 24;
  let s = `<svg viewBox="0 0 1110 290" width="1110" height="290" font-family="Arial">`;
  s += `<text x="10" y="26" font-size="22" font-weight="800" fill="${RED}">OFFSET 18 LIMIT 4 — read 22 rows, throw away 18</text>`;
  for (let i = 0; i < N; i++) {
    const x = 10 + (i % 24) * 45, kind = i < 18 ? '#b9b9b9' : i < 22 ? GRN : '#e3e3e3';
    s += cell(x, 40, kind, i < 22 ? String(i + 1) : '');
  }
  s += `<text x="${10 + 9 * 45}" y="100" text-anchor="middle" font-size="18" fill="#a52a1d" font-weight="700">↑ visited, counted, then discarded</text>`;
  s += `<text x="${10 + 20 * 45}" y="100" text-anchor="middle" font-size="18" fill="#1f6b40" font-weight="700">↑ the page</text>`;
  s += `<text x="10" y="168" font-size="22" font-weight="800" fill="${GRN}">keyset: WHERE (created_at, id) &lt; (last seen) — jump, then read 4</text>`;
  for (let i = 0; i < N; i++) {
    const x = 10 + (i % 24) * 45, kind = i === 17 ? ORG : i < 18 ? '#e3e3e3' : i < 22 ? GRN : '#e3e3e3';
    s += cell(x, 184, kind, i === 17 ? '▼' : i >= 18 && i < 22 ? String(i + 1) : '');
  }
  s += mui(10 + 17 * 45 + 20, 262, 10 + 17 * 45 + 20, 224, ORG, 3);
  s += `<text x="${10 + 17 * 45 + 30}" y="274" font-size="18" fill="${BRN}" font-weight="800">index finds the cursor directly</text>`;
  return s + '</svg>';
}

/** Lưới bảng đơn hàng: tô sạch (trạng thái) hoặc bị quét đỏ. mode: 'ok' | 'red' | 'few' */
export function luoiDon(mode = 'ok', { cols = 40, rows = 5 } = {}) {
  const pal = ['#2f7d4f', '#336791', '#e08a1e', '#9aa0a6'];
  const cell = 24, gap = 3, w = cols * (cell + gap), h = rows * (cell + gap);
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = rnd(), k = v < 0.38 ? 0 : v < 0.82 ? 1 : v < 0.91 ? 2 : 3;
    const few = k === 2 && c < cols / 2;
    const fill = mode === 'red' ? '#c0392b' : mode === 'few' && few ? '#9aa0a6' : pal[k];
    s += `<rect x="${c * (cell + gap)}" y="${r * (cell + gap)}" width="${cell}" height="${cell}" rx="4" fill="${fill}"${mode === 'few' && few ? ' stroke="#c0392b" stroke-width="3"' : ''}/>`;
  }
  return s + '</svg>';
}

/** Chọn cột (projection) + chọn dòng (WHERE): bảng 5 dòng × 4 cột; cột/dòng không chọn thì mờ. */
export function chonCotDong({ cols = [1, 3], rows = [0, 1, 3] } = {}) {
  const H = ['id', 'title', 'author', 'views'], R = [['1', 'Intro to SQL', 'Cuong', '120'], ['2', 'Indexes deep dive', 'Cuong', '90'], ['3', 'Timezones…', 'Lan', '45'], ['4', 'JSONB in practice', 'Lan', '30'], ['5', 'My reading list', 'Minh', '8']];
  const W = [70, 330, 170, 130], x0 = 40, y0 = 52, rh = 46, tw = W.reduce((a, b) => a + b, 0);
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  s += `<text x="${x0}" y="32" font-size="21" font-weight="800" fill="${PGB}">note</text>`;
  let cx = x0;
  H.forEach((h, j) => { const on = cols.includes(j); s += `<rect x="${cx}" y="${y0}" width="${W[j]}" height="${rh}" fill="${on ? PGB : '#c9d5e2'}" stroke="#fff" stroke-width="2"/><text x="${cx + 12}" y="${y0 + 30}" font-family="Menlo,monospace" font-size="20" font-weight="800" fill="${on ? '#fff' : '#6b7c8c'}">${h}</text>`; cx += W[j]; });
  R.forEach((r, i) => {
    const y = y0 + rh * (i + 1), on = rows.includes(i);
    cx = x0;
    r.forEach((v, j) => { const oc = cols.includes(j); s += `<rect x="${cx}" y="${y}" width="${W[j]}" height="${rh}" fill="${on && oc ? '#fff3c4' : '#fff'}" stroke="#d8e0ea" stroke-width="1.5" opacity="${on ? 1 : 0.35}"/><text x="${cx + 12}" y="${y + 30}" font-family="Menlo,monospace" font-size="19" fill="${on && oc ? '#262626' : '#9aa5b0'}">${v}</text>`; cx += W[j]; });
    if (!on) s += `<line x1="${x0}" y1="${y + rh / 2}" x2="${x0 + tw}" y2="${y + rh / 2}" stroke="${RED}" stroke-width="3" opacity="0.7"/>`;
  });
  s += `<g data-k="pj"><path d="M${x0 + tw + 24},${y0} v${rh} " stroke="none"/></g>`;
  s += `<text x="${x0 + tw + 30}" y="${y0 + 30}" font-size="22" font-weight="800" fill="${PGB}" data-k="lab-col">← SELECT = which columns</text>`;
  s += `<text x="${x0 + tw + 30}" y="${y0 + rh * 3 + 30}" font-size="22" font-weight="800" fill="${BRN}" data-k="lab-row">← WHERE = which rows</text>`;
  return s + '</svg>';
}

/** Trục số BETWEEN a AND b (bao gồm hai đầu). */
export function trucSo({ lo = 10, hi = 100, vals = [[0, 'x'], [10, 'v'], [30, 'v'], [45, 'v'], [90, 'v'], [100, 'v'], [120, 'x']] } = {}) {
  const W = 1110, x0 = 40, x1 = 1070, sc = (v) => x0 + (x1 - x0) * v / 130;
  let s = `<svg viewBox="0 0 ${W} 190" width="${W}" height="190" font-family="Arial">`;
  s += `<line x1="${x0}" y1="110" x2="${x1}" y2="110" stroke="#777" stroke-width="3"/>`;
  s += `<rect x="${sc(lo)}" y="86" width="${sc(hi) - sc(lo)}" height="48" rx="8" fill="#f1f9f4" stroke="${GRN}" stroke-width="3" data-k="zone"/>`;
  s += `<text x="${(sc(lo) + sc(hi)) / 2}" y="76" text-anchor="middle" font-size="22" font-weight="800" fill="${GRN}">BETWEEN ${lo} AND ${hi} — both ends included</text>`;
  vals.forEach(([v, k]) => { const x = sc(v), ok = k === 'v'; s += `<circle cx="${x}" cy="110" r="14" fill="${ok ? GRN : '#fff'}" stroke="${ok ? GRN : RED}" stroke-width="3"/><text x="${x}" y="162" text-anchor="middle" font-size="20" font-weight="700" fill="${ok ? '#1f6b40' : RED}">${v}</text>`; });
  return s + '</svg>';
}

/** Ba đèn TRUE / FALSE / UNKNOWN. */
export function baDen({ w = 1110 } = {}) {
  const items = [['TRUE', GRN, '#f1f9f4', 'row is kept'], ['FALSE', RED, '#fdf0ee', 'row is dropped'], ['UNKNOWN', ORG, '#fff7ef', 'row is dropped too!']];
  let s = `<svg viewBox="0 0 ${w} 180" width="${w}" height="180" font-family="Arial">`;
  items.forEach(([t, m, bg, d], i) => { const x = 20 + i * 365; s += `<rect x="${x}" y="14" width="340" height="150" rx="16" fill="${bg}" stroke="${m}" stroke-width="3.5" data-k="den"/><circle cx="${x + 60}" cy="89" r="34" fill="${m}"/><text x="${x + 118}" y="84" font-size="30" font-weight="800" fill="${m}">${t}</text><text x="${x + 118}" y="118" font-size="19" fill="#444">${d}</text>`; });
  return s + '</svg>';
}

/** Bảng chân trị AND / OR / NOT với UNKNOWN (u). */
export function chanTri() {
  const col = { T: GRN, F: RED, U: ORG }, nm = { T: 'T', F: 'F', U: '?' };
  const A = ['T', 'F', 'U'];
  const and = (a, b) => (a === 'F' || b === 'F' ? 'F' : a === 'U' || b === 'U' ? 'U' : 'T');
  const or = (a, b) => (a === 'T' || b === 'T' ? 'T' : a === 'U' || b === 'U' ? 'U' : 'F');
  const grid = (ox, ti, f) => {
    let s = `<text x="${ox + 130}" y="26" text-anchor="middle" font-size="24" font-weight="800" fill="${PGB}">${ti}</text>`;
    A.forEach((b, j) => { s += `<text x="${ox + 70 + j * 62}" y="62" text-anchor="middle" font-size="22" font-weight="800" fill="${col[b]}">${nm[b]}</text>`; });
    A.forEach((a, i) => {
      s += `<text x="${ox + 20}" y="${100 + i * 52}" text-anchor="middle" font-size="22" font-weight="800" fill="${col[a]}">${nm[a]}</text>`;
      A.forEach((b, j) => { const r = f(a, b); s += `<rect x="${ox + 42 + j * 62}" y="${72 + i * 52}" width="56" height="44" rx="8" fill="${col[r]}22" stroke="${col[r]}" stroke-width="2.5"/><text x="${ox + 70 + j * 62}" y="${102 + i * 52}" text-anchor="middle" font-size="24" font-weight="800" fill="${col[r]}">${nm[r]}</text>`; });
    });
    return s;
  };
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  s += grid(10, 'a AND b', and) + grid(300, 'a OR b', or);
  s += `<text x="640" y="26" font-size="24" font-weight="800" fill="${PGB}">NOT a</text>`;
  A.forEach((a, i) => { const r = a === 'T' ? 'F' : a === 'F' ? 'T' : 'U'; s += `<text x="640" y="${100 + i * 52}" font-size="22" font-weight="800" fill="${col[a]}">${nm[a]}</text><text x="690" y="${100 + i * 52}" font-size="22" fill="#666">→</text><rect x="725" y="${72 + i * 52}" width="56" height="44" rx="8" fill="${col[r]}22" stroke="${col[r]}" stroke-width="2.5"/><text x="753" y="${102 + i * 52}" text-anchor="middle" font-size="24" font-weight="800" fill="${col[r]}">${nm[r]}</text>`; });
  s += `<text x="830" y="92" font-size="20" fill="#555">? = UNKNOWN</text><text x="830" y="124" font-size="19" fill="#a52a1d" font-weight="700">F AND ? = F</text><text x="830" y="154" font-size="19" fill="#a52a1d" font-weight="700">T AND ? = ?</text><text x="830" y="184" font-size="19" fill="#a52a1d" font-weight="700">NOT ? = ?</text>`;
  return s + '</svg>';
}

/** Trang kết quả: 12 dòng chia trang (size = 3), nhãn OFFSET mỗi trang + công thức. */
export function trangDong({ size = 3, pages = 4 } = {}) {
  const W = 1110, cw = 70, gap = 8, x0 = 30, y0 = 78;
  let s = `<svg viewBox="0 0 ${W} 250" width="${W}" height="250" font-family="Arial">`;
  const mau = [PGB, ORG, GRN, '#7a5a9a'];
  for (let p = 0; p < pages; p++) {
    const x = x0 + p * (size * (cw + gap) + 36), w = size * (cw + gap) - gap;
    s += `<rect x="${x - 8}" y="${y0 - 14}" width="${w + 16}" height="${cw + 28}" rx="12" fill="${mau[p]}14" stroke="${mau[p]}" stroke-width="3" data-k="pg"/>`;
    s += `<text x="${x + w / 2}" y="${y0 - 28}" text-anchor="middle" font-size="22" font-weight="800" fill="${mau[p]}">page ${p + 1}</text>`;
    for (let k = 0; k < size; k++) s += `<rect x="${x + k * (cw + gap)}" y="${y0}" width="${cw}" height="${cw}" rx="8" fill="${mau[p]}" /><text x="${x + k * (cw + gap) + cw / 2}" y="${y0 + 44}" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">${p * size + k + 1}</text>`;
    s += `<text x="${x + w / 2}" y="${y0 + cw + 62}" text-anchor="middle" font-family="Menlo,monospace" font-size="19" font-weight="700" fill="#333">LIMIT ${size} OFFSET ${p * size}</text>`;
  }
  s += `<text x="${W / 2}" y="238" text-anchor="middle" font-size="22" font-weight="800" fill="${BRN}">OFFSET = (page − 1) × page size</text>`;
  return s + '</svg>';
}
