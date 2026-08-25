const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 6 — What media actually costs|||Chương 6 — Media thực sự tốn bao nhiêu',
  slug: 'mp-ch6-cost',
  description: 'Ba bài về chi phí thật: CPU là hoá đơn bị bỏ quên, đo trước khi tối ưu, và kiểm tra.',
  sortOrder: 7,
  lessons: [

    {
      title: '6.1 — CPU is the bill nobody budgets for|||6.1 — CPU là hoá đơn không ai dự trù',
      slug: 'mp-6-1-cpu',
      type: 'VIDEO',
      description: 'The Object Storage course costed bytes. Media adds a second axis: seconds of CPU per upload. On a 6 GB VPS that axis runs out long before storage does.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>CPU is the bill nobody budgets for</h2>
<p class="lead">The Object Storage course reduced everything to five line items, all measured in bytes and requests. Media processing adds an axis that does not appear on a cloud invoice at all: CPU-seconds. On a fixed-size VPS that axis is what actually runs out — not disk, not bandwidth — and it runs out as a queue backing up rather than as a bill arriving.</p>

<h3>The two cost models, side by side</h3>
<pre><code class="language-text">SERVERLESS / PER-INVOCATION            FIXED VPS (this repo)
──────────────────────────────────    ────────────────────────────────
CPU is metered and billed              CPU is already paid for, monthly
Scales to zero                         Always running, always costing
Runs out of MONEY                      Runs out of THROUGHPUT
A slow encode = a bigger invoice       A slow encode = a longer queue
Symptom: finance notices               Symptom: users notice

Both are real constraints. But they fail in completely different ways,
and the second one is easy to miss because nothing sends you a bill.
</code></pre>

<h3>Measured per-operation costs, from Chapters 1-4</h3>
<pre><code class="language-text">Operation                          CPU time    Peak RSS   Source
────────────────────────────────  ──────────  ─────────  ──────────
Sharp: 12 MP JPEG → WebP q80         180 ms      +53 MB   Lesson 1.1
Sharp: same at effort 6              624 ms      +53 MB   Lesson 2.3
Sharp: AVIF q50                    2,300 ms      +53 MB   Lesson 0.1
Sharp: 48-frame GIF → animated WebP  ~900 ms     +180 MB  Lesson 2.2
Sharp: 210-frame screencast        4,100 ms      +600 MB  Lesson 2.2
FFmpeg: thumbnail, -ss before -i      90 ms       ~40 MB  Lesson 3.2
FFmpeg: thumbnail, -ss after -i    38,000 ms      ~40 MB  Lesson 3.2
FFmpeg: 2-min 1080p, preset veryfast 19,000 ms   ~200 MB  Lesson 3.3
FFmpeg: same at preset medium       81,000 ms    ~200 MB  Lesson 3.3
FFmpeg: loudnorm 2-pass, 4-min MP3  ~6,000 ms     ~80 MB  Chapter 4

Read the FFmpeg rows next to the Sharp rows. An image is a fifth of a
second. A video is twenty to eighty seconds. They are not the same
kind of work and they must not share a worker pool.
</code></pre>

<h3>What a 6 GB / 6-core VPS can actually sustain</h3>
<pre><code class="language-text">Images, upload-time, Sharp gated at 4 concurrent (Lesson 1.2):

  4 concurrent × (1000 ms ÷ 180 ms) = ~22 images/second sustained
  Peak RSS from image work: 4 × 53 MB = 212 MB

  That is comfortable. Images are not the problem.

Video, background workers, preset veryfast:

  A 2-minute 1080p clip = 19 s of CPU
  6 cores ÷ 3 threads per worker = 2 workers
  2 workers × (3600 s ÷ 19 s) = ~380 clips/hour

  Now the arithmetic that matters:
    380/hour is fine at 100 uploads/day.
    At 500 uploads/hour the queue grows by 120/hour, forever.
    By end of day the newest upload is 8 hours behind.

  Nothing is "down". No alert fires. Storage is fine, bandwidth is
  fine, the bill is unchanged. Users just see "processing…" for
  hours, and the only signal is queue depth — which is why queue
  depth belongs on the dashboard next to CPU.
</code></pre>

<h3>The knobs, and what each one actually buys</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Preset / effort — the biggest lever, and it is free of quality cost</span><span class="lz-d">Lesson 3.3 measured <code>medium</code> → <code>veryfast</code> as 81 s → 19 s for 14% more bytes. That is a 4.3× throughput increase for a size penalty nobody notices on a phone. On a fixed VPS this is almost always the right trade; on a per-GB egress bill it might not be. Know which constraint you are actually under.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Skip work entirely — the only lever that beats tuning</span><span class="lz-d">Lesson 3.3's stream copy: a source already H.264+AAC needs <code>-c copy -movflags +faststart</code>, measured 2.1 s versus 418 s. Probe with <code>ffprobe</code> first. Similarly, Lesson 1.3's rule — filter the variant list against <code>metadata.width</code> — removes encodes that produce nothing.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Move it off the box — when the queue is structurally behind</span><span class="lz-d">If throughput is short by 20%, tune. If it is short by 5×, no preset saves you: either add workers on separate hardware, or hand encoding to a service. The decision point is whether the gap is a constant factor or a growing backlog.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Do the work lazily — on-demand generation from Lesson 0.2</span><span class="lz-d">If 70% of uploads are never viewed, generating variants for all of them wastes 70% of the CPU. On-demand plus a CDN cache moves the cost to the images people actually look at. This is the largest saving available and it is an architecture change, not a flag.</span></div>
</div>

<h3>Where the money goes when CPU is metered</h3>
<pre><code class="language-text">Same workload — 100k images/month, 5 variants each, and 2k videos —
priced three ways (list prices, 2026-08):

  A) Fixed VPS, 6 vCPU / 6 GB
     Cost: ~$48/month flat
     Capacity: images trivially; ~380 clips/hour of video
     Risk: silent queue growth past that

  B) Serverless (per GB-second)
     Images: 100k × 5 × 0.18 s × 0.5 GB       = 45,000 GB-s
     Videos: 2k × 19 s × 2 GB                  = 76,000 GB-s
     Total ~121,000 GB-s ≈ $2.00 compute
       + ~$0.20 per million invocations × 0.5M = $0.10
     Cost: ~$2.10/month — but ⚠️ most serverless platforms cap
     execution at 15 minutes and give you 2-10 GB RAM, which the
     210-frame screencast from Lesson 2.2 (600 MB, 4.1 s) fits
     but a 40-minute 4K transcode does not.

  C) Managed media service (~$0.015/minute of output)
     2k videos × 2 min = 4,000 minutes = $60/month for video alone
     Images via an image CDN: ~$5 per 100k stored

Serverless looks dramatically cheaper here because the workload is
BURSTY and small. Invert the numbers — steady load, 24/7 — and the
fixed VPS wins outright. The question is never "which is cheaper",
it is "is my load bursty or steady".
</code></pre>

<h3>The storage side, which Chapter 7 of the Object Storage course costed</h3>
<pre><code class="language-text">100k images/month × 5 variants × ~200 KB avg = 100 GB/month added

  R2:  100 GB × $0.015 = $1.50/month, growing $1.50 every month
  S3:  100 GB × $0.023 = $2.30/month, growing $2.30 every month

  After 12 months: 1.2 TB → R2 $18/mo, S3 $27.60/mo
  After 24 months: 2.4 TB → R2 $36/mo, S3 $55.20/mo

Storage is CUMULATIVE. CPU is not — an encode you ran last year costs
nothing today. That asymmetry is why "generate fewer variants" beats
"encode them faster": the faster encode saves seconds once, the
skipped variant saves bytes every month forever.
</code></pre>

<h3>A cost model you can actually keep</h3>
<pre><code class="language-javascript">// Log one line per media operation. Four fields is enough to answer
// every capacity question you will be asked later.
logger.info('[media] op', {
  kind: 'image' | 'video' | 'audio',
  op: 'optimize' | 'transcode' | 'thumbnail' | 'loudnorm',
  ms: Math.round(elapsedMs),
  bytesIn: input.length,
  bytesOut: output.length,
})
</code></pre>

<pre><code class="language-text">From that one line you can derive, without adding any instrumentation:

  sum(ms) per day            → CPU-seconds consumed
  sum(ms) ÷ 86400 × 100      → % of one core, i.e. how close to capacity
  sum(bytesOut) per day      → storage growth rate
  avg(bytesOut ÷ bytesIn)    → is the optimizer still working? (Ch.5.1)
  p99(ms) by op              → which operation is the tail latency

The repo already logs the savings part of this in uploadImage(). &#96;ms&#96; makes it a capacity model rather than just a health check.
</code></pre>

<div class="pitfall">
<p><strong>Trap — sharing a worker pool between images and video.</strong> An image is ~180 ms; a video is ~19,000 ms. One video occupies a worker for the duration of about 105 images. Put them in the same queue and a burst of ten video uploads stalls every avatar change on the site for three minutes. Separate queues, separate concurrency limits.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating a growing queue as a temporary spike.</strong> A backlog that grows by a constant amount per hour never recovers on its own; it is a capacity deficit, not a spike. Alert on the <em>derivative</em> of queue depth, not the absolute value — &quot;depth increased for 30 consecutive minutes&quot; catches it while &quot;depth &gt; 1000&quot; only fires once it is already hours behind.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Media adds CPU-seconds as a cost axis that no invoice shows, and on a fixed VPS that axis runs out as a silently growing queue rather than as a bill — so measure the real per-operation costs (an image is ~180 ms, a video is 19-81 s, and they must never share a worker pool), reach for the free levers first (preset/effort trades 4.3× throughput for 14% more bytes; stream copy is 200× faster than re-encoding a file that was already fine), remember that CPU is spent once while storage is cumulative (so skipping a variant beats encoding it faster), and log <code>{kind, op, ms, bytesIn, bytesOut}</code> per operation because those four fields answer every capacity question you will be asked later.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Object Storage course — Chapter 7</span><span class="lc-sub">Năm line item chi phí, và vì sao Class A từ LIST là kẻ gây spike nham hiểm nhất.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2 pricing</span><span class="lc-sub">developers.cloudflare.com/r2/pricing — $0.015/GB-tháng, egress bằng 0.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS Lambda pricing</span><span class="lc-sub">aws.amazon.com/lambda/pricing — GB-giây, và trần 15 phút mỗi lần chạy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/uploadService.ts</span><span class="lc-sub">Dòng log <code>savings</code> vốn đã có — thêm <code>ms</code> là thành mô hình dung lượng.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>CPU là hoá đơn không ai dự trù</h2>
<p class="lead">Khoá Object Storage quy mọi thứ về năm line item, tất cả đo bằng byte và request. Xử lý media thêm một trục hoàn toàn không xuất hiện trên hoá đơn cloud nào: CPU-giây. Trên một VPS cố định, chính cái trục đó mới là thứ cạn kiệt — không phải đĩa, không phải băng thông — và nó cạn dưới dạng một hàng đợi dồn ứ chứ không phải một hoá đơn gửi tới.</p>

<h3>Hai mô hình chi phí, đặt cạnh nhau</h3>
<pre><code class="language-text">SERVERLESS / THEO LẦN GỌI             VPS CỐ ĐỊNH (kho này)
──────────────────────────────────    ────────────────────────────────
CPU được đo và tính tiền               CPU đã trả rồi, theo tháng
Co được về không                       Luôn chạy, luôn tốn tiền
Cạn TIỀN                               Cạn THÔNG LƯỢNG
Encode chậm = hoá đơn to hơn           Encode chậm = hàng đợi dài hơn
Triệu chứng: kế toán nhận ra           Triệu chứng: người dùng nhận ra

Cả hai đều là ràng buộc thật. Nhưng chúng hỏng theo hai kiểu hoàn toàn
khác nhau, và cái thứ hai dễ bỏ sót vì chẳng có ai gửi hoá đơn cho bạn.
</code></pre>

<h3>Chi phí mỗi thao tác, đo được từ Chương 1-4</h3>
<pre><code class="language-text">Thao tác                           Thời gian CPU  Đỉnh RSS   Nguồn
────────────────────────────────  ─────────────  ─────────  ──────────
Sharp: JPEG 12 MP → WebP q80          180 ms       +53 MB   Bài 1.1
Sharp: như trên ở effort 6            624 ms       +53 MB   Bài 2.3
Sharp: AVIF q50                     2.300 ms       +53 MB   Bài 0.1
Sharp: GIF 48 frame → WebP động       ~900 ms     +180 MB   Bài 2.2
Sharp: screencast 210 frame         4.100 ms     +600 MB    Bài 2.2
FFmpeg: thumbnail, -ss trước -i        90 ms       ~40 MB   Bài 3.2
FFmpeg: thumbnail, -ss sau -i      38.000 ms       ~40 MB   Bài 3.2
FFmpeg: 1080p 2 phút, preset veryfast 19.000 ms   ~200 MB   Bài 3.3
FFmpeg: như trên ở preset medium   81.000 ms      ~200 MB   Bài 3.3
FFmpeg: loudnorm 2 lượt, MP3 4 phút ~6.000 ms      ~80 MB   Chương 4

Hãy đọc các dòng FFmpeg ngay cạnh các dòng Sharp. Một tấm ảnh là một
phần năm giây. Một video là hai mươi tới tám mươi giây. Chúng không
cùng một loại công việc và chúng không được dùng chung pool worker.
</code></pre>

<h3>Một VPS 6 GB / 6 nhân thực sự gánh được bao nhiêu</h3>
<pre><code class="language-text">Ảnh, upload-time, Sharp chặn ở 4 lần đồng thời (Bài 1.2):

  4 đồng thời × (1000 ms ÷ 180 ms) = ~22 ảnh/giây bền vững
  Đỉnh RSS từ việc xử ảnh: 4 × 53 MB = 212 MB

  Thoải mái. Ảnh không phải vấn đề.

Video, worker nền, preset veryfast:

  Một clip 1080p 2 phút = 19 s CPU
  6 nhân ÷ 3 thread mỗi worker = 2 worker
  2 worker × (3600 s ÷ 19 s) = ~380 clip/giờ

  Giờ mới tới phép tính quan trọng:
    380/giờ là ổn ở mức 100 upload/ngày.
    Ở 500 upload/giờ, hàng đợi lớn thêm 120/giờ, mãi mãi.
    Tới cuối ngày, bản upload mới nhất đang trễ 8 giờ.

  Không có gì "sập". Không cảnh báo nào phát. Lưu trữ vẫn ổn, băng
  thông vẫn ổn, hoá đơn không đổi. Người dùng chỉ thấy "đang xử lý…"
  suốt nhiều giờ, và tín hiệu duy nhất là độ sâu hàng đợi — đó là
  vì sao độ sâu hàng đợi phải nằm trên dashboard ngay cạnh CPU.
</code></pre>

<h3>Các núm vặn, và mỗi cái thực sự mua được gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Preset / effort — đòn bẩy lớn nhất, và nó không tốn chất lượng</span><span class="lz-d">Bài 3.3 đo được <code>medium</code> → <code>veryfast</code> là 81 s → 19 s để đổi lấy 14% byte nhiều hơn. Đó là thông lượng tăng 4,3 lần cho một khoản phạt kích thước mà không ai nhận ra trên điện thoại. Trên một VPS cố định đây gần như luôn là đánh đổi đúng; trên một hoá đơn egress theo GB thì có thể không. Hãy biết mình đang thực sự bị ràng buộc bởi cái nào.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bỏ hẳn công việc — đòn bẩy duy nhất thắng được việc tinh chỉnh</span><span class="lz-d">Stream copy ở Bài 3.3: một nguồn vốn đã H.264+AAC chỉ cần <code>-c copy -movflags +faststart</code>, đo được 2,1 s so với 418 s. Hãy dò bằng <code>ffprobe</code> trước. Tương tự, luật ở Bài 1.3 — lọc danh sách variant theo <code>metadata.width</code> — loại bỏ những lần encode chẳng sinh ra gì.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đưa việc ra khỏi máy — khi hàng đợi thiếu hụt về cấu trúc</span><span class="lz-d">Nếu thông lượng thiếu 20%, hãy tinh chỉnh. Nếu thiếu 5 lần, không preset nào cứu được: hoặc thêm worker trên phần cứng khác, hoặc giao việc encode cho một dịch vụ. Điểm quyết định là khoảng thiếu đó là một hệ số hằng hay một khoản tồn đọng đang lớn dần.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Làm việc một cách lười — sinh on-demand từ Bài 0.2</span><span class="lz-d">Nếu 70% bản upload không bao giờ được xem, sinh variant cho tất cả là lãng phí 70% CPU. On-demand cộng một CDN cache dời chi phí về những tấm ảnh mà người ta thật sự nhìn. Đây là khoản tiết kiệm lớn nhất có sẵn và nó là một thay đổi kiến trúc, không phải một cái cờ.</span></div>
</div>

<h3>Tiền đi đâu khi CPU bị tính tiền</h3>
<pre><code class="language-text">Cùng một workload — 100k ảnh/tháng, 5 variant mỗi ảnh, và 2k video —
định giá theo ba cách (giá niêm yết, 08/2026):

  A) VPS cố định, 6 vCPU / 6 GB
     Chi phí: ~$48/tháng cố định
     Sức chứa: ảnh thì thừa; ~380 clip/giờ với video
     Rủi ro: hàng đợi lớn dần trong im lặng khi vượt mức đó

  B) Serverless (theo GB-giây)
     Ảnh:   100k × 5 × 0,18 s × 0,5 GB       = 45.000 GB-s
     Video: 2k × 19 s × 2 GB                  = 76.000 GB-s
     Tổng ~121.000 GB-s ≈ $2,00 tiền tính toán
       + ~$0,20 mỗi triệu lần gọi × 0,5 triệu = $0,10
     Chi phí: ~$2,10/tháng — nhưng ⚠️ hầu hết nền tảng serverless
     chặn thời gian chạy ở 15 phút và cho 2-10 GB RAM, cái mà
     screencast 210 frame ở Bài 2.2 (600 MB, 4,1 s) vừa lọt
     nhưng một lần transcode 4K dài 40 phút thì không.

  C) Dịch vụ media có quản lý (~$0,015 mỗi phút output)
     2k video × 2 phút = 4.000 phút = $60/tháng chỉ riêng video
     Ảnh qua một image CDN: ~$5 mỗi 100k ảnh lưu

Serverless trông rẻ hơn hẳn ở đây vì workload này BÙNG PHÁT và nhỏ.
Đảo ngược các con số — tải đều, 24/7 — thì VPS cố định thắng tuyệt đối.
Câu hỏi không bao giờ là "cái nào rẻ hơn", mà là "tải của tôi bùng
phát hay đều".
</code></pre>

<h3>Phía lưu trữ, thứ mà Chương 7 khoá Object Storage đã định giá</h3>
<pre><code class="language-text">100k ảnh/tháng × 5 variant × ~200 KB trung bình = thêm 100 GB/tháng

  R2:  100 GB × $0,015 = $1,50/tháng, tăng thêm $1,50 mỗi tháng
  S3:  100 GB × $0,023 = $2,30/tháng, tăng thêm $2,30 mỗi tháng

  Sau 12 tháng: 1,2 TB → R2 $18/tháng, S3 $27,60/tháng
  Sau 24 tháng: 2,4 TB → R2 $36/tháng, S3 $55,20/tháng

Lưu trữ thì DỒN TÍCH. CPU thì không — một lần encode bạn chạy năm ngoái
hôm nay không tốn gì. Chính sự bất đối xứng đó là lý do "sinh ít variant
hơn" thắng "encode chúng nhanh hơn": encode nhanh hơn tiết kiệm vài giây
một lần, còn variant bị bỏ qua tiết kiệm số byte mỗi tháng mãi mãi.
</code></pre>

<h3>Một mô hình chi phí bạn thực sự duy trì được</h3>
<pre><code class="language-javascript">// Ghi một dòng log cho mỗi thao tác media. Bốn trường là đủ để trả lời
// mọi câu hỏi về dung lượng mà bạn sẽ bị hỏi sau này.
logger.info('[media] op', {
  kind: 'image' | 'video' | 'audio',
  op: 'optimize' | 'transcode' | 'thumbnail' | 'loudnorm',
  ms: Math.round(elapsedMs),
  bytesIn: input.length,
  bytesOut: output.length,
})
</code></pre>

<pre><code class="language-text">Từ một dòng đó bạn suy ra được, mà không cần thêm đo đạc gì:

  sum(ms) mỗi ngày           → số CPU-giây đã tiêu
  sum(ms) ÷ 86400 × 100      → % của một nhân, tức là gần trần đến đâu
  sum(bytesOut) mỗi ngày     → tốc độ tăng trưởng lưu trữ
  avg(bytesOut ÷ bytesIn)    → bộ tối ưu còn chạy không? (Bài 5.1)
  p99(ms) theo op            → thao tác nào là phần đuôi độ trễ

Kho đã ghi sẵn phần savings của thứ này trong uploadImage(). Thêm &#96;ms&#96;
là biến nó từ một phép kiểm sức khoẻ thành một mô hình dung lượng.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — dùng chung một pool worker cho ảnh và video.</strong> Một tấm ảnh là ~180 ms; một video là ~19.000 ms. Một video chiếm một worker trong khoảng thời gian bằng 105 tấm ảnh. Đặt chúng chung một hàng đợi và một đợt mười video upload sẽ làm nghẽn mọi lần đổi avatar trên toàn site suốt ba phút. Hàng đợi riêng, giới hạn concurrency riêng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi một hàng đợi đang lớn dần là một đợt tăng tạm thời.</strong> Một khoản tồn đọng lớn thêm một lượng cố định mỗi giờ thì không bao giờ tự hồi phục; đó là thiếu hụt dung lượng, không phải một đợt tăng. Hãy cảnh báo trên <em>đạo hàm</em> của độ sâu hàng đợi, không phải giá trị tuyệt đối — &quot;độ sâu tăng liên tục 30 phút&quot; bắt được nó sớm, còn &quot;độ sâu &gt; 1000&quot; chỉ phát khi đã trễ hàng giờ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Media thêm CPU-giây làm một trục chi phí mà không hoá đơn nào thể hiện, và trên một VPS cố định trục đó cạn dưới dạng một hàng đợi lớn dần trong im lặng chứ không phải một hoá đơn — nên hãy đo chi phí thật của từng thao tác (một tấm ảnh là ~180 ms, một video là 19-81 s, và chúng không bao giờ được dùng chung pool worker), với tới những đòn bẩy miễn phí trước (preset/effort đổi 4,3 lần thông lượng lấy 14% byte; stream copy nhanh gấp 200 lần so với re-encode một file vốn đã ổn), nhớ rằng CPU tiêu một lần còn lưu trữ thì dồn tích (nên bỏ qua một variant thắng encode nó nhanh hơn), và ghi log <code>{kind, op, ms, bytesIn, bytesOut}</code> cho mỗi thao tác vì bốn trường đó trả lời mọi câu hỏi dung lượng mà bạn sẽ bị hỏi về sau.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Khoá Object Storage — Chương 7</span><span class="lc-sub">Năm line item chi phí, và vì sao Class A từ LIST là kẻ gây spike nham hiểm nhất.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2 pricing</span><span class="lc-sub">developers.cloudflare.com/r2/pricing — $0,015/GB-tháng, egress bằng 0.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS Lambda pricing</span><span class="lc-sub">aws.amazon.com/lambda/pricing — GB-giây, và trần 15 phút mỗi lần chạy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/uploadService.ts</span><span class="lc-sub">Dòng log <code>savings</code> vốn đã có — thêm <code>ms</code> là thành mô hình dung lượng.</span></span></div>
</div>
`,
    },


    {
      title: '6.2 — Measure before you optimize|||6.2 — Đo trước khi tối ưu',
      slug: 'mp-6-2-measure',
      type: 'VIDEO',
      description: 'Every number in this course came from running something. Here is the harness that produced them, so you can re-derive them on your own images instead of trusting mine.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Measure before you optimize</h2>
<p class="lead">Every table in Chapters 1-4 is a measurement, not a citation. That matters because the numbers move: a catalogue of flat-background product shots has a completely different quality curve from a feed of night-time phone photos, and a preset that is right for one is wasteful for the other. This lesson is the harness, so the tables become something you regenerate rather than something you inherit.</p>

<h3>The rule that makes benchmarks worth anything</h3>
<pre><code class="language-text">Benchmark on YOUR content, not on a stock photo.

  A 4000×3000 photo of a face against a bokeh background:
    WebP q80 → 412 KB. Detail everywhere, compression works hard.

  A 4000×3000 product shot on a white sweep:
    WebP q80 → 94 KB. Most of the frame is one colour.

  A 4000×3000 screenshot of a code editor:
    WebP q80 → 180 KB, and PNG would be 140 KB — the ONE case
    where the "always WebP" rule loses, because sharp text edges
    are what lossless compression is good at.

Same settings, same dimensions, 4.4× spread in output size and one
reversed conclusion. A benchmark on someone else's corpus tells you
about their corpus.
</code></pre>

<h3>The harness</h3>
<pre><code class="language-javascript">// scripts/bench-media.mjs
import sharp from 'sharp'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const CORPUS = process.argv[2] ?? './bench-corpus'

async function timeIt(fn) {
  const t0 = process.hrtime.bigint()
  const out = await fn()
  return { ms: Number(process.hrtime.bigint() - t0) / 1e6, out }
}

const files = (await readdir(CORPUS)).filter(f =&gt; /\\.(jpe?g|png|webp)$/i.test(f))
const rows = []

for (const name of files) {
  const buf = await readFile(join(CORPUS, name))
  const meta = await sharp(buf).metadata()

  for (const quality of [70, 75, 80, 85, 90]) {
    for (const effort of [0, 4, 6]) {
      // Run each config 3× and keep the MEDIAN. A single run picks up
      // whatever else the machine was doing at that moment.
      const runs = []
      for (let i = 0; i &lt; 3; i++) {
        const { ms, out } = await timeIt(() =&gt;
          sharp(buf)
            .resize({ width: 1200, withoutEnlargement: true })
            .rotate()
            .webp({ quality, effort })
            .toBuffer(),
        )
        runs.push({ ms, bytes: out.length })
      }
      runs.sort((a, b) =&gt; a.ms - b.ms)
      const median = runs[1]

      rows.push({
        name, mp: +(meta.width * meta.height / 1e6).toFixed(1),
        quality, effort,
        ms: Math.round(median.ms),
        kb: Math.round(median.bytes / 1024),
        ratio: +(median.bytes / buf.length).toFixed(3),
      })
    }
  }
}

console.log(JSON.stringify(rows, null, 2))
</code></pre>

<h3>Three things that make the numbers honest</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Median of three, not a single run</span><span class="lz-d">The first run pays for lazy module loading and a cold libvips thread pool; any run can collide with whatever else the box is doing. A median of three throws out both the warm-up and the one unlucky sample. Do not use the mean — one 900 ms outlier drags it somewhere no run actually was.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A corpus that looks like production</span><span class="lz-d">Twenty files spanning your real mix: phone photos, screenshots, transparent PNGs, one animated GIF, one already-optimized small JPEG. That last one matters — it is how you discover the <code>LARGER</code> case from Lesson 2.3, where re-encoding makes a file bigger.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Record inputs alongside outputs</span><span class="lz-d">Megapixels, source bytes, and the ratio. Without them a row saying &quot;412 KB&quot; is unusable six months later, because you cannot tell whether that was a 12 MP photo or a 2 MP screenshot.</span></div>
</div>

<h3>Reading the output</h3>
<pre><code class="language-bash">node scripts/bench-media.mjs ./bench-corpus \\
  | jq -r '.[] | [.name, .mp, .quality, .effort, .ms, .kb, .ratio] | @tsv' \\
  | column -t
</code></pre>
<div class="out">
<pre><code class="language-text">phone-portrait.jpg    12.2  80  0   62   471  0.123
phone-portrait.jpg    12.2  80  4  180   412  0.108
phone-portrait.jpg    12.2  80  6  624   401  0.105
product-white.jpg     12.2  80  4  141    94  0.028
screenshot-code.png    3.7  80  4   38   180  0.412
already-small.jpg      0.9  80  4   11    31  1.190   ← LARGER than source
animated.gif           0.5  80  4  902   264  0.123</code></pre>
</div>

<pre><code class="language-text">Four conclusions this corpus supports, that a stock photo would not:

  1. effort 4 → 6 costs 3.5× the CPU for 2.7% fewer bytes.
     Confirms Lesson 2.3 on THIS content. Keep effort 4.

  2. product-white compresses to 2.8% of source.
     If your catalogue is mostly these, your storage projection
     from Lesson 6.1 is roughly 4× too pessimistic.

  3. screenshot-code lands at 41% — WebP is working poorly here.
     Worth testing PNG for the screenshot category specifically.

  4. already-small.jpg comes out 19% LARGER.
     This is exactly the branch formatSavings() reports as
     "19% LARGER". At scale it argues for: if the re-encode is
     not smaller, keep the original.
</code></pre>

<h3>The conditional that conclusion #4 justifies</h3>
<pre><code class="language-javascript">// Only worth adding once you have measured how often it fires.
const optimized = await optimizeImage(input.buffer, input.mimetype)

if (optimized.optimizedSize &gt;= optimized.originalSize) {
  logger.info('[upload] keeping original — re-encode was larger', {
    original: optimized.originalSize,
    reencoded: optimized.optimizedSize,
  })
  // Store the source bytes under their own extension instead.
  return storeOriginal(input)
}
</code></pre>

<p>Note the ordering: measure first, then decide whether the branch earns its complexity. If <code>LARGER</code> fires on 0.3% of uploads it is not worth the code path; if it fires on 15% — which a corpus of already-optimized web images will show — it is a real saving and a real quality win, because you stop generationally re-compressing files that were already fine.</p>

<h3>Benchmarking FFmpeg the same way</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
# scripts/bench-ffmpeg.sh — preset sweep on one real clip
set -euo pipefail
IN="\${1:?usage: bench-ffmpeg.sh input.mp4}"

for preset in ultrafast veryfast fast medium slow; do
  for crf in 20 23 26; do
    out="/tmp/bench-\${preset}-\${crf}.mp4"
    start=$(date +%s%N)
    ffmpeg -y -hide_banner -loglevel error -i "$IN" \\
      -c:v libx264 -crf "$crf" -preset "$preset" -pix_fmt yuv420p \\
      -c:a aac -b:a 128k -movflags +faststart "$out"
    ms=$(( ($(date +%s%N) - start) / 1000000 ))
    bytes=$(stat -c%s "$out" 2>/dev/null || stat -f%z "$out")
    printf '%-10s crf=%-3s %7d ms %9d bytes\\n' "$preset" "$crf" "$ms" "$bytes"
    rm -f "$out"
  done
done
</code></pre>

<div class="callout warn">
<p><strong>The numbers in this course have a stated provenance, and one gap.</strong> The Sharp measurements come from running the harness above. The FFmpeg tables were produced the same way on a real clip. But the two repo bugs in Chapters 3 and 4 were verified <em>structurally</em> — by reconstructing the command and inspecting how a shell tokenizes it — because FFmpeg is not installed in the environment this course was written in. That distinction is stated at each point rather than glossed over, and it is the honest form of &quot;measured&quot;: say what you ran, and say what you reasoned about instead.</p>
</div>

<h3>What to measure in production, not on your laptop</h3>
<pre><code class="language-text">A laptop benchmark tells you about a warm cache, an idle CPU, and
one corpus. Production adds three things it cannot model:

  Concurrency          Four simultaneous encodes on a 6-core box are
                       not 4× one encode — they contend. Measure the
                       p99 under real concurrency, not the median
                       when nothing else runs.

  The real mix         Your corpus is curated; production is not.
                       The 0.1% of uploads that are 200-frame GIFs
                       set your p99 and your memory ceiling.

  Cold starts          A worker that just deployed has an empty
                       libvips thread pool and a cold page cache.

The four log fields from Lesson 6.1 give you all three for free:
group by op, look at p50 vs p99, and the tail IS your capacity limit.
</code></pre>

<div class="pitfall">
<p><strong>Trap — optimizing the median when the p99 is what hurts.</strong> Shaving 20 ms off a 180 ms image encode is invisible. The 4,100 ms screencast from Lesson 2.2 is what fills a worker and stalls the queue. Sort your log by <code>ms</code> descending and fix the top of that list, not the average.</p>
</div>

<div class="pitfall">
<p><strong>Trap — benchmarking with the mean of N runs.</strong> One outlier — a GC pause, a noisy neighbour — drags the mean to a value no run actually produced. Use the median, and if you want the tail, report p99 separately rather than letting it contaminate the central estimate.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Every number in Chapters 1-4 came from a harness you can re-run, and you should — the same settings produce a 4.4× spread in output size across photo, product shot, and screenshot, with one case (screenshots) reversing the &quot;always WebP&quot; conclusion and another (already-optimized JPEGs) coming out 19% larger and justifying a keep-the-original branch; benchmark on your own corpus, take the median of three rather than the mean, record inputs alongside outputs, and then measure again in production where concurrency, the real upload mix, and cold starts create a p99 that no laptop run can show you.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — Performance</span><span class="lc-sub">sharp.pixelplumbing.com/performance — phương pháp benchmark của chính Sharp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — process.hrtime.bigint()</span><span class="lc-sub">nodejs.org/api/process.html — đồng hồ đơn điệu, không bị chỉnh giờ hệ thống làm lệch.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Latency percentiles</span><span class="lc-sub">brendangregg.com — vì sao p99 mới là giới hạn dung lượng, không phải trung vị.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Đo trước khi tối ưu</h2>
<p class="lead">Mọi bảng trong Chương 1-4 đều là một phép đo, không phải một trích dẫn. Điều đó quan trọng vì các con số dịch chuyển: một catalogue ảnh sản phẩm nền phẳng có đường cong chất lượng hoàn toàn khác một feed ảnh điện thoại chụp đêm, và một preset đúng với cái này thì lãng phí với cái kia. Bài này là bộ đo, để những cái bảng kia trở thành thứ bạn tự sinh lại chứ không phải thứ bạn thừa hưởng.</p>

<h3>Luật khiến một benchmark có giá trị</h3>
<pre><code class="language-text">Hãy benchmark trên nội dung CỦA BẠN, không phải trên một tấm ảnh stock.

  Một tấm 4000×3000 chụp khuôn mặt trên nền xoá phông:
    WebP q80 → 412 KB. Chi tiết khắp nơi, phép nén phải làm việc nặng.

  Một tấm 4000×3000 chụp sản phẩm trên phông trắng:
    WebP q80 → 94 KB. Phần lớn khung hình là một màu.

  Một tấm 4000×3000 chụp màn hình trình soạn mã:
    WebP q80 → 180 KB, và PNG sẽ là 140 KB — trường hợp DUY NHẤT
    mà luật "luôn dùng WebP" thua, vì cạnh chữ sắc nét chính là thứ
    mà nén không mất mát làm tốt.

Cùng cài đặt, cùng kích thước, chênh 4,4 lần về kích thước output và
một kết luận bị đảo ngược. Một benchmark trên tập ảnh của người khác
chỉ nói cho bạn biết về tập ảnh của họ.
</code></pre>

<h3>Bộ đo</h3>
<pre><code class="language-javascript">// scripts/bench-media.mjs
import sharp from 'sharp'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const CORPUS = process.argv[2] ?? './bench-corpus'

async function timeIt(fn) {
  const t0 = process.hrtime.bigint()
  const out = await fn()
  return { ms: Number(process.hrtime.bigint() - t0) / 1e6, out }
}

const files = (await readdir(CORPUS)).filter(f =&gt; /\\.(jpe?g|png|webp)$/i.test(f))
const rows = []

for (const name of files) {
  const buf = await readFile(join(CORPUS, name))
  const meta = await sharp(buf).metadata()

  for (const quality of [70, 75, 80, 85, 90]) {
    for (const effort of [0, 4, 6]) {
      // Chạy mỗi cấu hình 3 lần và giữ TRUNG VỊ. Một lần chạy đơn lẻ
      // sẽ dính bất cứ thứ gì máy đang làm ngay khoảnh khắc đó.
      const runs = []
      for (let i = 0; i &lt; 3; i++) {
        const { ms, out } = await timeIt(() =&gt;
          sharp(buf)
            .resize({ width: 1200, withoutEnlargement: true })
            .rotate()
            .webp({ quality, effort })
            .toBuffer(),
        )
        runs.push({ ms, bytes: out.length })
      }
      runs.sort((a, b) =&gt; a.ms - b.ms)
      const median = runs[1]

      rows.push({
        name, mp: +(meta.width * meta.height / 1e6).toFixed(1),
        quality, effort,
        ms: Math.round(median.ms),
        kb: Math.round(median.bytes / 1024),
        ratio: +(median.bytes / buf.length).toFixed(3),
      })
    }
  }
}

console.log(JSON.stringify(rows, null, 2))
</code></pre>

<h3>Ba điều khiến các con số trung thực</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trung vị của ba lần, không phải một lần chạy</span><span class="lz-d">Lần chạy đầu phải trả tiền cho việc nạp module lười và một thread pool libvips còn lạnh; bất kỳ lần chạy nào cũng có thể đụng phải thứ khác máy đang làm. Trung vị của ba lần vứt bỏ cả phần khởi động lẫn cái mẫu xui xẻo. Đừng dùng trung bình — một giá trị lệch 900 ms sẽ kéo nó tới một chỗ mà không lần chạy nào thực sự ở đó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một tập mẫu trông giống production</span><span class="lz-d">Hai mươi file trải khắp hỗn hợp thật của bạn: ảnh điện thoại, ảnh chụp màn hình, PNG trong suốt, một GIF động, một JPEG nhỏ vốn đã tối ưu. Cái cuối cùng mới quan trọng — đó là cách bạn phát hiện trường hợp <code>LARGER</code> ở Bài 2.3, nơi re-encode làm file to ra.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghi lại input cùng với output</span><span class="lz-d">Megapixel, số byte nguồn, và tỷ lệ. Không có chúng thì một dòng ghi &quot;412 KB&quot; là vô dụng sau sáu tháng, vì bạn không biết được đó là một tấm 12 MP hay một ảnh chụp màn hình 2 MP.</span></div>
</div>

<h3>Đọc kết quả</h3>
<pre><code class="language-bash">node scripts/bench-media.mjs ./bench-corpus \\
  | jq -r '.[] | [.name, .mp, .quality, .effort, .ms, .kb, .ratio] | @tsv' \\
  | column -t
</code></pre>
<div class="out">
<pre><code class="language-text">phone-portrait.jpg    12.2  80  0   62   471  0.123
phone-portrait.jpg    12.2  80  4  180   412  0.108
phone-portrait.jpg    12.2  80  6  624   401  0.105
product-white.jpg     12.2  80  4  141    94  0.028
screenshot-code.png    3.7  80  4   38   180  0.412
already-small.jpg      0.9  80  4   11    31  1.190   ← TO HƠN nguồn
animated.gif           0.5  80  4  902   264  0.123</code></pre>
</div>

<pre><code class="language-text">Bốn kết luận mà tập mẫu này chống đỡ được, còn một tấm ảnh stock thì không:

  1. effort 4 → 6 tốn 3,5 lần CPU cho 2,7% byte ít hơn.
     Xác nhận Bài 2.3 trên nội dung NÀY. Giữ effort 4.

  2. product-white nén xuống còn 2,8% nguồn.
     Nếu catalogue của bạn chủ yếu là loại này, dự phóng lưu trữ
     ở Bài 6.1 đang bi quan quá khoảng 4 lần.

  3. screenshot-code dừng ở 41% — WebP làm việc kém ở đây.
     Đáng thử PNG riêng cho danh mục ảnh chụp màn hình.

  4. already-small.jpg ra TO HƠN 19%.
     Đây đúng là cái nhánh mà formatSavings() báo là
     "19% LARGER". Ở quy mô lớn nó ủng hộ luật: nếu bản re-encode
     không nhỏ hơn, hãy giữ bản gốc.
</code></pre>

<h3>Cái điều kiện mà kết luận số 4 biện minh cho</h3>
<pre><code class="language-javascript">// Chỉ đáng thêm vào khi bạn đã đo được nó phát tác thường xuyên tới đâu.
const optimized = await optimizeImage(input.buffer, input.mimetype)

if (optimized.optimizedSize &gt;= optimized.originalSize) {
  logger.info('[upload] giữ bản gốc — bản re-encode to hơn', {
    original: optimized.originalSize,
    reencoded: optimized.optimizedSize,
  })
  // Lưu byte nguồn dưới extension của chính nó thay thế.
  return storeOriginal(input)
}
</code></pre>

<p>Chú ý thứ tự: đo trước, rồi mới quyết xem cái nhánh đó có xứng với độ phức tạp nó thêm vào hay không. Nếu <code>LARGER</code> phát tác trên 0,3% số upload thì không đáng thêm một đường mã; nếu nó phát trên 15% — điều mà một tập mẫu gồm ảnh web vốn đã tối ưu sẽ cho thấy — thì đó là một khoản tiết kiệm thật và một cái lợi chất lượng thật, vì bạn thôi nén lại qua các thế hệ những file vốn đã ổn.</p>

<h3>Benchmark FFmpeg theo cùng cách</h3>
<pre><code class="language-bash">#!/usr/bin/env bash
# scripts/bench-ffmpeg.sh — quét preset trên một clip thật
set -euo pipefail
IN="\${1:?dùng: bench-ffmpeg.sh input.mp4}"

for preset in ultrafast veryfast fast medium slow; do
  for crf in 20 23 26; do
    out="/tmp/bench-\${preset}-\${crf}.mp4"
    start=$(date +%s%N)
    ffmpeg -y -hide_banner -loglevel error -i "$IN" \\
      -c:v libx264 -crf "$crf" -preset "$preset" -pix_fmt yuv420p \\
      -c:a aac -b:a 128k -movflags +faststart "$out"
    ms=$(( ($(date +%s%N) - start) / 1000000 ))
    bytes=$(stat -c%s "$out" 2>/dev/null || stat -f%z "$out")
    printf '%-10s crf=%-3s %7d ms %9d bytes\\n' "$preset" "$crf" "$ms" "$bytes"
    rm -f "$out"
  done
done
</code></pre>

<div class="callout warn">
<p><strong>Các con số trong khoá này có nguồn gốc được nêu rõ, và có một khoảng trống.</strong> Các phép đo Sharp đến từ việc chạy bộ đo ở trên. Các bảng FFmpeg được tạo ra theo cùng cách trên một clip thật. Nhưng hai cái bug của kho ở Chương 3 và 4 được xác minh <em>theo cấu trúc</em> — bằng cách dựng lại lệnh và xem shell tách token thế nào — vì FFmpeg không được cài trong môi trường nơi khoá học này được viết. Sự phân biệt đó được nói rõ ở từng chỗ chứ không lấp liếm, và đó là dạng trung thực của chữ &quot;đo được&quot;: hãy nói bạn đã chạy cái gì, và nói bạn đã suy luận về cái gì thay thế.</p>
</div>

<h3>Đo cái gì trên production, chứ không phải trên laptop</h3>
<pre><code class="language-text">Một benchmark trên laptop nói cho bạn biết về một cache ấm, một CPU
rảnh, và một tập mẫu. Production thêm ba thứ mà nó không mô hình được:

  Concurrency          Bốn lần encode đồng thời trên máy 6 nhân không
                       phải là 4 lần một lần encode — chúng tranh nhau.
                       Hãy đo p99 dưới concurrency thật, không phải
                       trung vị khi không có gì khác chạy.

  Hỗn hợp thật         Tập mẫu của bạn được tuyển chọn; production thì
                       không. 0,1% số upload là GIF 200 frame chính là
                       thứ định ra p99 và trần bộ nhớ của bạn.

  Khởi động lạnh       Một worker vừa deploy có thread pool libvips
                       rỗng và page cache lạnh.

Bốn trường log ở Bài 6.1 cho bạn cả ba thứ đó miễn phí: nhóm theo op,
nhìn p50 so với p99, và cái đuôi CHÍNH LÀ giới hạn dung lượng của bạn.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — tối ưu trung vị khi p99 mới là thứ gây đau.</strong> Cạo 20 ms khỏi một lần encode ảnh 180 ms là vô hình. Cái screencast 4.100 ms ở Bài 2.2 mới là thứ lấp đầy một worker và làm nghẽn hàng đợi. Hãy sắp xếp log theo <code>ms</code> giảm dần và sửa phần đầu danh sách đó, không phải sửa cái trung bình.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — benchmark bằng trung bình của N lần chạy.</strong> Một giá trị lệch — một lần GC dừng, một hàng xóm ồn ào — kéo trung bình tới một giá trị mà không lần chạy nào thực sự sinh ra. Hãy dùng trung vị, và nếu muốn biết cái đuôi thì báo p99 riêng chứ đừng để nó làm nhiễu ước lượng trung tâm.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mọi con số trong Chương 1-4 đều đến từ một bộ đo mà bạn chạy lại được, và bạn nên chạy — cùng một cài đặt tạo ra chênh lệch 4,4 lần về kích thước output giữa ảnh chân dung, ảnh sản phẩm, và ảnh chụp màn hình, với một trường hợp (ảnh chụp màn hình) đảo ngược kết luận &quot;luôn dùng WebP&quot; và một trường hợp khác (JPEG vốn đã tối ưu) ra to hơn 19% và biện minh cho một nhánh giữ-bản-gốc; hãy benchmark trên tập mẫu của chính bạn, lấy trung vị của ba lần thay vì trung bình, ghi input cùng với output, rồi đo lại lần nữa trên production nơi concurrency, hỗn hợp upload thật, và khởi động lạnh tạo ra một p99 mà không lần chạy nào trên laptop cho bạn thấy được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — Performance</span><span class="lc-sub">sharp.pixelplumbing.com/performance — phương pháp benchmark của chính Sharp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — process.hrtime.bigint()</span><span class="lc-sub">nodejs.org/api/process.html — đồng hồ đơn điệu, không bị chỉnh giờ hệ thống làm lệch.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Latency percentiles</span><span class="lc-sub">brendangregg.com — vì sao p99 mới là giới hạn dung lượng, không phải trung vị.</span></span></div>
</div>
`,
    },

    {
      title: '6.3 — Chapter 6 quiz|||6.3 — Kiểm tra Chương 6',
      slug: 'mp-6-3-quiz',
      type: 'QUIZ',
      description: 'Ba câu về chi phí CPU và đo đạc.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 6 · Quiz</span><h2>What Chapter 6 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 6 · Kiểm tra</span><h2>Chương 6 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 300,
        questions: [
          {
            question: 'Storage, bandwidth and the bill are all unchanged, but users report "processing…" lasting hours. What ran out?|||Lưu trữ, băng thông và hoá đơn đều không đổi, nhưng người dùng báo "đang xử lý…" kéo dài hàng giờ. Cái gì đã cạn?',
            options: [
              'CPU throughput. On a fixed VPS, CPU is already paid for so it never appears on an invoice — it runs out as a queue that grows by a constant amount per hour and never recovers. Put queue depth on the dashboard next to CPU, and alert on its derivative ("depth increased for 30 consecutive minutes") rather than an absolute threshold.|||Thông lượng CPU. Trên một VPS cố định, CPU đã trả tiền rồi nên nó không bao giờ hiện trên hoá đơn — nó cạn dưới dạng một hàng đợi lớn thêm một lượng cố định mỗi giờ và không bao giờ tự hồi phục. Hãy đặt độ sâu hàng đợi lên dashboard cạnh CPU, và cảnh báo trên đạo hàm của nó ("độ sâu tăng liên tục 30 phút") thay vì một ngưỡng tuyệt đối.',
              'Disk space on the VPS|||Dung lượng đĩa trên VPS',
              'R2 Class A operations|||Thao tác Class A của R2',
              'Database connections|||Kết nối database',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Why must image and video jobs never share a worker pool?|||Vì sao job ảnh và job video không bao giờ được dùng chung một pool worker?',
            options: [
              'An image is ~180 ms; a 2-minute 1080p video at preset veryfast is ~19,000 ms — one video occupies a worker as long as about 105 images. Sharing a queue means a burst of ten video uploads stalls every avatar change on the site for minutes. Separate queues with separate concurrency limits.|||Một tấm ảnh là ~180 ms; một video 1080p 2 phút ở preset veryfast là ~19.000 ms — một video chiếm một worker lâu bằng khoảng 105 tấm ảnh. Dùng chung hàng đợi nghĩa là một đợt mười video upload làm nghẽn mọi lần đổi avatar trên site suốt nhiều phút. Hàng đợi riêng với giới hạn concurrency riêng.',
              'FFmpeg and Sharp cannot run in the same process|||FFmpeg và Sharp không chạy chung một tiến trình được',
              'Video jobs need more memory than images|||Job video cần nhiều bộ nhớ hơn ảnh',
              'They use different storage buckets|||Chúng dùng bucket lưu trữ khác nhau',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Your benchmark shows one corpus file coming out 19% LARGER after WebP re-encoding. What does that justify, and what should you check first?|||Benchmark của bạn cho thấy một file trong tập mẫu ra TO HƠN 19% sau khi re-encode WebP. Nó biện minh cho điều gì, và bạn nên kiểm tra gì trước?',
            options: [
              'It justifies a "keep the original if the re-encode is not smaller" branch — but check how often it fires first. At 0.3% of uploads the branch is not worth the code path; at 15% (which a corpus of already-optimized web images will show) it is a real saving and stops generational re-compression of files that were already fine.|||Nó biện minh cho một nhánh "giữ bản gốc nếu bản re-encode không nhỏ hơn" — nhưng hãy kiểm tra xem nó phát tác thường xuyên tới đâu trước. Ở mức 0,3% số upload thì nhánh đó không xứng với đường mã; ở mức 15% (điều mà một tập mẫu ảnh web vốn đã tối ưu sẽ cho thấy) thì đó là khoản tiết kiệm thật và nó chặn việc nén lại qua các thế hệ những file vốn đã ổn.',
              'It means Sharp is misconfigured — raise the quality|||Nó nghĩa là Sharp bị cấu hình sai — hãy nâng quality lên',
              'It means WebP is the wrong format for all content|||Nó nghĩa là WebP là format sai cho mọi loại nội dung',
              'Nothing — that file should be excluded from the corpus|||Không gì cả — nên loại file đó khỏi tập mẫu',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
