/**
 * OSG202 practice — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua).
 * Dùng các loại chấm có sẵn: choice · order · table (thuần JS) và js (Worker; hàm người học viết, mongDoi do MÃ tính từ _sim.mjs).
 * Chữ: mọi trường nhận `[en, vi]` hoặc `{ en, vi }`; riêng câu trong choice/order/table là HTML song ngữ (hai()).
 */
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
export { doiDau };
export * as S from './_sim.mjs';

export const KHOA = 'operating-systems';

/** [en, vi] ⇒ { en, vi } */
export const bi = (en, vi) => ({ en, vi });
/** Câu song ngữ cho choice/order/table (EN chính, VI nghiêng ngay dưới). */
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
/** Giải thích song ngữ. */
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
/** Lựa chọn nhanh: ['a', 'nội dung'] … ⇒ [{ma, noiDung}] */
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));
const chu = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
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
    // Xoay lựa chọn theo cách xác định để đáp án đúng không luôn là “a”; gán lại mã a,b,c,d theo vị trí mới.
    const chuCai = ['a', 'b', 'c', 'd', 'e', 'f'];
    let seed = q.tieuDe.length;
    q.cauHoi = q.cauHoi.map((c, i) => {
      const n = c.luaChon.length; const k = (seed + i * 3 + 1) % n;
      const moi = xoay(c.luaChon, k).map((o, j) => ({ ma: chuCai[j], noiDung: o.noiDung, cu: o.ma }));
      const anh = Object.fromEntries(moi.map((o) => [o.cu, o.ma]));
      const dap = Array.isArray(c.dapAn[0]) ? [c.dapAn[0].map((m) => anh[m]).sort()] : c.dapAn.map((m) => anh[m]);
      return { ...c, luaChon: moi.map(({ ma, noiDung }) => ({ ma, noiDung })), dapAn: dap };
    });
    const kq = q.cauHoi.map((c) => (Array.isArray(c.dapAn[0]) ? c.dapAn[0] : c.dapAn).join('+')).join(' · ');
    if (typeof q.giaiThich === 'string') q.giaiThich = q.giaiThich.replace(/^<p>[a-d](?:\+[a-d])*(?: · [a-d](?:\+[a-d])*)*\./, `<p>${kq}.`);
  }
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
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. The questions follow the style of the OSG202 final exam, so work them out on paper first, exactly as you would in the exam hall.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Câu hỏi theo phong cách đề FE của môn OSG202, nên hãy giải ra giấy trước như khi ngồi phòng thi.</i></p>`,
  };
  const moTa = q.moTa && typeof q.moTa === 'object' ? { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi } : q.moTa;
  return {
    ngonNgu: 'text',
    the: ['osg202'],
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
    the: ['osg202'],
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
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts), dapAn: Array.isArray(dap) ? (nhieu ? [dap] : dap) : [dap], ...(nhieu ? { nhieu: true } : {}), giaiThich: giai(gt[0], gt[1]) };
}
/** Trộn xác định (không ngẫu nhiên) để mục “order” không nằm sẵn đúng thứ tự: dịch vòng k bước. */
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

/** Câu trắc nghiệm số: đáp án đúng (hiện đầu, tinh() sẽ xoay) + 3 nhiễu. */
export function mcNum(ma, de, dung, nhieu, fmt, gt) {
  const ds = so4(dung, nhieu, fmt);
  return mc(ma, de, ds.map((t, i) => ['abcd'[i], t]), 'a', gt);
}
