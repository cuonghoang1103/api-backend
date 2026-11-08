/** Node.js 10.2 — Object storage và URL ký sẵn (MinIO đo thật: SignedHeaders=host, Content-Type và cỡ KHÔNG bị ràng buộc, HeadObject sau khi xong). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Object storage is not a filesystem; a presigned URL is not a policy', kho: 'EASY', phut: 10,
  en: 'From the lesson’s MinIO measurements: PutObject / HeadObject / Range, the anatomy of a presigned PUT, and the seven measurements of what the signature does and does not bind.',
  vi: 'Từ số đo MinIO của bài: PutObject / HeadObject / Range, giải phẫu một URL PUT ký sẵn, và bảy phép đo về những gì chữ ký ràng buộc và không ràng buộc.',
  cau: [
    q('o1', ['You want to "rename" <code>video/u7/a.mp4</code> (120 MB) to <code>video/u7/b.mp4</code>. What does object storage give you?', 'Bạn muốn "đổi tên" <code>video/u7/a.mp4</code> (120 MB) thành <code>video/u7/b.mp4</code>. Object storage cho bạn gì?'],
      ['No mv: a server-side copy to the new key, then a delete of the old one', 'A rename command that only changes the directory entry, in O(1)', 'A move inside the "u7" folder, since folders are real directories', 'Nothing: keys are immutable, the object must be uploaded again'],
      ['Keys are flat names; the slashes are part of the name. Renaming is copy + delete, and copying 120 MB costs a server-side copy.', 'Khoá là tên phẳng; dấu gạch chéo là một phần của tên. Đổi tên là chép + xoá, và chép 120 MB tốn một lần chép phía máy chủ.']),
    q('o2', ['<code>HeadObject</code> on a key that does not exist — what happens?', '<code>HeadObject</code> với một khoá không tồn tại — chuyện gì xảy ra?'],
      ['It throws NotFound (HTTP 404), so try/catch is mandatory around it', 'It returns an empty object with size 0', 'It returns null, like a database findUnique', 'It creates an empty placeholder object at that key'],
      ['Measured: "HEAD key không có → NotFound | HTTP 404". The "complete" endpoint relies on catching exactly this.', 'Đo được: "HEAD key không có → NotFound | HTTP 404". Endpoint "complete" dựa vào việc bắt đúng lỗi này.']),
    qn('o3', ['A presigned PUT was made with <code>getSignedUrl(…, { expiresIn: 3600 })</code> and default options. Which are protected by its signature? (choose all)', 'Một URL PUT ký sẵn tạo bằng <code>getSignedUrl(…, { expiresIn: 3600 })</code> với tuỳ chọn mặc định. Những gì được chữ ký bảo vệ? (chọn mọi câu đúng)'],
      ['The HTTP method', 'The bucket and the key', 'The deadline (date + expiry)', 'The Content-Type header', 'The size of the body', 'The body bytes'],
      [0, 1, 2],
      ['SignedHeaders = host and UNSIGNED-PAYLOAD: a text/html PUT to a .mp4 key succeeded, and a "5 MB" URL accepted 125,829,120 bytes. Editing the key gave SignatureDoesNotMatch; an expired URL gave AccessDenied.', 'SignedHeaders = host và UNSIGNED-PAYLOAD: PUT text/html vào khoá .mp4 thành công, và URL "5 MB" nhận 125.829.120 byte. Sửa khoá ra SignatureDoesNotMatch; URL hết hạn ra AccessDenied.']),
    q('o4', ['The presigned URL is pasted into a group chat. Someone on another machine, with no credentials, opens it. Result?', 'URL ký sẵn bị dán vào nhóm chat. Một người ở máy khác, không có thông tin xác thực nào, mở nó. Kết quả?'],
      ['It works (206 in the measurement): the URL IS the credential until it expires', 'It fails: the signature includes the IP of the machine that requested it', 'It fails: the browser must also send the session cookie of the site', 'It works only once: the first use invalidates the signature'],
      ['That is the mechanism and its risk in one sentence. Keep expiries short and scope the signing key to one prefix.', 'Đó là cơ chế và rủi ro của nó trong một câu. Giữ hạn ngắn và giới hạn khoá ký trong một tiền tố.']),
    q('o5', ['curl uploads with the presigned URL fine, but the browser shows an opaque "Network Error" while the storage log shows 200. Most likely cause?', 'curl upload bằng URL ký sẵn ổn, nhưng trình duyệt hiện "Network Error" mù mờ trong khi log storage báo 200. Nguyên nhân khả dĩ nhất?'],
      ['The bucket has no CORS rule allowing PUT from the site’s origin', 'The signature expired between curl and the browser test', 'The browser sends Content-Type, which breaks the host-only signature', 'R2 refuses uploads larger than 100 MB from browsers'],
      ['Failure (1) of the six: a preflight the bucket does not answer. It is the one piece of configuration that lives outside the code.', 'Lỗi (1) trong sáu lỗi: preflight mà bucket không trả lời. Đó là phần cấu hình duy nhất nằm ngoài code.']),
  ],
  goiY: [['Re-read X-Amz-SignedHeaders and X-Amz-Content-Sha256 in the URL anatomy.', 'Đọc lại X-Amz-SignedHeaders và X-Amz-Content-Sha256 trong phần giải phẫu URL.'], ['Measurement 6 lists what the signature DOES protect; 4 and 5 list what it does not.', 'Phép đo 6 liệt kê điều chữ ký CÓ bảo vệ; 4 và 5 liệt kê điều nó không bảo vệ.']],
  loi: [['Believing the ContentType you passed to PutObjectCommand is enforced.', 'Tin rằng ContentType truyền vào PutObjectCommand được áp đặt.'], ['Trusting the size the client declared before signing.', 'Tin cỡ client khai trước khi ký.']],
  tns: [tn('object storage', 'lưu trữ đối tượng', 'kho phẳng truy cập qua HTTP: bucket + key'), tn('presigned URL', 'URL ký sẵn', 'một thao tác được ký trước, chữ ký nằm trong query'), tn('SignedHeaders', 'header được ký', 'danh sách header chữ ký bao phủ')],
  kn: ['object storage', 'presigned URLs'],
});

/* ─── 2. EASY · js — thiết kế khoá ─── */
function buildKey(family, filename, { userId, kind, now, rand }) {
  // Only the LAST extension, lower-cased, and only if it looks like one — the user's name itself never enters the key.
  const m = /(\.[A-Za-z0-9]{1,5})$/.exec(String(filename));
  const ext = m ? m[1].toLowerCase() : '';
  const parts = [family];
  if (kind) parts.push(kind);           // images/post/…, images/avatar/…
  parts.push('u' + userId);             // ownership checkable without a DB round trip
  parts.push(now + '-' + rand + ext);   // sortable by time, unguessable, collision-free
  return parts.join('/');
}

function keyBelongsToUser(key, userId) {
  if (String(key).includes('..')) return false;
  // "/u7/" with BOTH slashes: a startsWith("…/u7") check would also accept u70, u71…
  return new RegExp('^(images|audio|video|documents)/(?:[a-z-]+/)?u' + userId + '/\\d{13}-[0-9a-f]{12}(\\.[a-z0-9]{1,5})?$').test(String(key));
}

const E2 = jsBai({
  ten: 'Build the key: family, owner, time, randomness — never the filename', kho: 'EASY', phut: 12,
  en: `<p>This project’s rule (<code>src/storage/keys.ts</code>): <code>images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</code> = family / kind / <code>u&lt;userId&gt;</code> / <code>Date.now()-&lt;12 hex&gt;</code> + extension. "Notice what is not in there: the original filename." Write:</p>
<ul><li><code>buildKey(family, filename, { userId, kind, now, rand })</code> — join with <code>/</code>: <code>family</code>, then <code>kind</code> only if given, then <code>u&lt;userId&gt;</code>, then <code>&lt;now&gt;-&lt;rand&gt;&lt;ext&gt;</code>, where <code>ext</code> is the <b>last</b> extension of <code>filename</code> lower-cased if it matches <code>/\\.[A-Za-z0-9]{1,5}$/</code>, otherwise empty;</li>
<li><code>keyBelongsToUser(key, userId)</code> — <code>true</code> only if the key contains no <code>..</code> and matches <code>family/(kind/)?u&lt;userId&gt;/&lt;13 digits&gt;-&lt;12 hex&gt;(ext)?</code> with family in images|audio|video|documents and kind made of <code>a-z</code> and <code>-</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Luật của dự án (<code>src/storage/keys.ts</code>): <code>images/post/u7/1753660000000-a1b2c3d4e5f6.jpg</code> = họ / loại / <code>u&lt;userId&gt;</code> / <code>Date.now()-&lt;12 hex&gt;</code> + đuôi. "Để ý thứ KHÔNG có ở đó: tên file gốc." Viết:</p>
<ul><li><code>buildKey(family, filename, { userId, kind, now, rand })</code> — nối bằng <code>/</code>: <code>family</code>, rồi <code>kind</code> nếu có, rồi <code>u&lt;userId&gt;</code>, rồi <code>&lt;now&gt;-&lt;rand&gt;&lt;ext&gt;</code>, với <code>ext</code> là đuôi <b>cuối cùng</b> của <code>filename</code> viết thường nếu khớp <code>/\\.[A-Za-z0-9]{1,5}$/</code>, không thì rỗng;</li>
<li><code>keyBelongsToUser(key, userId)</code> — <code>true</code> chỉ khi khoá không chứa <code>..</code> và khớp <code>family/(kind/)?u&lt;userId&gt;/&lt;13 chữ số&gt;-&lt;12 hex&gt;(ext)?</code> với family thuộc images|audio|video|documents và kind gồm <code>a-z</code> và <code>-</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Take the extension with a regex anchored at the end: <code>/(\\.[A-Za-z0-9]{1,5})$/</code>.', 'Lấy đuôi bằng regex neo ở cuối: <code>/(\\.[A-Za-z0-9]{1,5})$/</code>.'], ['For ownership, the segment is <code>/u7/</code> — with the slash after it.', 'Với quyền sở hữu, đoạn là <code>/u7/</code> — có dấu gạch chéo phía sau.']],
  loi: [['Putting the user’s filename in the key: <code>../</code>, emoji, 300 characters, or the sender’s real name end up in your bucket.', 'Đưa tên file của người dùng vào khoá: <code>../</code>, emoji, 300 ký tự, hay tên thật của người gửi nằm trong bucket.'], ['<code>key.startsWith("video/u7")</code> — user 70 owns <code>video/u70/…</code> and passes.', '<code>key.startsWith("video/u7")</code> — người dùng 70 sở hữu <code>video/u70/…</code> và lọt qua.'], ['Taking the first extension: <code>evil.php.png</code> is named .png, and only the last dot counts (and only for naming).', 'Lấy đuôi đầu tiên: <code>evil.php.png</code> mang tên .png, và chỉ dấu chấm cuối mới tính (và chỉ để đặt tên).']],
  gt: ['The key is the only index object storage gives you, so every segment earns its place: the family prefix for lifecycle rules and cost reports, <code>u&lt;id&gt;</code> for an ownership check that is a regex instead of a query, the timestamp for ordering, the random bytes against collisions and guessing. Anchoring the regex at both ends and requiring the slash after <code>u&lt;id&gt;</code> is what stops u70 from passing as u7.', 'Khoá là chỉ mục duy nhất object storage cho bạn, nên mỗi đoạn đều có lý do: tiền tố họ cho luật vòng đời và báo cáo chi phí, <code>u&lt;id&gt;</code> cho phép kiểm quyền sở hữu bằng regex thay vì truy vấn, dấu thời gian để sắp xếp, byte ngẫu nhiên chống trùng và chống đoán. Neo regex hai đầu và bắt buộc dấu gạch chéo sau <code>u&lt;id&gt;</code> là thứ chặn u70 giả làm u7.'],
  kn: ['object storage', 'key design'],
  tns: [tn('key', 'khoá đối tượng', 'tên đầy đủ của object trong bucket'), tn('prefix', 'tiền tố', 'phần đầu của khoá, dùng để liệt kê và đặt luật')],
  dau: `/** Build an object key from trusted parts only. */
function buildKey(family, filename, { userId, kind, now, rand }) {
  // Write your solution here
  return family + '/' + (kind ? kind + '/' : '') + 'u' + userId + '/' + now + '-' + filename;
}

/** Does this key belong to the user? */
function keyBelongsToUser(key, userId) {
  return key.includes('/u' + userId);
}
`,
  giai: '// Reference solution\n' + nguon(buildKey, keyBelongsToUser),
  cases: [
    { goi: `buildKey('images', 'IMG_0001.JPG', { userId: 7, kind: 'post', now: 1753660000000, rand: 'a1b2c3d4e5f6' })`, moTa: ['The lesson’s key', 'Khoá của bài'] },
    { goi: `buildKey('video', '../../etc/cron.d/x', { userId: 7, now: 1753660001234, rand: 'deadbeef1234' })`, moTa: ['A traversal filename leaves no trace', 'Tên file vượt thư mục không để lại dấu vết'] },
    { goi: `[keyBelongsToUser('images/post/u7/1753660000000-a1b2c3d4e5f6.jpg', 7), keyBelongsToUser('images/post/u70/1753660000000-a1b2c3d4e5f6.jpg', 7)]`, moTa: ['u7 vs u70', 'u7 so với u70'] },
    { goi: `[buildKey('documents', 'evil.php.PNG', { userId: 3, now: 1, rand: 'ff' }), buildKey('audio', 'voice note', { userId: 3, now: 2, rand: 'ee' }), buildKey('images', 'x.jpeg2000', { userId: 3, kind: 'avatar', now: 3, rand: 'dd' })]`, an: true },
    { goi: `[keyBelongsToUser('video/u7/1753660001234-deadbeef1234.mp4', 7), keyBelongsToUser('video/u7/../u1/1753660001234-deadbeef1234.mp4', 7), keyBelongsToUser('video/u7/anh-cua-nguoi-khac.mp4', 7), keyBelongsToUser('backup/u7/1753660001234-deadbeef1234.mp4', 7), keyBelongsToUser('xvideo/u7/1753660001234-deadbeef1234', 7)]`, an: true },
    { goi: `(() => { const k = buildKey('images', 'cat.webp', { userId: 12, kind: 'post', now: 1753660000000, rand: '0123456789ab' }); return [k, keyBelongsToUser(k, 12), keyBelongsToUser(k, 1)]; })()`, an: true },
  ],
});

/* ─── 3. MEDIUM · js — giải phẫu một URL ký sẵn ─── */
function parsePresigned(url, nowMs) {
  const u = new URL(url);
  const p = u.searchParams;                            // decodes %2F in X-Amz-Credential for us
  const d = p.get('X-Amz-Date');                       // 20260727T181933Z — basic ISO 8601, UTC
  const signedAt = Date.UTC(+d.slice(0, 4), +d.slice(4, 6) - 1, +d.slice(6, 8), +d.slice(9, 11), +d.slice(11, 13), +d.slice(13, 15));
  const expiresAt = signedAt + Number(p.get('X-Amz-Expires')) * 1000;
  const signedHeaders = String(p.get('X-Amz-SignedHeaders') || '').split(';').filter(Boolean);
  return {
    path: decodeURIComponent(u.pathname),
    operation: p.get('x-id'),
    credential: p.get('X-Amz-Credential'),
    signedHeaders,
    bindsContentType: signedHeaders.includes('content-type'),        // measurement 4: false ⇒ text/html can be PUT
    bodySigned: p.get('X-Amz-Content-Sha256') !== 'UNSIGNED-PAYLOAD', // measurement 5: the size is not bound either
    expiresAt: new Date(expiresAt).toISOString(),
    expired: nowMs >= expiresAt,
  };
}

const URL1 = 'http://127.0.0.1:9010/ct-lab/video/u7/1753660001234-deadbeef1234.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=labkey%2F20260727%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260727T181933Z&X-Amz-Expires=3600&X-Amz-Signature=41e5936343ce772fa35d591d5e43a31fa61dfb632f634d4ccc7ea5de774d5336&X-Amz-SignedHeaders=host&x-id=PutObject';
const URL2 = 'https://acc.r2.cloudflarestorage.com/cuongthai-media/video/u7/1753660009999-0a0b0c0d0e0f.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=r2key%2F20261108%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20261108T235930Z&X-Amz-Expires=600&X-Amz-Signature=aa&X-Amz-SignedHeaders=content-type%3Bhost&x-id=PutObject';
const E3 = jsBai({
  ten: 'Decode a presigned URL and say what it binds', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson’s practice: "decode the presigned URL and name each query parameter". Write <code>parsePresigned(url, nowMs)</code> → <code>{ path, operation, credential, signedHeaders, bindsContentType, bodySigned, expiresAt, expired }</code>:</p>
<ul><li><code>path</code>: the decoded pathname; <code>operation</code>: <code>x-id</code>; <code>credential</code>: <code>X-Amz-Credential</code> decoded (<code>labkey/20260727/auto/s3/aws4_request</code>);</li>
<li><code>signedHeaders</code>: <code>X-Amz-SignedHeaders</code> split on <code>;</code>; <code>bindsContentType</code>: whether it contains <code>content-type</code>; <code>bodySigned</code>: <code>X-Amz-Content-Sha256 !== 'UNSIGNED-PAYLOAD'</code>;</li>
<li><code>expiresAt</code>: ISO string of <code>X-Amz-Date</code> (format <code>YYYYMMDDTHHMMSSZ</code>, UTC) + <code>X-Amz-Expires</code> seconds; <code>expired</code>: <code>nowMs &gt;= expiresAt</code>.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Bài thực hành: "giải mã URL ký sẵn và gọi tên từng tham số query". Viết <code>parsePresigned(url, nowMs)</code> → <code>{ path, operation, credential, signedHeaders, bindsContentType, bodySigned, expiresAt, expired }</code>:</p>
<ul><li><code>path</code>: pathname đã giải mã; <code>operation</code>: <code>x-id</code>; <code>credential</code>: <code>X-Amz-Credential</code> đã giải mã (<code>labkey/20260727/auto/s3/aws4_request</code>);</li>
<li><code>signedHeaders</code>: <code>X-Amz-SignedHeaders</code> tách theo <code>;</code>; <code>bindsContentType</code>: có chứa <code>content-type</code> không; <code>bodySigned</code>: <code>X-Amz-Content-Sha256 !== 'UNSIGNED-PAYLOAD'</code>;</li>
<li><code>expiresAt</code>: chuỗi ISO của <code>X-Amz-Date</code> (dạng <code>YYYYMMDDTHHMMSSZ</code>, UTC) cộng <code>X-Amz-Expires</code> giây; <code>expired</code>: <code>nowMs &gt;= expiresAt</code>.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['<code>new URL(url).searchParams.get(name)</code> already decodes <code>%2F</code> and <code>%3B</code>.', '<code>new URL(url).searchParams.get(name)</code> đã giải mã sẵn <code>%2F</code> và <code>%3B</code>.'], ['Cut the date with <code>slice</code> and build it with <code>Date.UTC(y, m - 1, d, h, mi, s)</code> — months start at 0.', 'Cắt ngày bằng <code>slice</code> và dựng bằng <code>Date.UTC(y, m - 1, d, h, mi, s)</code> — tháng bắt đầu từ 0.']],
  loi: [['<code>new Date("20260727T181933Z")</code> — the basic format is not something Date parses: Invalid Date.', '<code>new Date("20260727T181933Z")</code> — dạng cơ bản này Date không đọc được: Invalid Date.'], ['Using local time instead of UTC: the deadline shifts by your timezone offset (7 hours in Vietnam).', 'Dùng giờ địa phương thay vì UTC: hạn chót lệch đúng múi giờ (7 tiếng ở Việt Nam).'], ['Reading <code>SignedHeaders=host</code> as "secure enough" — it means Content-Type is NOT bound.', 'Đọc <code>SignedHeaders=host</code> là "đủ an toàn" — nghĩa là Content-Type KHÔNG bị ràng buộc.']],
  gt: ['Every promise a presigned URL makes is written in its query string. Reading it tells you the operation, who signed it (credential scope), until when, and — the expensive line — which headers are covered. <code>signedHeaders: ["host"]</code> plus <code>bodySigned: false</code> is exactly the configuration that let a text/html body and a 120 MB body through in measurements 4 and 5.', 'Mọi lời hứa của một URL ký sẵn đều viết trong query string. Đọc nó biết được thao tác, ai ký (phạm vi credential), tới khi nào, và — dòng đắt nhất — header nào được bao phủ. <code>signedHeaders: ["host"]</code> cộng <code>bodySigned: false</code> chính là cấu hình đã cho một thân text/html và một thân 120 MB lọt qua ở phép đo 4 và 5.'],
  kn: ['presigned URLs', 'URL parsing', 'dates'],
  tns: [tn('X-Amz-Expires', 'thời hạn (giây)', 'tính từ X-Amz-Date'), tn('UNSIGNED-PAYLOAD', 'thân không được ký', 'chữ ký không bao phủ nội dung/kích thước')],
  dau: `/** Decode a presigned S3/R2 URL. */
function parsePresigned(url, nowMs) {
  // Write your solution here
  const u = new URL(url);
  const p = u.searchParams;
  const expiresAt = new Date(p.get('X-Amz-Date')).getTime() + Number(p.get('X-Amz-Expires'));
  return { path: u.pathname, operation: p.get('x-id'), credential: p.get('X-Amz-Credential'), signedHeaders: [p.get('X-Amz-SignedHeaders')],
    bindsContentType: false, bodySigned: true, expiresAt: String(expiresAt), expired: nowMs > expiresAt };
}
`,
  giai: '// Reference solution\n' + nguon(parsePresigned),
  cases: [
    { goi: `parsePresigned(${JSON.stringify(URL1)}, Date.UTC(2026, 6, 27, 18, 20, 0))`, moTa: ['The lesson’s 438-character URL', 'URL 438 ký tự của bài'] },
    { goi: `parsePresigned(${JSON.stringify(URL1)}, Date.UTC(2026, 6, 27, 19, 19, 33)).expired`, moTa: ['Exactly at the deadline', 'Đúng hạn chót'] },
    { goi: `parsePresigned(${JSON.stringify(URL2)}, Date.UTC(2026, 10, 9, 0, 5, 0))`, moTa: ['This site’s video URL: content-type signed, 600 s, across midnight', 'URL video của site: có ký content-type, 600 s, qua nửa đêm'] },
    { goi: `[parsePresigned(${JSON.stringify(URL2)}, Date.UTC(2026, 10, 9, 0, 9, 29)).expired, parsePresigned(${JSON.stringify(URL2)}, Date.UTC(2026, 10, 9, 0, 9, 31)).expired, parsePresigned(${JSON.stringify(URL2.replace('UNSIGNED-PAYLOAD', 'e3b0c44298fc1c149afbf4c8996fb924'))}, 0).bodySigned]`, an: true },
    { goi: `parsePresigned('https://s3.example/b/docs/u2/1753660000000-abcdefabcdef.pdf?X-Amz-Date=20261231T235959Z&X-Amz-Expires=1&X-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=k%2F20261231%2Fauto%2Fs3%2Faws4_request&x-id=GetObject', Date.UTC(2027, 0, 1))`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — endpoint "complete": đừng tin, hãy HeadObject ─── */
async function completeUpload({ key }, user, { s3, db, maxSize, now }) {
  // 1) The key is input: validate its shape before using it anywhere.
  if (typeof key !== 'string' || !/^video\/[\w./-]+$/.test(key) || key.includes('..')) return { status: 400, body: { error: 'INVALID_KEY' } };
  // 2) …and its owner: the u<id> segment was put there by buildKey, so it can be checked without the database.
  if (!key.startsWith('video/u' + user.id + '/')) return { status: 403, body: { error: 'NOT_YOUR_KEY' } };
  // 3) Did the upload really happen? A client can skip it and still call "complete".
  let head;
  try {
    head = await s3.head(key);
  } catch (err) {
    if (err && err.name === 'NotFound') return { status: 404, body: { error: 'NOT_UPLOADED' } };
    throw err;                                         // storage down is OUR problem: let it become a 500
  }
  // 4) The signature did not bind size or type: check what actually landed, and delete what we refuse.
  if (head.size > maxSize) { await s3.del(key); return { status: 413, body: { error: 'TOO_LARGE', size: head.size } }; }
  if (!/^video\//.test(String(head.contentType))) { await s3.del(key); return { status: 415, body: { error: 'NOT_A_VIDEO' } }; }
  // 5) Only now write the row — with a 24 h TTL so a nightly sweep can delete objects of posts never finished.
  await db.createPending({ key, userId: user.id, size: head.size, expiresAt: now + 24 * 3600 * 1000 });
  return { status: 201, body: { key, size: head.size } };
}

const S3 = String.raw`
function makeS3(objects) {
  const s = { objects: { ...objects }, deleted: [], heads: 0, down: false };
  s.head = async (key) => { s.heads++; await new Promise((r) => setTimeout(r, 4)); if (s.down) throw Object.assign(new Error('connect ETIMEDOUT'), { name: 'TimeoutError' }); const o = s.objects[key]; if (!o) throw Object.assign(new Error('NotFound'), { name: 'NotFound', $metadata: { httpStatusCode: 404 } }); return { ...o }; };
  s.del = async (key) => { s.deleted.push(key); delete s.objects[key]; };
  return s;
}
function makeDb() { const d = { rows: [] }; d.createPending = async (row) => { d.rows.push(row); return row; }; return d; }
const K = 'video/u7/1753660001234-deadbeef1234.mp4';
const MB = 1024 * 1024;
const NOW = 1753660100000;
`;

const E4 = jsBai({
  ten: 'The "complete" call: HeadObject, then decide', kho: 'MEDIUM', phut: 20,
  en: `<p>Failure (5): "trusting the complete call — if you do not HeadObject, a client can skip the upload entirely and still get a database row pointing at nothing." And measurement 5: a "5 MB" URL accepted 125,829,120 bytes. Write <code>async completeUpload({ key }, user, { s3, db, maxSize, now })</code> → <code>{ status, body }</code>, like this site’s <code>POST /upload/presign-r2/complete</code>:</p>
<ol><li><code>key</code> must be a string matching <code>/^video\\/[\\w./-]+$/</code> and contain no <code>..</code> → else 400 <code>{ error:'INVALID_KEY' }</code>;</li>
<li>it must start with <code>video/u&lt;user.id&gt;/</code> → else 403 <code>{ error:'NOT_YOUR_KEY' }</code>;</li>
<li><code>head = await s3.head(key)</code>; an error named <code>NotFound</code> → 404 <code>{ error:'NOT_UPLOADED' }</code>; any other error is re-thrown;</li>
<li><code>head.size &gt; maxSize</code> → <code>await s3.del(key)</code>, 413 <code>{ error:'TOO_LARGE', size }</code>; <code>head.contentType</code> not <code>video/…</code> → delete, 415 <code>{ error:'NOT_A_VIDEO' }</code>;</li>
<li>otherwise <code>await db.createPending({ key, userId, size, expiresAt: now + 24 h })</code> → 201 <code>{ key, size }</code>.</li></ol>${MOI_TRUONG.en}`,
  vi: `<p>Lỗi (5): "tin vào lời gọi complete — không HeadObject thì client có thể bỏ qua hẳn bước upload mà vẫn có một dòng CSDL trỏ vào hư không." Và phép đo 5: URL "5 MB" nhận 125.829.120 byte. Viết <code>async completeUpload({ key }, user, { s3, db, maxSize, now })</code> → <code>{ status, body }</code>, như <code>POST /upload/presign-r2/complete</code> của site này:</p>
<ol><li><code>key</code> phải là chuỗi khớp <code>/^video\\/[\\w./-]+$/</code> và không chứa <code>..</code> → không thì 400 <code>{ error:'INVALID_KEY' }</code>;</li>
<li>nó phải bắt đầu bằng <code>video/u&lt;user.id&gt;/</code> → không thì 403 <code>{ error:'NOT_YOUR_KEY' }</code>;</li>
<li><code>head = await s3.head(key)</code>; lỗi tên <code>NotFound</code> → 404 <code>{ error:'NOT_UPLOADED' }</code>; lỗi khác ném lại;</li>
<li><code>head.size &gt; maxSize</code> → <code>await s3.del(key)</code>, 413 <code>{ error:'TOO_LARGE', size }</code>; <code>head.contentType</code> không phải <code>video/…</code> → xoá, 415 <code>{ error:'NOT_A_VIDEO' }</code>;</li>
<li>còn lại <code>await db.createPending({ key, userId, size, expiresAt: now + 24 giờ })</code> → 201 <code>{ key, size }</code>.</li></ol>${MOI_TRUONG.vi}`,
  goiY: [['Do the cheap checks (shape, owner) before the network call.', 'Làm các phép kiểm rẻ (hình dạng, chủ sở hữu) trước lời gọi mạng.'], ['<code>try { head = await s3.head(key) } catch (err) { if (err.name === "NotFound") … ; throw err; }</code>', '<code>try { head = await s3.head(key) } catch (err) { if (err.name === "NotFound") … ; throw err; }</code>'], ['Use the size from <code>head</code>, never a size the client sent.', 'Dùng cỡ từ <code>head</code>, không bao giờ dùng cỡ client gửi.']],
  loi: [['Writing the row first and checking later: a crash in between leaves a row pointing at nothing.', 'Ghi dòng trước rồi mới kiểm: sập giữa chừng để lại một dòng trỏ vào hư không.'], ['Rejecting an oversized object without deleting it — you keep paying for 120 MB nobody can see.', 'Từ chối object quá cỡ mà không xoá — bạn vẫn trả tiền cho 120 MB không ai thấy.'], ['Turning every head() error into 404: a storage timeout is not "you did not upload".', 'Biến mọi lỗi head() thành 404: storage hết giờ không phải "bạn chưa upload".']],
  gt: ['A presigned PUT bypasses your server, so the "complete" call is the first moment your code sees the upload — and it must judge what actually landed, not what was promised. HeadObject is cheap (3.9 ms measured) and returns the real size and type; refusing means deleting, because storage has no foreign keys. Validating the key shape and owner first means a client cannot make you HEAD — or delete — someone else’s object.', 'PUT ký sẵn đi vòng qua máy chủ, nên lời gọi "complete" là lúc đầu tiên code của bạn thấy upload — và nó phải xét thứ đã thật sự tới, không phải thứ đã hứa. HeadObject rẻ (đo 3,9 ms) và trả về cỡ, kiểu thật; từ chối nghĩa là xoá, vì storage không có khoá ngoại. Kiểm hình dạng khoá và chủ sở hữu trước nghĩa là client không thể bắt bạn HEAD — hay xoá — object của người khác.'],
  kn: ['presigned URLs', 'validation', 'object storage'],
  tns: [tn('HeadObject', 'đọc siêu dữ liệu', 'lấy cỡ + kiểu mà không tải thân'), tn('TTL', 'thời gian sống', 'hạn để dọn bản ghi bỏ dở')],
  fakes: S3,
  dau: `/** POST /upload/presign-r2/complete */
async function completeUpload({ key }, user, { s3, db, maxSize, now }) {
  // Write your solution here
  await db.createPending({ key, userId: user.id, size: 0, expiresAt: now + 24 * 3600 * 1000 });
  return { status: 201, body: { key, size: 0 } };
}
`,
  giai: '// Reference solution\n' + nguon(completeUpload),
  cases: [
    { goi: 'await (async () => { const s3 = makeS3({ [K]: { size: 118 * MB, contentType: "video/mp4" } }), db = makeDb(); const r = await completeUpload({ key: K }, { id: 7 }, { s3, db, maxSize: 150 * MB, now: NOW }); return [r, db.rows]; })()', moTa: ['A 118 MB video that really landed', 'Video 118 MB đã thật sự tới'] },
    { goi: 'await (async () => { const s3 = makeS3({}), db = makeDb(); const r = await completeUpload({ key: K }, { id: 7 }, { s3, db, maxSize: 150 * MB, now: NOW }); return [r, db.rows.length]; })()', moTa: ['The client skipped the upload', 'Client bỏ qua bước upload'] },
    { goi: 'await (async () => { const s3 = makeS3({ [K]: { size: 125829120, contentType: "video/mp4" } }), db = makeDb(); const r = await completeUpload({ key: K }, { id: 7 }, { s3, db, maxSize: 5 * MB, now: NOW }); return [r, s3.deleted, db.rows.length]; })()', moTa: ['Declared 5 MB, sent 120 MB', 'Khai 5 MB, gửi 120 MB'] },
    { goi: 'await (async () => { const s3 = makeS3({ [K]: { size: 39, contentType: "text/html" } }), db = makeDb(); const a = await completeUpload({ key: K }, { id: 7 }, { s3, db, maxSize: 150 * MB, now: NOW }); const b = await completeUpload({ key: "video/u70/1753660001234-deadbeef1234.mp4" }, { id: 7 }, { s3, db, maxSize: 150 * MB, now: NOW }); return [a, b, s3.deleted, s3.heads]; })()', an: true },
    { goi: 'await (async () => { const s3 = makeS3({}), db = makeDb(); const out = []; for (const key of ["images/u7/x.jpg", "video/u7/../u1/a.mp4", "video/u7/a b.mp4", 42, undefined]) out.push(await completeUpload({ key }, { id: 7 }, { s3, db, maxSize: 1, now: NOW })); return [out, s3.heads]; })()', an: true },
    { goi: 'await (async () => { const s3 = makeS3({ [K]: { size: 1, contentType: "video/mp4" } }); s3.down = true; try { await completeUpload({ key: K }, { id: 7 }, { s3, db: makeDb(), maxSize: 150 * MB, now: NOW }); return "no throw"; } catch (e) { return e.name; } })()', an: true },
  ],
});

/* ─── 5. HARD · js — phía storage: kiểm một URL ký sẵn ─── */
function verifyPresigned(req, secret, nowMs) {
  const u = new URL(req.url);
  const p = u.searchParams;
  const date = p.get('X-Amz-Date'), expires = p.get('X-Amz-Expires'), list = p.get('X-Amz-SignedHeaders'), sig = p.get('X-Amz-Signature');
  if (!date || !expires || !list || !sig) return { status: 400, code: 'AuthorizationQueryParametersError' };
  const names = list.split(';');
  const headers = {};
  for (const k of Object.keys(req.headers || {})) headers[k.toLowerCase()] = String(req.headers[k]).trim();
  // Rebuild the exact text that was signed. Only the SIGNED headers enter it — any other header is invisible.
  const canonical = [
    req.method.toUpperCase(),
    decodeURIComponent(u.pathname),
    'X-Amz-Date=' + date,
    'X-Amz-Expires=' + expires,
    'SignedHeaders=' + list,
    ...names.map((h) => h + ':' + (headers[h] ?? '')),
  ].join('\n');
  // 1) Signature FIRST: the date and expiry are only trustworthy once we know nobody edited them.
  const want = hmac(secret, canonical);
  let diff = want.length ^ sig.length;
  for (let i = 0; i < want.length; i++) diff |= want.charCodeAt(i) ^ (sig.charCodeAt(i) || 0);   // constant time
  if (diff !== 0) return { status: 403, code: 'SignatureDoesNotMatch' };
  // 2) Then the deadline, now that it is known to be genuine.
  const signedAt = Date.UTC(+date.slice(0, 4), +date.slice(4, 6) - 1, +date.slice(6, 8), +date.slice(9, 11), +date.slice(11, 13), +date.slice(13, 15));
  if (nowMs > signedAt + Number(expires) * 1000) return { status: 403, code: 'AccessDenied', message: 'Request has expired' };
  return { status: 200 };
}

const SIGN = String.raw`
// toy HMAC (NOT cryptography — just a deterministic keyed hash so the browser needs no crypto)
globalThis.hmac = function hmac(secret, text) { let h1 = 0x811c9dc5, h2 = 0x01000193; const s = secret + '\u0000' + text; for (let i = 0; i < s.length; i++) { h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619) >>> 0; h2 = Math.imul(h2 + s.charCodeAt(i), 2246822519) >>> 0; } return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0'); };
// the SIGNER (what getSignedUrl does): same canonical text as the verifier must rebuild
function amzDate(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
function presign({ method, key, expiresIn, signHeaders }, secret, nowMs) {
  const host = 'r2.example', path = '/ct-lab/' + key, date = amzDate(nowMs);
  const hs = Object.assign({ host }, signHeaders || {}); const names = Object.keys(hs).map((x) => x.toLowerCase()).sort(); const list = names.join(';');
  const canonical = [method, path, 'X-Amz-Date=' + date, 'X-Amz-Expires=' + expiresIn, 'SignedHeaders=' + list, ...names.map((h) => h + ':' + String(hs[h]).trim())].join('\n');
  return 'https://' + host + path + '?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=' + date + '&X-Amz-Expires=' + expiresIn + '&X-Amz-SignedHeaders=' + encodeURIComponent(list) + '&X-Amz-Signature=' + hmac(secret, canonical);
}
const SECRET = 'r2-signing-key';
const T0 = Date.UTC(2026, 6, 27, 18, 19, 33);
const KEY = 'video/u7/1753660001234-deadbeef1234.mp4';
`;

const E5 = jsBai({
  ten: 'Be the storage server: verify a presigned request', kho: 'HARD', phut: 30,
  en: `<p>To own the mental model — "the method, the key and the deadline are signed; the body, the size, and every header you did not name are not" — write the <b>storage side</b>. The signer <code>presign(…)</code> is given (it mimics <code>getSignedUrl</code>; <code>signHeaders</code> plays <code>signableHeaders</code>), and so is <code>hmac(secret, text)</code>. Write <code>verifyPresigned(req, secret, nowMs)</code> for <code>req = { method, url, headers }</code>:</p>
<ul><li>read <code>X-Amz-Date</code>, <code>X-Amz-Expires</code>, <code>X-Amz-SignedHeaders</code> (names separated by <code>;</code>), <code>X-Amz-Signature</code> from the query; any missing → <code>{ status:400, code:'AuthorizationQueryParametersError' }</code>;</li>
<li>rebuild the canonical text, lines joined with <code>\\n</code>:
<pre>METHOD (upper case)
/decoded/path
X-Amz-Date=&lt;date&gt;
X-Amz-Expires=&lt;seconds&gt;
SignedHeaders=&lt;list as in the URL&gt;
&lt;name&gt;:&lt;trimmed value of that request header&gt;   (one line per signed name, in list order; header names are case-insensitive, missing → empty)</pre></li>
<li>signature first: <code>hmac(secret, canonical) !== X-Amz-Signature</code> → <code>{ status:403, code:'SignatureDoesNotMatch' }</code> (compare in constant time);</li>
<li>then the deadline: <code>nowMs &gt; date + expires·1000</code> → <code>{ status:403, code:'AccessDenied', message:'Request has expired' }</code>;</li>
<li>otherwise <code>{ status: 200 }</code>.</li></ul>
<p>The tests replay the lesson: an unsigned Content-Type swapped to text/html (accepted), the same with content-type signed (403), an edited key (403), an expired URL (403).</p>${MOI_TRUONG.en}`,
  vi: `<p>Để nắm chắc mô hình — "method, key và hạn chót được ký; thân, kích thước, và mọi header bạn không nêu tên thì không" — hãy viết <b>phía storage</b>. Bộ ký <code>presign(…)</code> có sẵn (mô phỏng <code>getSignedUrl</code>; <code>signHeaders</code> đóng vai <code>signableHeaders</code>), cùng <code>hmac(secret, text)</code>. Viết <code>verifyPresigned(req, secret, nowMs)</code> với <code>req = { method, url, headers }</code>:</p>
<ul><li>đọc <code>X-Amz-Date</code>, <code>X-Amz-Expires</code>, <code>X-Amz-SignedHeaders</code> (tên cách nhau bằng <code>;</code>), <code>X-Amz-Signature</code> từ query; thiếu cái nào → <code>{ status:400, code:'AuthorizationQueryParametersError' }</code>;</li>
<li>dựng lại văn bản chuẩn (canonical), các dòng nối bằng <code>\\n</code> theo khung trong bản tiếng Anh (METHOD viết hoa · đường dẫn đã giải mã · X-Amz-Date=… · X-Amz-Expires=… · SignedHeaders=… · mỗi tên header được ký một dòng <code>tên:giá_trị_đã_trim</code> theo thứ tự danh sách; tên header không phân biệt hoa thường, thiếu → rỗng);</li>
<li>chữ ký trước: <code>hmac(secret, canonical) !== X-Amz-Signature</code> → <code>{ status:403, code:'SignatureDoesNotMatch' }</code> (so thời gian hằng);</li>
<li>rồi tới hạn: <code>nowMs &gt; date + expires·1000</code> → <code>{ status:403, code:'AccessDenied', message:'Request has expired' }</code>;</li>
<li>còn lại <code>{ status: 200 }</code>.</li></ul>
<p>Bộ kiểm diễn lại bài: Content-Type không ký bị đổi sang text/html (được nhận), cũng vậy khi đã ký content-type (403), khoá bị sửa (403), URL hết hạn (403).</p>${MOI_TRUONG.vi}`,
  goiY: [['<code>new URL(req.url).searchParams</code> gives you the four values; <code>decodeURIComponent(u.pathname)</code> the path.', '<code>new URL(req.url).searchParams</code> cho bạn bốn giá trị; <code>decodeURIComponent(u.pathname)</code> cho đường dẫn.'], ['Lower-case the request’s header names into a new object before looking them up.', 'Viết thường tên header của request vào một object mới trước khi tra.'], ['Why signature before expiry? X-Amz-Date is just a query parameter until the signature proves nobody changed it.', 'Vì sao chữ ký trước hạn chót? X-Amz-Date chỉ là một tham số query cho tới khi chữ ký chứng minh không ai sửa nó.']],
  loi: [['Putting every request header into the canonical text: then a browser’s extra headers break every valid URL.', 'Đưa mọi header của request vào văn bản chuẩn: khi đó header phụ của trình duyệt làm hỏng mọi URL hợp lệ.'], ['Checking the expiry before the signature and trusting an attacker-edited X-Amz-Expires=999999.', 'Kiểm hạn trước chữ ký và tin X-Amz-Expires=999999 do kẻ tấn công sửa.'], ['Comparing the signature with === — the timing leak of 9.4, on the storage side.', 'So chữ ký bằng === — rò rỉ thời gian của 9.4, ở phía storage.']],
  gt: ['A signature covers exactly the text that was signed. Because the verifier rebuilds that text from the method, the path, the date/expiry and the named headers only, everything else in the request — an unsigned Content-Type, the body, its size — has no influence on the result: that is why measurement 4 succeeded until content-type joined SignedHeaders. Checking the signature before the deadline is what makes the deadline itself tamper-proof.', 'Chữ ký bao phủ đúng văn bản đã được ký. Vì bên kiểm dựng lại văn bản đó chỉ từ method, đường dẫn, ngày/hạn và các header được nêu tên, mọi thứ khác trong request — Content-Type không ký, thân, kích thước — không ảnh hưởng tới kết quả: đó là lý do phép đo 4 thành công cho tới khi content-type vào SignedHeaders. Kiểm chữ ký trước hạn chót là điều làm cho chính hạn chót không thể bị sửa.'],
  kn: ['presigned URLs', 'signatures', 'HMAC'],
  tns: [tn('canonical request', 'request chuẩn hoá', 'văn bản cố định được đem đi ký'), tn('signableHeaders', 'header được đưa vào chữ ký', 'tuỳ chọn của getSignedUrl')],
  fakes: SIGN,
  dau: `/** Storage side: is this presigned request valid? */
function verifyPresigned(req, secret, nowMs) {
  // Write your solution here
  const p = new URL(req.url).searchParams;
  if (!p.get('X-Amz-Signature')) return { status: 400, code: 'AuthorizationQueryParametersError' };
  return { status: 200 };
}
`,
  giai: '// Reference solution\n' + nguon(verifyPresigned),
  cases: [
    { goi: 'verifyPresigned({ method: "PUT", url: presign({ method: "PUT", key: KEY, expiresIn: 600 }, SECRET, T0), headers: { Host: "r2.example", "Content-Type": "video/mp4" } }, SECRET, T0 + 1000)', moTa: ['A valid PUT', 'Một PUT hợp lệ'] },
    { goi: 'verifyPresigned({ method: "PUT", url: presign({ method: "PUT", key: KEY, expiresIn: 600 }, SECRET, T0), headers: { host: "r2.example", "content-type": "text/html" } }, SECRET, T0 + 1000)', moTa: ['Measurement 4: content-type not signed → text/html accepted', 'Phép đo 4: không ký content-type → text/html được nhận'] },
    { goi: '[verifyPresigned({ method: "PUT", url: presign({ method: "PUT", key: KEY, expiresIn: 600, signHeaders: { "content-type": "video/mp4" } }, SECRET, T0), headers: { host: "r2.example", "content-type": "text/html" } }, SECRET, T0 + 1000), verifyPresigned({ method: "PUT", url: presign({ method: "PUT", key: KEY, expiresIn: 600, signHeaders: { "content-type": "video/mp4" } }, SECRET, T0), headers: { host: "r2.example", "Content-Type": " video/mp4 " } }, SECRET, T0 + 1000)]', moTa: ['signableHeaders: text/html → 403, video/mp4 → 200', 'signableHeaders: text/html → 403, video/mp4 → 200'] },
    { goi: 'verifyPresigned({ method: "GET", url: presign({ method: "GET", key: KEY, expiresIn: 5 }, SECRET, T0), headers: { host: "r2.example" } }, SECRET, T0 + 7000)', moTa: ['Measurement 6: used 7 s after a 5 s expiry', 'Phép đo 6: dùng sau 7 giây với hạn 5 giây'] },
    { goi: '[verifyPresigned({ method: "GET", url: presign({ method: "GET", key: KEY, expiresIn: 5 }, SECRET, T0).replace("video/u7/", "video/u1/"), headers: { host: "r2.example" } }, SECRET, T0), verifyPresigned({ method: "GET", url: presign({ method: "GET", key: KEY, expiresIn: 5 }, SECRET, T0).replace("X-Amz-Expires=5", "X-Amz-Expires=999999"), headers: { host: "r2.example" } }, SECRET, T0 + 7000)]', an: true },
    { goi: '[verifyPresigned({ method: "DELETE", url: presign({ method: "GET", key: KEY, expiresIn: 60 }, SECRET, T0), headers: { host: "r2.example" } }, SECRET, T0), verifyPresigned({ method: "get", url: presign({ method: "GET", key: KEY, expiresIn: 60 }, SECRET, T0), headers: { host: "r2.example" } }, "other-key", T0), verifyPresigned({ method: "GET", url: "https://r2.example/ct-lab/" + KEY + "?X-Amz-Date=20260727T181933Z", headers: { host: "r2.example" } }, SECRET, T0)]', an: true },
    { goi: '[verifyPresigned({ method: "GET", url: presign({ method: "GET", key: KEY, expiresIn: 60 }, SECRET, T0), headers: { host: "r2.example" } }, SECRET, T0 + 60000), verifyPresigned({ method: "GET", url: presign({ method: "GET", key: KEY, expiresIn: 60 }, SECRET, T0), headers: { host: "r2.example" } }, SECRET, T0 + 60001), verifyPresigned({ method: "PUT", url: presign({ method: "PUT", key: "video/u7/kh\\u00f4ng d\\u1ea5u.mp4", expiresIn: 60 }, SECRET, T0), headers: { host: "r2.example", "x-extra": "1" } }, SECRET, T0)]', an: true },
  ],
});

export default modul('nodejs-10-2-object-storage-presigned', '10.2 Object storage and presigned URLs', [E1, E2, E3, E4, E5]);
