/** API Design · 9.1 — Cache HTTP: Cache-Control, ETag, 304, cache dùng chung (output thật bài 9.1). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'HTTP caching 1 — What the measurements showed', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 9.1 (LabFlow, autocannon, perf/cache-proxy.mjs).',
  vi: 'Những điều từ bài 9.1 (LabFlow, autocannon, perf/cache-proxy.mjs).',
  cau: [
    q('c1', ['With Express’s automatic ETag, a 304 still showed db and sort in Server-Timing. Why?', 'Với ETag tự động của Express, 304 vẫn có db và sort trong Server-Timing. Vì sao?'],
      ['Express hashes the finished body, so the query runs before it can compare', 'Server-Timing always lists every step, even skipped ones', 'Weak ETags force the server to rebuild the response twice', 'The If-None-Match header was ignored by the router'],
      ['304 from Express: 1,033 req/s (bytes saved, work not). A version ETag checked before the query: 9,112 req/s.', '304 của Express: 1.033 req/s (đỡ byte, không đỡ công). ETag phiên bản so trước truy vấn: 9.112 req/s.']),
    q('c2', ['Which Cache-Control fits GET /v2/bookings (each user’s own list)?', 'Cache-Control nào hợp với GET /v2/bookings (danh sách của riêng từng người)?'],
      ['private, no-cache', 'public, max-age=60', 'public, s-maxage=600', 'max-age=3600'],
      ['With public, the shared cache gave An’s bookings to Bình. private keeps shared caches out; no-cache forces revalidation with the ETag.', 'Với public, cache dùng chung đưa lượt đặt của An cho Bình. private chặn cache dùng chung; no-cache bắt kiểm lại bằng ETag.']),
    q('c3', ['After POST /v2/bookings, the old ETag came back with 200 and a new ETag "bookings-v1-…". What changed it?', 'Sau POST /v2/bookings, ETag cũ nhận 200 kèm ETag mới "bookings-v1-…". Cái gì làm nó đổi?'],
      ['The write called bump(“bookings”) and the version is part of the tag', 'The ETag expires after one minute', 'Express recomputed the weak hash of the body', 'The client sent a different Accept-Language'],
      ['Every write bumps the collection version, so every page’s ETag stops matching.', 'Mỗi lệnh ghi tăng phiên bản bộ sưu tập, nên ETag của mọi trang thôi khớp.']),
  ],
  goiY: [['Ask: when can the server compare?', 'Hỏi: server so được lúc nào?'], ['Ask: who may store this answer?', 'Hỏi: ai được lưu câu trả lời này?']],
  loi: [['Marking per-user data public.', 'Ghi dữ liệu riêng là public.'], ['Believing every 304 saves server work.', 'Tin rằng 304 nào cũng tiết kiệm công server.']],
  tns: [tn('Cache-Control', 'ai được lưu, lưu bao lâu'), tn('304 Not Modified', 'bản của bạn vẫn đúng')],
  kn: ['HTTP caching'],
});

function notModified(ifNoneMatch, etag) {
  if (!ifNoneMatch || !etag) return false;
  if (ifNoneMatch.trim() === '*') return true;
  const strip = (t) => t.trim().replace(/^W\//, '');
  return ifNoneMatch.split(',').map(strip).includes(strip(etag));
}
const E2 = jsBai({
  ten: 'HTTP caching 2 — Write notModified(ifNoneMatch, etag)', kho: 'EASY', phut: 10,
  en: `<p>Decide whether a GET may be answered with <code>304</code>. <code>If-None-Match</code> is a comma-separated list of entity tags, or <code>*</code> (matches any existing representation). Comparison for If-None-Match is <em>weak</em>: ignore a leading <code>W/</code> on either side. Missing header or missing ETag ⇒ <code>false</code>.</p>`,
  vi: `<p>Quyết định một GET có được trả <code>304</code> không. <code>If-None-Match</code> là danh sách nhãn cách nhau dấu phẩy, hoặc <code>*</code> (khớp mọi bản đang có). Phép so của If-None-Match là so <em>yếu</em>: bỏ qua tiền tố <code>W/</code> ở cả hai phía. Thiếu header hoặc thiếu ETag ⇒ <code>false</code>.</p>`,
  dauVao: ['ifNoneMatch — string | undefined; etag — string | undefined', 'ifNoneMatch — chuỗi | undefined; etag — chuỗi | undefined'],
  dauRa: ['true | false', 'true | false'],
  goiY: [['split(",") then trim each tag.', 'split(",") rồi trim từng nhãn.'], ['Remove W/ before comparing.', 'Bỏ W/ trước khi so.']],
  loi: [['Comparing the whole header string with the tag.', 'So cả chuỗi header với nhãn.'], ['Treating W/"x" and "x" as different for If-None-Match.', 'Coi W/"x" và "x" là khác nhau với If-None-Match.']],
  gt: ['RFC 9110 §13.1.2: If-None-Match uses the weak comparison. LabFlow’s early check makes the 304 cost 0.65 ms.', 'RFC 9110 §13.1.2: If-None-Match dùng phép so yếu. Bước so sớm của LabFlow làm 304 chỉ tốn 0,65 ms.'],
  kn: ['HTTP caching'],
  tns: [tn('weak comparison', 'so yếu: bỏ qua W/'), tn('entity tag', 'nhãn phiên bản')],
  dau: `/** may this GET be answered 304? */
function notModified(ifNoneMatch, etag) {
  // Write your solution here
  return ifNoneMatch === etag;
}
`,
  giai: '// Reference solution\n' + nguon(notModified),
  cases: [
    { goi: goi('notModified', '"bookings-v0-GIYXoq2-h6kTmHuH"', '"bookings-v0-GIYXoq2-h6kTmHuH"'), moTa: ['Same tag', 'Cùng nhãn'] },
    { goi: goi('notModified', '"a", "bookings-v1-x"', '"bookings-v1-x"'), moTa: ['A list of tags', 'Danh sách nhãn'] },
    { goi: goi('notModified', 'W/"8e4c-LH6b"', '"8e4c-LH6b"'), an: true },
    { goi: goi('notModified', '*', '"x"'), an: true },
    { goi: 'notModified(undefined, ' + JSON.stringify('"x"') + ')', an: true },
    { goi: goi('notModified', '"bookings-v0-a"', '"bookings-v1-a"'), an: true },
  ],
});

function sharedMayStore(cacheControl, hasAuthorization, status) {
  if (status !== 200) return false;
  const d = Object.fromEntries((cacheControl || '').split(',').map((x) => x.trim().toLowerCase().split('=')).filter(([k]) => k));
  if ('private' in d || 'no-store' in d || 'no-cache' in d) return false;
  const fresh = Number(d['s-maxage'] ?? d['max-age'] ?? 0) > 0;
  if (!fresh) return false;
  if (hasAuthorization && !('public' in d) && !('s-maxage' in d) && !('must-revalidate' in d)) return false;
  return true;
}
const E3 = jsBai({
  ten: 'HTTP caching 3 — Write sharedMayStore(cacheControl, hasAuthorization, status)', kho: 'MEDIUM', phut: 15,
  en: `<p>The rules of LabFlow’s <code>cache-proxy.mjs</code> (a simplified RFC 9111 shared cache). Store only a <code>200</code> whose <code>Cache-Control</code> gives a positive <code>s-maxage</code> or <code>max-age</code>, and does not contain <code>private</code>, <code>no-store</code> or <code>no-cache</code>. If the request carried <code>Authorization</code>, store only when the response also has <code>public</code>, <code>s-maxage</code> or <code>must-revalidate</code>. Directive names are case-insensitive.</p>`,
  vi: `<p>Luật của <code>cache-proxy.mjs</code> trong LabFlow (cache dùng chung RFC 9111 rút gọn). Chỉ lưu response <code>200</code> có <code>Cache-Control</code> cho <code>s-maxage</code> hoặc <code>max-age</code> dương, và không chứa <code>private</code>, <code>no-store</code> hay <code>no-cache</code>. Nếu request có <code>Authorization</code>, chỉ lưu khi response có thêm <code>public</code>, <code>s-maxage</code> hoặc <code>must-revalidate</code>. Tên chỉ thị không phân biệt hoa thường.</p>`,
  dauVao: ['cacheControl — string | undefined; hasAuthorization — boolean; status — number', 'cacheControl — chuỗi | undefined; hasAuthorization — boolean; status — số'],
  dauRa: ['true | false', 'true | false'],
  goiY: [['Parse "a, b=1" into { a: undefined, b: "1" }.', 'Tách "a, b=1" thành { a: undefined, b: "1" }.'], ['Check the Authorization rule last.', 'Xét luật Authorization sau cùng.']],
  loi: [['Storing anything with max-age even when the request had Authorization.', 'Lưu mọi thứ có max-age kể cả khi request có Authorization.'], ['Forgetting that public with Authorization IS storable — the leak of 9.1.', 'Quên rằng public kèm Authorization LÀ được lưu — chính chỗ rò rỉ của bài 9.1.']],
  gt: ['public, max-age=60 with Authorization ⇒ true: that is exactly how Bình received An’s bookings. private, no-cache ⇒ false.', 'public, max-age=60 kèm Authorization ⇒ true: đúng cách Bình nhận lượt đặt của An. private, no-cache ⇒ false.'],
  kn: ['HTTP caching', 'security'],
  tns: [tn('shared cache', 'cache dùng chung'), tn('s-maxage', 'thời hạn riêng cho cache dùng chung')],
  dau: `/** may a shared cache store this response? */
function sharedMayStore(cacheControl, hasAuthorization, status) {
  // Write your solution here
  return status === 200 && /max-age/.test(cacheControl || '');
}
`,
  giai: '// Reference solution\n' + nguon(sharedMayStore),
  cases: [
    { goi: goi('sharedMayStore', 'public, max-age=60', true, 200), moTa: ['The bug of lesson 9.1', 'Lỗi của bài 9.1'] },
    { goi: goi('sharedMayStore', 'private, no-cache', true, 200), moTa: ['The fix', 'Cách sửa'] },
    { goi: goi('sharedMayStore', 'max-age=60', true, 200), an: true },
    { goi: goi('sharedMayStore', 'max-age=60', false, 200), an: true },
    { goi: goi('sharedMayStore', 'PUBLIC, MAX-AGE=0', false, 200), an: true },
    { goi: goi('sharedMayStore', 's-maxage=30', true, 200), an: true },
    { goi: goi('sharedMayStore', 'public, max-age=60', false, 404), an: true },
  ],
});

export default doiDau({ slug: 'api-9-1-cache', ten: '9.1 HTTP caching: Cache-Control, ETag and 304', khoa: KHOA, baiHoc: 'api-9-1-cache', de: [E1, E2, E3] });
