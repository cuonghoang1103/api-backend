/**
 * Phụ thuộc hàm — tính ĐÁP ÁN của đề Chương 4 bằng mã (không tính nhẩm): bao đóng, mọi khoá, dạng chuẩn cao nhất,
 * phủ tối thiểu, kiểm nối không mất (chase), bảo toàn phụ thuộc. Thuộc tính = một chữ cái; FD viết "AB->C".
 */
export const S = (x) => [...new Set(Array.isArray(x) ? x : x.split(''))].sort();
export const str = (a) => [...a].sort().join('');
export const F = (...ds) => ds.map((d) => { const [l, r] = d.split('->'); return { l: S(l.trim()), r: S(r.trim()) }; });
const sub = (a, b) => a.every((x) => b.includes(x));

export function closure(X, fds) {
  let cur = S(X); let doi = true;
  while (doi) {
    doi = false;
    for (const f of fds) if (sub(f.l, cur) && !sub(f.r, cur)) { cur = S([...cur, ...f.r]); doi = true; }
  }
  return cur;
}
export const implies = (fds, l, r) => sub(S(r), closure(l, fds));
function tapCon(arr) {
  const kq = [];
  for (let m = 1; m < 1 << arr.length; m++) kq.push(arr.filter((_, i) => m & (1 << i)));
  return kq.sort((a, b) => a.length - b.length || str(a).localeCompare(str(b)));
}
/** Mọi khoá ứng viên của R (chuỗi chữ cái) dưới fds. */
export function keys(R, fds) {
  const all = S(R); const ks = [];
  for (const X of tapCon(all)) {
    if (ks.some((k) => sub(k, X))) continue;
    if (sub(all, closure(X, fds))) ks.push(X);
  }
  return ks.map(str);
}
export const prime = (R, fds) => S(keys(R, fds).join(''));
const sieu = (X, R, fds) => sub(S(R), closure(X, fds));
/** FD không tầm thường suy ra được trên R (vế phải từng thuộc tính) — đủ để xét dạng chuẩn. */
function fdTrenR(R, fds) {
  const all = S(R); const out = [];
  for (const X of tapCon(all)) {
    if (X.length === all.length) continue;
    for (const a of closure(X, fds)) if (all.includes(a) && !X.includes(a)) out.push({ l: X, r: [a] });
  }
  return out;
}
/** Dạng chuẩn cao nhất trong 1NF / 2NF / 3NF / BCNF. */
export function nf(R, fds) {
  const all = S(R); const ks = keys(R, fds).map(S); const p = prime(R, fds);
  const ds = fdTrenR(R, fds);
  const bcnf = ds.every((f) => sieu(f.l, all, fds));
  if (bcnf) return 'BCNF';
  const nf3 = ds.every((f) => sieu(f.l, all, fds) || p.includes(f.r[0]));
  if (nf3) return '3NF';
  const nf2 = ds.every((f) => p.includes(f.r[0]) || !ks.some((k) => f.l.length < k.length && sub(f.l, k)));
  return nf2 ? '2NF' : '1NF';
}
/** Phủ tối thiểu: tách vế phải → bỏ thuộc tính thừa vế trái → bỏ FD thừa (thứ tự đầu vào). */
export function minimalCover(fds) {
  let G = fds.flatMap((f) => f.r.map((a) => ({ l: [...f.l], r: [a] })));
  G = G.map((f) => {
    let l = [...f.l];
    for (const a of [...l]) { if (l.length > 1) { const t = l.filter((x) => x !== a); if (implies(G, t, f.r)) l = t; } }
    return { l: S(l), r: f.r };
  });
  const uniq = []; for (const f of G) if (!uniq.some((g) => str(g.l) === str(f.l) && str(g.r) === str(f.r))) uniq.push(f);
  G = uniq;
  for (const f of [...G]) { const rest = G.filter((g) => g !== f); if (implies(rest, f.l, f.r)) G = rest; }
  return G.map((f) => `${str(f.l)}->${str(f.r)}`);
}
/** Kiểm nối không mất bằng phép chase (bảng tableau). parts: ['AD', 'AC', 'BCD']. */
export function lossless(R, parts, fds) {
  const all = S(R);
  const rows = parts.map((p, i) => Object.fromEntries(all.map((a) => [a, p.includes(a) ? a : `${a}${i + 1}`])));
  let doi = true;
  while (doi) {
    doi = false;
    for (const f of fds) for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      if (!f.l.every((a) => rows[i][a] === rows[j][a])) continue;
      for (const a of f.r) {
        const x = rows[i][a], y = rows[j][a];
        if (x === y) continue;
        const giu = x === a || (y !== a && x < y) ? x : y; const bo = giu === x ? y : x;
        for (const r of rows) if (r[a] === bo) r[a] = giu;
        doi = true;
      }
    }
  }
  return rows.some((r) => all.every((a) => r[a] === a));
}
/** Bảo toàn phụ thuộc: mọi FD của fds suy ra được từ hợp các phép chiếu (thuật toán bao đóng theo mảnh). */
export function preserves(parts, fds) {
  return fds.every((f) => {
    let Z = S(f.l); let doi = true;
    while (doi) {
      doi = false;
      for (const p of parts) {
        const Ri = S(p); const them = closure(Z.filter((a) => Ri.includes(a)), fds).filter((a) => Ri.includes(a) && !Z.includes(a));
        if (them.length) { Z = S([...Z, ...them]); doi = true; }
      }
    }
    return sub(f.r, Z);
  });
}
/** Hiện tập thuộc tính: ['A','B'] ⇒ "{A, B}" */
export const tap = (x) => `{${S(x).join(', ')}}`;
export const fdChu = (fds) => fds.map((f) => `${str(f.l)} → ${str(f.r)}`).join(', ');
/** Mọi cách viết một tập thuộc tính mà người học hay gõ (đã sắp chữ cái): ABDE, A,B,D,E, {A, B, D, E}… */
export function bienThe(x) {
  const a = S(x);
  return [...new Set([a.join(''), a.join(','), a.join(', '), `{${a.join(',')}}`, `{${a.join(', ')}}`, a.join(' ')])];
}
/** Danh sách khoá: AB, AC (+ các biến thể dấu phẩy/“and”). */
export function bienTheKhoa(ks) {
  const k = [...ks].sort((x, y) => x.length - y.length || x.localeCompare(y));
  const out = [k.join(', '), k.join(','), k.join(' '), k.join(' and '), k.join('; ')];
  // một khoá duy nhất ⇒ nhận mọi thứ tự chữ (SC hay CS), có/không ngoặc
  if (k.length === 1) {
    const hv = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => hv([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [x, ...r])));
    for (const p of hv(k[0].split(''))) out.push(p.join(''), `{${p.join(', ')}}`);
  }
  return [...new Set(out)];
}
