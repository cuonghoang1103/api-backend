/** API Design · 2.4 — Lỗi song ngữ + chữ tiếng Việt: dịch gì, Accept-Language, NFC/NFD; tự viết pickLanguage, fold, localize. */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Dịch gì ── */
const DS = ['never translated', 'translated', 'sent as a value, formatted by the client', 'returned as stored (data)'];
const L1 = cs({
  ten: 'Bilingual 1 — What is translated, and what never is', kho: 'EASY', phut: 6, loai: 'table',
  en: 'LabFlow answers in Vietnamese or English (lesson 2.4). For each part of a response, choose what happens to it.',
  vi: 'LabFlow trả lời bằng tiếng Việt hoặc tiếng Anh (bài 2.4). Với mỗi phần của response, chọn điều xảy ra với nó.',
  bang: [bang1('b1', ['Part → treatment', 'Phần → cách xử lý'], [{ ma: 'x', ten: 'Part of the response' }, { ma: 't', ten: 'Treatment', luaChon: DS }], [
    { o: { x: '"code": "BOOKING_CONFLICT"' }, a: { t: DS[0] } },
    { o: { x: '"pointer": "#/startAt"' }, a: { t: DS[0] } },
    { o: { x: '"status": "MAINTENANCE" (an enum value)' }, a: { t: DS[0] } },
    { o: { x: '"title": "Trùng lịch phòng" / "Booking conflict"' }, a: { t: DS[1] } },
    { o: { x: '"startAt": "2026-11-02T01:00:00.000Z"' }, a: { t: DS[2] } },
    { o: { x: '"name": "Phòng Lab IoT" (a lab)' }, a: { t: DS[3] } },
  ], ['Identifiers (codes, types, pointers, enum values) are contract and never change with the language; text for humans is translated; values such as instants and amounts are sent unambiguous and formatted by the client; user data is returned as stored.', 'Định danh (mã, type, pointer, giá trị enum) là hợp đồng, không đổi theo ngôn ngữ; chữ cho người đọc được dịch; giá trị như thời điểm, số tiền được gửi rõ ràng và client tự định dạng; dữ liệu người dùng trả đúng như đã lưu.'])],
  goiY: [['Would a program break if this changed?', 'Chương trình có hỏng nếu cái này đổi không?'], ['A lab name is data someone typed, not an error message.', 'Tên phòng là dữ liệu người dùng gõ, không phải câu báo lỗi.']],
  loi: [['Translating enum values for Vietnamese users.', 'Dịch giá trị enum cho người dùng Việt.'], ['Formatting dates on the server for one locale.', 'Định dạng ngày ở server cho một locale.']],
  tns: [tn('localisation', 'bản địa hoá'), tn('locale', 'thiết lập vùng (ngôn ngữ, định dạng)')],
  kn: ['i18n'],
});

/* ── 2. Tự viết: pickLanguage ── */
function pickLanguage(header, supported, fallback) {
  if (!header || !header.trim()) return fallback;
  var items = header.split(',').map(function (part, i) {
    var bits = part.trim().split(';');
    var tag = bits[0].trim().toLowerCase();
    var qv = 1;
    bits.slice(1).forEach(function (b) { var m = /^\s*q=([0-9.]+)\s*$/.exec(b); if (m) qv = Number(m[1]); });
    return { tag: tag, q: qv, i: i };
  }).filter(function (x) { return x.tag && x.q > 0; });
  items.sort(function (a, b) { return b.q - a.q || a.i - b.i; });   // higher q first, then header order
  for (var k = 0; k < items.length; k++) {
    var t = items[k].tag;
    if (t === '*') return supported[0];
    for (var s = 0; s < supported.length; s++) {
      var sup = supported[s].toLowerCase();
      if (t === sup || t.split('-')[0] === sup) return supported[s];
    }
  }
  return fallback;
}
const L2 = jsBai({
  ten: 'Bilingual 2 — Write pickLanguage(header, supported, fallback)', kho: 'HARD', phut: 20,
  en: `<p>Re-implement the language choice Express made for LabFlow. <code>header</code> is the raw <code>Accept-Language</code> value (may be empty or undefined), <code>supported</code> e.g. <code>['vi', 'en']</code>, <code>fallback</code> e.g. <code>'vi'</code>.</p><ul>
<li>Split on <code>,</code>; each item is a tag plus optional <code>;q=</code> weight (default 1). Tags are case-insensitive. Items with <code>q=0</code> mean “not acceptable” — drop them.</li>
<li>Try items by <b>higher q first</b>; equal q keep header order.</li>
<li>An item matches a supported language if equal, or if its primary subtag (before <code>-</code>) equals it: <code>en-US</code> matches <code>en</code>. <code>*</code> matches the first supported language. Return the supported spelling.</li>
<li>No header, or nothing matches ⇒ <code>fallback</code> (LabFlow answers instead of 406).</li></ul>`,
  vi: `<p>Cài lại việc chọn ngôn ngữ mà Express làm cho LabFlow. <code>header</code> là giá trị thô của <code>Accept-Language</code> (có thể rỗng hoặc undefined), <code>supported</code> ví dụ <code>['vi', 'en']</code>, <code>fallback</code> ví dụ <code>'vi'</code>.</p><ul>
<li>Tách theo <code>,</code>; mỗi mục là một thẻ ngôn ngữ kèm trọng số <code>;q=</code> tuỳ chọn (mặc định 1). Thẻ không phân biệt hoa thường. Mục có <code>q=0</code> nghĩa là "không chấp nhận" — bỏ đi.</li>
<li>Thử các mục theo <b>q cao trước</b>; q bằng nhau thì giữ thứ tự trong header.</li>
<li>Một mục khớp ngôn ngữ được hỗ trợ nếu bằng nhau, hoặc nếu thẻ chính (trước <code>-</code>) bằng nó: <code>en-US</code> khớp <code>en</code>. <code>*</code> khớp ngôn ngữ đầu tiên được hỗ trợ. Trả về cách viết trong <code>supported</code>.</li>
<li>Không có header, hoặc không khớp gì ⇒ <code>fallback</code> (LabFlow trả lời thay vì 406).</li></ul>`,
  dauVao: ['header — string | undefined; supported — string[]; fallback — string.', 'header — chuỗi | undefined; supported — mảng chuỗi; fallback — chuỗi.'],
  dauRa: ['One of supported, or fallback.', 'Một phần tử của supported, hoặc fallback.'],
  goiY: [['Parse into [{ tag, q, index }], drop q = 0, sort by q desc then index.', 'Phân tích thành [{ tag, q, index }], bỏ q = 0, sắp theo q giảm rồi index.'], ['tag.split("-")[0] gives the primary subtag.', 'tag.split("-")[0] cho ra thẻ chính.']],
  loi: [['Taking the first tag in the header and ignoring q.', 'Lấy thẻ đầu tiên trong header và bỏ qua q.'], ['Matching "en" against "en-US" in the wrong direction — the client’s regional tag must match our language.', 'Khớp "en" với "en-US" sai chiều — thẻ có vùng của client phải khớp ngôn ngữ của ta.']],
  gt: ['RFC 9110 §12.5.4 defines Accept-Language as a weighted list. Sorting by weight (stable for ties), prefix matching of regional tags and a default when nothing matches reproduce the real outputs of lesson 2.4: en-US → en, “vi;q=0.4, en;q=0.6” → en, fr → vi.', 'RFC 9110 §12.5.4 định nghĩa Accept-Language là danh sách có trọng số. Sắp theo trọng số (giữ thứ tự khi bằng), khớp tiền tố cho thẻ có vùng và có mặc định khi không khớp sẽ tái hiện đúng output thật của bài 2.4: en-US → en, "vi;q=0.4, en;q=0.6" → en, fr → vi.'],
  kn: ['content negotiation'],
  tns: [tn('quality value (q)', 'trọng số ưu tiên'), tn('language tag', 'thẻ ngôn ngữ', 'vi, en, en-US…')],
  dau: `/** Accept-Language ⇒ one of supported, or fallback */
function pickLanguage(header, supported, fallback) {
  // Write your solution here
  if (!header) return fallback;
  var first = header.split(',')[0].split(';')[0].trim();
  return supported.indexOf(first) >= 0 ? first : fallback;
}
`,
  giai: '// Reference solution\n' + nguon(pickLanguage),
  cases: [
    { goi: goi('pickLanguage', 'en-US,en;q=0.9,vi;q=0.8', ['vi', 'en'], 'vi'), moTa: ['A real browser header (lesson 2.4)', 'Header trình duyệt thật (bài 2.4)'] },
    { goi: goi('pickLanguage', 'vi;q=0.4, en;q=0.6', ['vi', 'en'], 'vi') },
    { goi: goi('pickLanguage', 'fr', ['vi', 'en'], 'vi') },
    { goi: `pickLanguage(undefined, ["vi","en"], "vi")`, an: true },
    { goi: goi('pickLanguage', 'EN-gb;q=0.7, fr;q=0.9', ['vi', 'en'], 'vi'), an: true },
    { goi: goi('pickLanguage', 'en;q=0, vi', ['vi', 'en'], 'en'), an: true },
    { goi: goi('pickLanguage', 'ja, *;q=0.1', ['vi', 'en'], 'en'), an: true },
    { goi: goi('pickLanguage', 'de;q=0.5, en;q=0.5, vi;q=0.5', ['vi', 'en'], 'vi'), an: true },
    { goi: goi('pickLanguage', '   ', ['vi', 'en'], 'vi'), an: true },
  ],
});

/* ── 3. Tự viết: fold ── */
function fold(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}
const L3 = jsBai({
  ten: 'Bilingual 3 — Write fold(s): compare Vietnamese like a reader', kho: 'MEDIUM', phut: 12,
  en: `<p>LabFlow’s search and Lab 2’s duplicate rule compare titles “like a reader”: no accents, no case, no NFC/NFD difference. Write <code>fold(s)</code>: decompose to NFD, remove every combining mark (Unicode category M), replace <code>đ</code> → <code>d</code> and <code>Đ</code> → <code>D</code> (they have <b>no</b> decomposition — measured in lesson 2.4), then lower-case.</p>`,
  vi: `<p>Tìm kiếm của LabFlow và luật chống trùng của Lab 2 so tiêu đề "như người đọc": không dấu, không phân biệt hoa thường, không phân biệt NFC/NFD. Viết <code>fold(s)</code>: tách về NFD, bỏ mọi dấu kết hợp (nhóm Unicode M), thay <code>đ</code> → <code>d</code> và <code>Đ</code> → <code>D</code> (chúng <b>không</b> tách được — đã đo ở bài 2.4), rồi viết thường.</p>`,
  dauVao: ['s — a string.', 's — một chuỗi.'],
  dauRa: ['The folded string.', 'Chuỗi đã gấp.'],
  goiY: [['s.normalize("NFD") then .replace(/\\p{M}/gu, "").', 's.normalize("NFD") rồi .replace(/\\p{M}/gu, "").'], ['Handle đ/Đ by hand after removing the marks.', 'Xử lý đ/Đ bằng tay sau khi bỏ dấu.']],
  loi: [['Forgetting đ: "Điện tử" folds to "đien tu" and never matches "dien tu".', 'Quên chữ đ: "Điện tử" gấp ra thành "đien tu" và không bao giờ khớp "dien tu".'], ['Removing only a few accents by hand with a lookup table — misses NFD input.', 'Tự bỏ vài dấu bằng bảng tra — bỏ sót chữ nhập ở dạng NFD.']],
  gt: ['NFD splits every accented letter into a base letter plus combining marks, so one regular expression removes all of them — and it works whatever form the input arrived in. Đ/đ are separate letters in Unicode, which is the one trap Vietnamese adds.', 'NFD tách mọi chữ có dấu thành chữ gốc cộng các dấu kết hợp, nên một biểu thức chính quy bỏ được tất cả — và chạy đúng dù chữ vào ở dạng nào. Đ/đ là chữ cái riêng trong Unicode, chính là cái bẫy tiếng Việt thêm vào.'],
  kn: ['Unicode normalisation'],
  tns: [tn('NFC / NFD', 'dạng dựng sẵn / dạng tách rời'), tn('combining mark', 'dấu kết hợp')],
  dau: `/** "Phòng Lab IoT" ⇒ "phong lab iot" */
function fold(s) {
  // Write your solution here
  return s.toLowerCase();
}
`,
  giai: '// Reference solution\n' + nguon(fold),
  cases: [
    { goi: goi('fold', 'Phòng Lab Mạng máy tính') }, { goi: goi('fold', 'Cổng console không lên đèn') },
    { goi: goi('fold', 'Phòng Lab IoT'), an: true, moTa: ['NFD input', 'Chữ dạng NFD'] }, { goi: goi('fold', 'Phòng Điện tử'), an: true },
    { goi: goi('fold', 'ĐƯỜNG ĐI'), an: true }, { goi: goi('fold', 'cong CONSOLE khong len den'), an: true }, { goi: goi('fold', ''), an: true },
  ],
});

/* ── 4. Tự viết: localize ── */
function localize(code, params, lang, catalog) {
  var useLang = catalog[lang] ? lang : 'vi';
  var entry = catalog[useLang][code] || catalog.vi[code];
  if (!entry) { useLang = catalog[useLang].INTERNAL ? useLang : 'vi'; entry = catalog[useLang].INTERNAL; }
  else if (!catalog[useLang][code]) useLang = 'vi';
  var fill = function (t) { return t.replace(/\{(\w+)\}/g, function (m, k) { return params && params[k] !== undefined ? String(params[k]) : m; }); };
  return { title: entry[0], detail: fill(entry[1]), contentLanguage: useLang };
}
const CAT = {
  vi: { LAB_NOT_FOUND: ['Không tìm thấy phòng lab', 'Không có phòng lab {id}'], BOOKING_CONFLICT: ['Trùng lịch phòng', 'Phòng đã có lượt {other} trong khung giờ này'], INTERNAL: ['Lỗi máy chủ', 'Máy chủ gặp lỗi, thử lại sau'] },
  en: { LAB_NOT_FOUND: ['Lab not found', 'There is no lab {id}'], INTERNAL: ['Internal server error', 'Something went wrong on our side, try again later'] },
};
const L4 = jsBai({
  ten: 'Bilingual 4 — Write localize(code, params, lang, catalog)', kho: 'MEDIUM', phut: 15,
  en: `<p>LabFlow builds sentences at the edge from a catalogue. Here templates use <code>{name}</code> placeholders: <code>catalog[lang][code] = [title, detailTemplate]</code>. Write <code>localize(code, params, lang, catalog)</code> ⇒ <code>{ title, detail, contentLanguage }</code>:</p><ul>
<li>A language missing from the catalogue ⇒ use <code>'vi'</code>.</li>
<li>A code missing in that language but present in <code>vi</code> ⇒ use the <code>vi</code> entry, and <code>contentLanguage</code> is <code>'vi'</code> (say honestly what you sent).</li>
<li>A code missing everywhere ⇒ the <code>INTERNAL</code> entry of the chosen language (or of <code>vi</code> if that language has none).</li>
<li>Replace every <code>{name}</code> with <code>params[name]</code>; a placeholder without a value stays as it is.</li></ul>`,
  vi: `<p>LabFlow dựng câu ở cửa ra từ một danh mục. Ở đây mẫu câu dùng chỗ giữ <code>{tên}</code>: <code>catalog[lang][code] = [title, mẫuDetail]</code>. Viết <code>localize(code, params, lang, catalog)</code> ⇒ <code>{ title, detail, contentLanguage }</code>:</p><ul>
<li>Ngôn ngữ không có trong danh mục ⇒ dùng <code>'vi'</code>.</li>
<li>Mã không có ở ngôn ngữ đó nhưng có ở <code>vi</code> ⇒ dùng mục của <code>vi</code>, và <code>contentLanguage</code> là <code>'vi'</code> (nói thật thứ mình đã gửi).</li>
<li>Mã không có ở đâu cả ⇒ mục <code>INTERNAL</code> của ngôn ngữ đã chọn (hoặc của <code>vi</code> nếu ngôn ngữ đó không có).</li>
<li>Thay mọi <code>{tên}</code> bằng <code>params[tên]</code>; chỗ giữ không có giá trị thì để nguyên.</li></ul>`,
  dauVao: ['code, params (object), lang, catalog.', 'code, params (object), lang, catalog.'],
  dauRa: ['{ title, detail, contentLanguage }', '{ title, detail, contentLanguage }'],
  goiY: [['Decide the language and the entry first, then fill the template.', 'Quyết ngôn ngữ và mục trước, rồi mới điền mẫu câu.'], ['String.replace with /\\{(\\w+)\\}/g and a function.', 'String.replace với /\\{(\\w+)\\}/g và một hàm.']],
  loi: [['Saying Content-Language: en while sending a Vietnamese fallback sentence.', 'Ghi Content-Language: en trong khi gửi câu dự phòng tiếng Việt.'], ['Replacing a missing parameter with "undefined".', 'Thay tham số thiếu bằng chữ "undefined".']],
  gt: ['The fallback rules decide what happens when the catalogue is incomplete — which it will be the day someone adds a code in one language only. Reporting the language actually used keeps Content-Language truthful for caches and clients.', 'Các luật dự phòng quyết điều xảy ra khi danh mục chưa đủ — chắc chắn sẽ có ngày ai đó thêm mã ở một ngôn ngữ. Báo đúng ngôn ngữ thật sự đã dùng giữ Content-Language trung thực cho cache và client.'],
  kn: ['message catalogue', 'fallback'],
  tns: [tn('message catalogue', 'danh mục câu chữ'), tn('fallback', 'phương án dự phòng')],
  dau: `/** code + params + lang ⇒ { title, detail, contentLanguage } */
function localize(code, params, lang, catalog) {
  // Write your solution here
  var e = catalog[lang][code];
  return { title: e[0], detail: e[1], contentLanguage: lang };
}
`,
  giai: '// Reference solution\n' + nguon(localize),
  cases: [
    { goi: goi('localize', 'LAB_NOT_FOUND', { id: 'lab_9' }, 'en', CAT) },
    { goi: goi('localize', 'LAB_NOT_FOUND', { id: 'lab_9' }, 'vi', CAT) },
    { goi: goi('localize', 'BOOKING_CONFLICT', { other: 'bk_1' }, 'en', CAT), moTa: ['Missing in en ⇒ vi', 'Thiếu ở en ⇒ vi'] },
    { goi: goi('localize', 'LAB_NOT_FOUND', { id: 'lab_9' }, 'fr', CAT), an: true },
    { goi: goi('localize', 'NO_SUCH_CODE', {}, 'en', CAT), an: true },
    { goi: goi('localize', 'BOOKING_CONFLICT', {}, 'vi', CAT), an: true },
    { goi: goi('localize', 'NO_SUCH_CODE', {}, 'ja', CAT), an: true },
  ],
});

export default doiDau({ slug: 'api-2-4-i18n', ten: '2.4 Errors for bilingual apps', khoa: KHOA, baiHoc: 'api-2-4-i18n', de: [L1, L2, L3, L4] });
