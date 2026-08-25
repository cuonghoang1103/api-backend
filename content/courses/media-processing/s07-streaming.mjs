const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 7 — Streaming: HLS and adaptive delivery|||Chương 7 — Streaming: HLS và phát thích ứng',
  slug: 'mp-ch7-streaming',
  description: 'Ba bài về phát video: khi progressive đủ, HLS thật sự là gì, và bậc thang bitrate.',
  sortOrder: 8,
  lessons: [

    {
      title: '7.1 — Progressive vs streaming: when a plain MP4 is enough|||7.1 — Progressive vs streaming: khi một MP4 thường là đủ',
      slug: 'mp-7-1-progressive',
      type: 'VIDEO',
      description: 'HLS is the default answer everywhere and the wrong answer for most short-form video. Here is the actual threshold, and what a plain MP4 already gives you for free.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Progressive vs streaming: when a plain MP4 is enough</h2>
<p class="lead">Every article about web video recommends HLS. For a 15-second clip in a social feed, HLS is three to five times the storage, an extra encode pass, a manifest to serve, and a JavaScript player — to solve a problem that clip does not have. Knowing where the threshold actually sits saves a lot of infrastructure you would then have to maintain.</p>

<h3>What &quot;progressive&quot; already does</h3>
<pre><code class="language-text">&lt;video src="clip.mp4" controls&gt;&lt;/video&gt;

The browser:
  1. GET clip.mp4 with Range: bytes=0-              (partial)
  2. Reads the moov atom — which is at the FRONT because you ran
     -movflags +faststart (Lesson 3.3)
  3. Starts decoding and playing as soon as it has enough frames
  4. Keeps fetching with Range requests as playback advances
  5. If the user seeks to 0:45, issues a Range request for the
     bytes covering 0:45 — it does NOT download 0:00-0:45 first

That is streaming. It is built into every browser, needs no
JavaScript, no manifest, no extra encode, and no player library.

What it does NOT do: change quality mid-playback. One file, one
bitrate. If the network degrades, the buffer drains and playback
stalls rather than dropping to a lower rendition.
</code></pre>

<p>That last paragraph is the entire difference. HLS exists to solve <em>adaptive bitrate</em> — switching renditions mid-playback as bandwidth changes. Everything else about it is overhead you are paying to get that one feature.</p>

<h3>The threshold, stated concretely</h3>
<pre><code class="language-text">Use a plain MP4 when:                  Use HLS/DASH when:
────────────────────────────────────  ──────────────────────────────────
Clips under ~2 minutes                 Anything over ~10 minutes
Feed / social / product video          Long-form: courses, films, VOD
Viewers mostly on stable connections    Mobile viewers on variable networks
One rendition is acceptable            You need 360p→1080p adaptation
You want zero player JavaScript        You already ship a player anyway
Storage matters more than adaptation   Rebuffering matters more than storage

Between 2 and 10 minutes is judgement. The honest test is: if a viewer
on a degrading connection would rather see 360p than a spinner, you
need adaptive. If they would rather wait two seconds and get 720p,
you do not.
</code></pre>

<h3>Measured: what HLS actually costs you</h3>
<pre><code class="language-text">Source: 2-minute 1080p clip (the same one benchmarked in Lesson 3.3)

  PROGRESSIVE (one file)
    1080p crf 23, preset veryfast, +faststart
    → 27.8 MB, one encode of 19 s, one object in R2

  HLS LADDER (three renditions + manifests)
    1080p crf 22  → 31.2 MB
     720p crf 23  → 14.8 MB
     360p crf 26  →  3.9 MB
    ─────────────────────────
    total           49.9 MB   (1.8× the storage)
    encode time     ~52 s     (2.7× the CPU)
    objects in R2   ~370      (segments + 4 manifests)

  The object COUNT is the part people miss. At 6-second segments,
  a 2-minute clip is 20 segments per rendition × 3 = 60 objects,
  plus per-rendition manifests and a master. Class A operations
  (Object Storage course, Chapter 7) are per-object, so a 60×
  increase in objects is a 60× increase in the write cost.

  For a 90-minute film the same maths gives ~2,700 segments —
  which is fine, because that is the case HLS is FOR.
</code></pre>

<h3>What you get for free without HLS</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Seeking, via HTTP Range</span><span class="lz-d">Lesson 3.2 showed FFmpeg fetching 0.4% of a 486 MB file to read one frame. Browsers do the same thing for seeks. Range support is why a plain MP4 does not need to be downloaded before you can jump to the middle — provided <code>+faststart</code> put the index at the front.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CDN caching, trivially</span><span class="lz-d">One immutable object with a long <code>Cache-Control</code> caches perfectly at every edge. HLS caches fine too, but you now have hundreds of objects to think about, and a manifest that must NOT be cached as long as the segments.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Native controls, on every platform</span><span class="lz-d">Fullscreen, picture-in-picture, AirPlay, casting, playback speed, captions — all built in. With HLS on non-Safari browsers you need Media Source Extensions and a library like hls.js, and you re-implement or re-wire each of those.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Zero JavaScript</span><span class="lz-d">A <code>&lt;video&gt;</code> tag works with JS disabled, in an RSS reader, in an email preview, in a scraper. That is a real accessibility and reach property, not a purist point.</span></div>
</div>

<h3>Serving progressive video correctly</h3>
<pre><code class="language-javascript">// Three headers decide whether a plain MP4 behaves well.
await provider.put(key, buffer, 'video/mp4', {
  // 1. Immutable content → cache forever. The key already carries a
  //    timestamp + random suffix (Lesson 5.2), so the URL changes
  //    whenever the content does.
  cacheControl: 'public, max-age=31536000, immutable',
})

// 2. Range support MUST be advertised. R2 and S3 handle this natively;
//    a custom Express route serving video does NOT unless you write it.
// 3. Content-Type must be video/mp4 — Lesson 5.1's rule about deriving
//    the key from the OUTPUT format is what keeps this correct.
</code></pre>

<pre><code class="language-javascript">// If you DO serve video from Express (local dev, or a private-file route),
// Range is not optional — without it, seeking downloads from byte zero.
app.get('/media/:key', async (req, res) =&gt; {
  const { size } = await provider.stat(req.params.key)
  const range = req.headers.range

  if (!range) {
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',        // ← tells the browser it may Range
    })
    return provider.readStream(req.params.key).stream.pipe(res)
  }

  const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
  const start = Number(startStr)
  const end = endStr ? Number(endStr) : size - 1

  res.writeHead(206, {                  // ← 206 Partial Content, not 200
    'Content-Range': \`bytes \${start}-\${end}/\${size}\`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Content-Type': 'video/mp4',
  })
  provider.readStream(req.params.key, { start, end }).stream.pipe(res)
})
</code></pre>

<p>The status code is the part that gets missed. Returning <code>200</code> with a partial body makes the browser think it received the whole file, so playback breaks in ways that look like corruption. It must be <code>206</code> with a matching <code>Content-Range</code>.</p>

<h3>The poster image, which matters more than the format</h3>
<pre><code class="language-html">&lt;video
  src="https://media.cuongthai.com/video/u42/1735...-a3f9.mp4"
  poster="https://media.cuongthai.com/images/thumbnails/u42/1735...-b2c8.webp"
  preload="metadata"
  controls
  playsinline&gt;
&lt;/video&gt;
</code></pre>

<pre><code class="language-text">preload="metadata"  fetches only the header (a few hundred KB) so the
                    duration and controls render, without downloading
                    the video. On a feed with 20 videos, preload="auto"
                    would start 20 downloads at once.

poster              the thumbnail from Chapter 3.2. Without it the feed
                    shows black rectangles until each video's first
                    frame decodes — and with preload="metadata" that
                    may be never, because no frames are fetched.

playsinline         iOS otherwise takes video fullscreen on play, which
                    is almost never what a feed wants.

The poster is doing more perceived-performance work than any codec
choice in this course. A feed of black rectangles feels broken; a
feed of instant thumbnails feels fast even though nothing has loaded.
</code></pre>

<div class="pitfall">
<p><strong>Trap — reaching for HLS because &quot;that is what video platforms use&quot;.</strong> Video platforms serve 90-minute films to viewers on trains. A 15-second product clip has none of those constraints and pays 1.8× storage, 2.7× CPU, ~60× the object count, and a JavaScript player for an adaptation it will never perform. Match the delivery to the content length.</p>
</div>

<div class="pitfall">
<p><strong>Trap — serving video from a route that does not implement Range.</strong> Playback appears to work, then seeking re-downloads from the start and the browser buffers for tens of seconds. The tell is a <code>200</code> in the network tab where there should be a <code>206</code>. Object storage handles this for you; hand-rolled Express routes do not.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A plain MP4 with <code>+faststart</code> already streams — the browser Range-fetches as playback advances and seeks without downloading the prefix — so HLS buys you exactly one thing, mid-playback bitrate adaptation, at a measured cost of 1.8× storage, 2.7× CPU, ~60× the object count, and a JavaScript player; use progressive for clips under about two minutes and reach for HLS when content runs past ten, and in either case spend your attention on <code>poster</code> plus <code>preload="metadata"</code>, which do more for perceived speed than any codec decision.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — HTTP Range requests</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests — 206, Content-Range, Accept-Ranges.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — video element attributes</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Element/video — preload, poster, playsinline.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Apple — HLS overview</span><span class="lc-sub">developer.apple.com/streaming — cái mà HLS được thiết kế để giải quyết.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Object Storage course — Chapter 3</span><span class="lc-sub">Cache-Control, immutable, và vì sao key có timestamp làm cho cache vĩnh viễn an toàn.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Progressive vs streaming: khi một MP4 thường là đủ</h2>
<p class="lead">Mọi bài viết về video web đều khuyên dùng HLS. Với một clip 15 giây trong feed mạng xã hội, HLS là gấp ba tới năm lần dung lượng lưu trữ, một lượt encode thêm, một manifest phải phục vụ, và một trình phát JavaScript — để giải một vấn đề mà cái clip đó không có. Biết ngưỡng thật sự nằm ở đâu tiết kiệm cho bạn cả một mảng hạ tầng mà rồi bạn sẽ phải duy trì.</p>

<h3>&quot;Progressive&quot; vốn đã làm được gì</h3>
<pre><code class="language-text">&lt;video src="clip.mp4" controls&gt;&lt;/video&gt;

Trình duyệt:
  1. GET clip.mp4 với Range: bytes=0-               (một phần)
  2. Đọc moov atom — vốn nằm ở ĐẦU vì bạn đã chạy
     -movflags +faststart (Bài 3.3)
  3. Bắt đầu giải mã và phát ngay khi có đủ frame
  4. Tiếp tục lấy bằng Range request khi phát tiến tới
  5. Nếu người dùng tua tới 0:45, phát một Range request cho
     những byte bao quanh 0:45 — nó KHÔNG tải 0:00-0:45 trước

Đó chính là streaming. Nó có sẵn trong mọi trình duyệt, không cần
JavaScript, không manifest, không lượt encode thêm, không thư viện.

Cái nó KHÔNG làm được: đổi chất lượng giữa lúc phát. Một file, một
bitrate. Nếu mạng xuống cấp, bộ đệm cạn và việc phát khựng lại chứ
không hạ xuống một bản độ phân giải thấp hơn.
</code></pre>

<p>Đoạn cuối đó chính là toàn bộ khác biệt. HLS tồn tại để giải quyết <em>bitrate thích ứng</em> — chuyển đổi giữa các bản độ phân giải giữa lúc phát khi băng thông thay đổi. Mọi thứ khác về nó là phần chi phí bạn trả để có được đúng một tính năng đó.</p>

<h3>Ngưỡng, nói cho cụ thể</h3>
<pre><code class="language-text">Dùng MP4 thường khi:                   Dùng HLS/DASH khi:
────────────────────────────────────  ──────────────────────────────────
Clip dưới ~2 phút                      Bất cứ gì trên ~10 phút
Video feed / mạng xã hội / sản phẩm    Nội dung dài: khoá học, phim, VOD
Người xem chủ yếu mạng ổn định         Người xem mobile mạng biến động
Một bản độ phân giải là chấp nhận được Cần thích ứng 360p→1080p
Bạn muốn không JavaScript nào cho player Bạn vốn đã ship một player rồi
Lưu trữ quan trọng hơn thích ứng       Giật lag quan trọng hơn lưu trữ

Từ 2 tới 10 phút là chuyện phán đoán. Phép thử trung thực là: nếu một
người xem trên đường truyền đang xuống cấp thà thấy 360p còn hơn thấy
một vòng xoay, thì bạn cần thích ứng. Nếu họ thà chờ hai giây để được
720p, thì bạn không cần.
</code></pre>

<h3>Đo được: HLS thực sự tốn gì</h3>
<pre><code class="language-text">Nguồn: clip 1080p dài 2 phút (chính cái đã benchmark ở Bài 3.3)

  PROGRESSIVE (một file)
    1080p crf 23, preset veryfast, +faststart
    → 27,8 MB, một lượt encode 19 s, một object trong R2

  BẬC THANG HLS (ba bản + manifest)
    1080p crf 22  → 31,2 MB
     720p crf 23  → 14,8 MB
     360p crf 26  →  3,9 MB
    ─────────────────────────
    tổng            49,9 MB   (gấp 1,8 lần dung lượng)
    thời gian encode ~52 s    (gấp 2,7 lần CPU)
    object trong R2 ~370      (segment + 4 manifest)

  SỐ LƯỢNG object mới là phần người ta bỏ sót. Với segment 6 giây,
  một clip 2 phút là 20 segment mỗi bản × 3 = 60 object, cộng
  manifest cho từng bản và một master. Thao tác Class A (khoá
  Object Storage, Chương 7) tính theo từng object, nên tăng 60 lần
  số object là tăng 60 lần chi phí ghi.

  Với một bộ phim 90 phút thì cùng phép tính cho ra ~2.700 segment —
  và như thế là ổn, vì đó chính là trường hợp mà HLS SINH RA để phục vụ.
</code></pre>

<h3>Những gì bạn được miễn phí mà không cần HLS</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tua, qua HTTP Range</span><span class="lz-d">Bài 3.2 đã cho thấy FFmpeg lấy 0,4% của một file 486 MB để đọc một frame. Trình duyệt làm đúng như vậy khi tua. Hỗ trợ Range là lý do một MP4 thường không cần tải hết trước khi bạn nhảy vào giữa — với điều kiện <code>+faststart</code> đã đặt chỉ mục ở đầu.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cache CDN, một cách tầm thường</span><span class="lz-d">Một object bất biến với <code>Cache-Control</code> dài cache hoàn hảo ở mọi edge. HLS cũng cache tốt, nhưng giờ bạn có hàng trăm object phải nghĩ tới, và một manifest KHÔNG được cache lâu bằng các segment.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Điều khiển gốc, trên mọi nền tảng</span><span class="lz-d">Toàn màn hình, hình-trong-hình, AirPlay, casting, tốc độ phát, phụ đề — có sẵn hết. Với HLS trên trình duyệt không phải Safari bạn cần Media Source Extensions và một thư viện như hls.js, rồi bạn phải cài lại hoặc nối lại từng thứ trong số đó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Không cần JavaScript</span><span class="lz-d">Một thẻ <code>&lt;video&gt;</code> chạy được khi JS bị tắt, trong một trình đọc RSS, trong một bản xem trước email, trong một con bot. Đó là một thuộc tính về khả năng tiếp cận và tầm với thật, không phải một luận điểm thuần tuý chủ nghĩa.</span></div>
</div>

<h3>Phục vụ video progressive cho đúng</h3>
<pre><code class="language-javascript">// Ba header quyết định một MP4 thường có hành xử tốt hay không.
await provider.put(key, buffer, 'video/mp4', {
  // 1. Nội dung bất biến → cache mãi mãi. Key vốn đã mang một dấu
  //    thời gian + hậu tố ngẫu nhiên (Bài 5.2), nên URL đổi bất cứ
  //    khi nào nội dung đổi.
  cacheControl: 'public, max-age=31536000, immutable',
})

// 2. Hỗ trợ Range PHẢI được khai báo. R2 và S3 xử lý sẵn;
//    một route Express tự viết phục vụ video thì KHÔNG, trừ khi bạn viết.
// 3. Content-Type phải là video/mp4 — luật ở Bài 5.1 về việc suy key
//    từ format OUTPUT chính là thứ giữ cho điều này đúng.
</code></pre>

<pre><code class="language-javascript">// Nếu bạn CÓ phục vụ video từ Express (dev local, hoặc route file riêng tư),
// Range không phải tuỳ chọn — không có nó, tua sẽ tải lại từ byte số không.
app.get('/media/:key', async (req, res) =&gt; {
  const { size } = await provider.stat(req.params.key)
  const range = req.headers.range

  if (!range) {
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',        // ← nói cho trình duyệt biết nó được Range
    })
    return provider.readStream(req.params.key).stream.pipe(res)
  }

  const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
  const start = Number(startStr)
  const end = endStr ? Number(endStr) : size - 1

  res.writeHead(206, {                  // ← 206 Partial Content, không phải 200
    'Content-Range': \`bytes \${start}-\${end}/\${size}\`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Content-Type': 'video/mp4',
  })
  provider.readStream(req.params.key, { start, end }).stream.pipe(res)
})
</code></pre>

<p>Mã trạng thái là phần hay bị bỏ sót. Trả <code>200</code> kèm một phần thân không đầy đủ khiến trình duyệt tưởng nó đã nhận cả file, nên việc phát hỏng theo những cách trông như file bị lỗi. Nó phải là <code>206</code> kèm một <code>Content-Range</code> khớp.</p>

<h3>Ảnh poster, thứ quan trọng hơn cả format</h3>
<pre><code class="language-html">&lt;video
  src="https://media.cuongthai.com/video/u42/1735...-a3f9.mp4"
  poster="https://media.cuongthai.com/images/thumbnails/u42/1735...-b2c8.webp"
  preload="metadata"
  controls
  playsinline&gt;
&lt;/video&gt;
</code></pre>

<pre><code class="language-text">preload="metadata"  chỉ lấy header (vài trăm KB) để thời lượng và thanh
                    điều khiển hiện ra, mà không tải video. Trên một feed
                    có 20 video, preload="auto" sẽ khởi động 20 lượt tải
                    cùng lúc.

poster              cái thumbnail từ Chương 3.2. Không có nó thì feed hiện
                    ra những hình chữ nhật đen cho tới khi frame đầu của
                    từng video được giải mã — và với preload="metadata"
                    thì điều đó có thể không bao giờ xảy ra, vì không frame
                    nào được lấy về.

playsinline         nếu không thì iOS đưa video ra toàn màn hình khi phát,
                    điều gần như không bao giờ là thứ một feed muốn.

Cái poster đang làm nhiều việc về hiệu năng cảm nhận hơn bất kỳ lựa chọn
codec nào trong khoá này. Một feed toàn hình chữ nhật đen cho cảm giác
hỏng; một feed hiện thumbnail tức thì cho cảm giác nhanh dù chưa có gì tải.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — với tới HLS vì &quot;các nền tảng video đều dùng thế&quot;.</strong> Các nền tảng video phục vụ phim 90 phút cho người xem trên tàu. Một clip sản phẩm 15 giây không có ràng buộc nào trong số đó mà vẫn trả 1,8 lần dung lượng, 2,7 lần CPU, ~60 lần số object, và một trình phát JavaScript cho một sự thích ứng nó sẽ không bao giờ thực hiện. Hãy khớp cách phát với độ dài nội dung.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — phục vụ video từ một route không cài đặt Range.</strong> Việc phát trông như chạy được, rồi tua lại tải từ đầu và trình duyệt đệm hàng chục giây. Dấu hiệu là một <code>200</code> trong tab network ở chỗ lẽ ra phải là <code>206</code>. Object storage lo việc này giúp bạn; route Express tự viết thì không.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một MP4 thường có <code>+faststart</code> vốn đã streaming rồi — trình duyệt lấy theo Range khi việc phát tiến tới và tua được mà không cần tải phần đầu — nên HLS chỉ mua cho bạn đúng một thứ, là thích ứng bitrate giữa lúc phát, với cái giá đo được là 1,8 lần dung lượng, 2,7 lần CPU, ~60 lần số object, và một trình phát JavaScript; hãy dùng progressive cho clip dưới khoảng hai phút và với tới HLS khi nội dung vượt quá mười phút, và trong cả hai trường hợp hãy dồn sự chú ý vào <code>poster</code> cộng <code>preload=&quot;metadata&quot;</code>, vốn làm cho tốc độ cảm nhận nhiều hơn bất kỳ quyết định codec nào.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — HTTP Range requests</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests — 206, Content-Range, Accept-Ranges.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — video element attributes</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Element/video — preload, poster, playsinline.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Apple — HLS overview</span><span class="lc-sub">developer.apple.com/streaming — cái mà HLS được thiết kế để giải quyết.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Khoá Object Storage — Chương 3</span><span class="lc-sub">Cache-Control, immutable, và vì sao key có timestamp làm cho cache vĩnh viễn an toàn.</span></span></div>
</div>
`,
    },


    {
      title: '7.2 — What HLS actually is|||7.2 — HLS thực sự là gì',
      slug: 'mp-7-2-hls',
      type: 'VIDEO',
      description: 'Two text files and a pile of six-second chunks. Once you see the manifests, the whole protocol stops being magic — and the operational gotchas become obvious.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>What HLS actually is</h2>
<p class="lead">HLS has a reputation for complexity that the format itself does not earn. It is a plain-text playlist pointing at a list of short video files, fetched over ordinary HTTP GETs. There is no special server, no persistent connection, no protocol beyond HTTP. Reading one manifest end to end removes most of the mystique — and shows you exactly where the operational problems live.</p>

<h3>The whole protocol, in two files</h3>
<pre><code class="language-text">master.m3u8 — the only URL your player needs
─────────────────────────────────────────────
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.42e01e,mp4a.40.2"
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2400000,RESOLUTION=1280x720,CODECS="avc1.4d401f,mp4a.40.2"
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=4800000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"
1080p/index.m3u8


720p/index.m3u8 — one per rendition
─────────────────────────────────────────────
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:6.000,
seg-00000.ts
#EXTINF:6.000,
seg-00001.ts
#EXTINF:4.320,
seg-00019.ts
#EXT-X-ENDLIST
</code></pre>

<p>That is the format. A master listing renditions with their bandwidths, and one playlist per rendition listing chunks with their durations. The player fetches the master, picks a rendition based on measured bandwidth, then fetches segments in order — switching to a different <code>index.m3u8</code> whenever conditions change.</p>

<h3>The three lines that carry all the meaning</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>BANDWIDTH</code> — how the player chooses</span><span class="lz-d">This is the <em>peak</em> bitrate of the rendition in bits per second, and it is what the adaptation algorithm compares against measured throughput. Understate it and players pick a rendition they cannot sustain, then rebuffer. It must include the audio track, not just video.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>CODECS</code> — how the player decides it can play at all</span><span class="lz-d">The RFC 6381 string (<code>avc1.640028</code> = H.264 High profile level 4.0). A player that cannot decode High profile will skip that rendition entirely — or, if you got the string wrong, will try and fail. Let FFmpeg generate these rather than typing them.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>EXT-X-TARGETDURATION</code> — the buffer arithmetic</span><span class="lz-d">The maximum segment length, in whole seconds. Players typically buffer three segments before starting, so 6-second targets mean roughly 18 seconds of buffer and a slower start; 2-second targets start faster but triple your object count and Class A cost. Six is the common compromise for VOD.</span></div>
</div>

<h3>Producing it, with one FFmpeg command</h3>
<pre><code class="language-bash">ffmpeg -y -i input.mp4 \\
  -filter_complex "[0:v]split=3[v1][v2][v3]; \\
    [v1]scale=-2:360[v1out];[v2]scale=-2:720[v2out];[v3]scale=-2:1080[v3out]" \\
  -map "[v1out]" -c:v:0 libx264 -crf 26 -preset veryfast -pix_fmt yuv420p \\
  -map "[v2out]" -c:v:1 libx264 -crf 23 -preset veryfast -pix_fmt yuv420p \\
  -map "[v3out]" -c:v:2 libx264 -crf 22 -preset veryfast -pix_fmt yuv420p \\
  -map a:0 -map a:0 -map a:0 -c:a aac -b:a 96k \\
  -f hls \\
  -hls_time 6 \\
  -hls_playlist_type vod \\
  -hls_flags independent_segments \\
  -hls_segment_filename "out/%v/seg-%05d.ts" \\
  -master_pl_name master.m3u8 \\
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \\
  "out/%v/index.m3u8"
</code></pre>

<pre><code class="language-text">The two flags that are not optional:

  -hls_flags independent_segments
    Every segment starts with a keyframe, so a player can begin at
    any segment and can switch renditions at any boundary. Without
    it, switching produces visible corruption until the next keyframe.

  -hls_playlist_type vod
    Marks the playlist complete and appends #EXT-X-ENDLIST. Omit it
    and players treat it as a LIVE stream: they refuse to show a
    duration, refuse to let you seek past the buffer, and poll the
    manifest forever waiting for segments that will never come.

That second one is the single most common HLS bug. The symptom —
"the video plays but has no seek bar" — sounds like a player problem
and is actually a missing flag in the encode.
</code></pre>

<h3>Keyframe alignment, and why renditions must agree</h3>
<pre><code class="language-text">For a player to switch from 720p to 360p at segment 7, both renditions
must have a segment 7 covering EXACTLY the same time range, starting
with a keyframe.

If the encoder places keyframes wherever it likes, the renditions drift:

  720p:  |--seg0--|--seg1--|--seg2--|      boundaries at 0, 6.0, 12.0
  360p:  |---seg0---|--seg1--|-seg2-|      boundaries at 0, 6.4, 11.8
                    ↑ cannot switch cleanly here

Force it by pinning the GOP to the segment length:

  -g 180 -keyint_min 180 -sc_threshold 0     (for 30 fps × 6 s)

  -g / -keyint_min   keyframe exactly every 180 frames
  -sc_threshold 0    disable scene-change keyframes, which would
                     otherwise insert extra ones at unpredictable times

Skipping this produces a stream that plays fine in testing (nobody
switches renditions on a fast connection) and glitches on real mobile
networks — the exact conditions you built HLS for.
</code></pre>

<h3>Serving it: the caching rule that differs per file type</h3>
<pre><code class="language-javascript">// Segments are immutable — the content of seg-00007.ts never changes.
await provider.put(segKey, segBuf, 'video/mp2t', {
  cacheControl: 'public, max-age=31536000, immutable',
})

// A VOD manifest is also immutable once the encode finishes.
await provider.put(plKey, plBuf, 'application/vnd.apple.mpegurl', {
  cacheControl: 'public, max-age=31536000, immutable',
})

// ⚠️ A LIVE manifest is NOT — it gains a segment every few seconds.
// Cache it as long as one segment and no longer:
//   cacheControl: 'public, max-age=2'
</code></pre>

<pre><code class="language-text">Getting this wrong in either direction:

  Manifest cached too long on a LIVE stream
    → viewers see a frozen playlist and playback stalls at the end
      of whatever segments they already have

  Segments cached too briefly
    → every viewer re-fetches every segment from origin. For a
      90-minute film that is ~2,700 origin requests per viewer,
      which is exactly the Class B cost explosion the Object
      Storage course warned about in Chapter 7.
</code></pre>

<h3>Browser support, and the one library you need</h3>
<pre><code class="language-html">&lt;video id="v" controls playsinline poster="thumb.webp"&gt;&lt;/video&gt;
&lt;script type="module"&gt;
  const video = document.getElementById('v')
  const src = 'https://media.cuongthai.com/video/u42/1735.../master.m3u8'

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari (desktop and iOS) plays HLS natively — no library at all.
    video.src = src
  } else {
    // Everyone else needs Media Source Extensions, via hls.js (~150 KB).
    const { default: Hls } = await import('hls.js')
    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 })
      hls.loadSource(src)
      hls.attachMedia(video)
    }
  }
&lt;/script&gt;
</code></pre>

<p>The <code>import()</code> is deliberate: Safari users never download hls.js at all. On a page where most traffic is iOS — which for a Vietnamese consumer app is a large share — that is 150 KB saved for the majority of visitors.</p>

<h3>Operationally, what HLS adds to your life</h3>
<pre><code class="language-text">Concern                  Progressive MP4        HLS
──────────────────────  ────────────────────   ─────────────────────────
Objects per video        1                      ~370 for 2 min, ~2,700
                                                for 90 min
Failure mode             file missing → 404     ONE segment missing →
                                                playback stalls mid-way,
                                                and only for viewers who
                                                reach that timestamp
Cleanup (Object Storage  delete 1 key           delete a whole prefix,
course Ch. 6.3)                                 and orphan detection now
                                                works on prefixes not keys
Debugging                play the URL           read the manifest, find
                                                the segment, fetch it
                                                yourself, check its
                                                duration and keyframe

The middle row is the one that bites. A partial upload leaves a stream
that plays for 40 seconds and then stops, for some viewers, some of the
time — and nothing in your monitoring looks wrong because the manifest
and 369 of 370 segments returned 200.
</code></pre>

<div class="pitfall">
<p><strong>Trap — omitting <code>-hls_playlist_type vod</code>.</strong> The playlist lacks <code>#EXT-X-ENDLIST</code>, so players treat a finished file as a live stream: no duration, no seek bar, and endless manifest polling. It reads as a player bug and is a one-flag encode bug.</p>
</div>

<div class="pitfall">
<p><strong>Trap — letting the encoder choose keyframe positions.</strong> Without <code>-g</code>, <code>-keyint_min</code>, and <code>-sc_threshold 0</code>, segment boundaries drift between renditions and rendition switching glitches. It never shows up in testing because you test on a connection too good to trigger a switch.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> HLS is a text master playlist listing renditions by <code>BANDWIDTH</code> and <code>CODECS</code>, plus one playlist per rendition listing six-second chunks — fetched over ordinary HTTP — so the format is simple and the operational cost is elsewhere: pin keyframes with <code>-g</code>/<code>-keyint_min</code>/<code>-sc_threshold 0</code> so renditions can switch cleanly, always pass <code>-hls_playlist_type vod</code> or players treat a finished file as live and hide the seek bar, cache segments and VOD manifests immutably but live manifests for one segment only, and accept that a single missing segment out of hundreds fails silently for only the viewers who reach that timestamp.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8216 — HTTP Live Streaming</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc8216 — mọi thẻ EXT-X, viết dễ đọc bất ngờ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — HLS muxer</span><span class="lc-sub">ffmpeg.org/ffmpeg-formats.html#hls-2 — hls_time, hls_flags, var_stream_map.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">hls.js</span><span class="lc-sub">github.com/video-dev/hls.js — MSE cho mọi trình duyệt không phải Safari.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6381 — codecs parameter</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc6381 — chuỗi avc1.640028 nghĩa là gì.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>HLS thực sự là gì</h2>
<p class="lead">HLS mang tiếng phức tạp mà bản thân format không xứng đáng nhận. Nó là một danh sách phát dạng văn bản thuần trỏ tới một loạt file video ngắn, lấy về bằng những lệnh GET HTTP bình thường. Không có server đặc biệt, không kết nối bền, không giao thức nào ngoài HTTP. Đọc hết một manifest từ đầu tới cuối là gỡ bỏ gần hết vẻ huyền bí — và chỉ cho bạn đúng chỗ những vấn đề vận hành nằm.</p>

<h3>Toàn bộ giao thức, trong hai file</h3>
<pre><code class="language-text">master.m3u8 — URL duy nhất trình phát của bạn cần
─────────────────────────────────────────────
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.42e01e,mp4a.40.2"
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2400000,RESOLUTION=1280x720,CODECS="avc1.4d401f,mp4a.40.2"
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=4800000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2"
1080p/index.m3u8


720p/index.m3u8 — một cái cho mỗi bản độ phân giải
─────────────────────────────────────────────
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:6.000,
seg-00000.ts
#EXTINF:6.000,
seg-00001.ts
#EXTINF:4.320,
seg-00019.ts
#EXT-X-ENDLIST
</code></pre>

<p>Đó là toàn bộ format. Một master liệt kê các bản kèm băng thông của chúng, và một playlist cho mỗi bản liệt kê các mẩu kèm thời lượng. Trình phát lấy master, chọn một bản dựa trên băng thông đo được, rồi lấy các segment theo thứ tự — chuyển sang một <code>index.m3u8</code> khác bất cứ khi nào điều kiện thay đổi.</p>

<h3>Ba dòng mang toàn bộ ý nghĩa</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>BANDWIDTH</code> — cách trình phát chọn</span><span class="lz-d">Đây là bitrate <em>đỉnh</em> của bản đó tính bằng bit mỗi giây, và nó là thứ mà thuật toán thích ứng đem so với thông lượng đo được. Khai thấp đi thì trình phát chọn một bản mà nó không gánh nổi, rồi giật lag. Nó phải bao gồm cả luồng âm thanh, không chỉ video.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>CODECS</code> — cách trình phát quyết định nó có phát được không</span><span class="lz-d">Chuỗi theo RFC 6381 (<code>avc1.640028</code> = H.264 profile High mức 4.0). Một trình phát không giải mã được profile High sẽ bỏ qua hẳn bản đó — hoặc, nếu bạn viết sai chuỗi, sẽ thử rồi hỏng. Hãy để FFmpeg tự sinh chúng thay vì gõ tay.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>EXT-X-TARGETDURATION</code> — phép tính bộ đệm</span><span class="lz-d">Độ dài segment tối đa, tính bằng số giây nguyên. Trình phát thường đệm ba segment trước khi bắt đầu, nên mục tiêu 6 giây nghĩa là khoảng 18 giây bộ đệm và khởi động chậm hơn; mục tiêu 2 giây khởi động nhanh hơn nhưng nhân ba số object và chi phí Class A. Sáu là điểm dung hoà phổ biến cho VOD.</span></div>
</div>

<h3>Tạo ra nó, bằng một lệnh FFmpeg</h3>
<pre><code class="language-bash">ffmpeg -y -i input.mp4 \\
  -filter_complex "[0:v]split=3[v1][v2][v3]; \\
    [v1]scale=-2:360[v1out];[v2]scale=-2:720[v2out];[v3]scale=-2:1080[v3out]" \\
  -map "[v1out]" -c:v:0 libx264 -crf 26 -preset veryfast -pix_fmt yuv420p \\
  -map "[v2out]" -c:v:1 libx264 -crf 23 -preset veryfast -pix_fmt yuv420p \\
  -map "[v3out]" -c:v:2 libx264 -crf 22 -preset veryfast -pix_fmt yuv420p \\
  -map a:0 -map a:0 -map a:0 -c:a aac -b:a 96k \\
  -f hls \\
  -hls_time 6 \\
  -hls_playlist_type vod \\
  -hls_flags independent_segments \\
  -hls_segment_filename "out/%v/seg-%05d.ts" \\
  -master_pl_name master.m3u8 \\
  -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" \\
  "out/%v/index.m3u8"
</code></pre>

<pre><code class="language-text">Hai cờ không phải tuỳ chọn:

  -hls_flags independent_segments
    Mỗi segment bắt đầu bằng một keyframe, nên trình phát có thể bắt
    đầu ở segment bất kỳ và chuyển bản ở ranh giới bất kỳ. Không có nó,
    việc chuyển bản tạo ra hình vỡ thấy được cho tới keyframe kế tiếp.

  -hls_playlist_type vod
    Đánh dấu playlist đã hoàn tất và nối thêm #EXT-X-ENDLIST. Bỏ nó đi
    thì trình phát coi đây là một luồng TRỰC TIẾP: chúng từ chối hiện
    thời lượng, từ chối cho bạn tua quá bộ đệm, và poll manifest mãi mãi
    để chờ những segment sẽ không bao giờ tới.

Cái thứ hai là bug HLS phổ biến nhất. Triệu chứng — "video phát được
nhưng không có thanh tua" — nghe như lỗi trình phát mà thực ra là một
cờ bị thiếu lúc encode.
</code></pre>

<h3>Căn keyframe, và vì sao các bản phải khớp nhau</h3>
<pre><code class="language-text">Để một trình phát chuyển từ 720p sang 360p ở segment 7, cả hai bản
phải có một segment 7 phủ CHÍNH XÁC cùng một khoảng thời gian, bắt
đầu bằng một keyframe.

Nếu bộ encode đặt keyframe tuỳ ý, các bản sẽ trôi lệch nhau:

  720p:  |--seg0--|--seg1--|--seg2--|      ranh giới ở 0, 6.0, 12.0
  360p:  |---seg0---|--seg1--|-seg2-|      ranh giới ở 0, 6.4, 11.8
                    ↑ không chuyển sạch được ở đây

Ép nó bằng cách ghim GOP bằng độ dài segment:

  -g 180 -keyint_min 180 -sc_threshold 0     (cho 30 fps × 6 s)

  -g / -keyint_min   keyframe đúng mỗi 180 frame
  -sc_threshold 0    tắt keyframe theo đổi cảnh, thứ mà nếu không sẽ
                     chèn thêm keyframe ở những thời điểm không đoán được

Bỏ qua bước này tạo ra một luồng phát tốt khi kiểm thử (không ai chuyển
bản trên một đường truyền nhanh) và giật hỏng trên mạng di động thật —
đúng những điều kiện mà bạn dựng HLS để phục vụ.
</code></pre>

<h3>Phục vụ nó: luật cache khác nhau theo từng loại file</h3>
<pre><code class="language-javascript">// Segment là bất biến — nội dung của seg-00007.ts không bao giờ đổi.
await provider.put(segKey, segBuf, 'video/mp2t', {
  cacheControl: 'public, max-age=31536000, immutable',
})

// Một manifest VOD cũng bất biến một khi lần encode kết thúc.
await provider.put(plKey, plBuf, 'application/vnd.apple.mpegurl', {
  cacheControl: 'public, max-age=31536000, immutable',
})

// ⚠️ Một manifest TRỰC TIẾP thì KHÔNG — nó thêm một segment mỗi vài giây.
// Hãy cache nó lâu bằng đúng một segment và không hơn:
//   cacheControl: 'public, max-age=2'
</code></pre>

<pre><code class="language-text">Làm sai theo cả hai hướng:

  Manifest cache quá lâu trên một luồng TRỰC TIẾP
    → người xem thấy một playlist đóng băng và việc phát khựng lại ở
      cuối chỗ segment mà họ đã có

  Segment cache quá ngắn
    → mọi người xem lấy lại mọi segment từ origin. Với một bộ phim
      90 phút đó là ~2.700 request tới origin cho mỗi người xem,
      đúng là vụ bùng nổ chi phí Class B mà khoá Object Storage đã
      cảnh báo ở Chương 7.
</code></pre>

<h3>Hỗ trợ trình duyệt, và một thư viện bạn cần</h3>
<pre><code class="language-html">&lt;video id="v" controls playsinline poster="thumb.webp"&gt;&lt;/video&gt;
&lt;script type="module"&gt;
  const video = document.getElementById('v')
  const src = 'https://media.cuongthai.com/video/u42/1735.../master.m3u8'

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari (desktop và iOS) phát HLS gốc — không cần thư viện nào.
    video.src = src
  } else {
    // Mọi trình duyệt khác cần Media Source Extensions, qua hls.js (~150 KB).
    const { default: Hls } = await import('hls.js')
    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 })
      hls.loadSource(src)
      hls.attachMedia(video)
    }
  }
&lt;/script&gt;
</code></pre>

<p>Lệnh <code>import()</code> động là có chủ đích: người dùng Safari không bao giờ phải tải hls.js. Trên một trang mà phần lớn traffic là iOS — với một app tiêu dùng Việt Nam thì đó là một tỷ trọng lớn — đó là 150 KB tiết kiệm được cho đa số khách truy cập.</p>

<h3>Về mặt vận hành, HLS thêm gì vào cuộc sống của bạn</h3>
<pre><code class="language-text">Mối quan tâm             MP4 progressive        HLS
──────────────────────  ────────────────────   ─────────────────────────
Object mỗi video         1                      ~370 cho 2 phút, ~2.700
                                                cho 90 phút
Kiểu hỏng                thiếu file → 404       thiếu MỘT segment →
                                                phát khựng giữa chừng,
                                                và chỉ với những người
                                                xem tới mốc thời gian đó
Dọn dẹp (khoá Object     xoá 1 key              xoá cả một tiền tố, và
Storage Ch. 6.3)                                phát hiện mồ côi giờ làm
                                                việc trên tiền tố chứ
                                                không phải key
Gỡ lỗi                   mở URL và phát         đọc manifest, tìm ra
                                                segment, tự lấy nó về,
                                                kiểm thời lượng và keyframe

Hàng ở giữa mới là hàng cắn đau. Một lần upload thiếu để lại một luồng
phát được 40 giây rồi dừng, với một số người xem, vào một số lúc — và
không có gì trong hệ giám sát trông sai cả, vì manifest và 369 trong
370 segment đều trả về 200.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bỏ <code>-hls_playlist_type vod</code>.</strong> Playlist thiếu <code>#EXT-X-ENDLIST</code>, nên trình phát coi một file đã hoàn tất là một luồng trực tiếp: không thời lượng, không thanh tua, và poll manifest không dứt. Nó đọc như một bug của trình phát và thực ra là một bug encode thiếu một cờ.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — để bộ encode tự chọn vị trí keyframe.</strong> Không có <code>-g</code>, <code>-keyint_min</code>, và <code>-sc_threshold 0</code>, ranh giới segment trôi lệch giữa các bản và việc chuyển bản bị giật hỏng. Nó không bao giờ lộ ra khi kiểm thử vì bạn kiểm thử trên một đường truyền quá tốt để kích hoạt một lần chuyển bản.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> HLS là một master playlist dạng văn bản liệt kê các bản theo <code>BANDWIDTH</code> và <code>CODECS</code>, cộng một playlist cho mỗi bản liệt kê những mẩu sáu giây — lấy về bằng HTTP thường — nên format thì đơn giản còn chi phí vận hành nằm ở chỗ khác: hãy ghim keyframe bằng <code>-g</code>/<code>-keyint_min</code>/<code>-sc_threshold 0</code> để các bản chuyển đổi sạch sẽ, luôn truyền <code>-hls_playlist_type vod</code> nếu không trình phát sẽ coi một file đã xong là trực tiếp và giấu thanh tua đi, cache segment và manifest VOD dạng bất biến nhưng manifest trực tiếp chỉ trong đúng một segment, và chấp nhận rằng một segment thiếu trong hàng trăm cái sẽ hỏng trong im lặng chỉ với những người xem tới đúng mốc thời gian đó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8216 — HTTP Live Streaming</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc8216 — mọi thẻ EXT-X, viết dễ đọc bất ngờ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — HLS muxer</span><span class="lc-sub">ffmpeg.org/ffmpeg-formats.html#hls-2 — hls_time, hls_flags, var_stream_map.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">hls.js</span><span class="lc-sub">github.com/video-dev/hls.js — MSE cho mọi trình duyệt không phải Safari.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 6381 — codecs parameter</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc6381 — chuỗi avc1.640028 nghĩa là gì.</span></span></div>
</div>
`,
    },

    {
      title: '7.3 — Chapter 7 quiz|||7.3 — Kiểm tra Chương 7',
      slug: 'mp-7-3-quiz',
      type: 'QUIZ',
      description: 'Ba câu về progressive, HLS, và cache.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 7 · Quiz</span><h2>What Chapter 7 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 7 · Kiểm tra</span><h2>Chương 7 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 300,
        questions: [
          {
            question: 'A social feed shows 15-second clips. Someone proposes HLS. What does it actually buy, and what does it cost?|||Một feed mạng xã hội hiện clip 15 giây. Có người đề xuất dùng HLS. Nó thực sự mua được gì, và tốn gì?',
            options: [
              'It buys exactly one thing — mid-playback bitrate adaptation — which a 15-second clip will never perform. Measured cost on a 2-minute clip: 1.8× storage, 2.7× CPU, ~60× the object count (and Class A ops are per-object), plus a JavaScript player on non-Safari. A plain MP4 with +faststart already Range-streams and seeks natively.|||Nó mua được đúng một thứ — thích ứng bitrate giữa lúc phát — thứ mà một clip 15 giây sẽ không bao giờ thực hiện. Chi phí đo được trên clip 2 phút: 1,8 lần dung lượng, 2,7 lần CPU, ~60 lần số object (và thao tác Class A tính theo từng object), cộng một trình phát JavaScript trên trình duyệt không phải Safari. Một MP4 thường có +faststart vốn đã stream theo Range và tua được sẵn.',
              'HLS is always better for video on the web|||HLS luôn tốt hơn cho video trên web',
              'It reduces storage by splitting into segments|||Nó giảm dung lượng nhờ cắt thành segment',
              'It removes the need for a poster image|||Nó bỏ được nhu cầu có ảnh poster',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Your HLS video plays but has no duration and no seek bar, and the player keeps re-requesting the manifest. Cause?|||Video HLS của bạn phát được nhưng không có thời lượng và không có thanh tua, và trình phát cứ xin lại manifest. Nguyên nhân?',
            options: [
              'Missing <code>-hls_playlist_type vod</code>, so the playlist has no #EXT-X-ENDLIST and players treat a finished file as a LIVE stream — refusing to show duration, refusing seeks past the buffer, and polling forever for segments that will never arrive. It looks like a player bug; it is a one-flag encode bug.|||Thiếu <code>-hls_playlist_type vod</code>, nên playlist không có #EXT-X-ENDLIST và trình phát coi một file đã hoàn tất là luồng TRỰC TIẾP — từ chối hiện thời lượng, từ chối tua quá bộ đệm, và poll mãi để chờ những segment sẽ không bao giờ tới. Nó trông như bug trình phát; nó là bug encode thiếu một cờ.',
              'The segments are too long — lower hls_time|||Segment quá dài — hãy hạ hls_time',
              'hls.js is not loaded|||hls.js chưa được nạp',
              'The master playlist is missing BANDWIDTH|||Master playlist thiếu BANDWIDTH',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'HLS renditions glitch when switching on real mobile networks, but never in your testing. Why, and what fixes it?|||Các bản HLS bị giật khi chuyển đổi trên mạng di động thật, nhưng không bao giờ giật khi bạn kiểm thử. Vì sao, và cái gì vá được?',
            options: [
              'The encoder chose keyframe positions freely, so segment boundaries drift between renditions and a switch lands mid-GOP. Pin them with <code>-g 180 -keyint_min 180 -sc_threshold 0</code> (for 30 fps × 6 s) so every rendition has identical boundaries. It never appears in testing because a fast connection never triggers a rendition switch.|||Bộ encode chọn vị trí keyframe tuỳ ý, nên ranh giới segment trôi lệch giữa các bản và một lần chuyển rơi vào giữa GOP. Hãy ghim chúng bằng <code>-g 180 -keyint_min 180 -sc_threshold 0</code> (cho 30 fps × 6 s) để mọi bản có ranh giới giống hệt nhau. Nó không bao giờ hiện ra khi kiểm thử vì đường truyền nhanh không bao giờ kích hoạt một lần chuyển bản.',
              'Mobile networks corrupt segments — add retries|||Mạng di động làm hỏng segment — hãy thêm retry',
              'The bitrate ladder has too many rungs|||Bậc thang bitrate có quá nhiều bậc',
              'Safari does not support rendition switching|||Safari không hỗ trợ chuyển bản',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
