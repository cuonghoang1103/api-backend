/**
 * SWR302 · 18R.2 — Reuse scenarios (product lines, reengineering) and requirement patterns (Wiegers Ch.18 slides 10–14).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Reuse scenarios 1 — common, optional or variant?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>In a software product line, classify features as <b>common</b> (in all members), <b>optional</b> (in some members) or <b>variant</b> (different versions in different members). A tax-filing product line has Free, Basic, Deluxe and Business editions.</p>', vi: '<p>Trong dòng sản phẩm: tính năng chung, tuỳ chọn, biến thể.</p>' },
  cot: 'Feature kind', luaChon: ['Common', 'Optional', 'Variant'],
  hang: [
    ['Every edition calculates personal income tax.', 'Common'],
    ['Only Deluxe and Business import stock-trading records.', 'Optional'],
    ['Each edition has its own limit on the number of dependants it can handle.', 'Variant'],
    ['Every edition files the return electronically.', 'Common'],
    ['Only the Business edition handles payroll.', 'Optional'],
  ],
  giaiThich: '<p>Common features offer the most reuse — requirements, architecture, design, code and tests.</p>',
  goiY: ['Có ở mọi phiên bản ⇒ common.', 'Có ở mọi phiên bản nhưng khác nhau ⇒ variant.'],
  loiHayGap: ['Nhầm variant với optional.', 'Coi tính năng chỉ có ở một bản là common.'],
  thuatNgu: [{ en: 'product line', vi: 'dòng sản phẩm' }],
  khaiNiem: ['product lines'],
});

const E2 = tracNghiem({
  tieuDe: 'Reuse scenarios 2 — reengineered and replacement systems',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Replacement systems always reuse some requirements of the original, even if they were never written. When reverse-engineering requirements from an old system, raise your thinking to a higher level of abstraction to escape implementation details; harvest the business rules embedded in the old code.</p>', vi: '<p>Hệ thống thay thế luôn tái dùng một phần yêu cầu của hệ thống cũ.</p>' },
  cau: [
    { en: 'The old system "writes record type 07 to file TRX.DAT at midnight". The reusable requirement is…', vi: 'Hệ thống cũ "ghi bản ghi loại 07 vào tệp TRX.DAT lúc nửa đêm". Yêu cầu tái dùng được là…', lc: [['a', 'The system shall send the day’s transactions to the accounting system once a day.'], ['b', 'The system shall write record type 07 to TRX.DAT.'], ['c', 'Nothing'], ['d', 'The system shall use files.']], dap: 'a', giai: ['Lift to the business need.', 'Nâng lên nhu cầu nghiệp vụ.'] },
    { en: 'A valuable thing to harvest from legacy code is…', vi: 'Thứ đáng thu hoạch từ mã cũ là…', lc: [['a', 'the business rules embedded in it'], ['b', 'its variable names'], ['c', 'its indentation style'], ['d', 'its bugs']], dap: 'a', giai: ['Rules live on.', 'Luật vẫn còn giá trị.'] },
  ],
  goiY: ['Bỏ chi tiết cài đặt, giữ nhu cầu.', 'Luật nghiệp vụ trong mã cũ.'],
  loiHayGap: ['Chép nguyên chi tiết cài đặt cũ.', 'Bỏ qua luật trong mã cũ.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['reengineering'],
});

const E3 = phanLoai({
  tieuDe: 'Reuse scenarios 3 — sections of a requirement pattern',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A requirement pattern (Withall 2007) makes requirements of one type reusable. Its sections: <b>Guidance</b> (basics, when it applies, how to write it), <b>Content</b> (what such a requirement must convey, item by item), <b>Template</b> (fill-in-the-blanks with placeholders), <b>Examples</b>, <b>Extra requirements</b> (additional or more detailed requirements), and <b>Considerations for development and testing</b>. Classify each fragment of a "report requirement" pattern.</p>', vi: '<p>Các phần của một requirement pattern. Phân loại từng đoạn của pattern "yêu cầu báo cáo".</p>' },
  cot: 'Pattern section', luaChon: ['Guidance', 'Content', 'Template', 'Examples', 'Extra requirements', 'Considerations for development and testing'],
  hang: [
    ['"The system shall produce a «report name» showing «content» for «audience», «frequency»."', 'Template'],
    ['"Use this pattern for any report a user reads regularly; not for ad-hoc queries."', 'Guidance'],
    ['"State: the report’s name, its purpose, its audience, its data, its sort order, its frequency."', 'Content'],
    ['"The system shall produce a Daily Appointments report showing each doctor’s bookings for receptionists, every morning at 07:00."', 'Examples'],
    ['"Also specify who may see the report and how long it is kept."', 'Extra requirements'],
    ['"Testers should check the report with zero rows and with more rows than fit on one page."', 'Considerations for development and testing'],
  ],
  giaiThich: '<p>A pattern turns hard-won experience about one kind of requirement into a reusable checklist and template.</p>',
  goiY: ['Có chỗ trống «…» ⇒ template.', '"Khi nào dùng" ⇒ guidance.'],
  loiHayGap: ['Nhầm content với template.', 'Nhầm example với template.'],
  thuatNgu: [{ en: 'requirement pattern', vi: 'mẫu yêu cầu (pattern)' }],
  khaiNiem: ['requirement patterns'],
});

const E4 = baiJs({
  tieuDe: 'Reuse scenarios 4 — apply a pattern template',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Pattern template: "<i>The system shall produce a «name» report showing «content» for «audience», «frequency».</i>" Write <code>function fill(template, values)</code> that replaces every <code>«key»</code> with <code>values[key]</code>, and returns <code>null</code> if any placeholder has no value (or an empty value). Then write <code>REPORT</code>: the template filled for a monthly no-show report for the clinic manager.</p>', vi: '<p>Viết <code>fill(template, values)</code> thay mọi «key» bằng values[key], trả null nếu thiếu giá trị; rồi viết REPORT cho báo cáo no-show hằng tháng gửi quản lý phòng khám.</p>' },
  yeuCau: [{ en: 'Placeholders use the characters « and ».', vi: 'Chỗ trống dùng ký tự « và ».' }],
  viDu: [{ input: "fill('Hi «who»!', { who: 'An' })", output: "'Hi An!'", explanation: '|||' }],
  tep: { 'pattern.js': ["const TEMPLATE = 'The system shall produce a «name» report showing «content» for «audience», «frequency».';\nfunction fill(template, values) {\n  return null;\n}\nconst REPORT = '';\n", "const TEMPLATE = 'The system shall produce a «name» report showing «content» for «audience», «frequency».';\nfunction fill(template, values) {\n  var thieu = false;\n  var out = template.replace(/«([^»]+)»/g, function (_, k) {\n    var v = Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]).trim() : '';\n    if (!v) thieu = true;\n    return v;\n  });\n  return thieu ? null : out;\n}\nconst REPORT = fill(TEMPLATE, { name: 'Monthly No-show', content: 'the number and rate of no-shows per doctor and per service', audience: 'the clinic manager', frequency: 'on the first day of each month' });\n"] },
  kiem: [
    kiemTuy({ en: 'fill replaces every placeholder', vi: 'fill thay mọi chỗ trống' }, function () {
      if (typeof fill !== 'function') return 'fill is not a function';
      var r = fill('A «x» and «y» and «x».', { x: '1', y: '2' });
      return r === 'A 1 and 2 and 1.' ? 'OK' : 'got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'fill returns null when a value is missing or empty', vi: 'fill trả null khi thiếu hoặc rỗng' }, function () {
      if (typeof fill !== 'function') return 'fill is not a function';
      return fill('«a» «b»', { a: 'x' }) === null && fill('«a»', { a: '  ' }) === null && fill('«toString»', {}) === null ? 'OK' : 'missing, empty or inherited keys (toString) ⇒ null';
    }, { an: true }),
    kiemTuy({ en: 'REPORT is a complete requirement for the no-show report', vi: 'REPORT là yêu cầu đầy đủ cho báo cáo no-show' }, function () {
      if (typeof REPORT !== 'string' || /«|»/.test(REPORT)) return 'fill every placeholder';
      if (!/^the system shall produce a/i.test(REPORT)) return 'use the template';
      return /no-?show/i.test(REPORT) && /manager/i.test(REPORT) && /month/i.test(REPORT) ? 'OK' : 'the report is about no-shows, for the clinic manager, monthly';
    }),
  ],
  goiY: ['replace với /«([^»]+)»/g và hàm thay thế.', 'Dùng hasOwnProperty để "toString" không lọt.'],
  loiHayGap: ['Chỉ thay chỗ trống đầu tiên.', 'Không kiểm giá trị rỗng.'],
  giaiThich: '<p>Filling a pattern template guarantees that every requirement of that type states the same essential items.</p>',
  thuatNgu: [{ en: 'requirement pattern', vi: 'mẫu yêu cầu' }],
  khaiNiem: ['requirement patterns'],
  boYeu: [{ ten: 'thay một lần, không kiểm thiếu', tep: { 'pattern.js': "const TEMPLATE = 'The system shall produce a «name» report showing «content» for «audience», «frequency».';\nfunction fill(t,v){ return t.replace(/«([^»]+)»/, function(_,k){ return v[k]; }); }\nconst REPORT = 'The system shall produce a report.';\n" } }],
});

export default moDun({
  slug: 'swr302-18r-2-ch18-patterns',
  ten: '7.10 Reuse scenarios and requirement patterns',
  moTaModule: 'Tính năng chung/tuỳ chọn/biến thể trong dòng sản phẩm, tái dùng từ hệ thống cũ, các phần của requirement pattern, tự viết hàm điền template pattern có chấm.',
  de: [E1, E2, E3, E4],
});
