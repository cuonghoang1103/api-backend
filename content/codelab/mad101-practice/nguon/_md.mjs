/**
 * MAD101 practice — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua).
 * Dùng các loại chấm có sẵn: choice · order · table (thuần JS) và js (Worker; hàm người học viết, mongDoi do MÃ tính từ _sim.mjs).
 * Chữ: mọi trường nhận `[en, vi]` hoặc `{ en, vi }`; riêng câu trong choice/order/table là HTML song ngữ (hai()).
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';
export { doiDau };
export * as S from './_sim.mjs';

export const KHOA = 'discrete-mathematics';

/** [en, vi] ⇒ { en, vi } */
export const bi = (en, vi) => ({ en, vi });
/** Câu song ngữ cho choice/order/table (EN chính, VI nghiêng ngay dưới). */
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
/** Giải thích song ngữ. */
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
/** Lựa chọn nhanh: ['a', 'nội dung'] … ⇒ [{ma, noiDung}] */
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));
const chu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const pre = (s) => `<pre>${esc(s)}</pre>`;

/** Bảng HTML nhỏ cho đề. */
export function tab(heads, rows) {
  return `<table><thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
/** Số thực ⇒ các dạng chấp nhận (2 chữ số thập phân và dạng rút gọn). */
export function so(v) {
  const a = Number(v).toFixed(2); const b = String(+Number(v).toFixed(2));
  return [...new Set([a, b, ...(Number.isInteger(+b) ? [String(+b)] : [])])];
}
/** Gantt dạng chữ: | P1 0-4 | P2 4-7 | */
export const gantt = (g) => g.map(([id, s, e]) => `${id}[${s}–${e}]`).join(' ');
/** [[id,start,end]…] ⇒ dòng "P1 P1 P2" theo từng đơn vị thời gian. */
export const theoDonVi = (g) => g.flatMap(([id, s, e]) => Array.from({ length: e - s }, () => id));

/* ═══════════════════ bài tĩnh: choice / order / table ═══════════════════ */
const MAC_DINH_YC = [
  bi('Answer every question in the answer panel, then press <b>Submit</b>.', 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.'),
  bi('All answers must be correct to get <b>Accepted</b>; the explanations appear after you submit.', 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.'),
];
const MAC_DINH_VIDU = [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }];

/** q = { tieuDe, doKho, phut, moTa:{en,vi}, loai:'choice'|'order'|'table', cauHoi|bang, goiY, loiHayGap, giaiThich, thuatNgu?, khaiNiem?, viDu?, videoRef? } */
export function tinh(q0) {
  const q = { ...q0 };
  const loai = q.loai || 'choice';
  if (loai === 'choice') {
    // Xáo theo băm nội dung; chữ cái trong lời giải SINH SAU khi xáo — không viết tay (xem _chung/tracNghiem.mjs).
    q.cauHoi = xaoCauHoi(q.cauHoi);
    q.giaiThich = loiGiaiTracNghiem(q.cauHoi, q.giaiThich);
  }
  if (loai === 'order') {
    q.cauHoi = q.cauHoi.map(xaoThuTu);
    if (!q.giaiThich) q.giaiThich = q.cauHoi.map((c) => c.giaiThich).join('');
  }
  if (loai === 'table' && !q.giaiThich) q.giaiThich = q.bang.map((b) => b.giaiThich).join('');
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const de = ds.map((c, i) => `${i + 1}. ${chu(c.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v.join(' / ') : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((c, i) => {
      const d = Array.isArray(c.dapAn) ? (Array.isArray(c.dapAn[0]) ? c.dapAn[0] : c.dapAn) : [c.dapAn];
      const muc = c.luaChon || c.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((x) => x.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(c.de)}\n   Answer: ${ten}\n   ${chu(c.giaiThich)}`;
    }).join('\n\n');
  }
  const tests = loai === 'table' ? { loai, bang: q.bang } : { loai, cauHoi: q.cauHoi };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  void _c; void _b; void _l;
  const tieu = typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en;
  const dem = ds.length;
  const them = {
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. The questions follow the style of the MAD101 final exam, so work them out on paper first, exactly as you would in the exam hall.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Câu hỏi theo phong cách đề FE của môn MAD101, nên hãy giải ra giấy trước như khi ngồi phòng thi.</i></p>`,
  };
  const moTa = q.moTa && typeof q.moTa === 'object' ? { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi } : q.moTa;
  return {
    ngonNgu: 'text',
    the: ['mad101'],
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

/* ═══════════════════ bài viết hàm (js) ═══════════════════ */
/** Mã nguồn của một hàm tham chiếu (để làm lời giải) — giữ nguyên chú thích. */
export const nguon = (...fns) => fns.map((f) => (typeof f === 'string' ? f : f.toString())).join('\n\n') + '\n';

/**
 * q = { …trường đề…, tep:'answer.js', fn:'schedule', dau:'khởi đầu', giaiMa:'lời giải', ref:(…args)=>kết quả,
 *       cases:[{args:[…], an?:true, moTa?:{en,vi}|string, so?:'giaTri'}], thuVien?: {tên: mã} (tệp phụ cho người học dùng) }
 * Mỗi case ⇒ một kiểm: goi `fn(args…)`, mongDoi = ref(args…) (so sâu).
 */
export function jsDe(q) {
  const { tep = 'answer.js', fn, dau, giaiMa, ref, cases, kiemThem = [], thuVien, ...rest } = q;
  const kiem = cases.map((c, i) => {
    const goi = `${fn}(${c.args.map((a) => JSON.stringify(a)).join(', ')})`;
    const mong = JSON.parse(JSON.stringify(ref(...c.args.map((a) => JSON.parse(JSON.stringify(a))))));
    return {
      moTa: c.moTa || (c.an ? { en: `Hidden case ${i + 1}`, vi: `Ca ẩn ${i + 1}` } : { en: `Case ${i + 1}: ${fn}(${c.args.map((a) => JSON.stringify(a)).join(', ').slice(0, 70)})`, vi: `Ca ${i + 1}` }),
      goi, mongDoi: mong, ...(c.an ? { an: true } : {}), ...(c.saiSo ? { saiSo: c.saiSo } : {}),
    };
  });
  const khoiDau = { [tep]: dau }; const loiGiai = { [tep]: giaiMa };
  const tepNap = [];
  if (thuVien) for (const [t, m] of Object.entries(thuVien)) { khoiDau[t] = m; loiGiai[t] = m; tepNap.push(t); }
  tepNap.push(tep);
  return {
    the: ['mad101'],
    ngonNgu: 'javascript',
    dangBai: 'practice',
    thuatNgu: [],
    ...rest,
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepChinh: tep, tepNap, kiem: [...kiem, ...kiemThem] },
    khoiDau, loiGiai,
  };
}

/** Hai chuỗi “vi” rút gọn cho mô tả mặc định các lỗi hay gặp. */
export const L = (en, vi) => ({ en, vi });

/** Một câu trắc nghiệm: mc('c1', [en, vi], [['a','…'],…], 'a' | ['a','c'], [giải thích en, vi]) */
export function mc(ma, de, opts, dap, gt, nhieu) {
  if (new Set(opts.map((o) => o[1])).size !== opts.length) throw new Error('mc ' + ma + ': phương án trùng ' + JSON.stringify(opts.map((o) => o[1])));
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts), dapAn: Array.isArray(dap) ? (nhieu ? [dap] : dap) : [dap], ...(nhieu ? { nhieu: true } : {}), giaiThich: giai(gt[0], gt[1]) };
}
/** Dịch vòng k bước. Thứ tự hiện của “order” và “choice” do tinh() xáo lại theo nội dung. */
export function xoay(a, k) { return a.slice(k % a.length).concat(a.slice(0, k % a.length)); }
/** Tên thuật ngữ rút gọn. */
export const tn = (en, vi) => ({ en, vi });

/** Mã nguồn của hàm tham chiếu, đổi tên hàm thành `ten` (toString không có chữ export). */
export const dat = (fn, ten) => String(fn).replace(/^(async\s+)?function\s+[\w$]+/, `function ${ten}`) + '\n';

/** Bốn phương án số: đáp án đúng + 3 nhiễu (lệch cho trước), xếp xác định. Trả [[ma,nội dung]…] và mã đúng. */
export function so4(dung, nhieu, fmt) {
  const f = fmt || ((x) => String(x));
  const ds = [dung, ...nhieu].map((v) => f(v));
  const duyNhat = [...new Set(ds)];
  if (duyNhat.length < 4) throw new Error('so4: phương án trùng ' + JSON.stringify(ds));
  return duyNhat.slice(0, 4);
}

/** Câu trắc nghiệm số: đáp án đúng (viết đầu, tinh() sẽ xáo) + 3 nhiễu. */
export function mcNum(ma, de, dung, nhieu, fmt, gt) {
  const ds = so4(dung, nhieu, fmt);
  return mc(ma, de, ds.map((t, i) => ['abcd'[i], t]), 'a', gt);
}

/* ═══════════════ trợ giúp riêng MAD101 ═══════════════ */
/**
 * Một bảng điền: bang1(ma, [en,vi], cot:[{ma,ten,luaChon?}], hang:[{o:{cột:'cho sẵn'}, a:{cột:'đáp án'|[các dạng]}}], [giải en, vi])
 * Mã hàng r1…; đáp án khoá `r1.cột`.
 */
export function bang1(ma, de, cot, hang, gt) {
  const dapAn = {};
  hang.forEach((h, i) => { for (const [c, v] of Object.entries(h.a)) dapAn[`r${i + 1}.${c}`] = v; });
  return { ma, de: hai(de[0], de[1]), cot, hang: hang.map((h, i) => ({ ma: `r${i + 1}`, o: h.o })), dapAn, giaiThich: giai(gt[0], gt[1]) };
}
/** Một câu sắp thứ tự: ord('q1', [en,vi], ['bước đúng 1', …], [giải en, vi], k) — k bỏ qua: tinh() xáo lại. */
export function ord(ma, de, steps, gt, k = 2) {
  return { ma, de: hai(de[0], de[1]), muc: xoay(steps.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), k), dapAn: steps.map((_, i) => `s${i + 1}`), giaiThich: giai(gt[0], gt[1]) };
}
/** Làm tròn d chữ số ⇒ các dạng chấp nhận ("1.50", "1.5"). */
export const r2 = (v, d = 2) => { const a = Number(v).toFixed(d), b = String(+Number(v).toFixed(d)); return a === b ? [a] : [a, b]; };
/** Số nguyên có dấu phẩy nghìn hay không: chấp nhận cả hai. */
export const nguyen = (v) => { const a = String(Math.round(v)); return [a]; };
/** Bảng HTML nhỏ (gọi lại từ `tab`) + khối mã. */
export const code = (s) => `<pre>${esc(s)}</pre>`;
/** Đề trắc nghiệm nhanh: mc rút gọn, đáp án đúng luôn là phương án ĐẦU trong `opts` (tinh() sẽ xáo). */
export function q(ma, de, opts, gt) {
  return mc(ma, de, opts.map((t, i) => ['abcdef'[i], t]), 'a', gt);
}

/* ═══════════════ trợ giúp riêng MAD101 (logic, bảng chân trị) ═══════════════ */
import * as SIM from './_sim.mjs';
export const V = (x) => ['var', x];
export const N = (a) => ['not', a];
export const A = (a, b) => ['and', a, b];
export const O = (a, b) => ['or', a, b];
export const X = (a, b) => ['xor', a, b];
export const I = (a, b) => ['imp', a, b];
export const Q = (a, b) => ['iff', a, b];
export const show = SIM.show;
/** Bảng chân trị điền sẵn các biến, người học điền cột kết quả của từng công thức. */
export function truthBang(ma, de, vars, formulas, gt) {
  const n = vars.length; const hang = [];
  for (let m = 0; m < (1 << n); m++) {
    const env = {}; vars.forEach((v, i) => { env[v] = ((m >> (n - 1 - i)) & 1) === 0; });
    const o = {}; vars.forEach((v) => { o[v] = env[v] ? 'T' : 'F'; });
    const a = {}; formulas.forEach((f, j) => { a['c' + (j + 1)] = SIM.evalF(f, env) ? 'T' : 'F'; });
    hang.push({ o, a });
  }
  const cot = [...vars.map((v) => ({ ma: v, ten: v })), ...formulas.map((f, j) => ({ ma: 'c' + (j + 1), ten: SIM.show(f, true), luaChon: ['T', 'F'] }))];
  return bang1(ma, de, cot, hang, gt);
}
/** Dạng chữ của cột chân trị, vd "T F T T". */
export const colText = (f) => SIM.column(f).join(' ');

/** Các dạng viết chấp nhận được của một tập hữu hạn số/chữ (đã sắp): 1,2,3 · {1,2,3} · {1, 2, 3} · 1, 2, 3 · 1 2 3. Rỗng: ∅ · {} · empty. */
export function setAns(arr) {
  if (!arr.length) return ['∅', '{}', '{ }', 'empty', 'ø'];
  const a = arr.map(String);
  return [a.join(','), `{${a.join(',')}}`, `{${a.join(', ')}}`, a.join(', '), a.join(' ')];
}
/** Dãy có thứ tự: 2,0,1 · (2,0,1) · [2,0,1] · 2, 0, 1 · 2 0 1. */
export function listAns(arr) {
  const a = arr.map(String);
  return [a.join(','), `(${a.join(',')})`, `[${a.join(',')}]`, a.join(', '), `(${a.join(', ')})`, `[${a.join(', ')}]`, a.join(' ')];
}
/** Số thực ⇒ các dạng chấp nhận (làm tròn d chữ số). */
export const dec = (v, d = 2) => r2(v, d);

/** Phân tích ra thừa số nguyên tố: các cách viết chấp nhận (2^3*3^2*5 · 2^3 * 3^2 * 5 · 2^3·3^2·5 · 2^3×3^2×5). */
export function factorAns(n) {
  const f = SIM.factor(n).map(([p, e]) => (e === 1 ? String(p) : `${p}^${e}`));
  return [f.join('*'), f.join(' * '), f.join('·'), f.join(' · '), f.join('×'), f.join(' × '), f.join(' x '), f.join(' ')];
}
