/**
 * SWR302 practice — VẼ SVG sơ đồ THAM CHIẾU cho phần giải thích (chạy lúc XUẤT đề, không chạy ở máy chấm).
 * Đọc chính chuỗi Mermaid/PlantUML của lời giải bằng bộ phân tích của máy chấm ⇒ hình và đáp án không thể lệch nhau.
 * Bố cục tự động đơn giản (vòng tròn / cột / lưới / theo tầng) — đủ rõ để in A4, hai chế độ màu (nền trắng cố định).
 */
import { CORE, P_FLOW, P_UC, P_ER, P_STATE, P_ACT } from './_mohinh.mjs';

const L = CORE();
const pf = P_FLOW(L), pu = P_UC(L), pe = P_ER(L), ps = P_STATE(L), pa = P_ACT(L);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f1 = (x) => Number(x).toFixed(1);

function khung(w, h, tieuDe, than) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;display:block;margin:10px auto" role="img" aria-label="${esc(tieuDe)}" font-family="Arial, Helvetica, sans-serif" font-size="12">`
    + '<defs><marker id="swm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1f2937"/></marker>'
    + '<marker id="swmo" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11" fill="none" stroke="#1f2937" stroke-width="1.3"/></marker>'
    + '<marker id="swmt" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M1,1 L11,6 L1,11 z" fill="#ffffff" stroke="#1f2937" stroke-width="1.2"/></marker></defs>'
    + `<rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#ffffff" stroke="#d1d5db"/>`
    + (tieuDe ? `<text x="${w / 2}" y="20" text-anchor="middle" font-weight="700" fill="#111827" font-size="13">${esc(tieuDe)}</text>` : '')
    + than.join('') + '</svg>';
}
/** Chữ nhiều dòng (tự ngắt theo số ký tự). */
function chuNhieu(x, y, t, { rong = 18, co = 12, mau = '#111827', dam = false, neo = 'middle' } = {}) {
  const tu = String(t).split(/\s+/), dong = [];
  let cur = '';
  for (const w of tu) { if ((cur + ' ' + w).trim().length > rong && cur) { dong.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) dong.push(cur);
  return dong.map((d, i) => `<text x="${f1(x)}" y="${f1(y + (i - (dong.length - 1) / 2) * (co + 2) + co / 3)}" text-anchor="${neo}" fill="${mau}" font-size="${co}"${dam ? ' font-weight="700"' : ''}>${esc(d)}</text>`).join('');
}
function nhan(x, y, t, mau = '#7c2d12') {
  const dong = String(t).split('\n');
  const w = Math.max(...dong.map((d) => d.length)) * 6.2 + 8, h = dong.length * 13 + 2;
  return `<rect x="${f1(x - w / 2)}" y="${f1(y - h / 2 - 1)}" width="${f1(w)}" height="${f1(h)}" rx="3" fill="#ffffff" opacity="0.93"/>`
    + dong.map((d, i) => `<text x="${f1(x)}" y="${f1(y - h / 2 + 11 + i * 13)}" text-anchor="middle" fill="${mau}" font-size="10.5">${esc(d)}</text>`).join('');
}
/** Bố cục lực xác định: nut = [{ id, w, h }], canh = [[a, b]] ⇒ { id: {x, y} } trong khung W×H (lề m). */
function lucBoCuc(nut, canh, W, H, m = 30, L0 = 250) {
  const n = nut.length, P = nut.map((x, i) => ({ x: Math.cos((2 * Math.PI * i) / n) * 300, y: Math.sin((2 * Math.PI * i) / n) * 220 }));
  const idx = Object.fromEntries(nut.map((x, i) => [x.id, i]));
  for (let buoc = 0; buoc < 700; buoc++) {
    const F = P.map(() => ({ x: 0, y: 0 })), nhiet = 18 * (1 - buoc / 700) + 0.5;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
      const kx = (nut[i].w + nut[j].w) / 2 + 40, ky = (nut[i].h + nut[j].h) / 2 + 40;
      const d = Math.hypot(dx / kx, dy / ky) || 0.01;
      const f = 1.6 / (d * d);
      dx /= d * kx; dy /= d * ky;
      F[i].x += dx * f * kx; F[i].y += dy * f * ky; F[j].x -= dx * f * kx; F[j].y -= dy * f * ky;
    }
    for (const [a, b] of canh) {
      const i = idx[a], j = idx[b];
      if (i == null || j == null) continue;
      const dx = P[j].x - P[i].x, dy = P[j].y - P[i].y, d = Math.hypot(dx, dy) || 0.01;
      const f = (d - L0) / d * 0.06;
      F[i].x += dx * f; F[i].y += dy * f; F[j].x -= dx * f; F[j].y -= dy * f;
    }
    for (let i = 0; i < n; i++) { const l = Math.hypot(F[i].x, F[i].y) || 1, k = Math.min(l, nhiet) / l; P[i].x += F[i].x * k; P[i].y += F[i].y * k * 0.85; }
  }
  const wMax = Math.max(...nut.map((x) => x.w)), hMax = Math.max(...nut.map((x) => x.h));
  const cx0 = Math.min(...P.map((q) => q.x)), cx1 = Math.max(...P.map((q) => q.x)), cy0 = Math.min(...P.map((q) => q.y)), cy1 = Math.max(...P.map((q) => q.y));
  const k = Math.min(1.15, (W - 2 * m - wMax) / (cx1 - cx0 || 1));
  const Hm = Math.round((cy1 - cy0) * k + hMax + 2 * m + 40);
  const ox = (W - (cx1 - cx0) * k) / 2, oy = 34 + m + hMax / 2;
  const Q = nut.map((x, i) => ({ x: ox + (P[i].x - cx0) * k, y: oy + (P[i].y - cy0) * k }));
  // gỡ chồng trong toạ độ cuối: đẩy cặp hộp quá gần theo trục ít chồng hơn (ưu tiên dọc), giữ trong bề ngang
  for (let lap = 0; lap < 300; lap++) {
    let doi = false;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const gx = (nut[i].w + nut[j].w) / 2 + 70 - Math.abs(Q[i].x - Q[j].x), gy = (nut[i].h + nut[j].h) / 2 + 56 - Math.abs(Q[i].y - Q[j].y);
      if (gx <= 0 || gy <= 0) continue;
      doi = true;
      if (gy <= gx * 1.3) { const d = (Q[i].y <= Q[j].y ? -1 : 1) * (gy / 2 + 1); Q[i].y += d; Q[j].y -= d; }
      else { const d = (Q[i].x <= Q[j].x ? -1 : 1) * (gx / 2 + 1); Q[i].x += d; Q[j].x -= d; }
    }
    for (let i = 0; i < n; i++) Q[i].x = Math.max(m + nut[i].w / 2, Math.min(W - m - nut[i].w / 2, Q[i].x));
    if (!doi) break;
  }
  const yMin = Math.min(...Q.map((q, i) => q.y - nut[i].h / 2));
  Q.forEach((q) => { q.y += 40 + m - yMin; });
  const kq = Object.fromEntries(nut.map((x, i) => [x.id, Q[i]]));
  kq.__H = Math.max(H, Math.round(Math.max(...Q.map((q, i) => q.y + nut[i].h / 2)) + m), Hm * 0);
  return kq;
}
// điểm trên viền hình chữ nhật (tâm cx,cy, nửa rộng hw, nửa cao hh) theo hướng tới (tx,ty)
function vienHcn(cx, cy, hw, hh, tx, ty) {
  const dx = tx - cx, dy = ty - cy;
  const t = Math.min(Math.abs(dx) > 1e-9 ? hw / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-9 ? hh / Math.abs(dy) : Infinity);
  return [cx + dx * t, cy + dy * t];
}
function vienTron(cx, cy, r, tx, ty) { const dx = tx - cx, dy = ty - cy, l = Math.hypot(dx, dy) || 1; return [cx + dx / l * r, cy + dy / l * r]; }
function vienElip(cx, cy, rx, ry, tx, ty) { const dx = tx - cx, dy = ty - cy; const t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) || 1); return [cx + dx * t, cy + dy * t]; }

/* ───────── context diagram / DFD (Mermaid flowchart) ───────── */
export function veLuong(src, tieuDe = '') {
  const p = pf(src);
  const tron = p.ds.filter((n) => n.hinh === 'tron'), khac = p.ds.filter((n) => n.hinh !== 'tron');
  const W = 940, H = Math.max(520, 160 + Math.ceil(khac.length / 2) * 90);
  const pos = {};
  const cx = W / 2, cy = H / 2 + 8;
  if (tron.length === 1) {
    pos[tron[0].id] = { x: cx, y: cy, k: 'tron', r: 70 };
    const R = { rx: W / 2 - 100, ry: H / 2 - 56 };
    khac.forEach((n, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / khac.length + (khac.length % 2 ? 0 : Math.PI / khac.length); pos[n.id] = { x: cx + R.rx * Math.cos(a), y: cy + R.ry * Math.sin(a), k: n.hinh }; });
  } else {
    // DFD: process ở cột giữa, thực thể bên trái, kho bên phải
    // thứ tự barycentre: thực thể/kho xếp theo vị trí trung bình của các process nối với nó ⇒ ít đường cắt nhau
    const viTriP = Object.fromEntries(tron.map((n, i) => [n.id, i]));
    const tam = (n) => { const ks = p.canh.filter((c) => c.tu === n.id || c.den === n.id).map((c) => viTriP[c.tu === n.id ? c.den : c.tu]).filter((x) => x != null); return ks.length ? ks.reduce((a, b) => a + b, 0) / ks.length : 99; };
    const cot = { tron: tron, hcn: khac.filter((n) => n.hinh === 'hcn').sort((a, b) => tam(a) - tam(b)), kho: khac.filter((n) => n.hinh !== 'hcn').sort((a, b) => tam(a) - tam(b)) };
    const X = { hcn: 120, tron: W / 2, kho: W - 130 };
    for (const [k, ds] of Object.entries(cot)) ds.forEach((n, i) => { pos[n.id] = { x: X[k], y: 70 + ((H - 110) * (i + 0.5)) / Math.max(1, ds.length), k: n.hinh, r: 46 }; });
  }
  const hinhNut = (n) => {
    const q = pos[n.id];
    if (q.k === 'tron') return `<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${q.r}" fill="#e0f2fe" stroke="#1f2937" stroke-width="1.5"/>${chuNhieu(q.x, q.y, n.nhan, { rong: q.r > 50 ? 16 : 12, dam: true })}`;
    if (q.k === 'kho') return `<path d="M${f1(q.x - 70)},${f1(q.y - 17)} H${f1(q.x + 70)} M${f1(q.x - 70)},${f1(q.y + 17)} H${f1(q.x + 70)}" stroke="#1f2937" stroke-width="1.5"/><rect x="${f1(q.x - 70)}" y="${f1(q.y - 17)}" width="140" height="34" fill="#fef3c7" opacity="0.6"/>${chuNhieu(q.x, q.y, n.nhan, { rong: 20 })}`;
    return `<rect x="${f1(q.x - 70)}" y="${f1(q.y - 22)}" width="140" height="44" fill="#eef2ff" stroke="#1f2937" stroke-width="1.5"/>${chuNhieu(q.x, q.y, n.nhan, { rong: 18 })}`;
  };
  const vien = (id, tx, ty) => { const q = pos[id]; return q.k === 'tron' ? vienTron(q.x, q.y, q.r, tx, ty) : vienHcn(q.x, q.y, 70, q.k === 'kho' ? 17 : 22, tx, ty); };
  const cap = {};
  const net = [];
  const gop = {};
  for (const c of p.canh) { const k = c.tu + '>' + c.den; if (gop[k]) gop[k].nhan += '\n' + c.nhan; else gop[k] = { ...c }; }
  Object.values(gop).forEach((c) => {
    const k = [c.tu, c.den].sort().join('|');
    cap[k] = (cap[k] || 0) + 1;
    const so = cap[k] - 1;
    const a = pos[c.tu], b = pos[c.den];
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    const lech = (c.tu < c.den ? 1 : -1) * (so ? 10 : 10);
    const ox = (-dy / l) * lech, oy = (dx / l) * lech;
    const [x1, y1] = vien(c.tu, b.x + ox, b.y + oy), [x2, y2] = vien(c.den, a.x + ox, a.y + oy);
    net.push(`<path d="M${f1(x1 + ox)},${f1(y1 + oy)} L${f1(x2 + ox)},${f1(y2 + oy)}" stroke="#1f2937" stroke-width="1.3" fill="none" marker-end="url(#swm)"/>`);
    const tt = tron.length === 1 ? 0.3 : (c.tu < c.den ? 0.38 : 0.62);
    if (c.nhan) net.push(nhan(x1 + (x2 - x1) * tt + ox, y1 + (y2 - y1) * tt + oy, c.nhan));
  });
  return khung(W, H, tieuDe, [...net, ...p.ds.map(hinhNut)]);
}

/* ───────── use case diagram (PlantUML) ───────── */
const laHeThong = (t) => /system|gateway|service|api|provider|bank|platform|sms|email|calendar|map|sensor|device|server|erp|lms|portal/.test(L.norm(t));
export function veUseCase(src, tieuDe = '') {
  const p = pu(src);
  // chủ của mỗi use case: actor nối trực tiếp đầu tiên; use case chỉ nối qua include/extend ⇒ chủ của use case gốc
  const chu = {};
  for (const q of p.qh) if (q.loai === 'assoc') {
    if (q.tuK === 'actor' && q.denK === 'uc' && !chu[q.den]) chu[q.den] = q.tu;
    if (q.denK === 'actor' && q.tuK === 'uc' && !chu[q.tu]) chu[q.tu] = q.den;
  }
  for (let k = 0; k < 3; k++) for (const q of p.qh) {
    if (q.loai === 'include' && chu[q.tu] && !chu[q.den]) chu[q.den] = chu[q.tu];
    if (q.loai === 'extend' && chu[q.den] && !chu[q.tu]) chu[q.tu] = chu[q.den];
  }
  // người trước, hệ thống ngoài sau; nhóm use case theo chủ, xếp nhóm vào hai cột; actor đứng phía cột chứa đa số use case của nó
  const thuTuActor = [...p.actors.filter((a) => !laHeThong(a.ten)), ...p.actors.filter((a) => laHeThong(a.ten))].map((a) => a.key);
  const n = p.ucs.length, haiCot = n > 7;
  const nhomTheoChu = thuTuActor.map((k) => p.ucs.filter((u) => chu[u.key] === k)).filter((g) => g.length);
  const khongChu = p.ucs.filter((u) => !thuTuActor.includes(chu[u.key]));
  if (khongChu.length) nhomTheoChu.push(khongChu);
  let cotTrai = [], cotPhai = [];
  if (!haiCot) cotTrai = nhomTheoChu.flat();
  else {
    const nua = Math.ceil(n / 2);
    for (const g of nhomTheoChu) { if (cotTrai.length + g.length <= nua + 1 || !cotTrai.length) cotTrai.push(...g); else cotPhai.push(...g); }
    while (cotTrai.length - cotPhai.length > 2) cotPhai.unshift(cotTrai.pop());
  }
  const benPhai = (a) => { const ds = p.ucs.filter((u) => chu[u.key] === a.key); const r = ds.filter((u) => cotPhai.includes(u)).length; return haiCot ? r * 2 > ds.length || (!ds.length && laHeThong(a.ten)) : laHeThong(a.ten); };
  let trai = p.actors.filter((a) => !benPhai(a)), phai = p.actors.filter(benPhai);
  if (!haiCot && !phai.length && trai.length > 3) phai = trai.splice(Math.ceil(trai.length / 2));
  const soHang = Math.max(cotTrai.length, cotPhai.length, 1);
  const W = haiCot ? 980 : 760, H = Math.max(360, 90 + soHang * 58, 90 + Math.max(trai.length, phai.length) * 90);
  const bx = 150, bw = W - 300, by = 44, bh = H - 64;
  const pos = {};
  const dat = (ds, c) => ds.forEach((u, r) => { pos[u.key] = { x: haiCot ? bx + bw * (c === 0 ? 0.28 : 0.72) : bx + bw / 2, y: by + 40 + ((bh - 60) * (r + 0.5)) / soHang, rx: haiCot ? 118 : 130, ry: 21 }; });
  dat(cotTrai, 0); dat(cotPhai, 1);
  const datActor = (ds, x) => {
    const muon = ds.map((a) => { const ys = p.ucs.filter((u) => chu[u.key] === a.key).map((u) => pos[u.key].y); return ys.length ? ys.reduce((s, y) => s + y, 0) / ys.length : by + bh / 2; });
    const thu = ds.map((a, i) => ({ a, y: muon[i] })).sort((m1, m2) => m1.y - m2.y);
    for (let i = 0; i < thu.length; i++) { thu[i].y = Math.max(thu[i].y, i ? thu[i - 1].y + 86 : by + 40); }
    const tran = by + bh - 50;
    for (let i = thu.length - 1; i >= 0; i--) {
      if (thu[i].y > tran) thu[i].y = tran;
      if (i && thu[i - 1].y > thu[i].y - 86) thu[i - 1].y = thu[i].y - 86;
    }
    thu.forEach((t) => { pos[t.a.key] = { x, y: t.y, actor: true }; });
  };
  datActor(trai, 70); datActor(phai, W - 70);
  const out = [`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="6" fill="#f8fafc" stroke="#1f2937" stroke-width="1.4"/>`,
    `<text x="${bx + 10}" y="${by + 16}" fill="#111827" font-weight="700">${esc(p.bien[0] ? p.bien[0].ten : 'System')}</text>`];
  const net = [];
  for (const q of p.qh) {
    const a = pos[q.tu], b = pos[q.den];
    if (!a || !b) continue;
    const diem = (o, t) => (o.actor ? vienHcn(o.x, o.y + 4, 22, 30, t.x, t.y) : vienElip(o.x, o.y, o.rx, o.ry, t.x, t.y));
    const [x1, y1] = diem(a, b), [x2, y2] = diem(b, a);
    if (q.loai === 'assoc') net.push(`<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="#334155" stroke-width="1.2"/>`);
    else if (q.loai === 'gen') net.push(`<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="#1f2937" stroke-width="1.2" fill="none" marker-end="url(#swmt)"/>`);
    else {
      net.push(`<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="#1f2937" stroke-width="1.2" stroke-dasharray="6 4" fill="none" marker-end="url(#swmo)"/>`);
      net.push(nhan((x1 + x2) / 2 + 4, (y1 + y2) / 2 - 2, `«${q.loai}»`, '#1d4ed8'));
    }
  }
  for (const u of p.ucs) {
    const q = pos[u.key];
    out.push(`<ellipse cx="${f1(q.x)}" cy="${f1(q.y)}" rx="${q.rx}" ry="${q.ry}" fill="#eef2ff" stroke="#1f2937" stroke-width="1.3"/>${chuNhieu(q.x, q.y, u.ten, { rong: 24, co: 11.5 })}`);
  }
  for (const a of p.actors) {
    const q = pos[a.key];
    if (!q) continue;
    out.push(`<g stroke="#1f2937" stroke-width="1.5" fill="none"><circle cx="${f1(q.x)}" cy="${f1(q.y - 22)}" r="8" fill="#ffffff"/><path d="M${f1(q.x)},${f1(q.y - 14)} V${f1(q.y + 8)} M${f1(q.x - 14)},${f1(q.y - 6)} H${f1(q.x + 14)} M${f1(q.x)},${f1(q.y + 8)} L${f1(q.x - 11)},${f1(q.y + 24)} M${f1(q.x)},${f1(q.y + 8)} L${f1(q.x + 11)},${f1(q.y + 24)}"/></g>${chuNhieu(q.x, q.y + 38, a.ten, { rong: 16, co: 11.5 })}`);
  }
  return khung(W, H, tieuDe, [...out, ...net]);
}

/* ───────── ERD (Mermaid erDiagram) ───────── */
const KH = (min, max) => (max === 'N' ? (min ? '1..*' : '0..*') : (min ? '1' : '0..1'));
export function veErd(src, tieuDe = '', viTri = null) {
  const p = pe(src);
  const bw = 170;
  const caoHop = (t) => 30 + Math.max(1, t.thuocTinh.length) * 15;
  const W = p.tt.length <= 5 ? 820 : 980;
  let toaDo;
  if (viTri) {
    toaDo = Object.fromEntries(p.tt.map((t) => { if (!viTri[t.id]) throw new Error('veErd: thiếu viTri cho ' + t.id); return [t.id, { x: viTri[t.id][0], y: viTri[t.id][1] }]; }));
    toaDo.__H = Math.max(...p.tt.map((t) => toaDo[t.id].y + caoHop(t) / 2)) + 30;
  } else toaDo = lucBoCuc(p.tt.map((t) => ({ id: t.id, w: bw, h: caoHop(t) })), p.qh.map((q) => [q.a, q.b]), W, 300, 24);
  const H = toaDo.__H;
  const pos = {};
  p.tt.forEach((t) => { pos[t.id] = { x: toaDo[t.id].x, y: toaDo[t.id].y, hh: caoHop(t) / 2 }; });
  const out = [], net = [];
  const cap = {};
  for (const q of p.qh) {
    const a = pos[q.a], b = pos[q.b];
    if (!a || !b) continue;
    const k = [q.a, q.b].sort().join('|'); cap[k] = (cap[k] || 0) + 1;
    const lech = (cap[k] - 1) * 14;
    const [x1, y1] = vienHcn(a.x, a.y, bw / 2, a.hh, b.x, b.y + lech), [x2, y2] = vienHcn(b.x, b.y, bw / 2, b.hh, a.x, a.y + lech);
    net.push(`<path d="M${f1(x1)},${f1(y1 + lech)} L${f1(x2)},${f1(y2 + lech)}" stroke="#1f2937" stroke-width="1.3"${q.xac ? '' : ' stroke-dasharray="5 4"'}/>`);
    const ll = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / ll, uy = (y2 - y1) / ll;
    net.push(nhan(x1 + ux * 20 - uy * 11, y1 + lech + uy * 20 + ux * 11, KH(q.minA, q.maxA), '#065f46'));
    net.push(nhan(x2 - ux * 20 - uy * 11, y2 + lech - uy * 20 + ux * 11, KH(q.minB, q.maxB), '#065f46'));
    net.push(nhan((x1 + x2) / 2, (y1 + y2) / 2 + lech + 9, q.nhan));
  }
  for (const t of p.tt) {
    const q = pos[t.id], top = q.y - q.hh;
    out.push(`<rect x="${f1(q.x - bw / 2)}" y="${f1(top)}" width="${bw}" height="${f1(q.hh * 2)}" rx="4" fill="#ffffff" stroke="#1f2937" stroke-width="1.4"/>`);
    out.push(`<rect x="${f1(q.x - bw / 2)}" y="${f1(top)}" width="${bw}" height="24" rx="4" fill="#dbeafe" stroke="#1f2937" stroke-width="1.4"/>`);
    out.push(`<text x="${f1(q.x)}" y="${f1(top + 16)}" text-anchor="middle" font-weight="700" fill="#111827">${esc(t.ten)}</text>`);
    t.thuocTinh.forEach((a, i) => out.push(`<text x="${f1(q.x - bw / 2 + 8)}" y="${f1(top + 40 + i * 15)}" fill="#111827" font-size="11"${a.khoa.includes('PK') ? ' text-decoration="underline" font-weight="700"' : ''}>${esc(a.ten)}${a.khoa.length ? ` (${a.khoa.join(',')})` : ''}</text>`));
  }
  return khung(W, H, tieuDe, [...net, ...out]);
}

/* ───────── state diagram (Mermaid stateDiagram-v2) — bố cục lực, mỗi trạng thái cuối có vòng kết thúc riêng ───────── */
export function veState(src, tieuDe = '', viTri = null) {
  const p = ps(src);
  const rw = 78, rh = 21;
  const nut = [{ id: '__dau', w: 24, h: 24 }, ...p.st.map((x) => ({ id: x.id, w: rw * 2 + 30, h: rh * 2 + 30 }))];
  const cuoi = [...new Set(p.ch.filter((c) => c.den === '[*]').map((c) => c.tu))];
  cuoi.forEach((id) => nut.push({ id: '__cuoi_' + id, w: 26, h: 26 }));
  const canh = p.ch.map((c) => [c.tu === '[*]' ? '__dau' : c.tu, c.den === '[*]' ? '__cuoi_' + c.tu : c.den]);
  const W = 1000;
  let toaDo;
  if (viTri) {
    toaDo = {};
    for (const n of nut) {
      if (viTri[n.id]) toaDo[n.id] = { x: viTri[n.id][0], y: viTri[n.id][1] };
      else if (n.id.startsWith('__cuoi_')) { const g = viTri[n.id.slice(7)] || [500, 300]; toaDo[n.id] = { x: g[0], y: g[1] + 64 }; }
      else if (n.id === '__dau') toaDo[n.id] = { x: 30, y: 60 };
      else throw new Error('veState: thiếu viTri cho ' + n.id);
    }
    const yMin = Math.min(...Object.values(toaDo).map((q) => q.y));
    Object.values(toaDo).forEach((q) => { q.y += 70 - yMin; });
    toaDo.__H = Math.max(...Object.values(toaDo).map((q) => q.y)) + 60;
  } else toaDo = lucBoCuc(nut, canh, W, 300, 30, 280);
  const H = toaDo.__H;
  const hinh = (id) => (id === '__dau' ? { ...toaDo[id], tron: 9 } : id.startsWith('__cuoi_') ? { ...toaDo[id], tron: 11 } : { ...toaDo[id] });
  const ve = (o, t) => (o.tron ? vienTron(o.x, o.y, o.tron, t.x, t.y) : vienHcn(o.x, o.y, rw, rh, t.x, t.y));
  const out = [], net = [], nhanDs = [];
  const cap = {};
  p.ch.forEach((c, i) => {
    const [ia, ib] = canh[i];
    const a = hinh(ia), b = hinh(ib);
    const k = [ia, ib].sort().join('|'); cap[k] = (cap[k] || 0) + 1;
    const nguoc = p.ch.some((d, j) => j !== i && canh[j][0] === ib && canh[j][1] === ia);
    const nhanDong = [c.suKien, c.guard ? `[${c.guard}]` : '', c.hanhDong ? `/ ${c.hanhDong}` : ''].filter(Boolean).join('\n');
    if (ia === ib) {
      net.push(`<path d="M${f1(a.x - 20)},${f1(a.y - rh)} C${f1(a.x - 30)},${f1(a.y - rh - 42)} ${f1(a.x + 30)},${f1(a.y - rh - 42)} ${f1(a.x + 20)},${f1(a.y - rh)}" stroke="#1f2937" fill="none" stroke-width="1.2" marker-end="url(#swm)"/>`);
      if (nhanDong) nhanDs.push(nhan(a.x, a.y - rh - 44, nhanDong));
      return;
    }
    const [x1, y1] = ve(a, b), [x2, y2] = ve(b, a);
    const cong = nguoc || cap[k] > 1 ? 50 * (cap[k] > 1 ? cap[k] - 1 : 1) : 0;
    const ddx = x2 - x1, ddy = y2 - y1, l = Math.hypot(ddx, ddy) || 1;
    const qx = (x1 + x2) / 2 + (-ddy / l) * cong, qy = (y1 + y2) / 2 + (ddx / l) * cong;
    net.push(cong ? `<path d="M${f1(x1)},${f1(y1)} Q${f1(qx)},${f1(qy)} ${f1(x2)},${f1(y2)}" stroke="#1f2937" fill="none" stroke-width="1.2" marker-end="url(#swm)"/>`
      : `<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="#1f2937" fill="none" stroke-width="1.2" marker-end="url(#swm)"/>`);
    if (nhanDong) nhanDs.push(nhan(cong ? (x1 + 2 * qx + x2) / 4 : (x1 + x2) / 2, cong ? (y1 + 2 * qy + y2) / 4 : (y1 + y2) / 2, nhanDong));
  });
  out.push(`<circle cx="${f1(toaDo.__dau.x)}" cy="${f1(toaDo.__dau.y)}" r="9" fill="#111827"/>`);
  cuoi.forEach((id) => { const q = toaDo['__cuoi_' + id]; out.push(`<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="11" fill="#ffffff" stroke="#111827" stroke-width="1.5"/><circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="6" fill="#111827"/>`); });
  for (const st of p.st) {
    const q = toaDo[st.id];
    if (st.gia) { out.push(`<polygon points="${q.x},${q.y - 14} ${q.x + 14},${q.y} ${q.x},${q.y + 14} ${q.x - 14},${q.y}" fill="#fef3c7" stroke="#1f2937"/>`); continue; }
    out.push(`<rect x="${f1(q.x - rw)}" y="${f1(q.y - rh)}" width="${rw * 2}" height="${rh * 2}" rx="14" fill="#e0f2fe" stroke="#1f2937" stroke-width="1.4"/>${chuNhieu(q.x, q.y, st.ten, { rong: 20, dam: true, co: 11.5 })}`);
  }
  return khung(W, H, tieuDe, [...net, ...out, ...nhanDs]);
}

/* ───────── swimlane (PlantUML activity) — liệt kê theo lane, mũi tên theo thứ tự ───────── */
export function veSwimlane(src, tieuDe = '') {
  const p = pa(src);
  const hd = p.buoc.filter((b) => b.loai === 'hd');
  const lw = 210, W = 30 + p.lanes.length * lw, H = 70 + hd.length * 50 + 30;
  const out = [];
  p.lanes.forEach((l, i) => {
    out.push(`<rect x="${15 + i * lw}" y="30" width="${lw}" height="${H - 40}" fill="${i % 2 ? '#f8fafc' : '#ffffff'}" stroke="#94a3b8"/>`);
    out.push(`<text x="${15 + i * lw + lw / 2}" y="48" text-anchor="middle" font-weight="700" fill="#111827">${esc(l)}</text>`);
  });
  const pos = hd.map((b, i) => ({ x: 15 + p.lanes.indexOf(b.lane) * lw + lw / 2, y: 80 + i * 50 }));
  hd.forEach((b, i) => {
    if (i) { const a = pos[i - 1], c = pos[i]; out.push(`<path d="M${f1(a.x)},${f1(a.y + 16)} L${f1(c.x)},${f1(c.y - 16)}" stroke="#1f2937" fill="none" stroke-width="1.2" marker-end="url(#swm)"/>`); }
  });
  hd.forEach((b, i) => out.push(`<rect x="${f1(pos[i].x - 92)}" y="${f1(pos[i].y - 16)}" width="184" height="32" rx="12" fill="${b.sau ? '#fef3c7' : '#eef2ff'}" stroke="#1f2937"/>${chuNhieu(pos[i].x, pos[i].y, b.ten, { rong: 28, co: 11 })}`));
  if (p.qd.length) out.push(`<text x="20" y="${H - 8}" fill="#92400e" font-size="10.5">Yellow = action inside a decision branch (${p.qd.map((q) => esc(q.dk)).join(' · ')}) — see the source for the branches · Vàng = hành động nằm trong một nhánh rẽ</text>`);
  return khung(W, H + 6, tieuDe, out);
}

/** Khối "sơ đồ tham chiếu": SVG + mã nguồn (để người học dán vào công cụ). */
export function khoiThamChieu(loai, src, tieuDe, viTri = null) {
  const ve = { luong: veLuong, uc: veUseCase, erd: veErd, state: veState, swim: veSwimlane }[loai];
  return `${ve(src, tieuDe, viTri)}<details><summary>Source / Mã nguồn</summary><pre>${esc(String(src).trim())}</pre></details>`;
}
