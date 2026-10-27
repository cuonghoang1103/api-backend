/**
 * pro-lab-hinh.mjs — hình + tiện ích dùng chung cho deck LAB CT Library của PRO192 (pro-lab-1…9).
 * Code và output trên slide ĐỌC THẲNG từ generator (flm-nguon/_repo/PRO192/gen/lab/<labN>/…) — không gõ tay:
 *   ham('lab1/solution/src/utils/Validation.java', 'getIsbn') — một hàm (kèm chú thích ngay trên), bỏ thụt lề 4
 *   tep('lab1/solution/src/model/Book.java', [từ, tới])       — một dải dòng (1-based)
 *   ra('lab1/solution:run', [từ, tới])                        — output thật đã cache (out/<…>.txt)
 *   raJava('lab1/LabBaySoChuoi')                              — output thật của chương trình một tệp gen/java/…
 */
import { readFileSync } from 'node:fs';

export const GEN = '/Users/admin/Documents/FLM-nguon/_repo/PRO192/gen';
const doc = (f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const boSha = (s) => s.replace(/^\/\/ sha1 [^\n]*\n/, '').replace(/\n+$/, '');

export function tep(rel, khoang) {
  const l = doc(`${GEN}/lab/${rel}`).replace(/\n+$/, '').split('\n');
  return (khoang ? l.slice(khoang[0] - 1, khoang[1]) : l).join('\n');
}

export function ham(rel, ten) {
  const l = doc(`${GEN}/lab/${rel}`).split('\n');
  const mo = l.findIndex((x) => new RegExp(`^    (public|private|protected)[^=;(]*\\b${ten}\\s*\\(`).test(x));
  if (mo < 0) throw new Error(`pro-lab-hinh: ${rel} không có hàm ${ten}`);
  let s = mo;
  while (s > 0 && /^\s*(\/\/|@)/.test(l[s - 1])) s--;
  let e = mo;
  while (l[e] !== '    }') e++;
  return l.slice(s, e + 1).map((x) => x.slice(4)).join('\n');
}

export function ra(key, khoang) {
  const [spec, kind] = key.split(':');
  const lab = spec.split('/')[0];
  const f = `${GEN}/lab/${lab}/out/${spec.slice(lab.length + 1).replace(/\//g, '__')}.${kind}.txt`;
  const l = boSha(doc(f)).split('\n');
  return (khoang ? l.slice(khoang[0] - 1, khoang[1]) : l).join('\n');
}

export const raJava = (rel) => boSha(doc(`${GEN}/java/${rel}.out.txt`));
export const ma = (rel, khoang) => {
  const l = doc(`${GEN}/java/${rel}.java`).replace(/\n+$/, '').split('\n').map((x) => x.replace(/\s*\|\|\|.*$/, ''));
  return (khoang ? l.slice(khoang[0] - 1, khoang[1]) : l).join('\n');
};

/* ───────── màu ───────── */
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7b4fa0', XAM = '#7a7a7a';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Sơ đồ các tầng LAB211 của CT Library (SVG 1110 × h). opts.hl: mảng id hộp cần tô đậm;
 * opts.cam: true ⇒ vẽ hai "đường cấm" (controller ✗ model, service ✗ repository).
 * opts.ten: { controller, repository, service, view } — đổi tên lớp (mặc định Book…).
 */
export function tangLab(opts = {}) {
  const { hl = [], cam = true, h = 420, ten = {} } = opts;
  const T = { main: 'Main', controller: 'BookController', repository: 'BookRepository', service: 'BookService', view: 'BookView', utils: 'Validation', model: 'Book', dto: 'BookRequestDTO · BookResponseDTO', constants: 'Message · Constants', ...ten };
  const B = {
    main: [10, 30, 220, 'main', PG],
    utils: [10, 250, 220, 'utils', TIM],
    controller: [330, 30, 330, 'controller', NAU],
    repository: [790, 30, 310, 'repository', XANH],
    service: [290, 250, 230, 'service', CAM],
    view: [560, 250, 190, 'view', PG],
    model: [790, 250, 310, 'model', XANH],
  };
  let s = `<svg viewBox="0 0 1110 ${h}" width="1110" height="${h}" font-family="Arial">` +
    `<defs><marker id="mtl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>`;
  const hop = (id) => {
    const [x, y, w, pk, m] = B[id];
    const d = hl.includes(id);
    return `<rect x="${x}" y="${y}" width="${w}" height="64" rx="10" fill="${m}${d ? '30' : '12'}" stroke="${m}" stroke-width="${d ? 4 : 2.5}"/>` +
      `<text x="${x + 10}" y="${y + 20}" font-size="15" font-weight="700" fill="${m}">${pk}</text>` +
      `<text x="${x + w / 2}" y="${y + 49}" text-anchor="middle" font-size="20" font-weight="700" fill="#262626" font-family="Menlo,monospace">${esc(T[id])}</text>`;
  };
  const mui = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555" stroke-width="2.5" marker-end="url(#mtl)"/>`;
  const chu = (x, y, t, anchor = 'middle', m = '#444') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="15" fill="${m}">${t}</text>`;
  for (const id of Object.keys(B)) s += hop(id);
  s += mui(230, 62, 326, 62) + chu(278, 52, 'DTO');                          // main → controller
  s += mui(120, 94, 120, 246) + chu(130, 175, 'checks input', 'start');       // main → utils
  s += mui(660, 62, 786, 62) + chu(723, 52, 'CRUD');                         // controller → repository
  s += mui(400, 94, 400, 246) + chu(390, 160, 'data in,', 'end') + chu(390, 178, 'result out', 'end');   // controller → service
  s += mui(630, 94, 650, 246) + chu(648, 160, 'set +', 'start') + chu(648, 178, 'display()', 'start');   // controller → view
  s += mui(945, 94, 945, 246) + chu(955, 175, 'holds ArrayList', 'start');    // repository → model
  if (cam) {
    s += `<line x1="760" y1="120" x2="826" y2="246" stroke="${DO}" stroke-width="2.5" stroke-dasharray="7 6"/>` +
      `<text x="770" y="140" font-size="22" font-weight="800" fill="${DO}">✗</text>` + chu(806, 196, 'controller ✗ model', 'start', DO);
    s += `<line x1="520" y1="250" x2="560" y2="200" stroke="${DO}" stroke-width="2.5" stroke-dasharray="7 6"/>` +
      chu(452, 222, 'service ✗ repository', 'start', DO);
  }
  s += chu(10, 352, `dto (travels between layers): ${esc(T.dto)}`, 'start', '#555') +
    chu(10, 376, `constants (read by every layer): ${esc(T.constants)}`, 'start', '#555');
  return s + '</svg>';
}

/** Các bước một yêu cầu đi qua tầng: steps = [[tầng, việc, mau]] → hàng hộp đánh số có mũi tên (SVG). */
export function luong(steps, opts = {}) {
  const { w = 1110, h = 170, fs = 18 } = opts;
  const n = steps.length, gap = 34, bw = (w - gap * (n - 1)) / n;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="mlg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  steps.forEach(([tang, viec, m = PG], i) => {
    const x = i * (bw + gap);
    s += `<rect x="${x + 2}" y="18" width="${bw - 4}" height="${h - 30}" rx="12" fill="${m}12" stroke="${m}" stroke-width="2.5"/>` +
      `<circle cx="${x + 24}" cy="20" r="16" fill="${m}"/><text x="${x + 24}" y="26" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">${i + 1}</text>` +
      `<text x="${x + bw / 2}" y="66" text-anchor="middle" font-size="${fs + 1}" font-weight="700" fill="${m}" font-family="Menlo,monospace">${esc(tang)}</text>`;
    String(viec).split('\n').forEach((dong, j) => {
      s += `<text x="${x + bw / 2}" y="${98 + j * (fs + 6)}" text-anchor="middle" font-size="${fs - 2}" fill="#333">${esc(dong)}</text>`;
    });
    if (i < n - 1) s += `<line x1="${x + bw + 2}" y1="${h / 2 + 4}" x2="${x + bw + gap - 3}" y2="${h / 2 + 4}" stroke="${NAU}" stroke-width="3" marker-end="url(#mlg)"/>`;
  });
  return s + '</svg>';
}

/** Một cột của two(): gói nhiều khối thành MỘT ô lưới. */
export const col = (...xs) => `<div style="display:flex;flex-direction:column;gap:12px;min-width:0">${xs.join('')}</div>`;

/** Bỏ các dòng CHỈ có chú thích (để mã vừa slide) — slide phải ghi "(comments hidden)". */
export const boChuThich = (src) => src.split('\n').filter((l) => !/^\s*\/\//.test(l) && l.trim()).join('\n');

/**
 * Lab 2 — stack/heap của "4 — cập nhật số bản": biến `book` (kho) và phần tử bookList[1] cùng trỏ MỘT Book;
 * `before` (controller) trỏ một BookResponseDTO là BẢN SAO. opts.moi: số bản sau khi sửa (null ⇒ chưa sửa).
 */
export function heapBanSao(opts = {}) {
  const { moi = null, h = 400 } = opts;
  const mui = (x1, y1, x2, y2, m = '#555') => `<path d="M${x1},${y1} L${x2},${y2}" stroke="${m}" stroke-width="2.5" fill="none" marker-end="url(#mhb${m.slice(1)})"/>`;
  const dau = (m) => `<marker id="mhb${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 17}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'start'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 1110 ${h}" width="1110" height="${h}" font-family="Arial"><defs>${dau('#555')}${dau(DO)}${dau(XANH)}${dau(CAM)}</defs>`;
  // STACK
  s += `<rect x="0" y="0" width="330" height="${h}" rx="10" fill="#eef4fa" stroke="${PG}" stroke-width="2"/>` + t(14, 26, 'STACK', { b: true, m: PG });
  s += `<rect x="16" y="50" width="298" height="120" rx="8" fill="#fff" stroke="${PG}" stroke-width="1.5"/>` + t(26, 74, 'BookController.updateCopies', { fs: 15, b: true, m: PG }) +
    `<rect x="30" y="94" width="270" height="56" rx="6" fill="#fff7ef" stroke="${CAM}" stroke-width="2"/>` + t(44, 128, 'before', { mono: true, b: true });
  s += `<rect x="16" y="200" width="298" height="120" rx="8" fill="#fff" stroke="${PG}" stroke-width="1.5"/>` + t(26, 224, 'BookRepository.updateCopies', { fs: 15, b: true, m: PG }) +
    `<rect x="30" y="244" width="270" height="56" rx="6" fill="#f1f9f4" stroke="${XANH}" stroke-width="2"/>` + t(44, 278, 'book', { mono: true, b: true });
  // HEAP
  s += `<rect x="360" y="0" width="750" height="${h}" rx="10" fill="#f6fbf7" stroke="${XANH}" stroke-width="2"/>` + t(374, 26, 'HEAP', { b: true, m: XANH });
  // ArrayList
  s += t(390, 66, 'bookList : ArrayList<Book>', { fs: 15, b: true, m: XANH, mono: true });
  ['B001', 'B002', 'B003', 'B004'].forEach((id, i) => {
    const x = 390 + i * 120;
    s += `<rect x="${x}" y="78" width="110" height="44" rx="5" fill="#fff" stroke="${XANH}" stroke-width="${i === 1 ? 3 : 1.5}"/>` + t(x + 55, 106, `[${i}]`, { a: 'middle', fs: 15, mono: true });
  });
  // Book B002
  s += `<rect x="560" y="180" width="300" height="130" rx="10" fill="#fff" stroke="${XANH}" stroke-width="3"/>` + t(574, 204, 'Book', { b: true, m: XANH }) +
    t(574, 232, 'id = "B002"', { mono: true, fs: 16 }) + t(574, 258, 'title = "Effective Java"', { mono: true, fs: 16 }) +
    t(574, 286, `copies = ${moi == null ? '2' : moi}`, { mono: true, fs: 18, b: true, m: moi == null ? '#262626' : DO });
  // DTO copy
  s += `<rect x="890" y="180" width="205" height="130" rx="10" fill="#fff7ef" stroke="${CAM}" stroke-width="2.5" stroke-dasharray="6 4"/>` + t(902, 204, 'BookResponseDTO', { b: true, m: CAM, fs: 15 }) +
    t(902, 232, 'a COPY', { fs: 15, m: CAM }) + t(902, 258, 'id = "B002"', { mono: true, fs: 15 }) + t(902, 286, 'copies = 2', { mono: true, fs: 16, b: true });
  // mũi tên
  s += mui(500, 122, 640, 178, XANH);            // bookList[1] → Book
  s += mui(300, 272, 556, 262, XANH);            // book → Book
  s += `<path d="M300,122 C 330,150 340,150 370,150 L 965,150 Q 990,150 990,176" stroke="${CAM}" stroke-width="2.5" fill="none" marker-end="url(#mhb${CAM.slice(1)})"/>`;  // before → DTO
  s += t(560, h - 14, moi == null ? 'two arrows, ONE Book: change it through either one' : 'book.setCopies(7): the list sees 7 — the copy still says 2', { fs: 17, b: true, m: moi == null ? XANH : DO });
  return s + '</svg>';
}

/**
 * Sơ đồ lớp UML (SVG) cho Lab 4+ (agent pro-lab45): lops = [{ id, ten, kieu?: 'abstract'|'interface', x, y, w,
 * tr?: [trường…], pt?: [phương thức…], mau?, hl?: true, nho?: chữ nhỏ dưới tên }] · mui = [{ tu, den, kieu: 'ke' (extends, nét liền
 * + tam giác rỗng) | 'cai' (implements, nét đứt + tam giác rỗng) | 'dung' (giữ/gọi, nét liền + mũi tên mở), nhan?, cam?: true (gạch đỏ ✗) }].
 * Hộp: đầu 46 px (+20 nếu có «kieu»), mỗi dòng 25 px. Mũi tên nối tâm cạnh gần nhất.
 */
export function soDoLop(lops, mui = [], opts = {}) {
  const { w = 1110, h = 470, fs = 17 } = opts;
  const L = {};
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs>` +
    `<marker id="uke" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13" markerHeight="13" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#fff" stroke="#444" stroke-width="1.4"/></marker>` +
    `<marker id="udung" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#444" stroke-width="1.6"/></marker></defs>`;
  for (const o of lops) {
    const dong = [...(o.tr || []), ...(o.pt || [])];
    const dau = 46 + (o.kieu ? 20 : 0) + (o.nho ? 20 : 0);
    const cao = dau + (o.tr?.length ? 8 : 0) + dong.length * 25 + (o.pt?.length && o.tr?.length ? 8 : 0) + 10;
    L[o.id] = { ...o, cao };
    const m = o.mau || PG;
    s += `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${cao}" rx="8" fill="${o.hl ? m + '22' : '#fff'}" stroke="${m}" stroke-width="${o.hl ? 4 : 2.5}"/>`;
    let y = o.y + 22;
    if (o.kieu) { s += `<text x="${o.x + o.w / 2}" y="${y}" text-anchor="middle" font-size="15" fill="${m}">«${o.kieu}»</text>`; y += 20; }
    s += `<text x="${o.x + o.w / 2}" y="${y + 6}" text-anchor="middle" font-size="${fs + 4}" font-weight="700" fill="#262626" font-family="Menlo,monospace"${o.kieu === 'abstract' ? ' font-style="italic"' : ''}>${esc(o.ten)}</text>`;
    y += 12;
    if (o.nho) { y += 16; s += `<text x="${o.x + o.w / 2}" y="${y}" text-anchor="middle" font-size="14" fill="#666">${esc(o.nho)}</text>`; }
    y += 10;
    s += `<line x1="${o.x}" y1="${y}" x2="${o.x + o.w}" y2="${y}" stroke="${m}" stroke-width="1.5"/>`;
    for (const t of o.tr || []) { y += 25; s += `<text x="${o.x + 12}" y="${y}" font-size="${fs}" fill="#333" font-family="Menlo,monospace">${esc(t)}</text>`; }
    if (o.tr?.length && o.pt?.length) { y += 10; s += `<line x1="${o.x}" y1="${y}" x2="${o.x + o.w}" y2="${y}" stroke="${m}" stroke-width="1.2"/>`; }
    for (const t of o.pt || []) {
      y += 25;
      const nghieng = /\babstract\b/.test(t) || o.kieu === 'interface';
      s += `<text x="${o.x + 12}" y="${y}" font-size="${fs}" fill="#333" font-family="Menlo,monospace"${nghieng ? ' font-style="italic"' : ''}>${esc(t.replace(/\babstract /, ''))}</text>`;
    }
  }
  for (const a of mui) {
    const A = L[a.tu], B = L[a.den];
    const ax = A.x + A.w / 2, ay = A.y + A.cao / 2, bx = B.x + B.w / 2, by = B.y + B.cao / 2;
    let x1, y1, x2, y2;
    if (Math.abs(by - ay) > Math.abs(bx - ax) * 0.45) {           // dọc
      x1 = a.x1 ?? ax; x2 = a.x2 ?? bx;
      if (by < ay) { y1 = A.y; y2 = B.y + B.cao; } else { y1 = A.y + A.cao; y2 = B.y; }
    } else {                                                       // ngang
      y1 = a.y1 ?? ay; y2 = a.y2 ?? by;
      if (bx > ax) { x1 = A.x + A.w; x2 = B.x; } else { x1 = A.x; x2 = B.x + B.w; }
    }
    const net = a.kieu === 'cai' ? ' stroke-dasharray="9 6"' : '';
    const dau = a.kieu === 'dung' ? 'udung' : 'uke';
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${a.cam ? DO : '#444'}" stroke-width="2.4"${net}${a.cam ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#${dau})"/>`;
    if (a.nhan) s += `<text x="${(x1 + x2) / 2 + (a.dx ?? 8)}" y="${(y1 + y2) / 2 + (a.dy ?? -6)}" font-size="15" fill="${a.cam ? DO : '#555'}" text-anchor="${a.neo || 'start'}">${esc(a.nhan)}</text>`;
  }
  return s + '</svg>';
}

/** Hai cột "javac nhìn KIỂU KHAI BÁO · JVM nhìn ĐỐI TƯỢNG" cho một lời gọi đa hình (SVG 1110 × h). */
export function haiCua(opts = {}) {
  const { h = 300, khai = 'LibraryItem item', goi = 'item.getLoanDays()', doiTuong = ['Book → 14', 'Magazine → 7', 'Dvd → 3'] } = opts;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 20}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'start'}">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 1110 ${h}" width="1110" height="${h}" font-family="Arial">`;
  s += `<rect x="0" y="0" width="520" height="${h}" rx="12" fill="#eef4fa" stroke="${PG}" stroke-width="2.5"/>` + t(20, 34, '1 · javac (compile time)', { b: true, m: PG, fs: 22 }) +
    t(20, 76, `${khai};`, { mono: true, fs: 20 }) + t(20, 112, `${goi}`, { mono: true, fs: 20 }) +
    t(20, 160, 'looks at the DECLARED type:', { fs: 19 }) + t(20, 192, 'does LibraryItem have getLoanDays()?', { fs: 19 }) + t(20, 232, '✓ yes ⇒ compiles', { b: true, m: XANH, fs: 21 }) +
    t(20, 266, '(no ⇒ "cannot find symbol")', { fs: 17, m: '#666' });
  s += `<rect x="590" y="0" width="520" height="${h}" rx="12" fill="#fdf3e6" stroke="${CAM}" stroke-width="2.5"/>` + t(610, 34, '2 · JVM (run time)', { b: true, m: CAM, fs: 22 }) +
    t(610, 76, 'looks at the OBJECT on the heap', { fs: 19 }) + t(610, 106, 'and runs ITS version:', { fs: 19 });
  doiTuong.forEach((d, i) => { s += `<rect x="610" y="${128 + i * 52}" width="480" height="42" rx="8" fill="#fff" stroke="${CAM}" stroke-width="1.8"/>` + t(626, 156 + i * 52, d, { mono: true, fs: 19 }); });
  s += `<line x1="524" y1="${h / 2}" x2="584" y2="${h / 2}" stroke="#444" stroke-width="3" marker-end="url(#mtl2)"/><defs><marker id="mtl2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#444"/></marker></defs>`;
  return s + '</svg>';
}

/**
 * (pro-lab211) Ngắt dòng mã dài hơn `max` ký tự cho vừa cột slide: ưu tiên sau ", ", rồi trước " && " / " || ", rồi trước
 * ".", rồi dấu cách; dòng nối thụt thêm 8. Chỉ để HIỂN THỊ (mã thật trong dự án không đổi — dòng ≤ 100 ký tự theo checklist).
 */
export function boc(src, max = 64) {
  const out = [];
  for (const line of src.split('\n')) {
    let rest = line;
    const ind = line.match(/^ */)[0].length;
    let first = true;
    while (rest.length > max) {
      const head = rest.slice(0, max);
      let cut = head.lastIndexOf(', ') + 2;
      if (cut < ind + 12) cut = Math.max(head.lastIndexOf(' && '), head.lastIndexOf(' || ')) + 1;
      if (cut < ind + 12) cut = head.lastIndexOf('.');
      if (cut < ind + 12) cut = head.lastIndexOf(' ') + 1;
      if (cut < ind + 12) break;
      out.push(rest.slice(0, cut).replace(/\s+$/, ''));
      rest = ' '.repeat(ind + 8) + rest.slice(cut).replace(/^\s+/, '');
      first = false;
    }
    out.push(rest);
  }
  return out.join('\n');
}
