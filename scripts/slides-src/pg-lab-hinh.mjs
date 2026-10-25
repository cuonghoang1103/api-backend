/**
 * pg-lab-hinh.mjs — hình SVG dùng chung cho các deck LAB CT Shop (pg-lab-N). Không phải deck.
 * ERD 8 bảng của CT Shop (Crow's Foot). Hình học khai trong ERD_BANG / ERD_NOI — video (src/khung/pg/clab-hinh.tsx)
 * chép đúng các số này (×1,5 sang khung 1920) để ERD dựng dần khớp slide.
 * Chữ SVG đơn cách rộng ≈ 0,602 × cỡ chữ mỗi ký tự.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a4fa0';

/** Bảng của ERD: x,y,w theo hệ toạ độ SVG 1112 × 520. cols: [tên, khoá] — khoá 'PK' | 'FK' | 'PF' | 'UQ' | 'FU' (FK + UNIQUE). */
export const ERD_BANG = {
  customer:       { x: 0,   y: 6,   w: 232, mau: PG,  cols: [['id', 'PK'], ['email', 'UQ'], ['full_name'], ['phone'], ['city'], ['created_at']] },
  orders:         { x: 290, y: 6,   w: 232, mau: CAM, cols: [['id', 'PK'], ['customer_id', 'FK'], ['status'], ['created_at'], ['note']] },
  order_item:     { x: 580, y: 6,   w: 232, mau: CAM, cols: [['order_id', 'PF'], ['product_id', 'PF'], ['qty'], ['unit_price']] },
  product:        { x: 870, y: 6,   w: 232, mau: XANH, cols: [['id', 'PK'], ['sku', 'UQ'], ['name'], ['category_id', 'FK'], ['price'], ['stock'], ['attrs'], ['is_active'], ['created_at']] },
  review:         { x: 0,   y: 300, w: 232, mau: TIM, cols: [['id', 'PK'], ['product_id', 'FK'], ['customer_id', 'FK'], ['rating'], ['body'], ['created_at']] },
  payment:        { x: 290, y: 300, w: 232, mau: NAU, cols: [['id', 'PK'], ['order_id', 'FU'], ['amount'], ['method'], ['paid_at']] },
  stock_movement: { x: 580, y: 300, w: 232, mau: NAU, cols: [['id', 'PK'], ['product_id', 'FK'], ['change'], ['reason'], ['order_id', 'FK'], ['created_at']] },
  category:       { x: 870, y: 300, w: 232, mau: XANH, cols: [['id', 'PK'], ['name', 'UQ'], ['parent_id', 'FK']] },
};
export const ERD_FS = 15, ERD_HEAD = 28, ERD_ROW = 24;
export const erdH = (b) => ERD_HEAD + b.cols.length * ERD_ROW + 6;
/** toạ độ y giữa dòng cột `col` của bảng `t`. */
export const erdY = (t, col) => { const b = ERD_BANG[t]; return b.y + ERD_HEAD + (b.cols.findIndex((c) => c[0] === col) + 0.5) * ERD_ROW + 3; };

/**
 * Các đường khoá ngoại: pts = đường gấp khúc từ đầu CHA (a) tới đầu CON (b). dauA/dauB: '1' (‖ đúng một) · '01' (○| không hoặc một)
 * · 'N' (|< một hoặc nhiều) · '0N' (○< không hoặc nhiều). nhan = nhãn đọc quan hệ (tuỳ chọn).
 */
export const ERD_NOI = [
  { id: 'cus-ord', pts: [[232, erdY('customer', 'id')], [261, erdY('customer', 'id')], [261, erdY('orders', 'customer_id')], [290, erdY('orders', 'customer_id')]], dauA: '1', dauB: '0N' },
  { id: 'ord-oi', pts: [[522, erdY('orders', 'id')], [580, erdY('order_item', 'order_id')]], dauA: '1', dauB: 'N' },
  { id: 'pro-oi', pts: [[870, erdY('product', 'id')], [841, erdY('product', 'id')], [841, erdY('order_item', 'product_id')], [812, erdY('order_item', 'product_id')]], dauA: '1', dauB: '0N' },
  { id: 'cat-pro', pts: [[986, 300], [986, 6 + erdH(ERD_BANG.product)]], dauA: '1', dauB: '0N' },
  { id: 'cat-cat', pts: [[870, erdY('category', 'id')], [842, erdY('category', 'id')], [842, erdY('category', 'parent_id')], [870, erdY('category', 'parent_id')]], dauA: '01', dauB: '0N' },
  { id: 'ord-pay', pts: [[406, 6 + erdH(ERD_BANG.orders)], [406, 300]], dauA: '1', dauB: '01' },
  { id: 'pro-sm', pts: [[870, 232], [740, 232], [740, 300]], dauA: '1', dauB: '0N' },
  { id: 'ord-sm', pts: [[522, 140], [640, 140], [640, 300]], dauA: '01', dauB: '0N' },
  { id: 'cus-rev', pts: [[116, 6 + erdH(ERD_BANG.customer)], [116, 300]], dauA: '1', dauB: '0N' },
  { id: 'pro-rev', pts: [[1102, 200], [1106, 200], [1106, 506], [150, 506], [150, 300 + erdH(ERD_BANG.review)]], dauA: '1', dauB: '0N' },
];

/** Ký hiệu chân quạ tại điểm p (chạm mép bảng), d = hướng ĐI VÀO bảng (vector đơn vị). */
function dau(p, d, kind, mau) {
  const n = [-d[1], d[0]];
  const at = (k, s = 0) => [p[0] - d[0] * k + n[0] * s, p[1] - d[1] * k + n[1] * s];
  const ln = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${mau}" stroke-width="2.4"/>`;
  const vach = (k) => ln(at(k, 8), at(k, -8));
  const tron = (k) => { const c = at(k); return `<circle cx="${c[0]}" cy="${c[1]}" r="5.5" fill="#fff" stroke="${mau}" stroke-width="2.4"/>`; };
  const chan = () => { const v = at(16); return [at(0, 9), at(0, 0), at(0, -9)].map((q) => ln(v, q)).join(''); };
  if (kind === '1') return vach(7) + vach(14);
  if (kind === '01') return vach(8) + tron(20);
  if (kind === 'N') return chan() + vach(21);
  return chan() + tron(25);
}
const huong = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };

/**
 * ERD CT Shop. opts: { bang: [tên…] chỉ vẽ các bảng này (mặc định cả 8), noi: [id…] chỉ vẽ các đường này, sang: [tên bảng tô nền vàng],
 * mo: [tên bảng làm mờ], w, h } — data-k="t-<bảng>" / "l-<id>" để bộ đo toạ độ bắt được.
 */
export function erdShop(opts = {}) {
  const { bang = Object.keys(ERD_BANG), noi = ERD_NOI.map((n) => n.id), sang = [], mo = [], w = 1112, h = 520 } = opts;
  let s = `<svg viewBox="0 0 1112 520" width="${w}" height="${h}" font-family="Arial">`;
  for (const n of ERD_NOI.filter((x) => noi.includes(x.id))) {
    const mau = '#555';
    s += `<g data-k="l-${n.id}"><polyline points="${n.pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${mau}" stroke-width="2.4"/>`;
    const p0 = n.pts[0], p1 = n.pts[1], q0 = n.pts[n.pts.length - 1], q1 = n.pts[n.pts.length - 2];
    s += dau(p0, huong(p1, p0), n.dauA, mau) + dau(q0, huong(q1, q0), n.dauB, mau) + '</g>';
  }
  for (const t of bang) {
    const b = ERD_BANG[t], H = erdH(b), op = mo.includes(t) ? ' opacity=".28"' : '';
    s += `<g data-k="t-${t}"${op}><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${H}" rx="6" fill="${sang.includes(t) ? '#fff6d6' : '#fff'}" stroke="${b.mau}" stroke-width="2.5"/>` +
      `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${ERD_HEAD}" rx="6" fill="${b.mau}"/><rect x="${b.x}" y="${b.y + ERD_HEAD - 8}" width="${b.w}" height="8" fill="${b.mau}"/>` +
      `<text x="${b.x + b.w / 2}" y="${b.y + 20}" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" font-family="${MONO}">${esc(t)}</text>`;
    b.cols.forEach(([c, k], i) => {
      const yy = b.y + ERD_HEAD + (i + 1) * ERD_ROW - 4;
      const kc = k === 'PK' || k === 'PF' ? NAU : k === 'FK' || k === 'FU' ? PG : XANH;
      if (k) s += `<text x="${b.x + 9}" y="${yy}" font-size="12" font-weight="800" fill="${kc}" font-family="${MONO}">${k}</text>`;
      s += `<text x="${b.x + 40}" y="${yy}" font-size="${ERD_FS}" fill="#333" font-family="${MONO}"${k === 'PK' || k === 'PF' ? ' font-weight="800" text-decoration="underline"' : ''}>${esc(c)}</text>`;
    });
    s += '</g>';
  }
  return s + '</svg>';
}

/** Chú giải ký hiệu Crow's Foot (một dòng). */
export function chuGiai(w = 1112) {
  const items = [['1', 'exactly one'], ['01', 'zero or one'], ['N', 'one or many'], ['0N', 'zero or many']];
  const step = w / items.length;
  let s = `<svg viewBox="0 0 ${w} 40" width="${w}" height="40" font-family="Arial">`;
  items.forEach(([k, t], i) => {
    const x = i * step + 20;
    s += `<line x1="${x}" y1="20" x2="${x + 60}" y2="20" stroke="#555" stroke-width="2.4"/>` + dau([x + 60, 20], [1, 0], k, '#555');
    s += `<text x="${x + 76}" y="27" font-size="19" fill="#333">${t}</text>`;
  });
  return s + '</svg>';
}

/** Cây danh mục nhỏ (category tự trỏ). */
export function cayDanhMuc() {
  const goc = [['Bút & mực', ['Bút bi', 'Bút chì & tẩy', 'Bút dạ quang']], ['Vở & giấy', ['Vở ô ly', 'Sổ tay']]];
  let s = `<svg viewBox="0 0 520 330" width="430" height="273" font-family="Arial">`;
  let id = 1, cid = 5, y = 16;
  goc.forEach(([g, cons]) => {
    s += `<rect x="6" y="${y}" width="190" height="34" rx="8" fill="#eaf4ee" stroke="${XANH}" stroke-width="2"/><text x="16" y="${y + 23}" font-size="17" font-weight="700" fill="#1f5c38">${id} · ${esc(g)}</text>`;
    const y0 = y + 34;
    cons.forEach((c, j) => {
      const yy = y0 + 8 + j * 36;
      s += `<path d="M40,${y0} L40,${yy + 17} L250,${yy + 17}" fill="none" stroke="#999" stroke-width="2"/>`;
      s += `<rect x="250" y="${yy}" width="262" height="32" rx="8" fill="#fff" stroke="${XANH}" stroke-width="1.6"/><text x="260" y="${yy + 22}" font-size="16" fill="#333">${cid} · ${esc(c)} <tspan fill="${PG}" font-family="${MONO}" font-size="14">parent_id=${id}</tspan></text>`;
      cid++;
    });
    y = y0 + cons.length * 36 + 18; id++;
  });
  return s + '</svg>';
}
