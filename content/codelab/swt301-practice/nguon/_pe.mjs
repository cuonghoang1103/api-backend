/**
 * Khung chung cho đề PE luyện SWT301 (định dạng SU26): Q1 review (+ sửa mã chạy thật) · Q2 bộ UTCID tối thiểu
 * (statement + decision + MC/DC) · Q3 test case hộp đen (hợp lệ · bảng quyết định · biên).
 * Một đề = một object `pe` (xem deThiPE) ⇒ trả về module hoàn chỉnh cho bộ xuất.
 */
import { doiDau, KHOA, kiemPhu, kiemReview, kiemTestCase, preSo, LOAI_LOI, LOAI_LOI_HTML, NOP_BAI, tn } from './_chung.mjs';

/** object phẳng ⇒ `{ k: 'v', n: 1 }` (chuỗi nháy đơn). */
export const objJs = (o) => `{ ${Object.entries(o).map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'` : JSON.stringify(v)}`).join(', ')} }`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** In một test case Q3 thành object JS (cho tệp lời giải / khởi đầu). */
export function inTestCase(t, { precondition, buoc }) {
  const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const data = `{ ${Object.entries(t.data).map(([k, v]) => `${k}: ${v === null ? 'null' : q(v)}`).join(', ')} }`;
  return `  {
    id: ${q(t.id)}, description: ${q(t.description)},
    precondition: ${q(precondition)},
    steps: [${buoc(t.data).map(q).join(', ')}],
    data: ${data},
    expected: ${q(t.expected)},
  },`;
}

/** Một UTCID thành object JS. */
export function inUtcid(u) {
  const v = (x) => (typeof x === 'string' ? `'${x}'` : x === null ? 'null' : String(x));
  return `  { id: '${u.id}', input: { ${Object.entries(u.input).map(([k, x]) => `${k}: ${v(x)}`).join(', ')} }, expected: ${v(u.expected)}, type: '${u.type}', status: '${u.status}' },`;
}

/**
 * pe = {
 *   so, slug, ten, tieuDe, phu:{en,vi}, baiHoc?,
 *   q1: { tenLop, java, moTa:{en,vi}, khoa, sai, mauIssue, giaiIssues (chuỗi JS), fixDau, fixGiai, hamFix, viDuFix:{en,vi}, kiemFix:[…], yeuCauFix:{en,vi} },
 *   q2: { ham, java, moTa:{en,vi}, cfg (svg), code (gắn đo), thamSo, spec (fn), loai (fn), mcdc:[…], toiThieu, yeuCau:[…], kieuInput (chuỗi ví dụ), giaiUtcid (chuỗi JS), mauUtcid (object) },
 *   q3: { ten, moTa:{en,vi}, wireframe, heThong (fn), nhan (fn), truongData, precondition, buoc(fn), ds:[TC], khoiA/B/C:{ten:{en,vi}, yeuCau:[…], can:[…]}, dataMoTa:{en,vi}, viDuKyVong },
 *   truDiem:[…], goiY:[…], loiHayGap:[…], giaiThich:{en,vi}, khaiNiem?:[…]
 * }
 */
export function deThiPE(pe) {
  const { q1, q2, q3 } = pe;
  const BAN_IN = {
    tieuDe: `SWT301 — PE Practice ${pe.so} (SU26 format)`,
    phu: pe.phu,
    moTa: {
      en: `<p>This paper follows the <b>SU26 practical-exam format</b> of SWT301 (template <code>SWT301_SU26_Template.xlsx</code>: sheet <b>Q1</b> issue list · sheet <b>Q2</b> UTCID grid · sheet <b>Q3</b> test cases). It is a NEW paper written in the style of the real ones — and it goes further: your corrected code is executed, your coverage is measured on instrumented code, and every test case you write is run against a reference implementation of the specification.</p>
<p><b>Rules of the real paper (keep them while practising):</b> 85 minutes; no IDE; answers in English; every answer must reflect THIS paper — irrelevant keywords give zero for that question; expected results always come from the <b>specification</b>, never from the code.</p>
<p><b>How answers are recorded here:</b> each sheet of the template becomes one JavaScript file that declares an array — one object per row/column of the template (see “Data model”). Edit only the files in <code>answers/</code>.</p>`,
      vi: `<p>Đề theo đúng <b>định dạng PE SU26</b> của SWT301 (template <code>SWT301_SU26_Template.xlsx</code>: sheet <b>Q1</b> danh sách lỗi · sheet <b>Q2</b> lưới UTCID · sheet <b>Q3</b> test case). Đây là đề MỚI viết theo dạng đề thật — và sâu hơn: mã bạn sửa được chạy thật, độ phủ đo trên mã đã gắn đo, mỗi test case bạn viết được chạy qua bản cài đặt tham chiếu của đặc tả.</p>
<p><b>Luật của đề thật (giữ khi luyện):</b> 85 phút; không IDE; trả lời bằng tiếng Anh; câu trả lời phải bám đúng đề — có từ khoá không liên quan thì câu đó 0 điểm; kết quả mong đợi luôn lấy từ <b>đặc tả</b>, không lấy từ mã.</p>
<p><b>Cách ghi câu trả lời:</b> mỗi sheet của template thành một tệp JavaScript khai một mảng — mỗi dòng/cột của template là một object (xem “Mô hình dữ liệu”). Chỉ sửa các tệp trong <code>answers/</code>.</p>`,
    },
    chucNangChinh: [
      { en: `<b>Question 1 (3 marks)</b> — review <code>${q1.tenLop}</code>: at least 8 issues with line, type and fix; then correct the method.`, vi: `<b>Câu 1 (3 điểm)</b> — review <code>${q1.tenLop}</code>: ít nhất 8 lỗi kèm dòng, loại, cách sửa; rồi sửa phương thức.` },
      { en: `<b>Question 2 (3 marks)</b> — the MINIMUM unit test cases for 100% statement coverage, 100% decision coverage and MC/DC of the compound conditions of <code>${q2.ham}</code>.`, vi: `<b>Câu 2 (3 điểm)</b> — số unit test TỐI THIỂU cho 100% statement, 100% decision và MC/DC các điều kiện ghép của <code>${q2.ham}</code>.` },
      { en: `<b>Question 3 (4 marks)</b> — black-box test cases for the <i>${q3.ten}</i> function: validation · business rules (decision table) · boundary values.`, vi: `<b>Câu 3 (4 điểm)</b> — test case hộp đen cho chức năng <i>${q3.ten}</i>: kiểm hợp lệ · luật nghiệp vụ (bảng quyết định) · giá trị biên.` },
    ],
    yeuCauChung: [
      { en: 'Expected results come from the SPECIFICATION. When the code disagrees, the test case FAILS — that is your finding.', vi: 'Kết quả mong đợi lấy từ ĐẶC TẢ. Mã trả khác ⇒ test case FAIL — đó là phát hiện của bạn.' },
      { en: 'Use concrete values. Strings exactly as the specification prints them.', vi: 'Dùng giá trị cụ thể. Chuỗi đúng nguyên văn đặc tả.' },
      { en: 'Question 2 is graded like the template rule: marks ÷ minimum number of tests — an extra test case costs marks.', vi: 'Câu 2 chấm theo luật template: điểm ÷ số ca tối thiểu — thừa một ca là mất điểm.' },
    ],
    cayThuMuc: `answers/
├── q1-issues.js      ← Question 1  : const ISSUES = [...]       (sheet Q1)
├── q1-fixed.js       ← Question 1  : function ${q1.hamFix}(...)   (corrected — JavaScript twin)
├── q2-utcid.js       ← Question 2  : const UTCIDS = [...]       (sheet Q2 — one object per UTCID column)
└── q3-testcases.js   ← Question 3  : const TEST_CASES = [...]   (sheet Q3 — one object per row)`,
    wireframe: q3.wireframe,
    moHinh: {
      ten: 'Answer records — ISSUES[i] · UTCIDS[i] · TEST_CASES[i]',
      truong: [
        ['ISSUES[i].line', 'number | "2-4"', { en: 'line number(s) in the listing of Question 1', vi: 'số dòng trong đoạn mã câu 1' }],
        ['ISSUES[i].type', 'string', { en: `one of ${LOAI_LOI.join(', ')}`, vi: `một trong ${LOAI_LOI.join(', ')}` }],
        ['ISSUES[i].severity · description · fix', 'string', { en: 'High/Medium/Low · what is wrong and why · the concrete change', vi: 'High/Medium/Low · sai gì, vì sao · sửa cụ thể thế nào' }],
        ['UTCIDS[i].id · input', 'string · object', { en: `UTCID01… · ${q2.kieuInput} — concrete values`, vi: `UTCID01… · ${q2.kieuInput} — giá trị cụ thể` }],
        ['UTCIDS[i].expected', typeof q2.mauUtcid.expected === 'number' ? 'number' : 'string', { en: 'the return value required by the SPECIFICATION', vi: 'giá trị trả về theo ĐẶC TẢ' }],
        ['UTCIDS[i].type · status', '"N"|"A"|"B" · "P"|"F"', { en: 'Normal / Abnormal / Boundary · Passed / Failed when run against the code', vi: 'Normal / Abnormal / Boundary · Passed / Failed khi chạy trên mã' }],
        ['TEST_CASES[i].id · description · precondition', 'string', { en: 'e.g. "A01" · "Verify that…" · state before the test', vi: 'vd "A01" · "Verify that…" · trạng thái trước khi chạy' }],
        ['TEST_CASES[i].steps', 'string[]', { en: 'numbered procedure', vi: 'các bước' }],
        ['TEST_CASES[i].data', 'object', q3.dataMoTa],
        ['TEST_CASES[i].expected', 'string', { en: `the exact message, e.g. "${q3.viDuKyVong}"`, vi: `đúng nguyên văn, vd "${q3.viDuKyVong}"` }],
      ],
    },
    duLieuMau: `// answers/q1-issues.js
${objJs(q1.mauIssue)}
// answers/q2-utcid.js
${inUtcid(q2.mauUtcid).trim().replace(/,$/, '')}
// answers/q3-testcases.js
${inTestCase(q3.ds[0], q3).trim().replace(/,$/, '')}`,
    chucNang: [
      {
        ten: { en: 'Q1.1 — Issue list (code review)', vi: 'Q1.1 — Danh sách lỗi (review mã)' }, diem: 2,
        moTa: { en: `${q1.moTa.en}\n${preSo(q1.java)}\n<p>Issue types: ${LOAI_LOI_HTML.en}</p>`, vi: `${q1.moTa.vi}\n${preSo(q1.java)}\n<p>Loại lỗi: ${LOAI_LOI_HTML.vi}</p>` },
        yeuCau: [
          { en: 'Find <b>at least 8</b> distinct issues. One object = one issue; it counts when its line AND type match a real defect.', vi: 'Tìm <b>ít nhất 8</b> lỗi khác nhau. Mỗi object = một lỗi; được tính khi đúng dòng VÀ đúng loại.' },
          { en: 'Every issue has a concrete fix. Do not report legal code as a compile error.', vi: 'Mỗi lỗi có cách sửa cụ thể. Không báo mã hợp lệ là lỗi biên dịch.' },
        ],
        hook: ['checklist-based review', 'desk checking'],
      },
      {
        ten: { en: 'Q1.2 — Corrected method (runs for real)', vi: 'Q1.2 — Phương thức đã sửa (chạy thật)' }, diem: 1,
        yeuCau: q1.yeuCauFix,
        hook: ['debugging', 'confirmation testing'],
        viDu: q1.viDuFix,
      },
      {
        ten: { en: 'Q2.1 — Coverage with the minimum test set', vi: 'Q2.1 — Đạt độ phủ với bộ test tối thiểu' }, diem: 1.5,
        moTa: { en: `${q2.moTa.en}\n${preSo(q2.java)}${q2.cfg || ''}`, vi: `${q2.moTa.vi}\n${preSo(q2.java)}${q2.cfg || ''}` },
        yeuCau: q2.yeuCau,
        hook: ['statement coverage', 'decision coverage', 'MC/DC'],
      },
      {
        ten: { en: 'Q2.2 — UTCID grid: expected, type, result', vi: 'Q2.2 — Lưới UTCID: mong đợi, loại, kết quả' }, diem: 1.5,
        yeuCau: q2.yeuCau2,
        hook: ['UTCID template', 'N/A/B'],
      },
      {
        ten: { en: 'Q3.A — Validation test cases', vi: 'Q3.A — Test case kiểm hợp lệ' }, diem: 1,
        moTa: q3.moTa,
        yeuCau: q3.khoiA.yeuCau,
        hook: ['equivalence partitioning', 'test case template'],
      },
      {
        ten: { en: 'Q3.B — Business rules (reduced decision table)', vi: 'Q3.B — Luật nghiệp vụ (bảng quyết định rút gọn)' }, diem: 2,
        yeuCau: q3.khoiB.yeuCau,
        hook: ['decision table testing'],
      },
      {
        ten: { en: 'Q3.C — Boundary values', vi: 'Q3.C — Giá trị biên' }, diem: 1,
        yeuCau: q3.khoiC.yeuCau,
        hook: ['2-value BVA'],
      },
    ],
    idBatBuoc: [
      ['ISSUES', { en: 'answers/q1-issues.js — Question 1 issue list', vi: 'answers/q1-issues.js — danh sách lỗi câu 1' }],
      [`${q1.hamFix}(…)`, { en: 'answers/q1-fixed.js — corrected method', vi: 'answers/q1-fixed.js — phương thức đã sửa' }],
      ['UTCIDS', { en: 'answers/q2-utcid.js — UTCID columns of Question 2', vi: 'answers/q2-utcid.js — các cột UTCID câu 2' }],
      ['TEST_CASES', { en: 'answers/q3-testcases.js — test cases of Question 3', vi: 'answers/q3-testcases.js — test case câu 3' }],
    ],
    truDiem: pe.truDiem,
    nopBai: NOP_BAI,
  };

  const KIEM = [
    ...kiemReview({ bien: 'ISSUES', khoa: q1.khoa, sai: q1.sai, toiThieu: 8, nhom: 'f1', loaiHopLe: LOAI_LOI }),
    ...q1.kiemFix.map((k, i) => ({ ...k, nhom: 'f2', ...(i >= 2 ? { an: true } : {}) })),
    ...kiemPhu({
      code: q2.code, ham: q2.ham, thamSo: q2.thamSo, spec: q2.spec.toString(), bien: 'UTCIDS',
      do: { mcdc: q2.mcdc, toiThieu: q2.toiThieu, loai: q2.loai.toString(), trangThai: true },
      nhom: { lenh: 'f3', nhanh: 'f3', mcdc: 'f3', toiThieu: 'f3', kyVong: 'f4', loai: 'f4', trangThai: 'f4' },
    }),
    ...kiemTestCase({
      bien: 'TEST_CASES', heThong: q3.heThong.toString(), nhan: q3.nhan.toString(), truongData: q3.truongData,
      nhomCauTruc: 'f5', nhomKyVong: 'f5', toiDa: q3.toiDa || 50,
      khoi: [
        { moTa: { en: 'Validation', vi: 'Kiểm hợp lệ' }, nhom: 'f5', tungMuc: true, can: q3.khoiA.can },
        { moTa: { en: 'Decision-table rule', vi: 'Luật bảng quyết định' }, nhom: 'f6', tungMuc: true, can: q3.khoiB.can },
        { moTa: { en: 'Boundary value', vi: 'Giá trị biên' }, nhom: 'f7', tungMuc: true, can: q3.khoiC.can },
      ],
    }).map((k) => (q3.anMa && q3.anMa.some((m) => (k.moTa.en || '').endsWith(m)) ? { ...k, an: true } : k)),
  ];

  const DAU_Q1 = `// Question 1 — sheet Q1 of the template. One object per issue (at least 8).
// type: ${LOAI_LOI.join(' | ')}
const ISSUES = [
  ${objJs(q1.mauIssue)},
];
`;
  const DAU_Q2 = `// Question 2 — sheet Q2 (UTCID grid). One object per UTCID column.
// input: concrete values · expected: from the SPECIFICATION · type: "N" | "A" | "B" · status: "P" | "F" (run against the code)
const UTCIDS = [
${inUtcid(q2.mauUtcid)}
];
`;
  const DAU_Q3 = `// Question 3 — sheet Q3. One object per test case row.
// data: the fields exactly as typed / selected ("" = left empty / not selected)
const TEST_CASES = [
${inTestCase(q3.ds[0], q3)}
];
`;
  const GIAI_Q3 = `// Question 3 — ${q3.ds.length} test cases: A = validation (every message and every reason), B = decision-table rules,
// C = boundary values. ${q3.giaDinh || 'Assumption: validation stops at the first error.'}
const TEST_CASES = [
${q3.ds.map((t) => inTestCase(t, q3)).join('\n')}
];
`;

  return doiDau({
    slug: pe.slug,
    ten: pe.ten,
    khoa: KHOA,
    baiHoc: pe.baiHoc || 'swt301-pe-how-it-works',
    de: [
      {
        dangBai: 'pe',
        tieuDe: pe.tieuDe,
        doKho: 'HARD',
        phut: 85,
        diem: 100,
        ngonNgu: 'javascript',
        khaiNiem: pe.khaiNiem || ['code review', 'statement coverage', 'decision coverage', 'MC/DC', 'UTCID template', 'equivalence partitioning', 'boundary value analysis', 'decision table'],
        tienQuyet: ['SWT301 Chapter 3 (reviews)', 'Chapter 4 (black-box)', 'Chapter 5 (white-box)'],
        the: ['swt301', 'pe', 'su26', 'exam-practice'],
        banIn: BAN_IN,
        thuatNgu: tn('expected', 'spec', 'statement', 'decision', 'mcdc', 'utcid', 'nab', 'ep', 'bva', 'decisionTable', 'offByOne', 'shortCircuit', 'precondition'),
        goiY: pe.goiY,
        loiHayGap: pe.loiHayGap,
        moTaNgan: pe.moTaNgan,
        giaiThich: pe.giaiThich,
        loaiKiem: 'js',
        tests: {
          loai: 'js',
          phienBan: 1,
          tepNap: ['answers/q1-issues.js', 'answers/q1-fixed.js', 'answers/q2-utcid.js', 'answers/q3-testcases.js'],
          kiem: KIEM,
        },
        khoiDau: { 'answers/q1-issues.js': DAU_Q1, 'answers/q1-fixed.js': q1.fixDau, 'answers/q2-utcid.js': DAU_Q2, 'answers/q3-testcases.js': DAU_Q3 },
        loiGiai: { 'answers/q1-issues.js': q1.giaiIssues, 'answers/q1-fixed.js': q1.fixGiai, 'answers/q2-utcid.js': q2.giaiUtcid, 'answers/q3-testcases.js': GIAI_Q3 },
        thamKhao: 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/',
        ...(pe.boYeu ? {
          boYeu: pe.boYeu.map((b) => (b.q3 ? {
            ...b,
            tep: { ...(b.tep || {}), 'answers/q3-testcases.js': `const TEST_CASES = [\n${b.q3(q3.ds.map((t) => ({ ...t, data: { ...t.data } }))).map((t) => inTestCase(t, q3)).join('\n')}\n];\n` },
          } : b)),
        } : {}),
      },
    ],
  });
}

/** Định dạng số tiền có dấu phẩy hàng nghìn (dùng trong ví dụ tĩnh của đề). */
export const tien = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export { esc };
