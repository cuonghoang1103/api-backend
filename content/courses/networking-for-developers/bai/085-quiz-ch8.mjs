/** Chương 8 · Quiz — 10 câu tình huống, đáp án rải đều (A×3 · B×2 · C×3 · D×2), dữ liệu từ output thật của lab CDN. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 8: CDN and caching|||Quiz — Chương 8: CDN và cache',
  slug: 'netdev-8-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: edge/origin/PoP, Anycast, HIT/MISS/EXPIRED, khoá cache gồm query, tên tệp có mã băm, stale-while-revalidate, bẫy Set-Cookie, proxy ghi đè Cache-Control, timeout 524/504, giới hạn thân 413, presigned URL.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Quiz — CDN and caching</h2>
<p class="lead">Ten situations from the chapter's miniature CDN. Most can be answered by reading a cache status, a header or a status code the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain edge, origin and PoP, and read HIT/MISS/EXPIRED from a header.</li>
<li>I can say why <code>?v=1</code> and <code>?v=2</code> are separate cache entries.</li>
<li>I can use hashed filenames, TTL and stale-while-revalidate correctly.</li>
<li>I know how a proxy can override my cache headers, and how to verify per hop.</li>
<li>I can route long work and big uploads around the edge (202+poll, presigned URL).</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Quiz</span>
<h2>Quiz — CDN và cache</h2>
<p class="lead">Mười tình huống từ CDN thu nhỏ của chương. Phần lớn trả lời được bằng cách đọc một trạng thái cache, một header hay một mã trạng thái theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được edge, origin và PoP, và đọc HIT/MISS/EXPIRED từ một header.</li>
<li>Tôi nói được vì sao <code>?v=1</code> và <code>?v=2</code> là hai mục cache riêng.</li>
<li>Tôi dùng được tên tệp có mã băm, TTL và stale-while-revalidate cho đúng.</li>
<li>Tôi biết một proxy ghi đè header cache của tôi thế nào, và cách kiểm từng chặng.</li>
<li>Tôi đưa được việc dài và upload lớn đi vòng qua biên (202+hỏi-lại, presigned URL).</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('A response from the edge carries <code>X-Cache: HIT</code>. What does that tell you?', 'Một câu trả lời từ biên mang <code>X-Cache: HIT</code>. Điều đó cho bạn biết gì?'),
        options: o([['It was served from the edge cache; the origin was not contacted', 'Nó được phục vụ từ cache biên; origin không bị chạm'], ['The origin generated it fresh', 'Origin sinh nó mới'], ['The response is compressed', 'Câu trả lời được nén'], ['The cache is full', 'Cache đầy']]),
        correctIndex: 0, points: 1,
        explanation: ex('HIT means the edge had a cached copy and served it without touching the origin — the whole point of a CDN. A MISS is the one that reaches the origin. It is unrelated to compression or cache fullness.', 'HIT nghĩa là biên có một bản cache và phục vụ nó không chạm origin — đúng mục đích của một CDN. MISS mới là cái chạm origin. Không liên quan nén hay cache đầy.'),
      },
      {
        question: q('On the lab, <code>/img/logo.txt?v=1</code> and <code>/img/logo.txt?v=2</code> both MISS on first request though the file is identical. Why?', 'Trên lab, <code>/img/logo.txt?v=1</code> và <code>/img/logo.txt?v=2</code> đều MISS ở yêu cầu đầu dù tệp y hệt. Vì sao?'),
        options: o([['The TTL expired', 'TTL hết hạn'], ['The cache key includes the query string, so they are two separate entries', 'Khoá cache gồm cả query string, nên chúng là hai mục riêng'], ['The origin is down', 'Origin sập'], ['The file is too large to cache', 'Tệp quá lớn để cache']]),
        correctIndex: 1, points: 1,
        explanation: ex('The cache key is method + host + path + query, so ?v=1 and ?v=2 are different keys and each misses the first time. A cache-busting or tracking query fragments the cache and lowers the hit rate; the fix is hashed immutable filenames, not query edits. It is not TTL, origin health or size.', 'Khoá cache là method + host + path + query, nên ?v=1 và ?v=2 là hai khoá khác nhau và mỗi cái trượt lần đầu. Một query phá-cache hay theo dõi phân mảnh cache và hạ tỷ lệ trúng; cách sửa là tên tệp bất biến có mã băm, không phải sửa query. Không phải TTL, sức khoẻ origin hay kích thước.'),
      },
      {
        question: q('You want a JS bundle cached for a year yet always updated on deploy. What is the right approach?', 'Bạn muốn một bundle JS được cache cả năm mà luôn cập nhật khi deploy. Cách đúng là gì?'),
        options: o([['Set a short max-age so it refreshes often', 'Đặt max-age ngắn để nó làm tươi thường xuyên'], ['Append ?v=timestamp on every request', 'Thêm ?v=timestamp vào mỗi yêu cầu'], ['Serve it as app.<hash>.js with a one-year immutable max-age', 'Phục vụ là app.<hash>.js với max-age một năm immutable'], ['Disable caching and rely on the origin', 'Tắt cache và dựa vào origin']]),
        correctIndex: 2, points: 1,
        explanation: ex('A content hash in the filename means a changed file gets a new URL the cache has never seen, so you can cache the asset for a year with immutable and still go live instantly on deploy. A short max-age wastes revalidations; a timestamp query fragments the cache; disabling caching defeats the purpose.', 'Một mã băm nội dung trong tên tệp nghĩa là một tệp đổi nhận một URL mới cache chưa từng thấy, nên bạn cache tài nguyên cả năm với immutable mà vẫn lên tức thì khi deploy. max-age ngắn phí kiểm lại; một query timestamp phân mảnh cache; tắt cache phá mục đích.'),
      },
      {
        question: q('A page needs to feel instant but may be a little stale. Which Cache-Control fits best?', 'Một trang cần cảm giác tức thì nhưng có thể hơi cũ. Cache-Control nào hợp nhất?'),
        options: o([['no-store', 'no-store'], ['private', 'private'], ['max-age=0', 'max-age=0'], ['max-age=60, stale-while-revalidate=600', 'max-age=60, stale-while-revalidate=600']]),
        correctIndex: 3, points: 1,
        explanation: ex('A short max-age with a long stale-while-revalidate serves the cached copy instantly after expiry while refreshing in the background, so users always get an immediate answer and the origin is hit at most once per window. no-store and max-age=0 prevent caching; private only limits it to the browser.', 'Một max-age ngắn với một stale-while-revalidate dài phục vụ bản cache tức thì sau khi hết hạn trong khi làm tươi ở nền, nên người dùng luôn nhận câu trả lời ngay và origin bị chạm nhiều nhất một lần mỗi cửa sổ. no-store và max-age=0 ngăn cache; private chỉ giới hạn ở trình duyệt.'),
      },
      {
        question: q('After adding analytics, your whole site stopped caching at the CDN — every response is BYPASS. Likely cause?', 'Sau khi thêm phân tích, cả site của bạn ngừng cache ở CDN — mọi câu trả lời là BYPASS. Nguyên nhân có khả năng?'),
        options: o([['The TTL is too long', 'TTL quá dài'], ['Anycast routed users to the wrong PoP', 'Anycast định tuyến người dùng tới PoP sai'], ['A Set-Cookie (or Vary: Cookie) now marks responses as per-user', 'Một Set-Cookie (hay Vary: Cookie) nay đánh dấu câu trả lời là theo-người-dùng'], ['The origin is faster than the edge', 'Origin nhanh hơn biên']]),
        correctIndex: 2, points: 1,
        explanation: ex('A response that sets a cookie, or a route that varies on Cookie, is treated as per-user and cannot be stored in a shared cache, so every request becomes a BYPASS. One analytics/session cookie on / can disable the whole CDN. Strip cookies on static paths. It is not TTL, Anycast or relative speed.', 'Một câu trả lời đặt một cookie, hay một tuyến vary theo Cookie, bị coi là theo-người-dùng và không lưu được trong cache dùng chung, nên mọi yêu cầu thành một BYPASS. Một cookie phân tích/phiên trên / có thể tắt cả CDN. Tước cookie trên các đường tĩnh. Không phải TTL, Anycast hay tốc độ tương đối.'),
      },
      {
        question: q('Your app sets <code>Cache-Control: max-age=3600</code> but the browser receives <code>no-store</code>. Where do you look first?', 'App của bạn đặt <code>Cache-Control: max-age=3600</code> nhưng trình duyệt nhận <code>no-store</code>. Bạn nhìn đâu trước?'),
        options: o([['A proxy/edge between app and browser that overrides the header (curl -I each hop)', 'Một proxy/biên giữa app và trình duyệt ghi đè header (curl -I mỗi chặng)'], ['The browser cache settings', 'Thiết lập cache của trình duyệt'], ['The database', 'Cơ sở dữ liệu'], ['The DNS records', 'Bản ghi DNS']]),
        correctIndex: 0, points: 1,
        explanation: ex('The last layer to touch a header wins. A reverse proxy running proxy_hide_header Cache-Control + add_header no-store silently overrides the app, exactly the cuongthai outage. Verify each hop with curl -I; the header on the wire is the truth. It is not the browser, database or DNS.', 'Tầng cuối chạm vào một header thắng. Một reverse proxy chạy proxy_hide_header Cache-Control + add_header no-store âm thầm ghi đè app, đúng sự cố cuongthai. Xác nhận mỗi chặng bằng curl -I; header trên dây là sự thật. Không phải trình duyệt, cơ sở dữ liệu hay DNS.'),
      },
      {
        question: q('A "generate report" endpoint returns 524 for large accounts. The best fix is:', 'Một điểm cuối "sinh báo cáo" trả 524 với tài khoản lớn. Cách sửa tốt nhất là:'),
        options: o([['Return 202 + a status URL, run the work in the background, and poll for the result', 'Trả 202 + một URL trạng thái, chạy việc ở nền, và hỏi lại kết quả'], ['Increase the origin timeout to 10 minutes', 'Tăng timeout origin lên 10 phút'], ['Retry the same request automatically', 'Tự động thử lại cùng yêu cầu'], ['Move the endpoint to a different domain', 'Chuyển điểm cuối sang một tên miền khác']]),
        correctIndex: 0, points: 1,
        explanation: ex('524 means the edge (Cloudflare) gave up waiting (~100 s). Any single request held longer is doomed, so change the shape: return 202 with a status URL, do the work in a background worker, and let the client poll. Raising the origin timeout cannot help past the edge’s own limit; retrying or moving domains does not change the duration.', '524 nghĩa là biên (Cloudflare) bỏ cuộc chờ (~100 giây). Bất kỳ yêu cầu đơn nào giữ lâu hơn đều chết, nên đổi dáng: trả 202 với một URL trạng thái, làm việc trong một worker nền, và để client hỏi lại. Tăng timeout origin không giúp được quá giới hạn của chính biên; thử lại hay đổi tên miền không đổi thời lượng.'),
      },
      {
        question: q('A 2 MB upload through the CDN returns 413. The durable fix is:', 'Một upload 2 MB qua CDN trả 413. Cách sửa bền là:'),
        options: o([['Compress the file client-side', 'Nén tệp phía client'], ['Split the file into many small requests', 'Chia tệp thành nhiều yêu cầu nhỏ'], ['Hand the browser a presigned URL so it uploads straight to R2/S3, bypassing the edge', 'Trao trình duyệt một presigned URL để nó upload thẳng tới R2/S3, đi vòng qua biên'], ['Raise client_max_body_size and the CDN limit', 'Nâng client_max_body_size và giới hạn CDN']]),
        correctIndex: 2, points: 1,
        explanation: ex('413 is the edge rejecting an oversized body. Pushing big files through the edge wastes bandwidth and hits a wall; the durable answer is a presigned PUT straight to object storage, so only small JSON touches the origin. Compression/splitting are hacks; raising limits just moves the wall.', '413 là biên từ chối một thân quá lớn. Đẩy tệp lớn qua biên phí băng thông và đụng tường; câu trả lời bền là một PUT presigned thẳng tới kho đối tượng, nên chỉ JSON nhỏ chạm origin. Nén/chia là chắp vá; nâng giới hạn chỉ dời tường.'),
      },
      {
        question: q('What does Anycast do for a CDN?', 'Anycast làm gì cho một CDN?'),
        options: o([['Encrypts traffic to the edge', 'Mã hoá lưu lượng tới biên'], ['Compresses cached objects', 'Nén các đối tượng cache'], ['Stores a separate cache per user', 'Lưu một cache riêng cho mỗi người dùng'], ['Announces one IP from every PoP so the network routes a user to the nearest', 'Quảng bá một IP từ mọi PoP để mạng định tuyến người dùng tới cái gần nhất']]),
        correctIndex: 3, points: 1,
        explanation: ex('Anycast announces the same IP from many PoPs at once; the internet’s routing delivers each user to the nearest one, which is how a CDN keeps the edge close. It is not encryption, compression, or per-user storage.', 'Anycast quảng bá cùng một IP từ nhiều PoP cùng lúc; định tuyến của internet đưa mỗi người dùng tới cái gần nhất, đó là cách một CDN giữ biên ở gần. Không phải mã hoá, nén, hay lưu trữ theo-người-dùng.'),
      },
      {
        question: q('On the lab, a file is MISS, then HIT, then after a 31 s wait EXPIRED. What happened on the EXPIRED request?', 'Trên lab, một tệp là MISS, rồi HIT, rồi sau một chờ 31 giây là EXPIRED. Chuyện gì xảy ra ở yêu cầu EXPIRED?'),
        options: o([['The edge served a corrupted copy', 'Biên phục vụ một bản hỏng'], ['The TTL had passed, so the edge revalidated with the origin and re-cached', 'TTL đã qua, nên biên kiểm lại với origin và cache lại'], ['The file was deleted from the origin', 'Tệp bị xoá khỏi origin'], ['The cache key changed', 'Khoá cache đổi']]),
        correctIndex: 1, points: 1,
        explanation: ex('EXPIRED means the cached copy was past its TTL (30 s here), so the next request made the edge revalidate with the origin and store the fresh copy again. It is not corruption, deletion or a key change — just the normal end of a freshness window.', 'EXPIRED nghĩa là bản cache đã quá TTL (30 giây ở đây), nên yêu cầu kế tiếp làm biên kiểm lại với origin và lưu bản tươi lần nữa. Không phải hỏng, xoá hay đổi khoá — chỉ là kết thúc bình thường của một cửa sổ độ tươi.'),
      },
    ],
  },
};
