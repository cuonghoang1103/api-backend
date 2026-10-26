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
