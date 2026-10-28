/**
 * SWR302 · 4.9 — The data dictionary and CRUD analysis (Wiegers Ch.13 slides 8–12).
 */
import { tn, kiemTuy, kiemKhoa, jsLit } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Data dictionary 1 — the notation',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers’ data dictionary notation: a <b>primitive</b> cannot be decomposed further (give its type, length and allowed values); a <b>structure</b> is a composition written with <code>+</code>; a <b>repeating group</b> is written <code>m:n{Element}</code>; an optional element is written in parentheses <code>(Element)</code>.</p>', vi: '<p>Ký pháp data dictionary của Wiegers: <b>primitive</b> không phân rã thêm (ghi kiểu, độ dài, giá trị hợp lệ); <b>structure</b> là tổ hợp viết bằng <code>+</code>; <b>nhóm lặp</b> viết <code>m:n{Phần tử}</code>; phần tử tuỳ chọn viết trong ngoặc <code>(Phần tử)</code>.</p>' },
  cau: [
    { en: '"An order has one to ten order lines" is written…', vi: '"Một đơn có từ một tới mười dòng" viết là…', lc: [['a', 'Order Line × 10'], ['b', '1:10{Order Line}'], ['c', '(Order Line)'], ['d', 'Order Line + Order Line']], dap: 'b', giai: ['m:n{…} is the repeating group.', 'm:n{…} là nhóm lặp.'] },
    { en: '"A delivery note is optional" is written…', vi: '"Ghi chú giao hàng là tuỳ chọn" viết là…', lc: [['a', '(Delivery Note)'], ['b', '{Delivery Note}'], ['c', '0{Delivery Note}'], ['d', 'Delivery Note?']], dap: 'a', giai: ['Parentheses mark an optional element.', 'Ngoặc tròn đánh dấu phần tử tuỳ chọn.'] },
    { en: 'Which element is a primitive?', vi: 'Phần tử nào là primitive?', lc: [['a', 'Customer Address = Street + City + (Postal Code)'], ['b', 'Phone Number: 10 digits starting with 0'], ['c', 'Order = Order ID + 1:10{Order Line}'], ['d', 'Order Line = Product ID + Quantity']], dap: 'b', giai: ['A single value with a format.', 'Một giá trị đơn có định dạng.'] },
    { en: 'Why keep a data dictionary at all?', vi: 'Vì sao cần data dictionary?', lc: [['a', 'To replace the ERD'], ['b', 'So that every team member uses one definition of each data element (name, composition, type, allowed values)'], ['c', 'Only for the database administrator'], ['d', 'Because the template requires it']], dap: 'b', giai: ['One shared definition avoids two names for one thing.', 'Một định nghĩa chung tránh hai tên cho một thứ.'] },
  ],
  goiY: ['+ ghép; ( ) tuỳ chọn; m:n{ } lặp.', 'Primitive = một giá trị có kiểu/độ dài/giá trị hợp lệ.'],
  loiHayGap: ['Viết số nhiều ("Order Lines") thay vì nhóm lặp.', 'Định nghĩa primitive mà không có giá trị hợp lệ.'],
  giaiThich: '<p>Answers: b · a · b · b.</p>',
  thuatNgu: tn('dataDictionary'),
  khaiNiem: ['data dictionary notation'],
});

const GIAI_DD = [
  { element: 'Event Registration', type: 'structure', composition: 'Registration ID + Student ID + Event ID + 1:3{Guest Name} + (Dietary Note) + Registration Time', description: 'One student’s registration to a campus event, with up to three guests.' },
  { element: 'Registration ID', type: 'primitive', dataType: 'alphanumeric', length: 9, values: '"REG" followed by 6 digits', description: 'Unique identifier of a registration.' },
  { element: 'Student ID', type: 'primitive', dataType: 'alphanumeric', length: 8, values: 'university student code, e.g. SE180123', description: 'The student who registers.' },
  { element: 'Event ID', type: 'primitive', dataType: 'alphanumeric', length: 6, values: '"EV" followed by 4 digits', description: 'The event registered for.' },
  { element: 'Guest Name', type: 'primitive', dataType: 'text', length: 60, values: 'any name, at most 60 characters', description: 'Name of a guest the student brings.' },
  { element: 'Dietary Note', type: 'primitive', dataType: 'text', length: 100, values: 'any text, at most 100 characters', description: 'Optional food allergy or diet information.' },
  { element: 'Registration Time', type: 'primitive', dataType: 'datetime', length: 19, values: 'yyyy-mm-dd hh:mm:ss', description: 'When the registration was made.' },
];
const DD_DOC = function () {
  if (typeof DATA_DICTIONARY === 'undefined' || !Array.isArray(DATA_DICTIONARY) || !DATA_DICTIONARY.length) return { loi: 'DATA_DICTIONARY is missing' };
  var n = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); };
  var ten = {}; DATA_DICTIONARY.forEach(function (e) { if (e && e.element) ten[n(e.element)] = e; });
  function tach(c) {
    var out = [], ps = String(c || '').split('+');
    for (var i = 0; i < ps.length; i++) {
      var t = ps[i].trim(), m;
      if ((m = /^\(\s*([^(){}]+?)\s*\)$/.exec(t))) out.push({ ten: m[1], tuyChon: true });
      else if ((m = /^(\d+)\s*:\s*(\d+|n)\s*\{\s*([^(){}]+?)\s*\}$/i.exec(t))) out.push({ ten: m[3], lap: [Number(m[1]), m[2]] });
      else if (/^[A-Za-z][\w .'-]*$/.test(t)) out.push({ ten: t });
      else return 'cannot read "' + t + '"';
    }
    return out;
  }
  return { n: n, ten: ten, tach: tach };
}.toString();
const E2 = baiJs({
  tieuDe: 'Data dictionary 2 — define an event registration',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Campus events: a student registers for an event and may bring <b>up to 3 guests</b> (their names are recorded); a <b>dietary note</b> is optional (≤ 100 characters); the registration ID is "REG" + 6 digits; the time of registration is stored. Write the data dictionary entries in <code>DATA_DICTIONARY</code>.</p>', vi: '<p>Sự kiện trong trường: sinh viên đăng ký một sự kiện và có thể dẫn <b>tối đa 3 khách</b> (ghi tên khách); <b>ghi chú ăn uống</b> là tuỳ chọn (≤ 100 ký tự); mã đăng ký là "REG" + 6 chữ số; lưu thời điểm đăng ký. Viết các mục data dictionary trong <code>DATA_DICTIONARY</code>.</p>' },
  yeuCau: [{ en: 'One structure "Event Registration" in Wiegers notation; every element it uses defined as a primitive with dataType and length or values.', vi: 'Một structure "Event Registration" theo ký pháp Wiegers; mọi phần tử nó dùng được định nghĩa là primitive có dataType và length hoặc values.' }],
  viDu: [{ input: "{ element: 'Guest Name', type: 'primitive', dataType: 'text', length: 60 }", output: 'a primitive entry', explanation: 'Type and length (or allowed values).|||Kiểu và độ dài (hoặc giá trị hợp lệ).' }],
  tep: { 'dictionary.js': ["const DATA_DICTIONARY = [\n  { element: 'Event Registration', type: 'structure', composition: 'Registration ID + …', description: '' },\n];\n", `const DATA_DICTIONARY = ${jsLit(GIAI_DD)};\n`] },
  kiem: [
    kiemTuy({ en: 'the dictionary is closed and well formed', vi: 'từ điển khép kín và đúng dạng' }, new Function(`var d = (${DD_DOC})(); if (d.loi) return d.loi;
      for (var i = 0; i < DATA_DICTIONARY.length; i++) {
        var e = DATA_DICTIONARY[i] || {};
        if (e.type === 'structure') { var t = d.tach(e.composition); if (typeof t === 'string') return e.element + ': ' + t; for (var j = 0; j < t.length; j++) if (!d.ten[d.n(t[j].ten)]) return '"' + t[j].ten + '" is used but not defined'; }
        else if (e.type === 'primitive') { if (!e.dataType || (!e.length && !e.values)) return e.element + ': dataType and length or values'; }
        else return e.element + ': type must be primitive or structure';
      }
      return 'OK';`)),
    kiemTuy({ en: 'guests are a repeating group 1:3 (or 0:3)', vi: 'khách là nhóm lặp 1:3 (hoặc 0:3)' }, new Function(`var d = (${DD_DOC})(); if (d.loi) return d.loi;
      var e = d.ten['event registration']; if (!e) return 'define "Event Registration"';
      var t = d.tach(e.composition); if (typeof t === 'string') return t;
      var g = t.filter(function (x) { return /guest/.test(d.n(x.ten)); })[0];
      if (!g || !g.lap) return 'guests repeat: write m:n{Guest Name}';
      return g.lap[1] === '3' ? 'OK' : 'at most 3 guests ⇒ the upper bound is 3';`)),
    kiemTuy({ en: 'the dietary note is optional and the ID format is stated', vi: 'ghi chú ăn uống là tuỳ chọn và có định dạng mã' }, new Function(`var d = (${DD_DOC})(); if (d.loi) return d.loi;
      var e = d.ten['event registration']; if (!e) return 'define "Event Registration"';
      var t = d.tach(e.composition); if (typeof t === 'string') return t;
      var n = t.filter(function (x) { return /diet|note/.test(d.n(x.ten)); })[0];
      if (!n || !n.tuyChon) return 'the dietary note is optional: (Dietary Note)';
      var r = d.ten['registration id'];
      return r && /reg/i.test(String(r.values)) && /6/.test(String(r.values) + ' ' + r.length) ? 'OK' : 'Registration ID: "REG" followed by 6 digits';`)),
  ],
  goiY: ['Structure: "Registration ID + Student ID + Event ID + 1:3{Guest Name} + (Dietary Note) + Registration Time".', 'Mỗi tên dùng trong composition phải có một mục primitive riêng.'],
  loiHayGap: ['Viết "Guests" thay vì 1:3{Guest Name}.', 'Quên định nghĩa một phần tử đã dùng.'],
  giaiThich: '<p>One structure, six primitives; the repeating group and the optional element carry the business rules (≤ 3 guests, optional note).</p>',
  thuatNgu: tn('dataDictionary'),
  khaiNiem: ['data dictionary'],
  boYeu: [{ ten: 'không lặp + không khép kín', tep: { 'dictionary.js': `const DATA_DICTIONARY = ${jsLit([{ element: 'Event Registration', type: 'structure', composition: 'Registration ID + Student ID + Event ID + Guests + Dietary Note', description: 'One registration of a student.' }, ...GIAI_DD.slice(1)])};\n` } }],
});

const E3 = phanLoai({
  tieuDe: 'CRUD 1 — fill the CRUD matrix',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Events system: <b>Create Event</b> (organiser creates an event; reads the venue list) · <b>Register for Event</b> (student; reads the event, creates a registration, updates the event’s free seats) · <b>Cancel Registration</b> (deletes the registration, updates the free seats) · <b>Check In Attendee</b> (reads the registration, updates it as attended). Give the letters for each use case on the entity in the row title.</p>', vi: '<p>Hệ thống sự kiện (bản tiếng Anh mô tả từng use case). Ghi các chữ CRUD của use case trên thực thể ghi ở tiêu đề dòng.</p>' },
  cotCau: 'Use case → entity', cot: 'CRUD', luaChon: ['C', 'R', 'U', 'D', 'RU', 'CR', 'RD'],
  hang: [
    ['Create Event → Event', 'C'], ['Create Event → Venue', 'R'],
    ['Register for Event → Event', 'RU'], ['Register for Event → Registration', 'C'],
    ['Cancel Registration → Registration', 'RD'], ['Cancel Registration → Event', 'U'],
    ['Check In Attendee → Registration', 'RU'],
  ],
  giaiThich: '<p>Reading what each use case does to each entity gives the cells; empty columns or missing letters then point to missing requirements (e.g. who deletes an event?).</p>',
  goiY: ['Đọc từng động từ trong mô tả use case: creates ⇒ C, reads ⇒ R, updates ⇒ U, deletes ⇒ D.', 'Một use case có thể vừa đọc vừa sửa một thực thể (RU).'],
  loiHayGap: ['Quên chữ R khi use case phải đọc trước khi sửa.', 'Quên Register for Event cũng cập nhật số chỗ trống của Event.'],
  thuatNgu: tn('crud'),
  khaiNiem: ['CRUD matrix'],
});

const E4 = baiJs({
  tieuDe: 'CRUD 2 — find what the matrix says is missing',
  doKho: 'HARD', phut: 10,
  moTa: { en: '<p>From the CRUD matrix of exercise "CRUD 1" (Event: C by Create Event, RU by Register, U by Cancel; Venue: R only; Registration: C by Register, RD by Cancel, RU by Check In), list in <code>MISSING</code>: <code>neverCreated</code> (entities nobody creates), <code>neverDeleted</code> (entities nobody deletes) and <code>newUseCases</code> — choose from: <code>MANAGE_VENUES</code>, <code>CANCEL_EVENT</code>, <code>PRINT_TICKET</code>, <code>RATE_EVENT</code> the two use cases that close those gaps.</p>', vi: '<p>Từ ma trận CRUD của bài trước, liệt kê trong <code>MISSING</code>: thực thể không ai tạo, thực thể không ai xoá, và hai use case mới lấp khoảng trống đó.</p>' },
  yeuCau: [{ en: 'Entity names Event, Venue, Registration; use case codes from the list.', vi: 'Tên thực thể Event, Venue, Registration; mã use case trong danh sách.' }],
  viDu: [{ input: 'Venue has only R', output: 'Venue is never created and never deleted', explanation: 'Someone must manage venues.|||Phải có người quản lý địa điểm.' }],
  tep: { 'missing.js': ["const MISSING = { neverCreated: [], neverDeleted: [], newUseCases: [] };\n", "// Venue: only R ⇒ never created or deleted. Event: no D ⇒ events cannot be cancelled.\nconst MISSING = { neverCreated: ['Venue'], neverDeleted: ['Venue', 'Event'], newUseCases: ['MANAGE_VENUES', 'CANCEL_EVENT'] };\n"] },
  kiem: kiemKhoa([
    { moTa: { en: 'entities never created', vi: 'thực thể không ai tạo' }, bieuThuc: '(MISSING.neverCreated || []).map(String)', chap: [['Venue']], kieu: 'tap' },
    { moTa: { en: 'entities never deleted', vi: 'thực thể không ai xoá' }, bieuThuc: '(MISSING.neverDeleted || []).map(String)', chap: [['Venue', 'Event']], kieu: 'tap' },
    { moTa: { en: 'the two use cases that close the gaps', vi: 'hai use case lấp khoảng trống' }, bieuThuc: '(MISSING.newUseCases || []).map(String)', chap: [['MANAGE_VENUES', 'CANCEL_EVENT']], kieu: 'tap' },
  ]),
  goiY: ['Cột không có C ⇒ không ai tạo; không có D ⇒ không ai xoá.', 'Registration có D (huỷ đăng ký) nên không thiếu.'],
  loiHayGap: ['Liệt kê Registration vào neverDeleted.', 'Chọn PRINT_TICKET — không lấp khoảng trống CRUD nào.'],
  giaiThich: '<p>Venue has only R ⇒ a Manage Venues use case is missing; Event has no D ⇒ events cannot be cancelled. The CRUD matrix found two missing requirements nobody mentioned.</p>',
  thuatNgu: tn('crud'),
  khaiNiem: ['CRUD analysis'],
});

export default moDun({
  slug: 'swr302-4-11-ch13-dictionary-crud',
  ten: '4.11 The data dictionary and CRUD analysis',
  moTaModule: 'Ký pháp data dictionary Wiegers (primitive, structure, nhóm lặp m:n{ }, tuỳ chọn ( )), tự viết từ điển cho đăng ký sự kiện có kiểm khép kín, điền ma trận CRUD và đọc ra yêu cầu thiếu.',
  de: [E1, E3, E2, E4],
});
