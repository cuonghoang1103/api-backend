/**
 * Networking for Developers · Chương 8 (CDN và cache) — bộ luyện chương, gắn bài Lab 8 (netdev-8-5-lab-cdn-labflow).
 * Dữ liệu thật: lab/out/c81-hitmiss, c81-expire (MISS → HIT → EXPIRED sau TTL 30 s), c82-key (?v=1 / ?v=2 là hai mục),
 * c83-nuot (origin max-age=3600, biên hỏng no-store), c84-limit (504 khi origin chậm, 413 khi thân quá giới hạn).
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, ra, pre, cs, tinh, bang1, mt, q } from './_net.mjs';

const X = (tep) => ra(tep).split('\n').map((d) => d.replace(/\r$/, '')).filter((d) => /^X-Cache:/.test(d)).map((d) => d.split(': ')[1]);
const HM = X('c81-hitmiss'), EXP = X('c81-expire'), KEY = X('c82-key');
const NUOT = ra('c83-nuot').split('\n').map((d) => d.replace(/\r$/, '')).filter((d) => /^Cache-Control/.test(d));
const LIM = ra('c84-limit').split('\n').filter((d) => /->/.test(d) && !/^\$/.test(d));
if (HM.join() !== 'MISS,HIT,HIT' || EXP.join() !== 'MISS,HIT,EXPIRED' || KEY.join() !== 'MISS,HIT,MISS' || NUOT.length !== 2 || LIM.length !== 2) throw new Error('Ch8: output thật đổi — xem lại đề');

function edgeCache(requests, ttl, ignoreQuery) {
  var store = {}, out = [], origin = 0;
  requests.forEach(function (r) {
    var key = ignoreQuery ? r.url.split('?')[0] : r.url; // the cache key: path, plus the query unless told to ignore it
    var e = store[key], status;
    if (!e) status = 'MISS';
    else if (r.t - e.at >= ttl) status = 'EXPIRED';
    else status = 'HIT';
    if (status !== 'HIT') { store[key] = { at: r.t }; origin++; } // MISS and EXPIRED both go to the origin and store a fresh copy
    out.push(status);
  });
  var hits = out.filter(function (s) { return s === 'HIT'; }).length;
  return { statuses: out, originRequests: origin, hitRatio: out.length ? Math.round(hits / out.length * 100) : 0 };
}
const E1 = jsBai({
  ten: 'CDN 1 — Write edgeCache(requests, ttl, ignoreQuery): MISS, HIT, EXPIRED', kho: 'HARD', phut: 25,
  en: `<p>The Lab 8 edge printed, for real: <code>${HM.join(' → ')}</code> for three requests to <code>/img/logo.txt</code>; <code>${EXP.join(' → ')}</code> for <code>/</code> with a 31-second sleep before the third (TTL 30 s); and <code>${KEY.join(' → ')}</code> for <code>?v=1</code>, <code>?v=1</code>, <code>?v=2</code>.</p>
<p>Write <code>edgeCache(requests, ttl, ignoreQuery)</code>: <code>requests</code> is a list of <code>{ t, url }</code> (t in seconds, ascending). The cache key is the URL — or only the part before <code>?</code> when <code>ignoreQuery</code> is true. For each request: no entry ⇒ <code>MISS</code>; an entry stored at time <code>at</code> with <code>t − at ≥ ttl</code> ⇒ <code>EXPIRED</code>; otherwise <code>HIT</code>. MISS and EXPIRED fetch from the origin and store a fresh entry at <code>t</code>. Return <code>{ statuses, originRequests, hitRatio }</code> with hitRatio a whole percentage (rounded).</p>`,
  vi: `<p>Biên của Lab 8 in ra thật: <code>${HM.join(' → ')}</code> cho ba lần gọi <code>/img/logo.txt</code>; <code>${EXP.join(' → ')}</code> cho <code>/</code> khi nghỉ 31 giây trước lần thứ ba (TTL 30 giây); và <code>${KEY.join(' → ')}</code> cho <code>?v=1</code>, <code>?v=1</code>, <code>?v=2</code>.</p>
<p>Viết <code>edgeCache(requests, ttl, ignoreQuery)</code>: <code>requests</code> là danh sách <code>{ t, url }</code> (t tính bằng giây, tăng dần). Khoá cache là URL — hoặc chỉ phần trước <code>?</code> khi <code>ignoreQuery</code> là true. Với mỗi request: chưa có mục ⇒ <code>MISS</code>; có mục lưu lúc <code>at</code> và <code>t − at ≥ ttl</code> ⇒ <code>EXPIRED</code>; còn lại <code>HIT</code>. MISS và EXPIRED đều đi tới origin và lưu bản mới lúc <code>t</code>. Trả về <code>{ statuses, originRequests, hitRatio }</code> với hitRatio là phần trăm nguyên (làm tròn).</p>`,
  dau: 'function edgeCache(requests, ttl, ignoreQuery) {\n  return { statuses: [], originRequests: 0, hitRatio: 0 };\n}\n',
  giai: nguon(edgeCache),
  cases: [
    { goi: goi('edgeCache', [{ t: 0, url: '/' }, { t: 1, url: '/' }, { t: 33, url: '/' }], 30, false), moTa: ['Case 1: the real expiry run (TTL 30 s, 31 s sleep)', 'Ca 1: lần chạy hết hạn thật (TTL 30 giây, nghỉ 31 giây)'] },
    { goi: goi('edgeCache', [{ t: 0, url: '/img/logo.txt?v=1' }, { t: 1, url: '/img/logo.txt?v=1' }, { t: 2, url: '/img/logo.txt?v=2' }], 3600, false) },
    { goi: goi('edgeCache', [{ t: 0, url: '/img/logo.txt?v=1' }, { t: 1, url: '/img/logo.txt?v=1' }, { t: 2, url: '/img/logo.txt?v=2' }], 3600, true), an: true },
    { goi: goi('edgeCache', [{ t: 0, url: '/a?utm=x1' }, { t: 5, url: '/a?utm=x2' }, { t: 9, url: '/a?utm=x3' }, { t: 12, url: '/a?utm=x4' }], 60, false), an: true },
    { goi: goi('edgeCache', [{ t: 0, url: '/p' }, { t: 30, url: '/p' }, { t: 59, url: '/p' }, { t: 60, url: '/p' }], 30, false), an: true },
    { goi: goi('edgeCache', [], 30, false), an: true },
  ],
  goiY: [['Keep a map key → time stored; compute the key first.', 'Giữ một bảng khoá → thời điểm lưu; tính khoá trước.'], ['t − at ≥ ttl is EXPIRED: at exactly the TTL the copy is already stale.', 't − at ≥ ttl là EXPIRED: đúng bằng TTL là bản đã cũ.']],
  loi: [['Counting an EXPIRED as a HIT — it went to the origin.', 'Tính EXPIRED là HIT — nó đã đi tới origin.'], ['Forgetting that a tracking query (?utm=…) makes every request a new key.', 'Quên rằng query theo dõi (?utm=…) khiến mỗi request là một khoá mới.']],
  gt: ['The hit ratio is decided by the cache KEY as much as by the TTL. Four requests for the same page with four tracking queries are four MISSes — the origin pays for every one. Hashed, immutable filenames (app.3f9c2b.js) beat hand-edited ?v= and let you cache for a year.', 'Tỉ lệ trúng cache do KHOÁ cache quyết định chẳng kém gì TTL. Bốn request cho cùng một trang mang bốn query theo dõi là bốn MISS — origin trả giá cho từng cái. Tên tệp băm bất biến (app.3f9c2b.js) thắng kiểu sửa tay ?v= và cho phép cache cả năm.'],
  kn: ['cache key', 'TTL', 'hit ratio'],
});

const E2 = tinh({
  tieuDe: 'CDN 2 — Read Cache-Control like the edge does', doKho: 'MEDIUM', phut: 10,
  moTa: mt('For each header value, say whether a shared cache (a CDN edge) may store the response, and whether a browser must check with the server before reusing it.', 'Với mỗi giá trị header, cho biết cache dùng chung (biên CDN) có được lưu phản hồi không, và trình duyệt có phải hỏi lại server trước khi dùng lại không.'),
  loai: 'table',
  bang: [bang1('b1', ['Cache-Control values', 'Các giá trị Cache-Control'], [{ ma: 'v', ten: 'Value' }, { ma: 's', ten: 'CDN may store?', luaChon: ['yes', 'no'] }, { ma: 'r', ten: 'Must revalidate before each reuse?', luaChon: ['yes', 'no', 'nothing is stored'] }], [
    { o: { v: 'public, max-age=3600' }, a: { s: 'yes', r: 'no' } },
    { o: { v: 'no-store' }, a: { s: 'no', r: 'nothing is stored' } },
    { o: { v: 'no-cache' }, a: { s: 'yes', r: 'yes' } },
    { o: { v: 'private, max-age=600' }, a: { s: 'no', r: 'no' } },
    { o: { v: 'public, max-age=31536000, immutable' }, a: { s: 'yes', r: 'no' } },
  ], ['no-store forbids storing at all; no-cache allows storing but forces revalidation (an ETag round trip that can end in 304). private keeps the response in the browser only — right for per-user pages. immutable plus a year is for hashed filenames that never change.', 'no-store cấm lưu hẳn; no-cache cho lưu nhưng bắt kiểm lại (một vòng ETag có thể kết thúc bằng 304). private chỉ giữ ở trình duyệt — đúng cho trang riêng từng người. immutable cộng một năm dành cho tên tệp băm không bao giờ đổi.'])],
  goiY: ['no-cache does not mean "do not cache".', 'private = browser only; public = shared caches too.'],
  loiHayGap: ['Using no-cache when you meant no-store for sensitive data.', 'Serving a logged-in page with public and leaking it to the next user of the CDN.'],
  thuatNgu: [tn('shared cache', 'cache dùng chung'), tn('revalidate', 'kiểm lại')], khaiNiem: ['Cache-Control'],
});

const E3 = cs({
  ten: 'CDN 3 — The swallowed header, the timeout wall and the upload cap', kho: 'HARD', phut: 12,
  en: `Real Lab 8 output: origin vs broken edge ${pre(NUOT)} and the edge limits ${pre(LIM)}`,
  vi: `Kết xuất thật của Lab 8: origin so với biên hỏng ${pre(NUOT)} và giới hạn của biên ${pre(LIM)}`,
  cau: [
    q('c1', ['The origin sends max-age=3600 but users receive no-store. What is the most likely cause on the edge?', 'Origin gửi max-age=3600 nhưng người dùng nhận no-store. Nguyên nhân nhiều khả năng nhất ở biên là gì?'], ['The edge hides the header and adds its own no-store', 'The origin server\'s clock is running behind', 'The browser stripped the header on arrival', 'The CDN purges the whole cache every hour'], ['In nginx that is proxy_hide_header Cache-Control plus add_header Cache-Control "no-store" — the last layer to touch a header wins. Checking only the origin\'s config would never find it: curl the edge AND the origin and compare.', 'Trong nginx đó là proxy_hide_header Cache-Control cộng add_header Cache-Control "no-store" — lớp cuối cùng đụng vào header là lớp thắng. Chỉ đọc cấu hình origin thì không bao giờ tìm ra: curl cả biên lẫn origin rồi so.']),
    q('c2', ['A report endpoint takes 3 minutes and Cloudflare returns 524. What is the right redesign?', 'Một endpoint báo cáo chạy 3 phút và Cloudflare trả 524. Thiết kế lại đúng là gì?'], ['Return 202 Accepted with a status URL; run the job in a worker', 'Raise the proxy timeout to 10 minutes', 'Retry the request three times from the browser', 'Put the endpoint behind no-store'], ['The edge has a hard limit (around 100 s on Cloudflare). Raising your own timeout only moves the wall — answer quickly and let the client poll.', 'Biên có giới hạn cứng (khoảng 100 giây ở Cloudflare). Nâng timeout của mình chỉ dời bức tường — hãy trả lời nhanh và để client hỏi lại.']),
    q('c3', ['Uploading a 2 MB file returns 413 at the edge. What is the scalable fix?', 'Tải lên tệp 2 MB bị biên trả 413. Cách sửa mở rộng được là gì?'], ['Give the browser a presigned URL and upload straight to storage', 'Raise client_max_body_size to 1 GB everywhere', 'Compress the file with gzip first', 'Split the file and send it over WebSocket'], ['Large bodies should not stream through your origin at all. A presigned URL sends the bytes directly to object storage; only a small JSON touches your API.', 'Thân lớn không nên đi qua origin của bạn chút nào. URL ký sẵn gửi thẳng byte tới object storage; chỉ một JSON nhỏ chạm vào API.']),
    q('c4', ['You deploy a new app.js but users keep the old one for an hour. What avoids this for good?', 'Bạn deploy app.js mới nhưng người dùng vẫn giữ bản cũ suốt một giờ. Cái gì tránh được chuyện này lâu dài?'], ['Content-hashed filenames, so every change is a new URL', 'Purging the whole CDN after each deploy', 'Setting max-age=0 on every asset', 'Asking users to hard-refresh'], ['A new hash is a new cache key, so no purge is needed and old pages keep working with the files they reference. Purge-everything is a blunt tool that spikes origin load.', 'Băm mới là khoá cache mới, nên khỏi cần xoá cache và trang cũ vẫn chạy với tệp nó tham chiếu. Xoá toàn bộ là công cụ thô khiến tải lên origin vọt lên.']),
    q('c5', ['Which kind of response must never be cached by a shared CDN?', 'Loại phản hồi nào tuyệt đối không được để CDN dùng chung lưu?'], ['A page that contains one user\'s account data', 'A logo image with a hashed name', 'A public CSS file', 'A JavaScript bundle'], ['Cache a personal page publicly and the next visitor of that edge sees someone else\'s data — a real class of incident. Mark it private or no-store, and vary correctly if it must be cached.', 'Cache công khai một trang cá nhân là người kế tiếp ghé biên đó thấy dữ liệu của người khác — một loại sự cố có thật. Đánh dấu private hoặc no-store, và dùng Vary đúng nếu buộc phải cache.']),
  ],
  goiY: [['Always compare the edge response with the origin response.', 'Luôn so phản hồi ở biên với phản hồi ở origin.'], ['504/524 and 413 are walls of the edge: redesign around them.', '504/524 và 413 là tường của biên: thiết kế vòng qua chúng.']],
  loi: [['Raising every timeout and body limit instead of changing the design.', 'Nâng mọi timeout và giới hạn thân thay vì đổi thiết kế.'], ['Reading only the origin config when debugging cache headers.', 'Chỉ đọc cấu hình origin khi gỡ lỗi header cache.']],
  tns: [tn('origin', 'máy chủ gốc'), tn('edge / PoP', 'điểm biên của CDN'), tn('presigned URL', 'URL ký sẵn')], kn: ['CDN limits'],
});

export default doiDau({ slug: 'netdev-8-5-lab-cdn-labflow', ten: 'Lab 8 — Practice: cache keys, TTL and CDN limits', khoa: KHOA, baiHoc: 'netdev-8-5-lab-cdn-labflow', de: [E1, E2, E3] });
