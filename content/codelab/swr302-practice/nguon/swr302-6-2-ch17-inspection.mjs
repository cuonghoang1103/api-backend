/**
 * SWR302 · 6.2 — The inspection process (Wiegers Ch.17: roles, stages, entry/exit criteria, checklists).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, baiJs, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'Inspection 1 — the stages',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Wiegers Figure 17-3: the inspection stages. Put them in order.</p>', vi: '<p>Hình 17-3 của Wiegers: các bước inspection. Sắp đúng thứ tự.</p>' },
  cau: [{ en: 'Order the stages', vi: 'Sắp các bước', dung: ['Planning', 'Preparation', 'Inspection meeting', 'Rework', 'Follow-up'], hien: [3, 1, 4, 0, 2], giai: ['Plan → each inspector prepares alone → meeting logs issues → author reworks → moderator follows up.', 'Lập kế hoạch → tự chuẩn bị → họp ghi lỗi → tác giả sửa → moderator theo dõi.'] }],
  goiY: ['Inspector tìm lỗi TRƯỚC buổi họp (preparation).', 'Sửa lỗi (rework) diễn ra sau buổi họp.'],
  loiHayGap: ['Đặt Rework trước buổi họp.', 'Bỏ qua Follow-up.'],
  giaiThich: '<p>Planning → Preparation → Inspection meeting → Rework → Follow-up.</p>',
  thuatNgu: tn('inspection'),
  khaiNiem: ['inspection stages'],
});

const E2 = phanLoai({
  tieuDe: 'Inspection 2 — who does it?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Inspection roles: <b>Author</b>, <b>Moderator</b>, <b>Reader</b>, <b>Recorder</b> and <b>Inspector</b>. Choose the role for each task.</p>', vi: '<p>Vai trò trong inspection: Author, Moderator, Reader, Recorder, Inspector. Chọn vai trò cho từng việc.</p>' },
  cot: 'Role', luaChon: ['Author', 'Moderator', 'Reader', 'Recorder', 'Inspector'],
  hang: [
    ['Plans the inspection, chooses the participants and leads the meeting.', 'Moderator'],
    ['Paraphrases each requirement aloud during the meeting.', 'Reader'],
    ['Writes down every issue raised in the meeting.', 'Recorder'],
    ['Wrote the SRS and fixes the defects afterwards.', 'Author'],
    ['Examines the document before the meeting to find defects.', 'Inspector'],
    ['Checks that the rework was done before the document is approved.', 'Moderator'],
  ],
  giaiThich: '<p>Everyone except the author acts as an inspector too; the moderator runs the process, the reader paraphrases, the recorder logs, the author fixes.</p>',
  goiY: ['Moderator vừa chủ trì vừa theo dõi sau họp.', 'Reader diễn giải lại bằng lời của mình.'],
  loiHayGap: ['Để tác giả làm moderator.', 'Nhầm reader với recorder.'],
  thuatNgu: tn('inspection'),
  khaiNiem: ['inspection roles'],
});

const E3 = tracNghiem({
  tieuDe: 'Inspection 3 — entry and exit criteria',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p><b>Entry criteria</b> say when a document is ready to be inspected (e.g. it follows the template, it was spell-checked, the author has fixed obvious problems, line numbers are printed, open issues are marked TBD, reference documents are available). <b>Exit criteria</b> say when the inspection is finished (e.g. all issues are resolved, changes are verified, the document is checked in under configuration control).</p>', vi: '<p><b>Tiêu chí vào</b>: khi nào tài liệu sẵn sàng để inspection. <b>Tiêu chí ra</b>: khi nào inspection kết thúc.</p>' },
  cau: [
    { en: 'The draft is full of spelling errors and half the sections are empty. The moderator should…', vi: 'Bản nháp đầy lỗi chính tả, nửa số mục trống. Moderator nên…', lc: [['a', 'postpone the inspection — entry criteria are not met'], ['b', 'run it anyway'], ['c', 'fix it himself'], ['d', 'cancel the project']], dap: 'a', giai: ['Do not waste inspectors on obvious problems.', 'Đừng phí inspector vào lỗi hiển nhiên.'] },
    { en: 'Which is an exit criterion?', vi: 'Đâu là tiêu chí ra?', lc: [['a', 'All issues raised are resolved and the changes are verified'], ['b', 'The document has line numbers'], ['c', 'The author is present'], ['d', 'Inspectors have read the template']], dap: 'a', giai: ['Exit = issues closed, changes checked.', 'Ra = lỗi đã đóng, thay đổi đã kiểm.'] },
    { en: 'Why are line numbers an entry criterion?', vi: 'Vì sao đánh số dòng là tiêu chí vào?', lc: [['a', 'So issues can be located precisely in the meeting and the log'], ['b', 'For decoration'], ['c', 'The printer needs them'], ['d', 'Template rule only']], dap: 'a', giai: ['Precise references speed up the meeting and rework.', 'Tham chiếu chính xác giúp họp và sửa nhanh.'] },
  ],
  goiY: ['Chưa đạt tiêu chí vào ⇒ hoãn.', 'Tiêu chí ra liên quan tới việc đã sửa và đã kiểm.'],
  loiHayGap: ['Inspection bản nháp thô.', 'Kết thúc khi họp xong mà chưa kiểm phần sửa.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('inspection'),
  khaiNiem: ['entry and exit criteria'],
});

const E4 = baiJs({
  tieuDe: 'Inspection 4 — automate part of the checklist',
  doKho: 'HARD', phut: 20,
  moTa: { en: '<p>An inspection checklist has items a tool can pre-check, so inspectors spend their time on real thinking. Write <code>function lint(text)</code> that returns an array of issue codes (any order, no duplicates) for one requirement:</p><ul><li><code>NO_SHALL</code> — the text does not contain the word "shall".</li><li><code>MULTI</code> — "shall" appears more than once.</li><li><code>VAGUE</code> — contains (whole word, case-insensitive) one of: <i>fast, user-friendly, easy, flexible, efficient, robust, appropriate, adequate, several, etc, and/or, support</i>.</li><li><code>PASSIVE</code> — "shall be" followed by a word ending in "ed" or "en" (e.g. "shall be sent", "shall be displayed").</li><li><code>TBD</code> — contains "TBD" (upper case).</li></ul><p>A clean requirement returns <code>[]</code>. It is tested on hidden requirements.</p>', vi: '<p>Viết <code>lint(text)</code> trả mảng mã lỗi (không trùng) cho một yêu cầu: NO_SHALL, MULTI (shall xuất hiện >1 lần), VAGUE (từ mơ hồ trong danh sách, nguyên từ, không phân biệt hoa thường), PASSIVE ("shall be" + từ đuôi "ed"/"en"), TBD. Yêu cầu sạch trả []. Có kiểm trên dữ liệu ẩn.</p>' },
  yeuCau: [{ en: 'Whole-word matching: "supported" must not trigger "support"; "etc." triggers "etc".', vi: 'So nguyên từ: "supported" không bị tính là "support"; "etc." thì có.' }],
  viDu: [{ input: 'lint("The report shall be sent fast.")', output: '["PASSIVE","VAGUE"]', explanation: 'Passive voice + "fast".|||Bị động + "fast".' }],
  tep: { 'lint.js': ["function lint(text) {\n  var issues = [];\n  // TODO\n  return issues;\n}\n", "var VAGUE_WORDS = ['fast', 'user-friendly', 'easy', 'flexible', 'efficient', 'robust', 'appropriate', 'adequate', 'several', 'etc', 'and/or', 'support'];\n\nfunction lint(text) {\n  var t = String(text);\n  var issues = [];\n  var shall = (t.match(/\\bshall\\b/gi) || []).length;\n  if (shall === 0) issues.push('NO_SHALL');\n  if (shall > 1) issues.push('MULTI');\n  var low = t.toLowerCase();\n  var vague = VAGUE_WORDS.some(function (w) {\n    var esc = w.replace(/[.*+?^${}()|[\\]\\\\\\/-]/g, '\\\\$&');\n    return new RegExp('(^|[^a-z0-9-])' + esc + '(?![a-z0-9-])').test(low);\n  });\n  if (vague) issues.push('VAGUE');\n  if (/\\bshall be \\w+(ed|en)\\b/i.test(t)) issues.push('PASSIVE');\n  if (/TBD/.test(t)) issues.push('TBD');\n  return issues;\n}\n"] },
  kiem: (function () {
    var ca = [
      ['The system shall e-mail the patient 24 hours before the appointment.', []],
      ['Patients can book online.', ['NO_SHALL']],
      ['The system shall book the slot and shall send an SMS.', ['MULTI']],
      ['The search shall be fast.', ['VAGUE']],
      ['The invoice shall be generated at midnight.', ['PASSIVE']],
      ['The fine shall be TBD per day.', ['TBD']],
    ];
    var an = [
      ['The system shall export reports in PDF, CSV, etc.', ['VAGUE']],
      ['The system shall notify the doctor and/or the nurse.', ['VAGUE']],
      ['The system shall display supported file types.', []],
      ['The receipt shall be written to the audit log.', ['PASSIVE']],
      ['The system shall support several languages and shall be robust.', ['MULTI', 'VAGUE']],
      ['Reports are generated TBD.', ['NO_SHALL', 'TBD']],
      ['The SHALL keyword in upper case SHALL count.', ['MULTI']],
      ['The system shall lock the account after 5 failed attempts.', []],
      ['The system shall be Easy to learn for new nurses.', ['VAGUE']],
      ['The system shall show the user-friendliness score of each screen.', []],
    ];
    function kiem1(ds, moTa, ex) {
      return kiemTuy(moTa, new Function('var ca = ' + JSON.stringify(ds) + ';\n' +
        "if (typeof lint !== 'function') return 'lint is not a function';\n" +
        'for (var i = 0; i < ca.length; i++) {\n' +
        '  var r = lint(ca[i][0]); if (!Array.isArray(r)) return "lint must return an array";\n' +
        '  var a = r.slice().sort().join(","), b = ca[i][1].slice().sort().join(",");\n' +
        '  if (a !== b) return "lint(" + JSON.stringify(ca[i][0]) + ") should be [" + b + "], got [" + a + "]";\n' +
        '}\nreturn "OK";'), ex);
    }
    return [
      kiem1(ca.slice(0, 1), { en: 'a clean requirement returns []', vi: 'yêu cầu sạch trả []' }),
      kiem1(ca.slice(1, 3), { en: 'NO_SHALL and MULTI', vi: 'NO_SHALL và MULTI' }),
      kiem1(ca.slice(3, 4), { en: 'VAGUE', vi: 'VAGUE' }),
      kiem1(ca.slice(4, 6), { en: 'PASSIVE and TBD', vi: 'PASSIVE và TBD' }),
      kiem1(an.slice(0, 5), { en: 'hidden requirements (vague words, whole words, combined issues)', vi: 'yêu cầu ẩn (từ mơ hồ, nguyên từ, nhiều lỗi)' }, { an: true }),
      kiem1(an.slice(5), { en: 'hidden requirements (case, compound words)', vi: 'yêu cầu ẩn (hoa thường, từ ghép)' }, { an: true }),
    ];
  })(),
  goiY: ['Đếm "shall" bằng /\\bshall\\b/gi.', 'So nguyên từ: kiểm ký tự trước/sau không phải chữ, số hay "-" (để "user-friendliness" không khớp "user-friendly").'],
  loiHayGap: ['Dùng includes("support") ⇒ "supported" bị bắt nhầm.', 'Quên không phân biệt hoa thường với "Easy" và "SHALL".'],
  giaiThich: '<p>A tool can pre-check mechanical defects (missing or multiple "shall", vague words, passive voice, TBDs), which lets inspectors concentrate on correctness, completeness and feasibility — things only people can judge.</p>',
  thuatNgu: tn('inspection', 'ambiguous', 'tbd'),
  khaiNiem: ['inspection checklists'],
  boYeu: [{ ten: 'includes thô', tep: { 'lint.js': "function lint(t){ var r=[]; var l=t.toLowerCase(); if(l.indexOf('shall')<0) r.push('NO_SHALL'); if(l.split('shall').length>2) r.push('MULTI'); if(['fast','easy','support','etc','and/or','several','robust','user-friendly'].some(function(w){return l.indexOf(w)>=0;})) r.push('VAGUE'); if(/shall be \\w+ed/.test(l)) r.push('PASSIVE'); if(t.indexOf('TBD')>=0) r.push('TBD'); return r; }\n" } }],
});

export default moDun({
  slug: 'swr302-6-2-ch17-inspection',
  ten: '6.2 The inspection process',
  moTaModule: 'Các bước inspection (Planning → Preparation → Meeting → Rework → Follow-up), vai trò Author/Moderator/Reader/Recorder/Inspector, tiêu chí vào/ra; tự viết công cụ soát trước checklist (NO_SHALL, MULTI, VAGUE, PASSIVE, TBD) chấm trên dữ liệu ẩn.',
  de: [E1, E2, E3, E4],
});
