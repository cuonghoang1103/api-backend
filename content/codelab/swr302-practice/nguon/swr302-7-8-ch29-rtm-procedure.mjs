/**
 * SWR302 · 7.8 — The traceability matrix and a tracing procedure (Wiegers Ch.29 slides 8–9, 12).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'RTM procedure 1 — the nine-step tracing procedure',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers’ procedure for tracing requirements. Put the steps in order.</p>', vi: '<p>Quy trình truy vết yêu cầu của Wiegers. Sắp các bước đúng thứ tự.</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp các bước', dung: ['Educate the team about tracing', 'Select the link relationships to define', 'Choose the matrix style and storage', 'Identify which parts of the product to trace', 'Identify who supplies each link type', 'Modify development procedures to update links', 'Define labeling conventions', 'Supply trace information as work is completed', 'Audit the trace information periodically'], hien: [6, 2, 8, 0, 4, 7, 1, 3, 5], giai: ['Decide what and how, assign who, then collect and audit.', 'Quyết định cái gì và thế nào, giao ai, rồi thu thập và kiểm.'] }],
  goiY: ['Bắt đầu bằng giáo dục đội.', 'Kết thúc bằng kiểm định kỳ.'],
  loiHayGap: ['Thu thập liên kết trước khi chọn kiểu liên kết.', 'Bỏ bước kiểm định kỳ.'],
  giaiThich: '<p>1 educate · 2 select links · 3 matrix style and storage · 4 what to trace · 5 who supplies · 6 update procedures · 7 labeling · 8 supply as you go · 9 audit.</p>',
  thuatNgu: tn('rtm'),
  khaiNiem: ['tracing procedure'],
});

const E2 = phanLoai({
  tieuDe: 'RTM procedure 2 — link cardinality',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Trace links can be <b>one-to-one</b> (one design element → one code module), <b>one-to-many</b> (one requirement verified by several tests) or <b>many-to-many</b> (use cases ↔ functional requirements, some requirements shared by several use cases).</p>', vi: '<p>Bản số của liên kết truy vết.</p>' },
  cot: 'Cardinality', luaChon: ['One-to-one', 'One-to-many', 'Many-to-many'],
  hang: [
    ['FR-12 is verified by TC-30, TC-31 and TC-32; each of them tests only FR-12.', 'One-to-many'],
    ['Use cases UC-2 and UC-4 both need FR-5, and each use case needs several FRs.', 'Many-to-many'],
    ['Design class InvoicePrinter is implemented by exactly one file invoice-printer.ts and nothing else.', 'One-to-one'],
  ],
  giaiThich: '<p>Many-to-many links are realistic but the hardest to maintain — tools help.</p>',
  goiY: ['Một yêu cầu nhiều test ⇒ một-nhiều.', 'Chia sẻ hai chiều ⇒ nhiều-nhiều.'],
  loiHayGap: ['Gọi FR dùng chung là một-nhiều.', 'Nghĩ mọi liên kết là một-một.'],
  thuatNgu: tn('rtm', 'cardinality'),
  khaiNiem: ['link cardinality'],
});

const LINKS = [['UC-1', 'FR-1'], ['UC-1', 'FR-2'], ['UC-2', 'FR-3'], ['UC-2', 'FR-5'], ['UC-4', 'FR-5'], ['UC-4', 'FR-6'], ['UC-3', 'FR-9']];
const E3 = baiJs({
  tieuDe: 'RTM procedure 3 — a pairwise matrix',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: '<p>Table 29-2 is a two-way matrix of use cases ↔ functional requirements. Write <code>function matrix(ucs, frs, links)</code> returning a 2-D array: one row per use case (in the order of <code>ucs</code>), one column per FR (order of <code>frs</code>), each cell <code>true</code> if the link exists. Then write <code>function shared(links)</code> returning the sorted FRs used by more than one use case, and <code>function emptyRows(ucs, links)</code> returning the use cases with no FR (in the order of <code>ucs</code>).</p>', vi: '<p>Viết <code>matrix</code> (ma trận UC × FR), <code>shared</code> (FR dùng bởi hơn một UC, sắp xếp) và <code>emptyRows</code> (UC không có FR).</p>' },
  yeuCau: [{ en: 'Links are [uc, fr] pairs; ignore duplicates.', vi: 'Liên kết là cặp [uc, fr]; bỏ trùng.' }],
  viDu: [{ input: 'shared(LINKS)', output: '["FR-5"]', explanation: 'FR-5 is reused by UC-2 and UC-4.|||FR-5 được UC-2 và UC-4 dùng chung.' }],
  tep: { 'matrix.js': [`const LINKS = ${JSON.stringify(LINKS)};\nfunction matrix(ucs, frs, links) { return []; }\nfunction shared(links) { return []; }\nfunction emptyRows(ucs, links) { return []; }\n`, `const LINKS = ${JSON.stringify(LINKS)};\nfunction matrix(ucs, frs, links) {\n  return ucs.map(function (u) { return frs.map(function (f) { return links.some(function (l) { return l[0] === u && l[1] === f; }); }); });\n}\nfunction shared(links) {\n  var by = {};\n  links.forEach(function (l) { by['#' + l[1]] = by['#' + l[1]] || {}; by['#' + l[1]][l[0]] = true; });\n  return Object.keys(by).filter(function (k) { return Object.keys(by[k]).length > 1; }).map(function (k) { return k.slice(1); }).sort();\n}\nfunction emptyRows(ucs, links) {\n  return ucs.filter(function (u) { return !links.some(function (l) { return l[0] === u; }); });\n}\n`] },
  kiem: [
    kiemTuy({ en: 'matrix for UC-1, UC-2 × FR-1, FR-3, FR-5', vi: 'ma trận UC-1, UC-2 × FR-1, FR-3, FR-5' }, function () {
      if (typeof matrix !== 'function') return 'matrix is not a function';
      var r = matrix(['UC-1', 'UC-2'], ['FR-1', 'FR-3', 'FR-5'], LINKS);
      return JSON.stringify(r) === '[[true,false,false],[false,true,true]]' ? 'OK' : 'got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'shared FRs', vi: 'FR dùng chung' }, function () {
      if (typeof shared !== 'function') return 'shared is not a function';
      var r = shared(LINKS);
      return JSON.stringify(r) === '["FR-5"]' ? 'OK' : 'expected ["FR-5"], got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'use cases without FRs', vi: 'use case không có FR' }, function () {
      if (typeof emptyRows !== 'function') return 'emptyRows is not a function';
      var r = emptyRows(['UC-1', 'UC-2', 'UC-5', 'UC-3'], LINKS);
      return JSON.stringify(r) === '["UC-5"]' ? 'OK' : 'expected ["UC-5"], got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'hidden: duplicate links are not "sharing"', vi: 'ẩn: liên kết trùng không phải "dùng chung"' }, function () {
      if (typeof shared !== 'function') return 'shared is not a function';
      var r = shared([['A', 'F1'], ['A', 'F1'], ['B', 'F2'], ['C', 'F2'], ['C', 'F10']]);
      return JSON.stringify(r) === '["F2"]' ? 'OK' : 'expected ["F2"], got ' + JSON.stringify(r);
    }, { an: true }),
  ],
  goiY: ['Đếm số UC KHÁC NHAU cho mỗi FR.', 'Ma trận: map hàng theo ucs, cột theo frs.'],
  loiHayGap: ['Đếm liên kết trùng hai lần.', 'Đảo hàng/cột.'],
  giaiThich: '<p>A pairwise matrix makes reuse (shared FR-5) and gaps (a use case with no functional requirement) visible at a glance.</p>',
  thuatNgu: tn('rtm'),
  khaiNiem: ['traceability matrix'],
  boYeu: [{ ten: 'đếm liên kết thay vì UC', tep: { 'matrix.js': `const LINKS = ${JSON.stringify(LINKS)};\nfunction matrix(u,f,l){ return u.map(function(a){ return f.map(function(b){ return l.some(function(x){return x[0]===a&&x[1]===b;}); }); }); }\nfunction shared(l){ var c={}; l.forEach(function(x){ c[x[1]]=(c[x[1]]||0)+1; }); return Object.keys(c).filter(function(k){return c[k]>1;}).sort(); }\nfunction emptyRows(u,l){ return u.filter(function(a){ return !l.some(function(x){return x[0]===a;}); }); }\n` } }],
});

const E4 = tracNghiem({
  tieuDe: 'RTM procedure 4 — storage and auditing',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Store trace data in a text table, a spreadsheet or — much better — a requirements management tool. Start tracing with critical core functions, high-risk portions or high-maintenance areas. Audit periodically: if a requirement is "implemented and verified" yet its trace data is incomplete, the process is not working.</p>', vi: '<p>Lưu dữ liệu truy vết; bắt đầu từ phần quan trọng; kiểm định kỳ.</p>' },
  cau: [
    { en: 'Where should a team start tracing on a large legacy replacement?', vi: 'Dự án thay thế hệ thống cũ lớn nên bắt đầu truy vết ở đâu?', lc: [['a', 'Critical core functions, high-risk and high-maintenance parts'], ['b', 'Everything at once'], ['c', 'The login page only'], ['d', 'Nowhere']], dap: 'a', giai: ['Start where tracing pays most.', 'Bắt đầu nơi truy vết có lợi nhất.'] },
    { en: 'An audit finds FR-20 marked "verified" but with no link to any test. This shows…', vi: 'Kiểm tra thấy FR-20 "verified" mà không có liên kết test nào. Điều này cho thấy…', lc: [['a', 'the tracing process is not working and must be fixed'], ['b', 'everything is fine'], ['c', 'FR-20 should be deleted'], ['d', 'the tester is always wrong']], dap: 'a', giai: ['Audit signal.', 'Tín hiệu từ kiểm tra.'] },
  ],
  goiY: ['Phần cốt lõi, rủi ro cao trước.', '"Verified" mà không có liên kết test ⇒ quy trình hỏng.'],
  loiHayGap: ['Truy vết mọi thứ ngay từ đầu.', 'Bỏ qua kiểm định kỳ.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('rtm'),
  khaiNiem: ['tracing procedure'],
});

export default moDun({
  slug: 'swr302-7-8-ch29-rtm-procedure',
  ten: '7.8 The traceability matrix and tracing procedure',
  moTaModule: 'Chín bước của quy trình truy vết, bản số liên kết, tự viết ma trận UC × FR (FR dùng chung, UC không có FR) có chấm, lưu trữ và kiểm định kỳ.',
  de: [E1, E2, E3, E4],
});
