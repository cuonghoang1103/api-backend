const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 5 — The upload pipeline|||Chương 5 — Đường ống upload',
  slug: 'mp-ch5-pipeline',
  description: 'Bốn bài về pipeline thật: một cửa vào duy nhất, thiết kế key, job nền, và kiểm tra.',
  sortOrder: 6,
  lessons: [

    {
      title: '5.1 — One door in: why every upload goes through one module|||5.1 — Một cửa vào: vì sao mọi upload đi qua một module',
      slug: 'mp-5-1-one-door',
      type: 'VIDEO',
      description: 'Twelve routes each doing their own upload means twelve places to forget the pixel budget. This repo funnels all of them through uploadService.ts, and the reason is written in the file header.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>One door in: why every upload goes through one module</h2>
<p class="lead">Chapters 1-4 gave you the pieces: a pixel budget, a concurrency gate, EXIF rotation, an SVG rejection, an argv-not-shell rule. None of them help if half your routes call Sharp directly and forget one. The architectural answer is a single module that every upload path must pass through — and the discipline is that no route is allowed to touch storage without it.</p>

<h3>What the repo's single door declares it does</h3>
<pre><code class="language-javascript">// src/storage/uploadService.ts — the file header, verbatim
//
// All file uploads in the backend go through this module. It
// coordinates three concerns:
//
//   1. Buffer-level preprocessing (image optimization via Sharp,
//      MIME sniffing, size guards).
//   2. Key construction (one place to define bucket layout).
//   3. Persistence (delegates to the active StorageProvider so
//      R2 / local both work).
//
// Public API:
//   - uploadImage()     — image, runs through sharp, stored as webp
//   - uploadAudio()     — mp3/m4a/etc, stored under \`audio/songs/\`
//   - uploadDocument()  — pdf/zip/docx, stored under \`documents/\`
//   - uploadGeneric()   — fallback for any buffer
//   - deleteByUrl()     — best-effort delete from a public URL
//   - deleteByKey()     — explicit delete by bucket key
</code></pre>

<p>Three concerns, six functions. The value is not that the code is short — it is that there is exactly one place where &quot;what happens to an uploaded image&quot; is decided. Add a rule (say, strip GPS from EXIF) and every route in the product gets it on the next deploy, without anyone auditing routes.</p>

<h3>The shape of <code>uploadImage()</code></h3>
<pre><code class="language-javascript">export async function uploadImage(input, category, options = {}) {
  // 1. Cheap rejections first — before any CPU is spent
  if (input.size === 0) {
    throw new UploadError('Empty file', 'EMPTY_FILE', 400)
  }
  if (input.size &gt; config.maxFileSizeImages) {
    throw new UploadError(
      \`Image too large (max \${config.maxFileSizeImages / 1024 / 1024}MB)\`,
      'FILE_TOO_LARGE',
      413,
    )
  }

  // 2. Sharp pipeline (Chapters 1-2 live in here)
  let optimized
  try {
    optimized = await optimizeImage(input.buffer, input.mimetype)
  } catch (err) {
    if (err instanceof ImageOptimizationError) {
      // The user's file is wrong → 400, with the specific code
      throw new UploadError(err.message, err.code, 400)
    }
    // Something else broke → 500
    throw new UploadError(
      \`Image optimization failed: \${err.message}\`,
      'OPTIMIZATION_FAILED',
      500,
    )
  }

  // 3. Key construction — always .webp, never the input's extension
  const originalNameForKey = input.originalName.replace(/\\.[^.]+$/, '') + '.webp'
  const key = buildKey(category, originalNameForKey, options)
  const savings = formatSavings(optimized.originalSize, optimized.optimizedSize)

  // 4. Persistence, through the provider abstraction
  const stored = await getStorageProvider().put(key, optimized.buffer, optimized.contentType)

  logger.info(
    \`[upload] image \${stored.url} (\${optimized.originalSize}→\${optimized.optimizedSize}B, \${savings})\`,
  )

  return { ...stored, savings, width: optimized.width, height: optimized.height }
}
</code></pre>

<h3>Four decisions in that function worth copying</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Order the guards from cheapest to most expensive</span><span class="lz-d">An empty-file check is a property read. A size check is a property read. A pixel budget needs a header parse. A decode needs tens of megabytes. Reject in that order and a flood of bad requests costs almost nothing. Reversing it means every junk upload pays for a decode before being refused.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Translate error classes into HTTP status at the boundary</span><span class="lz-d">An <code>ImageOptimizationError</code> means the user's file is wrong → 400. Anything else means the server is wrong → 500. That single distinction decides whether your alerting pages someone at 3am. Getting it backwards means either silent user-facing breakage or an on-call woken by someone uploading a corrupt JPEG.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Derive the key from the OUTPUT format, not the input</span><span class="lz-d">The comment says it plainly: <em>&quot;Always store the optimized output as a fresh .webp key, not a key derived from the input's extension. That way the Content-Type we serve is image/webp and the file has the correct format on disk.&quot;</em> A <code>.png</code> key holding WebP bytes will be served as <code>image/png</code> and fail to render in strict clients.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Log the savings on every upload</span><span class="lz-d">The <code>originalSize→optimizedSize, savings</code> line is a free regression test. If a deploy breaks the optimizer and every image starts coming through unchanged, that log goes from &quot;78% smaller&quot; to &quot;0% smaller&quot; and you can see it in a dashboard. It is the same lesson as the loudnorm fallback in Chapter 4: measure an output property, not an exit code.</span></div>
</div>

<h3>The provider abstraction underneath</h3>
<pre><code class="language-javascript">const stored = await getStorageProvider().put(key, buffer, contentType)
</code></pre>

<pre><code class="language-text">Not "await s3.send(new PutObjectCommand(...))". The indirection buys:

  Local development     A filesystem provider writes to ./uploads and
                        serves from an express static route. No R2
                        credentials needed to run the app.
  Testing               A memory provider makes upload tests fast and
                        hermetic — no network, no cleanup.
  Migration             Chapter 8 of the Object Storage course (S3 → R2)
                        becomes a provider swap plus a backfill, not a
                        rewrite of every call site.

The cost is one interface to maintain: put/get/delete/readStream/keyFromUrl.
That is a small price for "the app runs with no cloud account".
</code></pre>

<h3>What happens when a route bypasses the door</h3>
<pre><code class="language-text">Bypass                          What silently breaks
──────────────────────────────  ─────────────────────────────────────
Route calls sharp() itself       No pixel budget (Ch.1), no concurrency
                                 gate, no EXIF rotate. The decompression
                                 bomb works again on that one route.

Route calls provider.put()       No SVG rejection (Ch.2). Stored XSS
directly                         through whichever route forgot.

Route builds its own key         Key layout drifts. The ownership check
                                 &#96;keyBelongsToUser&#96; stops working because
                                 the &#96;u<id>&#96; segment is missing.

Route serves the input's         Content-Type wrong on disk. Renders in
extension                        Chrome, fails in stricter clients.

Every one of these is a bug that exists only on the route that
bypassed. That is what makes them hard to find: the feature works
everywhere you tested.
</code></pre>

<h3>Enforcing it</h3>
<pre><code class="language-bash"># A grep that should return NOTHING outside src/storage/
rg -n --type ts "from 'sharp'|require\\('sharp'\\)" src/ \\
  | rg -v '^src/storage/'

# Same for direct provider use outside the upload service
rg -n --type ts 'getStorageProvider\\(\\)\\.put' src/ \\
  | rg -v '^src/storage/uploadService\\.ts'
</code></pre>

<p>Two greps in CI are cheaper than a code-review convention that erodes. If a new route genuinely needs to bypass — a thumbnail written by a background worker, say — the right move is to add a function to the upload service rather than to add an exception to the grep.</p>

<h3>Where the repo's own door has a legitimate side entrance</h3>
<pre><code class="language-javascript">// src/services/video.service.ts — the thumbnail path
const input = {
  buffer: thumbnailBuffer,
  originalName: \`\${path.basename(originalName, inputExt)}-thumbnail.jpg\`,
  mimetype: 'image/jpeg',
  size: thumbnailBuffer.length,
}
const result = await uploadImage(input, 'images/thumbnails', { userId })
</code></pre>

<p>Notice what this does <em>not</em> do: it does not write the JPEG straight to R2. FFmpeg produces a JPEG, and that JPEG goes back through <code>uploadImage()</code> like any user upload — so it gets the pixel budget, the WebP re-encode, the concurrency gate, and the <code>u&lt;id&gt;</code> ownership segment. A generated file is still a file, and the door applies to it too.</p>

<div class="pitfall">
<p><strong>Trap — an &quot;internal&quot; upload path that skips validation because the bytes are trusted.</strong> The video thumbnail above <em>is</em> server-generated and could arguably skip the checks. It does not, and that is correct: the input to FFmpeg was a user file, so the output inherits that taint. &quot;We generated it&quot; is not the same as &quot;we control its dimensions&quot;.</p>
</div>

<div class="pitfall">
<p><strong>Trap — a size guard in <code>multer</code> only.</strong> <code>limits.fileSize</code> stops the HTTP body, which is necessary but not sufficient — it says nothing about pixels (Chapter 1's bomb) and it does not apply to buffers your own code produces. Keep the guard inside the upload service too, so every entry point is covered including the internal ones.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Funnel every upload — user-supplied and server-generated alike — through one module that owns preprocessing, key construction, and persistence, ordering its guards cheapest-first, translating error classes into 4xx-vs-5xx at that boundary, deriving keys from the output format rather than the input's extension, and logging a size-savings line that doubles as a regression signal; enforce it with a CI grep rather than a convention, because every route that bypasses the door reintroduces exactly the bugs Chapters 1-4 spent their length removing.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/uploadService.ts</span><span class="lc-sub">Ba mối quan tâm, sáu hàm công khai, và thứ tự chốt chặn rẻ-trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/StorageProvider.ts</span><span class="lc-sub">Lớp trừu tượng khiến R2 và local dùng chung một API.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">multer — limits</span><span class="lc-sub">github.com/expressjs/multer#limits — chốt chặn ở tầng HTTP, và vì sao nó chưa đủ.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Một cửa vào: vì sao mọi upload đi qua một module</h2>
<p class="lead">Chương 1-4 đã cho bạn các mảnh: ngân sách pixel, cổng concurrency, xoay EXIF, từ chối SVG, luật argv-không-shell. Không mảnh nào giúp được nếu một nửa số route gọi thẳng Sharp và quên mất một cái. Câu trả lời kiến trúc là một module duy nhất mà mọi đường upload buộc phải đi qua — và kỷ luật là không route nào được phép chạm vào storage mà không qua nó.</p>

<h3>Cửa vào duy nhất của kho tự khai nó làm gì</h3>
<pre><code class="language-javascript">// src/storage/uploadService.ts — phần đầu file, nguyên văn
//
// Mọi upload file trong backend đều đi qua module này. Nó
// điều phối ba mối quan tâm:
//
//   1. Tiền xử lý mức buffer (tối ưu ảnh qua Sharp,
//      đánh hơi MIME, chốt chặn kích thước).
//   2. Dựng key (một chỗ duy nhất định nghĩa bố cục bucket).
//   3. Lưu trữ (uỷ cho StorageProvider đang hoạt động để
//      R2 / local đều chạy được).
//
// API công khai:
//   - uploadImage()     — ảnh, chạy qua sharp, lưu dạng webp
//   - uploadAudio()     — mp3/m4a/..., lưu dưới \`audio/songs/\`
//   - uploadDocument()  — pdf/zip/docx, lưu dưới \`documents/\`
//   - uploadGeneric()   — dự phòng cho buffer bất kỳ
//   - deleteByUrl()     — xoá best-effort từ một URL công khai
//   - deleteByKey()     — xoá tường minh theo key bucket
</code></pre>

<p>Ba mối quan tâm, sáu hàm. Giá trị không nằm ở chỗ mã ngắn — mà ở chỗ có đúng một nơi quyết định &quot;chuyện gì xảy ra với một tấm ảnh được upload&quot;. Thêm một luật (chẳng hạn bóc GPS khỏi EXIF) và mọi route trong sản phẩm đều nhận được nó ở lần deploy kế, không ai phải đi rà soát route.</p>

<h3>Hình dạng của <code>uploadImage()</code></h3>
<pre><code class="language-javascript">export async function uploadImage(input, category, options = {}) {
  // 1. Từ chối rẻ tiền trước — trước khi tiêu bất kỳ CPU nào
  if (input.size === 0) {
    throw new UploadError('Empty file', 'EMPTY_FILE', 400)
  }
  if (input.size &gt; config.maxFileSizeImages) {
    throw new UploadError(
      \`Image too large (max \${config.maxFileSizeImages / 1024 / 1024}MB)\`,
      'FILE_TOO_LARGE',
      413,
    )
  }

  // 2. Pipeline Sharp (Chương 1-2 sống ở trong đây)
  let optimized
  try {
    optimized = await optimizeImage(input.buffer, input.mimetype)
  } catch (err) {
    if (err instanceof ImageOptimizationError) {
      // File của người dùng sai → 400, kèm mã cụ thể
      throw new UploadError(err.message, err.code, 400)
    }
    // Thứ gì khác hỏng → 500
    throw new UploadError(
      \`Image optimization failed: \${err.message}\`,
      'OPTIMIZATION_FAILED',
      500,
    )
  }

  // 3. Dựng key — luôn .webp, không bao giờ theo extension của input
  const originalNameForKey = input.originalName.replace(/\\.[^.]+$/, '') + '.webp'
  const key = buildKey(category, originalNameForKey, options)
  const savings = formatSavings(optimized.originalSize, optimized.optimizedSize)

  // 4. Lưu trữ, qua lớp trừu tượng provider
  const stored = await getStorageProvider().put(key, optimized.buffer, optimized.contentType)

  logger.info(
    \`[upload] image \${stored.url} (\${optimized.originalSize}→\${optimized.optimizedSize}B, \${savings})\`,
  )

  return { ...stored, savings, width: optimized.width, height: optimized.height }
}
</code></pre>

<h3>Bốn quyết định trong hàm đó đáng chép lại</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xếp chốt chặn từ rẻ nhất tới đắt nhất</span><span class="lz-d">Kiểm file rỗng là đọc một thuộc tính. Kiểm kích thước là đọc một thuộc tính. Ngân sách pixel cần parse header. Decode cần hàng chục megabyte. Từ chối theo thứ tự đó thì một trận lũ request xấu gần như không tốn gì. Đảo ngược lại thì mọi upload rác đều phải trả tiền cho một lần decode trước khi bị từ chối.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dịch lớp lỗi thành mã HTTP ngay tại ranh giới</span><span class="lz-d">Một <code>ImageOptimizationError</code> nghĩa là file của người dùng sai → 400. Bất cứ gì khác nghĩa là server sai → 500. Đúng một sự phân biệt đó quyết định hệ cảnh báo có gọi ai đó lúc 3 giờ sáng hay không. Làm ngược lại thì hoặc là hỏng câm về phía người dùng, hoặc là người trực bị đánh thức vì ai đó upload một JPEG hỏng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Suy key từ format OUTPUT, không phải input</span><span class="lz-d">Comment nói thẳng: <em>&quot;Luôn lưu output đã tối ưu dưới một key .webp mới, không phải key suy từ extension của input. Nhờ vậy Content-Type ta phục vụ là image/webp và file có đúng format trên đĩa.&quot;</em> Một key <code>.png</code> chứa byte WebP sẽ được phục vụ dưới dạng <code>image/png</code> và không render được ở client nghiêm ngặt.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ghi log mức tiết kiệm ở mọi lần upload</span><span class="lz-d">Dòng <code>originalSize→optimizedSize, savings</code> là một bài test hồi quy miễn phí. Nếu một lần deploy làm hỏng bộ tối ưu và mọi ảnh bắt đầu đi qua nguyên vẹn, dòng log đó chuyển từ &quot;nhỏ hơn 78%&quot; sang &quot;nhỏ hơn 0%&quot; và bạn thấy được nó trên dashboard. Cùng bài học với đường dự phòng loudnorm ở Chương 4: hãy đo một thuộc tính của output, không phải một mã thoát.</span></div>
</div>

<h3>Lớp trừu tượng provider bên dưới</h3>
<pre><code class="language-javascript">const stored = await getStorageProvider().put(key, buffer, contentType)
</code></pre>

<pre><code class="language-text">Không phải "await s3.send(new PutObjectCommand(...))". Lớp gián tiếp mua được:

  Phát triển local      Một provider hệ thống tệp ghi vào ./uploads và
                        phục vụ qua một route static của express. Không
                        cần credential R2 để chạy app.
  Kiểm thử              Một provider trong bộ nhớ khiến test upload nhanh
                        và kín — không mạng, không phải dọn dẹp.
  Migration             Chương 8 của khoá Object Storage (S3 → R2) trở
                        thành một lần tráo provider cộng một lần backfill,
                        không phải viết lại mọi chỗ gọi.

Cái giá là một interface phải duy trì: put/get/delete/readStream/keyFromUrl.
Đó là cái giá nhỏ cho "app chạy được mà không cần tài khoản cloud nào".
</code></pre>

<h3>Chuyện gì xảy ra khi một route đi vòng qua cửa</h3>
<pre><code class="language-text">Đi vòng                         Cái gì hỏng trong im lặng
──────────────────────────────  ─────────────────────────────────────
Route tự gọi sharp()             Không ngân sách pixel (Ch.1), không cổng
                                 concurrency, không xoay EXIF. Decompression
                                 bomb chạy lại được trên đúng route đó.

Route gọi thẳng provider.put()   Không từ chối SVG (Ch.2). Stored XSS
                                 qua bất kỳ route nào quên.

Route tự dựng key                Bố cục key trôi dạt. Phép kiểm quyền sở hữu
                                 &#96;keyBelongsToUser&#96; ngừng chạy vì thiếu
                                 đoạn &#96;u<id>&#96;.

Route phục vụ theo extension     Content-Type sai trên đĩa. Render được ở
của input                        Chrome, hỏng ở client nghiêm ngặt hơn.

Mỗi cái trong số đó là một bug chỉ tồn tại trên route đã đi vòng.
Đó là điều khiến chúng khó tìm: tính năng chạy tốt ở mọi chỗ bạn đã thử.
</code></pre>

<h3>Thi hành nó</h3>
<pre><code class="language-bash"># Một lệnh grep lẽ ra phải trả về KHÔNG GÌ ngoài src/storage/
rg -n --type ts "from 'sharp'|require\\('sharp'\\)" src/ \\
  | rg -v '^src/storage/'

# Tương tự cho việc dùng thẳng provider ngoài upload service
rg -n --type ts 'getStorageProvider\\(\\)\\.put' src/ \\
  | rg -v '^src/storage/uploadService\\.ts'
</code></pre>

<p>Hai lệnh grep trong CI rẻ hơn một quy ước review vốn sẽ bào mòn. Nếu một route mới thật sự cần đi vòng — chẳng hạn một thumbnail do worker nền ghi ra — nước đi đúng là thêm một hàm vào upload service, chứ không phải thêm một ngoại lệ vào lệnh grep.</p>

<h3>Chỗ mà cửa của chính kho có một lối phụ hợp lệ</h3>
<pre><code class="language-javascript">// src/services/video.service.ts — đường thumbnail
const input = {
  buffer: thumbnailBuffer,
  originalName: \`\${path.basename(originalName, inputExt)}-thumbnail.jpg\`,
  mimetype: 'image/jpeg',
  size: thumbnailBuffer.length,
}
const result = await uploadImage(input, 'images/thumbnails', { userId })
</code></pre>

<p>Chú ý cái nó <em>không</em> làm: nó không ghi thẳng JPEG lên R2. FFmpeg sinh ra một JPEG, và JPEG đó quay lại đi qua <code>uploadImage()</code> như mọi upload của người dùng — nên nó nhận được ngân sách pixel, lần re-encode WebP, cổng concurrency, và đoạn quyền sở hữu <code>u&lt;id&gt;</code>. Một file được sinh ra vẫn là một file, và cái cửa áp dụng cho nó luôn.</p>

<div class="pitfall">
<p><strong>Bẫy — một đường upload &quot;nội bộ&quot; bỏ qua validation vì byte được coi là tin cậy.</strong> Cái thumbnail video ở trên <em>đúng là</em> do server sinh ra và có thể lập luận là được phép bỏ qua các phép kiểm. Nó không bỏ qua, và như thế là đúng: input của FFmpeg là một file của người dùng, nên output kế thừa vết nhiễm đó. &quot;Chúng ta sinh ra nó&quot; không đồng nghĩa với &quot;chúng ta kiểm soát kích thước của nó&quot;.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chốt chặn kích thước chỉ đặt ở <code>multer</code>.</strong> <code>limits.fileSize</code> chặn phần thân HTTP, việc đó cần nhưng chưa đủ — nó không nói gì về pixel (quả bom ở Chương 1) và nó không áp dụng cho những buffer do chính mã của bạn sinh ra. Hãy giữ chốt chặn ở bên trong upload service nữa, để mọi điểm vào đều được bao gồm cả những điểm vào nội bộ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Dồn mọi upload — cả do người dùng gửi lẫn do server sinh — qua một module duy nhất sở hữu việc tiền xử lý, dựng key, và lưu trữ, xếp chốt chặn theo thứ tự rẻ-trước, dịch lớp lỗi thành 4xx-hay-5xx ngay tại ranh giới đó, suy key từ format output chứ không phải extension của input, và ghi một dòng log mức tiết kiệm vốn kiêm luôn tín hiệu hồi quy; hãy thi hành bằng một lệnh grep trong CI thay vì bằng quy ước, vì mỗi route đi vòng qua cửa đều tái tạo lại đúng những bug mà Chương 1-4 đã tốn cả độ dài của mình để loại bỏ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/uploadService.ts</span><span class="lc-sub">Ba mối quan tâm, sáu hàm công khai, và thứ tự chốt chặn rẻ-trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/StorageProvider.ts</span><span class="lc-sub">Lớp trừu tượng khiến R2 và local dùng chung một API.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">multer — limits</span><span class="lc-sub">github.com/expressjs/multer#limits — chốt chặn ở tầng HTTP, và vì sao nó chưa đủ.</span></span></div>
</div>
`,
    },


    {
      title: '5.2 — Key design: what the path has to encode|||5.2 — Thiết kế key: đường dẫn phải mã hoá những gì',
      slug: 'mp-5-2-keys',
      type: 'VIDEO',
      description: 'A bucket key is a database index you cannot ALTER. This repo puts category, owner, timestamp, and a random suffix in it — and each of those four is load-bearing.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Key design: what the path has to encode</h2>
<p class="lead">An object key looks like a filename. It is closer to a composite database index — it determines what you can list, what lifecycle rules can match, whether you can prove ownership, and whether two simultaneous uploads collide. Unlike an index, you cannot <code>ALTER</code> it: changing the scheme means rewriting every URL you have ever handed out.</p>

<h3>The rules this repo wrote down</h3>
<pre><code class="language-javascript">// src/storage/keys.ts — the header, verbatim
//
// Centralised "where in the bucket does this file go?" logic.
//
// Putting every key prefix in one place means a refactor
// (e.g. moving avatars to \`users/&lt;id&gt;/avatar/\` instead of
// \`images/avatar/\`) is a one-line change. It also keeps the
// bucket layout documented and reviewable.
//
// Key rules:
//   - lowercase ASCII only, forward slashes for nesting
//   - no leading slash (would produce \`//\` in public URLs)
//   - no trailing slash
//   - extension is preserved on the final segment
//   - random suffix prevents collisions and makes enumeration
//     harder
</code></pre>

<h3>The builder</h3>
<pre><code class="language-javascript">const SAFE_RANDOM_BYTES = 6 // 12 hex chars, plenty for collision avoidance

function randomSuffix() {
  // 6 bytes = 12 hex chars. crypto.randomBytes is sync-block-cheap
  // and avoids the Math.random predictability footgun.
  return randomBytes(SAFE_RANDOM_BYTES).toString('hex')
}

function normalize(key) {
  return key.replace(/\\\\/g, '/').replace(/^\\/+/, '').replace(/\\/+$/, '')
}

export function buildKey(category, originalName, options = {}) {
  const ext = path.extname(originalName).toLowerCase().slice(0, 16) || ''
  const stamp = Date.now()
  const suffix = randomSuffix()
  const filename = \`\${stamp}-\${suffix}\${ext}\`
  const sub = options.subPrefix ? \`\${options.subPrefix}/\` : ''

  // SECURITY: embed the uploader id as a \`u&lt;id&gt;\` path segment so
  // ownership can be verified later (e.g. the orphan-media cleanup
  // endpoint only deletes keys belonging to the caller).
  const owner =
    options.userId != null &amp;&amp; Number.isInteger(options.userId)
      ? \`u\${options.userId}/\`
      : ''

  return normalize(\`\${category}/\${owner}\${sub}\${filename}\`)
}
</code></pre>

<pre><code class="language-text">Produces keys like:

  images/avatar/u42/1735689600000-a3f9c2b17e4d.webp
  │      │      │   │             │            │
  │      │      │   │             │            └─ extension from OUTPUT format
  │      │      │   │             └─ 12 hex chars of crypto randomness
  │      │      │   └─ ms timestamp
  │      │      └─ owner segment (u + user id)
  │      └─ sub-prefix
  └─ category
</code></pre>

<h3>Why each of the four parts is load-bearing</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Category prefix — the unit lifecycle rules and listings work on</span><span class="lz-d">Chapter 6 of the Object Storage course showed lifecycle rules match on prefix. Without a stable category segment you cannot say &quot;expire everything under <code>images/thumbnails/</code> after 90 days&quot; without also matching avatars. Prefix design decides which cleanup policies are even expressible.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Owner segment — ownership you can check without a database round-trip</span><span class="lz-d">The comment names the use case: an orphan-cleanup endpoint that deletes only the caller's keys. With <code>u42</code> in the path, <code>keyBelongsToUser(key, 42)</code> is a string check. Without it, every delete needs a DB lookup to answer &quot;is this yours?&quot;, and a missing lookup is an IDOR — anyone can delete anyone's file by URL.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Timestamp — makes the key sortable and the bucket auditable</span><span class="lz-d">Millisecond epoch sorts lexicographically in the same order it sorts numerically (until the year 2286), so <code>ListObjectsV2</code> returns keys roughly oldest-first. That makes &quot;what got uploaded on the day of the incident&quot; a prefix scan rather than a full listing.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Random suffix — collisions AND enumeration</span><span class="lz-d">Two uploads in the same millisecond would collide on timestamp alone, and on a busy endpoint that is not rare. 12 hex chars is 2⁴⁸ — collision is not a concern. The second benefit is stated in the header: it &quot;makes enumeration harder&quot;. Without it, knowing one URL lets you guess neighbours by incrementing the timestamp.</span></div>
</div>

<h3>The original filename is deliberately discarded</h3>
<pre><code class="language-text">Input:  "Ảnh chụp màn hình 2026-08-24 lúc 14.32.07.png"
Key:    "images/posts/u42/1735689600000-a3f9c2b17e4d.webp"

Everything except the extension is thrown away. That is four separate
wins, and it is worth being explicit about them because the instinct
to "keep the user's filename, it's friendlier" is strong:

  1. No shell/path metacharacters ever reach a key.
     Chapter 3's injection came from a filename flowing into a path.
     Here the filename never reaches the path at all.

  2. No unicode normalization problems.
     "Ảnh" can be encoded two ways (NFC vs NFD) that compare unequal.
     A key containing it is a key you cannot reliably look up.

  3. No information disclosure.
     "Hợp đồng lương Nguyễn Văn A ký 2026.pdf" as a public URL leaks
     the document's contents to anyone who sees the link.

  4. No collisions between users.
     Two people uploading "avatar.png" do not fight over one key.

If you need the original name — and you often do, for the download
filename — store it in the DATABASE alongside the key, and set it
at serve time with Content-Disposition. It belongs in a column,
not in a path.
</code></pre>

<h3>Serving the original name back without putting it in the key</h3>
<pre><code class="language-javascript">// Database row:
//   { id, r2Key: 'documents/u42/1735...-a3f9.pdf',
//     originalName: 'Hợp đồng 2026.pdf', mimeType: 'application/pdf' }

// On download, sign a URL that tells the browser the friendly name:
const url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: BUCKET,
  Key: row.r2Key,
  ResponseContentDisposition:
    \`attachment; filename*=UTF-8''\${encodeURIComponent(row.originalName)}\`,
  ResponseContentType: row.mimeType,
}), { expiresIn: 300 })
</code></pre>

<p>Note <code>filename*=UTF-8''</code> rather than plain <code>filename=</code>. The RFC 5987 form is what makes non-ASCII names — Vietnamese, in this codebase's case — survive the trip. Plain <code>filename=</code> with a UTF-8 string produces mojibake in several browsers.</p>

<h3>The one thing you cannot change later</h3>
<pre><code class="language-text">Every key you write becomes a URL somebody may have saved, embedded
in a document, or stored in a database row you no longer control.

Changing the scheme means, for every existing object:
  - copy to the new key            (Class A op, per object)
  - update every DB reference      (a migration)
  - keep the old key as a redirect (or accept 404s)
  - or dual-write both for a window

The Object Storage course's Chapter 8 covers exactly this shape of
migration. It is entirely avoidable by getting the scheme right at
the start — which is why keys.ts exists as its own file with its
rules written at the top rather than being inlined in the uploader.
</code></pre>

<h3>What a good scheme looks like across a few products</h3>
<pre><code class="language-text">Product type          Key shape                                Why
───────────────────  ──────────────────────────────────────  ─────────────
Social feed           images/posts/u<id>/<ts>-<rand>.webp     owner + time
Multi-tenant SaaS     t<tenant>/documents/<ts>-<rand>.pdf     tenant FIRST,
                                                              so a whole
                                                              tenant is one
                                                              prefix to
                                                              export/delete
Content-addressed     blobs/<sha256[0:2]>/<sha256>.webp       dedupe: same
                                                              bytes = same key
Time-series/logs      logs/2026/08/24/14/<rand>.json.gz       lifecycle by
                                                              date prefix

Note the multi-tenant case puts the tenant BEFORE the category. GDPR
"delete everything for this tenant" becomes one prefix scan. Put the
category first and you must scan every category to find one tenant.
</code></pre>

<div class="pitfall">
<p><strong>Trap — putting the user's filename in the key &quot;so downloads look right&quot;.</strong> It leaks document contents through URLs, breaks on unicode normalization, and is the exact path that Chapter 3's command injection travelled. Store the original name in a database column and apply it at serve time with <code>Content-Disposition: attachment; filename*=UTF-8''...</code>.</p>
</div>

<div class="pitfall">
<p><strong>Trap — timestamp without randomness.</strong> Two uploads in the same millisecond overwrite each other, and the second user silently gets the first user's file. It is rare enough to survive testing and common enough to happen in production within weeks. <code>crypto.randomBytes(6)</code> — not <code>Math.random()</code>, which is predictable and defeats the enumeration-hardening half of the purpose.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A key is a composite index you can never <code>ALTER</code>, so encode the four things you will need later — category prefix (what lifecycle rules and listings can target), owner segment (so ownership is a string check rather than a DB round-trip, and a missing check is an IDOR), millisecond timestamp (sortable, makes incident scans a prefix query), and crypto-random suffix (collisions plus enumeration hardening) — and deliberately discard the user's original filename into a database column, serving it back at download time via <code>Content-Disposition</code> with the RFC 5987 <code>filename*=UTF-8''</code> form.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/keys.ts</span><span class="lc-sub">Năm luật key, <code>buildKey()</code>, và comment SECURITY về đoạn <code>u&lt;id&gt;</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 5987 — Content-Disposition filename*</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc5987 — cách tên file non-ASCII sống sót.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Object key naming guidelines</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html — ký tự an toàn và ký tự nên tránh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Insecure Direct Object Reference</span><span class="lc-sub">owasp.org — vì sao thiếu phép kiểm quyền sở hữu là một lỗ hổng, không phải một thiếu sót nhỏ.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Thiết kế key: đường dẫn phải mã hoá những gì</h2>
<p class="lead">Một object key trông như một tên file. Nó gần với một chỉ mục cơ sở dữ liệu ghép hơn — nó quyết định bạn list được gì, lifecycle rule nào khớp được, bạn có chứng minh được quyền sở hữu không, và hai lần upload đồng thời có đụng nhau không. Khác với chỉ mục, bạn không <code>ALTER</code> được nó: đổi lược đồ nghĩa là viết lại mọi URL bạn từng phát ra.</p>

<h3>Những luật mà kho này viết ra</h3>
<pre><code class="language-javascript">// src/storage/keys.ts — phần đầu, nguyên văn
//
// Logic "file này đi đâu trong bucket?" gom về một chỗ.
//
// Đặt mọi tiền tố key vào một chỗ nghĩa là một lần refactor
// (vd chuyển avatar sang \`users/&lt;id&gt;/avatar/\` thay vì
// \`images/avatar/\`) chỉ là sửa một dòng. Nó cũng giữ bố cục
// bucket được ghi lại và review được.
//
// Luật key:
//   - chỉ ASCII thường, dùng dấu / để lồng cấp
//   - không có dấu / ở đầu (sẽ tạo ra \`//\` trong URL công khai)
//   - không có dấu / ở cuối
//   - extension được giữ ở đoạn cuối cùng
//   - hậu tố ngẫu nhiên ngăn đụng độ và làm việc dò tìm khó hơn
</code></pre>

<h3>Bộ dựng key</h3>
<pre><code class="language-javascript">const SAFE_RANDOM_BYTES = 6 // 12 ký tự hex, thừa đủ để tránh đụng độ

function randomSuffix() {
  // 6 byte = 12 ký tự hex. crypto.randomBytes chặn đồng bộ rất rẻ
  // và tránh được cái bẫy Math.random đoán trước được.
  return randomBytes(SAFE_RANDOM_BYTES).toString('hex')
}

function normalize(key) {
  return key.replace(/\\\\/g, '/').replace(/^\\/+/, '').replace(/\\/+$/, '')
}

export function buildKey(category, originalName, options = {}) {
  const ext = path.extname(originalName).toLowerCase().slice(0, 16) || ''
  const stamp = Date.now()
  const suffix = randomSuffix()
  const filename = \`\${stamp}-\${suffix}\${ext}\`
  const sub = options.subPrefix ? \`\${options.subPrefix}/\` : ''

  // SECURITY: nhúng id người upload thành một đoạn đường dẫn \`u&lt;id&gt;\`
  // để sau này xác minh được quyền sở hữu (vd endpoint dọn media mồ côi
  // chỉ xoá những key thuộc về chính người gọi).
  const owner =
    options.userId != null &amp;&amp; Number.isInteger(options.userId)
      ? \`u\${options.userId}/\`
      : ''

  return normalize(\`\${category}/\${owner}\${sub}\${filename}\`)
}
</code></pre>

<pre><code class="language-text">Sinh ra key kiểu:

  images/avatar/u42/1735689600000-a3f9c2b17e4d.webp
  │      │      │   │             │            │
  │      │      │   │             │            └─ extension từ format OUTPUT
  │      │      │   │             └─ 12 ký tự hex ngẫu nhiên mật mã
  │      │      │   └─ dấu thời gian mili giây
  │      │      └─ đoạn chủ sở hữu (u + id người dùng)
  │      └─ tiền tố con
  └─ danh mục
</code></pre>

<h3>Vì sao cả bốn phần đều chịu lực</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tiền tố danh mục — đơn vị mà lifecycle rule và listing làm việc trên đó</span><span class="lz-d">Chương 6 của khoá Object Storage đã cho thấy lifecycle rule khớp theo tiền tố. Không có một đoạn danh mục ổn định thì bạn không nói được &quot;cho hết hạn mọi thứ dưới <code>images/thumbnails/</code> sau 90 ngày&quot; mà không khớp trúng cả avatar. Thiết kế tiền tố quyết định những chính sách dọn dẹp nào là diễn đạt được.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đoạn chủ sở hữu — quyền sở hữu kiểm được mà không cần vòng gọi database</span><span class="lz-d">Comment nêu đúng trường hợp dùng: một endpoint dọn mồ côi chỉ xoá key của chính người gọi. Có <code>u42</code> trong đường dẫn, <code>keyBelongsToUser(key, 42)</code> là một phép so chuỗi. Không có nó, mọi lần xoá đều cần tra database để trả lời &quot;cái này của bạn à?&quot;, và một lần tra bị thiếu là một lỗ hổng IDOR — ai cũng xoá được file của người khác bằng URL.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dấu thời gian — làm key sắp xếp được và bucket kiểm toán được</span><span class="lz-d">Epoch mili giây sắp xếp theo từ điển cùng thứ tự với sắp xếp theo số (cho tới năm 2286), nên <code>ListObjectsV2</code> trả về key đại khái theo thứ tự cũ-trước. Nhờ vậy &quot;cái gì đã được upload vào ngày xảy ra sự cố&quot; là một lần quét theo tiền tố chứ không phải liệt kê toàn bộ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hậu tố ngẫu nhiên — vừa chống đụng độ VỪA chống dò tìm</span><span class="lz-d">Hai lần upload trong cùng một mili giây sẽ đụng nhau nếu chỉ có dấu thời gian, và trên một endpoint bận thì việc đó không hiếm. 12 ký tự hex là 2⁴⁸ — đụng độ không phải mối lo. Lợi ích thứ hai được nêu ngay ở phần đầu file: nó &quot;làm việc dò tìm khó hơn&quot;. Không có nó, biết một URL là đoán được các URL lân cận bằng cách tăng dấu thời gian.</span></div>
</div>

<h3>Tên file gốc bị vứt bỏ một cách có chủ đích</h3>
<pre><code class="language-text">Input:  "Ảnh chụp màn hình 2026-08-24 lúc 14.32.07.png"
Key:    "images/posts/u42/1735689600000-a3f9c2b17e4d.webp"

Mọi thứ trừ extension đều bị vứt. Đó là bốn cái lợi riêng biệt, và
đáng nói rõ ra vì bản năng "giữ tên file của người dùng cho thân thiện"
là rất mạnh:

  1. Không ký tự đặc biệt shell/đường dẫn nào chạm tới key.
     Vụ injection ở Chương 3 đến từ một tên file chảy vào một đường dẫn.
     Ở đây tên file hoàn toàn không tới được đường dẫn.

  2. Không có vấn đề chuẩn hoá unicode.
     "Ảnh" mã hoá được theo hai cách (NFC vs NFD) mà so ra là khác nhau.
     Một key chứa nó là một key bạn không tra cứu lại được đáng tin cậy.

  3. Không rò rỉ thông tin.
     "Hợp đồng lương Nguyễn Văn A ký 2026.pdf" nằm trong URL công khai
     là rò nội dung tài liệu cho bất kỳ ai thấy đường link.

  4. Không đụng độ giữa những người dùng.
     Hai người cùng upload "avatar.png" không tranh nhau một key.

Nếu bạn cần tên gốc — và bạn thường cần, để đặt tên khi tải xuống —
hãy lưu nó trong DATABASE cạnh cái key, rồi đặt nó lúc phục vụ bằng
Content-Disposition. Nó thuộc về một cột, không phải một đường dẫn.
</code></pre>

<h3>Trả lại tên gốc mà không đặt nó vào key</h3>
<pre><code class="language-javascript">// Dòng trong database:
//   { id, r2Key: 'documents/u42/1735...-a3f9.pdf',
//     originalName: 'Hợp đồng 2026.pdf', mimeType: 'application/pdf' }

// Khi tải xuống, ký một URL nói cho browser biết tên thân thiện:
const url = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: BUCKET,
  Key: row.r2Key,
  ResponseContentDisposition:
    \`attachment; filename*=UTF-8''\${encodeURIComponent(row.originalName)}\`,
  ResponseContentType: row.mimeType,
}), { expiresIn: 300 })
</code></pre>

<p>Chú ý <code>filename*=UTF-8''</code> chứ không phải <code>filename=</code> trần. Dạng theo RFC 5987 mới là cái khiến những cái tên non-ASCII — tiếng Việt, trong trường hợp của kho này — sống sót qua chuyến đi. <code>filename=</code> trần với một chuỗi UTF-8 sinh ra chữ vỡ ở vài trình duyệt.</p>

<h3>Điều duy nhất bạn không sửa lại được về sau</h3>
<pre><code class="language-text">Mỗi key bạn ghi ra đều trở thành một URL mà ai đó có thể đã lưu lại,
nhúng vào một tài liệu, hoặc cất trong một dòng database bạn không còn
kiểm soát.

Đổi lược đồ nghĩa là, với từng object đang có:
  - copy sang key mới              (một Class A op, mỗi object)
  - cập nhật mọi tham chiếu DB     (một migration)
  - giữ key cũ làm redirect        (hoặc chấp nhận 404)
  - hoặc dual-write cả hai một thời gian

Chương 8 của khoá Object Storage nói đúng về hình dạng migration này.
Nó hoàn toàn tránh được bằng cách làm đúng lược đồ ngay từ đầu — đó là
vì sao keys.ts tồn tại như một file riêng với các luật viết ở đầu file
thay vì được nhét thẳng vào bộ upload.
</code></pre>

<h3>Một lược đồ tốt trông thế nào qua vài loại sản phẩm</h3>
<pre><code class="language-text">Loại sản phẩm         Hình dạng key                            Vì sao
───────────────────  ──────────────────────────────────────  ─────────────
Feed mạng xã hội      images/posts/u<id>/<ts>-<rand>.webp     chủ sở hữu + thời gian
SaaS nhiều tenant     t<tenant>/documents/<ts>-<rand>.pdf     tenant đứng ĐẦU,
                                                              nên cả một tenant
                                                              là một tiền tố để
                                                              export/xoá
Địa chỉ theo nội dung blobs/<sha256[0:2]>/<sha256>.webp       khử trùng lặp: cùng
                                                              byte = cùng key
Chuỗi thời gian/log   logs/2026/08/24/14/<rand>.json.gz       lifecycle theo tiền
                                                              tố ngày

Chú ý trường hợp nhiều tenant đặt tenant TRƯỚC danh mục. Yêu cầu GDPR
"xoá mọi thứ của tenant này" trở thành một lần quét tiền tố. Đặt danh
mục lên trước thì bạn phải quét mọi danh mục để tìm ra một tenant.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — đặt tên file của người dùng vào key &quot;cho lúc tải xuống nhìn đúng&quot;.</strong> Nó rò nội dung tài liệu qua URL, hỏng vì chuẩn hoá unicode, và chính là con đường mà vụ command injection ở Chương 3 đã đi qua. Hãy lưu tên gốc vào một cột database và áp nó lúc phục vụ bằng <code>Content-Disposition: attachment; filename*=UTF-8''...</code>.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dấu thời gian mà không có phần ngẫu nhiên.</strong> Hai lần upload trong cùng một mili giây ghi đè lên nhau, và người dùng thứ hai âm thầm nhận được file của người thứ nhất. Nó đủ hiếm để sống sót qua kiểm thử và đủ phổ biến để xảy ra trên production trong vài tuần. Dùng <code>crypto.randomBytes(6)</code> — không phải <code>Math.random()</code>, vốn đoán trước được và phá hỏng nửa mục đích chống-dò-tìm.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một key là một chỉ mục ghép mà bạn không bao giờ <code>ALTER</code> được, nên hãy mã hoá vào đó bốn thứ bạn sẽ cần sau này — tiền tố danh mục (thứ mà lifecycle rule và listing nhắm tới được), đoạn chủ sở hữu (để quyền sở hữu là một phép so chuỗi thay vì một vòng gọi DB, và thiếu phép kiểm đó là một IDOR), dấu thời gian mili giây (sắp xếp được, biến việc quét sự cố thành một truy vấn theo tiền tố), và hậu tố ngẫu nhiên mật mã (chống đụng độ cộng chống dò tìm) — rồi chủ động vứt tên file gốc của người dùng vào một cột database, trả nó lại lúc tải xuống qua <code>Content-Disposition</code> với dạng RFC 5987 <code>filename*=UTF-8''</code>.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/keys.ts</span><span class="lc-sub">Năm luật key, <code>buildKey()</code>, và comment SECURITY về đoạn <code>u&lt;id&gt;</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 5987 — Content-Disposition filename*</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc5987 — cách tên file non-ASCII sống sót.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS — Object key naming guidelines</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html — ký tự an toàn và ký tự nên tránh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Insecure Direct Object Reference</span><span class="lc-sub">owasp.org — vì sao thiếu phép kiểm quyền sở hữu là một lỗ hổng, không phải một thiếu sót nhỏ.</span></span></div>
</div>
`,
    },


    {
      title: '5.3 — Background jobs: status, retries, and the orphan problem|||5.3 — Job nền: trạng thái, retry, và vấn đề mồ côi',
      slug: 'mp-5-3-jobs',
      type: 'VIDEO',
      description: 'Video encoding cannot run on the request. Moving it to a queue introduces four new problems — status, idempotency, retries, and orphaned objects — and this repo already tracks the last one.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Background jobs: status, retries, and the orphan problem</h2>
<p class="lead">Lesson 0.2 established that video always goes to a background job. That decision is correct and it is not free: the moment the work leaves the request, you owe the user a way to see progress, you owe yourself idempotent retries, and you owe the bucket a cleanup story for uploads that were abandoned halfway.</p>

<h3>The state machine you now have to model</h3>
<pre><code class="language-text">                    ┌──────────┐
   POST /upload  →  │ PENDING  │  raw file in R2, row written, job queued
                    └────┬─────┘
                         │ worker picks it up
                    ┌────▼─────┐
                    │PROCESSING│  ← must be visible to the user
                    └────┬─────┘
              ┌──────────┼──────────┐
              │          │          │
        ┌─────▼───┐ ┌────▼────┐ ┌───▼────┐
        │  READY  │ │ FAILED  │ │ORPHANED│
        └─────────┘ └─────────┘ └────────┘
         variants     retries      user never
         written      exhausted    finished the post

Four states, not two. The instinct is PENDING → READY; the two extra
states are where all the operational pain lives.
</code></pre>

<h3>The orphan state, which this repo already tracks</h3>
<pre><code class="language-javascript">// src/routes/upload.routes.ts
//
// ─── Track pending video upload for cleanup ──────────────────────
// For videos, record in pending_uploads so orphaned R2 objects
// from interrupted posts can be cleaned up by the cron job.
const pendingExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
const videoKey = result.key || result.url?.split('/').pop() || ''
if (videoKey) {
  // ... insert into pending_uploads with the 24h expiry
}
</code></pre>

<pre><code class="language-text">The scenario it defends against:

  1. User opens the composer, picks a 40 MB video
  2. Upload completes → object exists in R2, URL returned to the browser
  3. User gets distracted, closes the tab, never presses "Post"
  4. No database row ever references that object

Without pending_uploads, that 40 MB is billed forever and no code path
can reach it — Orphan A from the Object Storage course, Chapter 6.3.

With it: the row is inserted at upload time with a 24-hour expiry, the
post-creation path deletes the row (claiming the object), and a cron
job deletes any object whose pending row is still there past expiry.

The key insight is that the record is written BEFORE the object is
claimed, not after. A cleanup list you build later cannot know about
uploads that were never referenced.
</code></pre>

<h3>Making the job idempotent</h3>
<pre><code class="language-javascript">// A job WILL run twice. The queue redelivers on worker crash, on
// visibility-timeout expiry, on a deploy that restarts mid-job.
// Design for it rather than hoping.

async function processVideo(jobData) {
  const { attachmentId } = jobData

  const row = await prisma.attachment.findUnique({ where: { id: attachmentId } })
  if (!row) return                       // deleted while queued — nothing to do
  if (row.status === 'READY') return     // already done — the retry is a no-op

  // Derive output keys DETERMINISTICALLY from the input key.
  // Do NOT call buildKey() here: it embeds Date.now() + randomBytes,
  // so a retry would write a SECOND set of variants and orphan the first.
  const outKey = (rung) =&gt; \`\${row.r2Key.replace(/\\.[^.]+$/, '')}-\${rung}.mp4\`

  await prisma.attachment.update({
    where: { id: attachmentId },
    data: { status: 'PROCESSING', startedAt: new Date() },
  })

  const produced = []
  for (const rung of LADDER) {
    const key = outKey(rung.name)
    // Overwriting the same key on a retry is harmless and idempotent.
    await transcodeAndPut(row.r2Key, key, rung)
    produced.push({ name: rung.name, key })
  }

  await prisma.attachment.update({
    where: { id: attachmentId },
    data: { status: 'READY', variants: produced, finishedAt: new Date() },
  })
}
</code></pre>

<p>The load-bearing line is the comment about <code>buildKey()</code>. Lesson 5.2's key builder is deliberately non-deterministic — timestamp plus randomness — which is exactly right for user uploads and exactly wrong inside a retryable job. Derive worker outputs from the input key instead, so the second run overwrites the first rather than doubling your storage.</p>

<h3>Retry policy: which failures deserve one</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Retry: infrastructure</span><span class="lz-d">R2 returned 500, the network dropped mid-download, the worker was killed by a deploy, the disk was briefly full. These are transient by nature. Exponential backoff, 3-5 attempts.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Do NOT retry: the input</span><span class="lz-d">FFmpeg says &quot;Invalid data found when processing input&quot;. The file is a corrupt or unsupported container, and it will be exactly as corrupt on attempt five. Mark FAILED immediately with the stderr tail so support can tell the user what to re-upload. Retrying wastes five encode timeouts per bad file.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Retry once, then fail loudly: the ambiguous middle</span><span class="lz-d">A timeout could be a huge-but-valid file or an adversarial one. One retry distinguishes a transient stall from a genuinely unprocessable input, and capping at one stops a pathological file from occupying a worker forever.</span></div>
</div>

<pre><code class="language-javascript">// Classify before deciding
function isRetryable(err) {
  const msg = String(err?.message ?? '')
  if (/Invalid data found|moov atom not found|Unknown format/i.test(msg)) {
    return false                        // the file is wrong; retrying cannot help
  }
  if (/ECONNRESET|ETIMEDOUT|503|500|SlowDown/i.test(msg)) {
    return true                         // infrastructure; back off and retry
  }
  return false                          // unknown → fail loudly rather than loop
}
</code></pre>

<p>Default-to-false on unknown errors is deliberate. An unrecognised failure that gets retried five times is five times the cost and five times the log noise for a bug you have not diagnosed yet; failing once puts it in front of you.</p>

<h3>Showing progress to the user</h3>
<pre><code class="language-text">Three ways to get status to the browser, in increasing order of effort:

  Polling         GET /attachments/:id every 3 s until status !== PROCESSING
                  Simplest. Fine when jobs take seconds. At 10k concurrent
                  uploads it is 3,300 req/s of pure polling.

  SSE             GET /attachments/:id/events, server pushes on change
                  One connection per waiting client, no polling storm.
                  Works through most proxies. No client library needed.

  WebSocket       The Socket.IO course covers this in depth. Right answer
                  if you already have a socket for other reasons — wrong
                  answer if you would add one just for upload progress.

For a video that takes 30-60 s, polling every 3 s is 10-20 requests per
upload and needs no new infrastructure. Reach for SSE when the poll
volume shows up in your metrics, not before.
</code></pre>

<pre><code class="language-javascript">// Reporting real progress from FFmpeg (Chapter 3.3's -progress flag)
proc.stderr.on('data', (chunk) =&gt; {
  const m = String(chunk).match(/out_time_ms=(\\d+)/)
  if (!m) return
  const pct = Math.min(100, (Number(m[1]) / 1e6 / totalSeconds) * 100)

  // Throttle DB writes — FFmpeg emits progress many times a second
  // and a row update per emit will saturate the connection pool.
  if (pct - lastReported &gt;= 5) {
    lastReported = pct
    void prisma.attachment.update({
      where: { id: attachmentId },
      data: { progress: Math.round(pct) },
    })
  }
})
</code></pre>

<h3>Concurrency, one level up</h3>
<pre><code class="language-text">Chapter 1 gated Sharp at 4 concurrent decodes INSIDE one process.
A worker pool needs the same discipline one level up:

  Workers × ffmpeg threads = total CPU demand

  4 workers × ffmpeg using all 6 cores each = 24 threads on a 6-core box
  → everything thrashes, each encode takes 4× longer, nothing finishes sooner

  Better on a 6-core VPS:
    2 workers × -threads 3   = 6 threads, fully used, predictable latency

FFmpeg defaults to using every core. In a worker pool that default is
wrong — pass -threads explicitly and size it as cores ÷ workers.
</code></pre>

<div class="pitfall">
<p><strong>Trap — calling the non-deterministic key builder inside a retryable job.</strong> <code>buildKey()</code> embeds <code>Date.now()</code> and random bytes, so a redelivered job writes a whole second set of variants under fresh keys. The DB points at the newest set and the earlier ones become orphans that no cleanup job knows about. Derive worker output keys from the input key.</p>
</div>

<div class="pitfall">
<p><strong>Trap — assuming a job runs exactly once.</strong> Every queue worth using is at-least-once. Worker crashes, visibility timeouts, and mid-job deploys all redeliver. The status check at the top of the handler (<code>if (row.status === 'READY') return</code>) costs one query and turns a duplicate delivery into a no-op.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Moving encoding to a queue means modelling four states rather than two — the extra two, FAILED and ORPHANED, are where the operational cost lives — so record a <code>pending_uploads</code> row at upload time (before the object is claimed, since a cleanup list built later cannot see never-referenced uploads), make the job idempotent by deriving output keys deterministically from the input key rather than calling the timestamp-and-random key builder, classify errors so corrupt inputs fail immediately while infrastructure errors back off, throttle progress writes, and size <code>-threads</code> as cores ÷ workers so the pool does not thrash.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/routes/upload.routes.ts</span><span class="lc-sub">Bảng <code>pending_uploads</code> với hạn 24 giờ và cron dọn mồ côi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">BullMQ — retries and backoff</span><span class="lc-sub">docs.bullmq.io/guide/retrying-failing-jobs — chính sách retry và job chết.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Server-Sent Events</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Server-sent_events — thay cho polling khi lượng poll thành vấn đề.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Object Storage course — Chapter 6.3</span><span class="lc-sub">Reconciliation hai chiều cho object mồ côi, và vì sao cần hai lượt trước khi xoá.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Job nền: trạng thái, retry, và vấn đề mồ côi</h2>
<p class="lead">Bài 0.2 đã xác lập rằng video luôn đi vào job nền. Quyết định đó đúng và nó không miễn phí: khoảnh khắc công việc rời khỏi request, bạn nợ người dùng một cách để nhìn thấy tiến độ, nợ chính mình những lần retry idempotent, và nợ cái bucket một câu chuyện dọn dẹp cho những lần upload bị bỏ dở giữa chừng.</p>

<h3>Máy trạng thái mà giờ bạn phải mô hình hoá</h3>
<pre><code class="language-text">                    ┌──────────┐
   POST /upload  →  │ PENDING  │  file thô trong R2, đã ghi dòng, đã xếp job
                    └────┬─────┘
                         │ worker nhận việc
                    ┌────▼─────┐
                    │PROCESSING│  ← phải cho người dùng thấy được
                    └────┬─────┘
              ┌──────────┼──────────┐
              │          │          │
        ┌─────▼───┐ ┌────▼────┐ ┌───▼────┐
        │  READY  │ │ FAILED  │ │MỒ CÔI  │
        └─────────┘ └─────────┘ └────────┘
         variant      hết lượt    người dùng
         đã ghi       retry       không bao giờ
                                  đăng bài

Bốn trạng thái, không phải hai. Bản năng là PENDING → READY; hai trạng
thái thừa ra kia mới là nơi chứa toàn bộ nỗi đau vận hành.
</code></pre>

<h3>Trạng thái mồ côi, thứ mà kho này đã theo dõi sẵn</h3>
<pre><code class="language-javascript">// src/routes/upload.routes.ts
//
// ─── Theo dõi video upload đang chờ để dọn dẹp ──────────────────
// Với video, ghi vào pending_uploads để những object R2 mồ côi
// từ các bài đăng bị gián đoạn có thể được cron job dọn.
const pendingExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
const videoKey = result.key || result.url?.split('/').pop() || ''
if (videoKey) {
  // ... chèn vào pending_uploads với hạn 24 giờ
}
</code></pre>

<pre><code class="language-text">Kịch bản mà nó phòng thủ:

  1. Người dùng mở khung soạn bài, chọn một video 40 MB
  2. Upload xong → object tồn tại trong R2, URL trả về cho trình duyệt
  3. Người dùng bị phân tâm, đóng tab, không bao giờ bấm "Đăng"
  4. Không dòng database nào từng tham chiếu tới object đó

Không có pending_uploads, 40 MB đó bị tính tiền vĩnh viễn và không đường
mã nào chạm tới được — Mồ côi A trong khoá Object Storage, Chương 6.3.

Có nó: dòng được chèn lúc upload với hạn 24 giờ, đường tạo bài đăng xoá
dòng đó (nhận quyền sở hữu object), và một cron job xoá mọi object có
dòng pending còn nằm đó quá hạn.

Điểm mấu chốt là bản ghi được viết TRƯỚC khi object được nhận, không
phải sau. Một danh sách dọn dẹp bạn dựng về sau không thể biết về những
lần upload chưa bao giờ được tham chiếu.
</code></pre>

<h3>Làm cho job idempotent</h3>
<pre><code class="language-javascript">// Một job SẼ chạy hai lần. Hàng đợi giao lại khi worker chết, khi
// visibility-timeout hết hạn, khi một lần deploy khởi động lại giữa job.
// Hãy thiết kế cho điều đó thay vì hy vọng.

async function processVideo(jobData) {
  const { attachmentId } = jobData

  const row = await prisma.attachment.findUnique({ where: { id: attachmentId } })
  if (!row) return                       // đã bị xoá khi đang xếp hàng — không có gì làm
  if (row.status === 'READY') return     // đã xong — lần retry này là no-op

  // Suy key output một cách TẤT ĐỊNH từ key input.
  // ĐỪNG gọi buildKey() ở đây: nó nhúng Date.now() + randomBytes,
  // nên một lần retry sẽ ghi ra bộ variant THỨ HAI và làm mồ côi bộ đầu.
  const outKey = (rung) =&gt; \`\${row.r2Key.replace(/\\.[^.]+$/, '')}-\${rung}.mp4\`

  await prisma.attachment.update({
    where: { id: attachmentId },
    data: { status: 'PROCESSING', startedAt: new Date() },
  })

  const produced = []
  for (const rung of LADDER) {
    const key = outKey(rung.name)
    // Ghi đè cùng một key khi retry là vô hại và idempotent.
    await transcodeAndPut(row.r2Key, key, rung)
    produced.push({ name: rung.name, key })
  }

  await prisma.attachment.update({
    where: { id: attachmentId },
    data: { status: 'READY', variants: produced, finishedAt: new Date() },
  })
}
</code></pre>

<p>Dòng chịu lực là cái comment về <code>buildKey()</code>. Bộ dựng key ở Bài 5.2 cố ý không tất định — dấu thời gian cộng phần ngẫu nhiên — điều đó chính xác là đúng với upload của người dùng và chính xác là sai bên trong một job có thể retry. Thay vào đó hãy suy key output của worker từ key input, để lần chạy thứ hai ghi đè lên lần đầu chứ không nhân đôi dung lượng lưu trữ.</p>

<h3>Chính sách retry: thất bại nào xứng đáng được retry</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Retry: hạ tầng</span><span class="lz-d">R2 trả 500, mạng đứt giữa lúc tải, worker bị một lần deploy giết, đĩa đầy trong chốc lát. Những thứ này bản chất là thoáng qua. Backoff luỹ thừa, 3-5 lần thử.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">ĐỪNG retry: bản thân input</span><span class="lz-d">FFmpeg nói &quot;Invalid data found when processing input&quot;. File là một container hỏng hoặc không hỗ trợ, và nó sẽ hỏng y hệt như vậy ở lần thử thứ năm. Đánh dấu FAILED ngay lập tức kèm phần đuôi stderr để bộ phận hỗ trợ nói được cho người dùng biết cần upload lại cái gì. Retry là lãng phí năm lần timeout encode cho mỗi file hỏng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Retry một lần rồi báo lỗi to: khoảng giữa mập mờ</span><span class="lz-d">Một lần timeout có thể là một file rất lớn nhưng hợp lệ, hoặc một file thù địch. Một lần retry phân biệt được một lần khựng thoáng qua với một input thật sự không xử lý nổi, và chặn ở một lần ngăn một file bệnh lý chiếm một worker mãi mãi.</span></div>
</div>

<pre><code class="language-javascript">// Phân loại trước khi quyết định
function isRetryable(err) {
  const msg = String(err?.message ?? '')
  if (/Invalid data found|moov atom not found|Unknown format/i.test(msg)) {
    return false                        // file sai; retry không giúp được
  }
  if (/ECONNRESET|ETIMEDOUT|503|500|SlowDown/i.test(msg)) {
    return true                         // hạ tầng; lùi lại và thử lại
  }
  return false                          // không rõ → báo lỗi to thay vì lặp
}
</code></pre>

<p>Mặc định trả false với lỗi không rõ là có chủ đích. Một thất bại chưa nhận diện được mà bị retry năm lần là năm lần chi phí và năm lần tiếng ồn trong log cho một bug bạn còn chưa chẩn đoán; thất bại một lần đặt nó ngay trước mặt bạn.</p>

<h3>Cho người dùng thấy tiến độ</h3>
<pre><code class="language-text">Ba cách đưa trạng thái tới trình duyệt, theo thứ tự công sức tăng dần:

  Polling         GET /attachments/:id mỗi 3 s tới khi status !== PROCESSING
                  Đơn giản nhất. Ổn khi job mất vài giây. Ở 10k upload
                  đồng thời thì đó là 3.300 req/s thuần polling.

  SSE             GET /attachments/:id/events, server đẩy khi có thay đổi
                  Một kết nối cho mỗi client đang chờ, không có bão polling.
                  Chạy qua được hầu hết proxy. Không cần thư viện client.

  WebSocket       Khoá Socket.IO nói sâu về cái này. Là câu trả lời đúng
                  nếu bạn vốn đã có một socket vì lý do khác — là câu trả
                  lời sai nếu bạn thêm một cái chỉ để báo tiến độ upload.

Với một video mất 30-60 s, poll mỗi 3 s là 10-20 request mỗi lần upload
và không cần hạ tầng mới nào. Hãy với tới SSE khi lượng poll hiện ra
trong số liệu của bạn, đừng làm trước.
</code></pre>

<pre><code class="language-javascript">// Báo tiến độ thật từ FFmpeg (cờ -progress ở Chương 3.3)
proc.stderr.on('data', (chunk) =&gt; {
  const m = String(chunk).match(/out_time_ms=(\\d+)/)
  if (!m) return
  const pct = Math.min(100, (Number(m[1]) / 1e6 / totalSeconds) * 100)

  // Tiết chế việc ghi DB — FFmpeg phát tiến độ nhiều lần mỗi giây
  // và cập nhật một dòng cho mỗi lần phát sẽ làm bão hoà connection pool.
  if (pct - lastReported &gt;= 5) {
    lastReported = pct
    void prisma.attachment.update({
      where: { id: attachmentId },
      data: { progress: Math.round(pct) },
    })
  }
})
</code></pre>

<h3>Concurrency, ở một cấp cao hơn</h3>
<pre><code class="language-text">Chương 1 chặn Sharp ở 4 lần decode đồng thời BÊN TRONG một tiến trình.
Một pool worker cần đúng kỷ luật đó ở cấp cao hơn một bậc:

  Số worker × số thread ffmpeg = tổng nhu cầu CPU

  4 worker × ffmpeg dùng cả 6 nhân mỗi cái = 24 thread trên máy 6 nhân
  → mọi thứ giành giật nhau, mỗi lần encode lâu gấp 4, không cái nào
    xong sớm hơn

  Tốt hơn trên một VPS 6 nhân:
    2 worker × -threads 3   = 6 thread, dùng hết, độ trễ đoán được

FFmpeg mặc định dùng mọi nhân. Trong một pool worker thì mặc định đó
là sai — hãy truyền -threads tường minh và đặt bằng số nhân ÷ số worker.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — gọi bộ dựng key không tất định bên trong một job có thể retry.</strong> <code>buildKey()</code> nhúng <code>Date.now()</code> và byte ngẫu nhiên, nên một job được giao lại sẽ ghi ra nguyên một bộ variant thứ hai dưới những key mới. DB trỏ vào bộ mới nhất và những bộ trước đó thành mồ côi mà không job dọn dẹp nào biết tới. Hãy suy key output của worker từ key input.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — giả định một job chạy đúng một lần.</strong> Mọi hàng đợi đáng dùng đều là at-least-once. Worker chết, visibility timeout, và deploy giữa chừng đều gây giao lại. Phép kiểm trạng thái ở đầu handler (<code>if (row.status === 'READY') return</code>) tốn một truy vấn và biến một lần giao trùng thành một no-op.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Đưa việc encode vào hàng đợi nghĩa là phải mô hình hoá bốn trạng thái chứ không phải hai — hai cái thừa ra, FAILED và MỒ CÔI, mới là nơi chứa chi phí vận hành — nên hãy ghi một dòng <code>pending_uploads</code> ngay lúc upload (trước khi object được nhận, vì một danh sách dọn dẹp dựng về sau không thấy được những lần upload chưa bao giờ được tham chiếu), làm job idempotent bằng cách suy key output một cách tất định từ key input thay vì gọi bộ dựng key có dấu-thời-gian-và-ngẫu-nhiên, phân loại lỗi để input hỏng thất bại ngay còn lỗi hạ tầng thì lùi lại thử lại, tiết chế việc ghi tiến độ, và đặt <code>-threads</code> bằng số nhân ÷ số worker để pool không giành giật nhau.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/routes/upload.routes.ts</span><span class="lc-sub">Bảng <code>pending_uploads</code> với hạn 24 giờ và cron dọn mồ côi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">BullMQ — retries and backoff</span><span class="lc-sub">docs.bullmq.io/guide/retrying-failing-jobs — chính sách retry và job chết.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Server-Sent Events</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/API/Server-sent_events — thay cho polling khi lượng poll thành vấn đề.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Khoá Object Storage — Chương 6.3</span><span class="lc-sub">Reconciliation hai chiều cho object mồ côi, và vì sao cần hai lượt trước khi xoá.</span></span></div>
</div>
`,
    },

    {
      title: '5.4 — Chapter 5 quiz|||5.4 — Kiểm tra Chương 5',
      slug: 'mp-5-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về pipeline, key, và job nền.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 5 · Quiz</span><h2>What Chapter 5 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 5 · Kiểm tra</span><h2>Chương 5 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'A new route calls <code>sharp()</code> and <code>provider.put()</code> directly instead of <code>uploadImage()</code>. What breaks — and only on that route?|||Một route mới gọi thẳng <code>sharp()</code> và <code>provider.put()</code> thay vì <code>uploadImage()</code>. Cái gì hỏng — và chỉ hỏng trên route đó?',
            options: [
              'The pixel budget and concurrency gate (so the decompression bomb works again), EXIF rotation, the SVG rejection, the u&lt;id&gt; ownership segment, and the output-format key rule. Each is a bug that exists only on the bypassing route, which is what makes them hard to find — the feature works everywhere you tested. Enforce with a CI grep, not a review convention.|||Ngân sách pixel và cổng concurrency (nên decompression bomb chạy lại được), xoay EXIF, việc từ chối SVG, đoạn quyền sở hữu u&lt;id&gt;, và luật key theo format output. Mỗi cái là một bug chỉ tồn tại trên route đi vòng, đó là điều khiến chúng khó tìm — tính năng chạy tốt ở mọi chỗ bạn đã thử. Hãy thi hành bằng grep trong CI, không phải bằng quy ước review.',
              'Nothing — Sharp applies its own defaults|||Không gì — Sharp tự áp mặc định của nó',
              'Only the logging line is lost|||Chỉ mất dòng log',
              'The route will fail to compile|||Route sẽ không biên dịch được',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Why does <code>buildKey()</code> throw away the user\'s original filename and keep only the extension?|||Vì sao <code>buildKey()</code> vứt bỏ tên file gốc của người dùng và chỉ giữ extension?',
            options: [
              'Four reasons: no shell/path metacharacters ever reach a key (the Chapter 3 injection travelled exactly that path), no NFC-vs-NFD unicode lookup problems, no information disclosure through public URLs, and no collisions between users uploading "avatar.png". Store the original name in a DB column and apply it at download time via Content-Disposition with the RFC 5987 filename*=UTF-8\'\' form.|||Bốn lý do: không ký tự đặc biệt shell/đường dẫn nào chạm tới key (vụ injection Chương 3 đi đúng con đường đó), không có vấn đề tra cứu unicode NFC-vs-NFD, không rò rỉ thông tin qua URL công khai, và không đụng độ giữa những người cùng upload "avatar.png". Lưu tên gốc vào một cột DB và áp lúc tải xuống qua Content-Disposition với dạng RFC 5987 filename*=UTF-8\'\'.',
              'Only to keep keys short|||Chỉ để key ngắn gọn',
              'Because S3 rejects non-ASCII keys|||Vì S3 từ chối key non-ASCII',
              'To make lifecycle rules simpler|||Để lifecycle rule đơn giản hơn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A transcode worker calls <code>buildKey()</code> to name its output variants. The queue redelivers the job. What happens?|||Một worker transcode gọi <code>buildKey()</code> để đặt tên cho variant output. Hàng đợi giao lại job đó. Chuyện gì xảy ra?',
            options: [
              'buildKey() embeds Date.now() and random bytes, so the retry writes a SECOND complete set of variants under fresh keys. The DB points at the newest set; the first set becomes orphans no cleanup job knows about. Derive worker output keys deterministically from the input key so a retry overwrites rather than duplicates.|||buildKey() nhúng Date.now() và byte ngẫu nhiên, nên lần retry ghi ra nguyên một bộ variant THỨ HAI dưới key mới. DB trỏ vào bộ mới nhất; bộ đầu thành mồ côi mà không job dọn dẹp nào biết. Hãy suy key output của worker một cách tất định từ key input để lần retry ghi đè chứ không nhân đôi.',
              'Nothing — the queue guarantees exactly-once delivery|||Không gì — hàng đợi bảo đảm giao đúng một lần',
              'The job fails with a duplicate-key error|||Job thất bại với lỗi trùng key',
              'The second run is automatically skipped|||Lần chạy thứ hai tự động bị bỏ qua',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A user uploads a 40 MB video, then closes the tab without posting. How does the repo stop that object being billed forever?|||Một người dùng upload video 40 MB, rồi đóng tab mà không đăng bài. Kho này ngăn object đó bị tính tiền vĩnh viễn bằng cách nào?',
            options: [
              'A pending_uploads row is written AT UPLOAD TIME with a 24-hour expiry, before the object is claimed. Creating the post deletes the row; a cron job deletes any object whose pending row is still there past expiry. Writing the record before the claim is the key — a cleanup list built later cannot see uploads that were never referenced by any row.|||Một dòng pending_uploads được ghi NGAY LÚC UPLOAD với hạn 24 giờ, trước khi object được nhận. Việc tạo bài đăng sẽ xoá dòng đó; một cron job xoá mọi object có dòng pending còn nằm đó quá hạn. Ghi bản ghi trước khi nhận mới là mấu chốt — một danh sách dọn dẹp dựng về sau không thấy được những lần upload chưa từng được dòng nào tham chiếu.',
              'A lifecycle rule expires everything after 24 hours|||Một lifecycle rule cho mọi thứ hết hạn sau 24 giờ',
              'The browser deletes it on tab close|||Trình duyệt xoá nó khi đóng tab',
              'It is not handled — the object leaks|||Không được xử lý — object bị rò',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
