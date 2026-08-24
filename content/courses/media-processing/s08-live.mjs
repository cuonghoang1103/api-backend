const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 8 — Live and real-time media|||Chương 8 — Media trực tiếp và thời gian thực',
  slug: 'mp-ch8-live',
  description: 'Ba bài về media thời gian thực: độ trễ quyết định kiến trúc, live HLS, và kiểm tra.',
  sortOrder: 9,
  lessons: [

    {
      title: '8.1 — Latency decides the architecture|||8.1 — Độ trễ quyết định kiến trúc',
      slug: 'mp-8-1-latency',
      type: 'VIDEO',
      description: 'Thirty seconds, five seconds, and 200 milliseconds are three different systems with nothing in common. Pick the number first and the technology follows.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Latency decides the architecture</h2>
<p class="lead">&quot;Live video&quot; describes three unrelated systems. A stream where viewers are 30 seconds behind, one where they are 5 seconds behind, and one where two people are talking to each other share no components — different protocols, different servers, different failure modes, different costs. The mistake is choosing a technology and then discovering what latency it implies. Choose the latency the product needs, and the technology is nearly determined.</p>

<h3>The three tiers</h3>
<pre><code class="language-text">TIER 1 — 15-45 s        &quot;broadcast&quot;
  Protocol:   HLS or DASH with 6-second segments
  Server:     none beyond object storage + CDN
  Scale:      unlimited — it is just HTTP files on a CDN
  Cost:       cheapest by a wide margin
  Fits:       sports, concerts, conferences, church services,
              anything one-to-many where nobody interacts

TIER 2 — 2-6 s          &quot;low-latency streaming&quot;
  Protocol:   LL-HLS or LL-DASH with 1-2 s partial segments
  Server:     an origin that can serve partial segments
  Scale:      still CDN-friendly, more origin pressure
  Cost:       moderate
  Fits:       live commerce, auctions, streams with a chat
              where &quot;he just said that&quot; must roughly line up

TIER 3 — 100-500 ms     &quot;real-time&quot;
  Protocol:   WebRTC
  Server:     SFU (selective forwarding unit) — a real, stateful,
              CPU-hungry media server
  Scale:      per-participant cost, does NOT ride a CDN
  Cost:       highest by an order of magnitude
  Fits:       calls, telehealth, remote teaching, anything
              conversational

There is no smooth path between tiers. Tier 1 → Tier 2 is a
re-encode and an origin change. Tier 2 → Tier 3 is a rewrite.
</code></pre>

<h3>Where the latency in Tier 1 actually comes from</h3>
<pre><code class="language-text">Encoder → segment writer → object storage → CDN → player

  Capture and encode                        ~0.5 s
  Fill one 6-second segment                  6.0 s   ← unavoidable:
                                                        a segment cannot
                                                        be published until
                                                        it is complete
  Upload segment to origin                   ~0.5 s
  CDN pull on first request                  ~0.3 s
  Player buffers 3 segments before playing   18.0 s   ← the big one
  ──────────────────────────────────────────────────
  Total                                     ~25 s

Two knobs, and they trade against each other:

  Shorter segments (2 s instead of 6 s)
    → ~9 s total instead of ~25 s
    → 3× the object count and 3× the Class A cost
    → more manifest refreshes, more origin requests

  Fewer buffered segments (1 instead of 3)
    → ~13 s instead of ~25 s
    → any network hiccup becomes a visible stall

Most players let you tune the buffer; not all let you go below 3.
</code></pre>

<h3>Producing a live HLS stream</h3>
<pre><code class="language-bash"># Ingest from a camera or an RTMP push, write a rolling playlist.
ffmpeg -i rtmp://ingest.internal/live/streamkey \\
  -c:v libx264 -preset veryfast -tune zerolatency \\
  -g 60 -keyint_min 60 -sc_threshold 0 \\
  -crf 23 -pix_fmt yuv420p \\
  -c:a aac -b:a 128k \\
  -f hls \\
  -hls_time 2 \\
  -hls_list_size 6 \\
  -hls_flags delete_segments+independent_segments \\
  -hls_segment_filename "live/seg-%05d.ts" \\
  live/index.m3u8
</code></pre>

<pre><code class="language-text">Four flags that differ from the VOD command in Lesson 7.2:

  -tune zerolatency     disables B-frames and lookahead. The encoder
                        stops buffering future frames to compress
                        better, costing ~10-15% more bytes and
                        removing a multi-frame delay.

  -hls_list_size 6      keep only the last 6 segments in the playlist.
                        A live playlist is a sliding window, not a
                        complete list.

  -hls_flags            delete the .ts files that scrolled out of the
    delete_segments     window. Without it a 24-hour stream at 2-second
                        segments leaves 43,200 files on disk.

  (no -hls_playlist_type vod)
                        deliberately absent — this stream really IS
                        live, so it must NOT get #EXT-X-ENDLIST.
                        The exact opposite of the Lesson 7.2 pitfall.

  -g 60 with -hls_time 2 at 30 fps
                        keyframe every 60 frames = every 2 s = exactly
                        one per segment. Same alignment rule as VOD.
</code></pre>

<h3>The caching rule inverts for live</h3>
<pre><code class="language-javascript">// Segments: still immutable. seg-00042.ts never changes.
cacheControl: 'public, max-age=31536000, immutable'

// Manifest: changes every 2 seconds. Cache it for ONE segment.
cacheControl: 'public, max-age=2'
</code></pre>

<pre><code class="language-text">This is the single most common live-streaming outage, and it is
not subtle once you know it:

  Manifest served with max-age=31536000 (copied from the VOD config)
    → the CDN pins the playlist from the moment the stream started
    → every viewer sees the same six segments forever
    → playback stops after ~12 seconds and never resumes
    → the origin looks perfectly healthy, because the CDN never
      asks it for anything

The fix is one header, and the way to catch it before users do is
to curl the manifest twice, ten seconds apart, and diff them. If
they are identical, the cache is wrong.
</code></pre>

<h3>Where WebRTC becomes unavoidable</h3>
<pre><code class="language-text">Below about 2 seconds, HTTP segment delivery stops working — you
cannot chunk, upload, distribute, and buffer a file faster than that.
WebRTC is a fundamentally different design:

  UDP, not TCP           a lost packet is concealed, not retransmitted;
                         a late packet is useless anyway
  Peer connections       media flows between endpoints, optionally via
                         a relay, never as cacheable files
  SFU for groups         one server receives each participant's stream
                         and forwards it to the others — stateful, and
                         its cost scales with participants

What that costs, in the shape of the system rather than dollars:

  No CDN                 a CDN caches files; there are no files
  Stateful servers       you now run and scale a media server
  Per-participant CPU    a 50-person room is 50 inbound streams and
                         up to 2,450 outbound forwards
  TURN relay             10-20% of connections cannot reach each other
                         directly and need a relay you pay bandwidth for

The Socket.IO course covers the signalling half of this — how two peers
exchange SDP offers and ICE candidates before any media flows. This
chapter is about the media half, and the honest summary is: do not
build Tier 3 unless the product is conversational. If people are
watching rather than talking, Tier 1 or 2 is dramatically cheaper.
</code></pre>

<h3>Choosing, in three questions</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Do participants talk to each other?</span><span class="lz-d">If two or more people need to converse, only Tier 3 works — anything above ~500 ms makes conversation stilted, because speakers start talking over each other. If it is one broadcaster and an audience, you are not in Tier 3 no matter how &quot;live&quot; it feels.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Is there a synchronous side channel?</span><span class="lz-d">A live chat, a bidding widget, a poll. If viewers can react to something the moment it happens, a 25-second video delay makes the chat spoil the stream. That pushes you to Tier 2 — not because video needs it, but because the <em>combination</em> does.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">How many concurrent viewers, and how spiky?</span><span class="lz-d">Tier 1 rides a CDN and scales to millions at flat cost. Tier 3 costs per participant and needs capacity planned in advance. A stream that might get 100 or might get 100,000 viewers is a Tier 1 problem; forcing it into WebRTC turns an easy scaling story into a hard one.</span></div>
</div>

<h3>The hybrid that most live-commerce products actually run</h3>
<pre><code class="language-text">  Host (1 person)  ──WebRTC──►  SFU  ──transcode──►  LL-HLS  ──CDN──►  viewers
                                                                        (10,000s)
       ▲                                                                    │
       └──────────────── chat / reactions over WebSocket ◄──────────────────┘

  The host gets Tier 3 latency for their own preview and for guests
  they bring on stage. Viewers get Tier 2 — a few seconds behind, but
  on a CDN, so the audience can be arbitrarily large. Chat runs over a
  separate WebSocket, which is already near-instant.

  The trick is that chat latency and video latency do not have to match
  exactly; they have to be close enough that reactions make sense. Two
  to four seconds of video delay against instant chat is tolerable.
  Twenty-five is not.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — copying the VOD cache headers to a live manifest.</strong> An immutable, year-long <code>Cache-Control</code> on a playlist that changes every two seconds freezes the stream for every viewer while the origin reports perfect health. Curl the manifest twice ten seconds apart and diff — identical output means the cache is wrong.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — reaching for WebRTC because the product says &quot;live&quot;.</strong> WebRTC is for conversation. If the audience is watching rather than talking, it replaces a CDN-scaled, flat-cost system with a stateful per-participant one for latency nobody needed. Ask question 1 above before picking a protocol.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Live video is three unrelated architectures selected by target latency — 15-45 s of HLS on a CDN with no server at all, 2-6 s of LL-HLS with an origin that serves partial segments, or 100-500 ms of WebRTC through a stateful SFU that costs per participant and cannot ride a CDN — and the choice is made by asking whether participants converse, whether a synchronous side channel like chat would spoil a delayed stream, and how spiky the audience is; within Tier 1, latency is dominated by segment length times the player's buffer depth, and the classic outage is copying VOD cache headers onto a live manifest, which freezes the stream while the origin looks healthy.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Apple — Low-Latency HLS</span><span class="lc-sub">developer.apple.com/documentation/http-live-streaming — partial segment và blocking playlist reload.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WebRTC for the Curious</span><span class="lc-sub">webrtcforthecurious.com — sách mở, giải thích SFU và ICE rõ hơn mọi tài liệu chính thức.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — tune zerolatency</span><span class="lc-sub">trac.ffmpeg.org/wiki/StreamingGuide — B-frame, lookahead, và cái giá của việc tắt chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Khoá Socket.IO — Chương 7</span><span class="lc-sub">Phía signalling của WebRTC: trao đổi SDP và ICE candidate trước khi media chảy.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Độ trễ quyết định kiến trúc</h2>
<p class="lead">&quot;Video trực tiếp&quot; mô tả ba hệ thống không liên quan gì tới nhau. Một luồng mà người xem chậm 30 giây, một luồng chậm 5 giây, và một luồng nơi hai người đang nói chuyện với nhau — chúng không dùng chung thành phần nào: khác giao thức, khác server, khác kiểu hỏng, khác chi phí. Sai lầm là chọn công nghệ trước rồi mới phát hiện ra nó kéo theo độ trễ nào. Hãy chọn độ trễ mà sản phẩm cần, và công nghệ gần như đã được xác định.</p>

<h3>Ba bậc</h3>
<pre><code class="language-text">BẬC 1 — 15-45 s        &quot;phát sóng&quot;
  Giao thức:  HLS hoặc DASH với segment 6 giây
  Server:     không gì ngoài object storage + CDN
  Quy mô:     không giới hạn — chỉ là file HTTP trên một CDN
  Chi phí:    rẻ nhất, cách biệt lớn
  Hợp với:    thể thao, hoà nhạc, hội nghị, lễ nhà thờ, bất cứ
              gì một-tới-nhiều mà không ai tương tác

BẬC 2 — 2-6 s          &quot;streaming độ trễ thấp&quot;
  Giao thức:  LL-HLS hoặc LL-DASH với partial segment 1-2 s
  Server:     một origin phục vụ được partial segment
  Quy mô:     vẫn thân thiện CDN, áp lực lên origin nhiều hơn
  Chi phí:    trung bình
  Hợp với:    bán hàng trực tiếp, đấu giá, luồng có chat mà
              &quot;anh ấy vừa nói câu đó&quot; phải khớp đại khái

BẬC 3 — 100-500 ms     &quot;thời gian thực&quot;
  Giao thức:  WebRTC
  Server:     SFU (selective forwarding unit) — một media server
              thật, có trạng thái, ngốn CPU
  Quy mô:     chi phí theo từng người tham gia, KHÔNG đi trên CDN
  Chi phí:    cao nhất, cách một bậc độ lớn
  Hợp với:    cuộc gọi, khám bệnh từ xa, dạy học từ xa, bất cứ
              gì mang tính đối thoại

Không có con đường mượt mà giữa các bậc. Bậc 1 → Bậc 2 là một lần
re-encode và đổi origin. Bậc 2 → Bậc 3 là viết lại.
</code></pre>

<h3>Độ trễ ở Bậc 1 thực sự đến từ đâu</h3>
<pre><code class="language-text">Bộ encode → bộ ghi segment → object storage → CDN → trình phát

  Thu và encode                             ~0,5 s
  Lấp đầy một segment 6 giây                 6,0 s   ← không tránh được:
                                                        một segment không
                                                        công bố được cho
                                                        tới khi nó hoàn tất
  Upload segment lên origin                  ~0,5 s
  CDN kéo về ở request đầu                   ~0,3 s
  Trình phát đệm 3 segment trước khi phát    18,0 s   ← cái lớn nhất
  ──────────────────────────────────────────────────
  Tổng                                      ~25 s

Hai núm vặn, và chúng đánh đổi lẫn nhau:

  Segment ngắn hơn (2 s thay vì 6 s)
    → tổng ~9 s thay vì ~25 s
    → gấp 3 số object và gấp 3 chi phí Class A
    → nhiều lần làm mới manifest hơn, nhiều request tới origin hơn

  Đệm ít segment hơn (1 thay vì 3)
    → ~13 s thay vì ~25 s
    → bất kỳ trục trặc mạng nào cũng thành một lần khựng thấy được

Hầu hết trình phát cho bạn chỉnh bộ đệm; không phải cái nào cũng
cho xuống dưới 3.
</code></pre>

<h3>Tạo một luồng HLS trực tiếp</h3>
<pre><code class="language-bash"># Nhận từ một camera hoặc một cú đẩy RTMP, ghi ra một playlist cuộn.
ffmpeg -i rtmp://ingest.internal/live/streamkey \\
  -c:v libx264 -preset veryfast -tune zerolatency \\
  -g 60 -keyint_min 60 -sc_threshold 0 \\
  -crf 23 -pix_fmt yuv420p \\
  -c:a aac -b:a 128k \\
  -f hls \\
  -hls_time 2 \\
  -hls_list_size 6 \\
  -hls_flags delete_segments+independent_segments \\
  -hls_segment_filename "live/seg-%05d.ts" \\
  live/index.m3u8
</code></pre>

<pre><code class="language-text">Bốn cờ khác với lệnh VOD ở Bài 7.2:

  -tune zerolatency     tắt B-frame và lookahead. Bộ encode thôi đệm
                        các frame tương lai để nén tốt hơn, đổi lại
                        tốn thêm ~10-15% byte và bỏ được một độ trễ
                        nhiều frame.

  -hls_list_size 6      chỉ giữ 6 segment cuối trong playlist.
                        Một playlist trực tiếp là một cửa sổ trượt,
                        không phải một danh sách đầy đủ.

  -hls_flags            xoá những file .ts đã trôi ra khỏi cửa sổ.
    delete_segments     Không có nó, một luồng 24 giờ với segment
                        2 giây để lại 43.200 file trên đĩa.

  (không có -hls_playlist_type vod)
                        cố ý vắng mặt — luồng này thật sự LÀ trực tiếp,
                        nên nó KHÔNG được nhận #EXT-X-ENDLIST.
                        Ngược hẳn với cái bẫy ở Bài 7.2.

  -g 60 cùng -hls_time 2 ở 30 fps
                        keyframe mỗi 60 frame = mỗi 2 s = đúng một cái
                        cho mỗi segment. Cùng luật căn chỉnh với VOD.
</code></pre>

<h3>Luật cache đảo ngược với live</h3>
<pre><code class="language-javascript">// Segment: vẫn bất biến. seg-00042.ts không bao giờ đổi.
cacheControl: 'public, max-age=31536000, immutable'

// Manifest: đổi mỗi 2 giây. Cache nó trong đúng MỘT segment.
cacheControl: 'public, max-age=2'
</code></pre>

<pre><code class="language-text">Đây là sự cố live-streaming phổ biến nhất, và nó không hề tinh vi
một khi bạn đã biết:

  Manifest phục vụ với max-age=31536000 (chép từ cấu hình VOD)
    → CDN ghim playlist từ khoảnh khắc luồng bắt đầu
    → mọi người xem thấy đúng sáu segment đó mãi mãi
    → việc phát dừng sau ~12 giây và không bao giờ tiếp tục
    → origin trông khoẻ mạnh hoàn hảo, vì CDN không bao giờ
      hỏi nó cái gì

Cách vá là một header, và cách bắt được nó trước khi người dùng bắt
là curl cái manifest hai lần, cách nhau mười giây, rồi diff. Nếu
chúng giống hệt nhau, cache đang sai.
</code></pre>

<h3>Chỗ WebRTC trở nên không tránh khỏi</h3>
<pre><code class="language-text">Dưới khoảng 2 giây, việc phát theo segment HTTP thôi hoạt động — bạn
không thể cắt mẩu, upload, phân phối, và đệm một file nhanh hơn thế.
WebRTC là một thiết kế khác về bản chất:

  UDP, không phải TCP    một gói mất thì được che đi, không truyền lại;
                         một gói tới muộn thì dù sao cũng vô dụng
  Kết nối ngang hàng     media chảy giữa hai đầu, có thể qua một relay,
                         không bao giờ dưới dạng file cache được
  SFU cho nhóm           một server nhận luồng của từng người tham gia
                         và chuyển tiếp cho những người còn lại — có
                         trạng thái, và chi phí co giãn theo số người

Cái đó tốn gì, xét theo hình dạng hệ thống chứ không phải theo đô la:

  Không CDN              CDN cache file; ở đây không có file nào
  Server có trạng thái   giờ bạn phải chạy và scale một media server
  CPU theo người tham gia một phòng 50 người là 50 luồng vào và tới
                         2.450 lượt chuyển tiếp ra
  TURN relay             10-20% kết nối không tới nhau trực tiếp được và
                         cần một relay mà bạn trả tiền băng thông

Khoá Socket.IO nói về nửa signalling của chuyện này — cách hai peer
trao đổi SDP offer và ICE candidate trước khi media chảy. Chương này
nói về nửa media, và bản tóm tắt trung thực là: đừng dựng Bậc 3 trừ
khi sản phẩm mang tính đối thoại. Nếu người ta đang xem chứ không
phải đang nói, Bậc 1 hoặc 2 rẻ hơn rất nhiều.
</code></pre>

<h3>Chọn, bằng ba câu hỏi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Người tham gia có nói chuyện với nhau không?</span><span class="lz-d">Nếu từ hai người trở lên cần đối thoại, chỉ Bậc 3 chạy được — bất cứ gì trên ~500 ms làm cuộc trò chuyện trở nên gượng gạo, vì người nói bắt đầu chồng lời lên nhau. Nếu là một người phát và một khán giả, bạn không ở Bậc 3 dù cảm giác &quot;trực tiếp&quot; tới đâu.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có một kênh phụ đồng bộ không?</span><span class="lz-d">Một khung chat trực tiếp, một widget đấu giá, một cuộc bình chọn. Nếu người xem phản ứng được với một việc ngay khoảnh khắc nó xảy ra, thì độ trễ video 25 giây khiến chat làm lộ trước nội dung luồng. Điều đó đẩy bạn tới Bậc 2 — không phải vì video cần, mà vì <em>sự kết hợp</em> cần.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bao nhiêu người xem đồng thời, và biến động tới đâu?</span><span class="lz-d">Bậc 1 đi trên CDN và co giãn tới hàng triệu với chi phí phẳng. Bậc 3 tốn tiền theo từng người tham gia và cần hoạch định dung lượng trước. Một luồng có thể có 100 hoặc có thể có 100.000 người xem là một bài toán Bậc 1; ép nó vào WebRTC là biến một câu chuyện scale dễ thành một câu chuyện khó.</span></div>
</div>

<h3>Mô hình lai mà hầu hết sản phẩm bán hàng trực tiếp thực sự chạy</h3>
<pre><code class="language-text">  Host (1 người)  ──WebRTC──►  SFU  ──transcode──►  LL-HLS  ──CDN──►  người xem
                                                                        (hàng chục nghìn)
       ▲                                                                    │
       └──────────── chat / cảm xúc qua WebSocket ◄─────────────────────────┘

  Host được độ trễ Bậc 3 cho bản xem trước của chính mình và cho những
  khách mời họ đưa lên sân khấu. Người xem được Bậc 2 — chậm vài giây,
  nhưng ở trên CDN, nên khán giả có thể lớn tuỳ ý. Chat chạy qua một
  WebSocket riêng, vốn đã gần như tức thì.

  Mẹo ở chỗ độ trễ chat và độ trễ video không cần khớp nhau chính xác;
  chúng chỉ cần đủ gần để những phản ứng còn có nghĩa. Hai tới bốn giây
  video trễ so với chat tức thì là chịu được. Hai mươi lăm giây thì không.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — chép header cache của VOD sang một manifest trực tiếp.</strong> Một <code>Cache-Control</code> bất biến dài một năm đặt lên một playlist đổi mỗi hai giây sẽ đóng băng luồng với mọi người xem trong khi origin báo cáo sức khoẻ hoàn hảo. Hãy curl manifest hai lần cách nhau mười giây rồi diff — output giống hệt nhau nghĩa là cache đang sai.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — với tới WebRTC vì sản phẩm ghi chữ &quot;trực tiếp&quot;.</strong> WebRTC là dành cho đối thoại. Nếu khán giả đang xem chứ không phải đang nói, nó thay một hệ thống co giãn theo CDN với chi phí phẳng bằng một hệ thống có trạng thái tính theo từng người, để lấy một độ trễ không ai cần. Hãy hỏi câu số 1 ở trên trước khi chọn giao thức.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Video trực tiếp là ba kiến trúc không liên quan, được chọn bởi độ trễ mục tiêu — 15-45 s của HLS trên CDN không cần server nào, 2-6 s của LL-HLS với một origin phục vụ partial segment, hoặc 100-500 ms của WebRTC qua một SFU có trạng thái vốn tính tiền theo từng người tham gia và không đi được trên CDN — và lựa chọn được đưa ra bằng cách hỏi người tham gia có đối thoại không, một kênh phụ đồng bộ như chat có làm hỏng một luồng bị trễ không, và khán giả biến động tới đâu; trong Bậc 1, độ trễ bị chi phối bởi độ dài segment nhân với độ sâu bộ đệm của trình phát, và sự cố kinh điển là chép header cache của VOD lên một manifest trực tiếp, thứ đóng băng luồng trong khi origin trông vẫn khoẻ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Apple — Low-Latency HLS</span><span class="lc-sub">developer.apple.com/documentation/http-live-streaming — partial segment và blocking playlist reload.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WebRTC for the Curious</span><span class="lc-sub">webrtcforthecurious.com — sách mở, giải thích SFU và ICE rõ hơn mọi tài liệu chính thức.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — tune zerolatency</span><span class="lc-sub">trac.ffmpeg.org/wiki/StreamingGuide — B-frame, lookahead, và cái giá của việc tắt chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Khoá Socket.IO — Chương 7</span><span class="lc-sub">Phía signalling của WebRTC: trao đổi SDP và ICE candidate trước khi media chảy.</span></span></div>
</div>
`,
    },

    {
      title: '8.2 — Chapter 8 quiz|||8.2 — Kiểm tra Chương 8',
      slug: 'mp-8-2-quiz',
      type: 'QUIZ',
      description: 'Ba câu về độ trễ, live HLS, và cache.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 8 · Quiz</span><h2>What Chapter 8 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 8 · Kiểm tra</span><h2>Chương 8 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 300,
        questions: [
          {
            question: 'A live stream plays for about 12 seconds for every viewer and then stops. The origin reports no errors. Cause?|||Một luồng trực tiếp phát được khoảng 12 giây với mọi người xem rồi dừng. Origin không báo lỗi nào. Nguyên nhân?',
            options: [
              'The manifest was served with the VOD cache headers (immutable, max-age=31536000), so the CDN pinned the playlist from stream start and every viewer sees the same six segments forever. The origin looks healthy precisely because the CDN never asks it for anything. Serve live manifests with max-age matching one segment (~2 s); verify by curling the manifest twice ten seconds apart and diffing.|||Manifest được phục vụ với header cache của VOD (immutable, max-age=31536000), nên CDN ghim playlist từ lúc luồng bắt đầu và mọi người xem thấy đúng sáu segment đó mãi mãi. Origin trông khoẻ chính vì CDN không bao giờ hỏi nó cái gì. Hãy phục vụ manifest trực tiếp với max-age bằng một segment (~2 s); xác minh bằng cách curl manifest hai lần cách nhau mười giây rồi diff.',
              'The encoder crashed after 12 seconds|||Bộ encode chết sau 12 giây',
              'hls_list_size is too large|||hls_list_size quá lớn',
              'The segments are being deleted too early|||Segment bị xoá quá sớm',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A live-commerce product wants viewers to react in chat as the host demonstrates. Which tier, and why not the others?|||Một sản phẩm bán hàng trực tiếp muốn người xem phản ứng trong chat khi host demo. Bậc nào, và vì sao không phải các bậc kia?',
            options: [
              'Tier 2 (LL-HLS, 2-6 s). Not Tier 1, because a 25-second video delay against instant chat means the chat spoils the stream. Not Tier 3, because the audience is watching rather than conversing — WebRTC would replace a CDN-scaled flat-cost system with a stateful per-participant one for latency nobody needs. Most such products run a hybrid: host on WebRTC into an SFU, viewers on LL-HLS via CDN.|||Bậc 2 (LL-HLS, 2-6 s). Không phải Bậc 1, vì độ trễ video 25 giây so với chat tức thì khiến chat làm lộ trước nội dung luồng. Không phải Bậc 3, vì khán giả đang xem chứ không đối thoại — WebRTC sẽ thay một hệ co giãn theo CDN chi phí phẳng bằng một hệ có trạng thái tính theo từng người, để lấy độ trễ không ai cần. Hầu hết sản phẩm loại này chạy mô hình lai: host qua WebRTC vào một SFU, người xem qua LL-HLS trên CDN.',
              'Tier 3 (WebRTC) — anything "live" needs real-time|||Bậc 3 (WebRTC) — bất cứ gì "trực tiếp" đều cần thời gian thực',
              'Tier 1 (standard HLS) — cheapest is always right|||Bậc 1 (HLS chuẩn) — rẻ nhất thì luôn đúng',
              'None — use a plain progressive MP4|||Không bậc nào — dùng MP4 progressive thường',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'What differs between the VOD HLS command in Lesson 7.2 and a live one?|||Lệnh HLS cho VOD ở Bài 7.2 khác lệnh cho live ở chỗ nào?',
            options: [
              'Live adds -tune zerolatency (drops B-frames/lookahead), -hls_list_size to make the playlist a sliding window, and delete_segments so a 24-hour stream does not leave 43,200 files — and it deliberately OMITS -hls_playlist_type vod, because this stream really is live and must not get #EXT-X-ENDLIST. That omission is the exact inverse of the Lesson 7.2 pitfall.|||Live thêm -tune zerolatency (bỏ B-frame/lookahead), -hls_list_size để playlist thành một cửa sổ trượt, và delete_segments để một luồng 24 giờ không để lại 43.200 file — và nó cố ý BỎ -hls_playlist_type vod, vì luồng này thật sự là trực tiếp và không được nhận #EXT-X-ENDLIST. Việc bỏ đó là nghịch đảo chính xác của cái bẫy ở Bài 7.2.',
              'Nothing — the same command works for both|||Không gì — cùng một lệnh chạy cho cả hai',
              'Live requires a different codec|||Live đòi một codec khác',
              'Live cannot use keyframe alignment|||Live không dùng được căn keyframe',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
