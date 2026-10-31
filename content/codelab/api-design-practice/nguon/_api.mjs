/**
 * API Design — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua). CHÉP từ ../../networking-practice/nguon/_net.mjs (01/11/2026),
 * bỏ phần dữ liệu phòng lab mạng + dựng frame.
 *
 *  - KHOA = 'api-design', thẻ 'api-design'. Dữ liệu trong đề = output CHẠY THẬT của LabFlow API trong bài học (chép nguyên văn).
 *  - Bài viết hàm (js) dựng bằng `jsBai()`: lời giải là MÃ NGUỒN THẬT (chuỗi), `mongDoi` của mọi kiểm tính bằng cách CHẠY lời giải
 *    trong node:vm (realm mới, như Worker của máy chấm) ⇒ lời giải và đáp án không thể lệch nhau. Bộ dựng tự kiểm: lời giải
 *    không được ném lỗi ngoài ý muốn, code khởi đầu phải trượt ≥ 1 kiểm (so sâu như máy chấm), kiểm ẩn phải có.
 *  - Trắc nghiệm / sắp thứ tự xáo theo NỘI DUNG bằng ../../_chung/tracNghiem.mjs — không bao giờ viết tay chữ a/b/c/d.
 */
import vm from 'node:vm';
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';
export { doiDau };

export const KHOA = 'api-design';
const THE = ['api-design'];

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
