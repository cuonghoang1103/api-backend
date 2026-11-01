/**
 * Authentication — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua). CHÉP từ ../../networking-practice/nguon/_net.mjs (01/11/2026),
 * bỏ phần dữ liệu phòng lab mạng + dựng frame.
 *
 *  - KHOA = 'authentication', thẻ 'authentication'. Dữ liệu trong đề = output CHẠY THẬT của LabFlow ID trong bài học (chép nguyên văn).
 *  - Bài viết hàm (js) dựng bằng `jsBai()`: lời giải là MÃ NGUỒN THẬT (chuỗi), `mongDoi` của mọi kiểm tính bằng cách CHẠY lời giải
 *    trong node:vm (realm mới, như Worker của máy chấm) ⇒ lời giải và đáp án không thể lệch nhau. Bộ dựng tự kiểm: lời giải
 *    không được ném lỗi ngoài ý muốn, code khởi đầu phải trượt ≥ 1 kiểm (so sâu như máy chấm), kiểm ẩn phải có.
 *  - Trắc nghiệm / sắp thứ tự xáo theo NỘI DUNG bằng ../../_chung/tracNghiem.mjs — không bao giờ viết tay chữ a/b/c/d.
 */
import vm from 'node:vm';
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';
export { doiDau };

export const KHOA = 'authentication';
const THE = ['authentication'];

/* ═══════════════════ chữ ═══════════════════ */
/** [en, vi] ⇒ { en, vi } */
export const bi = (en, vi) => ({ en, vi });
/** Câu song ngữ cho choice/order/table (EN chính, VI nghiêng ngay dưới). */
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
/** Giải thích song ngữ trong một khối. */
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));
const chu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Khối lệnh / output (escape HTML). */
export const pre = (s) => `<pre>${esc(Array.isArray(s) ? s.join('\n') : s)}</pre>`;
/** Mã nội dòng. */
export const c = (s) => `<code>${esc(s)}</code>`;
/** Bảng HTML nhỏ cho đề. */
export function tab(heads, rows) {
  return `<table><thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
/** Thuật ngữ: { en, vi, giaiThich } */
export const tn = (en, vi, giaiThich) => ({ en, vi, ...(giaiThich ? { giaiThich } : {}) });

/* ═══════════════════ bài tĩnh: choice / order / table ═══════════════════ */
const MAC_DINH_YC = [
  bi('Answer every question in the answer panel, then press <b>Submit</b>.', 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.'),
  bi('All answers must be correct to get <b>Accepted</b>; the explanation of every question appears after you submit.', 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.'),
];
const MAC_DINH_VIDU = [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }];

/** q = { tieuDe, doKho, phut, moTa:{en,vi}, loai:'choice'|'order'|'table', cauHoi|bang, goiY, loiHayGap, thuatNgu?, khaiNiem? } */
export function tinh(q0) {
  const q = { ...q0 };
  const loai = q.loai || 'choice';
  if (loai === 'choice') {
    q.cauHoi = xaoCauHoi(q.cauHoi);
    q.giaiThich = loiGiaiTracNghiem(q.cauHoi, q.giaiThich);
  }
  if (loai === 'order') {
    q.cauHoi = q.cauHoi.map(xaoThuTu);
    if (!q.giaiThich) q.giaiThich = q.cauHoi.map((x) => x.giaiThich).join('');
  }
  if (loai === 'table' && !q.giaiThich) q.giaiThich = q.bang.map((b) => b.giaiThich).join('');
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const de = ds.map((x, i) => `${i + 1}. ${chu(x.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v.join(' / ') : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((x, i) => {
      const d = Array.isArray(x.dapAn) ? (Array.isArray(x.dapAn[0]) ? x.dapAn[0] : x.dapAn) : [x.dapAn];
      const muc = x.luaChon || x.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((y) => y.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(x.de)}\n   Answer: ${ten}\n   ${chu(x.giaiThich)}`;
    }).join('\n\n');
  }
  const tests = loai === 'table' ? { loai, bang: q.bang } : { loai, cauHoi: q.cauHoi };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  void _c; void _b; void _l;
  const tieu = typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en;
  const dem = ds.length;
  const them = {
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. Work each one out yourself first (on paper or in the lab), then check — every explanation after Submit says why the tempting wrong answer is wrong.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Hãy tự giải trước (ra giấy hoặc chạy trong phòng lab) rồi mới kiểm — giải thích sau khi Nộp nói rõ vì sao phương án "trông đúng" lại sai.</i></p>`,
  };
  const moTa = q.moTa && typeof q.moTa === 'object' ? { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi } : q.moTa;
  return {
    ngonNgu: 'text',
    the: THE,
    dangBai: 'practice',
    yeuCau: MAC_DINH_YC,
    viDu: MAC_DINH_VIDU,
    thuatNgu: [],
    ...rest,
    moTa,
    tests,
    khoiDau: { 'answers.md': `# ${tieu}\n\nAnswer in the answer panel (no code needed).\n\n${de}\n` },
    loiGiai: { 'answers.md': `# ${tieu} — answer key\n\n${dap}\n` },
  };
}

/** Một câu trắc nghiệm: đáp án đúng là phương án ĐẦU trong `opts` (tinh() xáo theo nội dung). */
export function q(ma, de, opts, gt) {
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: ['a'], giaiThich: giai(gt[0], gt[1]) };
}
/** Trắc nghiệm nhiều đáp án: `dung` = các chỉ số (0-based) của phương án đúng. */
export function qn(ma, de, opts, dung, gt) {
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: [dung.map((i) => 'abcdef'[i]).sort()], nhieu: true, giaiThich: giai(gt[0], gt[1]) };
}
/** Sắp thứ tự: các bước viết ĐÚNG thứ tự; tinh() xáo và đổi mã. */
export function ord(ma, de, steps, gt) {
  return { ma, de: hai(de[0], de[1]), muc: steps.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), dapAn: steps.map((_, i) => `s${i + 1}`), giaiThich: giai(gt[0], gt[1]) };
}
/**
 * Một bảng: bang1(ma, [en,vi], cot:[{ma,ten,luaChon?}], hang:[{o:{cột:'cho sẵn'}, a:{cột:'đáp án'|[các dạng]}}], [giải en, vi])
 */
export function bang1(ma, de, cot, hang, gt) {
  const dapAn = {};
  hang.forEach((h, i) => { for (const [k, v] of Object.entries(h.a)) dapAn[`r${i + 1}.${k}`] = v; });
  return { ma, de: hai(de[0], de[1]), cot, hang: hang.map((h, i) => ({ ma: `r${i + 1}`, o: h.o })), dapAn, giaiThich: giai(gt[0], gt[1]) };
}
/** Mô tả song ngữ (HTML). */
export const mt = (en, vi) => bi(`<p>${en}</p>`, `<p>${vi}</p>`);
/** Bộ tĩnh nhanh: cs({ten,kho,phut,en,vi,cau|bang,loai,goiY,loi,tns,kn}) — goiY/loi là [en, vi]. */
export function cs({ ten, kho, phut, en, vi, cau, goiY, loi, tns = [], kn = [], loai = 'choice', bang }) {
  return tinh({ tieuDe: ten, doKho: kho, phut, moTa: mt(en, vi), loai, ...(loai === 'table' ? { bang } : { cauHoi: cau }), goiY: goiY.map(hv), loiHayGap: loi.map(hv), thuatNgu: tns, khaiNiem: kn });
}
/** [en, vi] | {en,vi} | 'chuỗi' ⇒ {en, vi} */
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);
/** Số làm tròn d chữ số ⇒ các dạng chấp nhận ("55.7", "55.70", "55,7", kèm "%" nếu pct). */
export function soNhan(v, d = 1, pct = false) {
  const a = Number(v).toFixed(d); const b = String(+a);
  const ds = [...new Set([a, b, a.replace('.', ','), b.replace('.', ',')])];
  return pct ? [...ds, ...ds.map((x) => `${x}%`), ...ds.map((x) => `${x} %`)] : ds;
}

/* ═══════════════════ bài viết hàm (js) — lời giải chạy thật ═══════════════════ */
/** Nối mã nguồn các hàm tham chiếu (giữ chú thích) thành tệp lời giải. */
export const nguon = (...fns) => fns.map((f) => (typeof f === 'string' ? f.trim() : f.toString())).join('\n\n') + '\n';
/** goi('parseFrame', a, b) ⇒ 'parseFrame(<json a>, <json b>)' */
export const goi = (fn, ...args) => `${fn}(${args.map((a) => JSON.stringify(a)).join(', ')})`;

/** Chạy `ma` + một biểu thức trong realm mới ⇒ giá trị JSON | { loi } (như máy chấm: lỗi ném ⇒ { loi: tên }). */
function chay(ma, bieuThuc) {
  const ctx = vm.createContext({});
  try {
    vm.runInContext(ma, ctx, { timeout: 2000 });
    const v = vm.runInContext(`JSON.stringify((${bieuThuc}))`, ctx, { timeout: 2000 });
    return { v: v === undefined ? { $js: 'undefined' } : JSON.parse(v) };
  } catch (e) {
    return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) };
  }
}
/** So sâu như máy chấm (mảng theo thứ tự, object không kể thứ tự khoá). */
function bang(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => bang(x, b[i]));
  const ka = Object.keys(a); const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && bang(a[k], b[k]));
}

/**
 * Bài viết hàm. spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML mô tả), yc?: [[en,vi]…], dauVao?:[en,vi], dauRa?:[en,vi], rangBuoc?: [[en,vi]…],
 *   goiY: [[en,vi]…] (≥2), loi: [[en,vi]…] (≥2), gt: [en, vi] (HTML: VÌ SAO đúng), kn: [], tns: [tn()…],
 *   dau: 'mã khởi đầu', giai: 'mã lời giải', cases: [{ goi, an?, nem?: 'RangeError', moTa?: [en,vi] }], kiemThem?: [kiểm ma-nguon…],
 *   viDu?: [{ input, output, explanation }] (mặc định: ca đầu), vdGt?: [en, vi], banIn?
 * }
 */
export function jsBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], dau, giai: giaiMa, cases, kiemThem = [], viDu, vdGt, banIn } = s;
  if (!cases.some((x) => x.an)) throw new Error(`${ten}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${ten}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  let truotKhoiDau = 0;
  const kiem = cases.map((x, i) => {
    const r = chay(giaiMa, x.goi);
    let mongDoi;
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${ten}: ca ${x.goi} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      mongDoi = { loi: x.nem };
    } else {
      if (r.loi) throw new Error(`${ten}: lời giải ném ${r.loi} ở ${x.goi}: ${r.thongDiep}`);
      mongDoi = r.v;
    }
    const k = chay(dau, x.goi);
    const datKhoiDau = x.nem ? k.loi === x.nem : (!k.loi && bang(k.v, mongDoi));
    if (!datKhoiDau) truotKhoiDau++;
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}: ${x.goi.length > 90 ? `${x.goi.slice(0, 87)}...` : x.goi}`, `Ca ${i + 1}`));
    return { moTa: nhan, goi: x.goi, mongDoi, ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}) };
  });
  if (!truotKhoiDau) throw new Error(`${ten}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const dau0 = kiem.find((k) => !k.an);
  const viDuMd = viDu || [{
    input: dau0.goi,
    output: JSON.stringify(dau0.mongDoi),
    explanation: vdGt ? `${vdGt[0]}|||${vdGt[1]}` : 'The first sample case (more cases run when you press Run; hidden ones only on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy thêm các ca hiện; ca ẩn chỉ chạy khi Nộp).',
  }];
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en, vi),
    yeuCau: (yc || [['Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'], ['Do not modify the arguments.', 'Không sửa các đối số.']]).map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDuMd,
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    ...(banIn ? { banIn } : {}),
    tests: { loai: 'js', phienBan: 1, tepChinh: 'answer.js', tepNap: ['answer.js'], kiem: [...kiem, ...kiemThem] },
    khoiDau: { 'answer.js': dau },
    loiGiai: { 'answer.js': giaiMa },
  };
}

/* ═══════════════════ hàm trợ giúp THUẦN JS cho đề cần SHA-256 / HMAC (realm vm không có Buffer/crypto) ═══════════════════
 * Đã đối chiếu với node:crypto (8 chuỗi: rỗng, 55/56/64 byte, tiếng Việt + emoji, 400 byte ngẫu nhiên) — 8/8 khớp. */
export const TRO_GIUP = `// ── provided helpers (pure JavaScript, no Buffer / crypto) ──
function utf8(str) { // string ⇒ array of bytes (UTF-8)
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.codePointAt(i);
    if (c > 0xffff) i++;
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}
function hex(bytes) { return bytes.map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(''); }
function sha256(bytes) { // array of bytes ⇒ array of 32 bytes
  var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  var m = bytes.slice(); var bits = bytes.length * 8;
  m.push(0x80); while (m.length % 64 !== 56) m.push(0);
  for (var s = 56; s >= 0; s -= 8) m.push(s >= 32 ? Math.floor(bits / Math.pow(2, s)) & 255 : (bits >>> s) & 255);
  var r = function (x, n) { return (x >>> n) | (x << (32 - n)); };
  for (var o = 0; o < m.length; o += 64) {
    var w = [];
    for (var i = 0; i < 16; i++) w[i] = (m[o + 4 * i] << 24) | (m[o + 4 * i + 1] << 16) | (m[o + 4 * i + 2] << 8) | m[o + 4 * i + 3];
    for (i = 16; i < 64; i++) w[i] = (w[i - 16] + (r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3)) + w[i - 7] + (r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10))) | 0;
    var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], k = h[7];
    for (i = 0; i < 64; i++) {
      var t1 = (k + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      var t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      k = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h = [h[0] + a, h[1] + b, h[2] + c, h[3] + d, h[4] + e, h[5] + f, h[6] + g, h[7] + k].map(function (x) { return x | 0; });
  }
  var out = [];
  h.forEach(function (x) { out.push((x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255); });
  return out;
}
`;

/** TRO_GIUP + HMAC-SHA256, base64url hai chiều, giải UTF-8 — đối chiếu node:crypto/Buffer 89/89 (01/11/2026). Dùng cho Lab 1. */
export const TRO_GIUP_HMAC = TRO_GIUP + `function hmacSha256(key, msg) { // arrays of bytes ⇒ array of 32 bytes (RFC 2104)
  if (key.length > 64) key = sha256(key);
  var k = key.slice(); while (k.length < 64) k.push(0);
  var ipad = k.map(function (b) { return b ^ 0x36; });
  var opad = k.map(function (b) { return b ^ 0x5c; });
  return sha256(opad.concat(sha256(ipad.concat(msg))));
}
function b64url(bytes) { // array of bytes ⇒ base64url text, no padding
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  var out = '';
  for (var i = 0; i < bytes.length; i += 3) {
    var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
    var left = bytes.length - i;
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + (left > 1 ? A[(n >> 6) & 63] : '') + (left > 2 ? A[n & 63] : '');
  }
  return out;
}
function unb64url(text) { // base64url text ⇒ array of bytes, or null if it is not valid base64url
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  if (typeof text !== 'string' || !/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) return null;
  var bytes = [], bits = 0, acc = 0;
  for (var i = 0; i < text.length; i++) {
    acc = (acc << 6) | A.indexOf(text[i]); bits += 6;
    if (bits >= 8) { bits -= 8; bytes.push((acc >> bits) & 255); }
  }
  return bytes;
}
function fromUtf8(bytes) { // array of bytes ⇒ string (valid UTF-8 assumed)
  var s = '';
  for (var i = 0; i < bytes.length;) {
    var b = bytes[i], c;
    if (b < 0x80) { c = b; i += 1; }
    else if (b < 0xe0) { c = ((b & 31) << 6) | (bytes[i + 1] & 63); i += 2; }
    else if (b < 0xf0) { c = ((b & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63); i += 3; }
    else { c = ((b & 7) << 18) | ((bytes[i + 1] & 63) << 12) | ((bytes[i + 2] & 63) << 6) | (bytes[i + 3] & 63); i += 4; }
    s += String.fromCodePoint(c);
  }
  return s;
}
`;
