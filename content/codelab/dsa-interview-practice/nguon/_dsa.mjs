/**
 * Coding Interview Prep (dsa-interview) — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua). 15/11/2026.
 * Dựa trên ../../api-design-practice/nguon/_api.mjs › jsBai, thêm KIỂM HIỆU NĂNG + LỜI GIẢI SAI MẪU.
 *
 *  - Mọi đề là máy chấm `js`: người học viết MỘT hàm trong `solution.js`; mỗi kiểm gọi hàm trong Worker mới, so sâu.
 *  - Lời giải là HÀM THẬT viết trong tệp module (`nguon(fn, …)` lấy mã nguồn kèm chú thích) ⇒ `mongDoi` của mọi kiểm
 *    tính bằng cách CHẠY lời giải trong node:vm (realm mới như Worker) — lời giải và đáp án không thể lệch nhau.
 *  - Kiểm hiệu năng (`perf`): đầu vào lớn SINH NGAY TRONG lời gọi bằng bộ sinh số giả ngẫu nhiên Park–Miller có hạt
 *    giống cố định (tất định trên mọi máy). Máy chấm trình duyệt KHÔNG có trần thời gian theo từng kiểm (`choToiDa` chỉ
 *    là của loại `dom`; `performance.now()` trong Worker là đồng hồ GIẢ của harness) — trần duy nhất là 4 s giờ THẬT mỗi
 *    kiểm (`TRAN_THAT_MS` trong frontend/src/components/code-lab/cham/chamJs.ts) ⇒ chọn n sao cho lời giải đúng chạy
 *    ≤ ~50 ms còn O(n²) cần ≫ 4 s (≥ 10¹⁰ bước). Bộ dựng tự đo: lời giải phải xong mỗi kiểm hiệu năng < 1 s trong Node.
 *  - `saiMau`: lời giải SAI MẪU (vd O(n²) đúng kết quả) — bộ dựng chạy thử trong vm với trần 3 s: phải trượt ≥ 1 kiểm;
 *    `chiHieuNang: true` ⇒ phải ĐẠT mọi kiểm thường và TRƯỢT mọi kiểm hiệu năng (chứng minh kiểm hiệu năng là thứ bắt nó).
 *    Không ghi vào JSON; `_kiem-sai-mau.mjs` chấm lại chúng bằng máy chấm trình duyệt thật (Chromium).
 */
import vm from 'node:vm';
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
export { doiDau };

export const KHOA = 'dsa-interview';
const THE = ['dsa-interview', 'coding-interview'];

/** [en, vi] ⇒ { en, vi } */
export const bi = (en, vi) => ({ en, vi });
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Mã nội dòng (escape HTML). */
export const c = (s) => `<code>${esc(s)}</code>`;
/** Khối mã/ output (escape HTML). */
export const pre = (s) => `<pre>${esc(Array.isArray(s) ? s.join('\n') : s)}</pre>`;
/** Thuật ngữ: { en, vi, giaiThich } */
export const tn = (en, vi, giaiThich) => ({ en, vi, ...(giaiThich ? { giaiThich } : {}) });

/** Nối mã nguồn các hàm tham chiếu (giữ chú thích) thành tệp lời giải. */
export const nguon = (...fns) => fns.map((f) => (typeof f === 'string' ? f.trim() : f.toString())).join('\n\n') + '\n';
/** goi('twoSum', a, b) ⇒ 'twoSum(<json a>, <json b>)' */
export const goi = (fn, ...args) => `${fn}(${args.map((a) => JSON.stringify(a)).join(', ')})`;

/** Bộ sinh số tất định (Park–Miller, mọi tích < 2^53 ⇒ đúng tuyệt đối): R(m) ∈ [0, m). Chèn vào đầu thân kiểm hiệu năng. */
const RNG = (seed) => `var __s = ${seed}; function R(m) { __s = (__s * 48271) % 2147483647; return __s % m; }`;

/**
 * Cây nhị phân / danh sách liên kết trong lời gọi kiểm (người học nhận NÚT thật, như LeetCode):
 *   __cay([3, 9, 20, null, null, 15, 7]) ⇒ { val, left, right } (mảng theo tầng, null = trống) · __raCay(root) ⇒ mảng theo tầng (bỏ null cuối)
 *   __ds([1, 2, 3]) ⇒ { val, next } · __raDs(head) ⇒ mảng (dừng ở 10⁶ nút — chống vòng)
 * boc('maxDepth(__cay([3,9,20]))') ⇒ IIFE có sẵn các hàm trên. Thân kiểm hiệu năng luôn có sẵn chúng + R(m).
 */
export const TAO = [
  'function __cay(a) { if (!a.length || a[0] == null) return null; var root = { val: a[0], left: null, right: null }, q = [root], h = 0, i = 1;',
  '  while (i < a.length) { var n = q[h++]; if (a[i] != null) { n.left = { val: a[i], left: null, right: null }; q.push(n.left); } i++;',
  '    if (i < a.length && a[i] != null) { n.right = { val: a[i], left: null, right: null }; q.push(n.right); } i++; } return root; }',
  'function __raCay(r) { var out = [], q = [r], h = 0; while (h < q.length) { var n = q[h++]; if (n == null) { out.push(null); continue; } out.push(n.val); q.push(n.left == null ? null : n.left, n.right == null ? null : n.right); }',
  '  while (out.length && out[out.length - 1] === null) out.pop(); return out; }',
  'function __ds(a) { var head = null; for (var i = a.length - 1; i >= 0; i--) head = { val: a[i], next: head }; return head; }',
  'function __raDs(h) { var out = []; while (h && out.length < 1000000) { out.push(h.val); h = h.next; } return out; }',
].join('\n');
export const boc = (bieuThuc) => `(function () {\n${TAO}\nreturn (${bieuThuc});\n})()`;

/** Sổ lời giải sai mẫu của mọi đề đã dựng (đọc bởi _kiem-sai-mau.mjs). */
export const SO_SAI_MAU = [];

// lời giải đúng: mỗi kiểm hiệu năng phải xong dưới mức này trong Node (máy rảnh thường 20–300 ms; trình duyệt cắt ở 4 s).
// Máy đang bận (nhiều phiên chạy song song) ⇒ DSA_TRAN_GIAI_MS=2000 khi xuất.
const TRAN_GIAI_MS = Number(process.env.DSA_TRAN_GIAI_MS) || 1000;
const TRAN_SAI_MS = 3000; // lời giải sai mẫu: quá mức này ⇒ coi như trượt (trình duyệt cắt ở 4 s)

/** Chạy `ma` + một biểu thức trong realm mới ⇒ { v } | { loi } (+ ms). */
function chay(ma, bieuThuc, timeout = 4000) {
  const ctx = vm.createContext({ console: { log() {}, info() {}, warn() {}, error() {}, debug() {} } });
  const t0 = performance.now();
  try {
    vm.runInContext(ma, ctx, { timeout });
    const v = vm.runInContext(`JSON.stringify((${bieuThuc}))`, ctx, { timeout });
    return { v: v === undefined ? { $js: 'undefined' } : JSON.parse(v), ms: performance.now() - t0 };
  } catch (e) {
    const quaGio = /Script execution timed out/.test(String(e && e.message));
    return { loi: quaGio ? 'QuaGio' : (e && e.name ? e.name : 'Error'), thongDiep: String(e && e.message), ms: performance.now() - t0 };
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
 * Một đề viết hàm. spec = {
 *   ten: tiêu đề EN, kho: EASY|MEDIUM|HARD, phut, diem?,
 *   en, vi: mô tả HTML (đề tự soạn, bối cảnh đời thật), yc?: [[en,vi]…], dauVao: [en,vi], dauRa: [en,vi], rangBuoc: [[en,vi]…],
 *   goiY: [[en,vi]…] ≥ 2 (bậc sau gần lời giải hơn), loi: [[en,vi]…] ≥ 2 lỗi THẬT, gt: [en, vi] (HTML: VÌ SAO đúng + độ phức tạp),
 *   kn: [khái niệm], tns: [tn()…], tq?: [tiên quyết],
 *   dau: mã khởi đầu (chuỗi), giai: mã lời giải (chuỗi — dùng nguon()),
 *   cases: [{ goi | args: [...], an?, moTa?: [en,vi], hien?: 'chữ hiện thay cho goi (ca dùng boc())' }]  — ham: tên hàm (bắt buộc khi dùng args),
 *   perf: [{ than: 'thân hàm: sinh đầu vào bằng R(m), gọi hàm, RETURN một tóm tắt nhỏ', moTa: [en,vi], an?, seed? }],
 *   saiMau: [{ ten: [en,vi], ma: 'mã sai', chiHieuNang?: true }],
 *   viDu?: [{ input, output, explanation }] (mặc định: ca hiện đầu tiên), vdGt?: [en, vi]
 * }
 */
export function bai(s) {
  const { ten, kho, phut, diem, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], tq = [], dau, giai: giaiMa, ham, viDu, vdGt } = s;
  const cases = (s.cases || []).map((x) => ({ ...x, goi: x.goi ?? goi(ham, ...x.args) }));
  const perf = (s.perf || []).map((p, j) => ({
    ...p, laPerf: true,
    goi: `(function () {\n${TAO}\n${RNG(p.seed ?? 20261115 + j)}\n${p.than}\n})()`,
  }));
  const tat = [...cases, ...perf];
  const hien = (x) => x.hien ?? x.goi; // chữ hiện cho người học (ca dùng boc()/__cay nên khai `hien`)
  if (!cases.some((x) => x.an)) throw new Error(`${ten}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${ten}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  if (!tns.length) throw new Error(`${ten}: thiếu thuật ngữ`);
  let truotKhoiDau = 0;
  const kiem = tat.map((x, i) => {
    const r = chay(giaiMa, x.goi);
    if (r.loi) throw new Error(`${ten}: lời giải ném ${r.loi} ở kiểm ${i + 1}: ${r.thongDiep}`);
    if (x.laPerf && r.ms > TRAN_GIAI_MS) throw new Error(`${ten}: lời giải chậm ở kiểm hiệu năng ${i + 1}: ${r.ms.toFixed(0)} ms (trần ${TRAN_GIAI_MS})`);
    if (x.laPerf && JSON.stringify(r.v).length > 400) throw new Error(`${ten}: kiểm hiệu năng ${i + 1} phải trả TÓM TẮT nhỏ, không trả cả mảng lớn`);
    const k = chay(dau, x.goi, TRAN_SAI_MS);
    if (!(!k.loi && bang(k.v, r.v))) truotKhoiDau++;
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1])
      : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`)
        : bi(`Case ${i + 1}: ${hien(x).length > 90 ? `${hien(x).slice(0, 87)}...` : hien(x)}`, `Ca ${i + 1}`));
    return { moTa: nhan, goi: x.goi, mongDoi: r.v, ...(x.an ? { an: true } : {}), __perf: !!x.laPerf, __ms: r.ms, __hien: hien(x) };
  });
  if (!truotKhoiDau) throw new Error(`${ten}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  // lời giải sai mẫu: phải trượt; chiHieuNang ⇒ đạt mọi kiểm thường, trượt mọi kiểm hiệu năng.
  // Chạy với `--chi <module>` (bộ xuất / _kiem-sai-mau) ⇒ chỉ thử sai mẫu của module đó (bộ xuất nạp MỌI module;
  // mỗi sai mẫu O(n²) tốn tới 3 s chờ hết giờ).
  const tomTatSai = [];
  const chi = process.argv.includes('--chi') ? process.argv[process.argv.indexOf('--chi') + 1] : null;
  const tepGoi = (/\/nguon\/(dsa-[^/]+?)\.mjs/.exec(new Error().stack || '') || [])[1];
  const thuSai = !process.env.DSA_BO_SAI && (!chi || !tepGoi || tepGoi === chi); // DSA_BO_SAI=1: _dung-track.mjs không cần thử sai mẫu
  for (const sm of thuSai ? s.saiMau || [] : []) {
    const kq = kiem.map((k) => {
      const r = chay(sm.ma, k.goi, TRAN_SAI_MS);
      return { perf: k.__perf, dat: !r.loi && bang(r.v, k.mongDoi), loi: r.loi, ms: r.ms };
    });
    const truot = kq.filter((x) => !x.dat);
    if (!truot.length) throw new Error(`${ten}: sai mẫu "${sm.ten[0]}" ĐẠT mọi kiểm — bộ kiểm không bắt được nó`);
    if (sm.chiHieuNang) {
      const thuongTruot = kq.filter((x) => !x.perf && !x.dat);
      const perfDat = kq.filter((x) => x.perf && x.dat);
      if (thuongTruot.length) throw new Error(`${ten}: sai mẫu "${sm.ten[0]}" (chỉ chậm) lại trượt ${thuongTruot.length} kiểm thường — phải đúng kết quả`);
      if (perfDat.length) throw new Error(`${ten}: sai mẫu "${sm.ten[0]}" lọt kiểm hiệu năng (${perfDat.map((x) => x.ms.toFixed(0)).join(', ')} ms) — tăng n`);
    }
    tomTatSai.push(`${sm.ten[0]}: trượt ${truot.length}/${kq.length}${sm.chiHieuNang ? ' (chỉ hiệu năng)' : ''}`);
    SO_SAI_MAU.push({ tieuDe: ten, ma: sm.ma, ten: sm.ten, chiHieuNang: !!sm.chiHieuNang, perfIdx: kiem.map((k, i) => (k.__perf ? i : -1)).filter((i) => i >= 0) });
  }
  const msPerf = kiem.filter((k) => k.__perf).map((k) => k.__ms.toFixed(0));
  if (process.env.DSA_IN) console.log(`    · ${ten}: ${kiem.length} kiểm (${kiem.filter((k) => k.an).length} ẩn, ${msPerf.length} hiệu năng ${msPerf.join('/')} ms)${tomTatSai.length ? ` · sai mẫu — ${tomTatSai.join('; ')}` : ''}`);
  const kiemSach = kiem.map(({ __perf, __ms, __hien, ...k }) => k);
  const dau0 = kiem.find((k) => !k.an);
  const viDuMd = viDu || [{
    input: dau0.__hien,
    output: JSON.stringify(dau0.mongDoi),
    explanation: vdGt ? `${vdGt[0]}|||${vdGt[1]}` : 'The first sample case (Run executes every visible case; hidden cases only run on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy mọi ca hiện; ca ẩn chỉ chạy khi Nộp).',
  }];
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
  const YC_MD = [
    ['Write the function in <code>solution.js</code> and <b>return</b> the answer — do not print it.', 'Viết hàm trong <code>solution.js</code> và <b>trả về</b> kết quả — đừng in ra.'],
    ['Do not modify the input arrays/objects.', 'Không sửa mảng/object đầu vào.'],
    ...(perf.length ? [['Mind the constraints: one check runs on a large input and every check has a 4-second limit, so an O(n²) loop fails it.', 'Để ý ràng buộc: một kiểm chạy trên đầu vào lớn và mỗi kiểm có trần 4 giây, nên vòng lặp O(n²) sẽ trượt kiểm đó.']] : []),
  ];
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en, vi),
    yeuCau: (yc || YC_MD).map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDuMd,
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, tienQuyet: tq, thuatNgu: tns,
    tests: { loai: 'js', phienBan: 1, tepChinh: 'solution.js', tepNap: ['solution.js'], kiem: kiemSach },
    khoiDau: { 'solution.js': dau },
    loiGiai: { 'solution.js': giaiMa },
  };
}

/** Module = một bài học của khoá (slug module = slug bài ⇒ thẻ "🏋️ Luyện tập" tự hiện dưới bài). */
export function mod(slug, ten, de) {
  return doiDau({ slug, ten, khoa: KHOA, baiHoc: slug, de });
}
